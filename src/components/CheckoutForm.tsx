"use client";

import { useEffect, useRef, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

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

/* ─── Inner form (has access to Stripe context) ─── */
function PaymentForm({
  formData,
  tracking,
}: {
  formData: FormData;
  tracking: Tracking;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setError("");

    // Send lead to GHL in parallel (fire-and-forget)
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, ...tracking }),
    }).catch(() => {});

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you`,
        payment_method_data: {
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
    }
    setPaying(false);
  }

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="bg-white rounded-lg p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                name: "never",
                email: "never",
                phone: "never",
                address: { country: "never" },
              },
            },
          }}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={paying || !stripe || !elements}
        className="w-full h-14 rounded-lg bg-[#b71c1c] text-white text-lg font-bold hover:bg-[#d32f2f] transition-colors pulse-red disabled:opacity-60"
      >
        {paying ? "Processing Payment…" : "Complete Purchase — $997"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Secure payment powered by Stripe. 256-bit SSL encryption.
      </p>
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
      const res = await fetch("/api/create-payment-intent", {
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
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: {
                  colorPrimary: "#b71c1c",
                  colorBackground: "#0f1d32",
                  colorText: "#ffffff",
                  colorDanger: "#ef4444",
                  borderRadius: "8px",
                  fontFamily: "system-ui, sans-serif",
                },
              },
            }}
          >
            <PaymentForm formData={formData} tracking={tracking} />
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

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: "#b71c1c",
              colorBackground: "#0f1d32",
              colorText: "#ffffff",
              colorDanger: "#ef4444",
              borderRadius: "8px",
              fontFamily: "system-ui, sans-serif",
            },
          },
        }}
      >
        <PaymentForm formData={formData} tracking={tracking} />
      </Elements>
    </div>
  );
}
