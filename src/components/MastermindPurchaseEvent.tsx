"use client";

import { useEffect, useRef } from "react";

type Props = { value: number };

export default function MastermindPurchaseEvent({ value }: Props) {
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
      content_name: "2-Day Business & Sales Mastermind with Tom Howard",
      content_category: "event",
      content_ids: ["mastermind-nov-2026"],
      content_type: "product",
    });
  }, [value]);

  return null;
}
