import Link from "next/link";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  action?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
  action,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] bg-white px-6 py-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.08)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action ??
        (actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {actionLabel}
          </Link>
        ) : null)}
    </header>
  );
}
