import Link from "next/link";
import { ArrowRight, ArrowUp, Mail, MessageCircle, Phone } from "lucide-react";
import { WhatsAppLink } from "@/components/customer/WhatsAppLink";
import { listActiveCollections } from "@/integrations/mongodb/collections";
import {
  getContactEmail,
  getContactPhone,
} from "@/lib/site/contact";
import { siteConfig } from "@/lib/seo/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

const staticFooterColumns = [
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

const MAX_FOOTER_CATEGORY_LINKS = 5;

function buildProductFooterLinks(
  collections: Awaited<ReturnType<typeof listActiveCollections>>,
) {
  return [
    { href: "/products", label: "All products" },
    ...collections.slice(0, MAX_FOOTER_CATEGORY_LINKS).map((col) => ({
      href: `/products?category=${col.slug}`,
      label: col.name,
    })),
  ];
}

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

export async function CustomerFooter() {
  const collections = await listActiveCollections();
  const footerColumns = [
    {
      title: "Products",
      links: buildProductFooterLinks(collections),
    },
    ...staticFooterColumns,
  ];

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

        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
            <p>&copy; {year}</p>
            <a
              href="#page-top"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 transition-colors hover:text-brand"
            >
              Back to top
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
                <ArrowUp className="h-4 w-4" aria-hidden />
              </span>
            </a>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
              Need machinery or support?
            </p>
            <Link
              href="/contact"
              className="mt-3 block text-[clamp(2.75rem,12vw,6.5rem)] font-bold leading-none tracking-tight text-slate-200 transition-colors hover:text-slate-300"
            >
              Let&apos;s talk
            </Link>
            <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">
              {siteConfig.name}
            </p>
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
