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
  const { phone, code } = (await request.json()) as {
    phone?: string;
    code?: string;
  };

  if (!phone || !code) {
    return NextResponse.json(
      { error: "Phone and verification code are required." },
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
    const check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code });

    if (check.status !== "approved") {
      return NextResponse.json(
        { error: "Invalid or expired code. Try again." },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Twilio SMS check error:", err);
    return NextResponse.json(
      { error: "Verification failed. Try again." },
      { status: 500 },
    );
  }
}
