"use client";

import Image from "next/image";
import { CustomerLink } from "@/components/customer/CustomerLink";
import { usePathname } from "next/navigation";
import {
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { MdWhatsapp } from "react-icons/md";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact Us" },
] as const;

export type CustomerHeaderProps = {
  whatsappHref: string | null;
  email: string;
  phone: string;
  location: string;
};

function Logo({
  onNavigate,
  prefetchHome,
}: {
  onNavigate?: () => void;
  prefetchHome?: boolean;
}) {
  return (
    <CustomerLink
      href="/"
      prefetch={prefetchHome}
      onClick={onNavigate}
      className="flex items-center border-r border-slate-200 py-2.5 pr-3 sm:py-4 sm:pr-6"
    >
      <Image
        src="/logo.png"
        alt="XON Indust Enterprise"
        width={180}
        height={64}
        className="h-10 w-auto max-w-[130px] object-contain object-left sm:h-16 sm:max-w-[200px]"
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </CustomerLink>
  );
}

function ContactItem({
  icon: Icon,
  href,
  children,
  className = "",
  variant = "drawer",
}: {
  icon: typeof Phone;
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "bar" | "drawer";
}) {
  const inner =
    variant === "bar" ? (
      <>
        <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        <span className="whitespace-nowrap text-sm text-slate-800">{children}</span>
      </>
    ) : (
      <>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/8 text-brand">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="text-sm font-medium text-slate-800">{children}</span>
      </>
    );

  const base =
    variant === "drawer"
      ? `flex items-center gap-3 transition-colors hover:text-brand ${className}`
      : `inline-flex items-center gap-2 transition-colors hover:text-brand ${className}`;

  if (href) {
    return (
      <a href={href} className={base}>
        {inner}
      </a>
    );
  }
  return <span className={base}>{inner}</span>;
}

function HeaderWhatsAppButton({
  href,
  className = "",
}: {
  href: string | null;
  className?: string;
}) {
  const isExternal = Boolean(href?.includes("wa.me"));

  return (
    <a
      href={href ?? "/contact"}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-slate-900 shadow-md shadow-accent/30 transition-all hover:bg-accent-hover hover:shadow-lg ${className}`}
      title={
        isExternal
          ? "Open WhatsApp chat"
          : "Set WHATSAPP_NUMBER in .env to enable direct chat"
      }
    >
      <MdWhatsapp className="h-4 w-4 shrink-0" aria-hidden />
      Chat on WhatsApp
    </a>
  );
}

function isNavActive(pathname: string, href: string, label: string) {
  if (href === "/") return pathname === "/";
  if (href === "/contact" && label === "Contact Us") return pathname === "/contact";
  if (href === "/about" && label === "About Us") return pathname === "/about";
  if (href === "/products" && label === "Products") {
    return pathname === "/products" || pathname.startsWith("/products/");
  }
  return false;
}

export function CustomerHeader({
  whatsappHref,
  email,
  phone,
  location,
}: CustomerHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-[auto_1fr]">
          <div className="row-span-1 md:row-span-2">
            <Logo onNavigate={closeMenu} prefetchHome={pathname !== "/"} />
          </div>

          {/* Top row: contacts (desktop) + WhatsApp + menu toggle */}
          <div className="flex min-h-12 flex-wrap items-center justify-end gap-3 border-b border-slate-100 py-2 pl-4">
            <div className="hidden items-center gap-6 lg:flex xl:gap-8">
              <ContactItem
                variant="bar"
                icon={Phone}
                href={`tel:${phone.replace(/\s/g, "")}`}
              >
                {phone}
              </ContactItem>
              <ContactItem variant="bar" icon={Mail} href={`mailto:${email}`}>
                {email}
              </ContactItem>
              <ContactItem variant="bar" icon={MapPin}>
                {location}
              </ContactItem>
            </div>

            <div className="flex items-center gap-2">
              <HeaderWhatsAppButton
                href={whatsappHref}
                className="hidden! md:flex!"
              />
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 lg:hidden"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Desktop / tablet nav */}
          <div className="hidden min-h-11 items-stretch justify-end py-2 pl-2 md:flex md:pl-4">
            <div className="hidden items-stretch justify-end   lg:flex">
              <nav className="flex items-center justify-end" aria-label="Main">
                {navLinks.map((link) => {
                  const active = isNavActive(pathname, link.href, link.label);
                  return (
                    <CustomerLink
                      key={link.label}
                      href={link.href}
                      prefetch={!active}
                      className={`whitespace-nowrap border-r border-slate-200 px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors xl:px-4 xl:text-xs ${
                        active
                          ? "text-brand underline decoration-accent decoration-2 underline-offset-[5px]"
                          : "text-slate-700 hover:bg-slate-50 hover:text-brand"
                      }`}
                    >
                      {link.label}
                    </CustomerLink>
                  );
                })}
              </nav>
              <CustomerLink
                href="/products"
                prefetch={pathname !== "/products" && !pathname.startsWith("/products/")}
                className="flex items-center border-l border-slate-300 px-4 text-slate-600 transition-colors hover:text-brand"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </CustomerLink>
            </div>

            <nav
              className="flex items-center justify-end gap-1 overflow-x-auto rounded-lg border border-slate-300 px-1 lg:hidden"
              aria-label="Main tablet"
            >
              {navLinks.map((link) => {
                const active = isNavActive(pathname, link.href, link.label);
                return (
                  <CustomerLink
                    key={link.label}
                    href={link.href}
                    prefetch={!active}
                    className={`whitespace-nowrap px-2 py-2 text-[10px] font-bold uppercase tracking-wide ${
                      active
                        ? "text-brand underline decoration-accent"
                        : "text-slate-700"
                    }`}
                  >
                    {link.label}
                  </CustomerLink>
                );
              })}
              <CustomerLink
                href="/products"
                prefetch={pathname !== "/products" && !pathname.startsWith("/products/")}
                aria-label="Search products"
                className="shrink-0 p-2 text-slate-600"
              >
                <Search className="h-4 w-4" aria-hidden />
              </CustomerLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-end px-4 py-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-6"
            aria-label="Mobile"
          >
            <ul className="divide-y divide-slate-100">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <CustomerLink
                    href={link.href}
                    prefetch={!isNavActive(pathname, link.href, link.label)}
                    onClick={closeMenu}
                    className="block py-3 text-sm font-medium text-slate-800"
                  >
                    {link.label}
                  </CustomerLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4 border-t border-slate-100 px-6 py-5">
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="hover:text-brand"
                >
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-brand">
                  {email}
                </a>
              </li>
              <li>{location}</li>
            </ul>
            <HeaderWhatsAppButton href={whatsappHref} className="w-full" />
          </div>
        </div>
      )}
    </header>
  );
}
