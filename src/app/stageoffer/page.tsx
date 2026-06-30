"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";
import HeroVideo from "@/components/HeroVideo";

const hFont = "font-[family-name:var(--font-bebas)]";

export default function StageOffer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState<
    "essentials" | "standard" | "white-label"
  >("standard");
  const openModal = (
    tier: "essentials" | "standard" | "white-label" = "standard",
  ) => {
    setModalTier(tier);
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-[100dvh] sm:h-[100dvh] bg-[#0B2341] text-white flex flex-col sm:overflow-hidden">
      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tier={modalTier}
      />

      {/* Top tricolor */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      {/* Background glow */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#BF0A30]/[0.05] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ═══ HERO HEADER ═══ */}
      <section className="relative shrink-0 px-5 sm:px-8 pt-6 sm:pt-8 text-center">
        <div className="max-w-[820px] mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
            alt="Real American Grit University"
            className="h-10 sm:h-12 w-auto mx-auto mb-4 sm:mb-5"
          />
          <p
            className={`uppercase text-[11px] sm:text-sm font-bold tracking-[0.25em] text-gray-300 mb-2 sm:mb-3 ${hFont}`}
          >
            For home service owners doing $2M – $10M
          </p>
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.05em] leading-[0.95] ${hFont}`}
          >
            Stop Being The Reason Your Company{" "}
            <span className="text-[#BF0A30]">Can&rsquo;t Grow.</span>
          </h1>
        </div>
      </section>

      {/* ═══ HERO VIDEO (centered in remaining space on desktop) ═══ */}
      <section className="relative sm:flex-1 sm:min-h-0 px-5 sm:px-8 py-6 sm:py-4 flex items-center justify-center">
        <HeroVideo
          src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/6a430a3042c4669a15dc5372.mp4"
          className="w-full max-w-md sm:max-w-lg aspect-video rounded-xl overflow-hidden shadow-[0_16px_56px_rgba(0,0,0,0.3)] relative"
        />
      </section>

      {/* ═══ THREE PURCHASE OPTIONS ═══ */}
      <section className="relative shrink-0 px-4 sm:px-8 pb-6">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Essentials */}
          <div className="relative bg-white text-[#0B2341] rounded-2xl p-6 sm:p-7 border-2 border-gray-200 flex flex-col">
            <p
              className={`text-sm sm:text-base font-black text-[#BF0A30] tracking-[0.25em] mb-2 ${hFont}`}
            >
              ESSENTIALS
            </p>
            <h3
              className={`font-black text-2xl sm:text-3xl tracking-[0.05em] mb-1 ${hFont}`}
            >
              The Core Library
            </h3>
            <p className="text-sm sm:text-base text-[#475569] mb-4">
              Standard, minus the AI role-playing module.
            </p>
            <div className="flex items-baseline gap-1 mb-5">
              <span
                className={`text-4xl sm:text-5xl font-black text-[#0B2341] ${hFont}`}
              >
                $549
              </span>
              <span className="text-sm sm:text-base text-[#475569] font-medium">
                /m
              </span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {[
                "All 9 department curricula",
                "Quizzes + certificates per course",
                "Owner dashboard + progress tracking",
                "No AI role-playing module",
              ].map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2.5 text-sm sm:text-base text-[#475569] leading-snug"
                >
                  <Check
                    className="shrink-0 mt-1 w-4 h-4 text-[#0B2341]"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openModal("essentials")}
              className={`inline-flex h-[56px] sm:h-[60px] items-center justify-center rounded-full px-6 text-lg sm:text-xl font-bold tracking-[0.05em] cursor-pointer border-2 border-[#BF0A30] text-[#BF0A30] hover:bg-[#BF0A30] hover:text-white transition-colors duration-200 w-full ${hFont}`}
            >
              Start Essentials
            </button>
          </div>

          {/* Standard */}
          <div className="relative bg-white text-[#0B2341] rounded-2xl p-6 sm:p-7 border-2 border-[#BF0A30] flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#BF0A30] text-white px-4 py-1 rounded-full">
              <p
                className={`text-xs sm:text-sm font-bold tracking-[0.25em] whitespace-nowrap ${hFont}`}
              >
                MOST POPULAR
              </p>
            </div>
            <p
              className={`text-sm sm:text-base font-black text-[#BF0A30] tracking-[0.25em] mb-2 ${hFont}`}
            >
              STANDARD
            </p>
            <h3
              className={`font-black text-2xl sm:text-3xl tracking-[0.05em] mb-1 ${hFont}`}
            >
              The Full Library
            </h3>
            <p className="text-sm sm:text-base text-[#475569] mb-4">
              Every department. Every operator on your team.
            </p>
            <div className="flex items-baseline gap-1 mb-5">
              <span
                className={`text-4xl sm:text-5xl font-black text-[#0B2341] ${hFont}`}
              >
                $997
              </span>
              <span className="text-sm sm:text-base text-[#475569] font-medium">
                /m
              </span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {[
                "All 9 department curricula",
                "Includes AI sales role-playing",
                "Quizzes + certificates per course",
                "Owner dashboard + progress tracking",
              ].map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2.5 text-sm sm:text-base text-[#475569] leading-snug"
                >
                  <Check
                    className="shrink-0 mt-1 w-4 h-4 text-[#0B2341]"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openModal("standard")}
              className={`inline-flex h-[56px] sm:h-[60px] items-center justify-center rounded-full px-6 text-lg sm:text-xl font-bold tracking-[0.05em] cursor-pointer bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 w-full ${hFont}`}
            >
              Train My Team
            </button>
          </div>

          {/* White-Label */}
          <div className="relative bg-[#06192F] text-white rounded-2xl p-6 sm:p-7 border-2 border-white/15 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Palette
                className="w-4 h-4 text-[#BF0A30]"
                aria-hidden="true"
              />
              <p
                className={`text-sm sm:text-base font-black text-[#BF0A30] tracking-[0.25em] ${hFont}`}
              >
                WHITE-LABEL
              </p>
            </div>
            <h3
              className={`font-black text-2xl sm:text-3xl tracking-[0.05em] mb-1 ${hFont}`}
            >
              Make It Yours
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4">
              Standard — fully rebranded as your company.
            </p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className={`text-4xl sm:text-5xl font-black ${hFont}`}>
                $1,497
              </span>
              <span className="text-sm sm:text-base text-gray-400 font-medium">
                /m
              </span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {[
                "Everything in Standard",
                "Certificates under your company name",
                "Training portal branded as your operation",
                "Built-in recruiting + retention edge",
              ].map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2.5 text-sm sm:text-base text-gray-400 leading-snug"
                >
                  <Check
                    className="shrink-0 mt-1 w-4 h-4 text-[#BF0A30]"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openModal("white-label")}
              className={`inline-flex h-[56px] sm:h-[60px] items-center justify-center rounded-full px-6 text-lg sm:text-xl font-bold tracking-[0.05em] cursor-pointer border-2 border-white/30 text-white hover:bg-white/10 active:bg-white/5 transition-colors duration-200 w-full ${hFont}`}
            >
              Make It Mine
            </button>
          </div>
        </div>
      </section>

      {/* Bottom tricolor */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>
    </div>
  );
}
