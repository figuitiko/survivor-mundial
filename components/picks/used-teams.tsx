import type { UsedTeam } from "@/lib/types";

export function UsedTeams({ teams }: { teams: UsedTeam[] }) {
  return (
    <section className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
      <p className="eyebrow">Used teams</p>
      <h2 className="font-display mt-4 text-3xl">Tournament picks already burned.</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2"
          >
            <p className="text-sm font-semibold">{team.team}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
              {team.matchday} · {team.outcome}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
