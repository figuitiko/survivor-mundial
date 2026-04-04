import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-[color:var(--border)] bg-white/70 px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--ring)] focus:ring-2 focus:ring-[color:color-mix(in srgb, var(--ring) 24%, transparent)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
