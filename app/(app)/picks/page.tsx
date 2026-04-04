export const dynamic = "force-dynamic";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PickHistory } from "@/components/picks/pick-history";
import { PickForm } from "@/components/picks/pick-form";
import { UsedTeams } from "@/components/picks/used-teams";
import { Badge } from "@/components/ui/badge";
import { getPicksPageData } from "@/lib/survivor-queries";
import { formatKickoff } from "@/lib/survivor";

export default async function PicksPage() {
  const data = await getPicksPageData();
  const matchdayMatches =
    data.currentMatchday?.matches.map((match) => ({
      id: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      kickoff: formatKickoff(match.kickoffAt),
      venue: match.venue,
      group: data.currentMatchday?.title ?? "Current Matchday",
      confidence: 0.65,
      trend: "steady" as const,
      isLocked: match.kickoffAt <= new Date(),
      selectedTeam: data.currentPick?.matchId === match.id ? data.currentPick.selectedTeam : null
    })) ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Matchday picks"
        title="Make one decisive call before the board closes."
        description="Survivor rules now resolve on the server: one pick per matchday, no reused teams, and no edits after kickoff."
        badge={data.user.survivorStatus}
      />

      {matchdayMatches.length === 0 ? (
        <EmptyState
          eyebrow="No fixtures"
          title="No unsettled matchday is open."
          description="After settlement runs, the next open matchday will appear here for a fresh survivor decision."
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            <section className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
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
                    <Badge variant={match.isLocked ? "default" : "accent"}>
                      {match.isLocked ? "Locked" : `${Math.round(match.confidence * 100)}% edge`}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
                    {match.kickoff} · {match.venue}
                  </p>
                  {match.selectedTeam ? (
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">
                      Current pick: {match.selectedTeam}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
            </section>
            <UsedTeams teams={data.usedTeams} />
          </div>

          <div className="grid gap-4">
            <PickForm
              matches={matchdayMatches}
              currentPickMatchId={data.currentPick?.matchId}
              currentPickTeam={data.currentPick?.selectedTeam}
            />
            <PickHistory history={data.pickHistory} />
          </div>
        </div>
      )}
    </div>
  );
}
