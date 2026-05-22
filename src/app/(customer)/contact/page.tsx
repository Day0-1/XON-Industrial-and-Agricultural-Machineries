import { getWhatsAppHref } from "@/lib/whatsapp";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact XON via email or WhatsApp for product inquiries and orders.",
  path: "/contact",
});

export default function ContactPage() {
  const email = process.env.CONTACT_EMAIL ?? "info@xonmachineries.com";
  const whatsappHref = getWhatsAppHref(
    "Hello XON, I would like to get in touch.",
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Contact us
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Reach out for product availability, pricing, and orders. We respond
        through email and WhatsApp.
      </p>

      <ul className="mt-10 space-y-6">
        <li className="rounded-xl border border-border p-5">
          <p className="text-sm font-medium text-slate-500">Email</p>
          <a
            href={`mailto:${email}`}
            className="mt-1 block text-lg font-medium text-brand hover:underline"
          >
            {email}
          </a>
        </li>
        {whatsappHref && (
          <li className="rounded-xl border border-border p-5">
            <p className="text-sm font-medium text-slate-500">WhatsApp</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1da851]"
            >
              Open WhatsApp chat
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
