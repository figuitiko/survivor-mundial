"use server";

import { revalidatePath } from "next/cache";

import { challengeJoinSchema, type ChallengeJoinInput } from "@/lib/validations/challenge";

type ChallengeActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function joinChallenge(
  input: ChallengeJoinInput
): Promise<ChallengeActionState> {
  const parsed = challengeJoinSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Challenge entry failed."
    };
  }

  revalidatePath("/challenges");

  return {
    status: "success",
    message: `Drafted your call for ${parsed.data.challengeId}.`
  };
}
