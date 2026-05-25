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
  minHeightClass?: string;
  aspectClass?: string;
};

export function LocationMapEmbed({
  title = "Our Location",
  showStoresList = true,
  showContactLink = false,
  minHeightClass = "min-h-[280px]",
  aspectClass = "aspect-[16/9]",
}: LocationMapEmbedProps) {
  const mapUrl = getContactMapEmbedUrl();
  const primary = getPrimaryStore();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
          <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            <div>
              <span className="font-medium text-slate-800">{primary.name}</span>
              {primary.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
        {showContactLink && (
          <Link
            href="/contact"
            className="text-sm font-semibold text-brand hover:text-brand-light"
          >
            Contact us →
          </Link>
        )}
      </div>

      <div
        className={`relative mt-6 overflow-hidden rounded-2xl ${aspectClass} ${minHeightClass}`}
      >
        <iframe
          title={`Map showing ${primary.name}`}
          src={mapUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {showStoresList && (
        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-900">All Lagos stores</p>
          <div className="mt-4">
            <StoreLocationsList showMapNote />
          </div>
        </div>
      )}
    </div>
  );
}
