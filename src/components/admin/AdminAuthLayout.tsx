import Image from "next/image";
import Link from "next/link";
import { getSiteUrl } from "@/lib/seo/site";
import type { ReactNode } from "react";

type AdminAuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  badge?: string;
  footer?: ReactNode;
};

export function AdminAuthLayout({
  title,
  description,
  children,
  badge,
  footer,
}: AdminAuthLayoutProps) {
  const siteUrl = getSiteUrl();

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto flex w-full max-w-sm flex-col justify-center px-6 py-16 sm:py-24">
        <div className="mb-10 flex justify-center">
          <Image
            src="/logo.png"
            alt="XON"
            width={120}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </div>

        <div className="mb-8">
          {badge && (
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {badge}
            </p>
          )}
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        {children}

        {footer && <div className="mt-6">{footer}</div>}

        <p className="mt-10 text-center text-xs text-slate-500">
          <Link
            href={siteUrl}
            className="hover:text-slate-900 hover:underline"
          >
            Back to website
          </Link>
        </p>
      </main>
    </div>
  );
}
