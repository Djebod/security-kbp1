import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SearchFilter from "@/components/SearchFilter";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import Pagination, { pageOf } from "@/components/Pagination";
import { hm, query, tglIndo } from "@/lib/db";
import { PER_HALAMAN } from "@/lib/config";

export const dynamic = "force-dynamic";
type Row = { id: string; tanggal_diterima: string; jam_diterima: string; nama_pengirim: string; scan_barcode: string; penerima_barang: string; status: string; photo_barang: string };

export default async function Page({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q || "").trim();
  const f = ["TERIMA", "AMBIL"].includes(searchParams.f || "") ? (searchParams.f as string) : "";
  const page = pageOf(searchParams.page);
  const where: string[] = []; const params: unknown[] = [];
  if (q) { params.push(`%${q}%`); where.push(`(penerima_barang ILIKE $${params.length} OR nama_pengirim ILIKE $${params.length} OR scan_barcode ILIKE $${params.length})`); }
  if (f) { params.push(f); where.push(`status = $${params.length}`); }
  const W = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [{ total }] = await query<{ total: string }>(`SELECT count(*)::text AS total FROM paket_manajemen ${W}`, params);
  const rows = await query<Row>(
    `SELECT id, tanggal_diterima::text, jam_diterima::text, nama_pengirim, scan_barcode, penerima_barang, status, photo_barang FROM paket_manajemen ${W}
     ORDER BY tanggal_diterima DESC, jam_diterima DESC LIMIT ${PER_HALAMAN} OFFSET ${(page - 1) * PER_HALAMAN}`, params);
  const [c] = await query<{ semua: string; terima: string; ambil: string }>(
    `SELECT count(*)::text AS semua, count(*) FILTER (WHERE status='TERIMA')::text AS terima, count(*) FILTER (WHERE status='AMBIL')::text AS ambil FROM paket_manajemen`);

  return (
    <div>
      <PageHeader title="Paket" subtitle="Penerimaan & penyerahan" action={{ href: "/paket/baru", label: "Terima" }} />
      <SearchFilter basePath="/paket" q={q} chipValue={f}
        chips={[{ value: "", label: "Semua", count: Number(c.semua) }, { value: "TERIMA", label: "Belum diambil", count: Number(c.terima) }, { value: "AMBIL", label: "Sudah diambil", count: Number(c.ambil) }]} />
      {rows.length === 0 ? <EmptyState text="Belum ada paket." /> : (
        <div className="space-y-2">
          {rows.map((r) => (
            <Link key={r.id} href={`/paket/${r.id}`} className="card flex gap-3 p-3 hover:border-neo-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.photo_barang} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-neo-cloud object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{r.penerima_barang}</span>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-0.5 truncate text-xs text-neo-steel/70">{r.nama_pengirim} · {r.scan_barcode}</p>
                <p className="text-xs text-neo-steel/70">{tglIndo(r.tanggal_diterima)} · {hm(r.jam_diterima)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination basePath="/paket" page={page} total={Number(total)} perPage={PER_HALAMAN} params={{ q, f }} />
    </div>
  );
}
