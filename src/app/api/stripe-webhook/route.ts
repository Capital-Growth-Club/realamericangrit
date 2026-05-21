import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

// Successful payment webhook (new enrollment + renewals) — triggers onboarding / contract in GHL
const GHL_PAYMENT_SUCCESS_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/e4dba996-f93f-4c06-8163-365d925629f9";

// Failed auto-renewal webhook — ONLY fires when an existing subscription's recurring
// charge fails (not when a new signup's first payment fails).
const GHL_RENEWAL_FAILED_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/e76ac156-b934-40cb-a04c-1e3787ae8023";

// Dispute / chargeback webhook — fires for both created and closed dispute events
const GHL_DISPUTE_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/vSJhziS3J7EPm90zksAK";

// Member cancelled subscription webhook — fires when a subscription is fully canceled
const GHL_CANCELED_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/U33crx49dqSM4lE4OIY2/webhook-trigger/F1xUscobQBbzBPeWPRiO";

// Fallback webhook for other lifecycle events (refunds, status changes like past_due)
const GHL_CUSTOMER_WEBHOOK_URL =
  process.env.GHL_CUSTOMER_WEBHOOK_URL ?? process.env.GHL_WEBHOOK_URL ?? "";

// LightspeedVT REST API — direct integration, replaces the prior Zapier/Make hops.
// Creates a Location for the customer's company, then a User as the location owner
// with content roles based on tier (Standard vs White-Label).
const LSVT_API_BASE_URL = "https://webservices.lightspeedvt.net/REST/V1";
const LSVT_SOURCE_LOCATION_ID = Number(
  process.env.LSVT_SOURCE_LOCATION_ID ?? "233608", // B2B Template Location
);
const LSVT_ACCESS_LEVEL_MANAGER = 4; // Manager/Location Owner per LSVT docs
const LSVT_CONTENT_ROLES: Record<"standard" | "white-label", number[]> = {
  standard: [40245, 40246],
  "white-label": [40245, 40246, 41313],
};

