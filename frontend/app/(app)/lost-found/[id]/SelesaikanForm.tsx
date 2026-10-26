"use client";
import { useFormState } from "react-dom";
import FormError from "@/components/FormError";
import SubmitButton from "@/components/SubmitButton";
import { selesaikanLaporan } from "../actions";

export default function SelesaikanForm({ id }: { id: string }) {
  const [state, action] = useFormState(selesaikanLaporan, {});
  return (
    <form action={action} className="card space-y-3 p-4">
      <p className="text-sm font-semibold">Selesaikan laporan</p>
      <input type="hidden" name="id" value={id} />
      <div>
        <label className="label">Catatan penyelesaian <span className="text-neo-neon">*</span></label>
        <textarea name="remark" rows={3} required className="input" placeholder="Barang sudah dikembalikan ke pemilik, dll." />
      </div>
      <FormError error={state.error} />
      <SubmitButton className="btn-success btn-lg" pendingText="Memproses...">Tandai Selesai (DONE)</SubmitButton>
    </form>
  );
}
