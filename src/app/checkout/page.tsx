import { Check, ShieldCheck, Lock } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";

const hFont = "font-[family-name:var(--font-bebas)]";

const INCLUDES = [
  "Full Scaling System course (pricing, hiring, sales, systems)",
  "Live monthly group coaching with Tom & Trent",
  "Private community of 7-figure home service owners",
  "Sales scripts, SOPs & hiring templates — plug & play",
  "Monthly access — cancel anytime",
];

export default function CheckoutPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0B2341] text-white">
      {/* Top tricolor stripe */}
      <div className="h-1 flex" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      {/* Minimal header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-[72px]">
          <a href="/coaching" className="flex items-center gap-2.5" aria-label="Home">
            <div className="w-10 h-10 rounded-full bg-[#BF0A30] flex items-center justify-center">
              <span className={`text-sm font-black text-white tracking-[0.05em] ${hFont}`}>RAG</span>
            </div>
            <span className={`font-extrabold text-base tracking-[0.05em] text-white ${hFont}`}>
              REAL AMERICAN GRIT
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Background glow */}
      <div className="relative overflow-hidden">
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#BF0A30]/[0.05] rounded-full blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* ─── LEFT: Pitch ─── */}
            <div>
              <p className={`uppercase text-xs font-bold tracking-[0.2em] text-gray-400 mb-4 ${hFont}`}>
                Led by the President of ServiceTitan &amp; the #1 home services sales rep
              </p>

              <h1
                className={`text-[2rem] sm:text-4xl md:text-5xl font-black tracking-[0.05em] leading-[1.05] mb-5 ${hFont}`}
              >
                Take Your Home Service Company{" "}
                <span className="text-[#BF0A30]">Past 7 Figures.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8">
                The proven playbook for plumbing, HVAC, roofing, and home service
                owners ready to stop being the bottleneck and start running a real
                company. Pricing, hiring, sales, systems — built for guys who wear
                boots to work.
              </p>

              {/* What's included */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8">
                <p className={`text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 ${hFont}`}>
                  What you get
                </p>
                <ul className="space-y-3">
                  {INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-gray-200">
                      <Check className="w-5 h-5 text-[#BF0A30] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price block */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-gray-500 line-through text-xl">$1,997</span>
                <span className={`text-4xl sm:text-5xl font-black text-white ${hFont}`}>
                  $997
                </span>
                <span className="text-gray-400 text-base">/ month</span>
              </div>
              <p className="text-sm text-[#BF0A30] font-semibold mb-6">
                Limited launch pricing — ends May 31
              </p>

              {/* Trust row */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                30-day money-back guarantee · Secured by Stripe
              </div>
            </div>

            {/* ─── RIGHT: Checkout ─── */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-[#0f1d32] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <h2 className={`text-xl sm:text-2xl font-black mb-1 ${hFont}`}>
                  Get Instant Access
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Enter your info to enroll. Login details sent immediately.
                </p>
                <CheckoutForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="h-1 flex" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>
    </div>
  );
}
