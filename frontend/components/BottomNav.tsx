"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODUL } from "@/lib/config";
import Icon from "./Icon";

/** Nav bawah HP: Beranda + 4 modul. Item aktif berwarna neon dengan garis tipis di tepi atas. */
export default function BottomNav() {
  const path = usePathname();
  const items = [{ href: "/", pendek: "Beranda", ikon: "home" }, ...MODUL];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-neo-line bg-neo-base/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {items.map((m) => {
        const aktif = m.href === "/" ? path === "/" : path.startsWith(m.href);
        const warna = aktif ? "text-neo-neon" : "text-neo-silver/70 active:text-neo-cloud";
        return (
          <Link key={m.href} href={m.href} className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${warna}`}>
            {aktif && <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-neo-neon" />}
            <Icon name={m.ikon} className="h-6 w-6" />{m.pendek}
          </Link>
        );
      })}
    </nav>
  );
}
