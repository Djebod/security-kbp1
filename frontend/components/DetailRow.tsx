export function DetailList({ children }: { children: React.ReactNode }) {
  return <dl className="divide-y divide-neo-line">{children}</dl>;
}
export function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  const kosong = value === null || value === undefined || value === "";
  return (
    <div className="grid grid-cols-3 gap-3 py-2.5 text-sm">
      <dt className="text-neo-silver/60">{label}</dt>
      <dd className={`col-span-2 whitespace-pre-wrap break-words ${kosong ? "text-neo-silver/40" : "text-neo-cloud"}`}>{kosong ? "-" : value}</dd>
    </div>
  );
}
export function Foto({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="w-full rounded-2xl border border-neo-line object-cover" loading="lazy" />;
}
