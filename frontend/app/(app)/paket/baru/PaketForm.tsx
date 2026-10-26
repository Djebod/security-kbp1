"use client";
import { useState } from "react";
import ActionForm from "@/components/ActionForm";
import PhotoInput from "@/components/PhotoInput";
import Scanner from "@/components/Scanner";
import Icon from "@/components/Icon";
import { terimaPaket } from "../actions";

export default function PaketForm() {
  const [scan, setScan] = useState(false);
  const [resi, setResi] = useState("");
  const [tanpa, setTanpa] = useState(false);
  return (
    <ActionForm action={terimaPaket} submitLabel="Simpan Paket Diterima">
      {scan && <Scanner onScan={(t) => { setResi(t); setScan(false); }} onClose={() => setScan(false)} title="Scan barcode resi" />}
      <div>
        <label className="label">Pengirim / ekspedisi <span className="text-neo-neon">*</span></label>
        <input name="nama_pengirim" required className="input" placeholder="JNE, J&T, Shopee Express, Gojek..." />
      </div>
      <div>
        <label className="label">No. resi <span className="text-neo-neon">*</span></label>
        <div className="flex gap-2">
          <input name="scan_barcode" value={resi} onChange={(e) => setResi(e.target.value)} disabled={tanpa} className="input" placeholder="Scan atau ketik manual" />
          <button type="button" onClick={() => setScan(true)} disabled={tanpa} className="btn-outline shrink-0 px-3" aria-label="Scan"><Icon name="scan" /></button>
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm text-neo-silver">
          <input type="checkbox" name="tanpa_resi" checked={tanpa} onChange={(e) => { setTanpa(e.target.checked); if (e.target.checked) setResi(""); }} className="h-4 w-4 accent-neo-neon" />
          Paket tanpa resi
        </label>
      </div>
      <div>
        <label className="label">Nama penerima <span className="text-neo-neon">*</span></label>
        <input name="penerima_barang" required className="input" placeholder="Nama tamu / staf / unit" />
      </div>
      <PhotoInput name="photo_barang" label="Foto paket" required />
    </ActionForm>
  );
}
