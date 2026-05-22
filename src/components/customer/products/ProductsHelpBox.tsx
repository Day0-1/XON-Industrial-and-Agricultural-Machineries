import { MessageCircle } from "lucide-react";

type ProductsHelpBoxProps = {
  whatsappHref: string | null;
  compact?: boolean;
};

export function ProductsHelpBox({
  whatsappHref,
  compact = false,
}: ProductsHelpBoxProps) {
  return (
    <div
      className={`rounded-2xl bg-accent p-5 ring-1 ring-accent-hover/50 ${
        compact ? "" : "mt-8"
      }`}
    >
      <h3 className="text-base font-bold text-slate-900">
        {compact ? "Need help?" : "Need help choosing the right product?"}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {compact
          ? "Message us for specs, pricing, and availability."
          : "Tell us your workload, power needs, or farm scale—we will recommend suitable equipment and follow up on WhatsApp."}
      </p>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
          Chat on WhatsApp
        </a>
      )}
    </div>
  );
}
