import { LayoutGrid, MessageCircle, Truck, type LucideIcon } from "lucide-react";
import { BentoCard } from "@/components/customer/BentoCard";
import { FadeIn } from "@/components/customer/FadeIn";
import { processSteps } from "@/lib/site/brand";
import { SectionHeading } from "./SectionHeading";

const processIcons = {
  "layout-grid": LayoutGrid,
  "message-circle": MessageCircle,
  truck: Truck,
} satisfies Record<(typeof processSteps)[number]["icon"], LucideIcon>;

export function ProcessSection() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps from browse to delivery"
            description="No online checkout—just a clear WhatsApp path our customers trust."
          />
        </FadeIn>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {processSteps.map((step, index) => {
            const Icon = processIcons[step.icon];
            return (
              <FadeIn key={step.step} delay={index * 0.08}>
                <BentoCard className="flex h-full flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="h-9 w-9" strokeWidth={1.5} aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </BentoCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
