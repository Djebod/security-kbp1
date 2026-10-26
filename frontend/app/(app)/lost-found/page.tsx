import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SearchFilter from "@/components/SearchFilter";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import Pagination, { pageOf } from "@/components/Pagination";
import { query, tglIndo } from "@/lib/db";
import { PER_HALAMAN } from "@/lib/config";

export const dynamic = "force-dynamic";
type Row = { id: string; tanggal: string; type_kejadian: string; nama_barang: string; tempat_kejadian: string; nama_pelapor: string; status: string; photo_barang: string };

export default async function Page({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q || "").trim();
  const f = ["ON PROGRESS", "DONE"].includes(searchParams.f || "") ? (searchParams.f as string) : "";
  const j = ["KEHILANGAN", "PENEMUAN"].includes(searchParams.j || "") ? (searchParams.j as string) : "";
  const page = pageOf(searchParams.page);
  const where: string[] = []; const params: unknown[] = [];
  if (q) { params.push(`%${q}%`); where.push(`(nama_barang ILIKE $${params.length} OR deskripsi ILIKE $${params.length} OR nama_pelapor ILIKE $${params.length} OR tempat_kejadian ILIKE $${params.length})`); }
  if (f) { params.push(f); where.push(`status = $${params.length}`); }
  if (j) { params.push(j); where.push(`type_kejadian = $${params.length}`); }
  const W = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [{ total }] = await query<{ total: string }>(`SELECT count(*)::text AS total FROM laporan_kehilangan ${W}`, params);
  const rows = await query<Row>(
    `SELECT id, tanggal::text, type_kejadian, nama_barang, tempat_kejadian, nama_pelapor, status, photo_barang FROM laporan_kehilangan ${W}
     ORDER BY tanggal DESC, waktu DESC NULLS LAST LIMIT ${PER_HALAMAN} OFFSET ${(page - 1) * PER_HALAMAN}`, params);

  return (
    <div>
      <PageHeader title="Lost & Found" subtitle="Barang hilang & ditemukan" action={{ href: "/lost-found/baru", label: "Baru" }} />
      <SearchFilter basePath="/lost-found" q={q} chipValue={f} extra={{ j }}
        chips={[{ value: "", label: "Semua" }, { value: "ON PROGRESS", label: "On progress" }, { value: "DONE", label: "Selesai" }]} />
      <div className="-mt-2 mb-4 flex gap-2">
        {[["", "Semua jenis"], ["KEHILANGAN", "Kehilangan"], ["PENEMUAN", "Penemuan"]].map(([v, l]) => {
          const sp = new URLSearchParams(); if (q) sp.set("q", q); if (f) sp.set("f", f); if (v) sp.set("j", v);
          return <Link key={v} href={`/lost-found?${sp}`} className={j === v ? "chip-active" : "chip"}>{l}</Link>;
        })}
      </div>
      {rows.length === 0 ? <EmptyState text="Belum ada laporan." /> : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Link key={r.id} href={`/lost-found/${r.id}`} className="card flex gap-3 p-3 hover:border-neo-black">
              {r.photo_barang ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo_barang} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
              ) : <div className="h-16 w-16 shrink-0 rounded-lg bg-neo-cloud" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{r.nama_barang}</span>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-0.5 text-xs text-neo-steel/70"><StatusBadge status={r.type_kejadian} /> {tglIndo(r.tanggal)} · {r.tempat_kejadian}</p>
                <p className="text-xs text-neo-steel/70">Pelapor: {r.nama_pelapor}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination basePath="/lost-found" page={page} total={Number(total)} perPage={PER_HALAMAN} params={{ q, f, j }} />
    </div>
  );
}
