export const dynamic = "force-dynamic";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getLeaderboardData } from "@/lib/survivor-queries";
import { getSurvivorStatusLabel } from "@/lib/survivor";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Leaderboard"
        title="Track position across survivor longevity and challenge sharpness."
        description="Ranks are now derived from persisted survivor state, with alive status and streaks resolved server-side."
        badge="Prisma standings"
      />

      {leaderboard.length === 0 ? (
        <EmptyState
          eyebrow="No standings"
          title="Leaderboard is waiting for entries."
          description="After picks and challenge results are seeded, rankings and movement will be shown here."
        />
      ) : (
        <section className="section-shell overflow-hidden rounded-[2.2rem]">
          <div className="hidden grid-cols-[72px_1.2fr_120px_120px_120px_120px] gap-4 border-b border-(--border) px-6 py-4 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] md:grid md:px-8">
            <span>Rank</span>
            <span>Player</span>
            <span>Streak</span>
            <span>Points</span>
            <span>Bonus</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-(--border)">
            {leaderboard.map((entry) => (
              <article
                key={entry.rank}
                className="grid gap-4 px-6 py-5 md:grid-cols-[72px_1.2fr_120px_120px_120px_120px] md:items-center md:px-8"
              >
                <p className="font-display text-3xl">{entry.rank}</p>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-base font-semibold">{entry.player}</p>
                    {entry.isCurrentUser ? (
                      <Badge variant="accent">You</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                    {entry.nation}
                  </p>
                </div>
                <p className="text-sm font-semibold">Streak {entry.streak}</p>
                <p className="text-sm font-semibold">{entry.points} pts</p>
                <p className="text-sm font-semibold text-(--accent)">
                  +{entry.challengeBonusPoints ?? 0}
                </p>
                <p className="text-sm font-semibold text-(--accent)">
                  {getSurvivorStatusLabel(entry.status)}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
