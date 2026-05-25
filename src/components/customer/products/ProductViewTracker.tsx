"use client";

import { useEffect, useRef } from "react";

type ProductViewTrackerProps = {
  slug: string;
};

export function ProductViewTracker({ slug }: ProductViewTrackerProps) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !slug) return;
    sent.current = true;

    fetch(`/api/products/${encodeURIComponent(slug)}/click`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Non-blocking analytics
    });
  }, [slug]);

  return null;
}
