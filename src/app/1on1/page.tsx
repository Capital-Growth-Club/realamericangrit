"use client";

import Script from "next/script";

const hFont = "font-[family-name:var(--font-bebas)]";

export default function Coaching() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0B2341] text-white">
      {/* Top tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      {/* Logo */}
      <div className="flex shrink-0 justify-center pt-8 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
          alt="Real American Grit University"
          className="h-12 w-auto"
        />
      </div>

      <div className="relative flex-1 overflow-hidden px-5">
        <div
          className="pointer-events-none absolute left-1/2 top-[6%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.07] blur-[150px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-3xl py-12 text-center sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#BF0A30]/30 bg-[#BF0A30]/[0.1] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Private 1-on-1 Coaching
          </p>

          <h1
            className={`${hFont} mx-auto mt-5 max-w-2xl text-5xl font-black leading-[0.95] tracking-[0.04em] sm:text-6xl md:text-7xl`}
          >
            Book A Private Coaching Call With{" "}
            <span className="text-[#BF0A30]">Tom Howard</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            One-on-one time with the operator behind a $150M+ home service
            business. Bring your numbers, your bottlenecks, and your biggest
            questions — and walk away with a clear next move. Pick a time below.
          </p>

          {/* Booking embed */}
          <div className="mx-auto mt-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40">
            <iframe
              src="https://api.leadconnectorhq.com/widget/booking/WovjWBhryK0MJbgynwPN"
              title="Book a private coaching call with Tom Howard"
              allow="payment"
              scrolling="no"
              id="WovjWBhryK0MJbgynwPN_1787333457165"
              style={{
                width: "100%",
                minHeight: "700px",
                border: "none",
                overflow: "hidden",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
