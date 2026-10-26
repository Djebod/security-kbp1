import PageHeader from "@/components/PageHeader";
import { SQL_TANGGAL, query } from "@/lib/db";
import LostFoundForm from "./LostFoundForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [{ hariIni }] = await query<{ hariIni: string }>(`SELECT ${SQL_TANGGAL}::text AS "hariIni"`);
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Laporan Lost & Found" back="/lost-found" />
      <LostFoundForm hariIni={hariIni} />
    </div>
  );
}
