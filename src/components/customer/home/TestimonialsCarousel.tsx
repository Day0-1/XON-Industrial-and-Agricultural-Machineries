"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BentoCard } from "@/components/customer/BentoCard";
import type { Testimonial } from "@/lib/site/testimonials";

function useCardsPerPage() {
  const [cardsPerPage, setCardsPerPage] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setCardsPerPage(3);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cardsPerPage;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating
              ? "fill-brand text-brand"
              : "fill-slate-200 text-slate-200"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <BentoCard
      as="article"
      className="flex h-full flex-col text-left shadow-[0_12px_48px_-16px_rgba(15,23,42,0.12)]"
    >
      <StarRating rating={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <footer className="mt-6 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
        <p className="mt-0.5 text-xs text-slate-500">{testimonial.role}</p>
      </footer>
    </BentoCard>
  );
}

type TestimonialsCarouselProps = {
  items: Testimonial[];
};

export function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
  const cardsPerPage = useCardsPerPage();
  const pageCount = Math.max(1, Math.ceil(items.length / cardsPerPage));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const goTo = useCallback(
    (next: number) => {
      setPage((current) => {
        if (next < 0) return pageCount - 1;
        if (next >= pageCount) return 0;
        return next;
      });
    },
    [pageCount],
  );

  const visible = items.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage,
  );

  return (
    <div className="mt-12">
      <div
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {visible.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      <div className="mt-10 space-y-8">
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand text-brand transition-colors hover:bg-brand/5"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-light"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div
          className="flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Testimonial pages"
        >
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === page}
              aria-label={`Go to testimonial page ${index + 1}`}
              onClick={() => setPage(index)}
              className={`h-1 rounded-full transition-all ${
                index === page
                  ? "w-10 bg-brand"
                  : "w-6 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
