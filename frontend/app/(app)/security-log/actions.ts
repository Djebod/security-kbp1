"use server";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { SQL_JAM, SQL_TANGGAL, query, queryOne } from "@/lib/db";
import { newId } from "@/lib/id";
import { pesanError, str, type FormState } from "@/lib/validate";

/** Cek kode hasil scan ke db_lokasi (dipanggil dari client setelah scan) */
export async function cekLokasi(code: string): Promise<{ ok: boolean; nama?: string; code?: string }> {
  await requireSession();
  const c = (code || "").trim().slice(0, 100);
  if (!c) return { ok: false };
  const row = await queryOne<{ code_lokasi: string; nama_lokasi: string }>(
    "SELECT code_lokasi, nama_lokasi FROM db_lokasi WHERE code_lokasi = $1 AND aktif", [c]);
  return row ? { ok: true, nama: row.nama_lokasi, code: row.code_lokasi } : { ok: false };
}

export async function simpanPatroli(_prev: FormState, fd: FormData): Promise<FormState> {
  const s = await requireSession();
  try {
    const code = str(fd, "code_lokasi", 100);
    if (!code) throw new Error("Scan QR titik patroli dulu.");
    const lok = await queryOne<{ nama_lokasi: string }>("SELECT nama_lokasi FROM db_lokasi WHERE code_lokasi = $1 AND aktif", [code]);
    if (!lok) throw new Error("Barcode tidak dikenali.");
    await query(
      `INSERT INTO security_log (id, tanggal, waktu, email, code_lokasi, nama_lokasi, security_name)
       VALUES ($1, ${SQL_TANGGAL}, ${SQL_JAM}, $2, $3, $4, $5)`,
      [newId(), s.email, code, lok.nama_lokasi, s.nama]);
  } catch (e) {
    return { error: pesanError(e) };
  }
  redirect("/security-log?saved=1");
}
