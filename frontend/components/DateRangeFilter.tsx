import Link from "next/link";

/**
 * Filter rentang tanggal (Dari – Sampai). Form GET biasa, jadi tetap jalan tanpa JavaScript
 * dan bisa di-bookmark. Parameter lain (q, f, ...) dibawa lewat `extra`.
 */
export default function DateRangeFilter({
  basePath, dari, sampai, extra,
}: { basePath: string; dari?: string; sampai?: string; extra?: Record<string, string> }) {
  const hidden = Object.entries(extra || {}).filter(([, v]) => v);
  const aktif = Boolean(dari || sampai);
  const hapus = new URLSearchParams(Object.fromEntries(hidden)).toString();
  return (
    <form action={basePath} className="card mb-4 p-3">
      {hidden.map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="label">Dari tanggal</span>
          <input type="date" name="dari" defaultValue={dari || ""} max={sampai || undefined} className="input" />
        </label>
        <label className="block">
          <span className="label">Sampai tanggal</span>
          <input type="date" name="sampai" defaultValue={sampai || ""} min={dari || undefined} className="input" />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="btn-primary flex-1">Terapkan tanggal</button>
        {aktif && <Link href={hapus ? `${basePath}?${hapus}` : basePath} className="btn-outline">Hapus</Link>}
      </div>
    </form>
  );
}
