"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { SQL_JAM, SQL_TANGGAL, query } from "@/lib/db";
import { newId } from "@/lib/id";
import { cekFoto, simpanFoto } from "@/lib/upload";
import { pesanError, str, wajib, type FormState } from "@/lib/validate";

export async function terimaPaket(_prev: FormState, fd: FormData): Promise<FormState> {
  const s = await requireSession();
  let id = "";
  try {
    const pengirim = wajib(fd, "nama_pengirim", "Pengirim / ekspedisi", 200);
    const tanpaResi = fd.get("tanpa_resi") === "on";
    const resi = tanpaResi ? "TANPA RESI" : wajib(fd, "scan_barcode", "No. resi", 200);
    const penerima = wajib(fd, "penerima_barang", "Nama penerima", 200);
    const foto = str(fd, "photo_barang", 5_000_000);
    const errFoto = cekFoto(foto, true);
    if (errFoto) throw new Error(errFoto === "Foto wajib diisi." ? "Foto paket wajib diisi." : errFoto);

    id = newId();
    const urlFoto = await simpanFoto(foto, `paket_${id}`, "paket");
    await query(
      `INSERT INTO paket_manajemen (id, tanggal_diterima, jam_diterima, email, scan_barcode, nama_pengirim, nama_security_penerima, penerima_barang, photo_barang, status)
       VALUES ($1, ${SQL_TANGGAL}, ${SQL_JAM}, $2, $3, $4, $5, $6, $7, 'TERIMA')`,
      [id, s.email, resi, pengirim, s.nama, penerima, urlFoto]);
  } catch (e) {
    return { error: pesanError(e) };
  }
  redirect(`/paket/${id}`);
}

export async function serahkanPaket(_prev: FormState, fd: FormData): Promise<FormState> {
  const s = await requireSession();
  try {
    const id = wajib(fd, "id", "ID", 20);
    const foto = str(fd, "photo_pengambil", 5_000_000);
    const errFoto = cekFoto(foto, true);
    if (errFoto) throw new Error(errFoto === "Foto wajib diisi." ? "Foto orang yang mengambil wajib diisi." : errFoto);
    const urlFoto = await simpanFoto(foto, `pengambil_${id}`, "paket");
    const rows = await query(
      `UPDATE paket_manajemen SET status = 'AMBIL', nama_security_pemberi = $2, tanggal_diambil = ${SQL_TANGGAL}, jam_diambil = ${SQL_JAM}, photo_pengambil = $3
       WHERE id = $1 AND status IS DISTINCT FROM 'AMBIL' RETURNING id`, [id, s.nama, urlFoto]);
    if (!rows.length) throw new Error("Paket sudah diserahkan sebelumnya.");
    revalidatePath(`/paket/${id}`);
    return { ok: true };
  } catch (e) {
    return { error: pesanError(e) };
  }
}
