"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ProtectedError({
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
    <div className="section-shell rounded-[2rem] px-8 py-10">
      <p className="eyebrow">Workspace error</p>
      <h1 className="font-display mt-4 text-4xl">This part of the pool did not render.</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted-foreground)]">
        The error boundary is in place for app routes. Reset this segment to keep moving through
        the MVP flow.
      </p>
      <Button className="mt-6" onClick={reset}>
        Retry section
      </Button>
    </div>
  );
}
