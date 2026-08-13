import { NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

// Sends the SMS verification code for the Sept 3 webinar. Nothing is forwarded
// to GHL here — only phone-VERIFIED registrations reach GHL, via
// /api/register-webinar. Unverified submissions never create a contact.

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
  const body = (await request.json()) as { phone?: string };

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

  return NextResponse.json({ success: true, phone: formatted });
}
