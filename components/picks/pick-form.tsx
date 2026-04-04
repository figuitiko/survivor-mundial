"use client";

import { startTransition, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitSurvivalPick } from "@/app/(app)/picks/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MatchCard } from "@/lib/types";
import { pickSubmissionSchema, type PickSubmission } from "@/lib/validations/pick";

type PickFormProps = {
  matches: MatchCard[];
  currentPickMatchId?: string | null;
  currentPickTeam?: string | null;
};

export function PickForm({ matches, currentPickMatchId, currentPickTeam }: PickFormProps) {
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<PickSubmission>({
    resolver: zodResolver(pickSubmissionSchema),
    defaultValues: {
      matchId: currentPickMatchId ?? matches[0]?.id ?? "",
      selectedTeam: currentPickTeam ?? matches[0]?.homeTeam ?? "",
      confidence: 70
    }
  });

  const watchedMatchId = useWatch({
    control: form.control,
    name: "matchId"
  });
  const selectedMatch = matches.find((match) => match.id === watchedMatchId) ?? matches[0];

  useEffect(() => {
    const currentSelectedTeam = form.getValues("selectedTeam");
    const allowedTeams = [selectedMatch?.homeTeam, selectedMatch?.awayTeam].filter(Boolean);

    if (allowedTeams.length > 0 && !allowedTeams.includes(currentSelectedTeam)) {
      form.setValue("selectedTeam", allowedTeams[0] ?? "");
    }
  }, [form, selectedMatch]);

  const onSubmit = form.handleSubmit((values) => {
    setStatus("idle");
    setServerMessage("");

    startTransition(async () => {
      const result = await submitSurvivalPick(values);
      setStatus(result.status);
      setServerMessage(result.message);
    });
  });

  return (
    <form onSubmit={onSubmit} className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
      <p className="eyebrow">Submit survivor pick</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Match
          <select
            className="h-12 rounded-2xl border border-[color:var(--border)] bg-white/70 px-4"
            {...form.register("matchId")}
          >
            {matches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.homeTeam} vs {match.awayTeam}
              </option>
            ))}
          </select>
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.matchId?.message}</span>
        </label>

        <label className="grid gap-2 text-sm">
          Selected nation
          <select
            className="h-12 rounded-2xl border border-[color:var(--border)] bg-white/70 px-4"
            {...form.register("selectedTeam")}
          >
            {[selectedMatch?.homeTeam, selectedMatch?.awayTeam].filter(Boolean).map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.selectedTeam?.message}</span>
        </label>

        <label className="grid gap-2 text-sm md:col-span-2">
          Confidence meter
          <Input
            type="number"
            min={1}
            max={100}
            {...form.register("confidence", { valueAsNumber: true })}
          />
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.confidence?.message}</span>
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[color:var(--muted-foreground)]">
          Current fixture: {selectedMatch?.kickoff} at {selectedMatch?.venue}
        </p>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save survivor pick
        </Button>
      </div>

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
