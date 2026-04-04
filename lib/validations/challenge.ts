import { z } from "zod";

export const challengeJoinSchema = z.object({
  challengeId: z.string().min(1, "Challenge id is required."),
  statCall: z.string().min(3, "Add a short stat prediction.")
});

export type ChallengeJoinInput = z.infer<typeof challengeJoinSchema>;
