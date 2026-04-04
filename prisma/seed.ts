import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  ChallengeDifficulty,
  MatchStatus,
  PickOutcome,
  PrismaClient,
  SurvivorStatus
} from "../generated/prisma/client";

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
        currentStreak: 2,
        longestStreak: 2,
        survivorPoints: 200,
        survivorStatus: SurvivorStatus.ALIVE
      },
      create: {
        email: "camila@example.com",
        name: "Camila Reyes",
        username: "camila",
        favoriteNation: "Mexico",
        bio: "Trusts tempo, travel, and midfield control.",
        streakGoal: 9,
        currentStreak: 2,
        longestStreak: 2,
        survivorPoints: 200,
        survivorStatus: SurvivorStatus.ALIVE
      }
    }),
    prisma.user.upsert({
      where: { email: "iker@example.com" },
      update: {
        currentStreak: 2,
        longestStreak: 2,
        survivorPoints: 200,
        survivorStatus: SurvivorStatus.ALIVE
      },
      create: {
        email: "iker@example.com",
        name: "Iker Torres",
        username: "iker",
        favoriteNation: "Spain",
        bio: "Chases compact defenses and matchup geometry.",
        streakGoal: 8,
        currentStreak: 2,
        longestStreak: 2,
        survivorPoints: 200,
        survivorStatus: SurvivorStatus.ALIVE
      }
    }),
    prisma.user.upsert({
      where: { email: "frank@example.com" },
      update: {
        currentStreak: 2,
        longestStreak: 2,
        survivorPoints: 200,
        survivorStatus: SurvivorStatus.ALIVE
      },
      create: {
        email: "frank@example.com",
        name: "Frank Ortega",
        username: "frankplayssurvivor",
        favoriteNation: "Mexico",
        bio: "Tracking survivor edges through venue splits, tempo, and squad rotation.",
        streakGoal: 10,
        currentStreak: 2,
        longestStreak: 2,
        survivorPoints: 200,
        survivorStatus: SurvivorStatus.ALIVE
      }
    }),
    prisma.user.upsert({
      where: { email: "mara@example.com" },
      update: {
        currentStreak: 0,
        longestStreak: 1,
        survivorPoints: 100,
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
        currentStreak: 0,
        longestStreak: 1,
        survivorPoints: 100,
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

  const matchByExternalId = new Map(matches.map((match) => [match.externalId, match]));

  const challenge = await prisma.statChallenge.upsert({
    where: { slug: "corners-chaos" },
    update: {
      matchdayId: matchday3.id,
      title: "Corners Chaos",
      description: "Pick the quarterfinal with the highest corner count.",
      rewardPoints: 120,
      difficulty: ChallengeDifficulty.MEDIUM,
      closesAt: new Date("2026-06-24T18:30:00.000Z")
    },
    create: {
      matchdayId: matchday3.id,
      slug: "corners-chaos",
      title: "Corners Chaos",
      description: "Pick the quarterfinal with the highest corner count.",
      rewardPoints: 120,
      difficulty: ChallengeDifficulty.MEDIUM,
      closesAt: new Date("2026-06-24T18:30:00.000Z")
    }
  });

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
      throw new Error(`Seed dependency missing for ${pickSeed.userEmail} / ${pickSeed.matchExternalId}.`);
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

  const frank = userByEmail.get("frank@example.com");

  if (!frank) {
    throw new Error("Frank seed user is missing.");
  }

  await prisma.challengeEntry.upsert({
    where: {
      userId_statChallengeId: {
        userId: frank.id,
        statChallengeId: challenge.id
      }
    },
    update: {
      prediction: "Argentina vs Uruguay finishes with 12 total corners."
    },
    create: {
      userId: frank.id,
      statChallengeId: challenge.id,
      prediction: "Argentina vs Uruguay finishes with 12 total corners."
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
