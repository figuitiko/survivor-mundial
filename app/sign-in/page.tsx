import { redirect } from "next/navigation";
import { Flame, ShieldCheck, Trophy } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { CredentialsAuthPanel } from "@/components/auth/credentials-auth-panel";
import { GoogleSignInForm } from "@/components/auth/google-sign-in-form";
import { getSession, googleAuthEnabled } from "@/lib/auth";

const authHighlights = [
  {
    icon: ShieldCheck,
    title: "Protected survivor workspace",
    detail: "Dashboard, picks, challenges, leaderboard, and profile are session-gated."
  },
  {
    icon: Flame,
    title: "Roles ready for growth",
    detail: "Accounts persist USER and ADMIN roles without changing the main gameplay schema."
  },
  {
    icon: Trophy,
    title: "Low-friction entry",
    detail: "Google remains primary, while credentials support stays available as a secondary path."
  }
];

export default async function SignInPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f6f1e5_0%,_#efe5d2_100%)]">
      <div className="mx-auto max-w-[1480px] px-6 py-8 md:px-10 lg:px-14 lg:py-10">
        <BrandMark />

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="section-shell rounded-[2.2rem] px-6 py-7 md:px-8 md:py-8">
            <p className="eyebrow">Authentication</p>
            <h1 className="font-display mt-5 text-5xl leading-[0.92] tracking-[-0.04em]">
              Enter the
              <span className="block text-[color:var(--accent)]">Survivor Mundial</span>
              board.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)] md:text-base">
              Sign in to access protected matchday picks, stat challenges, badges, and the live
              leaderboard. Google is the fastest path in; credentials remain available if you need
              them.
            </p>

            <div className="mt-8 grid gap-4">
              {authHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[1.7rem] border border-[color:var(--border)] bg-white/70 px-5 py-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent)]">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold">{item.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4">
            <GoogleSignInForm enabled={googleAuthEnabled} />
            <CredentialsAuthPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
