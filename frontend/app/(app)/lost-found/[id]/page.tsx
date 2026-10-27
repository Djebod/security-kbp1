import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { DetailList, DetailRow, Foto } from "@/components/DetailRow";
import { hm, queryOne, tglIndo } from "@/lib/db";
import SelesaikanForm from "./SelesaikanForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const r = await queryOne<Record<string, string>>("SELECT *, tanggal::text, waktu::text, tanggal_kejadian::text, tanggal_selesai::text, waktu_selesai::text FROM laporan_kehilangan WHERE id = $1", [params.id]);
  if (!r) notFound();
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="Detail Lost & Found" back="/lost-found" subtitle={`Dilaporkan ${tglIndo(r.tanggal, true)} · ${hm(r.waktu)}`} />
      <div className="flex gap-2"><StatusBadge status={r.type_kejadian} /><StatusBadge status={r.status} /></div>
      <Foto src={r.photo_barang} alt="Foto barang" />
      <div className="card p-4">
        <DetailList>
          <DetailRow label="Nama barang" value={r.nama_barang} />
          <DetailRow label="Deskripsi" value={r.deskripsi} />
          <DetailRow label="Tanggal kejadian" value={`${tglIndo(r.tanggal_kejadian)}${r.waktu_kejadian ? " " + r.waktu_kejadian : ""}`} />
          <DetailRow label="Tempat kejadian" value={r.tempat_kejadian} />
          <DetailRow label="Pelapor" value={`${r.nama_pelapor}${r.posisi ? " (" + r.posisi + ")" : ""}`} />
          <DetailRow label="No. identitas" value={r.nomor_identitas} />
          <DetailRow label="Alamat" value={r.alamat} />
          <DetailRow label="Penerima laporan" value={r.penerima_laporan} />
        </DetailList>
      </div>
      {r.status === "DONE" ? (
        <div className="notice-ok">
          <p className="text-sm font-semibold text-emerald-800">Selesai {tglIndo(r.tanggal_selesai)} {hm(r.waktu_selesai)} oleh {r.diselesaikan_oleh}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-emerald-700">{r.remark}</p>
        </div>
      ) : <SelesaikanForm id={r.id} />}
    </div>
  );
}
