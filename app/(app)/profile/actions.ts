"use server";

import { revalidatePath } from "next/cache";

import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

type ProfileActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateProfile(
  input: ProfileInput
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Profile update failed."
    };
  }

  revalidatePath("/profile");

  return {
    status: "success",
    message: `Saved profile draft for ${parsed.data.username}.`
  };
}
