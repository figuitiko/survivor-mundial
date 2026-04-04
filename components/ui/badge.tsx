import type React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]",
  {
    variants: {
      variant: {
        default: "border-[color:var(--border)] bg-white/70 text-[color:var(--foreground)]",
        accent: "border-transparent bg-[color:var(--accent-soft)] text-[color:var(--accent)]",
        success: "border-transparent bg-[#d4f0df] text-[#0f5c31]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
