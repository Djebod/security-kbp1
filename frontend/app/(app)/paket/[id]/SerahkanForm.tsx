"use client";
import { useFormState } from "react-dom";
import FormError from "@/components/FormError";
import SubmitButton from "@/components/SubmitButton";
import PhotoInput from "@/components/PhotoInput";
import { serahkanPaket } from "../actions";

export default function SerahkanForm({ id }: { id: string }) {
  const [state, action] = useFormState(serahkanPaket, {});
  return (
    <form action={action} className="card space-y-3 p-4">
      <p className="text-sm font-semibold">Serahkan paket</p>
      <input type="hidden" name="id" value={id} />
      <PhotoInput name="photo_pengambil" label="Foto orang yang mengambil" required />
      <FormError error={state.error} />
      <SubmitButton className="btn-success btn-lg" pendingText="Memproses...">Serahkan Paket</SubmitButton>
    </form>
  );
}
