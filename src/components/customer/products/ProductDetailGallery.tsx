"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/types/product";

type ProductDetailGalleryProps = {
  images: ProductImage[];
  alt: string;
};

export function ProductDetailGallery({ images, alt }: ProductDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [mainRef, mainApi] = useEmblaCarousel({
    loop: images.length > 1,
    duration: 20,
  });

  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "start",
  });

  const total = images.length;

  const onMainSelect = useCallback(() => {
    if (!mainApi) return;
    const index = mainApi.selectedScrollSnap();
    setActiveIndex(index);
    thumbApi?.scrollTo(index);
  }, [mainApi, thumbApi]);

  const scrollMain = useCallback(
    (direction: "prev" | "next") => {
      if (!mainApi) return;
      if (direction === "prev") mainApi.scrollPrev();
      else mainApi.scrollNext();
    },
    [mainApi],
  );

  const selectThumb = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi],
  );

  useEffect(() => {
    if (!mainApi) return;
    onMainSelect();
    mainApi.on("select", onMainSelect);
    mainApi.on("reInit", onMainSelect);
    return () => {
      mainApi.off("select", onMainSelect);
      mainApi.off("reInit", onMainSelect);
    };
  }, [mainApi, onMainSelect]);

  useEffect(() => {
    if (!mainApi || !thumbApi) return;
    mainApi.reInit();
    thumbApi.reInit();
  }, [images.length, mainApi, thumbApi]);

  useEffect(() => {
    if (total <= 1) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") scrollMain("prev");
      if (e.key === "ArrowRight") scrollMain("next");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scrollMain, total]);

  if (total === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
        <p className="text-sm text-slate-500">No product images</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/80">
        <div ref={mainRef} className="overflow-hidden">
          <div className="flex">
            {images.map((img, index) => (
              <div
                key={`${img.cloudinaryPublicId}-${index}`}
                className="relative min-w-0 flex-[0_0_100%] aspect-[4/3]"
              >
                <Image
                  src={img.imageUrl}
                  alt={`${alt} — image ${index + 1} of ${total}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>

        {total > 1 && (
          <>
            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {activeIndex + 1} / {total}
            </div>

            <button
              type="button"
              onClick={() => scrollMain("prev")}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollMain("next")}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-md transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="relative">
          <div ref={thumbRef} className="overflow-hidden" role="tablist" aria-label="Product images">
            <div className="flex gap-2">
              {images.map((img, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`thumb-${img.cloudinaryPublicId}-${index}`}
                    type="button"
                    role="tab"
                    onClick={() => selectThumb(index)}
                    aria-label={`View image ${index + 1} of ${total}`}
                    aria-selected={isActive}
                    className={`relative min-w-0 flex-[0_0_22%] shrink-0 overflow-hidden rounded-lg transition sm:flex-[0_0_18%] md:flex-[0_0_15%] ${
                      isActive
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-white opacity-100"
                        : "opacity-70 ring-1 ring-slate-200 hover:opacity-100 hover:ring-slate-300"
                    }`}
                  >
                    <span className="relative block aspect-[4/3] w-full bg-slate-100">
                      <Image
                        src={img.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
