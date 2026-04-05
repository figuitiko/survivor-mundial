import { Crown, Flame, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LeaderboardEntry } from "@/lib/types";
import { getSurvivorStatusLabel } from "@/lib/survivor";

type LeaderboardPodiumProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardPodium({ entries }: LeaderboardPodiumProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {entries.map((entry, index) => (
        <article
          key={entry.rank}
          className={`rounded-[1.9rem] border px-5 py-5 ${
            index === 0
              ? "border-(--accent) bg-(--accent-soft)/70"
              : "border-(--border) bg-white/75"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-(--muted-foreground)">
                Rank {entry.rank}
              </p>
              <h2 className="font-display mt-3 text-3xl">{entry.player}</h2>
              <p className="mt-1 text-sm text-(--muted-foreground)">
                {entry.nation}
              </p>
            </div>
            <div className="rounded-full bg-white/80 p-3 text-(--accent)">
              {index === 0 ? (
                <Crown className="size-4" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {entry.isCurrentUser ? <Badge variant="accent">You</Badge> : null}
            <Badge variant={entry.status === "ALIVE" ? "success" : "default"}>
              {getSurvivorStatusLabel(entry.status)}
            </Badge>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-(--muted-foreground)">
                Points
              </p>
              <p className="mt-2 font-semibold">{entry.points}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-(--muted-foreground)">
                Survivor
              </p>
              <p className="mt-2 flex items-center gap-1 font-semibold">
                <Flame className="size-3.5" />
                {entry.streak}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-(--muted-foreground)">
                Badges
              </p>
              <p className="mt-2 flex items-center gap-1 font-semibold">
                <Sparkles className="size-3.5" />
                {entry.badgesUnlocked ?? 0}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
