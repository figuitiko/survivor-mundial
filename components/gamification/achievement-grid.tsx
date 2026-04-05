import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { BadgeIcon } from "@/components/gamification/badge-icon";
import type { Achievement } from "@/lib/types";

type AchievementGridProps = {
  achievements: Achievement[];
};

function getVariant(category: Achievement["category"]) {
  switch (category) {
    case "SURVIVAL":
      return "success" as const;
    case "CHALLENGE":
      return "accent" as const;
    case "MILESTONE":
      return "default" as const;
  }
}

export function AchievementGrid({ achievements }: AchievementGridProps) {
  if (achievements.length === 0) {
    return (
      <EmptyState
        eyebrow="Achievements"
        title="No badges unlocked yet"
        description="Keep stacking settled wins and challenge hits to trigger your first milestone badge."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {achievements.map((achievement) => (
        <article
          key={achievement.id}
          className="rounded-[1.8rem] border border-[color:var(--border)] bg-white/75 px-5 py-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent)]">
                <BadgeIcon icon={achievement.icon} className="size-4" />
              </div>
              <div>
                <h3 className="font-display text-2xl">{achievement.title}</h3>
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                  {new Date(achievement.awardedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Badge variant={getVariant(achievement.category)}>
              {achievement.category}
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {achievement.description}
          </p>
        </article>
      ))}
    </div>
  );
}
