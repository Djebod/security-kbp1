import Link from "next/link";

type Chip = { value: string; label: string; count?: number };

/** Kotak cari + saringan (chip). Semua lewat query string supaya bisa di-bookmark. */
export default function SearchFilter({
  basePath, q, chips, chipKey = "f", chipValue = "", extra,
}: { basePath: string; q?: string; chips?: Chip[]; chipKey?: string; chipValue?: string; extra?: Record<string, string> }) {
  const hidden = Object.entries(extra || {}).filter(([, v]) => v);
  return (
    <div className="mb-4 space-y-3">
      <form action={basePath} className="flex gap-2">
        {chipValue && <input type="hidden" name={chipKey} value={chipValue} />}
        {hidden.map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
        <input name="q" defaultValue={q || ""} placeholder="Cari..." className="input" />
        <button className="btn-outline px-4">Cari</button>
      </form>
      {chips && chips.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => {
            const sp = new URLSearchParams({ ...(q ? { q } : {}), ...(c.value ? { [chipKey]: c.value } : {}), ...Object.fromEntries(hidden) });
            const aktif = (chipValue || "") === c.value;
            return (
              <Link key={c.value} href={`${basePath}?${sp.toString()}`} className={aktif ? "chip-active whitespace-nowrap" : "chip whitespace-nowrap"}>
                {c.label}{typeof c.count === "number" && <span className="ml-1 opacity-70">({c.count})</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
