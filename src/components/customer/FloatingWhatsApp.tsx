"use client";

import { MessageCircle } from "lucide-react";
import { MdWhatsapp } from "react-icons/md";

type FloatingWhatsAppProps = {
  href: string;
};

export function FloatingWhatsApp({ href }: FloatingWhatsAppProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact XON on WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/30 transition-transform hover:scale-105 hover:bg-[#1da851] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
    >
      <MdWhatsapp className="h-7 w-7" aria-hidden />
    </a>
  );
}
