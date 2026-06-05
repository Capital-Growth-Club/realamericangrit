"use client";

import { useEffect, useRef } from "react";

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
