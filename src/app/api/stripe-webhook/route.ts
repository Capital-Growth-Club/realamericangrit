import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL ?? "";

type GhlPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  source: string;
  tags: string[];
  event_type: string;
  stripe_customer_id: string;
  stripe_subscription_id?: string;
  amount_cents?: number;
  currency?: string;
  next_billing_date?: string;
};

async function forwardToGhl(payload: GhlPayload) {
  if (!GHL_WEBHOOK_URL) return;
  try {
    await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("GHL webhook forward failed:", err);
  }
}

function splitName(full: string | null | undefined) {
  if (!full) return { first_name: "", last_name: "" };
  const parts = full.trim().split(" ");
  return {
    first_name: parts[0] ?? "",
    last_name: parts.slice(1).join(" "),
  };
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("Invalid Stripe signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── First payment of a new subscription OR monthly renewal ──
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? "";
        const customer = customerId
          ? ((await stripe.customers.retrieve(customerId)) as Stripe.Customer)
          : null;
        const isFirstPayment = invoice.billing_reason === "subscription_create";
        const rawSub = invoice.parent?.subscription_details?.subscription;
        const subscriptionId =
          typeof rawSub === "string" ? rawSub : rawSub?.id;

        console.log(
          `[stripe] invoice.payment_succeeded: ${invoice.id} customer=${customerId} first=${isFirstPayment}`,
        );

        if (customer) {
          const { first_name, last_name } = splitName(customer.name);
          await forwardToGhl({
            first_name,
            last_name,
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            company_name: customer.metadata?.company ?? "",
            source: "Real American Grit - Stripe",
            tags: isFirstPayment
              ? ["rag-scaling-system", "active-subscriber", "new-enrollment"]
              : ["rag-scaling-system", "active-subscriber", "renewal-payment"],
            event_type: isFirstPayment
              ? "subscription_started"
              : "subscription_renewed",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            amount_cents: invoice.amount_paid,
            currency: invoice.currency,
          });
        }
        break;
      }

      // ── Failed recurring payment (dunning) ──
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? "";
        const customer = customerId
          ? ((await stripe.customers.retrieve(customerId)) as Stripe.Customer)
          : null;
        const rawSub = invoice.parent?.subscription_details?.subscription;
        const subscriptionId =
          typeof rawSub === "string" ? rawSub : rawSub?.id;

        console.log(
          `[stripe] invoice.payment_failed: ${invoice.id} customer=${customerId}`,
        );

        if (customer) {
          const { first_name, last_name } = splitName(customer.name);
          await forwardToGhl({
            first_name,
            last_name,
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            company_name: customer.metadata?.company ?? "",
            source: "Real American Grit - Stripe",
            tags: ["rag-scaling-system", "payment-failed"],
            event_type: "payment_failed",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            amount_cents: invoice.amount_due,
            currency: invoice.currency,
          });
        }
        break;
      }

      // ── Subscription canceled ──
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const customer = (await stripe.customers.retrieve(
          customerId,
        )) as Stripe.Customer;

        console.log(
          `[stripe] customer.subscription.deleted: ${subscription.id} customer=${customerId}`,
        );

        const { first_name, last_name } = splitName(customer.name);
        await forwardToGhl({
          first_name,
          last_name,
          email: customer.email ?? "",
          phone: customer.phone ?? "",
          company_name: customer.metadata?.company ?? "",
          source: "Real American Grit - Stripe",
          tags: ["rag-scaling-system", "canceled-subscriber"],
          event_type: "subscription_canceled",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
        });
        break;
      }

      // ── Subscription updated (status changes, plan changes, etc.) ──
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          `[stripe] customer.subscription.updated: ${subscription.id} status=${subscription.status}`,
        );
        // No GHL forward here by default — covers paused, past_due, etc.
        // Customize if you want to tag "past_due" specifically.
        break;
      }

      default:
        console.log(`[stripe] unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
