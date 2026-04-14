"use client";

import { useEffect, useRef, useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, type PaymentRequest } from "@stripe/stripe-js";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

type Tracking = {
  cid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
};

const EMPTY_TRACKING: Tracking = {
  cid: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
};

/* ─── Shared style for split card fields ─── */
const cardElementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#64748b" },
      iconColor: "#94a3b8",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

/* ─── Inner form (has access to Stripe context) ─── */
function PaymentForm({
  clientSecret,
  formData,
  tracking,
}: {
  clientSecret: string;
  formData: FormData;
  tracking: Tracking;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null,
  );

  // Set up Apple Pay / Google Pay button (only appears when supported)
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: { label: "RAG Scaling System", amount: 99700 },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      disableWallets: ["link", "googlePay", "browserCard"],
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });

    pr.on("paymentmethod", async (ev) => {
      // Send lead to GHL in parallel
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...tracking }),
      }).catch(() => {});

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false },
        );

      if (confirmError) {
        ev.complete("fail");
        setError(confirmError.message ?? "Payment failed.");
        return;
      }

      ev.complete("success");

      // Handle 3DS if needed
      if (paymentIntent?.status === "requires_action") {
        const { error: actionError } = await stripe.confirmCardPayment(
          clientSecret,
        );
        if (actionError) {
          setError(actionError.message ?? "Payment failed.");
          return;
        }
      }

      window.location.href = `${window.location.origin}/thank-you`;
    });
  }, [stripe, clientSecret, formData, tracking]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    setPaying(true);
    setError("");

    // Send lead to GHL in parallel (fire-and-forget)
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, ...tracking }),
    }).catch(() => {});

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        },
      },
    );

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setPaying(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      window.location.href = `${window.location.origin}/thank-you`;
      return;
    }

    setPaying(false);
  }

  const fieldClass =
    "bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3.5 transition-colors focus-within:border-[#b71c1c]/60 focus-within:bg-white/[0.06]";

  return (
    <form onSubmit={handlePay} className="space-y-3">
      {/* Apple Pay button (only appears on supported devices) */}
      {paymentRequest && (
        <div className="space-y-3 pb-1">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: "default",
                  theme: "dark",
                  height: "52px",
                },
              },
            }}
          />
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              or pay with card
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      )}

      {/* Card number */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
          Card Number
        </label>
        <div className={fieldClass}>
          <CardNumberElement
            options={{
              ...cardElementStyle,
              placeholder: "1234 1234 1234 1234",
              showIcon: true,
            }}
          />
        </div>
      </div>

      {/* Expiry + CVC row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
            Expiry
          </label>
          <div className={fieldClass}>
            <CardExpiryElement
              options={{ ...cardElementStyle, placeholder: "MM / YY" }}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
            CVC
          </label>
          <div className={fieldClass}>
            <CardCvcElement
              options={{ ...cardElementStyle, placeholder: "123" }}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center pt-1">{error}</p>
      )}

      <button
        type="submit"
        disabled={paying || !stripe || !elements}
        className="w-full h-14 rounded-lg bg-[#b71c1c] text-white text-lg font-bold hover:bg-[#d32f2f] transition-colors pulse-red disabled:opacity-60 mt-2"
      >
        {paying ? "Processing…" : "Start Subscription — $997/mo"}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 pt-1">
        <Lock className="w-3 h-3" />
        <span>Secure payment · Powered by Stripe</span>
      </div>
    </form>
  );
}

/* ─── Outer wrapper ─── */
export default function CheckoutForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [tracking, setTracking] = useState<Tracking>(EMPTY_TRACKING);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingContact, setEditingContact] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const autoIntentTriggered = useRef(false);

  // Read URL params on mount — prefill contact info + tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next: FormData = {
      name: params.get("name") ?? "",
      email: params.get("email") ?? "",
      phone: params.get("phone") ?? "",
      company: params.get("company") ?? "",
    };
    const trackNext: Tracking = {
      cid: params.get("cid") ?? "",
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_content: params.get("utm_content") ?? "",
      utm_term: params.get("utm_term") ?? "",
    };

    setTracking(trackNext);

    if (next.name && next.email && next.phone) {
      setFormData(next);
      setPrefilled(true);
    } else if (next.name || next.email || next.phone || next.company) {
      setFormData(next);
    }
  }, []);

  // Auto-create payment intent when contact info is fully prefilled
  useEffect(() => {
    if (!prefilled || autoIntentTriggered.current) return;
    if (!formData.name || !formData.email || !formData.phone) return;

    autoIntentTriggered.current = true;
    void createPaymentIntent(formData, tracking);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilled, formData.name, formData.email, formData.phone]);

  async function createPaymentIntent(data: FormData, track: Tracking) {
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...track }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error || "Something went wrong.");
        return;
      }
      setClientSecret(json.clientSecret);
    } catch {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createPaymentIntent(formData, tracking);
  }

  /* ─── Prefilled flow: read-only contact card + immediate Stripe ─── */
  if (prefilled && !editingContact) {
    return (
      <div>
        {/* Contact summary card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-lg p-4 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Enrolling as
              </p>
              <p className="text-white font-semibold text-sm truncate">
                {formData.name}
              </p>
              <p className="text-gray-400 text-xs truncate">{formData.email}</p>
              <p className="text-gray-400 text-xs truncate">{formData.phone}</p>
              {formData.company && (
                <p className="text-gray-400 text-xs truncate">
                  {formData.company}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setEditingContact(true)}
              className="text-[#b71c1c] text-xs font-semibold hover:underline shrink-0"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Stripe payment element (loads automatically) */}
        {loading && !clientSecret && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Loading secure payment…
          </div>
        )}
        {formError && (
          <p className="text-red-400 text-sm text-center mb-4">{formError}</p>
        )}
        {clientSecret && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              clientSecret={clientSecret}
              formData={formData}
              tracking={tracking}
            />
          </Elements>
        )}
      </div>
    );
  }

  /* ─── Cold flow (or user clicked Edit): collect contact info first ─── */
  if (!clientSecret) {
    return (
      <form onSubmit={handleManualSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full h-12 rounded-lg bg-white/10 border border-white/20 px-4 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#b71c1c]"
        />
        <input
          type="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="w-full h-12 rounded-lg bg-white/10 border border-white/20 px-4 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#b71c1c]"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          required
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="w-full h-12 rounded-lg bg-white/10 border border-white/20 px-4 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#b71c1c]"
        />
        <input
          type="text"
          placeholder="Company Name"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          className="w-full h-12 rounded-lg bg-white/10 border border-white/20 px-4 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#b71c1c]"
        />

        {formError && (
          <p className="text-red-400 text-sm text-center">{formError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-lg bg-[#b71c1c] text-white text-lg font-bold hover:bg-[#d32f2f] transition-colors pulse-red disabled:opacity-60 mt-2"
        >
          {loading ? "Loading…" : "Continue Checkout →"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-2">
          Next step: enter your card details securely via Stripe.
        </p>
      </form>
    );
  }

  /* ─── Cold flow step 2: Stripe element after manual submit ─── */
  return (
    <div>
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
          ✓
        </div>
        <div className="text-sm">
          <p className="text-gray-400">
            {formData.name} · {formData.email}
          </p>
          <button
            type="button"
            onClick={() => setClientSecret("")}
            className="text-[#b71c1c] text-xs hover:underline"
          >
            Edit info
          </button>
        </div>
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm
          clientSecret={clientSecret}
          formData={formData}
          tracking={tracking}
        />
      </Elements>
    </div>
  );
}
