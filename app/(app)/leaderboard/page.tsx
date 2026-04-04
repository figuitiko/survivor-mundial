import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { leaderboard } from "@/lib/mock-data";

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Leaderboard"
        title="Track position across survivor longevity and challenge sharpness."
        description="The table is mocked for phase 1, but the structure is already aligned to future Prisma-driven standings and snapshots."
        badge="Updated 2m ago"
      />

      {leaderboard.length === 0 ? (
        <EmptyState
          eyebrow="No standings"
          title="Leaderboard is waiting for entries."
          description="After picks and challenge results are seeded, rankings and movement will be shown here."
        />
      ) : (
        <section className="section-shell overflow-hidden rounded-[2.2rem]">
          <div className="hidden grid-cols-[72px_1.4fr_120px_120px_100px] gap-4 border-b border-[color:var(--border)] px-6 py-4 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] md:grid md:px-8">
            <span>Rank</span>
            <span>Player</span>
            <span>Streak</span>
            <span>Points</span>
            <span>Delta</span>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {leaderboard.map((entry) => (
              <article
                key={entry.rank}
                className="grid gap-4 px-6 py-5 md:grid-cols-[72px_1.4fr_120px_120px_100px] md:items-center md:px-8"
              >
                <p className="font-display text-3xl">{entry.rank}</p>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-base font-semibold">{entry.player}</p>
                    {entry.player === "You" ? <Badge variant="accent">You</Badge> : null}
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                    {entry.nation}
                  </p>
                </div>
                <p className="text-sm font-semibold">Streak {entry.streak}</p>
                <p className="text-sm font-semibold">{entry.points} pts</p>
                <p className="text-sm font-semibold text-[color:var(--accent)]">{entry.delta}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
