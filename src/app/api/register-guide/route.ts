import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Posted AFTER the phone is verified. Forwards the confirmed lead to GHL so it
// can tag the contact and email them the pricing guide.
const GHL_GUIDE_WEBHOOK =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/c0bda174-cb20-48c0-8958-59f448530452";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    fbclid?: string;
    gclid?: string;
  };

  if (!GHL_GUIDE_WEBHOOK) {
    console.warn("[guide] GHL_GUIDE_WEBHOOK not set — skipping forward.");
    return NextResponse.json({ success: true, forwarded: false });
  }

  try {
    await fetch(GHL_GUIDE_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: body.firstName?.trim() ?? "",
        last_name: body.lastName?.trim() ?? "",
        email: body.email?.trim() ?? "",
        phone: body.phone?.trim() ?? "",
        phone_verified: true,
        tags: ["pricing-guide", "what-to-charge-guide"],
        source: "Real American Grit - Pricing Guide",
        event_type: "pricing_guide_download",
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
    console.error("[guide] GHL register-forward failed:", err);
    return NextResponse.json({ success: true, forwarded: false });
  }

  return NextResponse.json({ success: true, forwarded: true });
}
