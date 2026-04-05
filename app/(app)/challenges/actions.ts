"use server";

import { revalidatePath } from "next/cache";

import { ChallengeState } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/survivor-queries";
import {
  createChallengeSchema,
  submitChallengeAnswersSchema,
  type CreateChallengeInput,
  type SubmitChallengeAnswersInput
} from "@/lib/validations/challenge";
import { getChallengeState } from "@/lib/challenges";

type ChallengeActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createChallenge(
  input: CreateChallengeInput
): Promise<ChallengeActionState> {
  const parsed = createChallengeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Challenge creation failed."
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const matchday = await tx.matchday.findUnique({
        where: { id: parsed.data.matchdayId }
      });

      if (!matchday) {
        throw new Error("Matchday not found.");
      }

      if (parsed.data.matchId) {
        const match = await tx.match.findUnique({
          where: { id: parsed.data.matchId }
        });

        if (!match || match.matchdayId !== matchday.id) {
          throw new Error("Selected match does not belong to the chosen matchday.");
        }
      }

      const challenge = await tx.challenge.create({
        data: {
          matchdayId: parsed.data.matchdayId,
          matchId: parsed.data.matchId,
          slug: parsed.data.slug,
          title: parsed.data.title,
          description: parsed.data.description,
          type: parsed.data.type,
          difficulty: parsed.data.difficulty,
          bonusPoints: parsed.data.bonusPoints,
          lockAt: new Date(parsed.data.lockAt),
          state: getChallengeState(new Date(parsed.data.lockAt), null)
        }
      });

      await tx.challengeOption.createMany({
        data: parsed.data.options.map((option, index) => ({
          challengeId: challenge.id,
          label: option.label,
          value: option.value,
          sortOrder: option.sortOrder ?? index
        }))
      });
    });

    revalidatePath("/challenges");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: `Created challenge ${parsed.data.title}.`
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Challenge creation failed."
    };
  }
}

export async function submitChallengeAnswers(
  input: SubmitChallengeAnswersInput
): Promise<ChallengeActionState> {
  const parsed = submitChallengeAnswersSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Challenge submission failed."
    };
  }

  try {
    const user = await getCurrentUserOrThrow();

    await prisma.$transaction(async (tx) => {
      for (const answer of parsed.data.answers) {
        const challenge = await tx.challenge.findUnique({
          where: { id: answer.challengeId },
          include: {
            options: true
          }
        });

        if (!challenge) {
          throw new Error("Challenge not found.");
        }

        const computedState = getChallengeState(challenge.lockAt, challenge.settledAt);

        if (challenge.state === ChallengeState.SETTLED || computedState === ChallengeState.SETTLED) {
          throw new Error(`${challenge.title} is already settled.`);
        }

        if (computedState !== ChallengeState.OPEN || challenge.lockAt <= new Date()) {
          throw new Error(`${challenge.title} is locked.`);
        }

        const option = challenge.options.find((item) => item.id === answer.challengeOptionId);

        if (!option) {
          throw new Error("Selected option does not belong to this challenge.");
        }

        await tx.challengeAnswer.upsert({
          where: {
            userId_challengeId: {
              userId: user.id,
              challengeId: challenge.id
            }
          },
          update: {
            challengeOptionId: option.id,
            submittedAt: new Date(),
            settledAt: null,
            isCorrect: null,
            bonusPointsAwarded: 0
          },
          create: {
            userId: user.id,
            challengeId: challenge.id,
            challengeOptionId: option.id
          }
        });
      }
    });

    revalidatePath("/challenges");
    revalidatePath("/dashboard");
    revalidatePath("/leaderboard");

    return {
      status: "success",
      message: `Saved ${parsed.data.answers.length} challenge answer${parsed.data.answers.length > 1 ? "s" : ""}.`
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Challenge submission failed."
    };
  }
}
