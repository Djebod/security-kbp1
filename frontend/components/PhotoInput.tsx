"use client";
import { useRef, useState } from "react";
import Icon from "./Icon";

type Props = { name: string; label: string; required?: boolean; hint?: string };

/** Ambil foto dari kamera HP, perkecil ke 1024 px, JPEG 0.7, kirim sebagai data URL (hidden input) */
export default function PhotoInput({ name, label, required, hint }: Props) {
  const [dataUrl, setDataUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      setDataUrl(await perkecil(f));
    } catch {
      alert("Foto tidak bisa diproses. Coba ulangi.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}{required && <span className="text-red-600"> *</span>}</span>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
      <input type="hidden" name={name} value={dataUrl} />
      {dataUrl ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="Pratinjau" className="w-full rounded-xl border border-neo-mist object-cover" />
          <div className="flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-outline flex-1"><Icon name="camera" className="h-4 w-4" /> Ulangi</button>
            <button type="button" onClick={() => setDataUrl("")} className="btn-outline px-4"><Icon name="x" className="h-4 w-4" /></button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neo-mist bg-white py-8 text-neo-steel hover:border-neo-black">
          <Icon name="camera" className="h-8 w-8" />
          <span className="text-sm font-medium">{busy ? "Memproses..." : "Ambil Foto"}</span>
          {hint && <span className="text-xs text-neo-steel/60">{hint}</span>}
        </button>
      )}
    </div>
  );
}

function perkecil(file: File, maks = 1024, kualitas = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const skala = Math.min(1, maks / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * skala);
      c.height = Math.round(img.height * skala);
      const ctx = c.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", kualitas));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("img")); };
    img.src = url;
  });
}
