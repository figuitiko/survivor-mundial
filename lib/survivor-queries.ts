import { ChallengeState, SurvivorStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { formatKickoff } from "@/lib/survivor";
import { getRequiredSession } from "@/lib/auth";
import { formatChallengeDifficulty, getChallengeState } from "@/lib/challenges";

export async function getCurrentUserOrThrow() {
  const session = await getRequiredSession();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new Error(`User record missing for ${session.user.email}.`);
  }

  return user;
}

export async function getCurrentMatchday() {
  return prisma.matchday.findFirst({
    where: { settledAt: null },
    orderBy: { order: "asc" },
    include: {
      matches: {
        orderBy: { kickoffAt: "asc" }
      }
    }
  });
}

export async function getPicksPageData() {
  const user = await getCurrentUserOrThrow();
  const currentMatchday = await getCurrentMatchday();

  const [usedTeams, pickHistory, currentPick] = await Promise.all([
    prisma.pick.findMany({
      where: { userId: user.id },
      orderBy: [{ matchday: { order: "asc" } }],
      select: {
        id: true,
        selectedTeam: true,
        outcome: true,
        matchday: { select: { title: true, order: true } }
      }
    }),
    prisma.pick.findMany({
      where: { userId: user.id },
      orderBy: [{ matchday: { order: "desc" } }],
      include: {
        match: true,
        matchday: true
      }
    }),
    currentMatchday
      ? prisma.pick.findUnique({
          where: {
            userId_matchdayId: {
              userId: user.id,
              matchdayId: currentMatchday.id
            }
          }
        })
      : null
  ]);

  return {
    user,
    currentMatchday,
    currentPick,
    usedTeams: usedTeams.map((pick) => ({
      id: pick.id,
      team: pick.selectedTeam,
      matchday: `MD${pick.matchday.order}`,
      outcome: pick.outcome
    })),
    pickHistory: pickHistory.map((pick) => ({
      id: pick.id,
      matchday: pick.matchday.title,
      selectedTeam: pick.selectedTeam,
      opponent:
        pick.selectedTeam === pick.match.homeTeam ? pick.match.awayTeam : pick.match.homeTeam,
      kickoff: formatKickoff(pick.match.kickoffAt),
      outcome: pick.outcome,
      pointsAwarded: pick.pointsAwarded
    }))
  };
}

export async function getDashboardData() {
  const user = await getCurrentUserOrThrow();
  const currentMatchday = await getCurrentMatchday();

  const [aliveCount, leaderboardRowsRaw, recentPicks, userStats, recentBadges, featuredChallenge] =
    await Promise.all([
      prisma.user.count({ where: { survivorStatus: SurvivorStatus.ALIVE } }),
      prisma.user.findMany({
        include: {
          stats: true
        }
      }),
      prisma.pick.findMany({
        where: { userId: user.id },
        orderBy: [{ matchday: { order: "desc" } }],
        take: 4,
        include: {
          match: true,
          matchday: true
        }
      }),
      prisma.userStats.findUnique({
        where: { userId: user.id }
      }),
      prisma.userBadge.findMany({
        where: { userId: user.id },
        include: { badge: true },
        orderBy: { awardedAt: "desc" },
        take: 3
      }),
      prisma.challenge.findFirst({
        where: { settledAt: null },
        orderBy: [{ matchday: { order: "asc" } }, { lockAt: "asc" }],
        include: {
          options: {
            orderBy: { sortOrder: "asc" }
          },
          answers: {
            where: { userId: user.id },
            include: { challengeOption: true }
          },
          _count: {
            select: { answers: true }
          }
        }
      })
    ]);

  const leaderboardRows = leaderboardRowsRaw
    .sort((left, right) => {
      if (left.survivorStatus !== right.survivorStatus) {
        return left.survivorStatus === SurvivorStatus.ALIVE ? -1 : 1;
      }

      if (left.currentStreak !== right.currentStreak) {
        return right.currentStreak - left.currentStreak;
      }

      const leftTotal = left.survivorPoints + left.challengeBonusPoints;
      const rightTotal = right.survivorPoints + right.challengeBonusPoints;

      if (leftTotal !== rightTotal) {
        return rightTotal - leftTotal;
      }

      if (left.longestStreak !== right.longestStreak) {
        return right.longestStreak - left.longestStreak;
      }

      return left.name.localeCompare(right.name);
    })
    .slice(0, 5);

  return {
    user,
    totalStandingPoints: user.survivorPoints + user.challengeBonusPoints,
    userStats,
    currentMatchday,
    aliveCount,
    leaderboardRows,
    featuredChallenge: featuredChallenge
      ? {
          id: featuredChallenge.id,
          title: featuredChallenge.title,
          description: featuredChallenge.description,
          reward: `+${featuredChallenge.bonusPoints} bonus points`,
          difficulty: formatChallengeDifficulty(featuredChallenge.difficulty),
          deadline: formatKickoff(featuredChallenge.lockAt),
          joined: Boolean(featuredChallenge.answers[0]),
          state: (
            featuredChallenge.state === ChallengeState.SETTLED
              ? featuredChallenge.state
              : getChallengeState(featuredChallenge.lockAt, featuredChallenge.settledAt)
          ) as "OPEN" | "LOCKED" | "SETTLED",
          answerLabel: featuredChallenge.answers[0]?.challengeOption.label ?? null,
          joinCount: featuredChallenge._count.answers
        }
      : null,
    recentBadges: recentBadges.map((userBadge) => ({
      id: userBadge.id,
      slug: userBadge.badge.slug,
      title: userBadge.badge.title,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon,
      category: userBadge.badge.category,
      awardedAt: userBadge.awardedAt.toISOString()
    })),
    recentPicks: recentPicks.map((pick) => ({
      id: pick.id,
      matchday: pick.matchday.title,
      selectedTeam: pick.selectedTeam,
      opponent:
        pick.selectedTeam === pick.match.homeTeam ? pick.match.awayTeam : pick.match.homeTeam,
      kickoff: formatKickoff(pick.match.kickoffAt),
      outcome: pick.outcome,
      pointsAwarded: pick.pointsAwarded
    }))
  };
}

