"use client";

import { useState } from "react";
import { Check, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

const hFont = "font-[family-name:var(--font-outfit)]";

type Step = "info" | "verify" | "done";

export default function PreRegisterPage() {
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStep("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/check-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, name, phone, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white flex flex-col">
      {/* Top tricolor stripe */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#b71c1c]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#1a3a6b]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-center px-5 sm:px-8 h-[72px]">
          <a href="/" className="flex items-center gap-2.5" aria-label="Home">
            <div className="w-10 h-10 rounded-full bg-[#b71c1c] flex items-center justify-center">
              <span className={`text-sm font-black text-white tracking-tighter ${hFont}`}>RAG</span>
            </div>
            <span className={`font-extrabold text-base tracking-tight text-white ${hFont}`}>
              REAL AMERICAN GRIT
            </span>
          </a>
        </div>
      </header>

      {/* Background glow */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#b71c1c]/[0.05] rounded-full blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-lg mx-auto px-5 sm:px-8 py-16 sm:py-24">
          {/* ── Step: Collect Info ── */}
          {step === "info" && (
            <div>
              <div className="text-center mb-10">
                <p className={`uppercase text-xs font-bold tracking-[0.2em] text-[#b71c1c] mb-4 ${hFont}`}>
                  Coming Soon
                </p>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[1.1] mb-4 ${hFont}`}>
                  Get Notified When We Go Live
                </h1>
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-md mx-auto">
                  The Real American Grit Scaling System is almost here. Drop your info
                  below and be the first to know when doors open.
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full h-12 rounded-xl bg-white/[0.06] border border-white/10 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b71c1c]/50 focus:border-[#b71c1c]/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    className="w-full h-12 rounded-xl bg-white/[0.06] border border-white/10 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b71c1c]/50 focus:border-[#b71c1c]/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full h-12 rounded-xl bg-white/[0.06] border border-white/10 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b71c1c]/50 focus:border-[#b71c1c]/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Company Name <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Smith Plumbing LLC"
                    className="w-full h-12 rounded-xl bg-white/[0.06] border border-white/10 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#b71c1c]/50 focus:border-[#b71c1c]/50 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 rounded-full bg-[#b71c1c] text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#d32f2f] active:bg-[#9a0007] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${hFont}`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Submit & Verify Email <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-600 mt-6">
                We&rsquo;ll send a verification code to confirm your email. No spam, ever.
              </p>
            </div>
          )}

          {/* ── Step: Enter Code ── */}
          {step === "verify" && (
            <div>
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-full bg-[#b71c1c]/20 flex items-center justify-center mx-auto mb-5">
                  <ShieldCheck className="w-8 h-8 text-[#b71c1c]" />
                </div>
                <h2 className={`text-2xl sm:text-3xl font-black tracking-[-0.02em] mb-3 ${hFont}`}>
                  Check Your Email
                </h2>
                <p className="text-base text-gray-400 leading-relaxed">
                  We sent a verification code to{" "}
                  <span className="text-white font-medium">{email}</span>.
                  <br />
                  Enter it below to confirm your spot.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full h-14 rounded-xl bg-white/[0.06] border border-white/10 px-4 text-center text-2xl font-bold text-white tracking-[0.3em] placeholder:text-gray-600 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#b71c1c]/50 focus:border-[#b71c1c]/50 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 rounded-full bg-[#b71c1c] text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#d32f2f] active:bg-[#9a0007] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${hFont}`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Confirm & Get Notified <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer underline underline-offset-2"
                >
                  Didn&rsquo;t get it? Resend code
                </button>
                <span className="mx-3 text-gray-700">·</span>
                <button
                  type="button"
                  onClick={() => { setStep("info"); setCode(""); setError(""); }}
                  className="text-sm text-gray-500 hover:text-white transition-colors duration-200 cursor-pointer underline underline-offset-2"
                >
                  Change email
                </button>
              </div>
            </div>
          )}

          {/* ── Step: Done ── */}
          {step === "done" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#1a3a6b]/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h2 className={`text-3xl sm:text-4xl font-black tracking-[-0.02em] mb-4 ${hFont}`}>
                You&rsquo;re On the List.
              </h2>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-sm mx-auto mb-8">
                We&rsquo;ll email you at <span className="text-white font-medium">{email}</span> the
                moment the Scaling System goes live. Stay ready.
              </p>
              <a
                href="/"
                className={`inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-base font-medium text-gray-300 hover:bg-white/10 transition-colors duration-200 cursor-pointer ${hFont}`}
              >
                Back to Home
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#b71c1c]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#1a3a6b]" />
      </div>
    </div>
  );
}
