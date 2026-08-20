import type { Metadata } from "next";

const hFont = "font-[family-name:var(--font-bebas)]";

export const metadata: Metadata = {
  title: "The 9-Figure Operator's Playbooks — Book Series (Coming Soon)",
  description:
    "The complete playbook series behind a $150M home service operation. Launching soon.",
};

export default function BookSeries() {
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

        <div className="relative mx-auto w-full max-w-2xl py-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#BF0A30]/30 bg-[#BF0A30]/[0.1] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            Coming Soon
          </p>

          <h1
            className={`${hFont} mx-auto mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-[0.04em] sm:text-6xl md:text-7xl`}
          >
            The 9-Figure Operator&rsquo;s Playbooks
          </h1>

          {/* Bundle image */}
          <img
            src="/9-figure-bundle.webp"
            alt="The 9-Figure Operator's Playbooks book series"
            width={1600}
            height={653}
            className="mx-auto mt-8 w-full max-w-[620px]"
          />

          <p className="mx-auto mt-8 max-w-lg text-lg text-white/70">
            The complete playbook series behind a $150M home service operation
            &mdash; the exact plays that turn every operator on your team into a
            nine-figure standard. Launching soon.
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
