"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children = "Simpan", className = "btn-primary btn-lg", pendingText = "Menyimpan...", disabled }: { children?: React.ReactNode; className?: string; pendingText?: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
