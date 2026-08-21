"use client";

import { useState } from "react";
import { Check, Download } from "lucide-react";
import PricingGuideModal from "@/components/PricingGuideModal";

const hFont = "font-[family-name:var(--font-bebas)]";

type Point = { title: string; detail: string };

const POINTS: Point[] = [
  {
    title: "Marked It Up 50% — Made Only 33%",
    detail:
      "The denominator mistake quietly putting contractors underwater on every single job.",
  },
  {
    title: "Busy All Day, Broke All Year",
    detail:
      "Full schedule, good techs, phones ringing — and still losing money. The leak isn't sales. It's your price book.",
  },
  {
    title: "The Number That Reprices Everything",
    detail:
      "Gross profit per man-day — how to load real overhead onto every job so you price to a net number, not a hopeful one.",
  },
  {
    title: "You're Not Getting 8 Billable Hours",
    detail:
      "Why real billable efficiency is closer to 50% — and how ignoring it silently doubles your true labor cost.",
  },
  {
    title: "The Small-Shop Myth",
    detail:
      "Why “my overhead is low, so I charge less” is backwards — and why small shops usually need to charge more.",
  },
  {
    title: "Fast Jobs Cheaper, Slow Jobs Pricier",
    detail:
      "The counterintuitive correction that ends the busy-but-broke trap and fixes your whole price book.",
  },
];

function GuideCover() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/pricing-guide-cover.png"
      alt="The HVAC & Plumbers Pricing Guide"
      width={1254}
      height={1254}
      className="mx-auto w-full max-w-[380px]"
    />
  );
}

export default function PricingGuide() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-[100dvh] bg-[#0B2341] text-white">
      {/* Top tricolor */}
      <div className="flex h-1" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      {/* Logo */}
      <div className="flex justify-center pt-8 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
          alt="Real American Grit University"
          className="h-11 w-auto"
        />
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-5 pb-14 pt-8 sm:pt-12">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.07] blur-[150px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          {/* Cover */}
          <div className="order-1 md:order-2">
            <GuideCover />
          </div>

          {/* Copy + CTA */}
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#BF0A30]/30 bg-[#BF0A30]/[0.1] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Free Guide · HVAC &amp; Plumbing
            </p>
            <h1
              className={`${hFont} mt-5 text-5xl font-black leading-[0.95] tracking-[0.04em] sm:text-6xl md:text-7xl`}
            >
              The HVAC &amp; Plumbers Pricing Guide So You Actually Make Money
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-white/70 md:mx-0">
              The contractor&rsquo;s guide to pricing HVAC &amp; plumbing work
              the right way &mdash; from Tom Howard, the operator behind a
              $150M+ home service business.
            </p>

            <button
              type="button"
              onClick={openModal}
              className={`${hFont} mt-8 inline-flex h-[64px] items-center justify-center gap-2 rounded-full bg-[#BF0A30] px-12 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
            >
              <Download className="h-6 w-6" strokeWidth={2.5} />
              Download Now
            </button>
            <p className="mt-3 text-sm text-white/45">
              Instant access · No cost · Takes 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="border-t border-white/[0.06] px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
            Inside The Guide
          </p>
          <h2
            className={`${hFont} mt-2 text-center text-4xl font-black tracking-[0.04em] sm:text-5xl`}
          >
            What You&rsquo;ll Walk Away With
          </h2>

          <ul className="mt-9 space-y-6">
            {POINTS.map((p) => (
              <li key={p.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BF0A30]">
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-[1.08rem] font-bold leading-snug text-white">
                    {p.title}
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-white/65">
                    {p.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={openModal}
              className={`${hFont} inline-flex h-[62px] items-center justify-center gap-2 rounded-full bg-[#BF0A30] px-12 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
            >
              <Download className="h-5 w-5" strokeWidth={2.5} />
              Download The Guide
            </button>
            <p className="mt-4 text-sm text-white/45">
              By Tom Howard · Real American Grit University
            </p>
          </div>
        </div>
      </section>

      {/* Bottom tricolor */}
      <div className="flex h-1" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <PricingGuideModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
