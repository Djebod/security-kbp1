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
  // Sesi & angka ringkas diambil berbarengan supaya Beranda lebih cepat terbuka.
  const [session, [row]] = await Promise.all([
    requireSession(),
    query<{ patroli: string; paket: string; lf: string; tanggal: string; jam: string }>(`
    SELECT
      (SELECT count(*) FROM security_log WHERE tanggal = ${SQL_TANGGAL})::text AS patroli,
      (SELECT count(*) FROM paket_manajemen WHERE status = 'TERIMA')::text AS paket,
      (SELECT count(*) FROM laporan_kehilangan WHERE status = 'ON PROGRESS')::text AS lf,
      ${SQL_TANGGAL}::text AS tanggal,
      to_char(now() AT TIME ZONE '${APP.zonaWaktu}', 'HH24') AS jam
  `),
  ]);

  const namaDepan = session.nama.split(" ")[0];
  // Angka berwarna neon hanya bila ada yang perlu ditindak (paket belum diambil, laporan masih berjalan)
  const stats = [
    { label: "Patroli hari ini", nilai: row.patroli, href: "/security-log", perhatian: false },
    { label: "Paket belum diambil", nilai: row.paket, href: "/paket?f=TERIMA", perhatian: Number(row.paket) > 0 },
    { label: "Lost & Found berjalan", nilai: row.lf, href: "/lost-found?f=ON%20PROGRESS", perhatian: Number(row.lf) > 0 },
  ];

  return (
    <div className="space-y-8">
      <section className="border-b border-neo-line pb-6">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-neo-neon">{tglIndo(row.tanggal, true)}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neo-cloud sm:text-3xl">{sapaan(Number(row.jam))}, {namaDepan}</h1>
        <p className="mt-1 text-sm text-neo-silver/70">{session.dept} · {APP.tempat}</p>
        <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
          <Link href="/tentang" className="btn-outline px-4 py-2 text-sm">
            <Icon name="info" className="h-4 w-4" /> Tentang sistem
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="btn-outline px-4 py-2 text-sm">Keluar</button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4 transition hover:border-neo-neon/50">
            <p className={`font-mono text-3xl tabular-nums ${s.perhatian ? "text-neo-neon" : "text-neo-cloud"}`}>{s.nilai}</p>
            <p className="mt-1 text-[11px] leading-snug text-neo-silver/70">{s.label}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-neo-silver">Modul</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {MODUL.map((m) => (
            <Link key={m.href} href={m.href} className="card group flex flex-col gap-4 p-4 transition hover:border-neo-neon/50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neo-neon/10 text-neo-neon ring-1 ring-inset ring-neo-neon/20 transition group-hover:bg-neo-neon group-hover:text-white">
                <Icon name={m.ikon} />
              </span>
              <div>
                <p className="font-semibold text-neo-cloud">{m.label}</p>
                <p className="mt-0.5 text-xs text-neo-silver/70">{m.deskripsi}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-neo-silver">Lainnya</h2>
        <Link href="/tentang" className="card group flex items-center gap-4 p-4 transition hover:border-neo-neon/50">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neo-neon/10 text-neo-neon ring-1 ring-inset ring-neo-neon/20 transition group-hover:bg-neo-neon group-hover:text-white">
            <Icon name="info" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-neo-cloud">Tentang sistem</p>
            <p className="mt-0.5 text-xs text-neo-silver/70">Peta perjalanan data, tim, dan teknologi yang dipakai aplikasi ini.</p>
          </div>
          <Icon name="external" className="h-4 w-4 shrink-0 text-neo-silver/50" />
        </Link>
      </section>
    </div>
  );
}
