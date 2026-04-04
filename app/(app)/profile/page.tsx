import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title="Keep your pool identity sharp and your streak goal explicit."
        description="This section captures the player record that future auth and Prisma-backed preferences will update."
        badge="Draft preferences"
      />

      <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
          <p className="eyebrow">Player card</p>
          <h2 className="font-display mt-5 text-4xl">{profile.name}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
            @{profile.username}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Badge variant="accent">{profile.favoriteNation}</Badge>
            <Badge variant="default">Goal {profile.streakGoal} wins</Badge>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-[color:var(--muted-foreground)]">
            {profile.bio}
          </p>
        </section>

        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
