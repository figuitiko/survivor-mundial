"use client";

import { startTransition, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitChallengeAnswers } from "@/app/(app)/challenges/actions";
import { Button } from "@/components/ui/button";
import type { StatChallenge } from "@/lib/types";
import {
  submitChallengeAnswersSchema,
  type SubmitChallengeAnswersInput,
} from "@/lib/validations/challenge";

type ChallengeJoinFormProps = {
  challenges: StatChallenge[];
};

export function ChallengeJoinForm({ challenges }: ChallengeJoinFormProps) {
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const openChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.state === "OPEN"),
    [challenges],
  );

  const form = useForm<SubmitChallengeAnswersInput>({
    resolver: zodResolver(submitChallengeAnswersSchema),
    defaultValues: {
      answers: openChallenges.flatMap((challenge) => {
        if (!challenge.answerLabel) {
          return [];
        }

        const selectedOption = challenge.options.find(
          (option) => option.label === challenge.answerLabel,
        );

        if (!selectedOption) {
          return [];
        }

        return [
          {
            challengeId: challenge.id,
            challengeOptionId: selectedOption.id,
          },
        ];
      }),
    },
  });

  function setAnswer(challengeId: string, challengeOptionId: string) {
    const currentAnswers = form.getValues("answers");
    const nextAnswers = currentAnswers.filter(
      (answer) => answer.challengeId !== challengeId,
    );

    form.setValue(
      "answers",
      [...nextAnswers, { challengeId, challengeOptionId }],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  function getSelectedOption(challengeId: string) {
    return form
      .getValues("answers")
      .find((answer) => answer.challengeId === challengeId)?.challengeOptionId;
  }

  const onSubmit = form.handleSubmit((values) => {
    setStatus("idle");
    setServerMessage("");

    startTransition(async () => {
      const result = await submitChallengeAnswers(values);
      setStatus(result.status);
      setServerMessage(result.message);
    });
  });

  if (openChallenges.length === 0) {
    return null;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8"
    >
      <p className="eyebrow">Submit challenge answers</p>
      <div className="mt-6 space-y-6">
        {openChallenges.map((challenge) => (
          <fieldset
            key={challenge.id}
            className="rounded-[1.7rem] border border-(--border) bg-white/70 px-5 py-5"
          >
            <legend className="font-display text-2xl">{challenge.title}</legend>
            <p className="mt-2 text-sm leading-7 text-(--muted-foreground)">
              {challenge.description}
            </p>
            <div className="mt-4 grid gap-3">
              {challenge.options.map((option) => {
                const checked = getSelectedOption(challenge.id) === option.id;

                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      checked
                        ? "border-(--accent) bg-(--accent-soft)"
                        : "border-(--border) bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={challenge.id}
                      className="size-4"
                      checked={checked}
                      onChange={() => setAnswer(challenge.id, option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <Button className="mt-8" type="submit">
        Save challenge answers
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
