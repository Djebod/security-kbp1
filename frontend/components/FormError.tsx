import Icon from "./Icon";
export default function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="notice-bad flex items-start gap-2 text-sm">
      <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" /> {error}
    </div>
  );
}
