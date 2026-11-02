import type { Metadata } from "next";
import { Check, CalendarDays, Clock, ArrowDown } from "lucide-react";
import WebinarRegisterFormAcquisition from "@/components/WebinarRegisterFormAcquisition";

const hFont = "font-[family-name:var(--font-bebas)]";

export const metadata: Metadata = {
  title: "Free Home Service Acquisition Webinar — Dec 2",
  description:
    "The $0 Acquisition: how home service owners grow by buying, not building. A free live training for $2M+ home service owners. Wednesday, December 2 at 12:00 PM PT.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Free Home Service Acquisition Webinar — Dec 2",
    description:
      "How Tom buys the competitor down the street for close to $0 — the home service roll-up playbook for $2M+ owners. Register free.",
    url: "https://www.realamericangrit.com/acquisitionwebinar",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "Free Home Service Acquisition Webinar — Real American Grit University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Home Service Acquisition Webinar — Dec 2",
    description:
      "How Tom buys the competitor down the street for close to $0. Register free.",
    images: ["/og-bundle.jpg"],
  },
};

type Point = { title: string; detail: string };

const TARGET_POINTS: Point[] = [
  {
    title: "Spot An Owner Who's Actually Ready To Sell",
    detail:
      "The signals that tell you someone's close to retiring or burned out — before they ever list the business.",
  },
  {
    title: "Weight Recurring Revenue Over One-Off Jobs",
    detail:
      "Why a service-agreement base is worth more than a shop that lives job to job, and how to tell the difference fast.",
  },
  {
    title: "Check The Reputation Before You Check The Books",
    detail:
      "A bad name follows the business into yours. How to vet reputation before you ever get to the financials.",
  },
  {
    title: "Make Sure The Team Actually Stays",
    detail:
      "The techs, the CSRs, the relationships — the real asset in most acquisitions, and how to keep them through the transition.",
  },
  {
    title: "Match The Trade And The Territory",
    detail:
      "Why a shop that fits your existing footprint integrates in weeks, and one that doesn't can take years.",
  },
];

const DEAL_POINTS: Point[] = [
  {
    title: "Get The Seller Paid Out Of The Business, Not Your Pocket",
    detail:
      "How seller financing and earn-outs let you structure a deal so the business pays for itself over time.",
  },
  {
    title: "Know What Terms To Watch For",
    detail:
      "The fine print in financing and earn-out terms that decides whether the deal is actually a good one.",
  },
  {
    title: "Win The First 90 Days",
    detail:
      "The window where most roll-ups succeed or fail — merging pricing, sales process, and operations fast.",
  },
  {
    title: "Keep The Customers And The Trucks Running",
    detail:
      "Don't disrupt what's already working on day one. What to leave alone and what to fix first.",
  },
  {
    title: "Train The New Team Your Way From Day One",
    detail:
      "Why integration is where most roll-ups die, and how to get a new team running your standard without living in training mode.",
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

export default function AcquisitionWebinar() {
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
            <ArrowDown className="h-3.5 w-3.5" />
            Free Home Service Roll-Up Webinar
            <ArrowDown className="h-3.5 w-3.5" />
          </p>
          <h1
            className={`${hFont} mx-auto mt-5 max-w-2xl text-5xl font-black leading-[0.95] tracking-[0.04em] text-[#0B2341] sm:text-6xl md:text-7xl`}
          >
            Register Free To Steal Tom&apos;s $0 Home Service Roll-Up
            Playbook
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 sm:text-xl">
            A free live training for $2M+ home service owners — how Tom buys
            the competitor down the street for close to $0, and makes it
            profitable fast.
          </p>

          {/* date/time chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#BF0A30]" />
              Wednesday, December 2nd
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#BF0A30]" />
              12:00 PM PT
            </span>
          </div>

          {/* the form is the hero */}
          <div className="mx-auto mt-8 max-w-md">
            <WebinarRegisterFormAcquisition />
          </div>
        </div>
      </section>

      {/* ── WHICH SHOP TO BUY ── */}
      <section className="border-t border-slate-100 bg-white px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div className="flex justify-center md:justify-start">
            <img
              src="/acquisitions-playbook.webp"
              alt="Acquisitions Playbook"
              width={1000}
              height={1000}
              loading="lazy"
              className="w-full max-w-[340px]"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
              What We&apos;ll Cover: Picking The Target
            </p>
            <h2
              className={`${hFont} mt-2 text-4xl font-black tracking-[0.04em] text-[#0B2341] sm:text-5xl`}
            >
              The Checklist Behind 40+ Acquisitions
            </h2>
            <div className="mt-6">
              <Bullets points={TARGET_POINTS} />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW THE DEAL GETS STRUCTURED ── */}
      <section className="border-t border-slate-100 bg-[#F6F8FB] px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          {/* image second in DOM but first on desktop for alternation */}
          <div className="flex justify-center md:order-2 md:justify-end">
            <img
              src="/financials-playbook.webp"
              alt="Financials Playbook"
              width={1000}
              height={1000}
              loading="lazy"
              className="w-full max-w-[340px]"
            />
          </div>
          <div className="md:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#BF0A30]">
              What We&apos;ll Cover: The Deal
            </p>
            <h2
              className={`${hFont} mt-2 text-4xl font-black tracking-[0.04em] text-[#0B2341] sm:text-5xl`}
            >
              How To Structure A $0 Deal
            </h2>
            <div className="mt-6">
              <Bullets points={DEAL_POINTS} />
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
            Stop Buying Leads. Start Buying Shops.
          </h2>
          <p className="mt-4 text-slate-600">
            Join us live on Wednesday, December 2nd at 12:00 PM PT. It&apos;s
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
