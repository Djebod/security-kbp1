"use client";
import { useState } from "react";
import ActionForm from "@/components/ActionForm";
import PhotoInput from "@/components/PhotoInput";
import { POSISI_PELAPOR } from "@/lib/config";
import { simpanLaporan } from "../actions";

export default function LostFoundForm({ hariIni }: { hariIni: string }) {
  const [jenis, setJenis] = useState("");
  return (
    <ActionForm action={simpanLaporan} submitLabel="Simpan Laporan">
      <div>
        <label className="label">Jenis laporan <span className="text-red-600">*</span></label>
        <input type="hidden" name="type_kejadian" value={jenis} />
        <div className="grid grid-cols-2 gap-3">
          {[["KEHILANGAN", "Barang Hilang"], ["PENEMUAN", "Barang Ditemukan"]].map(([v, l]) => (
            <button type="button" key={v} onClick={() => setJenis(v)}
              className={`rounded-xl border p-4 text-center text-sm font-semibold ${jenis === v ? "border-neo-black bg-neo-black text-neo-silver" : "border-neo-mist bg-white"}`}>
              <span className="block font-display text-xs tracking-[.2em]">{v}</span>
              <span className="mt-1 block text-xs font-normal opacity-80">{l}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-3 p-4">
        <p className="text-sm font-semibold">Barang</p>
        <div><label className="label">Nama barang <span className="text-red-600">*</span></label><input name="nama_barang" required className="input" /></div>
        <div><label className="label">Deskripsi <span className="text-red-600">*</span></label><textarea name="deskripsi" required rows={3} className="input" placeholder="Warna, merek, ciri khusus, isi..." /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Tanggal kejadian <span className="text-red-600">*</span></label><input type="date" name="tanggal_kejadian" required defaultValue={hariIni} className="input" /></div>
          <div><label className="label">Jam kejadian</label><input type="time" name="waktu_kejadian" className="input" /></div>
        </div>
        <div><label className="label">Tempat kejadian <span className="text-red-600">*</span></label><input name="tempat_kejadian" required className="input" /></div>
        <PhotoInput name="photo_barang" label="Foto barang (opsional)" />
      </div>

      <div className="card space-y-3 p-4">
        <p className="text-sm font-semibold">Pelapor</p>
        <div><label className="label">Nama pelapor <span className="text-red-600">*</span></label><input name="nama_pelapor" required className="input" /></div>
        <div>
          <label className="label">Posisi</label>
          <select name="posisi" className="select" defaultValue="">
            <option value="">Pilih</option>
            {POSISI_PELAPOR.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div><label className="label">No. identitas</label><input name="nomor_identitas" className="input" placeholder="KTP / paspor / ID staf" /></div>
        <div><label className="label">Alamat</label><textarea name="alamat" rows={2} className="input" /></div>
      </div>
    </ActionForm>
  );
}
