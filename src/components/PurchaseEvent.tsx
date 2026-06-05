"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: number;
  tier: "standard" | "white-label";
};

const CONTENT_NAME: Record<Props["tier"], string> = {
  standard: "Standard - The Full Library",
  "white-label": "White-Label - Make It Yours",
};

export default function PurchaseEvent({ value, tier }: Props) {
  // Guard against duplicate fires from React's StrictMode double-mount in dev
  // and from any unintended re-renders.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined" || !window.fbq) return;
    fired.current = true;
    window.fbq("track", "Purchase", {
      value,
      currency: "USD",
      content_name: CONTENT_NAME[tier],
      content_category: "subscription",
      content_ids: [`${tier}-monthly`],
      content_type: "product",
    });
  }, [value, tier]);

  return null;
}
