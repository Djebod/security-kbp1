import Link from "next/link";
import { requireSession } from "@/lib/session";
import { SQL_TANGGAL, query, tglIndo } from "@/lib/db";
import { APP, MODUL } from "@/lib/config";
import Icon from "@/components/Icon";

export const dynamic = "force-dynamic";

function sapaan(jam: number) {
  if (jam < 11) return "Selamat pagi";
  if (jam < 15) return "Selamat siang";
  if (jam < 19) return "Selamat sore";
  return "Selamat malam";
}

export default async function Beranda() {
  const session = await requireSession();
  const [row] = await query<{ patroli: string; paket: string; lf: string; tanggal: string; jam: string }>(`
    SELECT
      (SELECT count(*) FROM security_log WHERE tanggal = ${SQL_TANGGAL})::text AS patroli,
      (SELECT count(*) FROM paket_manajemen WHERE status = 'TERIMA')::text AS paket,
      (SELECT count(*) FROM laporan_kehilangan WHERE status = 'ON PROGRESS')::text AS lf,
      ${SQL_TANGGAL}::text AS tanggal,
      to_char(now() AT TIME ZONE '${APP.zonaWaktu}', 'HH24') AS jam
  `);

  const namaDepan = session.nama.split(" ")[0];
  const stats = [
    { label: "Patroli hari ini", nilai: row.patroli, href: "/security-log", warna: "" },
    { label: "Paket belum diambil", nilai: row.paket, href: "/paket?f=TERIMA", warna: Number(row.paket) > 0 ? "text-amber-600" : "" },
    { label: "Lost & Found on progress", nilai: row.lf, href: "/lost-found?f=ON%20PROGRESS", warna: Number(row.lf) > 0 ? "text-amber-600" : "" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-neo-black p-5 text-neo-silver">
        <p className="text-sm text-neo-silver/70">{tglIndo(row.tanggal, true)}</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">{sapaan(Number(row.jam))}, {namaDepan}</h1>
        <p className="mt-1 text-sm text-neo-silver/70">{session.dept} · {APP.tempat}</p>
        <form action="/api/auth/logout" method="post" className="mt-4 lg:hidden">
          <button className="rounded-xl border border-white/15 px-4 py-2 text-sm text-neo-silver">Keluar</button>
        </form>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4 transition hover:border-neo-black">
            <p className={`font-display text-2xl ${s.warna}`}>{s.nilai}</p>
            <p className="mt-1 text-xs text-neo-steel/70">{s.label}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-neo-steel/60">Modul</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {MODUL.map((m) => (
            <Link key={m.href} href={m.href} className="card flex flex-col gap-3 p-4 transition hover:border-neo-black">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neo-black text-neo-silver"><Icon name={m.ikon} /></span>
              <div>
                <p className="font-semibold">{m.label}</p>
                <p className="text-xs text-neo-steel/70">{m.deskripsi}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
