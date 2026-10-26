import PageHeader from "@/components/PageHeader";
import { query } from "@/lib/db";
import ChecklistForm from "./ChecklistForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  const lokasi = await query<{ code_lokasi: string; nama_lokasi: string }>("SELECT code_lokasi, nama_lokasi FROM db_lokasi WHERE aktif ORDER BY nama_lokasi");
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Checklist Baru" back="/shift-report" />
      <ChecklistForm lokasi={lokasi} />
    </div>
  );
}
