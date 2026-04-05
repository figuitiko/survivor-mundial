import {
  BadgeCategory,
  PickOutcome,
  SurvivorStatus
} from "@/generated/prisma/enums";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

const BADGE_DEFINITIONS = [
  {
    slug: "survivor-first-blood",
    title: "First Blood",
    description: "Win your first settled survivor pick.",
    icon: "Shield",
    category: BadgeCategory.SURVIVAL
  },
  {
    slug: "survivor-streak-3",
    title: "Three Alive",
    description: "Reach a 3-match survivor streak.",
    icon: "Flame",
    category: BadgeCategory.SURVIVAL
  },
  {
    slug: "challenge-streak-3",
    title: "Stat Sniper",
    description: "Hit a 3-challenge correct streak.",
    icon: "Target",
    category: BadgeCategory.CHALLENGE
  },
  {
    slug: "bonus-hunter-50",
    title: "Bonus Hunter",
    description: "Collect 50 challenge bonus points.",
    icon: "Gem",
    category: BadgeCategory.CHALLENGE
  },
  {
    slug: "double-threat-300",
    title: "Double Threat",
    description: "Reach 300 total standing points.",
    icon: "Trophy",
    category: BadgeCategory.MILESTONE
  },
  {
    slug: "still-standing",
    title: "Still Standing",
    description: "Stay alive through at least 2 settled matchdays.",
    icon: "Sparkles",
    category: BadgeCategory.MILESTONE
  }
] as const;

