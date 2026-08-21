import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";

export const metadata: Metadata = {
  title: "Your Pricing Guide Is Ready",
  robots: { index: false, follow: false },
};

const GUIDE_PDF =
  "https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/6a886513152c3deba8d7ec88.pdf";

export default function PricingGuideThanks() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0B2341] text-white">
      {/* Top tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5">
        <div
          className="pointer-events-none absolute left-1/2 top-[12%] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.06] blur-[140px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-lg py-16 text-center">
          {/* Checkmark */}
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-[#BF0A30] shadow-xl shadow-[#BF0A30]/30">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1
            className={`${hFont} text-5xl font-black leading-none tracking-[0.03em] sm:text-6xl`}
          >
            Your Guide Is Ready.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
            Tap below to open it now &mdash; and we&rsquo;ve emailed you a copy
            so it&rsquo;s always one search away.
          </p>

          <a
            href={GUIDE_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className={`${hFont} mt-8 inline-flex h-[64px] items-center justify-center gap-2 rounded-full bg-[#BF0A30] px-12 text-2xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
          >
            <Download className="h-6 w-6" strokeWidth={2.5} />
            Download The Guide
          </a>

          <p className="mt-8 inline-flex items-center gap-2 text-sm text-white/50">
            <Mail className="h-4 w-4" />
            Didn&rsquo;t get the email? Check spam or promotions.
          </p>

          <p className="mt-10 text-sm text-white/40">
            From the Real American Grit series by Tom Howard.
          </p>
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
