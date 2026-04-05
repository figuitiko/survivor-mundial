export const dynamic = "force-dynamic";

import { ArrowUpRight, Sparkles, Trophy } from "lucide-react";

import { BadgeIcon } from "@/components/gamification/badge-icon";
import { StreakCards } from "@/components/gamification/streak-cards";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { StreakCard } from "@/lib/types";
import { getSurvivorStatusLabel } from "@/lib/survivor";
import { getDashboardData, SurvivorStatus } from "@/lib/survivor-queries";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const currentMatchdayTitle =
    data.currentMatchday?.title ?? "Current Matchday";
  const challengeAccuracy =
    data.userStats && data.userStats.totalChallengeAnswers > 0
      ? Math.round(
          (data.userStats.correctChallengeAnswers /
            data.userStats.totalChallengeAnswers) *
            100,
        )
      : 0;

  const streakCards: StreakCard[] = [
    {
      title: "Survival Streak",
      current: data.userStats?.currentSurvivalStreak ?? data.user.currentStreak,
      longest: data.userStats?.longestSurvivalStreak ?? data.user.longestStreak,
      detail: `${getSurvivorStatusLabel(data.user.survivorStatus)} through the latest settled matchday.`,
    },
    {
      title: "Challenge Streak",
      current: data.userStats?.currentChallengeStreak ?? 0,
      longest: data.userStats?.longestChallengeStreak ?? 0,
      detail: `${challengeAccuracy}% answer accuracy on settled stat challenges.`,
    },
  ];

  const milestoneTitle =
    data.user.currentStreak >= data.user.streakGoal
      ? "Streak target cleared"
      : data.recentBadges[0]
        ? `Unlocked ${data.recentBadges[0].title}`
        : "Next personal milestone";
  const milestoneDetail =
    data.user.currentStreak >= data.user.streakGoal
      ? `You hit the ${data.user.streakGoal}-win target and banked ${data.totalStandingPoints} standing points.`
      : data.recentBadges[0]
        ? data.recentBadges[0].description
        : `You are ${Math.max(data.user.streakGoal - data.user.currentStreak, 0)} wins away from your ${data.user.streakGoal}-pick streak goal.`;
  const streakGoalProgress = Math.min(
    100,
    Math.round(
      (data.user.currentStreak / Math.max(data.user.streakGoal, 1)) * 100,
    ),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Control room"
        title="Quarterfinals at a glance"
        description="Your survivor pulse, challenge traction, fresh badges, and the next lock points that shape the global board."
        badge={getSurvivorStatusLabel(data.user.survivorStatus)}
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Milestone celebration</p>
              <h2 className="font-display mt-4 text-4xl">{milestoneTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-(--muted-foreground)">
                {milestoneDetail}
              </p>
            </div>
            <div className="rounded-full bg-(--accent-soft) p-4 text-(--accent)">
              {data.recentBadges[0] ? (
                <BadgeIcon
                  icon={data.recentBadges[0].icon}
                  className="size-5"
                />
              ) : (
                <Trophy className="size-5" />
              )}
            </div>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.7rem] border border-(--border) bg-white/75 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-(--muted-foreground)">
                Standing Points
              </p>
              <p className="font-display mt-3 text-5xl">
                {data.totalStandingPoints}
              </p>
              <p className="mt-3 text-sm text-(--muted-foreground)">
                Includes {data.user.challengeBonusPoints} challenge bonus
                points.
              </p>
            </article>
            <article className="rounded-[1.7rem] border border-(--border) bg-white/75 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-(--muted-foreground)">
                Pool Alive
              </p>
              <p className="font-display mt-3 text-5xl">{data.aliveCount}</p>
              <p className="mt-3 text-sm text-(--muted-foreground)">
                Entrants still standing in the tournament.
              </p>
            </article>
            <article className="rounded-[1.7rem] border border-(--border) bg-white/75 px-5 py-5">
              <p className="text-xs uppercase tracking-[0.24em] text-(--muted-foreground)">
                Goal Progress
              </p>
              <p className="font-display mt-3 text-5xl">
                {streakGoalProgress}%
              </p>
              <div className="mt-4 space-y-2">
                <Progress value={streakGoalProgress} />
                <p className="text-sm text-(--muted-foreground)">
                  {data.user.currentStreak}/{data.user.streakGoal} survivor
                  wins.
                </p>
              </div>
            </article>
          </div>
        </div>

        <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Latest unlocks</p>
              <h2 className="font-display mt-4 text-3xl">Recent badge drops</h2>
            </div>
            <Sparkles className="size-5 text-(--accent)" />
          </div>
          <div className="mt-6 space-y-3">
            {data.recentBadges.length === 0 ? (
              <EmptyState
                eyebrow="Badges"
                title="No badges yet"
                description="Win settled picks and string together challenge results to trigger achievements."
              />
            ) : (
              data.recentBadges.map((badge) => (
                <article
                  key={badge.id}
                  className="rounded-[1.6rem] border border-(--border) bg-white/75 px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-(--accent-soft) p-3 text-(--accent)">
                      <BadgeIcon icon={badge.icon} className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{badge.title}</p>
                        <Badge variant="accent">{badge.category}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-(--muted-foreground)">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <StreakCards cards={streakCards} streakGoal={data.user.streakGoal} />

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Upcoming picks</p>
              <h2 className="font-display mt-4 text-3xl">
                {data.currentMatchday
                  ? `${data.currentMatchday.title} is open.`
                  : "No open matchday."}
              </h2>
            </div>
            <ArrowUpRight className="size-5 text-(--accent)" />
          </div>
          <div className="mt-7 grid gap-4">
            {data.currentMatchday?.matches.map((match) => (
              <article
                key={match.id}
                className="grid gap-4 rounded-[1.8rem] border border-(--border) bg-white/70 px-5 py-5 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-(--muted-foreground)">
                    {currentMatchdayTitle}
                  </p>
                  <h3 className="font-display mt-2 text-2xl">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <p className="mt-2 text-sm text-(--muted-foreground)">
                    {match.venue}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-(--muted-foreground)">Status</p>
                  <p className="font-semibold">{match.status}</p>
                </div>
                <div className="text-sm">
                  <p className="text-(--muted-foreground)">Winner</p>
                  <p className="font-semibold capitalize">
                    {match.winner ?? "Open"}
                  </p>
                </div>
              </article>
            )) ?? (
              <EmptyState
                eyebrow="Matchday"
                title="No active matchday"
                description="Once settlement completes and a new matchday is seeded, fixtures will appear here."
              />
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
            <p className="eyebrow">Featured stat challenge</p>
            {data.featuredChallenge ? (
              <>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl">
                      {data.featuredChallenge.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-(--muted-foreground)">
                      {data.featuredChallenge.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      data.featuredChallenge.state === "OPEN"
                        ? "accent"
                        : "default"
                    }
                  >
                    {data.featuredChallenge.reward}
                  </Badge>
                </div>
                <div className="mt-7 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                      Difficulty
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {data.featuredChallenge.difficulty}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                      Lock
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {data.featuredChallenge.deadline}
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-(--muted-foreground)">
                      Entries submitted
                    </span>
                    <span className="font-semibold">
                      {data.featuredChallenge.joinCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">
                      {data.featuredChallenge.state}
                    </Badge>
                    {data.featuredChallenge.answerLabel ? (
                      <Badge variant="success">
                        {data.featuredChallenge.answerLabel}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                eyebrow="Challenges"
                title="No live challenge"
                description="Create or seed the next stat challenge and it will be surfaced here."
              />
            )}
          </div>

          <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
            <p className="eyebrow">Leaderboard pulse</p>
            <div className="mt-5 space-y-4">
              {data.leaderboardRows.slice(0, 4).map((entry, index) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-(--border) pb-4 last:border-b-0"
                >
                  <p className="font-display text-3xl">{index + 1}</p>
                  <div>
                    <p className="text-sm font-semibold">{entry.name}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
                      {entry.favoriteNation ?? "N/A"} · streak{" "}
                      {entry.currentStreak}
                    </p>
                  </div>
                  <p className="text-right text-sm font-semibold">
                    {entry.survivorPoints + entry.challengeBonusPoints} pts
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <p className="eyebrow">Pick history</p>
              <div className="mt-4 space-y-3">
                {data.recentPicks.map((pick) => (
                  <div
                    key={pick.id}
                    className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[color:var(--border)] bg-white/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {pick.selectedTeam} over {pick.opponent}
                      </p>
                      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                        {pick.matchday}
                      </p>
                    </div>
                    <Badge
                      variant={
                        pick.outcome === "WON"
                          ? "success"
                          : data.user.survivorStatus === SurvivorStatus.ALIVE
                            ? "default"
                            : "accent"
                      }
                    >
                      {pick.outcome}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
