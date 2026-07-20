/**
 * Fire-and-forget analytics event helper.
 * Sends the event to Google Analytics 4 (gtag) and Meta Pixel (fbq) if either
 * is loaded. Safe to call from server-side code — becomes a no-op.
 *
 * Auto-attaches the `ab_variant` cookie value (if set by middleware) to every
 * event so metrics can be sliced by A/B split in GA4. Inert if no cookie
 * exists, so it's safe to leave enabled even without an A/B setup.
 */
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      target: string,
      params?: Record<string, unknown>,
    ) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function getAbVariant(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)ab_variant=([a-z0-9_-]+)/i);
  return match ? match[1] : "";
}

export function track(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;

  const variant = getAbVariant();
  const enriched = variant ? { ...params, ab_variant: variant } : params;

  if (typeof window.gtag === "function") {
    window.gtag("event", name, enriched);
  }

  // Meta Pixel — trackCustom so it doesn't collide with Meta's reserved
  // standard events (Lead, Purchase, Schedule, PageView, etc.).
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", name, enriched);
  }
}
