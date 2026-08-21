import type { Metadata } from "next";
import { Mail } from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";

export const metadata: Metadata = {
  title: "Check Your Email — Your Pricing Guide Is On Its Way",
  robots: { index: false, follow: false },
};

export default function PricingGuideThanks() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0B2341] text-white">
      {/* Top tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5">
        <div
          className="pointer-events-none absolute left-1/2 top-[12%] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.06] blur-[140px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-lg py-16 text-center">
          {/* Mail icon */}
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#BF0A30] shadow-xl shadow-[#BF0A30]/30">
            <Mail className="h-9 w-9 text-white" strokeWidth={2} />
          </div>

          <h1
            className={`${hFont} text-5xl font-black leading-none tracking-[0.03em] sm:text-6xl`}
          >
            Check Your Inbox.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
            Your guide is on its way. We just emailed it to you &mdash; open
            that email and tap the button inside to read it.
          </p>

          {/* Spam note */}
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-white/[0.04] p-5 text-left">
            <p className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-white/75">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BF0A30]/15">
                <Mail className="h-3.5 w-3.5 text-[#BF0A30]" />
              </span>
              <span>
                Don&rsquo;t see it in the next minute or two?{" "}
                <strong className="text-white">
                  Check your spam or promotions folder
                </strong>{" "}
                and mark it &ldquo;not spam&rdquo; so you never miss what we
                send next.
              </span>
            </p>
          </div>

          <p className="mt-10 text-sm text-white/40">
            From the Real American Grit series by Tom Howard.
          </p>
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>
    </div>
  );
}
