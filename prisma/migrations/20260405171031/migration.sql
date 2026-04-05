-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINAL');

-- CreateEnum
CREATE TYPE "SurvivorStatus" AS ENUM ('ALIVE', 'ELIMINATED');

-- CreateEnum
CREATE TYPE "PickOutcome" AS ENUM ('PENDING', 'WON', 'LOST', 'MISSED');

-- CreateEnum
CREATE TYPE "ChallengeDifficulty" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('BOTH_TEAMS_SCORE', 'OVER_25_GOALS', 'RED_CARD_YES_NO', 'MATCH_WITH_MOST_GOALS', 'UNDERDOG_AVOIDS_DEFEAT');

-- CreateEnum
CREATE TYPE "ChallengeState" AS ENUM ('OPEN', 'LOCKED', 'SETTLED');

-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('SURVIVAL', 'CHALLENGE', 'MILESTONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "favoriteNation" TEXT,
    "bio" TEXT,
    "streakGoal" INTEGER NOT NULL DEFAULT 10,
    "survivorPoints" INTEGER NOT NULL DEFAULT 0,
    "challengeBonusPoints" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "survivorStatus" "SurvivorStatus" NOT NULL DEFAULT 'ALIVE',
    "eliminatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matchday" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "closesAt" TIMESTAMP(3) NOT NULL,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matchday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "matchdayId" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "kickoffAt" TIMESTAMP(3) NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "winner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pick" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchdayId" TEXT NOT NULL,
    "selectedTeam" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "lockedAt" TIMESTAMP(3),
    "outcome" "PickOutcome" NOT NULL DEFAULT 'PENDING',
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "matchdayId" TEXT NOT NULL,
    "matchId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ChallengeType" NOT NULL,
    "difficulty" "ChallengeDifficulty" NOT NULL,
    "state" "ChallengeState" NOT NULL DEFAULT 'OPEN',
    "bonusPoints" INTEGER NOT NULL,
    "lockAt" TIMESTAMP(3) NOT NULL,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeOption" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeAnswer" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "challengeOptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bonusPointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" "BadgeCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPicks" INTEGER NOT NULL DEFAULT 0,
    "settledPicks" INTEGER NOT NULL DEFAULT 0,
    "survivorWins" INTEGER NOT NULL DEFAULT 0,
    "survivorLosses" INTEGER NOT NULL DEFAULT 0,
    "totalChallengeAnswers" INTEGER NOT NULL DEFAULT 0,
    "correctChallengeAnswers" INTEGER NOT NULL DEFAULT 0,
    "currentSurvivalStreak" INTEGER NOT NULL DEFAULT 0,
    "longestSurvivalStreak" INTEGER NOT NULL DEFAULT 0,
    "currentChallengeStreak" INTEGER NOT NULL DEFAULT 0,
    "longestChallengeStreak" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "totalBonusPoints" INTEGER NOT NULL DEFAULT 0,
    "badgesUnlocked" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Matchday_slug_key" ON "Matchday"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Matchday_order_key" ON "Matchday"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Match_externalId_key" ON "Match"("externalId");

-- CreateIndex
CREATE INDEX "Pick_userId_selectedTeam_idx" ON "Pick"("userId", "selectedTeam");

-- CreateIndex
CREATE UNIQUE INDEX "Pick_userId_matchdayId_key" ON "Pick"("userId", "matchdayId");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_slug_key" ON "Challenge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeOption_challengeId_value_key" ON "ChallengeOption"("challengeId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeAnswer_userId_challengeId_key" ON "ChallengeAnswer"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_slug_key" ON "Badge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_matchdayId_fkey" FOREIGN KEY ("matchdayId") REFERENCES "Matchday"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pick" ADD CONSTRAINT "Pick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pick" ADD CONSTRAINT "Pick_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pick" ADD CONSTRAINT "Pick_matchdayId_fkey" FOREIGN KEY ("matchdayId") REFERENCES "Matchday"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_matchdayId_fkey" FOREIGN KEY ("matchdayId") REFERENCES "Matchday"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeOption" ADD CONSTRAINT "ChallengeOption_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeAnswer" ADD CONSTRAINT "ChallengeAnswer_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeAnswer" ADD CONSTRAINT "ChallengeAnswer_challengeOptionId_fkey" FOREIGN KEY ("challengeOptionId") REFERENCES "ChallengeOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeAnswer" ADD CONSTRAINT "ChallengeAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
