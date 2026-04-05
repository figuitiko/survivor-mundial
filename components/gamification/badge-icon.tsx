import type { LucideIcon } from "lucide-react";
import { Flame, Gem, Shield, Sparkles, Target, Trophy } from "lucide-react";

type BadgeIconProps = {
  icon: string;
  className?: string;
};

const ICONS: Record<string, LucideIcon> = {
  Shield,
  Flame,
  Target,
  Gem,
  Trophy,
  Sparkles
};

export function BadgeIcon({ icon, className }: BadgeIconProps) {
  const Icon = ICONS[icon] ?? Trophy;

  return <Icon className={className} />;
}
