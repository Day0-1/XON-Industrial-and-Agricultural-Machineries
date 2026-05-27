import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { storeLocations } from "@/lib/site/contact";
import {
  contactPhoneTelHref,
  contactWorkingHours,
  formatContactPhone,
  getContactEmail,
  getContactPhones,
  getSocialLinks,
  type SocialLink,
} from "@/lib/site/contact";

type ContactInfoPanelProps = {
  whatsappHref: string | null;
};

const panelClass = "flex h-full flex-col rounded-2xl bg-white p-6 sm:p-8";

function SocialIcon({ id }: { id: SocialLink["id"] }) {
  if (id === "facebook") return <FaFacebookF className="h-4 w-4" aria-hidden />;
  if (id === "linkedin") return <FaLinkedinIn className="h-4 w-4" aria-hidden />;
  if (id === "instagram") return <FaInstagram className="h-4 w-4" aria-hidden />;
  if (id === "youtube") return <FaYoutube className="h-4 w-4" aria-hidden />;
  if (id === "tiktok") return <FaTiktok className="h-4 w-4" aria-hidden />;
  return null;
}

export function ContactInfoPanel({ whatsappHref }: ContactInfoPanelProps) {
  const email = getContactEmail();
  const phones = getContactPhones();
  const socialLinks = getSocialLinks();

  return (
    <div className={panelClass}>
      <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>

      <ul className="mt-8 space-y-7">
        <li className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/8 text-brand">
            <MapPin className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Our stores (Lagos)</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {storeLocations.length} locations — full addresses in the form and on
              the map below (map shows Aswani Market).
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
              {storeLocations.map((store) => (
                <li key={store.id}>{store.name}</li>
              ))}
            </ul>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/8 text-brand">
            <Phone className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Phone</p>
            <div className="mt-1 flex flex-col gap-1">
              {phones.map((phone) => (
                <a
                  key={phone}
                  href={contactPhoneTelHref(phone)}
                  className="text-sm text-slate-600 transition-colors hover:text-brand"
                >
                  {formatContactPhone(phone)}
                </a>
              ))}
            </div>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/8 text-brand">
            <Mail className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Email</p>
            <a
              href={`mailto:${email}`}
              className="mt-1 block break-all text-sm text-slate-600 transition-colors hover:text-brand"
            >
              {email}
            </a>
          </div>
        </li>

        <li className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/8 text-brand">
            <Clock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Working Hours</p>
            <ul className="mt-1 space-y-1 text-sm text-slate-600">
              {contactWorkingHours.map((row) => (
                <li key={row.label}>
                  <span className="font-medium text-slate-700">{row.label}:</span>{" "}
                  {row.value}
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>

      {whatsappHref && (
        <div className="mt-8 rounded-2xl bg-accent/25 p-5">
          <p className="text-sm font-bold text-slate-900">Chat on WhatsApp</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Need quick assistance? Chat with us on WhatsApp now.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            Chat on WhatsApp
          </a>
        </div>
      )}

      {socialLinks.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-900">Follow us</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand"
              >
                <SocialIcon id={social.id} />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
