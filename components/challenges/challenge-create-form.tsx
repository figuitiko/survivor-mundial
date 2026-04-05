"use client";

import { startTransition, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createChallenge } from "@/app/(app)/challenges/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createChallengeSchema,
  type CreateChallengeInput,
} from "@/lib/validations/challenge";

type MatchdayChoice = {
  id: string;
  title: string;
  matches: {
    id: string;
    label: string;
  }[];
};

type ChallengeCreateFormProps = {
  matchdays: MatchdayChoice[];
};

const challengeTypeOptions = [
  { value: "BOTH_TEAMS_SCORE", label: "Both teams score" },
  { value: "OVER_25_GOALS", label: "Over 2.5 goals" },
  { value: "RED_CARD_YES_NO", label: "Red card yes/no" },
  { value: "MATCH_WITH_MOST_GOALS", label: "Match with most goals" },
  { value: "UNDERDOG_AVOIDS_DEFEAT", label: "Underdog avoids defeat" },
] as const;

export function ChallengeCreateForm({ matchdays }: ChallengeCreateFormProps) {
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<CreateChallengeInput>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      matchdayId: matchdays[0]?.id ?? "",
      matchId: "",
      slug: "",
      title: "",
      description: "",
      type: "BOTH_TEAMS_SCORE",
      difficulty: "MEDIUM",
      bonusPoints: 40,
      lockAt: "",
      options: [
        { label: "Yes", value: "yes", sortOrder: 0 },
        { label: "No", value: "no", sortOrder: 1 },
      ],
    },
  });

  const selectedMatchdayId = useWatch({
    control: form.control,
    name: "matchdayId",
  });
  const selectedMatchday = useMemo(
    () =>
      matchdays.find((matchday) => matchday.id === selectedMatchdayId) ??
      matchdays[0],
    [matchdays, selectedMatchdayId],
  );

  const onSubmit = form.handleSubmit((values) => {
    setStatus("idle");
    setServerMessage("");

    startTransition(async () => {
      const result = await createChallenge(values);
      setStatus(result.status);
      setServerMessage(result.message);
      if (result.status === "success") {
        form.reset({
          ...values,
          slug: "",
          title: "",
          description: "",
        });
      }
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8"
    >
      <p className="eyebrow">Create challenge</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Matchday
          <select
            className="h-12 rounded-2xl border border-(--border) bg-white/70 px-4"
            {...form.register("matchdayId")}
          >
            {matchdays.map((matchday) => (
              <option key={matchday.id} value={matchday.id}>
                {matchday.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Match target
          <select
            className="h-12 rounded-2xl border border-(--border) bg-white/70 px-4"
            {...form.register("matchId")}
          >
            <option value="">Whole slate</option>
            {selectedMatchday?.matches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Slug
          <Input
            {...form.register("slug")}
            placeholder="match-with-most-goals"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Bonus points
          <Input
            type="number"
            min={1}
            max={500}
            {...form.register("bonusPoints", { valueAsNumber: true })}
          />
        </label>
        <label className="grid gap-2 text-sm md:col-span-2">
          Title
          <Input
            {...form.register("title")}
            placeholder="Quarterfinal goal frenzy"
          />
        </label>
        <label className="grid gap-2 text-sm md:col-span-2">
          Description
          <Textarea {...form.register("description")} />
        </label>
        <label className="grid gap-2 text-sm">
          Type
          <select
            className="h-12 rounded-2xl border border-(--border) bg-white/70 px-4"
            {...form.register("type")}
          >
            {challengeTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Difficulty
          <select
            className="h-12 rounded-2xl border border-(--border) bg-white/70 px-4"
            {...form.register("difficulty")}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm md:col-span-2">
          Lock at
          <Input type="datetime-local" {...form.register("lockAt")} />
        </label>
      </div>
      <div className="mt-8 grid gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-(--muted-foreground)">
          Options
        </p>
        {[0, 1].map((index) => (
          <div key={index} className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder={`Option ${index + 1} label`}
              {...form.register(`options.${index}.label`)}
            />
            <Input
              placeholder={`Option ${index + 1} value`}
              {...form.register(`options.${index}.value`)}
            />
          </div>
        ))}
      </div>
      <Button className="mt-8" type="submit">
        Create challenge
      </Button>
      {serverMessage ? (
        <p
          className={`mt-4 text-sm ${status === "success" ? "text-(--accent)" : "text-[#aa3e29]"}`}
        >
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
