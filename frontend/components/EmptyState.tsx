export default function EmptyState({ text = "Belum ada data." }: { text?: string }) {
  return <div className="card py-12 text-center text-sm text-neo-steel/60">{text}</div>;
}
