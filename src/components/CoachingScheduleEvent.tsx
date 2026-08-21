"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Fires conversion events when a private coaching call is booked:
//   1. FB Pixel Schedule — reserved standard event for ad optimization.
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
    };

    if (window.fbq) {
      window.fbq("track", "Schedule", eventData);
    }

    track("coaching_booked", eventData);
  }, []);

  return null;
}
