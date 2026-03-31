export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[100dvh] bg-[#0a1628] text-white relative overflow-hidden px-4 py-12 sm:px-6">
      {/* Background accent stripes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-28 sm:h-40 bg-[#b71c1c] rotate-[-8deg] opacity-20" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[150%] h-28 sm:h-40 bg-[#1565c0] rotate-[-8deg] opacity-20" />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 text-center max-w-2xl w-full">
        {/* Logo / brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#b71c1c] flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tighter">
              RAG
            </span>
          </div>
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
          <span className="text-white">REAL AMERICAN</span>{" "}
          <span className="text-[#b71c1c]">GRIT</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed px-2">
          Coaching &amp; consulting for home service companies ready to build,
          grow, and dominate their market.
        </p>

        <div className="flex items-center gap-3 mt-1 sm:mt-2">
          <div className="h-[2px] w-8 sm:w-12 bg-[#b71c1c]" />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            Coming Soon
          </span>
          <div className="h-[2px] w-8 sm:w-12 bg-[#1565c0]" />
        </div>

        {/* CTA / contact teaser */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-4 w-full">
          <a
            href="mailto:info@realamericangrit.com"
            className="inline-flex h-12 sm:h-14 items-center justify-center rounded-lg bg-[#b71c1c] px-8 sm:px-10 font-semibold text-white text-base sm:text-lg transition-colors hover:bg-[#d32f2f] active:bg-[#9a0007] w-full max-w-xs sm:w-auto"
          >
            Get In Touch
          </a>
          <p className="text-xs sm:text-sm text-gray-500">
            realamericangrit.com
          </p>
        </div>
      </main>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#b71c1c]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#1565c0]" />
      </div>
    </div>
  );
}
