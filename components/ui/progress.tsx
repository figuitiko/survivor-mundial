type ProgressProps = {
  value: number;
};

export function Progress({ value }: ProgressProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--accent-soft)]">
      <div
        className="h-full rounded-full bg-[color:var(--accent)] transition-[width]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
