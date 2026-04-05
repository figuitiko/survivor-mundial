import { ChallengeState } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrThrow } from "@/lib/survivor-queries";
import { formatChallengeDifficulty, getChallengeState } from "@/lib/challenges";

export async function getChallengesPageData() {
  const user = await getCurrentUserOrThrow();

  const [matchdays, challenges] = await Promise.all([
    prisma.matchday.findMany({
      orderBy: { order: "asc" },
      include: {
        matches: {
          orderBy: { kickoffAt: "asc" }
        }
      }
    }),
    prisma.challenge.findMany({
      orderBy: [{ matchday: { order: "desc" } }, { createdAt: "desc" }],
      include: {
        options: {
          orderBy: { sortOrder: "asc" }
        },
        answers: {
          where: { userId: user.id },
          include: { challengeOption: true }
        },
        matchday: true,
        match: true
      }
    })
  ]);

  return {
    user,
    matchdays: matchdays.map((matchday) => ({
      id: matchday.id,
      title: matchday.title,
      matches: matchday.matches.map((match) => ({
        id: match.id,
        label: `${match.homeTeam} vs ${match.awayTeam}`
      }))
    })),
    challenges: challenges.map((challenge) => {
      const answer = challenge.answers[0] ?? null;
      const computedState = getChallengeState(challenge.lockAt, challenge.settledAt);

      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        reward: `+${challenge.bonusPoints} bonus points`,
        difficulty: formatChallengeDifficulty(challenge.difficulty),
        deadline: challenge.lockAt.toISOString(),
        joined: Boolean(answer),
        state: (challenge.state === ChallengeState.SETTLED ? challenge.state : computedState) as
          | "OPEN"
          | "LOCKED"
          | "SETTLED",
        answerLabel: answer?.challengeOption.label ?? null,
        options: challenge.options.map((option) => ({
          id: option.id,
          label: option.label,
          value: option.value
        }))
      };
    }),
    challengeHistory: challenges
      .filter((challenge) => challenge.answers[0])
      .map((challenge) => {
        const answer = challenge.answers[0];

        return {
          id: answer!.id,
          title: challenge.title,
          answer: answer!.challengeOption.label,
          state: challenge.state as "OPEN" | "LOCKED" | "SETTLED",
          bonusPointsAwarded: answer!.bonusPointsAwarded,
          isCorrect: answer!.isCorrect
        };
      })
  };
}
