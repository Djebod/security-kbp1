import PageHeader from "@/components/PageHeader";
import PaketForm from "./PaketForm";

export default function Page() {
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Terima Paket" back="/paket" />
      <PaketForm />
    </div>
  );
}
