import { z } from "zod";

const challengeTypeEnum = z.enum([
  "BOTH_TEAMS_SCORE",
  "OVER_25_GOALS",
  "RED_CARD_YES_NO",
  "MATCH_WITH_MOST_GOALS",
  "UNDERDOG_AVOIDS_DEFEAT"
]);

const challengeDifficultyEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const challengeOptionSchema = z.object({
  label: z.string().min(1, "Option label is required."),
  value: z.string().min(1, "Option value is required."),
  sortOrder: z.number().int().min(0)
});

export const createChallengeSchema = z.object({
  matchdayId: z.string().min(1, "Matchday is required."),
  matchId: z.string().optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters.")
    .regex(/^[a-z0-9-]+$/, "Slug must use lowercase letters, numbers, and hyphens."),
  title: z.string().min(3, "Title is required."),
  description: z.string().min(8, "Description is required."),
  type: challengeTypeEnum,
  difficulty: challengeDifficultyEnum,
  bonusPoints: z.number().int().min(1).max(500),
  lockAt: z
    .string()
    .min(1, "Lock time is required.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Lock time must be valid."),
  options: z.array(challengeOptionSchema).min(2, "Add at least two options.")
});

export const challengeAnswerSchema = z.object({
  challengeId: z.string().min(1, "Challenge is required."),
  challengeOptionId: z.string().min(1, "Choose an option.")
});

export const submitChallengeAnswersSchema = z.object({
  answers: z.array(challengeAnswerSchema).min(1, "Choose at least one challenge answer.")
});

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type SubmitChallengeAnswersInput = z.infer<typeof submitChallengeAnswersSchema>;
