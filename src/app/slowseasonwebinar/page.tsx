import type { Metadata } from "next";
import { Check, CalendarDays, Clock, Wrench } from "lucide-react";
import WebinarRegisterForm from "@/components/WebinarRegisterForm";

const hFont = "font-[family-name:var(--font-bebas)]";

export const metadata: Metadata = {
  title: "Break Out Of The Slow Season — Free Live Webinar (Sept 3)",
  description:
    "A free live training for home service owners: the sales & marketing plays that keep the calendar full through the slow season. Thursday, September 3rd at 12:00 PM PT.",
  robots: { index: false, follow: false },
};

type Point = { title: string; detail: string };

const SALES_POINTS: Point[] = [
  {
    title: "Book Every Call — At A Higher Ticket",
    detail:
      "Turn fewer inbound calls into more booked, higher-dollar jobs so a quiet phone still fills the schedule.",
  },
  {
    title: "Wake Up Dead Leads & Past Customers",
    detail:
      "A simple follow-up system that pulls revenue straight out of the database you already have.",
  },
  {
    title: "Protect Your Margin Without Discounting",
    detail:
      "Offer and pricing structures that keep profit intact while everyone else races to the bottom.",
  },
  {
    title: "Close Premium Work On Every Visit",
    detail:
      "The in-home conversations that sell the bigger job — no “it's the slow season” excuses.",
  },
  {
    title: "Turn Your Techs Into Sellers",
    detail:
      "Keep your team generating revenue instead of just running calls when the board gets thin.",
  },
];

const MARKETING_POINTS: Point[] = [
  {
    title: "Fill The Calendar For Cheap",
    detail:
      "Low-cost campaigns built to book jobs in your slowest weeks — without torching your budget.",
  },
  {
    title: "Stay Top-Of-Mind With Past Customers",
    detail:
      "Simple touches that make sure they call you first — not a competitor — when work comes up.",
  },
  {
    title: "Create Demand Without Killing Price",
    detail:
      "Promotions that pull work forward now without training customers to wait around for a deal.",
  },
  {
    title: "Ad Angles That Actually Book Jobs",
    detail:
      "The off-season hooks and content that turn attention into booked appointments — not just likes.",
  },
  {
    title: "Build A Pipeline Before You Need It",
    detail:
      "Set up demand now so you hit the busy season with momentum instead of a cold start.",
  },
];

function Bullets({ points }: { points: Point[] }) {
  return (
    <ul className="space-y-5">
      {points.map((p) => (
        <li key={p.title} className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BF0A30]">
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          </span>
          <div>
            <p className="text-[1.08rem] font-bold leading-snug text-[#0B2341]">
              {p.title}
            </p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-slate-600">
              {p.detail}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function SlowSeasonWebinar() {
  return (
    <div className="min-h-[100dvh] bg-white text-[#0B2341]">
      {/* Top tricolor */}
      <div className="flex h-1" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      {/* ── HERO / REGISTER ── */}
      <section
        id="register"
        className="relative overflow-hidden scroll-mt-4 bg-gradient-to-b from-[#F4F7FB] to-white px-5 pb-16 pt-12 sm:pt-16"
      >
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#BF0A30]/25 bg-[#BF0A30]/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
            <Wrench className="h-3.5 w-3.5" />
            HVAC Business Owners
          </p>
          <h1
            className={`${hFont} mx-auto mt-5 max-w-2xl text-5xl font-black leading-[0.95] tracking-[0.04em] text-[#0B2341] sm:text-6xl md:text-7xl`}
          >
            Register Free To Steal The $150M Slow-Season Playbook — Built For
            $2&ndash;10M HVAC Shops
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 sm:text-xl">
            A free live training for $2&ndash;10M HVAC business owners — the
            exact sales
            &amp; marketing plays behind a $150M operation, built for your slow
            season.
          </p>

          {/* date/time chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#BF0A30]" />
              Thursday, September 3rd
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#BF0A30]" />
              12:00 PM PT
            </span>
          </div>

          {/* the form is the hero */}
          <div className="mx-auto mt-8 max-w-md">
            <WebinarRegisterForm />
          </div>
        </div>
      </section>

      {/* ── SALES ── */}
      <section className="border-t border-slate-100 bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div className="flex justify-center md:justify-start">
            <img
              src="/sales-playbook.webp"
              alt="Sales Playbook"
              width={1000}
              height={1000}
              loading="lazy"
              className="w-full max-w-[340px]"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
              What We&apos;ll Cover For Sales
            </p>
            <h2
              className={`${hFont} mt-2 text-4xl font-black tracking-[0.04em] text-[#0B2341] sm:text-5xl`}
            >
              The $19.6 Million Slow Season Sales Process
            </h2>
            <div className="mt-6">
              <Bullets points={SALES_POINTS} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARKETING ── */}
      <section className="border-t border-slate-100 bg-[#F6F8FB] px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          {/* image second in DOM but first on desktop for alternation */}
          <div className="flex justify-center md:order-2 md:justify-end">
            <img
              src="/marketing-playbook.webp"
              alt="Marketing Playbook"
              width={1000}
              height={1000}
              loading="lazy"
              className="w-full max-w-[340px]"
            />
          </div>
          <div className="md:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
              What We&apos;ll Cover For Marketing
            </p>
            <h2
              className={`${hFont} mt-2 text-4xl font-black tracking-[0.04em] text-[#0B2341] sm:text-5xl`}
            >
              The Slow Season Marketing System
            </h2>
            <div className="mt-6">
              <Bullets points={MARKETING_POINTS} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-t border-slate-100 bg-white px-5 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-xl">
          <h2
            className={`${hFont} text-4xl font-black leading-none tracking-[0.04em] text-[#0B2341] sm:text-5xl`}
          >
            Don&apos;t Let This Slow Season Look Like The Last One
          </h2>
          <p className="mt-4 text-slate-600">
            Join us live on Thursday, September 3rd at 12:00 PM PT. It&apos;s
            free — but seats are limited.
          </p>
          <a
            href="#register"
            className={`${hFont} mt-7 inline-flex h-[62px] items-center justify-center rounded-full bg-[#BF0A30] px-10 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/20 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
          >
            Register For The Live Event
          </a>
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
