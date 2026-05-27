import { ContactInfoPanel } from "@/components/customer/contact/ContactInfoPanel";
import { ContactMessageForm } from "@/components/customer/contact/ContactMessageForm";
import { FadeIn } from "@/components/customer/FadeIn";
import { ProductBreadcrumbs } from "@/components/customer/products/ProductBreadcrumbs";
import { LocationMapEmbed } from "@/components/customer/shared/LocationMapEmbed";
import { StoreLocationsList } from "@/components/customer/shared/StoreLocationsList";
import { customerPageShellClass } from "@/lib/site/customer-layout";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Contact XON at our Lagos stores — Aswani Market, Alaba International, and Arena Shopping Complex. Phone, email, and WhatsApp.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappHref = getWhatsAppHref(
    "Hello XON, I would like to get in touch.",
  );
  return (
    <div className="overflow-x-hidden bg-white">
      <div className={`${customerPageShellClass} min-w-0`}>
        <FadeIn>
          <ProductBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Contact Us" },
            ]}
          />
        </FadeIn>

        <FadeIn delay={0.04}>
          <h1 className="sr-only">Contact Us</h1>
        </FadeIn>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-12 lg:gap-10">
          <FadeIn delay={0.06} className="lg:col-span-4">
            <ContactInfoPanel whatsappHref={whatsappHref} />
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-8">
            <ContactMessageForm />
          </FadeIn>
        </div>

        <FadeIn delay={0.14} className="min-w-0">
          <div className="mt-10 w-full min-w-0 lg:mt-12">
            <LocationMapEmbed showStoresList={false} />
            <div className="mt-8 border-t border-slate-100 pt-8">
              <p className="text-sm font-semibold text-slate-900">
                All store addresses
              </p>
              <div className="mt-4 max-w-2xl">
                <StoreLocationsList showMapNote />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
