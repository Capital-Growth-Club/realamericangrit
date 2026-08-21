"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Fires conversion events when a private 1-on-1 coaching call is booked:
//   1. FB Pixel Purchase — reserved standard event for ad optimization,
//      valued at the $500 call price so Meta can optimize for ROAS.
//   2. GA4 coaching_booked — custom event via track(), auto-tagged with
//      ab_variant for funnel analysis in BigQuery.
export default function CoachingScheduleEvent() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined") return;
    fired.current = true;

    const eventData = {
      content_name: "Real American Grit — Private Coaching Call",
      content_category: "coaching",
      value: 500,
      currency: "USD",
    };

    if (window.fbq) {
      window.fbq("track", "Purchase", eventData);
    }

    track("coaching_booked", eventData);
  }, []);

  return null;
}
