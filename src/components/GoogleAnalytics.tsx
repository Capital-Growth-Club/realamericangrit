"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MEASUREMENT_ID = "G-0F497X7QDK";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      target: string,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

function getAbVariant(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)ab_variant=([a-z0-9_-]+)/i);
  return match ? match[1] : "";
}

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Fire page_view manually on every route change (including the initial
  // render). The inline init script below sets send_page_view=false so
  // gtag doesn't auto-fire it — that way every page_view goes through
  // this effect and picks up ab_variant + any other params we want to
  // attach consistently.
  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    const variant = getAbVariant();
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      ...(variant ? { ab_variant: variant } : {}),
    });
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${MEASUREMENT_ID}', { send_page_view: false });`}
      </Script>
    </>
  );
}
