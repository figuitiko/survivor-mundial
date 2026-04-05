export const dynamic = "force-dynamic";

import { Flame, Sparkles, Target, Trophy } from "lucide-react";

import { LeaderboardPodium } from "@/components/gamification/leaderboard-podium";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getSurvivorStatusLabel } from "@/lib/survivor";
import { getLeaderboardData } from "@/lib/survivor-queries";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboardData();
  const podium = leaderboard.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Leaderboard"
        title="Track the pool through streaks, bonus spikes, and badge pressure."
        description="Standings now blend survivor consistency, challenge streaks, and achievement depth from persisted Prisma state."
        badge="Global table"
      />

      {leaderboard.length === 0 ? (
        <EmptyState
          eyebrow="No standings"
          title="Leaderboard is waiting for entries."
          description="After picks and challenge results are seeded, rankings and movement will be shown here."
        />
      ) : (
        <>
          <LeaderboardPodium entries={podium} />

          <section className="section-shell overflow-hidden rounded-[2.2rem]">
            <div className="hidden grid-cols-[72px_1.3fr_120px_120px_130px_120px_120px] gap-4 border-b border-(--border) px-6 py-4 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)] md:grid md:px-8">
              <span>Rank</span>
              <span>Player</span>
              <span>Survivor</span>
              <span>Challenge</span>
              <span>Points</span>
              <span>Badges</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-(--border)">
              {leaderboard.map((entry) => (
                <article
                  key={entry.rank}
                  className={`grid gap-4 px-6 py-5 md:grid-cols-[72px_1.3fr_120px_120px_130px_120px_120px] md:items-center md:px-8 ${
                    entry.isCurrentUser ? "bg-(--accent-soft)/40" : ""
                  }`}
                >
                  <p className="font-display text-3xl">{entry.rank}</p>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-semibold">{entry.player}</p>
                      {entry.isCurrentUser ? (
                        <Badge variant="accent">You</Badge>
                      ) : null}
                    </div>
                    <p className="text-xs uppercase tracking-[0.24em] text-(--muted-foreground)">
                      {entry.nation}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="flex items-center gap-1 font-semibold">
                      <Flame className="size-3.5 text-(--accent)" />
                      {entry.streak}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                      best {entry.longestStreak ?? entry.streak}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="flex items-center gap-1 font-semibold">
                      <Target className="size-3.5 text-(--accent)" />
                      {entry.challengeStreak ?? 0}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                      +{entry.challengeBonusPoints ?? 0} bonus
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="flex items-center gap-1 font-semibold">
                      <Trophy className="size-3.5 text-(--accent)" />
                      {entry.points}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                      total standing
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="flex items-center gap-1 font-semibold">
                      <Sparkles className="size-3.5 text-(--accent)" />
                      {entry.badgesUnlocked ?? 0}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                      achievements
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-(--accent)">
                    {getSurvivorStatusLabel(entry.status)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
