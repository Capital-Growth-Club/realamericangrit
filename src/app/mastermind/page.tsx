import Link from "next/link";

const hFont = "font-[family-name:var(--font-bebas)]";

export default function MastermindClosed() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#0B2341] text-white">
      {/* Top tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-[15%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.05] blur-[140px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-lg px-5 py-16 text-center sm:px-8 sm:py-24">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <svg
              className="h-10 w-10 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
            </svg>
          </div>

          <p className={`${hFont} mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#BF0A30]`}>
            Registration Closed
          </p>
          <h1 className={`${hFont} mb-5 text-4xl font-black leading-[1.1] tracking-[0.05em] sm:text-5xl`}>
            This Event Is In The Past.
          </h1>
          <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-gray-400 sm:text-lg">
            Registration for this mastermind with Tom Howard has closed and
            seats are no longer available.
          </p>

          <Link
            href="/nov20mastermind"
            className={`${hFont} inline-flex h-[60px] items-center justify-center gap-2 rounded-full bg-[#BF0A30] px-10 text-xl tracking-[0.04em] text-white shadow-lg shadow-[#BF0A30]/25 transition-colors hover:bg-[#D91C40] active:bg-[#A00928]`}
          >
            See The Next Mastermind &rarr;
          </Link>

          <p className="mt-10 text-sm text-gray-500">
            Questions? Reach us at{" "}
            <a
              href="mailto:info@realamericangrit.com"
              className="font-medium text-[#BF0A30] hover:underline"
            >
              info@realamericangrit.com
            </a>
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
