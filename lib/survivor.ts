import { PickOutcome, SurvivorStatus } from "@/generated/prisma/enums";

export const SURVIVOR_MATCHDAY_POINTS = 100;

export function formatKickoff(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function getPickOutcomeTone(outcome: PickOutcome) {
  switch (outcome) {
    case PickOutcome.WON:
      return "success";
    case PickOutcome.LOST:
    case PickOutcome.MISSED:
      return "danger";
    default:
      return "muted";
  }
}

export function getSurvivorStatusLabel(status: SurvivorStatus) {
  return status === SurvivorStatus.ALIVE ? "Alive" : "Eliminated";
}
