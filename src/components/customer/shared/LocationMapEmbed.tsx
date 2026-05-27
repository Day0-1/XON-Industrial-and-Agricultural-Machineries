import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  getContactMapEmbedUrl,
  getPrimaryStore,
} from "@/lib/site/contact";
import { StoreLocationsList } from "@/components/customer/shared/StoreLocationsList";

type LocationMapEmbedProps = {
  title?: string;
  showStoresList?: boolean;
  showContactLink?: boolean;
};

export function LocationMapEmbed({
  title = "Our Location",
  showStoresList = true,
  showContactLink = false,
}: LocationMapEmbedProps) {
  const mapUrl = getContactMapEmbedUrl();
  const primary = getPrimaryStore();

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
          <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            <div className="min-w-0">
              <span className="font-medium text-slate-800">{primary.name}</span>
              {primary.lines.map((line) => (
                <span key={line} className="block break-words">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
        {showContactLink && (
          <Link
            href="/contact"
            className="shrink-0 text-sm font-semibold text-brand hover:text-brand-light"
          >
            Contact us →
          </Link>
        )}
      </div>

      <div className="relative mt-6 w-full min-w-0 max-w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/80">
        <div className="relative h-[min(56vw,280px)] w-full sm:h-[360px] lg:h-[420px]">
          <iframe
            title={`Map showing ${primary.name}`}
            src={mapUrl}
            className="absolute inset-0 h-full w-full max-w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>

      {showStoresList && (
        <div className="mt-8 w-full min-w-0">
          <p className="text-sm font-semibold text-slate-900">All Lagos stores</p>
          <div className="mt-4">
            <StoreLocationsList showMapNote />
          </div>
        </div>
      )}
    </div>
  );
}
