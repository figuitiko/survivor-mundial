import { cn } from "@/lib/utils";

type AvatarProps = {
  initials: string;
  className?: string;
};

export function Avatar({ initials, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-full border border-white/40 bg-[radial-gradient(circle_at_top,_#f7d46b,_#be7b2f_72%)] font-semibold text-[#2c1f0e]",
        className
      )}
    >
      {initials}
    </div>
  );
}
