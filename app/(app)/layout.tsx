import { AppShell } from "@/components/app-shell";
import { getRequiredSession } from "@/lib/auth";

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getRequiredSession();

  return <AppShell userName={session.user.name}>{children}</AppShell>;
}
