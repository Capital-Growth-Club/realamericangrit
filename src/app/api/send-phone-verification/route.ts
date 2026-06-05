import { NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

// GHL workflow that captures every demo-booking form submission. Fires
// alongside the SMS send so we keep "demo intent" leads even when the user
// bails before verifying. Note: the firstName/lastName/email/company come
// from the modal but they're NOT verified here — only the phone is. The GHL
// workflow can branch on whether the calendar booking eventually fires
// (signaled by the booking redirect to /demobooked).
const GHL_DEMO_LEAD_WEBHOOK =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/2570196f-593a-4469-88eb-649a4c5bd798";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials not set");
  return twilio(sid, token);
}

function formatToE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
  };

  const phone = body.phone?.trim() ?? "";
  if (!phone) {
    return NextResponse.json(
      { error: "Phone number is required." },
      { status: 400 },
    );
  }

  const formatted = formatToE164(phone);
  if (!formatted) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit US phone number." },
      { status: 400 },
    );
  }

  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!serviceSid) {
    return NextResponse.json(
      { error: "Verification service not configured." },
      { status: 500 },
    );
  }

  try {
    const client = getClient();
    await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: formatted, channel: "sms" });
  } catch (err) {
    console.error("Twilio SMS send error:", err);
    return NextResponse.json(
      { error: "Failed to send code. Check the number and try again." },
      { status: 500 },
    );
  }

  // Forward the lead to GHL. Fire-and-forget — if this fails we still want
  // the user to see the verification screen (we already sent the SMS).
  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  if (firstName || lastName || email || company) {
    fetch(GHL_DEMO_LEAD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: formatted,
        company_name: company,
        source: "Real American Grit - Demo Booking",
        event_type: "demo_form_submitted",
      }),
    }).catch((err) => {
      console.error("[demo] GHL webhook forward failed:", err);
    });
  }

  return NextResponse.json({ success: true, phone: formatted });
}
