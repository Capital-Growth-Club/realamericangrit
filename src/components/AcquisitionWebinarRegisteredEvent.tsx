"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

// Fires the registration conversions on /acquisitionwebinar/thanks — only after
// a phone-verified registration lands here. Fires the FB "Lead" event (not
// CompleteRegistration like the Slow Season webinar); content_name keeps the
// webinars separable in FB and GA4.
export default function AcquisitionWebinarRegisteredEvent() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined") return;
    fired.current = true;

    const eventData = {
      content_name: "Real American Grit — Acquisition Webinar",
      content_category: "webinar",
    };

    if (window.fbq) {
      window.fbq("track", "Lead", eventData);
    }

    track("webinar_registered", eventData);
  }, []);

  return null;
}
