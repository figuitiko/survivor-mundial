export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="section-shell relative max-w-sm rounded-[2rem] px-8 py-10 text-center">
        <div className="mx-auto mb-4 size-14 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
        <p className="eyebrow justify-center">Loading workspace</p>
        <h1 className="font-display mt-5 text-3xl">Building the next matchday board.</h1>
      </div>
    </main>
  );
}
