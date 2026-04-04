import Link from "next/link";
import { ArrowRight, ShieldCheck, Trophy, Zap } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { dashboardMetrics, appHighlights, matchdayMatches } from "@/lib/mock-data";
import { formatPercent } from "@/lib/utils";

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(244,194,98,0.34),_transparent_20%),linear-gradient(135deg,_#173a2b_0%,_#0c1d17_54%,_#09110d_100%)] text-[#f8f1e1]">
        <div className="grain absolute inset-0 opacity-70" />
        <div className="pitch-lines absolute inset-6 rounded-[2.5rem] border border-white/10 md:inset-8" />
        <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-6 py-8 md:px-10 lg:px-14">
          <header className="flex items-center justify-between">
            <BrandMark className="[&_p:first-child]:text-white/60 [&_p:last-child]:text-white" />
            <div className="hidden text-xs uppercase tracking-[0.28em] text-white/60 md:block">
              MVP Phase 1
            </div>
          </header>

          <div className="grid flex-1 items-center gap-16 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-10">
            <div className="max-w-4xl">
              <p className="eyebrow stagger-in !text-white/70 before:bg-white/20">World Cup pool control room</p>
              <h1 className="font-display stagger-in mt-6 text-[clamp(4rem,9vw,8.5rem)] leading-[0.9] tracking-[-0.04em]">
                Survivor
                <span className="block text-[#f4c262]">Mundial</span>
              </h1>
              <p className="stagger-in mt-7 max-w-xl text-base leading-8 text-white/72 md:text-lg">
                A deliberate matchday workspace for survivor picks, stat challenges, and live
                leaderboard pressure. Built to feel like a premium tournament almanac, not another
                dashboard grid.
              </p>
              <div className="stagger-in mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard">
                  <Button className="w-full bg-[#f4c262] text-[#143425] hover:bg-[#f8d688] sm:w-auto">
                    Enter app
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <a href="#overview">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:border-white sm:w-auto">
                    Review feature shell
                  </Button>
                </a>
              </div>
            </div>

            <div className="stagger-in grid gap-5">
              <div className="section-shell relative rounded-[2.25rem] border-white/10 bg-white/8 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/55">Survivor pressure</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                  {dashboardMetrics.map((metric) => (
                    <div key={metric.label} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                      <p className="text-sm text-white/60">{metric.label}</p>
                      <p className="font-display mt-2 text-5xl">{metric.value}</p>
                      <p className="mt-2 text-sm leading-6 text-white/62">{metric.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {matchdayMatches.map((match) => (
                  <div key={match.id} className="rounded-[1.75rem] border border-white/10 bg-white/6 px-5 py-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/45">{match.group}</p>
                    <p className="mt-3 font-display text-2xl">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                    <p className="mt-2 text-sm text-white/58">
                      {match.kickoff} · {match.venue}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[#f4c262]">
                      Confidence {formatPercent(match.confidence)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="mx-auto grid max-w-[1500px] gap-8 px-6 py-16 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-24">
        <div className="section-shell rounded-[2.5rem] px-7 py-8 md:px-10 md:py-10">
          <p className="eyebrow">What ships now</p>
          <h2 className="font-display mt-5 text-4xl">The first phase is a polished shell, not a fake backend.</h2>
          <div className="mt-8 space-y-5 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {appHighlights.map((highlight) => (
              <p key={highlight} className="border-l border-[color:var(--border)] pl-4">
                {highlight}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          <div className="section-shell rounded-[2rem] px-6 py-6">
            <ShieldCheck className="size-5 text-[color:var(--accent)]" />
            <h3 className="font-display mt-4 text-2xl">Protected app layout</h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              Route group and session scaffold prepared for auth providers in the next phase.
            </p>
          </div>
          <div className="section-shell rounded-[2rem] px-6 py-6">
            <Zap className="size-5 text-[color:var(--accent)]" />
            <h3 className="font-display mt-4 text-2xl">Server action stubs</h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              Picks, challenge joins, and profile updates validate with Zod before future writes.
            </p>
          </div>
          <div className="section-shell rounded-[2rem] px-6 py-6">
            <Trophy className="size-5 text-[color:var(--accent)]" />
            <h3 className="font-display mt-4 text-2xl">Tournament-style UI</h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted-foreground)]">
              Editorial sports direction on the landing page, restrained product UI inside the app.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
