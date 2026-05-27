import Image from "next/image";
import { partners, type Partner } from "@/lib/site/partners";

const logoHeightClassName = "h-12 sm:h-14 md:h-16 lg:h-[4.5rem]";

function PartnerLogo({ partner }: { partner: Partner }) {
  if (!partner.logoSrc) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center ${logoHeightClassName}`}
      >
        <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-slate-500 sm:text-base">
          {partner.shortName}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${logoHeightClassName}`}
    >
      <Image
        src={partner.logoSrc}
        alt={partner.name}
        width={240}
        height={96}
        sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px"
        className={`${logoHeightClassName} w-auto max-w-36 object-contain object-center sm:max-w-44 md:max-w-52 lg:max-w-60`}
      />
    </div>
  );
}

type PartnerLogoMarqueeProps = {
  showHeading?: boolean;
  className?: string;
};

export function PartnerLogoMarquee({
  showHeading = false,
  className = "",
}: PartnerLogoMarqueeProps) {
  // Use 4 copies so the track is always wider than the viewport.
  // This prevents "blank gaps" on wide screens and during fast scroll cycles.
  const loop = [...partners, ...partners, ...partners, ...partners];

  return (
    <section
      className={`border-y border-slate-100 bg-white py-8 sm:py-10 ${className}`.trim()}
      aria-labelledby={showHeading ? "partner-logos-heading" : undefined}
      aria-label={showHeading ? undefined : "Companies we have worked with"}
    >
      {showHeading && (
        <p
          id="partner-logos-heading"
          className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-slate-500"
        >
          Companies we have worked with
        </p>
      )}

      <div className="relative min-h-12 overflow-hidden sm:min-h-14 md:min-h-16 lg:min-h-18">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent sm:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-r from-transparent to-white sm:w-24"
          aria-hidden
        />

        <ul className="partner-marquee-track list-none items-center">
          {loop.map((partner, index) => (
            <li
              key={`${partner.id}-${index}`}
              aria-label={partner.name}
              className={`flex shrink-0 items-center px-5 sm:px-7 md:px-9 ${
                index >= partners.length ? "partner-marquee-duplicate" : ""
              }`}
            >
              <PartnerLogo partner={partner} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
