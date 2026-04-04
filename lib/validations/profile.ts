import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters."),
  username: z.string().min(3, "Username must have at least 3 characters."),
  favoriteNation: z.string().min(2, "Favorite nation is required."),
  bio: z.string().min(12, "Bio should explain your angle in a sentence."),
  streakGoal: z.number().min(1).max(20)
});

export type ProfileInput = z.infer<typeof profileSchema>;
