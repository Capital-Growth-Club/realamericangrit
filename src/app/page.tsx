export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-[#0a1628] text-white relative overflow-hidden">
      {/* Background accent stripes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-40 bg-[#b71c1c] rotate-[-8deg] opacity-20" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[150%] h-40 bg-[#1565c0] rotate-[-8deg] opacity-20" />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-2xl">
        {/* Logo / brand */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#b71c1c] flex items-center justify-center">
            <span className="text-2xl font-black text-white tracking-tighter">
              RAG
            </span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
          <span className="text-white">REAL AMERICAN</span>{" "}
          <span className="text-[#b71c1c]">GRIT</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-lg leading-relaxed">
          Coaching &amp; consulting for home service companies ready to build,
          grow, and dominate their market.
        </p>

        <div className="flex items-center gap-3 mt-2">
          <div className="h-[2px] w-12 bg-[#b71c1c]" />
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
            Coming Soon
          </span>
          <div className="h-[2px] w-12 bg-[#1565c0]" />
        </div>

        {/* CTA / contact teaser */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <a
            href="mailto:info@realamericangrit.com"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-[#b71c1c] px-8 font-semibold text-white transition-colors hover:bg-[#d32f2f]"
          >
            Get In Touch
          </a>
          <p className="text-sm text-gray-500">
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
