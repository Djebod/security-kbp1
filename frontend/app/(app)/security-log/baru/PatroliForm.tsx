"use client";
import { useFormState } from "react-dom";
import { useState } from "react";
import Scanner from "@/components/Scanner";
import SubmitButton from "@/components/SubmitButton";
import FormError from "@/components/FormError";
import Icon from "@/components/Icon";
import { cekLokasi, simpanPatroli } from "../actions";

export default function PatroliForm() {
  const [state, action] = useFormState(simpanPatroli, {});
  const [scan, setScan] = useState(false);
  const [hasil, setHasil] = useState<{ ok: boolean; code?: string; nama?: string; raw?: string } | null>(null);
  const [cek, setCek] = useState(false);

  async function onScan(text: string) {
    setScan(false);
    setCek(true);
    const r = await cekLokasi(text);
    setHasil({ ...r, raw: text });
    setCek(false);
  }

  return (
    <form action={action} className="space-y-4">
      {scan && <Scanner onScan={onScan} onClose={() => setScan(false)} title="Scan QR titik patroli" />}

      <button type="button" onClick={() => setScan(true)} className="btn-primary btn-lg">
        <Icon name="scan" /> Scan dengan Kamera
      </button>

      <div>
        <label className="label">Kode lokasi (hanya dari scan)</label>
        <input readOnly name="code_lokasi" value={hasil?.ok ? hasil.code : ""} placeholder="Belum di-scan" className="input" />
      </div>

      {cek && <p className="text-sm text-neo-silver/70">Memeriksa kode...</p>}
      {hasil && !cek && (hasil.ok ? (
        <div className="notice-ok">
          <p className="text-xs uppercase tracking-wider">Lokasi</p>
          <p className="text-lg font-semibold">{hasil.nama}</p>
        </div>
      ) : (
        <div className="notice-bad">
          <p className="font-semibold">Barcode tidak dikenali</p>
          <p className="text-xs opacity-80">Isi: {hasil.raw}</p>
        </div>
      ))}

      <FormError error={state.error} />
      <SubmitButton disabled={!hasil?.ok}>Simpan Patroli</SubmitButton>
      <p className="text-center text-xs text-neo-silver/60">Tanggal, jam, dan nama petugas diisi otomatis oleh sistem.</p>
    </form>
  );
}
