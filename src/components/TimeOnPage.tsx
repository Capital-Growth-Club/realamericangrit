"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Reliable active-time-on-page tracker.
 *
 * GA4's built-in engagement_time_msec is unreliable on landing pages — it
 * leans on a `beforeunload` flush that frequently never fires (mobile Safari,
 * fast exits), so real scrollers log 0. This measures it ourselves:
 *
 *  - Counts only FOREGROUND time (pauses via the Page Visibility API), so it's
 *    engaged time, not wall-clock.
 *  - Fires a `time_milestone` event the instant active time crosses each mark
 *    (15/30/60/120/180/300s). Because each milestone fires live, the depth is
 *    captured even if the tab is killed without an unload event — the reliable
 *    part. Time-on-page = MAX(seconds) per session in BigQuery.
 *  - Also best-effort flushes an exact `time_on_page` on pagehide/unmount.
 *
 * Every event auto-carries `ab_variant` (via track()), plus the `page` label
 * passed in, so demo vs grit is sliceable.
 */

const MILESTONES = [15, 30, 60, 120, 180, 300];

export default function TimeOnPage({ page }: { page: string }) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    let activeMs = 0;
    let lastStart = document.visibilityState === "visible" ? Date.now() : 0;
    const fired = new Set<number>();

    // Fold the current visible stretch into the running total.
    const accumulate = () => {
      if (lastStart) {
        activeMs += Date.now() - lastStart;
        lastStart = Date.now();
      }
    };

    const checkMilestones = () => {
      const secs = Math.floor(activeMs / 1000);
      for (const m of MILESTONES) {
        if (secs >= m && !fired.has(m)) {
          fired.add(m);
          track("time_milestone", { page, seconds: m, seconds_num: m });
        }
      }
    };

    const tick = setInterval(() => {
      accumulate();
      checkMilestones();
    }, 5000);

    const onVisibility = () => {
      accumulate();
      if (document.visibilityState === "hidden") {
        lastStart = 0; // stop the clock while backgrounded
        checkMilestones();
      } else {
        lastStart = Date.now(); // restart when it comes back
      }
    };

    const flush = () => {
      accumulate();
      checkMilestones();
      const secs = Math.round(activeMs / 1000);
      if (secs > 0) {
        track("time_on_page", { page, seconds: secs, seconds_num: secs });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);

    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [page]);

  return null;
}
