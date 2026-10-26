import type { Session } from "@/lib/session";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ session, children }: { session: Session; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar session={session} />
      <div className="flex min-h-dvh flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-4 lg:px-8 lg:pb-10 lg:pt-8">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
