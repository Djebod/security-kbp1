import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { DetailList, DetailRow, Foto } from "@/components/DetailRow";
import { hm, queryOne, tglIndo } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const r = await queryOne<Record<string, string>>("SELECT *, tanggal::text, waktu::text FROM checklist WHERE id = $1", [params.id]);
  if (!r) notFound();
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="Detail Checklist" back="/shift-report" subtitle={`${tglIndo(r.tanggal, true)} · ${hm(r.waktu)}`} />
      <Foto src={r.photo} alt="Foto aktivitas" />
      <div className="card p-4">
        <DetailList>
          <DetailRow label="Aktivitas" value={r.aktivitas} />
          <DetailRow label="Lokasi" value={r.nama_lokasi} />
          <DetailRow label="Petugas" value={r.security_name} />
          <DetailRow label="PIC" value={r.pic2} />
          <DetailRow label="Keterangan" value={r.keterangan} />
        </DetailList>
      </div>
    </div>
  );
}
