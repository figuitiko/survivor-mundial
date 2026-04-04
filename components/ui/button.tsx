import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--accent)] px-5 py-3 text-[color:var(--accent-foreground)] hover:bg-[color:var(--accent-strong)]",
        outline:
          "border border-[color:var(--border)] px-5 py-3 text-[color:var(--foreground)] hover:border-[color:var(--foreground)]",
        ghost: "px-4 py-2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs uppercase tracking-[0.24em]",
        lg: "h-12 px-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
