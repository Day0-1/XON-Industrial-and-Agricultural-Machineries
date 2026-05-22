import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

type WhatsAppLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "whatsapp";
  className?: string;
  showIcon?: boolean;
};

const variantClasses = {
  primary:
    "bg-brand text-white hover:bg-brand-light shadow-sm shadow-brand/20",
  outline:
    "border-2 border-brand text-brand hover:bg-brand hover:text-white",
  whatsapp:
    "bg-[var(--accent)] text-black hover:bg-[#1da851] shadow-sm shadow-emerald-600/25",
};

export function WhatsAppLink({
  href,
  children,
  variant = "whatsapp",
  className = "",
  showIcon = true,
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
    >
      {showIcon && <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />}
      {children}
    </a>
  );
}
