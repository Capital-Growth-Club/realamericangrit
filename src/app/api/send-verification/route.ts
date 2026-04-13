import { NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials not set");
  return twilio(sid, token);
}

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
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
      .verifications.create({ to: email, channel: "email" });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Twilio send error:", err);
    return NextResponse.json(
      { error: "Failed to send verification email. Please try again." },
      { status: 500 },
    );
  }
}
