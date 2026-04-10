import Link from "next/link";
import {
  ArrowRight,
  ChartColumnBig,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { matchdayMatches } from "@/lib/mock-data";
import { formatNumber, formatPercent } from "@/lib/utils";

const heroStats = [
  {
    label: "Active entrants",
    value: formatNumber(412),
    detail: "Still alive after the latest settlement cycle."
  },
  {
    label: "Open challenge pool",
    value: "+240",
    detail: "Bonus points on the board before quarterfinal lock."
  },
  {
    label: "Top live streak",
    value: "06",
    detail: "Current pace to beat on the global leaderboard."
  }
];

const featurePillars = [
  {
    icon: ShieldCheck,
    title: "Survivor logic with consequences",
    description:
      "One pick each matchday, no reused teams, kickoff locks, and elimination all enforced server-side."
  },
  {
    icon: Target,
    title: "Stat challenges with upside",
    description:
      "Call the side markets that matter, turn sharp reads into bonus points, and pressure the main table."
  },
  {
    icon: Trophy,
    title: "A leaderboard that feels alive",
    description:
      "Track form, streaks, badges, and momentum shifts instead of staring at a flat spreadsheet."
  }
];

const storySteps = [
  {
    step: "01",
    title: "Scout the slate",
    description:
      "Read the upcoming matchday like a tournament editor: venues, tempo, pressure spots, and no-repeat constraints."
  },
  {
    step: "02",
    title: "Lock your edge",
    description:
      "Submit a single survivor call and stack optional stat challenge answers before the whistle shuts the market."
  },
  {
    step: "03",
    title: "Climb or collapse",
    description:
      "Settlements update streaks, badges, survival status, and the leaderboard without trusting client-side state."
  }
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(145deg,_#0f261d_0%,_#143728_42%,_#09130f_100%)] text-[#f7f0df]">
        <div className="grain absolute inset-0 opacity-60" />
        <div className="pitch-lines absolute inset-5 rounded-[2.6rem] border border-white/10 md:inset-8" />
        <div className="stadium-beams absolute inset-x-0 top-0 h-48 opacity-80" />
        <div className="relative mx-auto max-w-[1500px] px-6 pb-16 pt-8 md:px-10 lg:px-14 lg:pb-24">
          <header className="flex items-center justify-between gap-4">
            <BrandMark className="[&_p:first-child]:text-white/55 [&_p:last-child]:text-white" />
            <div className="hidden rounded-full border border-white/12 bg-white/7 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/68 md:block">
              Tournament control room
            </div>
          </header>

          <div className="grid gap-12 pb-10 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:pb-16 lg:pt-18">
            <div className="max-w-4xl">
              <p className="eyebrow stagger-in !text-white/70 before:bg-white/18">
                Survivor pool meets matchday theatre
              </p>
              <h1 className="font-display stagger-in mt-6 text-[clamp(4.2rem,9vw,8.8rem)] leading-[0.88] tracking-[-0.05em]">
                Win the
                <span className="block text-[#f2bf65]">Mundial</span>
                <span className="block text-[0.42em] leading-none tracking-[0.08em] text-white/58">
                  one lock at a time
                </span>
              </h1>
              <p className="stagger-in mt-7 max-w-2xl text-base leading-8 text-white/74 md:text-lg">
                Survivor Mundial turns a World Cup pool into a sharper spectacle: one-pick tension,
                stat challenge swings, badge hunts, and a leaderboard that feels like a live match
                broadcast instead of admin software.
              </p>
              <div className="stagger-in mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard">
                  <Button className="w-full bg-[#f2bf65] text-[#102a20] hover:bg-[#f7cf88] sm:w-auto">
                    Enter the app
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <a href="#experience">
                  <Button
                    variant="outline"
                    className="w-full border-white/18 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 sm:w-auto"
                  >
                    Explore the format
                  </Button>
                </a>
              </div>

              <div className="stagger-in mt-12 grid gap-3 md:grid-cols-3">
                {heroStats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-[1.7rem] border border-white/10 bg-white/6 px-5 py-5 backdrop-blur"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/52">
                      {stat.label}
                    </p>
                    <p className="font-display mt-3 text-5xl text-[#f7f0df]">{stat.value}</p>
                    <p className="mt-3 text-sm leading-6 text-white/64">{stat.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="stagger-in grid gap-4">
              <div className="scoreboard-shell rounded-[2.35rem] border border-white/12 px-6 py-6 text-white md:px-7 md:py-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/48">
                      Quarterfinal watch
                    </p>
                    <h2 className="font-display mt-4 text-4xl leading-none">
                      Pressure board
                    </h2>
                  </div>
                  <div className="rounded-full border border-[#f2bf65]/30 bg-[#f2bf65]/12 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[#f2bf65]">
                    Lock window open
                  </div>
                </div>

                <div className="mt-7 grid gap-3">
                  {matchdayMatches.map((match, index) => (
                    <article
                      key={match.id}
                      className="rounded-[1.55rem] border border-white/10 bg-black/12 px-4 py-4 backdrop-blur"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-white/48">
                          Match {index + 1}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#f2bf65]">
                          {match.group}
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div>
                          <p className="font-display text-2xl">{match.homeTeam}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/46">
                            {match.venue}
                          </p>
                        </div>
                        <div className="rounded-full border border-white/12 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-white/60">
                          Vs
                        </div>
                        <div className="text-right">
                          <p className="font-display text-2xl">{match.awayTeam}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/46">
                            {match.kickoff}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                        <span className="text-white/58">Projected confidence</span>
                        <span className="font-semibold text-[#f2bf65]">
                          {formatPercent(match.confidence)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/44">
                      Survivor
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      <Flame className="size-4 text-[#f2bf65]" />
                      Streaks carry weight
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/44">
                      Challenges
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="size-4 text-[#f2bf65]" />
                      Bonus points swing rank
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/44">
                      Badges
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      <Trophy className="size-4 text-[#f2bf65]" />
                      Milestones celebrate form
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="experience"
        className="relative mx-auto max-w-[1500px] px-6 py-16 md:px-10 lg:px-14 lg:py-24"
      >
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="section-shell rounded-[2.4rem] px-7 py-8 md:px-9 md:py-10">
            <p className="eyebrow">Why it feels different</p>
            <h2 className="font-display mt-5 max-w-xl text-4xl leading-tight">
              Built like a tournament magazine, not a generic picks product.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">
              The app now has real settlement, streak, badge, and profile systems underneath it.
              The homepage should sell that pressure and personality immediately, not look like a
              placeholder SaaS template.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featurePillars.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="section-shell rounded-[2rem] px-6 py-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-display mt-5 text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="section-shell rounded-[2.4rem] px-7 py-8 md:px-9 md:py-9">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Format rhythm</p>
                <h2 className="font-display mt-4 text-3xl">Three beats that drive the product</h2>
              </div>
              <ChartColumnBig className="hidden size-5 text-[color:var(--accent)] md:block" />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {storySteps.map((item) => (
                <article
                  key={item.step}
                  className="rounded-[1.8rem] border border-[color:var(--border)] bg-white/65 px-5 py-5"
                >
                  <p className="font-display text-4xl text-[color:var(--accent)]">{item.step}</p>
                  <h3 className="font-display mt-5 text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-[#123d2e] bg-[#123d2e] px-7 py-8 text-[#f7f1e5] shadow-[0_28px_80px_rgba(7,18,13,0.24)] md:px-9 md:py-9">
            <p className="eyebrow !text-white/70 before:bg-white/22">Final pitch</p>
            <h2 className="font-display mt-5 text-4xl leading-tight text-[#f7f1e5]">
              Make every matchday feel like knockout football.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/82">
              The shell is already backed by survivor logic, challenge settlement, streak tracking,
              badges, and richer standings. This landing page now frames the product around tension,
              stakes, and tournament identity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard">
                <Button className="w-full bg-[#f2bf65] text-[#102a20] hover:bg-[#f7cf88] sm:w-auto">
                  Open dashboard
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  className="w-full border-white/34 bg-transparent text-[#f7f1e5] hover:border-white/50 hover:bg-white/8 sm:w-auto"
                >
                  View leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
