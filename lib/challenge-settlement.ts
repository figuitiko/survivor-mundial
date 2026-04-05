import { ChallengeState } from "@/generated/prisma/enums";
import { awardBadgesForUser, recalculateUserStats } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

export async function settleChallenge(challengeId: string, correctOptionId: string) {
  return prisma.$transaction(async (tx) => {
    const challenge = await tx.challenge.findUnique({
      where: { id: challengeId },
      include: {
        options: true,
        answers: true
      }
    });

    if (!challenge) {
      throw new Error("Challenge not found.");
    }

    if (challenge.settledAt) {
      throw new Error(`${challenge.title} is already settled.`);
    }

    const correctOption = challenge.options.find((option) => option.id === correctOptionId);

    if (!correctOption) {
      throw new Error("Correct option does not belong to this challenge.");
    }

    const settledAt = new Date();
    const impactedUserIds = new Set<string>();

    await tx.challengeOption.updateMany({
      where: { challengeId: challenge.id },
      data: { isCorrect: false }
    });

    await tx.challengeOption.update({
      where: { id: correctOption.id },
      data: { isCorrect: true }
    });

    for (const answer of challenge.answers) {
      impactedUserIds.add(answer.userId);
      const isCorrect = answer.challengeOptionId === correctOption.id;
      const bonusPointsAwarded = isCorrect ? challenge.bonusPoints : 0;

      await tx.challengeAnswer.update({
        where: { id: answer.id },
        data: {
          isCorrect,
          bonusPointsAwarded,
          settledAt
        }
      });

      if (bonusPointsAwarded > 0) {
        await tx.user.update({
          where: { id: answer.userId },
          data: {
            challengeBonusPoints: {
              increment: bonusPointsAwarded
            }
          }
        });
      }
    }

    await tx.challenge.update({
      where: { id: challenge.id },
      data: {
        state: ChallengeState.SETTLED,
        settledAt
      }
    });

    for (const userId of impactedUserIds) {
      await recalculateUserStats(tx, userId);
      await awardBadgesForUser(tx, userId);
    }

    return {
      challengeId: challenge.id,
      title: challenge.title,
      settledAt
    };
  });
}
