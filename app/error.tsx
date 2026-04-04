"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="section-shell max-w-lg rounded-[2rem] px-8 py-10">
        <p className="eyebrow">Unexpected whistle</p>
        <h1 className="font-display mt-4 text-4xl">The bracket slipped out of shape.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-[color:var(--muted-foreground)]">
          The MVP shell caught an unexpected error. Reset the segment and try the same action
          again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Reset view
        </Button>
      </div>
    </main>
  );
}
