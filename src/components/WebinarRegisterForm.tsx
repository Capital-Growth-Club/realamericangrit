"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";

type Step = "form" | "verify";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  trade: string;
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

const EMPTY_FORM: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  trade: "",
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

const THANKS_URL = "/slowseasonwebinar/thanks";

export default function WebinarRegisterForm() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [utm, setUtm] = useState<Utm>(EMPTY_UTM);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);

  // Capture UTM + click-id params off the URL (read window.location directly so
  // we don't force the page into dynamic rendering via useSearchParams).
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

    // Prefill from contact info passed in the URL (GHL merge tags in email
    // links, e.g. ?name=Jane%20Doe&email=...&phone=...). Accepts first/last
    // split out, or a single "name" we split on the first space.
    const fullName = (p.get("name") ?? "").trim();
    const spaceIdx = fullName.indexOf(" ");
    const firstFromName =
      spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx);
    const lastFromName = spaceIdx === -1 ? "" : fullName.slice(spaceIdx + 1);
    // A literal "+" in a query string decodes to a space, so strip stray
    // whitespace back out of the phone number.
    const phone = (p.get("phone") ?? "").replace(/\s+/g, "");
    setForm((f) => ({
      ...f,
      firstName: p.get("first_name") ?? p.get("fname") ?? firstFromName ?? "",
      lastName: p.get("last_name") ?? p.get("lname") ?? lastFromName ?? "",
      email: p.get("email") ?? "",
      phone,
      trade: p.get("trade") ?? f.trade,
    }));
  }, []);

  useEffect(() => {
    if (step === "verify") {
      const t = setTimeout(() => codeRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [step]);

  const update =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  // Submit contact info → send the SMS verification code.
  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/send-webinar-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          trade: form.trade,
          ...utm,
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

  // Confirm the code → register in GHL → thank-you page.
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
      // Phone verified — post the confirmed registration to GHL, then redirect.
      // Don't block the redirect if the forward hiccups (route swallows errors).
      await fetch("/api/register-webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: verifiedPhone,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          trade: form.trade,
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
      await fetch("/api/send-webinar-verification", {
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
    "w-full rounded-lg border border-white/50 bg-white/[0.06] px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-[#BF0A30] focus:bg-white/[0.1]";

  return (
    <div className="w-full rounded-2xl border-2 border-[#BF0A30] bg-[#0B2341] p-5 shadow-2xl shadow-[#BF0A30]/20 sm:p-7">
      {step === "form" ? (
        <>
          <h2
            className={`${hFont} text-center text-3xl font-black leading-none tracking-[0.03em] text-white sm:text-4xl`}
          >
            Register For Free Webinar
          </h2>
          <p className="mt-2 text-center text-sm text-white/60">
            Save your seat and add it to your calendar to join us live on
            September 3rd.
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
              placeholder="Cell phone (for reminders)"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={update("phone")}
            />
            <input
              className={inputCls}
              placeholder="What trade are you in? (e.g. HVAC, Plumbing, Electrical)"
              required
              value={form.trade}
              onChange={update("trade")}
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
              {busy ? "Sending Code…" : "Register For The Webinar"}
            </button>
            <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-white/45">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              We&apos;ll text a quick code to confirm your number. No spam.
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
            Enter it to lock in your seat.
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
              {busy ? "Confirming…" : "Confirm & Register"}
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
  );
}
