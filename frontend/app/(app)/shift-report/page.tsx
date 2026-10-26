import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SearchFilter from "@/components/SearchFilter";
import EmptyState from "@/components/EmptyState";
import Pagination, { pageOf } from "@/components/Pagination";
import { hm, query, tglIndo } from "@/lib/db";
import { AKTIVITAS, PER_HALAMAN } from "@/lib/config";

export const dynamic = "force-dynamic";
type Row = { id: string; tanggal: string; waktu: string; aktivitas: string; nama_lokasi: string; security_name: string; pic2: string; photo: string };

export default async function Page({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q || "").trim();
  const f = AKTIVITAS.includes(searchParams.f || "") ? (searchParams.f as string) : "";
  const page = pageOf(searchParams.page);
  const where: string[] = []; const params: unknown[] = [];
  if (q) { params.push(`%${q}%`); where.push(`(nama_lokasi ILIKE $${params.length} OR security_name ILIKE $${params.length} OR keterangan ILIKE $${params.length} OR pic2 ILIKE $${params.length})`); }
  if (f) { params.push(f); where.push(`aktivitas = $${params.length}`); }
  const W = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [{ total }] = await query<{ total: string }>(`SELECT count(*)::text AS total FROM checklist ${W}`, params);
  const rows = await query<Row>(
    `SELECT id, tanggal::text, waktu::text, aktivitas, nama_lokasi, security_name, pic2, photo FROM checklist ${W}
     ORDER BY tanggal DESC, waktu DESC LIMIT ${PER_HALAMAN} OFFSET ${(page - 1) * PER_HALAMAN}`, params);

  return (
    <div>
      <PageHeader title="Checklist" subtitle="Aktivitas shift" action={{ href: "/shift-report/baru", label: "Baru" }} />
      <SearchFilter basePath="/shift-report" q={q} chipValue={f} chips={[{ value: "", label: "Semua" }, ...AKTIVITAS.map((a) => ({ value: a, label: a }))]} />
      {rows.length === 0 ? <EmptyState text="Belum ada checklist." /> : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Link key={r.id} href={`/shift-report/${r.id}`} className="card flex gap-3 p-3 hover:border-neo-black">
              {r.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
              ) : <div className="h-16 w-16 shrink-0 rounded-lg bg-neo-cloud" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{r.nama_lokasi}</span>
                  <span className="badge-dark shrink-0">{r.aktivitas}</span>
                </div>
                <p className="mt-0.5 text-xs text-neo-steel/70">{tglIndo(r.tanggal)} · {hm(r.waktu)} · {r.security_name}{r.pic2 ? ` · PIC ${r.pic2}` : ""}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination basePath="/shift-report" page={page} total={Number(total)} perPage={PER_HALAMAN} params={{ q, f }} />
    </div>
  );
}
