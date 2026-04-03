import { NextResponse } from "next/server";
import Stripe from "stripe";

const PRICE_CENTS = 99700; // $997.00

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export const dynamic = "force-dynamic";

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

  const stripe = getStripe();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRICE_CENTS,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        company: company || "",
        source: "Real American Grit - Landing Page",
      },
      receipt_email: email,
      description: "Real American Grit — Scaling System Course",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again." },
      { status: 500 },
    );
  }
}
