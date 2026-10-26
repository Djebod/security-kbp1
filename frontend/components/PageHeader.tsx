import Link from "next/link";
import Icon from "./Icon";

export default function PageHeader({ title, back, action, subtitle }: { title: string; back?: string; subtitle?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {back && (
          <Link href={back} className="-ml-1 rounded-full p-1.5 text-neo-steel hover:bg-neo-mist" aria-label="Kembali">
            <Icon name="back" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="page-title truncate">{title}</h1>
          {subtitle && <p className="truncate text-xs text-neo-steel/70">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <Link href={action.href} className="btn-primary shrink-0 px-4 py-2.5">
          <Icon name="plus" className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}
