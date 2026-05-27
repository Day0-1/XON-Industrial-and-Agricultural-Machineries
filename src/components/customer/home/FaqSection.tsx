"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FadeIn } from "@/components/customer/FadeIn";
import { siteFaqs } from "@/lib/site/faq";
import { SectionHeading } from "./SectionHeading";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Quick answers about ordering, delivery, and support."
          />
        </FadeIn>

        <ul className="mt-12 space-y-3">
          {siteFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeIn key={faq.question} delay={index * 0.05}>
                <li className="overflow-hidden rounded-2xl ">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 sm:text-base"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                  >
                    {faq.question}
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-brand transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <p className="border-t border-border px-5 pb-4 pt-2 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  )}
                </li>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
