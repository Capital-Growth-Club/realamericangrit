"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";
const CALENDAR_ID = "DUSPZCW0jGMskd8wx9p4";

type Step = "qualify" | "trade" | "business" | "contact" | "verify" | "calendar";
type YesNo = "" | "yes" | "no";

/** The ordered input steps, used for the progress bar. */
const INPUT_STEPS: Step[] = ["qualify", "trade", "business", "contact"];

type Form = {
  qualifiedOwner: YesNo;
  trade: string;
  company: string;
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

const EMPTY: Form = {
  qualifiedOwner: "",
  trade: "",
  company: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const EMPTY_UTM: Utm = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  fbclid: "",
  gclid: "",
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function DemoBookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("qualify");
  const [form, setForm] = useState<Form>(EMPTY);
  const [utm, setUtm] = useState<Utm>(EMPTY_UTM);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const codeInputRef = useRef<HTMLInputElement>(null);
  // Contact fields prefilled from the URL (GHL merge tags in email links).
  // Stored so the close-reset restores the prefill instead of wiping it.
  const prefillRef = useRef<Partial<Form>>({});

  // Capture UTM + click-id params off the URL on mount so we can forward
  // them with the lead submission, and prefill contact fields passed in the
  // URL (e.g. ?name=Jane%20Doe&email=...&phone=...). Read directly from
  // window.location so we don't force the page into dynamic rendering.
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

    const fullName = (p.get("name") ?? "").trim();
    const spaceIdx = fullName.indexOf(" ");
    const prefill: Partial<Form> = {
      firstName:
        p.get("first_name") ??
        p.get("fname") ??
        (spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx)),
      lastName:
        p.get("last_name") ??
        p.get("lname") ??
        (spaceIdx === -1 ? "" : fullName.slice(spaceIdx + 1)),
      email: p.get("email") ?? "",
      // A literal "+" in a query decodes to a space — strip stray whitespace.
      phone: (p.get("phone") ?? "").replace(/\s+/g, ""),
      company: p.get("company") ?? "",
      trade: p.get("trade") ?? "",
    };
    // Keep only non-empty values so we never stomp real state with "".
    const cleaned = Object.fromEntries(
      Object.entries(prefill).filter(([, v]) => v),
    ) as Partial<Form>;
    prefillRef.current = cleaned;
    setForm((f) => ({ ...f, ...cleaned }));
  }, []);

  // Lock body scroll while open and reset state on close
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStep("qualify");
      setForm({ ...EMPTY, ...prefillRef.current });
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

  // Step 1 — qualify. "No" is outside our ICP: bounce to /not-qualified.
  function answerQualify(v: YesNo) {
    setError("");
    if (v === "no") {
      setForm((f) => ({ ...f, qualifiedOwner: "no" }));
      window.location.assign("/not-qualified");
      return;
    }
    setForm((f) => ({ ...f, qualifiedOwner: "yes" }));
    setStep("trade");
  }

  // Final input step — send the SMS verification code + forward the lead.
  async function submitContact(e: React.FormEvent) {
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
          trade: form.trade,
          qualifiedOwner: form.qualifiedOwner,
          ...utm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to send verification code.");
        setBusy(false);
        return;
      }

      // NOTE: No Facebook Pixel conversion fires here. Submitting the form is
      // NOT a booking — an "abandoned" visitor can submit + verify and still
      // never pick a slot. The only Pixel conversion (Schedule) fires on the
      // /demobooked thank-you page after a real booking, keeping reporting clean.

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

  // GHL calendar URL with prefill. Carries the qualifying answers (trade,
  // business name) + full attribution (UTMs, fbclid, gclid) onto the booking
  // so it's captured even when GHL's own attribution misses it. URLSearchParams
  // encodes values (handles spaces in business names); empties are dropped.
  const calendarSrc = (() => {
    const fields: Record<string, string> = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: verifiedPhone,
      what_trade_are_you_in: form.trade,
      legal_business_name: form.company,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term,
      utm_content: utm.utm_content,
      fbclid: utm.fbclid,
      gclid: utm.gclid,
    };
    const params = new URLSearchParams();
    Object.entries(fields).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}?${params.toString()}`;
  })();

  const contactValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim();

  const inputIndex = INPUT_STEPS.indexOf(step);
  const progressPct =
    inputIndex >= 0 ? ((inputIndex + 1) / INPUT_STEPS.length) * 100 : 0;

  const kicker = `text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#BF0A30] mb-2 ${hFont}`;
  const heading = `text-3xl sm:text-4xl font-black tracking-[0.03em] leading-[1.02] mb-3 ${hFont}`;
  const primaryBtn = `inline-flex h-[56px] items-center justify-center gap-2 rounded-full px-8 text-lg font-bold tracking-[0.05em] cursor-pointer bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed ${hFont}`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${step === "calendar" ? "max-w-3xl" : "max-w-md"} bg-[#0B2341] text-white rounded-2xl border border-white/10 transition-[max-width] duration-300`}
      >
        {/* Progress bar (input steps only) */}
        {inputIndex >= 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-[#BF0A30] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-white" aria-hidden="true" />
        </button>

        {/* ─── Step 1: qualify ─── */}
        {step === "qualify" && (
          <div className="p-6 sm:p-8">
            <p className={kicker}>Book A Demo</p>
            <h2 className={heading}>
              Do you own or run a home service operation with at least 5
              employees?
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              This platform is built for established operators. Quick question
              before we grab a time.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => answerQualify("yes")}
                className={`h-14 rounded-xl text-lg font-bold tracking-[0.05em] uppercase transition-colors cursor-pointer bg-[#BF0A30] text-white hover:bg-[#D91C40] ${hFont}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => answerQualify("no")}
                className={`h-14 rounded-xl text-lg font-bold tracking-[0.05em] uppercase transition-colors cursor-pointer bg-[#06192F] border border-white/15 text-gray-300 hover:border-white/30 hover:text-white ${hFont}`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: trade ─── */}
        {step === "trade" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (form.trade.trim()) setStep("business");
            }}
            className="p-6 sm:p-8"
          >
            <BackButton onClick={() => setStep("qualify")} />
            <p className={kicker}>Book A Demo</p>
            <h2 className={heading}>What trade are you in?</h2>
            <p className="text-sm text-gray-400 mb-6">
              HVAC, plumbing, electrical, roofing, and so on.
            </p>
            <Field
              label="Trade"
              required
              value={form.trade}
              onChange={update("trade")}
              disabled={busy}
              placeholder="e.g. HVAC"
              autoFocus
            />
            <button
              type="submit"
              disabled={!form.trade.trim()}
              className={`${primaryBtn} mt-5`}
            >
              Continue <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>
        )}

        {/* ─── Step 3: business name ─── */}
        {step === "business" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (form.company.trim()) setStep("contact");
            }}
            className="p-6 sm:p-8"
          >
            <BackButton onClick={() => setStep("trade")} />
            <p className={kicker}>Book A Demo</p>
            <h2 className={heading}>What&rsquo;s your business name?</h2>
            <p className="text-sm text-gray-400 mb-6">
              So we can pull up your operation before the call.
            </p>
            <Field
              label="Business Name"
              required
              value={form.company}
              onChange={update("company")}
              disabled={busy}
              autoComplete="organization"
              placeholder="e.g. Lee's Air"
              autoFocus
            />
            <button
              type="submit"
              disabled={!form.company.trim()}
              className={`${primaryBtn} mt-5`}
            >
              Continue <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>
        )}

        {/* ─── Step 4: contact ─── */}
        {step === "contact" && (
          <form onSubmit={submitContact} className="p-6 sm:p-8">
            <BackButton onClick={() => setStep("business")} />
            <p className={kicker}>Almost There</p>
            <h2 className={heading}>Fill in your information and book your call on the next page.</h2>
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
                  autoFocus
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
              disabled={busy || !contactValid}
              className={primaryBtn}
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
                  setStep("contact");
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
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer mb-4"
    >
      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back
    </button>
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
  autoFocus,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
  autoFocus?: boolean;
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
        autoFocus={autoFocus}
        className="w-full h-11 px-3 rounded-lg bg-[#06192F] border border-white/15 text-white text-base focus:outline-none focus:border-[#BF0A30] focus:ring-1 focus:ring-[#BF0A30] disabled:opacity-50"
      />
    </label>
  );
}
