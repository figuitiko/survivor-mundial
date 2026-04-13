"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

type GoogleSignInFormProps = {
  enabled: boolean;
};

export function GoogleSignInForm({ enabled }: GoogleSignInFormProps) {
  return (
    <div className="section-shell rounded-[2rem] px-6 py-6 md:px-8 md:py-8">
      <p className="eyebrow">Primary sign-in</p>
      <h2 className="font-display mt-5 text-3xl">Continue with Google</h2>
      <p className="mt-4 max-w-md text-sm leading-7 text-[color:var(--muted-foreground)]">
        Fastest path into the pool. Use your Google account and land directly in the protected app.
      </p>
      <Button
        className="mt-8 w-full justify-center bg-[#f2bf65] text-[#102a20] hover:bg-[#f7cf88]"
        disabled={!enabled}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        type="button"
      >
        Continue with Google
        <ArrowRight className="ml-2 size-4" />
      </Button>
      <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
        <ShieldCheck className="size-3.5 text-[color:var(--accent)]" />
        {enabled ? "Google is the default entry point" : "Add Google auth env vars to enable"}
      </div>
    </div>
  );
}
