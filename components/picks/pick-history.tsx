import type { PickHistoryEntry } from "@/lib/types";

export function PickHistory({ history }: { history: PickHistoryEntry[] }) {
  return (
    <section className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
      <p className="eyebrow">Pick history</p>
      <div className="mt-6 space-y-4">
        {history.map((entry) => (
          <article
            key={entry.id}
            className="grid gap-3 rounded-[1.75rem] border border-[color:var(--border)] bg-white/70 px-5 py-5 md:grid-cols-[1.2fr_1fr_auto]"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                {entry.matchday}
              </p>
              <h3 className="font-display mt-2 text-2xl">
                {entry.selectedTeam} over {entry.opponent}
              </h3>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{entry.kickoff}</p>
            </div>
            <div className="text-sm">
              <p className="text-[color:var(--muted-foreground)]">Outcome</p>
              <p className="font-semibold">{entry.outcome}</p>
            </div>
            <div className="text-sm">
              <p className="text-[color:var(--muted-foreground)]">Points</p>
              <p className="font-semibold">{entry.pointsAwarded}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
