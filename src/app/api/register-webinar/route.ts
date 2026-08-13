import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Posted AFTER the phone is verified (front-end calls this once
// /api/check-phone-verification approves the code). This is the CONFIRMED
// registration — the event GHL should key off to send the calendar invite
// and the pre-event bonus emails.
const GHL_WEBINAR_WEBHOOK =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/841971c4-c78e-4f38-9cd4-fc6f39392348";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    trade?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    fbclid?: string;
    gclid?: string;
  };

  if (!GHL_WEBINAR_WEBHOOK) {
    // No webhook wired yet — succeed so the user still reaches the thank-you
    // page. Registration is captured client-side; wire GHL_WEBINAR_WEBHOOK to
    // enable the calendar invite + email sequence.
    console.warn("[webinar] GHL_WEBINAR_WEBHOOK not set — skipping forward.");
    return NextResponse.json({ success: true, forwarded: false });
  }

  try {
    await fetch(GHL_WEBINAR_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: body.firstName?.trim() ?? "",
        last_name: body.lastName?.trim() ?? "",
        email: body.email?.trim() ?? "",
        phone: body.phone?.trim() ?? "",
        trade: body.trade?.trim() ?? "",
        phone_verified: true,
        tags: ["webinar-sept-3", "webinar-registered"],
        source: "Real American Grit - Slow Season Webinar",
        event_type: "webinar_registered",
        utm_source: body.utm_source ?? "",
        utm_medium: body.utm_medium ?? "",
        utm_campaign: body.utm_campaign ?? "",
        utm_term: body.utm_term ?? "",
        utm_content: body.utm_content ?? "",
        fbclid: body.fbclid ?? "",
        gclid: body.gclid ?? "",
      }),
    });
  } catch (err) {
    console.error("[webinar] GHL register-forward failed:", err);
    // Don't block the thank-you redirect on a webhook hiccup.
    return NextResponse.json({ success: true, forwarded: false });
  }

  return NextResponse.json({ success: true, forwarded: true });
}
