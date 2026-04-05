import { Flame, Target } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import type { StreakCard } from "@/lib/types";

type StreakCardsProps = {
  cards: StreakCard[];
  streakGoal: number;
};

export function StreakCards({ cards, streakGoal }: StreakCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card, index) => {
        const progress = Math.min(
          100,
          Math.round((card.current / Math.max(streakGoal, 1)) * 100),
        );

        return (
          <article
            key={card.title}
            className="rounded-[1.8rem] border border-(--border) bg-white/75 px-5 py-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-(--muted-foreground)">
                  {card.title}
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <p className="font-display text-5xl">
                    {String(card.current).padStart(2, "0")}
                  </p>
                  <p className="pb-2 text-sm text-(--muted-foreground)">
                    best {card.longest}
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-(--accent-soft) p-3 text-(--accent)">
                {index === 0 ? (
                  <Flame className="size-4" />
                ) : (
                  <Target className="size-4" />
                )}
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-(--muted-foreground)">
              {card.detail}
            </p>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                <span>Goal progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
