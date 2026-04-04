import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { ChallengeDifficulty, PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "frank@example.com" },
    update: {},
    create: {
      email: "frank@example.com",
      name: "Frank Ortega",
      username: "frankplayssurvivor",
      favoriteNation: "Mexico",
      bio: "Tracking survivor edges through venue splits, tempo, and squad rotation.",
      streakGoal: 10,
      survivorPoints: 1686
    }
  });

  const matchday = await prisma.matchday.upsert({
    where: { slug: "quarterfinal-matchday" },
    update: {},
    create: {
      slug: "quarterfinal-matchday",
      title: "Quarterfinal Matchday",
      closesAt: new Date("2026-04-04T19:00:00.000Z")
    }
  });

  const match = await prisma.match.upsert({
    where: { externalId: "md5-arg-uru" },
    update: {},
    create: {
      externalId: "md5-arg-uru",
      matchdayId: matchday.id,
      homeTeam: "Argentina",
      awayTeam: "Uruguay",
      venue: "Monterrey",
      kickoffAt: new Date("2026-04-04T19:00:00.000Z")
    }
  });

  const challenge = await prisma.statChallenge.upsert({
    where: { slug: "corners-chaos" },
    update: {},
    create: {
      matchdayId: matchday.id,
      slug: "corners-chaos",
      title: "Corners Chaos",
      description: "Pick the quarterfinal with the highest corner count.",
      rewardPoints: 120,
      difficulty: ChallengeDifficulty.MEDIUM,
      closesAt: new Date("2026-04-04T18:30:00.000Z")
    }
  });

  await prisma.pick.upsert({
    where: {
      userId_matchId: {
        userId: user.id,
        matchId: match.id
      }
    },
    update: {},
    create: {
      userId: user.id,
      matchId: match.id,
      selectedTeam: "Argentina",
      confidence: 78
    }
  });

  await prisma.challengeEntry.upsert({
    where: {
      userId_statChallengeId: {
        userId: user.id,
        statChallengeId: challenge.id
      }
    },
    update: {},
    create: {
      userId: user.id,
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
