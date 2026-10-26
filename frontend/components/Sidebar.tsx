"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP, MODUL } from "@/lib/config";
import type { Session } from "@/lib/session";
import NeoLogo from "./NeoLogo";
import Icon from "./Icon";

export default function Sidebar({ session }: { session: Session }) {
  const path = usePathname();
  const items = [{ href: "/", label: "Beranda", ikon: "home" }, ...MODUL];
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-neo-black text-neo-silver lg:flex lg:sticky lg:top-0 lg:h-dvh">
      <div className="flex flex-col items-center border-b border-white/10 py-8">
        <NeoLogo size="md" />
        <p className="mt-4 font-display text-[10px] uppercase tracking-[.3em] text-neo-silver/60">Security</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((m) => {
          const aktif = m.href === "/" ? path === "/" : path.startsWith(m.href);
          return (
            <Link key={m.href} href={m.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${aktif ? "bg-white/10 text-white" : "text-neo-silver/80 hover:bg-white/5 hover:text-white"}`}>
              <Icon name={m.ikon} className="h-5 w-5" />
              {m.label}
            </Link>
          );
        })}
        <Link href="/tentang" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neo-silver/80 hover:bg-white/5 hover:text-white">
          <Icon name="external" /> Tentang sistem
        </Link>
        {APP.portalUrl && (
          <a href={APP.portalUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neo-silver/80 hover:bg-white/5 hover:text-white">
            <Icon name="external" /> Portal Staff
          </a>
        )}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-medium text-white">{session.nama}</p>
        <p className="truncate text-xs text-neo-silver/60">{session.dept} · {session.role}</p>
        <form action="/api/auth/logout" method="post" className="mt-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2 text-sm text-neo-silver hover:bg-white/5">
            <Icon name="logout" className="h-4 w-4" /> Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
