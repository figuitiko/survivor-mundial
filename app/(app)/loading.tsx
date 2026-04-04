export default function ProtectedLoading() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="section-shell h-52 animate-pulse rounded-[2rem] bg-white/55"
        />
      ))}
    </div>
  );
}
