import { NextRequest, NextResponse } from "next/server";

/**
 * A/B split for /demo.
 *
 * Change VARIANT_B_PERCENT to control the split:
 *   0    — split off. Everyone sees the control (/demo). No cookie. Default.
 *   50   — 50/50 split between A and B.
 *   20   — 80/20 split (soft rollout of B).
 *   100  — force everyone onto variant B (useful for previewing B in prod).
 *
 * When a real split is running (0 < percent < 100), a visitor's assignment
 * is stored in a cookie for 1 year so returning visitors always see the
 * same variant. The browser URL always stays `/demo` for both variants —
 * variant B is delivered via an edge rewrite to `/demo/b`.
 *
 * Every tracked event auto-attaches `ab_variant` (set below) as an event
 * param in GA4 + Meta Pixel via src/lib/analytics.ts, so BigQuery can slice
 * every metric by A vs B.
 */

const VARIANT_B_PERCENT = 50;

const COOKIE_NAME = "ab_variant";
const VARIANTS = ["a", "b"] as const;
type Variant = (typeof VARIANTS)[number];

function isVariant(v: unknown): v is Variant {
  return typeof v === "string" && (VARIANTS as readonly string[]).includes(v);
}

export function proxy(request: NextRequest) {
  // Only act on the /demo entry point — not /demo/b (direct hit) or any
  // future /demo/* subroutes.
  if (request.nextUrl.pathname !== "/demo") {
    return NextResponse.next();
  }

  // Kill switch — split disabled, everyone sees the control.
  if (VARIANT_B_PERCENT <= 0) {
    return NextResponse.next();
  }

  // Force everyone to B (preview B in prod without a code deploy).
  if (VARIANT_B_PERCENT >= 100) {
    return NextResponse.rewrite(new URL("/demo/b", request.url));
  }

  // Normal split — read cookie for stickiness, else roll a fresh assignment.
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  const variant: Variant = isVariant(existing)
    ? existing
    : Math.random() * 100 < VARIANT_B_PERCENT
      ? "b"
      : "a";

  // For variant B, rewrite to /demo/b — URL bar stays /demo.
  const response =
    variant === "b"
      ? NextResponse.rewrite(new URL("/demo/b", request.url))
      : NextResponse.next();

  // Persist the assignment for 1 year so return visits stay on the same variant.
  response.cookies.set(COOKIE_NAME, variant, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

// Only run this on /demo — cheap on every other route.
export const config = {
  matcher: "/demo",
};
