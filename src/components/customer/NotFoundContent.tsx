import { CustomerLink } from "@/components/customer/CustomerLink";
import { FadeIn } from "@/components/customer/FadeIn";
import { customerPageShellClass } from "@/lib/site/customer-layout";

export function NotFoundContent() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <div
        className={`${customerPageShellClass} flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-24`}
      >
        <FadeIn>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-light">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-md text-slate-600">
            The page you are looking for does not exist or may have been moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CustomerLink
              href="/"
              className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-light hover:shadow-xl"
            >
              Back to home
            </CustomerLink>
            <CustomerLink
              href="/products"
              className="inline-flex rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-all hover:bg-brand hover:text-white"
            >
              Browse products
            </CustomerLink>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
