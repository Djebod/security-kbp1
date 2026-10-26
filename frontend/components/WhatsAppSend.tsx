"use client";
import { useState } from "react";
import { linkWA, normalisasiNomorWA } from "@/lib/wa";
import Icon from "./Icon";

/** Kolom nomor tujuan + tombol buka WhatsApp dengan pesan siap kirim */
export default function WhatsAppSend({ pesan, label = "Kirim info via WhatsApp" }: { pesan: string; label?: string }) {
  const [nomor, setNomor] = useState("");
  const [warn, setWarn] = useState("");

  function kirim() {
    const n = normalisasiNomorWA(nomor);
    if (!n) { setWarn("Nomor tidak sah. Contoh: 0812xxxx, 62812xxxx, atau +62 812-xxxx."); return; }
    setWarn("");
    window.open(linkWA(n, pesan), "_blank", "noopener");
  }

  return (
    <div className="card p-4">
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="flex gap-2">
        <input value={nomor} onChange={(e) => setNomor(e.target.value)} inputMode="tel" placeholder="Nomor WhatsApp tujuan" className="input" />
        <button type="button" onClick={kirim} className="btn-success shrink-0 px-4"><Icon name="wa" className="h-5 w-5" /> Kirim</button>
      </div>
      {warn && <p className="mt-2 text-xs text-red-600">{warn}</p>}
      <details className="mt-3 text-xs text-neo-steel/70">
        <summary className="cursor-pointer">Lihat isi pesan</summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-neo-cloud p-3 font-sans">{pesan}</pre>
      </details>
    </div>
  );
}
