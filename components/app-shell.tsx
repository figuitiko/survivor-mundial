import { Avatar } from "@/components/ui/avatar";
import { AppShellNav } from "@/components/app-shell-nav";
import { BrandMark } from "@/components/brand-mark";

type AppShellProps = {
  children: React.ReactNode;
  userName: string;
  userRole: "USER" | "ADMIN";
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function AppShell({ children, userName, userRole }: AppShellProps) {
  return (
    <div className="app-grid min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-[color:var(--border)] bg-white/55 px-6 py-5 backdrop-blur xl:w-[290px] lg:min-h-screen lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
          <div className="flex items-center justify-between lg:block">
            <BrandMark />
            <div className="hidden items-center gap-3 lg:flex">
              <Avatar initials={getInitials(userName)} />
              <div>
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                  {userRole === "ADMIN" ? "Admin captain" : "Pool entrant"}
                </p>
              </div>
            </div>
          </div>

          <AppShellNav />
        </aside>

        <div className="flex-1 px-6 py-8 lg:px-10 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
