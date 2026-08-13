"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Fires the webinar-registration conversions on /slowseasonwebinar/thanks —
// i.e. only after a real, phone-verified registration lands on the thank-you
// page (never on the opt-in page itself), keeping reporting clean:
//   1. FB Pixel CompleteRegistration — standard event, the Facebook ads
//      optimization target for the webinar campaign.
//   2. GA4 webinar_registered — custom event via track() so the funnel is
//      measurable in BigQuery.
export default function WebinarRegisteredEvent() {
  // Guard against duplicate fires (React StrictMode double-mount in dev, any
  // unintended re-render).
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined") return;
    fired.current = true;

    const eventData = {
      content_name: "Real American Grit — Slow Season Webinar",
      content_category: "webinar",
    };

    if (window.fbq) {
      window.fbq("track", "CompleteRegistration", eventData);
    }

    track("webinar_registered", eventData);
  }, []);

  return null;
}
