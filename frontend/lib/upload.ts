import "server-only";

export const FOTO_PREFIX = /^data:image\/(jpeg|png|webp);base64,/;
export const FOTO_MAKS_BYTE = 4 * 1024 * 1024;

/** Validasi data URL foto dari form. Mengembalikan pesan error atau null. */
export function cekFoto(dataUrl: string | null | undefined, wajib = false): string | null {
  if (!dataUrl) return wajib ? "Foto wajib diisi." : null;
  if (!FOTO_PREFIX.test(dataUrl)) return "Format foto tidak dikenali (harus JPEG/PNG/WebP).";
  if (dataUrl.length > FOTO_MAKS_BYTE) return "Ukuran foto terlalu besar (maks 4 MB).";
  return null;
}

/**
 * Kirim foto ke Google Drive lewat Apps Script. Mengembalikan URL gambar.
 * Jika UPLOAD_URL belum diisi (mis. saat uji lokal), data URL disimpan apa adanya ke database.
 */
export async function simpanFoto(dataUrl: string | null | undefined, nama: string, folder: string): Promise<string | null> {
  if (!dataUrl) return null;
  const url = process.env.UPLOAD_URL;
  if (!url) return dataUrl;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // text/plain: hindari preflight Apps Script
    body: JSON.stringify({ foto: dataUrl, nama, folder, secret: process.env.UPLOAD_SECRET || "" }),
    redirect: "follow",
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { status?: string; url?: string; message?: string };
  if (data.status !== "ok" || !data.url) {
    throw new Error("Upload foto gagal: " + (data.message || res.statusText));
  }
  return data.url;
}
