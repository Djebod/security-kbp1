import PageHeader from "@/components/PageHeader";
import PatroliForm from "./PatroliForm";

export default function Page() {
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Catat Patroli" back="/security-log" />
      <PatroliForm />
    </div>
  );
}
