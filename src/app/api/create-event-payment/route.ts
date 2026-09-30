import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

// Fixed one-time prices for the Nov 2-3, 2026 Business & Sales Mastermind.
// Single product, two seat counts — no tiers, so this is hardcoded rather
// than pulled from a Stripe Price env var (same reasoning the front-end
// TIER_PRICE constants already use for the subscription tiers). The amount
// is always computed here from `guest`, never trusted from the client.
const SOLO_PRICE_CENTS = 450000;
const GUEST_PRICE_CENTS = 900000;

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name,
    email,
    phone,
    company,
    trade,
    guest,
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
    trade?: string;
    guest?: boolean;
    cid?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };

  if (!name || !email || !phone || !company || !trade) {
    return NextResponse.json(
      { error: "Name, email, phone, company, and trade are required." },
      { status: 400 },
    );
  }

  const amount = guest ? GUEST_PRICE_CENTS : SOLO_PRICE_CENTS;

  const stripe = getStripe();

  try {
    // Reuse existing customer if one exists for this email, otherwise create a new one
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer =
      existing.data[0] ??
      (await stripe.customers.create({
        email,
        name,
        phone,
        metadata: {
          company: company || "",
          trade: trade || "",
          source: "Real American Grit - Mastermind Landing Page",
          ghl_contact_id: cid || "",
        },
      }));

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata: {
        product: "mastermind-nov-2026",
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        company: company || "",
        trade: trade || "",
        guest: guest ? "true" : "false",
        seats: guest ? "2" : "1",
        source: "Real American Grit - Mastermind Landing Page",
        ghl_contact_id: cid || "",
        utm_source: utm_source || "",
        utm_medium: utm_medium || "",
        utm_campaign: utm_campaign || "",
        utm_content: utm_content || "",
        utm_term: utm_term || "",
      },
    });

    if (!paymentIntent.client_secret) {
      console.error("No client_secret on PaymentIntent:", paymentIntent.id);
      return NextResponse.json(
        { error: "Could not initialize payment. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err) {
    console.error("Stripe event payment error:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again." },
      { status: 500 },
    );
  }
}
