"use client";

import HeroVideo from "@/components/HeroVideo";

const hFont = "font-[family-name:var(--font-bebas)]";

// Replay of the 2026 Slow Season Profits — Sales & Marketing Live Training.
// TODO: set REPLAY_VIDEO to the hosted replay recording. A Bunny Stream HLS
// playlist (.m3u8) is ideal; a plain .mp4 works too. If you have both, put the
// HLS URL in REPLAY_VIDEO and the mp4 in REPLAY_VIDEO_MP4 (used as fallback).
const REPLAY_VIDEO =
  "https://vz-e88dba28-7f3.b-cdn.net/8088f531-199e-43b6-a4ec-980dcddba294/playlist.m3u8";
const REPLAY_VIDEO_MP4: string | undefined = undefined;

// Book-a-call funnel, tagged so replay bookings attribute back here.
const BOOK_DEMO_HREF =
  "/bookdemo?utm_source=webinar-replay&utm_medium=website&utm_campaign=2026-slow-season-webinar&utm_content=book-demo";

export default function Replay() {
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
          className="pointer-events-none absolute left-1/2 top-[8%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.07] blur-[150px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-3xl py-12 text-center sm:py-16">
          <p
            className={`${hFont} mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#BF0A30]`}
          >
            Full Replay
          </p>

          <h1
            className={`${hFont} mx-auto max-w-2xl text-4xl font-black leading-[0.98] tracking-[0.04em] sm:text-5xl md:text-6xl`}
          >
            2026 Slow Season Profits Sales &amp; Marketing Live Training
          </h1>

          {/* Replay video */}
          <div className="mt-9">
            <HeroVideo
              src={REPLAY_VIDEO}
              mp4Fallback={REPLAY_VIDEO_MP4}
              replayIntervalMs={36000000}
            />
          </div>

          {/* CTA → book a demo call */}
          <a
            href={BOOK_DEMO_HREF}
            className={`${hFont} mt-10 inline-flex h-[64px] items-center justify-center rounded-full bg-[#BF0A30] px-12 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
          >
            Book My Demo Call
          </a>
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>
    </div>
  );
}
