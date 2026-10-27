"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

export type Stop = { kode: string; kota: string; ikon: string; detail: string };

/* ---------- Pesawat terbang di jalur putus-putus (hero) ---------- */
const JALUR = "M 40 300 C 260 120, 520 80, 760 150 S 1120 260, 1180 60";

export function FlightPath() {
  const [diam, setDiam] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setDiam(mq.matches);
  }, []);
  return (
    <svg viewBox="0 0 1200 340" className="h-auto w-full" aria-hidden>
      <path d={JALUR} fill="none" stroke="#b9bcc2" strokeOpacity=".35" strokeWidth="2" strokeDasharray="10 12" />
      {/* titik berangkat & tiba */}
      <circle cx="40" cy="300" r="6" fill="#c8ff2e" />
      <circle cx="40" cy="300" r="14" fill="none" stroke="#c8ff2e" strokeOpacity=".4" />
      <circle cx="1180" cy="60" r="6" fill="#c8ff2e" />
      <circle cx="1180" cy="60" r="14" fill="none" stroke="#c8ff2e" strokeOpacity=".4" />
      <g>
        {!diam && <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" path={JALUR} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />}
        {diam && <animateMotion dur="1s" fill="freeze" rotate="auto" path={JALUR} keyPoints="0.55;0.55" keyTimes="0;1" />}
        <Pesawat />
      </g>
    </svg>
  );
}

function Pesawat() {
  /* Pesawat tampak atas, hidung di kanan (arah +x): badan 1..56, sayap di tengah menyapu ke belakang, ekor kecil di kiri */
  return (
    <g transform="translate(-28 -14)">
      <path d="M56 14 L48 10.5 L32 9.5 L20 1.5 L14 1.5 L22 9.5 L9 10.5 L5 6 L2 6 L4 14 L2 22 L5 22 L9 17.5 L22 18.5 L14 26.5 L20 26.5 L32 18.5 L48 17.5 Z" fill="#f3f4f6" />
      <circle cx="47" cy="14" r="2.2" fill="#c8ff2e" />
    </g>
  );
}

/* ---------- Jalan berkelok dengan pin pemberhentian (laptop) ---------- */
const VB = { w: 1200, h: 480 };
const JALAN = "M -60 330 C 160 330, 220 110, 400 130 S 620 360, 800 320 S 1020 100, 1260 150";

export function RoadMap({ stops }: { stops: Stop[] }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [titik, setTitik] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    // pin ditaruh merata di sepanjang jalan, menjauhi tepi kiri & kanan
    const pts = stops.map((_, i) => {
      const t = 0.12 + (0.76 * i) / Math.max(1, stops.length - 1);
      const q = p.getPointAtLength(L * t);
      return { x: q.x, y: q.y };
    });
    setTitik(pts);
  }, [stops]);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="h-auto w-full" aria-hidden>
        {/* bayangan jalan */}
        <path d={JALAN} fill="none" stroke="#000" strokeOpacity=".45" strokeWidth="70" transform="translate(0 10)" />
        {/* tepi putih */}
        <path d={JALAN} fill="none" stroke="#e5e7eb" strokeWidth="64" />
        {/* badan jalan */}
        <path ref={pathRef} d={JALAN} fill="none" stroke="#1f232a" strokeWidth="56" />
        {/* garis tengah neon putus-putus */}
        <path d={JALAN} fill="none" stroke="#c8ff2e" strokeWidth="2.5" strokeDasharray="16 14" strokeOpacity=".9" />
      </svg>

      {titik.map((t, i) => {
        const s = stops[i];
        const atas = i % 2 === 0; // label bergantian di atas / bawah jalan
        return (
          <div key={s.kode} className="absolute" style={{ left: `${(t.x / VB.w) * 100}%`, top: `${(t.y / VB.h) * 100}%` }}>
            {/* pin */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-full">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full rounded-br-none bg-neo-neon text-neo-black shadow-glow" style={{ transform: "rotate(45deg)" }}>
                <span style={{ transform: "rotate(-45deg)" }}><Icon name={s.ikon} className="h-6 w-6" /></span>
              </div>
              <span className="absolute left-1/2 top-full mt-1 h-2 w-6 -translate-x-1/2 rounded-full bg-black/50 blur-[2px]" />
            </div>
            {/* label */}
            <div className={`absolute left-1/2 w-56 -translate-x-1/2 text-center ${atas ? "bottom-full mb-20" : "top-full mt-8"}`}>
              <p className="font-mono text-[10px] uppercase tracking-[.25em] text-neo-neon">{s.kode}</p>
              <p className="mt-1 text-sm font-semibold text-neo-cloud">{s.kota}</p>
              <p className="mt-1 text-xs leading-relaxed text-neo-silver/70">{s.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Versi HP: jalan vertikal ---------- */
export function RoadList({ stops }: { stops: Stop[] }) {
  return (
    <ol className="relative ml-6 space-y-10 py-4">
      {/* badan jalan vertikal: tepi putih, badan gelap, garis tengah neon putus-putus */}
      <div className="absolute -left-6 top-0 h-full w-12 rounded-full border-x-4 border-neo-mist bg-[#1f232a]" aria-hidden>
        <div className="mx-auto h-full w-0.5 border-l-2 border-dashed border-neo-neon/80" />
      </div>
      {stops.map((s) => (
        <li key={s.kode} className="relative pl-14">
          <div className="absolute -left-6 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-neo-neon text-neo-black shadow-glow">
            <Icon name={s.ikon} className="h-5 w-5" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[.25em] text-neo-neon">{s.kode}</p>
          <p className="mt-1 text-base font-semibold text-neo-cloud">{s.kota}</p>
          <p className="mt-1 text-sm leading-relaxed text-neo-silver/70">{s.detail}</p>
        </li>
      ))}
    </ol>
  );
}
