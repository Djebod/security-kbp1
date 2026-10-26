"use server";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { SQL_JAM, SQL_TANGGAL, query, queryOne } from "@/lib/db";
import { newId } from "@/lib/id";
import { AKTIVITAS, AKTIVITAS_WAJIB_PIC, DAFTAR_PIC } from "@/lib/config";
import { cekFoto, simpanFoto } from "@/lib/upload";
import { pesanError, salahSatu, str, wajib, type FormState } from "@/lib/validate";

export async function simpanChecklist(_prev: FormState, fd: FormData): Promise<FormState> {
  const s = await requireSession();
  let id = "";
  try {
    const aktivitas = salahSatu(wajib(fd, "aktivitas", "Jenis aktivitas"), AKTIVITAS, "Jenis aktivitas");
    const code = wajib(fd, "code_lokasi", "Lokasi", 100);
    const lok = await queryOne<{ nama_lokasi: string }>("SELECT nama_lokasi FROM db_lokasi WHERE code_lokasi = $1 AND aktif", [code]);
    if (!lok) throw new Error("Lokasi tidak valid.");

    const wajibPic = AKTIVITAS_WAJIB_PIC.includes(aktivitas);
    const pic = str(fd, "pic2", 100);
    if (wajibPic) {
      if (!pic) throw new Error("PIC wajib dipilih untuk aktivitas ini.");
      salahSatu(pic, DAFTAR_PIC, "PIC");
    }
    const foto = str(fd, "photo", 5_000_000);
    const errFoto = cekFoto(foto, wajibPic);
    if (errFoto) throw new Error(wajibPic && !foto ? "Foto hasil cleaning wajib diisi." : errFoto);

    id = newId();
    const urlFoto = await simpanFoto(foto || null, `checklist_${id}`, "checklist");
    await query(
      `INSERT INTO checklist (id, tanggal, waktu, email, aktivitas, code_lokasi, nama_lokasi, security_name, pic2, photo, keterangan)
       VALUES ($1, ${SQL_TANGGAL}, ${SQL_JAM}, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, s.email, aktivitas, code, lok.nama_lokasi, s.nama, wajibPic ? pic : pic || null, urlFoto, str(fd, "keterangan", 3000)]);
  } catch (e) {
    return { error: pesanError(e) };
  }
  redirect(`/shift-report/${id}`);
}
