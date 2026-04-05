"use server";

import { revalidatePath } from "next/cache";

import { getRequiredSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const session = await getRequiredSession();

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: parsed.data.name,
      username: parsed.data.username,
      favoriteNation: parsed.data.favoriteNation,
      bio: parsed.data.bio,
      streakGoal: parsed.data.streakGoal
    }
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");

  return {
    status: "success",
    message: `Saved profile for ${parsed.data.username}.`
  };
}
