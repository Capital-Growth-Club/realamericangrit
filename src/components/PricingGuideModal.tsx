"use client";

import { useEffect, useRef, useState } from "react";
import { X, ShieldCheck, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";

type Step = "form" | "verify";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type Utm = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  fbclid: string;
  gclid: string;
};

const EMPTY_FORM: Form = { firstName: "", lastName: "", email: "", phone: "" };
const EMPTY_UTM: Utm = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  fbclid: "",
  gclid: "",
};

const THANKS_URL = "/pricingguide/thanks";

export default function PricingGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [utm, setUtm] = useState<Utm>(EMPTY_UTM);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: p.get("utm_source") ?? "",
      utm_medium: p.get("utm_medium") ?? "",
      utm_campaign: p.get("utm_campaign") ?? "",
      utm_term: p.get("utm_term") ?? "",
      utm_content: p.get("utm_content") ?? "",
      fbclid: p.get("fbclid") ?? "",
      gclid: p.get("gclid") ?? "",
    });
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStep("form");
      setForm(EMPTY_FORM);
      setVerifiedPhone("");
      setCode("");
      setBusy(false);
      setError("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (step === "verify") {
      const t = setTimeout(() => codeRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (!open) return null;

  const update =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/send-guide-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to send verification code.");
        setBusy(false);
        return;
      }
      setVerifiedPhone(data.phone);
      setStep("verify");
    } catch {
      setError("Network error. Try again.");
    }
    setBusy(false);
  }

  async function submitVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/check-phone-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: verifiedPhone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Verification failed.");
        setBusy(false);
        return;
      }
      await fetch("/api/register-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: verifiedPhone,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          ...utm,
        }),
      }).catch(() => {});
      window.location.assign(THANKS_URL);
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  async function resendCode() {
    setError("");
    setBusy(true);
    try {
      await fetch("/api/send-guide-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: verifiedPhone }),
      });
    } catch {
      // Silent — user can try again.
    }
    setBusy(false);
  }

  const inputCls =
    "w-full rounded-lg border border-white/20 bg-white/[0.06] px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-[#BF0A30] focus:bg-white/[0.1]";

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-full items-center justify-center overflow-y-auto bg-black/70 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-[#BF0A30] bg-[#0B2341] p-6 shadow-2xl shadow-black/50 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "form" ? (
          <>
            <h2
              className={`${hFont} text-center text-3xl font-black leading-none tracking-[0.03em] text-white sm:text-4xl`}
            >
              Get The Free Guide
            </h2>
            <p className="mt-2 text-center text-sm text-white/60">
              Tell us where to send it and we&rsquo;ll email you the guide.
            </p>
            <form onSubmit={submitForm} className="mt-5 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className={inputCls}
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                  value={form.firstName}
                  onChange={update("firstName")}
                />
                <input
                  className={inputCls}
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                  value={form.lastName}
                  onChange={update("lastName")}
                />
              </div>
              <input
                className={inputCls}
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
                value={form.email}
                onChange={update("email")}
              />
              <input
                className={inputCls}
                type="tel"
                placeholder="Cell phone"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={update("phone")}
              />

              {error && (
                <p className="flex items-center justify-center gap-1.5 text-sm text-[#ff6b81]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className={`${hFont} mt-1 flex h-[58px] w-full items-center justify-center rounded-full bg-[#BF0A30] text-2xl tracking-[0.04em] text-white transition-colors hover:bg-[#D91C40] active:bg-[#A00928] disabled:opacity-60`}
              >
                {busy ? "Sending Code…" : "Send Me The Guide"}
              </button>
              <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-white/45">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                We&rsquo;ll text a quick code to confirm your number. No spam.
              </p>
            </form>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setCode("");
                setError("");
              }}
              className="mb-2 flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h2
              className={`${hFont} text-center text-3xl font-black leading-none tracking-[0.03em] text-white sm:text-4xl`}
            >
              Confirm Your Number
            </h2>
            <p className="mt-2 text-center text-sm text-white/60">
              We texted a 6-digit code to{" "}
              <span className="font-semibold text-white">{verifiedPhone}</span>.
              Enter it and we&rsquo;ll email you the guide.
            </p>
            <form onSubmit={submitVerify} className="mt-5 space-y-3">
              <input
                ref={codeRef}
                className={`${inputCls} text-center text-2xl tracking-[0.5em]`}
                inputMode="numeric"
                maxLength={6}
                placeholder="______"
                required
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
              {error && (
                <p className="flex items-center justify-center gap-1.5 text-sm text-[#ff6b81]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy || code.length < 6}
                className={`${hFont} flex h-[58px] w-full items-center justify-center rounded-full bg-[#BF0A30] text-2xl tracking-[0.04em] text-white transition-colors hover:bg-[#D91C40] active:bg-[#A00928] disabled:opacity-60`}
              >
                {busy ? "Sending…" : "Send My Guide"}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={busy}
                className="flex w-full items-center justify-center gap-1.5 pt-1 text-center text-xs text-white/50 transition-colors hover:text-white disabled:opacity-60"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Resend code
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
