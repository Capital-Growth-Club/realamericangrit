"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock, Palette } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";

const hFont = "font-[family-name:var(--font-bebas)]";

type Tier = "essentials" | "standard" | "white-label";

const PLANS: {
  tier: Tier;
  label: string;
  name: string;
  tagline: string;
  price: string;
  popular?: boolean;
  dark?: boolean;
  bullets: string[];
  cta: string;
}[] = [
  {
    tier: "essentials",
    label: "ESSENTIALS",
    name: "The Core Library",
    tagline: "Standard library, minus the AI role-playing module.",
    price: "$549",
    bullets: [
      "All 9 department curricula",
      "Quizzes + certificates per course",
      "Owner dashboard with progress tracking",
      "23-day Sales Huddle Series",
      "Quarterly content drops",
      "Does not include the AI role-playing module",
    ],
    cta: "Start With Essentials",
  },
  {
    tier: "standard",
    label: "STANDARD",
    name: "The Full Library",
    tagline: "Every department. Every operator on your team.",
    price: "$997",
    popular: true,
    bullets: [
      "All 9 department curricula",
      "Includes the AI sales role-playing module",
      "Quizzes + certificates per course",
      "Owner dashboard with progress tracking",
      "23-day Sales Huddle Series",
      "Quarterly content drops",
      "Lock in $997/m before it goes to $1,497/m",
    ],
    cta: "Get Started — $997/m",
  },
  {
    tier: "white-label",
    label: "WHITE-LABEL",
    name: "Make It Yours",
    tagline: "Everything in Standard — fully rebranded as your own.",
    price: "$1,497",
    dark: true,
    bullets: [
      "Everything in Standard",
      "Certificates issued under your company name",
      "Training portal branded as your operation",
      "Looks like the entire system was built in-house",
      "Use it as a recruiting and retention edge",
      "Lock in $1,497/m before it goes to $1,997/m",
    ],
    cta: "Make It Yours — $1,497/m",
  },
];

export default function CheckoutPage() {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<Tier>("standard");
  const choose = (t: Tier) => {
    setTier(t);
    setOpen(true);
  };

  return (
    <div className="min-h-[100dvh] bg-white text-[#0B2341] flex flex-col">
      <CheckoutModal open={open} onClose={() => setOpen(false)} tier={tier} />

      {/* Top tricolor stripe */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#1a3a6b]" />
      </div>

      {/* Slim header */}
      <header className="bg-[#0B2341]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-[68px]">
          <Link href="/" className="flex items-center" aria-label="Real American Grit — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
              alt="Real American Grit University"
              className="h-10 w-auto"
            />
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            Secure Checkout
          </div>
        </div>
      </header>

      {/* ─── HERO: bundle image, no video ─── */}
      <section className="pt-10 sm:pt-14 pb-2">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/9-figure-bundle.webp"
            alt="The 9-Figure Operator's Playbooks — complete bundle"
            className="w-full max-w-xl mx-auto h-auto mb-8"
          />
          <p className={`text-sm sm:text-base font-black uppercase tracking-[0.3em] text-[#BF0A30] mb-3 ${hFont}`}>
            You&rsquo;re one step away
          </p>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.04em] leading-[1.03] mb-4 ${hFont}`}>
            Choose your plan.
          </h1>
          <p className="text-lg text-[#475569] max-w-lg mx-auto leading-relaxed">
            <span className="line-through text-[#475569]/60">$64,973</span> a la carte. From <span className="text-[#BF0A30] font-semibold">$549/m</span>{" "}with us &mdash; one library, three ways to roll it out.
          </p>
        </div>
      </section>

      {/* ─── SELECT YOUR OPTION ─── */}
      <section className="pt-10 sm:pt-12 pb-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-3">
            {PLANS.map((p) => (
              <div
                key={p.tier}
                className={`relative rounded-2xl p-8 border-2 flex flex-col ${
                  p.dark
                    ? "bg-[#0B2341] text-white border-white/10"
                    : p.popular
                      ? "bg-[#EDEDED] border-[#BF0A30] shadow-xl md:-mt-3 md:mb-3"
                      : "bg-[#EDEDED] border-gray-200"
                }`}
              >
                {p.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#BF0A30] text-white px-5 sm:px-6 py-1 sm:py-1.5 rounded-full shadow-lg shadow-[#BF0A30]/30 whitespace-nowrap">
                    <p className={`text-sm sm:text-base font-bold tracking-[0.25em] pl-[0.25em] ${hFont}`}>MOST POPULAR</p>
                  </div>
                )}

                {p.dark ? (
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-[#BF0A30]" aria-hidden="true" />
                    <p className={`text-base sm:text-lg font-black text-[#BF0A30] tracking-[0.25em] ${hFont}`}>{p.label}</p>
                  </div>
                ) : (
                  <p className={`text-base sm:text-lg font-black text-[#BF0A30] tracking-[0.25em] mb-2 ${hFont}`}>{p.label}</p>
                )}

                <h3 className={`font-black text-3xl sm:text-4xl mb-1 ${p.dark ? "" : "text-[#0B2341]"} ${hFont}`}>{p.name}</h3>
                <p className={`text-base sm:text-lg mb-5 ${p.dark ? "text-gray-400" : "text-[#475569]"}`}>{p.tagline}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-5xl font-black ${p.dark ? "" : "text-[#0B2341]"} ${hFont}`}>{p.price}</span>
                  <span className={`text-base font-medium ${p.dark ? "text-gray-400" : "text-[#475569]"}`}>/m</span>
                </div>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {p.bullets.map((item, j) => (
                    <li key={j} className={`flex items-start gap-2.5 text-base ${p.dark ? "text-gray-400" : "text-[#475569]"}`}>
                      <Check className={`shrink-0 mt-1 w-4 h-4 ${p.dark ? "text-[#BF0A30]" : "text-[#0B2341]"}`} strokeWidth={3} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => choose(p.tier)}
                  className={`w-full h-[58px] rounded-full text-lg font-bold tracking-[0.04em] cursor-pointer transition-colors duration-200 ${hFont} ${
                    p.popular
                      ? "bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] pulse-red"
                      : p.dark
                        ? "border-2 border-white/30 text-white hover:bg-white/10"
                        : "border-2 border-[#BF0A30] text-[#BF0A30] hover:bg-[#BF0A30] hover:text-white"
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-3 mt-10 text-sm text-[#475569]">
            <span className="inline-flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#BF0A30]" aria-hidden="true" />
              Secured by Stripe · Cancel anytime
            </span>
          </div>
          <p className="text-center text-sm text-[#475569] mt-4">
            Lock in your launch rate today &mdash; the price you join at is the price you keep.
          </p>
        </div>
      </section>

      {/* Bottom tricolor */}
      <div className="h-1 flex shrink-0 mt-auto" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#1a3a6b]" />
      </div>
    </div>
  );
}
