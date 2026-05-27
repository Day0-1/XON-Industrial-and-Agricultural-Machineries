import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/customer/FadeIn";
import { SectionHeading } from "./SectionHeading";

export type FeaturedCategoryLink = {
  name: string;
  href: string;
  image: string;
};

type FeaturedProductsSectionProps = {
  categories: FeaturedCategoryLink[];
};

export function FeaturedProductsSection({
  categories,
}: FeaturedProductsSectionProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn>
          <SectionHeading
            eyebrow="Featured"
            title="Pick the equipment that matches your needs"
            description="Top equipment from our catalog—inquire on WhatsApp for pricing and availability."
          />
        </FadeIn>

        <ul className="mx-auto mt-14 grid w-full max-w-xs grid-cols-2 place-items-center gap-x-10 gap-y-10 sm:max-w-2xl sm:grid-cols-3 sm:gap-x-12 sm:gap-y-12 lg:max-w-none lg:grid-cols-5 lg:gap-x-4 lg:gap-y-0 xl:gap-x-8">
          {categories.map((category, index) => (
            <FadeIn
              key={category.href}
              delay={index * 0.06}
              className={
                index === categories.length - 1 && categories.length % 2 === 1
                  ? "col-span-2 sm:col-span-1"
                  : "w-full"
              }
            >
              <li className="flex list-none justify-center">
                <Link
                  href={category.href}
                  className="group flex flex-col items-center"
                >
                  <div className="relative size-28 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200 transition-all duration-300 group-hover:ring-brand group-hover:shadow-[0_12px_32px_-12px_rgba(12,45,87,0.35)] sm:size-32 lg:size-36 xl:size-40">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 160px"
                    />
                  </div>
                  <p className="mt-3 max-w-[9rem] text-center text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-brand lg:mt-4 lg:text-base">
                    {category.name}
                  </p>
                </Link>
              </li>
            </FadeIn>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-light hover:shadow-xl"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
}
