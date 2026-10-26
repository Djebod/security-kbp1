import AppShell from "@/components/AppShell";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return <AppShell session={session}>{children}</AppShell>;
}
