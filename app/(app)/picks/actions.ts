"use server";

import { revalidatePath } from "next/cache";

import { pickSubmissionSchema, type PickSubmission } from "@/lib/validations/pick";

type PickActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitPick(input: PickSubmission): Promise<PickActionState> {
  const parsed = pickSubmissionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Pick submission failed."
    };
  }

  revalidatePath("/picks");

  return {
    status: "success",
    message: `Saved ${parsed.data.selectedTeam} with ${parsed.data.confidence}% confidence.`
  };
}
