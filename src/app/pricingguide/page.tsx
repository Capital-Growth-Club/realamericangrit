"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Hammer,
  Droplet,
  Zap,
  PaintRoller,
  Home as HomeIcon,
  Wrench,
  Settings,
  Percent,
  Clock,
  Calculator,
  Timer,
  Store,
  Gauge,
} from "lucide-react";
import PricingGuideModal from "@/components/PricingGuideModal";

const hFont = "font-[family-name:var(--font-bebas)]";
const gold = "#E3B23C";

/* Scroll reveal — same pattern used on the homepage */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-fade:not(.visible)");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function Stagger({
  children,
  i,
  className = "",
}: {
  children: React.ReactNode;
  i: number;
  className?: string;
}) {
  return (
    <div className={`section-fade ${className}`} data-d={i < 5 ? i : 4}>
      {children}
    </div>
  );
}

type Point = { title: string; detail: string; icon: typeof Percent };
type Trade = { icon: typeof Hammer; label: string };

const TRADES: Trade[] = [
  { icon: Hammer, label: "HVAC" },
  { icon: Droplet, label: "Plumbing" },
  { icon: Zap, label: "Electrical" },
  { icon: PaintRoller, label: "Painting" },
  { icon: HomeIcon, label: "Roofing" },
  { icon: Wrench, label: "Remodeling" },
  { icon: Settings, label: "And More" },
];

const POINTS: Point[] = [
  {
    title: "Marked It Up 50% — Made Only 33%",
    detail:
      "The denominator mistake quietly putting contractors underwater on every single job.",
    icon: Percent,
  },
  {
    title: "Busy All Day, Broke All Year",
    detail:
      "Full schedule, good techs, phones ringing — and still losing money. The leak isn't sales. It's your price book.",
    icon: Clock,
  },
  {
    title: "The Number That Reprices Everything",
    detail:
      "Gross profit per man-day — how to load real overhead onto every job so you price to a net number, not a hopeful one.",
    icon: Calculator,
  },
  {
    title: "You're Not Getting 8 Billable Hours",
    detail:
      "Why real billable efficiency is closer to 50% — and how ignoring it silently doubles your true labor cost.",
    icon: Timer,
  },
  {
    title: "The Small-Shop Myth",
    detail:
      "Why “my overhead is low, so I charge less” is backwards — and why small shops usually need to charge more.",
    icon: Store,
  },
  {
    title: "Fast Jobs Cheaper, Slow Jobs Pricier",
    detail:
      "The counterintuitive correction that ends the busy-but-broke trap and fixes your whole price book.",
    icon: Gauge,
  },
];

function GuideCover() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/pricing-guide-cover.png"
      alt="The Home Service Pricing Guide So You Actually Make Money"
      width={1145}
      height={1374}
      className="mx-auto w-full max-w-[380px] md:max-w-[520px]"
    />
  );
}

export default function PricingGuide() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  useReveal();

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
              Free Guide · Every Home Service Trade
            </p>
            <h1
              className={`${hFont} mt-5 text-5xl font-black leading-[0.95] tracking-[0.04em] sm:text-6xl md:text-7xl`}
            >
              The Home Service Pricing Guide So You Actually{" "}
              <span style={{ color: gold }}>Make Money</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-white/70 md:mx-0">
              The contractor&rsquo;s guide to pricing home service work the
              right way &mdash; HVAC, plumbing, electrical, painting, roofing,
              remodeling, and more &mdash; from Tom Howard, the operator
              behind a $150M+ home service business.
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

      {/* ── TRADES STRIP ── */}
      <section className="border-t border-white/[0.06] px-5 py-10">
        <p
          className="text-center text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: gold }}
        >
          Built For Every Trade
        </p>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-6">
          {TRADES.map((t) => (
            <div key={t.label} className="flex w-16 flex-col items-center gap-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20">
                <t.icon className="h-5 w-5 text-white/80" strokeWidth={1.75} />
              </span>
              <span className="text-center text-[0.65rem] font-semibold uppercase tracking-wide text-white/55">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S INSIDE ── */}
      <section className="relative overflow-hidden border-t border-white/[0.06] px-5 py-14 sm:py-20">
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-[130px]"
          style={{ background: gold }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
            Inside The Guide
          </p>
          <h2
            className={`${hFont} mt-2 text-center text-4xl font-black tracking-[0.04em] sm:text-5xl`}
          >
            What You&rsquo;ll Walk Away With
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {POINTS.map((p, i) => {
              const accent = i % 2 === 0 ? "#BF0A30" : gold;
              return (
                <Stagger key={p.title} i={i}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                    <span
                      className={`${hFont} pointer-events-none absolute -right-1 -top-3 select-none text-7xl font-black leading-none text-white/[0.06] transition-colors duration-300`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="relative flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${accent}1A` }}
                    >
                      <p.icon
                        className="h-5 w-5"
                        style={{ color: accent }}
                        strokeWidth={2}
                      />
                    </span>
                    <p className="relative mt-4 text-[1.1rem] font-bold leading-snug text-white">
                      {p.title}
                    </p>
                    <p className="relative mt-2 text-[0.95rem] leading-relaxed text-white/65">
                      {p.detail}
                    </p>
                    <span
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                      style={{ backgroundColor: accent }}
                      aria-hidden="true"
                    />
                  </div>
                </Stagger>
              );
            })}
          </div>

          <div className="mt-14 text-center">
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