function lsvtAuthHeader(): string | null {
  const username = process.env.LSVT_API_USERNAME;
  const password = process.env.LSVT_API_PASSWORD;
  if (!username || !password) return null;
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

async function lsvtCreateLocation(params: {
  name: string;
  phone: string;
}): Promise<number | null> {
  const auth = lsvtAuthHeader();
  if (!auth) {
    console.error("[LSVT] credentials not set — skipping createLocation");
    return null;
  }
  try {
    const res = await fetch(`${LSVT_API_BASE_URL}/locations`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sourceLocationId: LSVT_SOURCE_LOCATION_ID,
        name: params.name.slice(0, 100),
        // Placeholder address values — LSVT validates `state` against a real
        // US state list (rejects free-form like "Not provided") so we pass a
        // valid state code. The owner can update everything from inside LSVT
        // after they log in; we don't collect address at checkout.
        address: "Update in settings",
        city: "Update in settings",
        state: "TX",
        zip: "00000",
        country: "USA",
        phone: params.phone || "0000000000",
        isActive: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[LSVT] createLocation ${res.status}: ${body}`);
      return null;
    }
    const data = await res.json();
    const locationId = data.locationId ?? data.id ?? null;
    return typeof locationId === "number" ? locationId : null;
  } catch (err) {
    console.error("[LSVT] createLocation error:", err);
    return null;
  }
}

async function lsvtCreateUser(params: {
  locationId: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  contentRoles: number[];
}): Promise<number | null> {
  const auth = lsvtAuthHeader();
  if (!auth) {
    console.error("[LSVT] credentials not set — skipping createUser");
    return null;
  }
  try {
    const res = await fetch(`${LSVT_API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId: params.locationId,
        username: params.email,
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
        accessLevel: LSVT_ACCESS_LEVEL_MANAGER,
        forcePasswordUpdate: true,
        manageUsers: true,
        contentRole: params.contentRoles,
        isActive: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[LSVT] createUser ${res.status}: ${body}`);
      return null;
    }
    const data = await res.json();
    const userId = data.userId ?? data.id ?? null;
    return typeof userId === "number" ? userId : null;
  } catch (err) {
    console.error("[LSVT] createUser error:", err);
    return null;
  }
}

async function provisionLightspeedVT(payload: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  company_name: string;
  product_tier: "standard" | "white-label" | "unknown";
}) {
  if (payload.product_tier === "unknown") {
    console.error("[LSVT] cannot provision — product tier unknown");
    return;
  }
  if (!payload.email || !payload.first_name) {
    console.error("[LSVT] cannot provision — missing email or first name");
    return;
  }

  const locationName =
    payload.company_name?.trim() ||
    `${payload.first_name} ${payload.last_name}`.trim();

  const locationId = await lsvtCreateLocation({
    name: locationName,
    phone: payload.phone,
  });
  if (!locationId) {
    console.error("[LSVT] location creation failed — aborting user creation");
    return;
  }
  console.log(`[LSVT] created location ${locationId} (${locationName})`);

  // Temp password = FirstNameLastName123! (spaces stripped) — matches the
  // credentials email sent by GHL. forcePasswordUpdate makes LSVT require
  // the user to set their own on first login.
  const stripSpaces = (s: string) => (s || "").replace(/\s+/g, "");
  const password = `${stripSpaces(payload.first_name)}${stripSpaces(payload.last_name)}123!`;

  const userId = await lsvtCreateUser({
    locationId,
    email: payload.email,
    firstName: payload.first_name,
    lastName: payload.last_name,
    password,
    contentRoles: LSVT_CONTENT_ROLES[payload.product_tier],
  });
  if (!userId) {
    console.error(`[LSVT] user creation failed for location ${locationId}`);
    return;
  }
  console.log(
    `[LSVT] created user ${userId} (${payload.email}) in location ${locationId}`,
  );
}

function resolveTier(
  metadataTier: string | undefined,
  priceId: string,
): { tier: "standard" | "white-label" | "unknown"; productName: string } {
  if (metadataTier === "white-label") {
    return { tier: "white-label", productName: "White-Label - Make It Yours" };
  }
  if (metadataTier === "standard") {
    return { tier: "standard", productName: "Standard - The Full Library" };
  }
  // Fallback: match against configured price IDs
  if (priceId && priceId === process.env.STRIPE_PRICE_ID_WHITE_LABEL) {
    return { tier: "white-label", productName: "White-Label - Make It Yours" };
  }
  if (priceId && priceId === process.env.STRIPE_PRICE_ID) {
    return { tier: "standard", productName: "Standard - The Full Library" };
  }
  return { tier: "unknown", productName: "Unknown" };
}

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
  amount_dollars?: number;
  currency?: string;
  product_tier?: "standard" | "white-label" | "unknown";
  product_name?: string;
  reason?: string;
};

async function forwardToGhl(url: string, payload: GhlPayload) {
  if (!url) return;
  try {
    await fetch(url, {
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

          // Look up the subscription to read tier + price ID
          let metadataTier: string | undefined;
          let priceId = "";
          if (subscriptionId) {
            try {
              const sub = await stripe.subscriptions.retrieve(subscriptionId);
              metadataTier = sub.metadata?.tier;
              priceId = sub.items.data[0]?.price?.id ?? "";
            } catch (err) {
              console.error("Failed to retrieve subscription for tier lookup:", err);
            }
          }
          const { tier, productName } = resolveTier(metadataTier, priceId);

          await forwardToGhl(GHL_PAYMENT_SUCCESS_WEBHOOK_URL, {
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
            amount_dollars: invoice.amount_paid / 100,
            currency: invoice.currency,
            product_tier: tier,
            product_name: productName,
          });

          // Only provision LightspeedVT for first payments (subscription_create),
          // not for monthly renewals — otherwise we'd create duplicate
          // locations + users every billing cycle.
          if (isFirstPayment) {
            await provisionLightspeedVT({
              email: customer.email ?? "",
              first_name,
              last_name,
              phone: customer.phone ?? "",
              company_name: customer.metadata?.company ?? "",
              product_tier: tier,
            });
          }
        }
        break;
      }

      // Failed payment — only fire GHL webhook for renewal failures (dunning),
      // NOT for new-signup first-payment failures (user sees those in the checkout UI).
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const isRenewalFailure =
          invoice.billing_reason === "subscription_cycle";
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;
        const rawSub = invoice.parent?.subscription_details?.subscription;
        const subscriptionId =
          typeof rawSub === "string" ? rawSub : rawSub?.id;

        console.log(
          `[stripe] invoice.payment_failed: ${invoice.id} customer=${customerId} billing_reason=${invoice.billing_reason} renewalFailure=${isRenewalFailure}`,
        );

        if (!isRenewalFailure) {
          // New-signup failure — skip GHL forward. No dunning needed; checkout UI already surfaces the error.
          break;
        }

        const customer = await getCustomer(stripe, customerId);
        if (customer) {
          const { first_name, last_name } = splitName(customer.name);
          await forwardToGhl(GHL_RENEWAL_FAILED_WEBHOOK_URL, {
            first_name,
            last_name,
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            company_name: customer.metadata?.company ?? "",
            source: "Real American Grit - Stripe",
            tags: ["rag-scaling-system", "renewal-failed"],
            event_type: "renewal_payment_failed",
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
          await forwardToGhl(GHL_CUSTOMER_WEBHOOK_URL, {
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
          await forwardToGhl(GHL_DISPUTE_WEBHOOK_URL, {
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
          await forwardToGhl(GHL_DISPUTE_WEBHOOK_URL, {
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
          await forwardToGhl(GHL_CANCELED_WEBHOOK_URL, {
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
            await forwardToGhl(GHL_CUSTOMER_WEBHOOK_URL, {
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
