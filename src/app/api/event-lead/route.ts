import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fires the moment someone submits the mastermind contact form (pre-payment lead) —
// set this up as a GHL inbound webhook trigger, then paste the URL into .env.local.
const GHL_EVENT_LEAD_WEBHOOK = process.env.GHL_EVENT_LEAD_WEBHOOK_URL ?? "";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    trade?: string;
    guest?: boolean;
    cid?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };

  if (!body.name || !body.email || !body.phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 },
    );
  }

  if (!GHL_EVENT_LEAD_WEBHOOK) {
    console.warn(
      "[mastermind] GHL_EVENT_LEAD_WEBHOOK_URL not set — skipping forward.",
    );
    return NextResponse.json({ success: true, forwarded: false });
  }

  try {
    await fetch(GHL_EVENT_LEAD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact_id: body.cid || "",
        first_name: body.name.split(" ")[0],
        last_name: body.name.split(" ").slice(1).join(" ") || "",
        email: body.email,
        phone: body.phone,
        company_name: body.company || "",
        trade: body.trade || "",
        guest: body.guest ? "true" : "false",
        seats: body.guest ? 2 : 1,
        source: "Real American Grit - Mastermind Landing Page",
        event_type: "lead_captured",
        tags: body.guest
          ? ["mastermind-nov-2026", "mastermind-checkout-started", "mastermind-plus-guest"]
          : ["mastermind-nov-2026", "mastermind-checkout-started"],
        product_name: "2-Day Business & Sales Mastermind with Tom Howard",
        amount_dollars: body.guest ? 9000 : 4500,
        amount_cents: body.guest ? 900000 : 450000,
        currency: "usd",
        utm_source: body.utm_source || "",
        utm_medium: body.utm_medium || "",
        utm_campaign: body.utm_campaign || "",
        utm_content: body.utm_content || "",
        utm_term: body.utm_term || "",
      }),
    });
  } catch (err) {
    console.error("[mastermind] GHL lead webhook failed:", err);
  }

  return NextResponse.json({ success: true, forwarded: true });
}
