import { ArrowUpRight, Flame, Goal, Medal } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { dashboardMetrics, leaderboard, matchdayMatches, statChallenges } from "@/lib/mock-data";

export default function DashboardPage() {
  const featuredChallenge = statChallenges[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Control room"
        title="Quarterfinals at a glance"
        description="Your survivor pulse, challenge traction, and the next decisions that can shift the leaderboard before kickoff."
        badge="Mocked live data"
      />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <div className="grid gap-6 md:grid-cols-3">
            {dashboardMetrics.map((metric, index) => (
              <article key={metric.label} className="border-b border-[color:var(--border)] pb-6 last:border-b-0 last:pb-0 md:border-b-0 md:border-r md:pb-0 md:last:border-r-0 md:pr-6">
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                  {metric.label}
                </p>
                <p className="font-display mt-3 text-5xl">{metric.value}</p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                  {metric.detail}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  {index === 0 ? <Flame className="size-3.5" /> : index === 1 ? <Medal className="size-3.5" /> : <Goal className="size-3.5" />}
                  Match-ready
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <p className="eyebrow">Featured stat challenge</p>
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl">{featuredChallenge.title}</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--muted-foreground)]">
                {featuredChallenge.description}
              </p>
            </div>
            <Badge variant="success">{featuredChallenge.reward}</Badge>
          </div>
          <div className="mt-7 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[color:var(--muted-foreground)]">Join rate</span>
              <span className="font-semibold">61%</span>
            </div>
            <Progress value={61} />
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            {featuredChallenge.deadline}
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Upcoming picks</p>
              <h2 className="font-display mt-4 text-3xl">Three matches still open for lock.</h2>
            </div>
            <ArrowUpRight className="size-5 text-[color:var(--accent)]" />
          </div>
          <div className="mt-7 grid gap-4">
            {matchdayMatches.map((match) => (
              <article
                key={match.id}
                className="grid gap-4 rounded-[1.8rem] border border-[color:var(--border)] bg-white/70 px-5 py-5 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-[color:var(--muted-foreground)]">
                    {match.group}
                  </p>
                  <h3 className="font-display mt-2 text-2xl">
                    {match.homeTeam} vs {match.awayTeam}
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                    {match.kickoff} · {match.venue}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-[color:var(--muted-foreground)]">Confidence</p>
                  <p className="font-semibold">{Math.round(match.confidence * 100)}%</p>
                </div>
                <div className="text-sm">
                  <p className="text-[color:var(--muted-foreground)]">Trend</p>
                  <p className="font-semibold capitalize">{match.trend}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <EmptyState
            eyebrow="Leaderboard"
            title="No standings yet"
            description="Once entrants submit picks, rankings will appear here with streak and challenge points."
          />
        ) : (
          <div className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
            <p className="eyebrow">Leaderboard pulse</p>
            <div className="mt-6 space-y-4">
              {leaderboard.slice(0, 4).map((entry) => (
                <div
                  key={entry.rank}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[color:var(--border)] pb-4 last:border-b-0"
                >
                  <p className="font-display text-3xl">{entry.rank}</p>
                  <div>
                    <p className="text-sm font-semibold">{entry.player}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                      {entry.nation} · streak {entry.streak}
                    </p>
                  </div>
                  <p className="text-right text-sm font-semibold">{entry.points} pts</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
