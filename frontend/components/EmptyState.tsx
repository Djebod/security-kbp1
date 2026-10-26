export default function EmptyState({ text = "Belum ada data." }: { text?: string }) {
  return <div className="rounded-2xl border border-dashed border-neo-line py-12 text-center text-sm text-neo-silver/60">{text}</div>;
}
