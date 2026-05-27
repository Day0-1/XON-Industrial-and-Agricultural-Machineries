"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import { buildProductQuoteMessage } from "@/lib/whatsapp";

type ProductDetailActionsProps = {
  productName: string;
  productSlug: string;
  chatHref: string | null;
  whatsappNumber: string | null;
};

export function ProductDetailActions({
  productName,
  productSlug,
  chatHref,
  whatsappNumber,
}: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const quoteHref = useMemo(() => {
    if (!whatsappNumber) return null;
    const message = buildProductQuoteMessage(
      productName,
      quantity,
      productSlug,
    );
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [productName, productSlug, quantity, whatsappNumber]);

  function decrement() {
    setQuantity((value) => Math.max(1, value - 1));
  }

  function increment() {
    setQuantity((value) => Math.min(99, value + 1));
  }

  return (
    <div className="mt-8 space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-600">Quantity</p>
        <div className="mt-2 inline-flex items-center rounded-lg border border-slate-200 bg-white">
          <button
            type="button"
            onClick={decrement}
            className="flex h-11 w-11 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span
            className="min-w-[3rem] border-x border-slate-200 px-3 text-center text-sm font-semibold text-slate-900"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            className="flex h-11 w-11 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-col">
        {quoteHref && (
          <a
            href={quoteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-accent-hover"
          >
            Request a quote
          </a>
        )}
        {chatHref && (
          <WhatsAppLink
            href={chatHref}
            variant="primary"
            className="w-full rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold hover:bg-slate-800"
            showIcon
          >
            Chat on WhatsApp
          </WhatsAppLink>
        )}
      </div>
    </div>
  );
}
