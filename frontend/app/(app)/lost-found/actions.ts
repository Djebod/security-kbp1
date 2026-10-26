"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { SQL_JAM, SQL_TANGGAL, query } from "@/lib/db";
import { newId } from "@/lib/id";
import { POSISI_PELAPOR } from "@/lib/config";
import { cekFoto, simpanFoto } from "@/lib/upload";
import { pesanError, salahSatu, str, tanggalValid, wajib, type FormState } from "@/lib/validate";

export async function simpanLaporan(_prev: FormState, fd: FormData): Promise<FormState> {
  const s = await requireSession();
  let id = "";
  try {
    const jenis = salahSatu(wajib(fd, "type_kejadian", "Jenis laporan"), ["KEHILANGAN", "PENEMUAN"], "Jenis laporan");
    const namaBarang = wajib(fd, "nama_barang", "Nama barang", 200);
    const deskripsi = wajib(fd, "deskripsi", "Deskripsi", 3000);
    const tglKejadian = tanggalValid(wajib(fd, "tanggal_kejadian", "Tanggal kejadian", 10), "Tanggal kejadian");
    const tempat = wajib(fd, "tempat_kejadian", "Tempat kejadian", 300);
    const pelapor = wajib(fd, "nama_pelapor", "Nama pelapor", 200);
    const posisi = str(fd, "posisi", 50);
    if (posisi) salahSatu(posisi, POSISI_PELAPOR, "Posisi pelapor");
    const foto = str(fd, "photo_barang", 5_000_000);
    const errFoto = cekFoto(foto, false);
    if (errFoto) throw new Error(errFoto);

    id = newId();
    const urlFoto = await simpanFoto(foto || null, `lostfound_${id}`, "lost-found");
    await query(
      `INSERT INTO laporan_kehilangan (id, tanggal, waktu, email, type_kejadian, nama_barang, deskripsi, photo_barang,
         tanggal_kejadian, waktu_kejadian, tempat_kejadian, nama_pelapor, posisi, nomor_identitas, alamat, penerima_laporan, status)
       VALUES ($1, ${SQL_TANGGAL}, ${SQL_JAM}, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'ON PROGRESS')`,
      [id, s.email, jenis, namaBarang, deskripsi, urlFoto, tglKejadian, str(fd, "waktu_kejadian", 10), tempat,
        pelapor, posisi, str(fd, "nomor_identitas", 100), str(fd, "alamat", 500), s.nama]);
  } catch (e) {
    return { error: pesanError(e) };
  }
  redirect(`/lost-found/${id}`);
}

export async function selesaikanLaporan(_prev: FormState, fd: FormData): Promise<FormState> {
  const s = await requireSession();
  try {
    const id = wajib(fd, "id", "ID", 20);
    const remark = wajib(fd, "remark", "Catatan penyelesaian", 3000);
    const rows = await query(
      `UPDATE laporan_kehilangan SET status = 'DONE', remark = $2, tanggal_selesai = ${SQL_TANGGAL}, waktu_selesai = ${SQL_JAM}, diselesaikan_oleh = $3
       WHERE id = $1 AND status IS DISTINCT FROM 'DONE' RETURNING id`, [id, remark, s.nama]);
    if (!rows.length) throw new Error("Laporan sudah selesai atau tidak ditemukan.");
    revalidatePath(`/lost-found/${id}`);
    return { ok: true };
  } catch (e) {
    return { error: pesanError(e) };
  }
}
