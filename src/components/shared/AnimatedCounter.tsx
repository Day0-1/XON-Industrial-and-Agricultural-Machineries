"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
  className = "",
  format,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(format ? format(0) : "0");

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [isInView, motionValue, value, duration]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplay(format ? format(latest) : String(latest));
    });
    return unsubscribe;
  }, [rounded, format]);

  return (
    <motion.span
      ref={ref}
      className={`tabular-nums ${className}`}
      initial={{ opacity: 0.6 }}
      animate={isInView ? { opacity: 1 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}
