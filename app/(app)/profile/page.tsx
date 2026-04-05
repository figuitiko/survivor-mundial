export const dynamic = "force-dynamic";

import { Award, Flame, Target, Trophy } from "lucide-react";

import { AchievementGrid } from "@/components/gamification/achievement-grid";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { Badge } from "@/components/ui/badge";
import { getSurvivorStatusLabel } from "@/lib/survivor";
import { getProfileData } from "@/lib/survivor-queries";

export default async function ProfilePage() {
  const { badges, profile, stats, user } = await getProfileData();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title="Track your identity, streak ceiling, and achievement shelf."
        description="Your profile now reflects persisted survivor stats, challenge form, and badge unlocks recalculated from tournament results."
        badge={getSurvivorStatusLabel(user.survivorStatus)}
      />

      <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <p className="eyebrow">Player card</p>
          <h2 className="font-display mt-5 text-4xl">{profile.name}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-(--muted-foreground)">
            @{profile.username}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="accent">{profile.favoriteNation}</Badge>
            <Badge variant="default">Goal {profile.streakGoal} wins</Badge>
            <Badge
              variant={user.survivorStatus === "ALIVE" ? "success" : "default"}
            >
              {getSurvivorStatusLabel(user.survivorStatus)}
            </Badge>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-(--muted-foreground)">
            {profile.bio}
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <article className="rounded-3xl border border-(--border) bg-white/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                Standing Points
              </p>
              <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
                <Trophy className="size-4 text-(--accent)" />
                {stats?.totalPoints ??
                  user.survivorPoints + user.challengeBonusPoints}
              </p>
            </article>
            <article className="rounded-3xl border border-(--border) bg-white/70 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-(--muted-foreground)">
                Badges
              </p>
              <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
                <Award className="size-4 text-(--accent)" />
                {stats?.badgesUnlocked ?? badges.length}
              </p>
            </article>
          </div>
        </section>

        <ProfileForm profile={profile} />
      </div>

      {stats ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="section-shell rounded-[1.9rem] px-6 py-6">
            <p className="text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
              Survivor Form
            </p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
              <Flame className="size-5 text-(--accent)" />
              {stats.survivorWins}-{stats.survivorLosses}
            </p>
            <p className="mt-2 text-sm text-(--muted-foreground)">
              {stats.settledPicks} settled picks completed.
            </p>
          </article>
          <article className="section-shell rounded-[1.9rem] px-6 py-6">
            <p className="text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
              Survival Streak
            </p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
              <Flame className="size-5 text-(--accent)" />
              {stats.currentSurvivalStreak}
            </p>
            <p className="mt-2 text-sm text-(--muted-foreground)">
              Longest run: {stats.longestSurvivalStreak}
            </p>
          </article>
          <article className="section-shell rounded-[1.9rem] px-6 py-6">
            <p className="text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
              Challenge Form
            </p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
              <Target className="size-5 text-(--accent)" />
              {stats.correctChallengeAnswers}/{stats.totalChallengeAnswers}
            </p>
            <p className="mt-2 text-sm text-(--muted-foreground)">
              Current streak: {stats.currentChallengeStreak}
            </p>
          </article>
          <article className="section-shell rounded-[1.9rem] px-6 py-6">
            <p className="text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
              Bonus Banked
            </p>
            <p className="mt-3 flex items-center gap-2 text-2xl font-semibold">
              <Trophy className="size-5 text-(--accent)" />+
              {stats.totalBonusPoints}
            </p>
            <p className="mt-2 text-sm text-(--muted-foreground)">
              Longest challenge streak: {stats.longestChallengeStreak}
            </p>
          </article>
        </section>
      ) : (
        <EmptyState
          eyebrow="Stats"
          title="No calculated stats yet"
          description="Seed or settle picks and challenges to populate the player record."
        />
      )}

      <section className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Achievements</p>
            <h2 className="font-display mt-4 text-3xl">Badge cabinet</h2>
          </div>
          <Badge variant="accent">{badges.length} unlocked</Badge>
        </div>
        <div className="mt-6">
          <AchievementGrid achievements={badges} />
        </div>
      </section>
    </div>
  );
}
