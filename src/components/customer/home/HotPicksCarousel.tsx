"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { HotPick } from "@/types/hot-pick";

const AUTOPLAY_MS = 5500;

type HotPicksCarouselProps = {
  picks: HotPick[];
};

function PickCard({ pick }: { pick: HotPick }) {
  const content = (
    <article className="grid overflow-hidden rounded-3xl bg-white shadow-[0_12px_48px_-16px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="relative aspect-[16/10] min-h-[200px] bg-slate-100 md:aspect-auto md:min-h-[280px]">
        <Image
          src={pick.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 55vw"
          priority={false}
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Hot pick
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {pick.title}
        </h3>
        {pick.description && (
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {pick.description}
          </p>
        )}
        {pick.linkUrl && (
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
            View details
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
    </article>
  );

  if (pick.linkUrl) {
    const isExternal = pick.linkUrl.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={pick.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity hover:opacity-95"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={pick.linkUrl} className="block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}

export function HotPicksCarousel({ picks }: HotPicksCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: picks.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!emblaApi || picks.length <= 1 || reduceMotion) return;

    const id = window.setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [emblaApi, picks.length, reduceMotion]);

  const scroll = useCallback(
    (direction: "prev" | "next") => {
      if (!emblaApi) return;
      if (direction === "prev") emblaApi.scrollPrev();
      else emblaApi.scrollNext();
    },
    [emblaApi],
  );

  if (picks.length === 0) return null;

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {picks.map((pick) => (
            <div
              key={pick._id}
              className="min-w-0 shrink-0 grow-0 basis-full pl-0"
            >
              <PickCard pick={pick} />
            </div>
          ))}
        </div>
      </div>

      {picks.length > 1 && (
        <>
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-2 sm:bottom-5 sm:right-5">
            <button
              type="button"
              onClick={() => scroll("prev")}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-800 shadow-md transition-colors hover:bg-white"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scroll("next")}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-md transition-colors hover:bg-brand-light"
              aria-label="Next banner"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div
            className="mt-6 flex justify-center gap-2"
            role="tablist"
            aria-label="Hot pick slides"
          >
            {picks.map((pick, index) => (
              <button
                key={pick._id}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Go to ${pick.title}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === selectedIndex
                    ? "w-8 bg-brand"
                    : "w-4 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
