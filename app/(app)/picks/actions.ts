"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/survivor-queries";
import { pickSubmissionSchema, type PickSubmission } from "@/lib/validations/pick";

type PickActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitSurvivalPick(input: PickSubmission): Promise<PickActionState> {
  const parsed = pickSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Pick submission failed."
    };
  }

  try {
    const user = await getCurrentUserOrThrow();

    if (user.survivorStatus !== "ALIVE") {
      return {
        status: "error",
        message: "Eliminated entries cannot submit a new survivor pick."
      };
    }

    await prisma.$transaction(async (tx) => {
      const match = await tx.match.findUnique({
        where: { id: parsed.data.matchId },
        include: { matchday: true }
      });

      if (!match) {
        throw new Error("Selected match was not found.");
      }

      if (match.matchday.settledAt) {
        throw new Error("This matchday is already settled.");
      }

      if (match.kickoffAt <= new Date()) {
        throw new Error("Kickoff has passed. Picks are locked.");
      }

      if (![match.homeTeam, match.awayTeam].includes(parsed.data.selectedTeam)) {
        throw new Error("Selected team must be playing in the chosen match.");
      }

      const existingPick = await tx.pick.findUnique({
        where: {
          userId_matchdayId: {
            userId: user.id,
            matchdayId: match.matchdayId
          }
        }
      });

      const reusedTeam = await tx.pick.findFirst({
        where: {
          userId: user.id,
          selectedTeam: parsed.data.selectedTeam,
          ...(existingPick ? { id: { not: existingPick.id } } : {})
        }
      });

      if (reusedTeam) {
        throw new Error(`${parsed.data.selectedTeam} has already been used in this tournament.`);
      }

      await tx.pick.upsert({
        where: {
          userId_matchdayId: {
            userId: user.id,
            matchdayId: match.matchdayId
          }
        },
        update: {
          matchId: match.id,
          selectedTeam: parsed.data.selectedTeam,
          confidence: parsed.data.confidence,
          lockedAt: new Date(),
          outcome: "PENDING",
          pointsAwarded: 0,
          settledAt: null
        },
        create: {
          userId: user.id,
          matchId: match.id,
          matchdayId: match.matchdayId,
          selectedTeam: parsed.data.selectedTeam,
          confidence: parsed.data.confidence,
          lockedAt: new Date()
        }
      });
    });

    revalidatePath("/picks");
    revalidatePath("/dashboard");
    revalidatePath("/leaderboard");

    return {
      status: "success",
      message: `Saved ${parsed.data.selectedTeam} with ${parsed.data.confidence}% confidence.`
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Pick submission failed."
    };
  }
}
