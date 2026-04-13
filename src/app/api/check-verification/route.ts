import { NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

const GHL_PREREGISTER_WEBHOOK =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/c4856a87-04d0-45e5-ad65-d53489f60d97";

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials not set");
  return twilio(sid, token);
}

export async function POST(request: Request) {
  const { email, code, name, phone, company } = (await request.json()) as {
    email?: string;
    code?: string;
    name?: string;
    phone?: string;
    company?: string;
  };

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and verification code are required." },
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
      .verificationChecks.create({ to: email, code });

    if (check.status !== "approved") {
      return NextResponse.json(
        { error: "Invalid or expired code. Please try again." },
        { status: 400 },
      );
    }

    // Forward verified lead to GHL
    try {
      await fetch(GHL_PREREGISTER_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: name ? name.split(" ")[0] : "",
            last_name: name ? name.split(" ").slice(1).join(" ") : "",
            email,
            phone: phone || "",
            company_name: company || "",
            source: "Real American Grit - Pre-Register",
            tags: ["rag-pre-register", "email-verified"],
          }),
        });
    } catch (err) {
      console.error("GHL webhook failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Twilio verify error:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
