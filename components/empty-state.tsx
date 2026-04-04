import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: string;
};

export function EmptyState({ eyebrow, title, description, action }: EmptyStateProps) {
  return (
    <div className="section-shell rounded-[2rem] px-6 py-8">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="font-display mt-4 text-3xl">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--muted-foreground)]">
        {description}
      </p>
      {action ? (
        <Button variant="outline" className="mt-6">
          {action}
        </Button>
      ) : null}
    </div>
  );
}
