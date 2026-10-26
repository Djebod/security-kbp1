import Icon from "./Icon";
export default function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" /> {error}
    </div>
  );
}
