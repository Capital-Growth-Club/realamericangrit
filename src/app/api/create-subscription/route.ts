import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name,
    email,
    phone,
    company,
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
    cid?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 },
    );
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Subscription price not configured." },
      { status: 500 },
    );
  }

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
          source: "Real American Grit - Landing Page",
          ghl_contact_id: cid || "",
          utm_source: utm_source || "",
          utm_medium: utm_medium || "",
          utm_campaign: utm_campaign || "",
          utm_content: utm_content || "",
          utm_term: utm_term || "",
        },
      }));

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        company: company || "",
        source: "Real American Grit - Landing Page",
        ghl_contact_id: cid || "",
        utm_source: utm_source || "",
        utm_medium: utm_medium || "",
        utm_campaign: utm_campaign || "",
        utm_content: utm_content || "",
        utm_term: utm_term || "",
      },
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;
    const paymentIntent =
      latestInvoice &&
      (latestInvoice as Stripe.Invoice & { payment_intent?: Stripe.PaymentIntent })
        .payment_intent;

    if (!paymentIntent || typeof paymentIntent === "string") {
      return NextResponse.json(
        { error: "Could not initialize payment. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      customerId: customer.id,
    });
  } catch (err) {
    console.error("Stripe subscription error:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again." },
      { status: 500 },
    );
  }
}