function computeLongestWinStreak(outcomes: PickOutcome[]) {
  let longest = 0;
  let current = 0;

  for (const outcome of outcomes) {
    if (outcome === PickOutcome.WON) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function computeCurrentWinStreak(outcomes: PickOutcome[]) {
  let current = 0;

  for (let index = outcomes.length - 1; index >= 0; index -= 1) {
    if (outcomes[index] === PickOutcome.WON) {
      current += 1;
      continue;
    }

    break;
  }

  return current;
}

function computeLongestBooleanStreak(values: boolean[]) {
  let longest = 0;
  let current = 0;

  for (const value of values) {
    if (value) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function computeCurrentBooleanStreak(values: boolean[]) {
  let current = 0;

  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index]) {
      current += 1;
      continue;
    }

    break;
  }

  return current;
}

export async function ensureBadgeCatalog(db: DbClient) {
  for (const badge of BADGE_DEFINITIONS) {
    await db.badge.upsert({
      where: { slug: badge.slug },
      update: {
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        category: badge.category
      },
      create: badge
    });
  }
}

export async function recalculateUserStats(db: DbClient, userId: string) {
  const [user, picks, challengeAnswers] = await Promise.all([
    db.user.findUnique({
      where: { id: userId }
    }),
    db.pick.findMany({
      where: { userId },
      orderBy: [{ matchday: { order: "asc" } }]
    }),
    db.challengeAnswer.findMany({
      where: { userId },
      orderBy: [
        { challenge: { matchday: { order: "asc" } } },
        { submittedAt: "asc" }
      ],
      include: {
        challenge: true
      }
    })
  ]);

  if (!user) {
    throw new Error("User not found for stat recalculation.");
  }

  const settledPicks = picks.filter((pick) => pick.outcome !== PickOutcome.PENDING);
  const settledPickOutcomes = settledPicks.map((pick) => pick.outcome);
  const survivorWins = settledPicks.filter((pick) => pick.outcome === PickOutcome.WON).length;
  const survivorLosses = settledPicks.filter(
    (pick) => pick.outcome === PickOutcome.LOST || pick.outcome === PickOutcome.MISSED
  ).length;
  const totalSurvivorPoints = settledPicks.reduce(
    (sum, pick) => sum + pick.pointsAwarded,
    0
  );

  const settledChallengeAnswers = challengeAnswers.filter((answer) => answer.settledAt);
  const challengeCorrectness = settledChallengeAnswers.map((answer) => Boolean(answer.isCorrect));
  const correctChallengeAnswers = settledChallengeAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const totalBonusPoints = settledChallengeAnswers.reduce(
    (sum, answer) => sum + answer.bonusPointsAwarded,
    0
  );

  const eliminationPick = settledPicks.find(
    (pick) => pick.outcome === PickOutcome.LOST || pick.outcome === PickOutcome.MISSED
  );

  const survivorStatus = eliminationPick
    ? SurvivorStatus.ELIMINATED
    : SurvivorStatus.ALIVE;

  await db.user.update({
    where: { id: userId },
    data: {
      survivorPoints: totalSurvivorPoints,
      challengeBonusPoints: totalBonusPoints,
      currentStreak:
        survivorStatus === SurvivorStatus.ALIVE
          ? computeCurrentWinStreak(settledPickOutcomes)
          : 0,
      longestStreak: computeLongestWinStreak(settledPickOutcomes),
      survivorStatus,
      eliminatedAt: eliminationPick?.settledAt ?? null
    }
  });

  const badgeCount = await db.userBadge.count({
    where: { userId }
  });

  await db.userStats.upsert({
    where: { userId },
    update: {
      totalPicks: picks.length,
      settledPicks: settledPicks.length,
      survivorWins,
      survivorLosses,
      totalChallengeAnswers: challengeAnswers.length,
      correctChallengeAnswers,
      currentSurvivalStreak:
        survivorStatus === SurvivorStatus.ALIVE
          ? computeCurrentWinStreak(settledPickOutcomes)
          : 0,
      longestSurvivalStreak: computeLongestWinStreak(settledPickOutcomes),
      currentChallengeStreak: computeCurrentBooleanStreak(challengeCorrectness),
      longestChallengeStreak: computeLongestBooleanStreak(challengeCorrectness),
      totalPoints: totalSurvivorPoints + totalBonusPoints,
      totalBonusPoints,
      badgesUnlocked: badgeCount
    },
    create: {
      userId,
      totalPicks: picks.length,
      settledPicks: settledPicks.length,
      survivorWins,
      survivorLosses,
      totalChallengeAnswers: challengeAnswers.length,
      correctChallengeAnswers,
      currentSurvivalStreak:
        survivorStatus === SurvivorStatus.ALIVE
          ? computeCurrentWinStreak(settledPickOutcomes)
          : 0,
      longestSurvivalStreak: computeLongestWinStreak(settledPickOutcomes),
      currentChallengeStreak: computeCurrentBooleanStreak(challengeCorrectness),
      longestChallengeStreak: computeLongestBooleanStreak(challengeCorrectness),
      totalPoints: totalSurvivorPoints + totalBonusPoints,
      totalBonusPoints,
      badgesUnlocked: badgeCount
    }
  });
}

export async function awardBadgesForUser(db: DbClient, userId: string) {
  await ensureBadgeCatalog(db);

  const [user, stats, badges] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.userStats.findUnique({ where: { userId } }),
    db.badge.findMany()
  ]);

  if (!user || !stats) {
    throw new Error("User or user stats missing for badge awards.");
  }

  const earnedBadgeSlugs: string[] = [];

  if (stats.survivorWins >= 1) {
    earnedBadgeSlugs.push("survivor-first-blood");
  }

  if (stats.longestSurvivalStreak >= 3) {
    earnedBadgeSlugs.push("survivor-streak-3");
  }

  if (stats.longestChallengeStreak >= 3) {
    earnedBadgeSlugs.push("challenge-streak-3");
  }

  if (stats.totalBonusPoints >= 50) {
    earnedBadgeSlugs.push("bonus-hunter-50");
  }

  if (stats.totalPoints >= 300) {
    earnedBadgeSlugs.push("double-threat-300");
  }

  if (user.survivorStatus === SurvivorStatus.ALIVE && stats.survivorWins >= 2) {
    earnedBadgeSlugs.push("still-standing");
  }

  const badgeIds = badges
    .filter((badge) => earnedBadgeSlugs.includes(badge.slug))
    .map((badge) => ({ userId, badgeId: badge.id }));

  if (badgeIds.length > 0) {
    await db.userBadge.createMany({
      data: badgeIds,
      skipDuplicates: true
    });
  }

  const updatedBadgeCount = await db.userBadge.count({
    where: { userId }
  });

  await db.userStats.update({
    where: { userId },
    data: {
      badgesUnlocked: updatedBadgeCount
    }
  });

  return db.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { awardedAt: "desc" }
  });
}
