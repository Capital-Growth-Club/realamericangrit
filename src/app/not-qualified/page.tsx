import { ShieldAlert } from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";

export default function NotQualified() {
  return (
    <div className="relative min-h-[100dvh] bg-[#0B2341] text-white flex flex-col">
      {/* Top tricolor */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      {/* Background glow */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#BF0A30]/[0.05] rounded-full blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center">
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
            alt="Real American Grit University"
            className="h-12 w-auto mx-auto mb-10 opacity-70"
          />

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#BF0A30]/15 border border-[#BF0A30]/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-[#BF0A30]" aria-hidden="true" />
          </div>

          {/* Heading */}
          <p
            className={`uppercase text-xs font-bold tracking-[0.25em] text-[#BF0A30] mb-3 ${hFont}`}
          >
            Not A Fit
          </p>
          <h1
            className={`text-4xl sm:text-5xl font-black tracking-[0.05em] leading-[1.05] mb-6 ${hFont}`}
          >
            These demos are reserved for <span className="text-[#BF0A30]">$1M&ndash;$10M home service owners.</span>
          </h1>

          <div className="space-y-4 text-base sm:text-lg text-gray-400 leading-relaxed mb-10 max-w-lg mx-auto">
            <p>
              This is reserved for home service businesses doing <strong className="text-white">$1M&ndash;$10M a year</strong> who are trying to install the systems that can support a <strong className="text-white">9-figure-plus enterprise</strong>.
            </p>
            <p>
              If that&rsquo;s not you yet, we don&rsquo;t want to waste your time or ours on a demo that won&rsquo;t deliver. When you get there, come back.
            </p>
          </div>

          {/* Support note */}
          <p className="text-sm text-gray-500">
            Questions? Reach us at{" "}
            <a
              href="mailto:info@realamericangrit.com"
              className="text-[#BF0A30] hover:underline font-medium"
            >
              info@realamericangrit.com
            </a>
          </p>
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>
    </div>
  );
}
