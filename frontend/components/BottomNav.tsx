"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODUL } from "@/lib/config";
import Icon from "./Icon";

/** Nav bawah HP: Beranda + 4 modul (label pendek) */
export default function BottomNav() {
  const path = usePathname();
  const cls = (aktif: boolean) =>
    `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${aktif ? "text-white" : "text-neo-silver/70"}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-white/10 bg-neo-black pb-[env(safe-area-inset-bottom)] lg:hidden">
      <Link href="/" className={cls(path === "/")}><Icon name="home" className="h-6 w-6" />Beranda</Link>
      {MODUL.map((m) => (
        <Link key={m.href} href={m.href} className={cls(path.startsWith(m.href))}>
          <Icon name={m.ikon} className="h-6 w-6" />{m.pendek}
        </Link>
      ))}
    </nav>
  );
}
