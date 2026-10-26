/** Helper validasi form di server action */
export type FormState = { error?: string; ok?: boolean; id?: string };

export function str(fd: FormData, key: string, maks = 2000): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, maks) : "";
}

export function wajib(fd: FormData, key: string, label: string, maks = 2000): string {
  const v = str(fd, key, maks);
  if (!v) throw new Error(`${label} wajib diisi.`);
  return v;
}

export function salahSatu(v: string, daftar: readonly string[], label: string): string {
  if (!daftar.includes(v)) throw new Error(`${label} tidak valid.`);
  return v;
}

export function tanggalValid(v: string, label: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new Error(`${label} tidak valid.`);
  return v;
}

export function pesanError(e: unknown): string {
  return e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.";
}
