"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Fires two conversion events on /demobooked:
//   1. FB Pixel Schedule — reserved standard event, our Facebook ads
//      optimization target. Fires via fbq('track', 'Schedule').
//   2. GA4 demo_booked — custom event via track() so it's auto-tagged
//      with ab_variant. Lets us measure the /demo → /demobooked funnel
//      split by A/B in BigQuery.
export default function ScheduleEvent() {
  // Guard against duplicate fires from React StrictMode double-mount in dev
  // and from any unintended re-renders.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined") return;
    fired.current = true;

    const eventData = {
      content_name: "Real American Grit — Demo Booking",
      content_category: "demo",
    };

    if (window.fbq) {
      window.fbq("track", "Schedule", eventData);
    }

    // GA4 + Meta Pixel custom event, auto-enriched with ab_variant.
    track("demo_booked", eventData);
  }, []);

  return null;
}
