"use client";
import { useState } from "react";
import ActionForm from "@/components/ActionForm";
import PhotoInput from "@/components/PhotoInput";
import { AKTIVITAS, AKTIVITAS_WAJIB_PIC, DAFTAR_PIC } from "@/lib/config";
import { simpanChecklist } from "../actions";

type Lokasi = { code_lokasi: string; nama_lokasi: string };

export default function ChecklistForm({ lokasi }: { lokasi: Lokasi[] }) {
  const [aktivitas, setAktivitas] = useState("");
  const [pic, setPic] = useState("");
  const wajibPic = AKTIVITAS_WAJIB_PIC.includes(aktivitas);

  return (
    <ActionForm action={simpanChecklist} submitLabel="Simpan Checklist">
      <div>
        <label className="label">Jenis aktivitas <span className="text-red-600">*</span></label>
        <div className="grid gap-2">
          {AKTIVITAS.map((a) => (
            <label key={a} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${aktivitas === a ? "border-neo-black bg-neo-black text-neo-silver" : "border-neo-mist bg-white"}`}>
              <input type="radio" name="aktivitas" value={a} required checked={aktivitas === a} onChange={() => { setAktivitas(a); setPic(""); }} className="accent-neo-black" />
              <span className="text-sm font-medium">{a}</span>
              {AKTIVITAS_WAJIB_PIC.includes(a) && <span className="ml-auto text-[10px] uppercase tracking-wider opacity-70">foto + PIC</span>}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Lokasi <span className="text-red-600">*</span></label>
        <select name="code_lokasi" required className="select" defaultValue="">
          <option value="" disabled>Pilih lokasi</option>
          {lokasi.map((l) => <option key={l.code_lokasi} value={l.code_lokasi}>{l.nama_lokasi}</option>)}
        </select>
      </div>

      {wajibPic && (
        <div>
          <label className="label">PIC (tim Housekeeping) <span className="text-red-600">*</span></label>
          <input type="hidden" name="pic2" value={pic} />
          <div className="flex flex-wrap gap-2">
            {DAFTAR_PIC.map((n) => (
              <button type="button" key={n} onClick={() => setPic(n)} className={pic === n ? "chip-active" : "chip"}>{n}</button>
            ))}
          </div>
        </div>
      )}

      <PhotoInput name="photo" label={wajibPic ? "Foto Hasil Cleaning" : "Foto (opsional)"} required={wajibPic} />

      <div>
        <label className="label">Keterangan</label>
        <textarea name="keterangan" rows={3} className="input" />
      </div>
    </ActionForm>
  );
}
