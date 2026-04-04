import { z } from "zod";

export const pickSubmissionSchema = z.object({
  matchId: z.string().min(1, "Choose a match."),
  selectedTeam: z.string().min(1, "Select the nation you want to back."),
  confidence: z.number().min(1).max(100)
});

export type PickSubmission = z.infer<typeof pickSubmissionSchema>;
