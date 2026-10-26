import type { Session } from "@/lib/session";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ session, children }: { session: Session; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar session={session} />
      <div className="flex min-h-dvh flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 lg:px-10 lg:pb-12 lg:pt-10">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
