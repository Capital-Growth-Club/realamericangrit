"use client";

import { useEffect } from "react";
import {
  Calendar,
  MapPin,
  Lock,
  Target,
  Compass,
  Handshake,
} from "lucide-react";
import EventCheckoutForm from "@/components/EventCheckoutForm";

const hFont = "font-[family-name:var(--font-bebas)]";
const gold = "#E3B23C";

/* Scroll reveal — same pattern used elsewhere on the site */
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

const PILLARS = [
  {
    icon: Compass,
    title: "Business Planning",
    detail:
      "Sit down with Tom and put your actual operation on the table — structure, roles, the bottlenecks only an outside operator catches.",
  },
  {
    icon: Target,
    title: "Goal Planning",
    detail:
      "Leave with a concrete plan for the next 12 months, not a vague pep talk — the specific numbers and moves that get you there.",
  },
  {
    icon: Handshake,
    title: "Sales Workshop",
    detail:
      "Hands-on work on how you sell, price, and close — the same approach behind a $150M+ home service business.",
  },
];

export default function Mastermind() {
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
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#BF0A30]/30 bg-[#BF0A30]/[0.1] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
            Private In-Person Mastermind
          </p>
          <h1
            className={`${hFont} mx-auto mt-5 max-w-2xl text-5xl font-black leading-[0.95] tracking-[0.04em] sm:text-6xl md:text-7xl`}
          >
            Two Days With{" "}
            <span style={{ color: gold }}>Tom Howard</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Business planning, goal planning, and a hands-on sales workshop
            &mdash; in person, at Tom&rsquo;s own residence. Bring your
            operation. Leave with a plan.
          </p>

          {/* Date / location strip */}
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 text-sm text-white/70 sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" style={{ color: gold }} />
              Nov 2&ndash;3, 2026 &middot; 8:00 AM PDT
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" style={{ color: gold }} />
              Las Vegas, Nevada
            </span>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Exact address sent to registered attendees only.
          </p>
          <p
            className="mt-4 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: gold }}
          >
            Limited To 15 Seats
          </p>

          <a
            href="#reserve"
            className={`${hFont} mt-4 inline-flex h-[64px] items-center justify-center gap-2 rounded-full bg-[#BF0A30] px-12 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
          >
            Reserve My Seat &mdash; From $4,500
          </a>
        </div>
      </section>

      {/* ── WHAT THIS IS ── */}
      <section className="border-t border-white/[0.06] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
            Two Days, Three Focus Areas
          </p>
          <h2
            className={`${hFont} mt-2 text-center text-4xl font-black tracking-[0.04em] sm:text-5xl`}
          >
            What The Two Days Cover
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Stagger key={p.title} i={i}>
                <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "#BF0A301A" }}
                  >
                    <p.icon className="h-5 w-5 text-[#BF0A30]" strokeWidth={2} />
                  </span>
                  <p className="mt-4 text-[1.1rem] font-bold leading-snug text-white">
                    {p.title}
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-white/65">
                    {p.detail}
                  </p>
                </div>
              </Stagger>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IN PERSON ── */}
      <section className="border-t border-white/[0.06] px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={`${hFont} text-3xl font-black tracking-[0.04em] sm:text-4xl`}
          >
            Why This Isn&rsquo;t Another Zoom Call
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            This runs at Tom&rsquo;s own residence, in person, over two full
            days &mdash; not a webinar, not a breakout room. You&rsquo;re in
            the room with him, working your actual numbers and your actual
            plan, not a generic slide deck.
          </p>
        </div>
      </section>

      {/* ── RESERVE ── */}
      <section
        id="reserve"
        className="relative overflow-hidden border-t border-white/[0.06] px-5 py-14 sm:py-20"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.07] blur-[140px]"
          style={{ background: gold }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-lg">
          <div className="relative rounded-3xl bg-[#0f1d32] p-7 shadow-2xl shadow-black/40 sm:p-10">
            <div className="flex items-baseline justify-center gap-2">
              <span className={`${hFont} text-4xl font-black sm:text-5xl`}>
                $4,500
              </span>
              <span className="text-base font-medium text-white/45">
                starting price
              </span>
            </div>
            <p className="mb-6 mt-1 text-center text-sm text-white/45">
              2-Day Business &amp; Sales Mastermind with Tom Howard
            </p>

            <ul className="mb-6 space-y-2">
              {[
                "Limited to 15 seats",
                "Two full days, in person, at Tom's own residence",
                "Business planning + a 12-month goal plan built with Tom",
                "Hands-on sales workshop",
                "Nov 2–3, 2026 · 8:00 AM PDT · Las Vegas, NV",
                "Exact address sent after registration",
                "Bringing a guest? Choose “Me + 1 Guest” below",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#BF0A30]">
                    <svg
                      className="h-2.5 w-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p className="text-sm text-white/65">{item}</p>
                </li>
              ))}
            </ul>

            <div className="mb-6 h-px bg-white/10" />

            <EventCheckoutForm />
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-white/35">
            <Lock className="h-3 w-3" />
            Questions? Email info@realamericangrit.com
          </p>
        </div>
      </section>

      {/* Bottom tricolor */}
      <div className="flex h-1" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>
    </div>
  );
}
