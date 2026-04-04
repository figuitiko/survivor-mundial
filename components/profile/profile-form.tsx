"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfile } from "@/app/(app)/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UserProfile } from "@/lib/types";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

type ProfileFormProps = {
  profile: UserProfile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile
  });

  const onSubmit = form.handleSubmit((values) => {
    setStatus("idle");
    setServerMessage("");

    startTransition(async () => {
      const result = await updateProfile(values);
      setStatus(result.status);
      setServerMessage(result.message);
    });
  });

  return (
    <form onSubmit={onSubmit} className="section-shell rounded-[2.2rem] px-6 py-6 md:px-8 md:py-8">
      <p className="eyebrow">Profile settings</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Name
          <Input {...form.register("name")} />
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.name?.message}</span>
        </label>
        <label className="grid gap-2 text-sm">
          Username
          <Input {...form.register("username")} />
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.username?.message}</span>
        </label>
        <label className="grid gap-2 text-sm">
          Favorite nation
          <Input {...form.register("favoriteNation")} />
          <span className="text-xs text-[#aa3e29]">
            {form.formState.errors.favoriteNation?.message}
          </span>
        </label>
        <label className="grid gap-2 text-sm">
          Streak goal
          <Input type="number" min={1} max={20} {...form.register("streakGoal", { valueAsNumber: true })} />
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.streakGoal?.message}</span>
        </label>
        <label className="grid gap-2 text-sm md:col-span-2">
          Bio
          <Textarea {...form.register("bio")} />
          <span className="text-xs text-[#aa3e29]">{form.formState.errors.bio?.message}</span>
        </label>
      </div>
      <Button className="mt-8" type="submit">
        Save draft profile
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
