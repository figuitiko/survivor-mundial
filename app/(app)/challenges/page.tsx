import { ChallengeJoinForm } from "@/components/challenges/challenge-join-form";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { statChallenges } from "@/lib/mock-data";

export default function ChallengesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Stat challenges"
        title="Stack prediction edges outside the main survivor pick."
        description="Challenge entries are structured as future transactional server actions. The current phase keeps everything mocked but shaped for database persistence."
        badge="Challenge room"
      />

      {statChallenges.length === 0 ? (
        <EmptyState
          eyebrow="No open challenges"
          title="The stat board is quiet."
          description="Seed the next slate and new challenge props will land here with deadlines and rewards."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
          <div className="grid gap-4">
            {statChallenges.map((challenge) => (
              <article
                key={challenge.id}
                className="section-shell rounded-[2rem] px-6 py-6 md:px-8 md:py-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={challenge.joined ? "success" : "default"}>
                    {challenge.joined ? "Joined" : "Open"}
                  </Badge>
                  <Badge variant="accent">{challenge.reward}</Badge>
                </div>
                <h2 className="font-display mt-5 text-3xl">{challenge.title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                  {challenge.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-6 text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  <span>Difficulty {challenge.difficulty}</span>
                  <span>{challenge.deadline}</span>
                </div>
              </article>
            ))}
          </div>

          <ChallengeJoinForm challenges={statChallenges} />
        </div>
      )}
    </div>
  );
}
