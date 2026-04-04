import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="section-shell max-w-lg rounded-[2rem] px-8 py-10 text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="font-display mt-4 text-4xl">This fixture is off the board.</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
          The route does not exist in this phase of the app.
        </p>
        <Link href="/" className={`${buttonVariants()} mt-6 inline-flex`}>
          Return home
        </Link>
      </div>
    </main>
  );
}
