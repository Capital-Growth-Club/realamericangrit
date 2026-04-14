import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

// Customers (paid / payment events) go to the customer webhook.
// Falls back to the legacy GHL_WEBHOOK_URL if the dedicated one isn't set.
const GHL_CUSTOMER_WEBHOOK_URL =
  process.env.GHL_CUSTOMER_WEBHOOK_URL ?? process.env.GHL_WEBHOOK_URL ?? "";

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
  reason?: string;
};

async function forwardToGhl(payload: GhlPayload) {
  if (!GHL_CUSTOMER_WEBHOOK_URL) return;
  try {
    await fetch(GHL_CUSTOMER_WEBHOOK_URL, {
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

async function getCustomer(
  stripe: Stripe,
  customerId: string | null,
): Promise<Stripe.Customer | null> {
  if (!customerId) return null;
  try {
    const c = await stripe.customers.retrieve(customerId);
    if ((c as Stripe.DeletedCustomer).deleted) return null;
    return c as Stripe.Customer;
  } catch (err) {
    console.error("Failed to retrieve customer:", err);
    return null;
  }
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
      // ═══ PAYMENTS ═══
      // First payment of a new subscription OR monthly renewal
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;
        const customer = await getCustomer(stripe, customerId);
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
            stripe_customer_id: customerId ?? "",
            stripe_subscription_id: subscriptionId,
            amount_cents: invoice.amount_paid,
            currency: invoice.currency,
          });
        }
        break;
      }

      // Failed recurring payment (dunning)
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;
        const customer = await getCustomer(stripe, customerId);
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
            stripe_customer_id: customerId ?? "",
            stripe_subscription_id: subscriptionId,
            amount_cents: invoice.amount_due,
            currency: invoice.currency,
          });
        }
        break;
      }

      // ═══ REFUNDS ═══
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const customerId =
          typeof charge.customer === "string"
            ? charge.customer
            : charge.customer?.id ?? null;
        const customer = await getCustomer(stripe, customerId);

        console.log(
          `[stripe] charge.refunded: ${charge.id} customer=${customerId} amount=${charge.amount_refunded}`,
        );

        if (customer) {
          const { first_name, last_name } = splitName(customer.name);
          const fullyRefunded = charge.amount_refunded === charge.amount;
          await forwardToGhl({
            first_name,
            last_name,
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            company_name: customer.metadata?.company ?? "",
            source: "Real American Grit - Stripe",
            tags: fullyRefunded
              ? ["rag-scaling-system", "refunded"]
              : ["rag-scaling-system", "partial-refund"],
            event_type: fullyRefunded ? "refund_full" : "refund_partial",
            stripe_customer_id: customerId ?? "",
            amount_cents: charge.amount_refunded,
            currency: charge.currency,
          });
        }
        break;
      }

      // ═══ DISPUTES (CHARGEBACKS) ═══
      // Customer filed a dispute — funds held, needs response in Stripe dashboard
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        const customerId =
          typeof dispute.charge === "string"
            ? (await stripe.charges.retrieve(dispute.charge)).customer
            : null;
        const custId =
          typeof customerId === "string" ? customerId : customerId?.id ?? null;
        const customer = await getCustomer(stripe, custId);

        console.log(
          `[stripe] charge.dispute.created: ${dispute.id} reason=${dispute.reason} status=${dispute.status}`,
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
            tags: ["rag-scaling-system", "disputed", `dispute-${dispute.reason}`],
            event_type: "dispute_created",
            stripe_customer_id: custId ?? "",
            amount_cents: dispute.amount,
            currency: dispute.currency,
            reason: dispute.reason,
          });
        }
        break;
      }

      // Dispute closed — won or lost
      case "charge.dispute.closed": {
        const dispute = event.data.object as Stripe.Dispute;
        const customerId =
          typeof dispute.charge === "string"
            ? (await stripe.charges.retrieve(dispute.charge)).customer
            : null;
        const custId =
          typeof customerId === "string" ? customerId : customerId?.id ?? null;
        const customer = await getCustomer(stripe, custId);
        const won = dispute.status === "won";

        console.log(
          `[stripe] charge.dispute.closed: ${dispute.id} status=${dispute.status}`,
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
            tags: won
              ? ["rag-scaling-system", "dispute-won"]
              : ["rag-scaling-system", "dispute-lost"],
            event_type: won ? "dispute_won" : "dispute_lost",
            stripe_customer_id: custId ?? "",
            amount_cents: dispute.amount,
            currency: dispute.currency,
            reason: dispute.reason,
          });
        }
        break;
      }

      // ═══ SUBSCRIPTION LIFECYCLE ═══
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const customer = await getCustomer(stripe, customerId);

        console.log(
          `[stripe] customer.subscription.deleted: ${subscription.id} customer=${customerId}`,
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
            tags: ["rag-scaling-system", "canceled-subscriber"],
            event_type: "subscription_canceled",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
          });
        }
        break;
      }

      // Status transitions — flag past_due / unpaid specifically
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const prev = event.data.previous_attributes as
          | { status?: string }
          | undefined;
        const prevStatus = prev?.status;

        console.log(
          `[stripe] customer.subscription.updated: ${subscription.id} status=${subscription.status} (was ${prevStatus})`,
        );

        // Only forward on status changes we care about
        const interestingStatuses = new Set(["past_due", "unpaid", "paused"]);
        if (
          prevStatus &&
          prevStatus !== subscription.status &&
          interestingStatuses.has(subscription.status)
        ) {
          const customerId =
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id;
          const customer = await getCustomer(stripe, customerId);

          if (customer) {
            const { first_name, last_name } = splitName(customer.name);
            await forwardToGhl({
              first_name,
              last_name,
              email: customer.email ?? "",
              phone: customer.phone ?? "",
              company_name: customer.metadata?.company ?? "",
              source: "Real American Grit - Stripe",
              tags: [
                "rag-scaling-system",
                `subscription-${subscription.status}`,
              ],
              event_type: `subscription_${subscription.status}`,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
            });
          }
        }
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
