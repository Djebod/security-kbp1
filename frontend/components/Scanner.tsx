"use client";
import { useEffect, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";
import Icon from "./Icon";

type Props = { onScan: (text: string) => void; onClose: () => void; title?: string };

/** Scanner QR/barcode dengan kamera belakang (html5-qrcode), 10 fps, flash bila didukung */
export default function Scanner({ onScan, onClose, title = "Arahkan kamera ke QR / barcode" }: Props) {
  const ref = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState("");
  const [torch, setTorch] = useState(false);
  const [torchOk, setTorchOk] = useState(false);
  const id = "neo-scanner";

  useEffect(() => {
    let aktif = true;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const sc = new Html5Qrcode(id, { verbose: false });
        ref.current = sc;
        await sc.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: (w, h) => ({ width: Math.min(w, h) * 0.75, height: Math.min(w, h) * 0.75 }), aspectRatio: 1 },
          (text) => {
            if (!aktif) return;
            aktif = false;
            if (navigator.vibrate) navigator.vibrate(80);
            sc.stop().catch(() => {}).finally(() => onScan(text.trim()));
          },
          () => {}
        );
        try {
          const caps = sc.getRunningTrackCapabilities() as MediaTrackCapabilities & { torch?: boolean };
          setTorchOk(!!caps?.torch);
        } catch { /* abaikan */ }
      } catch (e) {
        setError("Kamera tidak bisa dibuka. Izinkan akses kamera di browser, lalu coba lagi.");
        console.error(e);
      }
    })();
    return () => {
      aktif = false;
      const sc = ref.current;
      if (sc && sc.isScanning) sc.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleTorch() {
    const sc = ref.current;
    if (!sc) return;
    try {
      // @ts-expect-error torch adalah constraint non-standar
      await sc.applyVideoConstraints({ advanced: [{ torch: !torch }] });
      setTorch((t) => !t);
    } catch { setTorchOk(false); }
  }

  async function tutup() {
    const sc = ref.current;
    if (sc && sc.isScanning) await sc.stop().catch(() => {});
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-neo-black text-neo-silver">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm">{title}</p>
        <button onClick={tutup} className="rounded-full p-2 hover:bg-white/10" aria-label="Tutup"><Icon name="x" /></button>
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div id={id} className="w-full max-w-md overflow-hidden rounded-2xl [&_video]:rounded-2xl" />
      </div>
      {error && <p className="px-6 pb-4 text-center text-sm text-red-300">{error}</p>}
      <div className="flex gap-3 px-4 pb-8">
        {torchOk && (
          <button onClick={toggleTorch} className="btn flex-1 border border-white/20 text-neo-silver">
            <Icon name="flash" className="h-4 w-4" /> {torch ? "Matikan Flash" : "Nyalakan Flash"}
          </button>
        )}
        <button onClick={tutup} className="btn flex-1 bg-white text-neo-black">Tutup</button>
      </div>
    </div>
  );
}