export async function getLeaderboardData() {
  const [user, rows] = await Promise.all([
    getCurrentUserOrThrow(),
    prisma.user.findMany({
      include: {
        stats: true
      }
    })
  ]);

  const sortedRows = rows.sort((left, right) => {
    if (left.survivorStatus !== right.survivorStatus) {
      return left.survivorStatus === SurvivorStatus.ALIVE ? -1 : 1;
    }

    if (left.currentStreak !== right.currentStreak) {
      return right.currentStreak - left.currentStreak;
    }

    const leftTotal = left.survivorPoints + left.challengeBonusPoints;
    const rightTotal = right.survivorPoints + right.challengeBonusPoints;

    if (leftTotal !== rightTotal) {
      return rightTotal - leftTotal;
    }

    if (left.longestStreak !== right.longestStreak) {
      return right.longestStreak - left.longestStreak;
    }

    return left.name.localeCompare(right.name);
  });

  return sortedRows.map((row, index) => ({
    rank: index + 1,
    player: row.name,
    nation: row.favoriteNation ?? "N/A",
    streak: row.currentStreak,
    points: row.survivorPoints + row.challengeBonusPoints,
    challengeBonusPoints: row.challengeBonusPoints,
    challengeStreak: row.stats?.currentChallengeStreak ?? 0,
    badgesUnlocked: row.stats?.badgesUnlocked ?? 0,
    longestStreak: row.stats?.longestSurvivalStreak ?? row.longestStreak,
    status: row.survivorStatus,
    isCurrentUser: row.id === user.id
  }));
}

export async function getSurvivorStandingsSnapshot() {
  const users = await prisma.user.findMany({
    orderBy: [
      { survivorStatus: "asc" },
      { currentStreak: "desc" },
      { survivorPoints: "desc" },
      { longestStreak: "desc" },
      { name: "asc" }
    ]
  });

  return {
    totalPlayers: users.length,
    alivePlayers: users.filter((user) => user.survivorStatus === SurvivorStatus.ALIVE).length,
    users
  };
}

export async function getProfileData() {
  const user = await getCurrentUserOrThrow();

  const [stats, badges] = await Promise.all([
    prisma.userStats.findUnique({
      where: { userId: user.id }
    }),
    prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true },
      orderBy: { awardedAt: "desc" }
    })
  ]);

  return {
    profile: {
      name: user.name,
      username: user.username,
      favoriteNation: user.favoriteNation ?? "",
      bio: user.bio ?? "",
      streakGoal: user.streakGoal
    },
    user,
    stats: stats
      ? {
          totalPicks: stats.totalPicks,
          settledPicks: stats.settledPicks,
          survivorWins: stats.survivorWins,
          survivorLosses: stats.survivorLosses,
          totalChallengeAnswers: stats.totalChallengeAnswers,
          correctChallengeAnswers: stats.correctChallengeAnswers,
          currentSurvivalStreak: stats.currentSurvivalStreak,
          longestSurvivalStreak: stats.longestSurvivalStreak,
          currentChallengeStreak: stats.currentChallengeStreak,
          longestChallengeStreak: stats.longestChallengeStreak,
          totalPoints: stats.totalPoints,
          totalBonusPoints: stats.totalBonusPoints,
          badgesUnlocked: stats.badgesUnlocked
        }
      : null,
    badges: badges.map((userBadge) => ({
      id: userBadge.id,
      slug: userBadge.badge.slug,
      title: userBadge.badge.title,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon,
      category: userBadge.badge.category,
      awardedAt: userBadge.awardedAt.toISOString()
    }))
  };
}

export { SurvivorStatus };
