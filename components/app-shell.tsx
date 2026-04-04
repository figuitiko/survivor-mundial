"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { BrandMark } from "@/components/brand-mark";
import { navigationItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  userName: string;
};

export function AppShell({ children, userName }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-grid min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-[color:var(--border)] bg-white/55 px-6 py-5 backdrop-blur xl:w-[290px] lg:min-h-screen lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
          <div className="flex items-center justify-between lg:block">
            <BrandMark />
            <div className="hidden items-center gap-3 lg:flex">
              <Avatar initials="FO" />
              <div>
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                  Demo captain
                </p>
              </div>
            </div>
          </div>

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
        </aside>

        <div className="flex-1 px-6 py-8 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
