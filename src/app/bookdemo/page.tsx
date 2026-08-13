"use client";

import { useState } from "react";
import DemoBookingModal from "@/components/DemoBookingModal";

const hFont = "font-[family-name:var(--font-bebas)]";

export default function BookDemo() {
  const [modalOpen, setModalOpen] = useState(false);

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

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5">
        <div
          className="pointer-events-none absolute left-1/2 top-[10%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.07] blur-[150px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-2xl py-16 text-center">
          <h1
            className={`${hFont} mx-auto max-w-2xl text-5xl font-black leading-[0.95] tracking-[0.04em] sm:text-6xl md:text-7xl`}
          >
            Book Your{" "}
            <span className="text-[#BF0A30]">Real American Grit</span>{" "}
            Platform Demo Call
          </h1>

          {/* Bundle image */}
          <img
            src="/9-figure-bundle.webp"
            alt="The 9-Figure Operator's Playbooks"
            width={1600}
            height={653}
            className="mx-auto mt-8 w-full max-w-[560px]"
          />

          <p className="mx-auto mt-8 max-w-lg text-lg text-white/70">
            Get a live walkthrough of the training platform behind a $150M home
            service operation — and see how it installs a 9-figure standard into
            every operator on your team. Grab a time below.
          </p>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={`${hFont} mt-8 inline-flex h-[64px] items-center justify-center rounded-full bg-[#BF0A30] px-12 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
          >
            Book My Demo Call
          </button>

          <p className="mt-4 text-sm text-white/45">
            Takes 60 seconds — pick a time that works for you.
          </p>
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <DemoBookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
