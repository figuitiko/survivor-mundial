import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
};

export function PageHeader({ eyebrow, title, description, badge }: PageHeaderProps) {
  return (
    <header className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)]">
          {description}
        </p>
      </div>
      {badge ? <Badge variant="accent">{badge}</Badge> : null}
    </header>
  );
}
