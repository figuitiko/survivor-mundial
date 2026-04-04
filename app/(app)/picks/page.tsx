import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PickForm } from "@/components/picks/pick-form";
import { Badge } from "@/components/ui/badge";
import { matchdayMatches } from "@/lib/mock-data";

export default function PicksPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Matchday picks"
        title="Make one decisive call before the board closes."
        description="This screen is already wired for validation and server actions, so the next phase can swap the mock layer for Prisma writes without changing the UX."
        badge="Zod-validated"
      />

      {matchdayMatches.length === 0 ? (
        <EmptyState
          eyebrow="No fixtures"
          title="No matches are open for picks."
          description="When the next matchday is seeded, eligible fixtures will appear here with lock timing and confidence guidance."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
            <p className="eyebrow">Open window</p>
            <div className="mt-6 space-y-4">
              {matchdayMatches.map((match) => (
                <article
                  key={match.id}
                  className="rounded-[1.8rem] border border-[color:var(--border)] bg-white/70 px-5 py-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                        {match.group}
                      </p>
                      <h2 className="font-display mt-2 text-2xl">
                        {match.homeTeam} vs {match.awayTeam}
                      </h2>
                    </div>
                    <Badge variant="accent">{Math.round(match.confidence * 100)}% edge</Badge>
                  </div>
                  <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
                    {match.kickoff} · {match.venue}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <PickForm matches={matchdayMatches} />
        </div>
      )}
    </div>
  );
}
