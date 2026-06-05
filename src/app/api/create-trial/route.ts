import { NextResponse } from "next/server";
import { provisionLightspeedVT } from "@/lib/lsvt";

export const dynamic = "force-dynamic";

// Internal trial signup webhook — fires the "Trial Offer" workflow in GHL,
// which handles tagging + sending the credentials email. No tags applied
// here; GHL workflow owns all tagging on its end.
const GHL_TRIAL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/2C8bijA6gAI6gwVPmRG0";

export async function POST(request: Request) {
  let body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const company = body.company?.trim() ?? "";

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "First name, last name, and email are required." },
      { status: 400 },
    );
  }

  const result = await provisionLightspeedVT({
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
    company_name: company,
    product_tier: "standard",
  });

  if (!result) {
    return NextResponse.json(
      {
        error:
          "Failed to provision Lightspeed VT account. Check Vercel logs for details.",
      },
      { status: 500 },
    );
  }

  try {
    await fetch(GHL_TRIAL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company_name: company,
        source: "Real American Grit - Trial Offer",
        event_type: "trial_signup",
      }),
    });
  } catch (err) {
    // LSVT account already exists — log but don't fail the request. Rep
    // can manually re-trigger the GHL workflow if the credentials email
    // never went out.
    console.error("[trial] GHL webhook forward failed:", err);
  }

  return NextResponse.json({
    ok: true,
    locationId: result.locationId,
    userId: result.userId,
    email,
  });
}
