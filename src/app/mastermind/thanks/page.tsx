import { Mail, MapPin, CalendarCheck } from "lucide-react";
import MastermindPurchaseEvent from "@/components/MastermindPurchaseEvent";

const hFont = "font-[family-name:var(--font-bebas)]";

function parseAmount(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 4500;
}

const STEPS = [
  {
    icon: Mail,
    title: "Check Your Email",
    desc: "A confirmation is on its way to the address you used at checkout, along with the exact address for the two days.",
  },
  {
    icon: CalendarCheck,
    title: "Save The Dates",
    desc: "Nov 2–3, 2026, starting 8:00 AM PDT. Plan to be there both full days.",
  },
  {
    icon: MapPin,
    title: "Plan Your Travel",
    desc: "The event is in Las Vegas, NV. The exact address is in your confirmation email — it isn't published publicly.",
  },
];

export default async function MastermindThanks({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const params = await searchParams;
  const purchaseValue = parseAmount(params.amount);

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#0B2341] text-white">
      <MastermindPurchaseEvent value={purchaseValue} />
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

        <div className="relative mx-auto w-full max-w-xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#BF0A30] shadow-xl shadow-[#BF0A30]/30">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p className={`${hFont} mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#BF0A30]`}>
            Seat Reserved
          </p>
          <h1 className={`${hFont} mb-5 text-4xl font-black leading-[1.1] tracking-[0.05em] sm:text-5xl`}>
            You&rsquo;re In.
          </h1>
          <p className="mx-auto mb-12 max-w-md text-base leading-relaxed text-gray-400 sm:text-lg">
            Your seat for the Business &amp; Sales Mastermind with Tom Howard
            is confirmed. Here&rsquo;s what happens next.
          </p>

          <div className="mb-10 space-y-3 text-left">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#BF0A30]/15">
                    <Icon className="h-5 w-5 text-[#BF0A30]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${hFont} mb-1 text-lg font-bold text-white`}>
                      <span className="mr-2 text-[#BF0A30]">{i + 1}.</span>
                      {step.title}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mb-6 text-sm text-gray-500">
            Didn&rsquo;t get the email? Check your spam folder or reach us at{" "}
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
