import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  ChallengeDifficulty,
  ChallengeState,
  ChallengeType,
  MatchStatus,
  PickOutcome,
  PrismaClient,
  SurvivorStatus
} from "../generated/prisma/client";
import {
  awardBadgesForUser,
  ensureBadgeCatalog,
  recalculateUserStats
} from "../lib/gamification";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "camila@example.com" },
      update: {
        survivorPoints: 200,
        challengeBonusPoints: 40,
        currentStreak: 2,
        longestStreak: 2,
        survivorStatus: SurvivorStatus.ALIVE
      },
      create: {
        email: "camila@example.com",
        name: "Camila Reyes",
        username: "camila",
        favoriteNation: "Mexico",
        bio: "Trusts tempo, travel, and midfield control.",
        streakGoal: 9,
        survivorPoints: 200,
        challengeBonusPoints: 40,
        currentStreak: 2,
        longestStreak: 2,
        survivorStatus: SurvivorStatus.ALIVE
      }
    }),
    prisma.user.upsert({
      where: { email: "iker@example.com" },
      update: {
        survivorPoints: 200,
        challengeBonusPoints: 20,
        currentStreak: 2,
        longestStreak: 2,
        survivorStatus: SurvivorStatus.ALIVE
      },
      create: {
        email: "iker@example.com",
        name: "Iker Torres",
        username: "iker",
        favoriteNation: "Spain",
        bio: "Chases compact defenses and matchup geometry.",
        streakGoal: 8,
        survivorPoints: 200,
        challengeBonusPoints: 20,
        currentStreak: 2,
        longestStreak: 2,
        survivorStatus: SurvivorStatus.ALIVE
      }
    }),
    prisma.user.upsert({
      where: { email: "frank@example.com" },
      update: {
        survivorPoints: 200,
        challengeBonusPoints: 40,
        currentStreak: 2,
        longestStreak: 2,
        survivorStatus: SurvivorStatus.ALIVE
      },
      create: {
        email: "frank@example.com",
        name: "Frank Ortega",
        username: "frankplayssurvivor",
        favoriteNation: "Mexico",
        bio: "Tracking survivor edges through venue splits, tempo, and squad rotation.",
        streakGoal: 10,
        survivorPoints: 200,
        challengeBonusPoints: 40,
        currentStreak: 2,
        longestStreak: 2,
        survivorStatus: SurvivorStatus.ALIVE
      }
    }),
    prisma.user.upsert({
      where: { email: "mara@example.com" },
      update: {
        survivorPoints: 100,
        challengeBonusPoints: 0,
        currentStreak: 0,
        longestStreak: 1,
        survivorStatus: SurvivorStatus.ELIMINATED,
        eliminatedAt: new Date("2026-06-20T23:00:00.000Z")
      },
      create: {
        email: "mara@example.com",
        name: "Mara Vega",
        username: "mara",
        favoriteNation: "Argentina",
        bio: "Leans on shot quality and defensive transitions.",
        streakGoal: 8,
        survivorPoints: 100,
        challengeBonusPoints: 0,
        currentStreak: 0,
        longestStreak: 1,
        survivorStatus: SurvivorStatus.ELIMINATED,
        eliminatedAt: new Date("2026-06-20T23:00:00.000Z")
      }
    })
  ]);

  const userByEmail = new Map(users.map((user) => [user.email, user]));

  const matchday1 = await prisma.matchday.upsert({
    where: { slug: "group-stage-matchday-1" },
    update: {
      order: 1,
      title: "Group Stage Matchday 1",
      closesAt: new Date("2026-06-16T17:30:00.000Z"),
      settledAt: new Date("2026-06-17T03:00:00.000Z")
    },
    create: {
      slug: "group-stage-matchday-1",
      order: 1,
      title: "Group Stage Matchday 1",
      closesAt: new Date("2026-06-16T17:30:00.000Z"),
      settledAt: new Date("2026-06-17T03:00:00.000Z")
    }
  });

  const matchday2 = await prisma.matchday.upsert({
    where: { slug: "group-stage-matchday-2" },
    update: {
      order: 2,
      title: "Group Stage Matchday 2",
      closesAt: new Date("2026-06-20T18:30:00.000Z"),
      settledAt: new Date("2026-06-20T23:30:00.000Z")
    },
    create: {
      slug: "group-stage-matchday-2",
      order: 2,
      title: "Group Stage Matchday 2",
      closesAt: new Date("2026-06-20T18:30:00.000Z"),
      settledAt: new Date("2026-06-20T23:30:00.000Z")
    }
  });

  const matchday3 = await prisma.matchday.upsert({
    where: { slug: "quarterfinal-matchday" },
    update: {
      order: 3,
      title: "Quarterfinal Matchday",
      closesAt: new Date("2026-06-24T19:00:00.000Z"),
      settledAt: null
    },
    create: {
      slug: "quarterfinal-matchday",
      order: 3,
      title: "Quarterfinal Matchday",
      closesAt: new Date("2026-06-24T19:00:00.000Z"),
      settledAt: null
    }
  });

  const matches = await Promise.all([
    prisma.match.upsert({
      where: { externalId: "md1-mex-jpn" },
      update: {
        matchdayId: matchday1.id,
        homeTeam: "Mexico",
        awayTeam: "Japan",
        venue: "Houston",
        kickoffAt: new Date("2026-06-16T18:00:00.000Z"),
        status: MatchStatus.FINAL,
        winner: "Mexico"
      },
      create: {
        externalId: "md1-mex-jpn",
        matchdayId: matchday1.id,
        homeTeam: "Mexico",
        awayTeam: "Japan",
        venue: "Houston",
        kickoffAt: new Date("2026-06-16T18:00:00.000Z"),
        status: MatchStatus.FINAL,
        winner: "Mexico"
      }
    }),
    prisma.match.upsert({
      where: { externalId: "md2-bra-col" },
      update: {
        matchdayId: matchday2.id,
        homeTeam: "Brazil",
        awayTeam: "Colombia",
        venue: "Los Angeles",
        kickoffAt: new Date("2026-06-20T19:00:00.000Z"),
        status: MatchStatus.FINAL,
        winner: "Brazil"
      },
      create: {
        externalId: "md2-bra-col",
        matchdayId: matchday2.id,
        homeTeam: "Brazil",
        awayTeam: "Colombia",
        venue: "Los Angeles",
        kickoffAt: new Date("2026-06-20T19:00:00.000Z"),
        status: MatchStatus.FINAL,
        winner: "Brazil"
      }
    }),
    prisma.match.upsert({
      where: { externalId: "md3-arg-uru" },
      update: {
        matchdayId: matchday3.id,
        homeTeam: "Argentina",
        awayTeam: "Uruguay",
        venue: "Monterrey",
        kickoffAt: new Date("2026-06-24T19:00:00.000Z"),
        status: MatchStatus.SCHEDULED,
        winner: null
      },
      create: {
        externalId: "md3-arg-uru",
        matchdayId: matchday3.id,
        homeTeam: "Argentina",
        awayTeam: "Uruguay",
        venue: "Monterrey",
        kickoffAt: new Date("2026-06-24T19:00:00.000Z"),
        status: MatchStatus.SCHEDULED,
        winner: null
      }
    }),
    prisma.match.upsert({
      where: { externalId: "md3-fra-por" },
      update: {
        matchdayId: matchday3.id,
        homeTeam: "France",
        awayTeam: "Portugal",
        venue: "CDMX",
        kickoffAt: new Date("2026-06-24T22:00:00.000Z"),
        status: MatchStatus.SCHEDULED,
        winner: null
      },
      create: {
        externalId: "md3-fra-por",
        matchdayId: matchday3.id,
        homeTeam: "France",
        awayTeam: "Portugal",
        venue: "CDMX",
        kickoffAt: new Date("2026-06-24T22:00:00.000Z"),
        status: MatchStatus.SCHEDULED,
        winner: null
      }
    })
  ]);

  const matchByExternalId = new Map(
    matches
      .filter((match) => match.externalId)
      .map((match) => [match.externalId as string, match])
  );

  const challengeSeeds = [
    {
      slug: "matchday-2-btts",
      matchdayId: matchday2.id,
      matchId: matchByExternalId.get("md2-bra-col")?.id,
      title: "Brazil vs Colombia: both teams score",
      description: "Will both teams score in Brazil vs Colombia?",
      type: ChallengeType.BOTH_TEAMS_SCORE,
      difficulty: ChallengeDifficulty.MEDIUM,
      bonusPoints: 20,
      lockAt: new Date("2026-06-20T18:45:00.000Z"),
      state: ChallengeState.SETTLED,
      settledAt: new Date("2026-06-20T23:40:00.000Z"),
      options: [
        { label: "Yes", value: "yes", sortOrder: 0, isCorrect: false },
        { label: "No", value: "no", sortOrder: 1, isCorrect: true }
      ],
      answers: [
        { userEmail: "camila@example.com", value: "no", bonusPointsAwarded: 20, isCorrect: true },
        { userEmail: "iker@example.com", value: "yes", bonusPointsAwarded: 0, isCorrect: false },
        { userEmail: "frank@example.com", value: "no", bonusPointsAwarded: 20, isCorrect: true }
      ]
    },
    {
      slug: "quarterfinal-goal-frenzy",
      matchdayId: matchday3.id,
      matchId: null,
      title: "Quarterfinal goal frenzy",
      description: "Which quarterfinal finishes with the most total goals?",
      type: ChallengeType.MATCH_WITH_MOST_GOALS,
      difficulty: ChallengeDifficulty.HIGH,
      bonusPoints: 40,
      lockAt: new Date("2026-06-24T18:40:00.000Z"),
      state: ChallengeState.OPEN,
      settledAt: null,
      options: [
        { label: "Argentina vs Uruguay", value: "arg-uru", sortOrder: 0, isCorrect: false },
        { label: "France vs Portugal", value: "fra-por", sortOrder: 1, isCorrect: false }
      ],
      answers: [
        { userEmail: "camila@example.com", value: "arg-uru", bonusPointsAwarded: 0, isCorrect: null },
        { userEmail: "frank@example.com", value: "fra-por", bonusPointsAwarded: 0, isCorrect: null }
      ]
    }
  ];

  for (const challengeSeed of challengeSeeds) {
    const challenge = await prisma.challenge.upsert({
      where: { slug: challengeSeed.slug },
      update: {
        matchdayId: challengeSeed.matchdayId,
        matchId: challengeSeed.matchId,
        title: challengeSeed.title,
        description: challengeSeed.description,
        type: challengeSeed.type,
        difficulty: challengeSeed.difficulty,
        bonusPoints: challengeSeed.bonusPoints,
        lockAt: challengeSeed.lockAt,
        state: challengeSeed.state,
        settledAt: challengeSeed.settledAt
      },
      create: {
        slug: challengeSeed.slug,
        matchdayId: challengeSeed.matchdayId,
        matchId: challengeSeed.matchId,
        title: challengeSeed.title,
        description: challengeSeed.description,
        type: challengeSeed.type,
        difficulty: challengeSeed.difficulty,
        bonusPoints: challengeSeed.bonusPoints,
        lockAt: challengeSeed.lockAt,
        state: challengeSeed.state,
        settledAt: challengeSeed.settledAt
      }
    });

    const existingOptions = await prisma.challengeOption.findMany({
      where: { challengeId: challenge.id }
    });

    const optionsByValue = new Map(existingOptions.map((option) => [option.value, option]));

    for (const optionSeed of challengeSeed.options) {
      const option = optionsByValue.get(optionSeed.value);

      if (option) {
        await prisma.challengeOption.update({
          where: { id: option.id },
          data: {
            label: optionSeed.label,
            sortOrder: optionSeed.sortOrder,
            isCorrect: optionSeed.isCorrect
          }
        });
      } else {
        await prisma.challengeOption.create({
          data: {
            challengeId: challenge.id,
            label: optionSeed.label,
            value: optionSeed.value,
            sortOrder: optionSeed.sortOrder,
            isCorrect: optionSeed.isCorrect
          }
        });
      }
    }

    const refreshedOptions = await prisma.challengeOption.findMany({
      where: { challengeId: challenge.id }
    });

    const optionByValue = new Map(refreshedOptions.map((option) => [option.value, option]));

    for (const answerSeed of challengeSeed.answers) {
      const user = userByEmail.get(answerSeed.userEmail);
      const option = optionByValue.get(answerSeed.value);

      if (!user || !option) {
        throw new Error(`Challenge seed dependency missing for ${answerSeed.userEmail} / ${answerSeed.value}.`);
      }

      await prisma.challengeAnswer.upsert({
        where: {
          userId_challengeId: {
            userId: user.id,
            challengeId: challenge.id
          }
        },
        update: {
          challengeOptionId: option.id,
          isCorrect: answerSeed.isCorrect,
          bonusPointsAwarded: answerSeed.bonusPointsAwarded,
          settledAt: challengeSeed.settledAt,
          submittedAt: new Date(challengeSeed.lockAt.getTime() - 60 * 60 * 1000)
        },
        create: {
          userId: user.id,
          challengeId: challenge.id,
          challengeOptionId: option.id,
          isCorrect: answerSeed.isCorrect,
          bonusPointsAwarded: answerSeed.bonusPointsAwarded,
          settledAt: challengeSeed.settledAt,
          submittedAt: new Date(challengeSeed.lockAt.getTime() - 60 * 60 * 1000)
        }
      });
    }
  }

  const pickSeeds = [
    {
      userEmail: "camila@example.com",
      matchday: matchday1,
      matchExternalId: "md1-mex-jpn",
      selectedTeam: "Mexico",
      confidence: 82,
      outcome: PickOutcome.WON,
      pointsAwarded: 100,
      settledAt: matchday1.settledAt,
      lockedAt: new Date("2026-06-16T17:00:00.000Z")
    },
    {
      userEmail: "camila@example.com",
      matchday: matchday2,
      matchExternalId: "md2-bra-col",
      selectedTeam: "Brazil",
      confidence: 76,
      outcome: PickOutcome.WON,
      pointsAwarded: 100,
      settledAt: matchday2.settledAt,
      lockedAt: new Date("2026-06-20T17:30:00.000Z")
    },
    {
      userEmail: "camila@example.com",
      matchday: matchday3,
      matchExternalId: "md3-arg-uru",
      selectedTeam: "Argentina",
      confidence: 73,
      outcome: PickOutcome.PENDING,
      pointsAwarded: 0,
      settledAt: null,
      lockedAt: new Date("2026-06-24T15:30:00.000Z")
    },
    {
      userEmail: "iker@example.com",
      matchday: matchday1,
      matchExternalId: "md1-mex-jpn",
      selectedTeam: "Mexico",
      confidence: 80,
      outcome: PickOutcome.WON,
      pointsAwarded: 100,
      settledAt: matchday1.settledAt,
      lockedAt: new Date("2026-06-16T16:55:00.000Z")
    },
    {
      userEmail: "iker@example.com",
      matchday: matchday2,
      matchExternalId: "md2-bra-col",
      selectedTeam: "Brazil",
      confidence: 72,
      outcome: PickOutcome.WON,
      pointsAwarded: 100,
      settledAt: matchday2.settledAt,
      lockedAt: new Date("2026-06-20T17:20:00.000Z")
    },
    {
      userEmail: "iker@example.com",
      matchday: matchday3,
      matchExternalId: "md3-fra-por",
      selectedTeam: "France",
      confidence: 68,
      outcome: PickOutcome.PENDING,
      pointsAwarded: 0,
      settledAt: null,
      lockedAt: new Date("2026-06-24T15:25:00.000Z")
    },
    {
      userEmail: "frank@example.com",
      matchday: matchday1,
      matchExternalId: "md1-mex-jpn",
      selectedTeam: "Mexico",
      confidence: 78,
      outcome: PickOutcome.WON,
      pointsAwarded: 100,
      settledAt: matchday1.settledAt,
      lockedAt: new Date("2026-06-16T16:50:00.000Z")
    },
    {
      userEmail: "frank@example.com",
      matchday: matchday2,
      matchExternalId: "md2-bra-col",
      selectedTeam: "Brazil",
      confidence: 78,
      outcome: PickOutcome.WON,
      pointsAwarded: 100,
      settledAt: matchday2.settledAt,
      lockedAt: new Date("2026-06-20T17:25:00.000Z")
    },
    {
      userEmail: "frank@example.com",
      matchday: matchday3,
      matchExternalId: "md3-arg-uru",
      selectedTeam: "Argentina",
      confidence: 74,
      outcome: PickOutcome.PENDING,
      pointsAwarded: 0,
      settledAt: null,
      lockedAt: new Date("2026-06-24T15:45:00.000Z")
    },
    {
      userEmail: "mara@example.com",
      matchday: matchday1,
      matchExternalId: "md1-mex-jpn",
      selectedTeam: "Mexico",
      confidence: 77,
      outcome: PickOutcome.WON,
      pointsAwarded: 100,
      settledAt: matchday1.settledAt,
      lockedAt: new Date("2026-06-16T16:48:00.000Z")
    },
    {
      userEmail: "mara@example.com",
      matchday: matchday2,
      matchExternalId: "md2-bra-col",
      selectedTeam: "Colombia",
      confidence: 61,
      outcome: PickOutcome.LOST,
      pointsAwarded: 0,
      settledAt: matchday2.settledAt,
      lockedAt: new Date("2026-06-20T17:00:00.000Z")
    }
  ];

  for (const pickSeed of pickSeeds) {
    const user = userByEmail.get(pickSeed.userEmail);
    const match = matchByExternalId.get(pickSeed.matchExternalId);

    if (!user || !match) {
      throw new Error(
        `Seed dependency missing for ${pickSeed.userEmail} / ${pickSeed.matchExternalId}.`
      );
    }

    await prisma.pick.upsert({
      where: {
        userId_matchdayId: {
          userId: user.id,
          matchdayId: pickSeed.matchday.id
        }
      },
      update: {
        matchId: match.id,
        selectedTeam: pickSeed.selectedTeam,
        confidence: pickSeed.confidence,
        lockedAt: pickSeed.lockedAt,
        outcome: pickSeed.outcome,
        pointsAwarded: pickSeed.pointsAwarded,
        settledAt: pickSeed.settledAt
      },
      create: {
        userId: user.id,
        matchId: match.id,
        matchdayId: pickSeed.matchday.id,
        selectedTeam: pickSeed.selectedTeam,
        confidence: pickSeed.confidence,
        lockedAt: pickSeed.lockedAt,
        outcome: pickSeed.outcome,
        pointsAwarded: pickSeed.pointsAwarded,
        settledAt: pickSeed.settledAt
      }
    });
  }

  await ensureBadgeCatalog(prisma);

  for (const user of users) {
    await recalculateUserStats(prisma, user.id);
    await awardBadgesForUser(prisma, user.id);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
