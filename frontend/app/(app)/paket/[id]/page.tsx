import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import WhatsAppSend from "@/components/WhatsAppSend";
import { DetailList, DetailRow, Foto } from "@/components/DetailRow";
import { hm, queryOne, tglIndo } from "@/lib/db";
import { APP } from "@/lib/config";
import SerahkanForm from "./SerahkanForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const r = await queryOne<Record<string, string>>("SELECT *, tanggal_diterima::text, jam_diterima::text, tanggal_diambil::text, jam_diambil::text FROM paket_manajemen WHERE id = $1", [params.id]);
  if (!r) notFound();
  const sudah = r.status === "AMBIL";

  const pesan = [
    `*INFORMASI PAKET — ${APP.nama}*`, APP.tempat, "",
    `Kepada Yth. *${r.penerima_barang}*`, "",
    sudah ? "Paket atas nama Anda telah diserahkan oleh Security." : "Ada paket atas nama Anda yang telah diterima oleh Security dan dapat diambil di Pos Security.",
    "",
    `Pengirim: ${r.nama_pengirim}`,
    `No. Resi: ${r.scan_barcode}`,
    `Diterima: ${tglIndo(r.tanggal_diterima)} pukul ${hm(r.jam_diterima)}`,
    `Security Penerima: ${r.nama_security_penerima}`,
    ...(sudah ? [`Diserahkan: ${tglIndo(r.tanggal_diambil)} pukul ${hm(r.jam_diambil)}`, `Diserahkan oleh: ${r.nama_security_pemberi}`] : []),
  ].join("\n");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader title="Detail Paket" back="/paket" subtitle={`Diterima ${tglIndo(r.tanggal_diterima, true)} · ${hm(r.jam_diterima)}`} />
      <StatusBadge status={r.status} />
      <Foto src={r.photo_barang} alt="Foto paket" />
      <div className="card p-4">
        <DetailList>
          <DetailRow label="Penerima" value={r.penerima_barang} />
          <DetailRow label="Pengirim" value={r.nama_pengirim} />
          <DetailRow label="No. resi" value={r.scan_barcode} />
          <DetailRow label="Security penerima" value={r.nama_security_penerima} />
          {sudah && <>
            <DetailRow label="Diserahkan" value={`${tglIndo(r.tanggal_diambil)} · ${hm(r.jam_diambil)}`} />
            <DetailRow label="Diserahkan oleh" value={r.nama_security_pemberi} />
          </>}
        </DetailList>
      </div>
      {sudah ? (
        <div>
          <p className="label">Foto pengambil</p>
          <Foto src={r.photo_pengambil} alt="Foto pengambil" />
        </div>
      ) : <SerahkanForm id={r.id} />}
      <WhatsAppSend pesan={pesan} />
    </div>
  );
}
