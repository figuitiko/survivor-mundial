import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)]">
        <div className="absolute inset-[18%] rounded-full border border-white/30" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/25" />
        <span className="font-display relative text-xl">S</span>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--muted-foreground)]">
          Survivor Mundial
        </p>
        <p className="font-display text-lg">Stat Challenges</p>
      </div>
    </div>
  );
}
