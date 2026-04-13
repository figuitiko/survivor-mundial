"use client";

import { useActionState, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";

import {
  credentialsRegisterAction,
  type AuthActionState
} from "@/app/sign-in/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {
  status: "idle",
  message: ""
};

export function CredentialsAuthPanel() {
  const [mode, setMode] = useState<"sign-in" | "register">("sign-in");
  const [registerState, registerFormAction, registerPending] = useActionState(
    credentialsRegisterAction,
    initialState
  );
  const [signInState, setSignInState] = useState<AuthActionState>(initialState);
  const [signInPending, setSignInPending] = useState(false);

  const state = mode === "sign-in" ? signInState : registerState;
  const pending = mode === "sign-in" ? signInPending : registerPending;
  const action = mode === "register" ? registerFormAction : undefined;

  async function handleCredentialsSignIn(formData: FormData) {
    setSignInPending(true);
    setSignInState(initialState);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        setSignInState({
          status: "error",
          message: "Invalid email or password."
        });
        return;
      }

      if (!result?.url) {
        setSignInState({
          status: "error",
          message: "We could not complete sign-in. Please try again."
        });
        return;
      }

      window.location.assign(result.url);
    } catch {
      setSignInState({
        status: "error",
        message: "We could not complete sign-in. Please try again."
      });
    } finally {
      setSignInPending(false);
    }
  }

  return (
    <div className="section-shell rounded-[2rem] px-6 py-6 md:px-8 md:py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Secondary sign-in</p>
          <h2 className="font-display mt-5 text-3xl">Email and password</h2>
        </div>
        <div
          aria-label="Authentication mode"
          className="inline-flex rounded-full border border-[color:var(--border)] bg-white/70 p-1"
          role="group"
        >
          <button
            aria-pressed={mode === "sign-in"}
            type="button"
            onClick={() => setMode("sign-in")}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
              mode === "sign-in"
                ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                : "text-[color:var(--muted-foreground)]"
            )}
          >
            Sign in
          </button>
          <button
            aria-pressed={mode === "register"}
            type="button"
            onClick={() => setMode("register")}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
              mode === "register"
                ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                : "text-[color:var(--muted-foreground)]"
            )}
          >
            Create
          </button>
        </div>
      </div>

      <p className="mt-4 max-w-md text-sm leading-7 text-[color:var(--muted-foreground)]">
        {mode === "sign-in"
          ? "Sign in with your email and password if you prefer not to use Google."
          : "Create an account with just your name, email, and password. Username is generated automatically."}
      </p>

      <form
        action={action}
        className="mt-7 grid gap-4"
        onSubmit={
          mode === "sign-in"
            ? async (event) => {
                event.preventDefault();
                await handleCredentialsSignIn(new FormData(event.currentTarget));
              }
            : undefined
        }
      >
        {mode === "register" ? (
          <label className="grid gap-2 text-sm">
            Name
            <Input name="name" placeholder="Frank Ortega" required />
          </label>
        ) : null}
        <label className="grid gap-2 text-sm">
          Email
          <Input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label className="grid gap-2 text-sm">
          Password
          <Input name="password" type="password" placeholder="At least 8 characters" required />
        </label>
        <Button className="mt-2 w-full justify-center" disabled={pending} type="submit">
          {mode === "sign-in" ? (
            <>
              <LogIn className="mr-2 size-4" />
              {pending ? "Signing in..." : "Sign in with email"}
            </>
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              {pending ? "Creating account..." : "Create account"}
            </>
          )}
        </Button>
        {state.message ? (
          <p
            aria-live="polite"
            className={cn(
              "text-sm",
              state.status === "error" ? "text-[#aa3e29]" : "text-[color:var(--accent)]"
            )}
            role={state.status === "error" ? "alert" : "status"}
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
