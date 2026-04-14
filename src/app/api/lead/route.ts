import { NextResponse } from "next/server";

// Sign-up webhook: fires when someone submits the checkout contact form (pre-payment lead)
const GHL_SIGNUP_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/cab88f76-e7b3-4512-bfbb-de4d627ebcd0";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    name,
    email,
    phone,
    company,
    cid,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } = body as {
    name: string;
    email: string;
    phone: string;
    company?: string;
    cid?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 },
    );
  }

  // Forward sign-up to Go High Level via webhook
  try {
    await fetch(GHL_SIGNUP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact_id: cid || "",
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" ") || "",
        email,
        phone,
        company_name: company || "",
        source: "Real American Grit - Landing Page",
        event_type: "lead_captured",
        tags: ["rag-scaling-system", "landing-page-lead", "checkout-started"],
        utm_source: utm_source || "",
        utm_medium: utm_medium || "",
        utm_campaign: utm_campaign || "",
        utm_content: utm_content || "",
        utm_term: utm_term || "",
      }),
    });
  } catch (err) {
    console.error("GHL signup webhook failed:", err);
    // Don't block the user — still redirect to Stripe
  }

  return NextResponse.json({ success: true });
}
