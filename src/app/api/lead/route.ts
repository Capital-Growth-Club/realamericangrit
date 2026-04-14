import { NextResponse } from "next/server";

// Leads (contact info submitted, no payment yet) go to the lead webhook
const GHL_LEAD_WEBHOOK_URL =
  process.env.GHL_LEAD_WEBHOOK_URL ?? process.env.GHL_WEBHOOK_URL ?? "";

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

  // Forward lead to Go High Level via webhook
  if (GHL_LEAD_WEBHOOK_URL) {
    try {
      await fetch(GHL_LEAD_WEBHOOK_URL, {
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
      console.error("GHL lead webhook failed:", err);
      // Don't block the user — still redirect to Stripe
    }
  }

  return NextResponse.json({ success: true });
}
