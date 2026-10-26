/** Logo teks "HOTEL NEO by ASTON" — versi tipografi, tanpa gambar */
export default function NeoLogo({ size = "md", light = true }: { size?: "sm" | "md" | "lg"; light?: boolean }) {
  const fg = light ? "text-neo-silver" : "text-neo-black";
  const bar = light ? "bg-neo-silver text-neo-black" : "bg-neo-black text-neo-silver";
  const s = size === "lg" ? { hotel: "text-xs tracking-[.5em]", neo: "text-5xl", bar: "text-[11px] px-5" }
    : size === "md" ? { hotel: "text-[9px] tracking-[.45em]", neo: "text-3xl", bar: "text-[9px] px-3" }
    : { hotel: "text-[7px] tracking-[.4em]", neo: "text-xl", bar: "text-[7px] px-2" };
  return (
    <div className={`inline-flex flex-col items-center ${fg}`} aria-label="Hotel NEO by ASTON">
      <span className={`font-display uppercase ${s.hotel}`}>Hotel</span>
      <span className={`font-display leading-none tracking-[.15em] ${s.neo}`}>NEO</span>
      <span className={`mt-1.5 rounded-sm py-0.5 font-display uppercase tracking-[.2em] ${bar} ${s.bar}`}>by ASTON</span>
    </div>
  );
}
