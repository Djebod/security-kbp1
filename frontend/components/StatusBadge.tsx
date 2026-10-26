const MAP: Record<string, string> = {
  "ON PROGRESS": "badge-amber", DONE: "badge-green",
  TERIMA: "badge-amber", AMBIL: "badge-green",
  KEHILANGAN: "badge-red", PENEMUAN: "badge-dark",
};
const LABEL: Record<string, string> = { TERIMA: "Belum diambil", AMBIL: "Sudah diambil" };

export default function StatusBadge({ status }: { status: string }) {
  return <span className={MAP[status] || "badge-grey"}>{LABEL[status] || status}</span>;
}
