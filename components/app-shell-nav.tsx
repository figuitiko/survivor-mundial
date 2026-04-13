"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AppShellNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:mt-12 lg:flex-col">
        {navigationItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-3 text-sm font-semibold transition lg:rounded-2xl",
                active
                  ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                  : "text-[color:var(--muted-foreground)] hover:bg-white/70 hover:text-[color:var(--foreground)]"
              )}
            >
              <span className="hidden lg:inline">{item.label}</span>
              <span className="lg:hidden">{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex lg:block">
        <Button
          className="w-full justify-center"
          onClick={() => signOut({ callbackUrl: "/" })}
          size="sm"
          variant="outline"
          type="button"
        >
          Sign out
        </Button>
      </div>
    </>
  );
}
