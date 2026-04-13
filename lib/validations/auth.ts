import { z } from "zod";

export const credentialsSignInSchema = z.object({
  email: z.string().email("Enter a valid email address.").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export const credentialsRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters."),
  email: z.string().email("Enter a valid email address.").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export type CredentialsSignInInput = z.infer<typeof credentialsSignInSchema>;
export type CredentialsRegisterInput = z.infer<typeof credentialsRegisterSchema>;
