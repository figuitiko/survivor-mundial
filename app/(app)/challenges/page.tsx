export const dynamic = "force-dynamic";

import { ChallengeCreateForm } from "@/components/challenges/challenge-create-form";
import { ChallengeJoinForm } from "@/components/challenges/challenge-join-form";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getChallengesPageData } from "@/lib/challenge-queries";

export default async function ChallengesPage() {
  const data = await getChallengesPageData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stat challenges"
        title="Stack prediction edges outside the main survivor pick."
        description="Challenge creation, answer validation, lock rules, and bonus-point settlement now resolve server-side through Prisma and server actions."
        badge="Challenge room"
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
        <div className="grid gap-4">
          <ChallengeCreateForm matchdays={data.matchdays} />
          {data.challenges.length === 0 ? (
            <EmptyState
              eyebrow="No open challenges"
              title="The stat board is quiet."
              description="Create a challenge or seed the next slate to populate the board."
            />
          ) : (
            data.challenges.map((challenge) => (
              <article
                key={challenge.id}
                className="section-shell rounded-4xl px-6 py-6 md:px-8 md:py-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant={
                      challenge.state === "SETTLED"
                        ? "success"
                        : challenge.state === "LOCKED"
                          ? "default"
                          : challenge.joined
                            ? "success"
                            : "default"
                    }
                  >
                    {challenge.state === "SETTLED"
                      ? "Settled"
                      : challenge.state === "LOCKED"
                        ? "Locked"
                        : challenge.joined
                          ? "Answered"
                          : "Open"}
                  </Badge>
                  <Badge variant="accent">{challenge.reward}</Badge>
                </div>
                <h2 className="font-display mt-5 text-3xl">
                  {challenge.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-(--muted-foreground)">
                  {challenge.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-6 text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
                  <span>Difficulty {challenge.difficulty}</span>
                  <span>
                    Locks {new Date(challenge.deadline).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {challenge.options.map((option) => (
                    <div
                      key={option.id}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] ${
                        challenge.answerLabel === option.label
                          ? "border-(--accent) bg-(--accent-soft) text-(--accent)"
                          : "border-(--border) bg-white/70 text-(--muted-foreground)"
                      }`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
                {challenge.answerLabel ? (
                  <p className="mt-4 text-sm text-(--accent)">
                    Your answer: {challenge.answerLabel}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>

        <div className="grid gap-4">
          <ChallengeJoinForm challenges={data.challenges} />
          {data.challengeHistory.length > 0 ? (
            <section className="section-shell rounded-4xl px-6 py-6 md:px-8 md:py-8">
              <p className="eyebrow">Challenge history</p>
              <div className="mt-6 space-y-4">
                {data.challengeHistory.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-[1.6rem] border border-(--border) bg-white/70 px-5 py-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl">{entry.title}</h3>
                      <Badge variant={entry.isCorrect ? "success" : "default"}>
                        {entry.state}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-(--muted-foreground)">
                      Answer: {entry.answer}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-(--accent)">
                      Bonus awarded {entry.bonusPointsAwarded}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
