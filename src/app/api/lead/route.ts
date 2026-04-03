import { NextResponse } from "next/server";

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL ?? "";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, phone, company } = body as {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 },
    );
  }

  // Forward lead to Go High Level via webhook
  if (GHL_WEBHOOK_URL) {
    try {
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: name.split(" ")[0],
          last_name: name.split(" ").slice(1).join(" ") || "",
          email,
          phone,
          company_name: company || "",
          source: "Real American Grit - Landing Page",
          tags: ["rag-scaling-system", "landing-page-lead"],
        }),
      });
    } catch (err) {
      console.error("GHL webhook failed:", err);
      // Don't block the user — still redirect to Stripe
    }
  }

  return NextResponse.json({ success: true });
}
