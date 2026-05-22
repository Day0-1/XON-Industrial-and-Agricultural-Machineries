import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import {
  getContactEmail,
  getContactPhone,
} from "@/lib/site/contact";
import { siteConfig } from "@/lib/seo/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

const footerColumns = [
  {
    title: "Products",
    links: [
      { href: "/products", label: "All products" },
      { href: "/products?category=industrial", label: "Industrial" },
      { href: "/products?category=agricultural", label: "Agricultural" },
      { href: "/products", label: "Gallery" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Inquiries",
    links: [
      { href: "/contact", label: "Get in touch" },
      { href: "/products", label: "Browse catalog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/contact", label: "Privacy" },
      { href: "/contact", label: "Terms" },
    ],
  },
] as const;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CustomerFooter() {
  const email = getContactEmail();
  const phone = getContactPhone();
  const whatsappHref = getWhatsAppHref(
    "Hello XON, I would like to get in touch.",
  );
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] lg:gap-16">
          <div className="max-w-md">
            <p className="text-2xl font-bold uppercase tracking-widest text-slate-900">
              {siteConfig.shortName}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              {siteConfig.description}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <WhatsAppLink
                href={whatsappHref ?? "/contact"}
                className="w-full justify-center sm:w-auto"
              >
                Chat on WhatsApp
              </WhatsAppLink>
              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-colors hover:bg-brand-light sm:w-auto"
              >
                View products
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {/* <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-full border-2 border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand sm:w-auto"
              >
                Contact us
              </Link> */}
            </div>

            <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-5">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-brand"
              >
                <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-brand"
              >
                <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                {email}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {footerColumns.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden py-6">
          <div
            className="pointer-events-none flex items-center justify-center select-none"
            aria-hidden
          >
            <Image
              src="/logo1.jfif"
              alt=""
              width={900}
              height={200}
              className="h-[300px] w-full max-w-4xl  object-contain grayscale opacity-20"
            />
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-400">
            &copy; {year} {siteConfig.shortName}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${email}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand"
              aria-label="Email us"
            >
              <Mail className="h-4 w-4" aria-hidden />
            </a>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#25D366]"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
              </a>
            ) : (
              <Link
                href="/contact"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#25D366]"
                aria-label="Contact us"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
