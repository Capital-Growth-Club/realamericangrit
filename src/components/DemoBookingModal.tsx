"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";
const CALENDAR_ID = "DUSPZCW0jGMskd8wx9p4";

type Step = "form" | "verify" | "calendar";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
};

const EMPTY: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
};

export default function DemoBookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<Form>(EMPTY);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll while open and reset state on close
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStep("form");
      setForm(EMPTY);
      setVerifiedPhone("");
      setCode("");
      setBusy(false);
      setError("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Auto-focus code field when verify step starts
  useEffect(() => {
    if (step === "verify") {
      const t = setTimeout(() => codeInputRef.current?.focus(), 50);
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
      const res = await fetch("/api/send-phone-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          company: form.company,
        }),
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
      setStep("calendar");
    } catch {
      setError("Network error. Try again.");
    }
    setBusy(false);
  }

  async function resendCode() {
    setError("");
    setBusy(true);
    try {
      await fetch("/api/send-phone-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: verifiedPhone }),
      });
    } catch {
      // Silent — user can try again
    }
    setBusy(false);
  }

  // GHL calendar URL with prefill — all standard GHL booking widget params
  const calendarSrc = (() => {
    const params = new URLSearchParams({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: verifiedPhone,
    });
    return `https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}?${params.toString()}`;
  })();

  const formValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.company.trim();

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${step === "calendar" ? "max-w-3xl" : "max-w-md"} bg-[#0B2341] text-white rounded-2xl border border-white/10 my-4 sm:my-0 transition-[max-width] duration-300`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-white" aria-hidden="true" />
        </button>

        {/* ─── Step: form ─── */}
        {step === "form" && (
          <form onSubmit={submitForm} className="p-6 sm:p-8">
            <p
              className={`text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#BF0A30] mb-2 ${hFont}`}
            >
              Book A Demo
            </p>
            <h2
              className={`text-3xl sm:text-4xl font-black tracking-[0.05em] leading-[0.95] mb-2 ${hFont}`}
            >
              Let&rsquo;s grab a time.
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              We&rsquo;ll text you a code to verify your number, then put you
              straight on the calendar.
            </p>

            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={update("firstName")}
                  disabled={busy}
                  autoComplete="given-name"
                />
                <Field
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={update("lastName")}
                  disabled={busy}
                  autoComplete="family-name"
                />
              </div>
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                disabled={busy}
                autoComplete="email"
              />
              <Field
                label="Phone"
                type="tel"
                required
                value={form.phone}
                onChange={update("phone")}
                disabled={busy}
                autoComplete="tel"
                placeholder="(555) 123-4567"
              />
              <Field
                label="Company"
                required
                value={form.company}
                onChange={update("company")}
                disabled={busy}
                autoComplete="organization"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#BF0A30]/15 border border-[#BF0A30]/30 mb-4">
                <AlertCircle
                  className="shrink-0 w-4 h-4 text-[#BF0A30] mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-sm text-[#FFB3C0]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !formValid}
              className={`inline-flex h-[56px] items-center justify-center gap-2 rounded-full px-8 text-lg font-bold tracking-[0.05em] cursor-pointer bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed ${hFont}`}
            >
              {busy ? (
                "Sending Code…"
              ) : (
                <>
                  Continue <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you agree to receive a one-time SMS verification
              code. Standard messaging rates may apply.
            </p>
          </form>
        )}

        {/* ─── Step: verify ─── */}
        {step === "verify" && (
          <form onSubmit={submitVerify} className="p-6 sm:p-8">
            <div className="w-14 h-14 rounded-full bg-[#BF0A30]/15 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck
                className="w-7 h-7 text-[#BF0A30]"
                aria-hidden="true"
              />
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-black tracking-[0.05em] leading-[0.95] mb-2 text-center ${hFont}`}
            >
              Verify Your Phone
            </h2>
            <p className="text-sm text-gray-400 mb-6 text-center">
              We sent a 6-digit code to{" "}
              <span className="text-white font-medium">{verifiedPhone}</span>.
              Enter it below.
            </p>

            <input
              ref={codeInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="\d{6}"
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              disabled={busy}
              className={`w-full h-16 px-4 mb-4 rounded-lg bg-[#06192F] border-2 border-white/15 text-white text-center text-3xl font-bold tracking-[0.5em] focus:outline-none focus:border-[#BF0A30] disabled:opacity-50 ${hFont}`}
            />

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#BF0A30]/15 border border-[#BF0A30]/30 mb-4">
                <AlertCircle
                  className="shrink-0 w-4 h-4 text-[#BF0A30] mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-sm text-[#FFB3C0]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className={`inline-flex h-[56px] items-center justify-center rounded-full px-8 text-lg font-bold tracking-[0.05em] cursor-pointer bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed ${hFont}`}
            >
              {busy ? "Verifying…" : "Verify & Book"}
            </button>

            <div className="flex items-center justify-between mt-5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setCode("");
                  setError("");
                }}
                disabled={busy}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Edit Number
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={busy}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" /> Resend Code
              </button>
            </div>
          </form>
        )}

        {/* ─── Step: calendar ─── */}
        {step === "calendar" && (
          <div className="p-3 sm:p-5">
            <div className="pt-2 pb-3 px-3 text-center">
              <p
                className={`text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#BF0A30] mb-1 ${hFont}`}
              >
                Phone Verified
              </p>
              <h2
                className={`text-2xl sm:text-3xl font-black tracking-[0.05em] leading-[0.95] ${hFont}`}
              >
                Pick A Time That Works.
              </h2>
            </div>
            <div className="bg-white rounded-xl overflow-hidden">
              <iframe
                src={calendarSrc}
                style={{
                  width: "100%",
                  border: "none",
                  overflow: "hidden",
                  minHeight: "650px",
                }}
                scrolling="no"
                id={`${CALENDAR_ID}_modal`}
                title="Book a demo"
              />
              <Script
                src="https://link.msgsndr.com/js/form_embed.js"
                type="text/javascript"
                strategy="afterInteractive"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  type = "text",
  value,
  onChange,
  disabled,
  autoComplete,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span
        className={`block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-1 ${hFont}`}
      >
        {label}
        {required && <span className="text-[#BF0A30] ml-1">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full h-11 px-3 rounded-lg bg-[#06192F] border border-white/15 text-white text-base focus:outline-none focus:border-[#BF0A30] focus:ring-1 focus:ring-[#BF0A30] disabled:opacity-50"
      />
    </label>
  );
}
