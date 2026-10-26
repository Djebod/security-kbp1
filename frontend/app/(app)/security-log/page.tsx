import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Pagination, { pageOf } from "@/components/Pagination";
import { SQL_TANGGAL, hm, query, tglIndo, ymd } from "@/lib/db";

export const dynamic = "force-dynamic";
const PER_HAL = 31;

type Row = { tanggal: string; jumlah: string };
type Detail = { id: string; tanggal: string; waktu: string; nama_lokasi: string; code_lokasi: string; security_name: string };

export default async function Page({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q || "").trim();
  const dari = searchParams.dari || "";
  const sampai = searchParams.sampai || "";
  const page = pageOf(searchParams.page);

  const where: string[] = [];
  const params: unknown[] = [];
  if (q) { params.push(`%${q}%`); where.push(`(nama_lokasi ILIKE $${params.length} OR security_name ILIKE $${params.length} OR code_lokasi ILIKE $${params.length})`); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dari)) { params.push(dari); where.push(`tanggal >= $${params.length}`); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(sampai)) { params.push(sampai); where.push(`tanggal <= $${params.length}`); }
  const W = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [{ total }] = await query<{ total: string }>(`SELECT count(DISTINCT tanggal)::text AS total FROM security_log ${W}`, params);
  const hari = await query<Row>(
    `SELECT tanggal::text, count(*)::text AS jumlah FROM security_log ${W} GROUP BY tanggal ORDER BY tanggal DESC LIMIT ${PER_HAL} OFFSET ${(page - 1) * PER_HAL}`, params);

  let detail: Detail[] = [];
  if (hari.length) {
    const p2 = [...params, hari.map((h) => h.tanggal)];
    detail = await query<Detail>(
      `SELECT id, tanggal::text, waktu::text, nama_lokasi, code_lokasi, security_name FROM security_log ${W ? W + " AND" : "WHERE"} tanggal = ANY($${p2.length}::date[]) ORDER BY tanggal DESC, waktu DESC`, p2);
  }
  const [{ hariIni }] = await query<{ hariIni: string }>(`SELECT ${SQL_TANGGAL}::text AS "hariIni"`);

  return (
    <div>
      <PageHeader title="Patroli" subtitle="Riwayat scan titik patroli" action={{ href: "/security-log/baru", label: "Scan" }} />
      <form action="/security-log" className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input name="q" defaultValue={q} placeholder="Cari lokasi / petugas" className="input col-span-2" />
        <input type="date" name="dari" defaultValue={dari} className="input" aria-label="Dari tanggal" />
        <input type="date" name="sampai" defaultValue={sampai} className="input" aria-label="Sampai tanggal" />
        <button className="btn-outline col-span-2 sm:col-span-4">Terapkan</button>
      </form>

      {hari.length === 0 ? <EmptyState text="Belum ada data patroli." /> : (
        <div className="space-y-2">
          {hari.map((h) => (
            <details key={h.tanggal} className="card group" open={h.tanggal === hariIni}>
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
                <span className="font-medium">{tglIndo(h.tanggal, true)}{h.tanggal === hariIni && <span className="badge-neon ml-2">Hari ini</span>}</span>
                <span className="badge-grey">{h.jumlah} scan</span>
              </summary>
              <ul className="divide-y divide-neo-line border-t border-neo-line">
                {detail.filter((d) => ymd(d.tanggal) === h.tanggal).map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="w-12 font-mono text-neo-silver">{hm(d.waktu)}</span>
                    <span className="flex-1"><span className="font-medium">{d.nama_lokasi}</span> <span className="text-xs text-neo-silver/60">{d.code_lokasi}</span></span>
                    <span className="text-neo-silver/80">{d.security_name}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
      <Pagination basePath="/security-log" page={page} total={Number(total)} perPage={PER_HAL} params={{ q, dari, sampai }} />
    </div>
  );
}
