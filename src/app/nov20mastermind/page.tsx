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
import EventCheckoutFormNov20 from "@/components/EventCheckoutFormNov20";

const hFont = "font-[family-name:var(--font-bebas)]";
const nFont = "font-[family-name:var(--font-nostalgic-italic)]";
const mFont = "font-[family-name:var(--font-munich-black)]";
const bodyFont = "font-[family-name:var(--font-munich)]";
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
      "Leave with a written 2027 business plan and budget, not a vague pep talk — the specific numbers and moves that get you there.",
  },
  {
    icon: Handshake,
    title: "Sales Workshop",
    detail:
      "Hands-on work on how you sell, price, and close — the same systems behind Lee's Air's growth from $1.6M to $150M+.",
  },
];

export default function MastermindNov20() {
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
      <section className="relative overflow-hidden px-5 pb-12 pt-8 sm:pt-12 lg:min-h-[640px] lg:pb-0">
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.07] blur-[150px]"
          aria-hidden="true"
        />

        {/* Atmospheric photo — fades into the navy background at every
            breakpoint. Top-to-bottom fade when stacked on mobile/tablet,
            right-to-left bleed off the edge on desktop. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 h-[42vh] max-h-[380px] [mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[46%] lg:max-h-none lg:[mask-image:linear-gradient(to_left,black_55%,transparent_100%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tom-mastermind-hero.webp"
              alt=""
              className="h-full w-full object-cover object-[56%_18%] opacity-45 lg:opacity-80"
            />
          </div>
          {/* Mobile/tablet darkening so headline text stays readable over the photo */}
          <div className="absolute inset-x-0 top-0 h-[42vh] max-h-[380px] bg-gradient-to-b from-[#0B2341]/75 via-[#0B2341]/45 to-[#0B2341] lg:hidden" />
          {/* Desktop darkening for the right-bleed version */}
          <div className="absolute inset-0 hidden bg-gradient-to-t from-[#0B2341] via-transparent to-[#0B2341]/30 lg:block" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#BF0A30]/30 bg-[#BF0A30]/[0.1] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Private Mastermind &middot; Limited To 15 Seats
            </p>
            <h1
              className={`${nFont} mx-auto mt-6 max-w-xl text-4xl italic leading-[1.08] tracking-[0.01em] sm:text-5xl lg:mx-0 lg:text-[3.4rem]`}
            >
              A Private Planning Mastermind For{" "}
              <span style={{ color: gold }}>
                7 &amp; 8-Figure Home Service Owners
              </span>
            </h1>
            <p
              className={`${bodyFont} mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/70 lg:mx-0`}
            >
              Two days, 15 owners, at Tom Howard&rsquo;s own home in Las
              Vegas &mdash; business planning, your 2027 goals, and sales,
              led by the operator who took Lee&rsquo;s Air from{" "}
              <strong className="text-white">$1.6M to $150M+</strong>.
            </p>

            {/* Date / location strip */}
            <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 text-sm text-white/70 sm:flex-row sm:gap-6 lg:mx-0 lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: gold }} />
                Nov 20&ndash;21, 2026 &middot; 8:00 AM PST
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: gold }} />
                Las Vegas, Nevada
              </span>
            </div>
            <p className="mt-2 text-xs text-white/40">
              Exact address sent to registered attendees only.
            </p>

            <a
              href="#reserve"
              className={`${hFont} mt-6 inline-flex h-[64px] items-center justify-center gap-2 rounded-full bg-[#BF0A30] px-12 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
            >
              Reserve My Seat &mdash; From $4,500
            </a>
          </div>
        </div>
      </section>

      {/* ── LED BY ── */}
      <section className="border-t border-white/[0.06] px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
            Led By
          </p>
          <h2
            className={`${mFont} mt-2 text-center text-3xl uppercase tracking-[0.02em] sm:text-4xl`}
          >
            Built It. Now He Teaches It.
          </h2>

          <div className="mt-10">
            <Stagger i={0}>
              <div className="mx-auto flex max-w-md items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/tom-howard-headshot.webp"
                  alt="Tom Howard"
                  className="h-16 w-16 shrink-0 rounded-full object-cover object-top"
                />
                <div>
                  <p className="text-[1.05rem] font-bold text-white">
                    Tom Howard
                  </p>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: gold }}
                  >
                    Founder, Lee&rsquo;s Air &amp; Real American Grit University
                  </p>
                  <p className={`${bodyFont} mt-2 text-sm leading-relaxed text-white/65`}>
                    Took Lee&rsquo;s Air from $1.6M to $150M+ — known for the
                    systems and processes that get an owner out of the
                    day-to-day and into actually running the business.
                  </p>
                </div>
              </div>
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── WHAT THIS IS ── */}
      <section className="border-t border-white/[0.06] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
            Two Days, Three Focus Areas
          </p>
          <h2
            className={`${mFont} mt-2 text-center text-3xl uppercase tracking-[0.02em] sm:text-4xl`}
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
                  <p className={`${bodyFont} mt-2 text-[0.95rem] leading-relaxed text-white/65`}>
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
            className={`${mFont} text-2xl uppercase tracking-[0.02em] sm:text-3xl`}
          >
            Why This Isn&rsquo;t Another Zoom Call
          </h2>
          <p className={`${bodyFont} mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70`}>
            This runs at Tom&rsquo;s own residence, in person, over two full
            days &mdash; not a webinar, not a breakout room. You&rsquo;re in
            the room with Tom, working your actual numbers and your actual
            plan, not a generic slide deck. Meals both days are chef-cooked,
            and the work itself happens right in Tom&rsquo;s home theater.
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
                "Two full days, in person, at Tom's own home theater",
                "Business planning + a written 2027 plan and budget",
                "Hands-on sales workshop",
                "Chef-cooked meals both days",
                "Nov 20–21, 2026 · 8:00 AM PST · Las Vegas, NV",
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
                  <p className={`${bodyFont} text-sm text-white/65`}>{item}</p>
                </li>
              ))}
            </ul>

            <div className="mb-6 h-px bg-white/10" />

            <EventCheckoutFormNov20 />
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
