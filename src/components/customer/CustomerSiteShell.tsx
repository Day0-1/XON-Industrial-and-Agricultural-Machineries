import { CustomerFooter } from "@/components/customer/CustomerFooter";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { CustomerMain } from "@/components/customer/CustomerMain";
import { FloatingWhatsApp } from "@/components/customer/FloatingWhatsApp";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import {
  getContactEmail,
  getContactLocation,
  getContactPhone,
} from "@/lib/site/contact";
import { getWhatsAppHref } from "@/lib/whatsapp";
import type { ReactNode } from "react";

export function CustomerSiteShell({ children }: { children: ReactNode }) {
  const whatsappHref = getWhatsAppHref(
    "Hello XON, I would like to inquire about your machineries.",
  );

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <CustomerHeader
        whatsappHref={whatsappHref}
        email={getContactEmail()}
        phone={getContactPhone()}
        location={getContactLocation()}
      />
      <CustomerMain>{children}</CustomerMain>
      <CustomerFooter />
      {whatsappHref && <FloatingWhatsApp href={whatsappHref} />}
    </>
  );
}
