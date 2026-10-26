import Link from "next/link";

export default function Pagination({ basePath, page, total, perPage, params }: { basePath: string; page: number; total: number; perPage: number; params?: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  if (pages <= 1) return null;
  const link = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => { if (v) sp.set(k, v); });
    sp.set("page", String(p));
    return `${basePath}?${sp.toString()}`;
  };
  return (
    <div className="mt-5 flex items-center justify-between text-sm">
      <span className="text-neo-steel/70">Halaman {page} dari {pages} · {total} data</span>
      <div className="flex gap-2">
        {page > 1 && <Link href={link(page - 1)} className="btn-outline px-3 py-2">Sebelumnya</Link>}
        {page < pages && <Link href={link(page + 1)} className="btn-outline px-3 py-2">Berikutnya</Link>}
      </div>
    </div>
  );
}

export function pageOf(v: string | undefined): number {
  const n = parseInt(v || "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
