import { ChallengeState } from "@/generated/prisma/enums";

export function getChallengeState(lockAt: Date, settledAt: Date | null) {
  if (settledAt) {
    return ChallengeState.SETTLED;
  }

  if (lockAt <= new Date()) {
    return ChallengeState.LOCKED;
  }

  return ChallengeState.OPEN;
}

export function formatChallengeDifficulty(
  difficulty: "LOW" | "MEDIUM" | "HIGH"
): "Low" | "Medium" | "High" {
  switch (difficulty) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
  }
}
