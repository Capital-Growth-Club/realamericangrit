import { Mail, FileSignature, GraduationCap } from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";

const STEPS = [
  {
    icon: Mail,
    title: "Check Your Email",
    desc: "We just sent your enrollment contract to the email you used at checkout. Open it and review the terms.",
  },
  {
    icon: FileSignature,
    title: "Sign the Contract",
    desc: "Once you sign, we'll immediately unlock access to the full Scaling System and all training materials.",
  },
  {
    icon: GraduationCap,
    title: "Get Onboarded",
    desc: "You'll receive your login credentials, a welcome call invite, and everything you need to start installing systems this week.",
  },
];

export default function ThankYou() {
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
          {/* Checkmark */}
          <div className="w-20 h-20 rounded-full bg-[#BF0A30] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#BF0A30]/30">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Heading */}
          <p className={`uppercase text-xs font-bold tracking-[0.2em] text-[#BF0A30] mb-3 ${hFont}`}>
            Payment Confirmed
          </p>
          <h1 className={`text-4xl sm:text-5xl font-black tracking-[0.05em] leading-[1.1] mb-5 ${hFont}`}>
            You&rsquo;re In.
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-12 max-w-md mx-auto">
            Your subscription is active. Here&rsquo;s what happens next so we can get you fully onboarded and rolling.
          </p>

          {/* Next steps */}
          <div className="space-y-3 text-left mb-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex items-start gap-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#BF0A30]/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#BF0A30]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-white text-lg mb-1 ${hFont}`}>
                      <span className="text-[#BF0A30] mr-2">{i + 1}.</span>
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Support note */}
          <p className="text-sm text-gray-500 mb-6">
            Didn&rsquo;t get the email? Check your spam folder or email us at{" "}
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
