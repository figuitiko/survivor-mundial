"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { joinChallenge } from "@/app/(app)/challenges/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StatChallenge } from "@/lib/types";
import { challengeJoinSchema, type ChallengeJoinInput } from "@/lib/validations/challenge";

type ChallengeJoinFormProps = {
  challenges: StatChallenge[];
};

export function ChallengeJoinForm({ challenges }: ChallengeJoinFormProps) {
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ChallengeJoinInput>({
    resolver: zodResolver(challengeJoinSchema),
    defaultValues: {
      challengeId: challenges.find((challenge) => !challenge.joined)?.id ?? challenges[0]?.id ?? "",
      statCall: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    setStatus("idle");
    setServerMessage("");

    startTransition(async () => {
      const result = await joinChallenge(values);
      setStatus(result.status);
      setServerMessage(result.message);
      if (result.status === "success") {
        form.reset({ ...values, statCall: "" });
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
      <p className="eyebrow">Join challenge</p>
      <div className="mt-6 grid gap-6">
        <label className="grid gap-2 text-sm">
          Challenge
          <select
            className="h-12 rounded-2xl border border-[color:var(--border)] bg-white/70 px-4"
            {...form.register("challengeId")}
          >
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.challengeId?.message}</span>
        </label>

        <label className="grid gap-2 text-sm">
          Stat call
          <Input
            placeholder="Example: Brazil records the most total shots."
            {...form.register("statCall")}
          />
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.statCall?.message}</span>
        </label>
      </div>
      <Button className="mt-8" type="submit">
        Enter challenge
      </Button>
      {serverMessage ? (
        <p
          className={`mt-4 text-sm ${status === "success" ? "text-[color:var(--accent)]" : "text-[#aa3e29]"}`}
        >
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
