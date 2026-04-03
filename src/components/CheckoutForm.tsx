"use client";

import { useState } from "react";
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

/* ─── Inner form (has access to Stripe context) ─── */
function PaymentForm({
  formData,
  onSuccess,
}: {
  formData: { name: string; email: string; phone: string; company: string };
  onSuccess: () => void;
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
      body: JSON.stringify(formData),
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

    // Only reaches here if there's an error (otherwise redirects)
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
        {paying ? "Processing Payment…" : "Pay $997 — Get Instant Access"}
      </button>

      <p className="text-center text-xs text-gray-500">
        Secure payment powered by Stripe. 256-bit SSL encryption.
      </p>
    </form>
  );
}

/* ─── Outer wrapper (handles lead info + payment intent creation) ─── */
export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setClientSecret(data.clientSecret);
    } catch {
      setFormError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-lg font-bold text-white mb-2">
          Payment Successful!
        </p>
        <p className="text-sm text-gray-400">
          Check your email for access details.
        </p>
      </div>
    );
  }

  /* Step 1: Collect contact info */
  if (!clientSecret) {
    return (
      <form onSubmit={handleContinueToPayment} className="space-y-3">
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
          {loading ? "Loading…" : "Continue to Payment →"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-2">
          Next step: enter your card details securely via Stripe.
        </p>
      </form>
    );
  }

  /* Step 2: Stripe payment element */
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
        <PaymentForm formData={formData} onSuccess={() => setSuccess(true)} />
      </Elements>
    </div>
  );
}
