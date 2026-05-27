"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/site/brand";

const INTERVAL_MS = 5500;
const FADE_MS = 1000;

type HeroImageSlideshowProps = {
  slides: HeroSlide[];
};

export function HeroImageSlideshow({ slides }: HeroImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion, slides.length]);

  return (
    <>
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className={`h-full w-full object-cover object-center transition-opacity ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            sizes="100vw"
            quality={90}
            aria-hidden={!isActive}
          />
        );
      })}
    </>
  );
}
