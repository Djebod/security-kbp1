import Link from "next/link";
import Icon from "./Icon";

export default function PageHeader({ title, back, action, subtitle }: { title: string; back?: string; subtitle?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {back && (
          <Link href={back} className="-ml-1 rounded-full p-1.5 text-neo-silver transition hover:bg-neo-raise hover:text-neo-cloud" aria-label="Kembali">
            <Icon name="back" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="page-title truncate">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-xs text-neo-silver/70">{subtitle}</p>}
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
