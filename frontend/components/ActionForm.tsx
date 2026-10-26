"use client";
import { useFormState } from "react-dom";
import type { FormState } from "@/lib/validate";
import FormError from "./FormError";
import SubmitButton from "./SubmitButton";

type Props = {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
  submitClass?: string;
};

/** Pembungkus form server action: tampilkan error + tombol Simpan dengan status "Menyimpan..." */
export default function ActionForm({ action, children, submitLabel = "Simpan", submitClass }: Props) {
  const [state, formAction] = useFormState(action, {});
  return (
    <form action={formAction} className="space-y-4">
      {children}
      <FormError error={state.error} />
      <SubmitButton className={submitClass}>{submitLabel}</SubmitButton>
    </form>
  );
}
