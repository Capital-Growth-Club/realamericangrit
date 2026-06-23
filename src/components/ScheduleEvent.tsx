"use client";

import { useEffect, useRef } from "react";

// Fires the FB Pixel Schedule event on /demobooked. This is the conversion
// event we optimize Facebook ads against — fires only after a successful
// appointment booking. Lead fires earlier (on form submission) but is not
// the optimization target.
export default function ScheduleEvent() {
  // Guard against duplicate fires from React StrictMode double-mount in dev
  // and from any unintended re-renders.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (typeof window === "undefined" || !window.fbq) return;
    fired.current = true;
    window.fbq("track", "Schedule", {
      content_name: "Real American Grit — Demo Booking",
      content_category: "demo",
    });
  }, []);

  return null;
}
