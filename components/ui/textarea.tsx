import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-3xl border border-[color:var(--border)] bg-white/70 px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--ring)] focus:ring-2 focus:ring-[color:color-mix(in srgb, var(--ring) 24%, transparent)]",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
