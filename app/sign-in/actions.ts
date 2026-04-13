"use server";

import { registerWithCredentials } from "@/lib/auth";
import { credentialsRegisterSchema } from "@/lib/validations/auth";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}

export async function credentialsRegisterAction(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const payload = credentialsRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!payload.success) {
    return {
      status: "error",
      message: payload.error.issues[0]?.message ?? "Registration failed."
    };
  }

  try {
    await registerWithCredentials(payload.data);
    return {
      status: "success",
      message: "Account created. Sign in with the same email and password."
    };
  } catch (error) {
    return {
      status: "error",
      message: getAuthErrorMessage(error)
    };
  }
}
