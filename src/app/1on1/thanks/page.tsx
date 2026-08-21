import type { Metadata } from "next";
import { CalendarCheck, Mail, ClipboardList } from "lucide-react";
import CoachingScheduleEvent from "@/components/CoachingScheduleEvent";

const hFont = "font-[family-name:var(--font-bebas)]";

export const metadata: Metadata = {
  title: "You're On Tom's Calendar — Private Coaching Call Booked",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    icon: Mail,
    title: "Check Your Email",
    desc: "A calendar invite is on its way with the meeting details and dial-in link. Add it to your calendar so you don't miss it.",
  },
  {
    icon: ClipboardList,
    title: "Come Prepared",
    desc: "Bring your numbers — revenue, close rate, the bottlenecks keeping you up at night. The more specific you are, the more Tom can help.",
  },
  {
    icon: CalendarCheck,
    title: "Walk Out With A Move",
    desc: "By the end of the call you'll have a clear next step you can put to work in your business that week.",
  },
];

export default function CoachingBooked() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#0B2341] text-white">
      <CoachingScheduleEvent />

      {/* Top tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      {/* Background glow */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-[15%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.05] blur-[140px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-xl px-5 py-16 text-center sm:px-8 sm:py-24">
          {/* Checkmark */}
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

          {/* Heading */}
          <p
            className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#BF0A30] ${hFont}`}
          >
            Coaching Call Booked
          </p>
          <h1
            className={`mb-5 text-4xl font-black leading-[1.1] tracking-[0.05em] sm:text-5xl ${hFont}`}
          >
            You&rsquo;re On Tom&rsquo;s Calendar.
          </h1>
          <p className="mx-auto mb-12 max-w-md text-base leading-relaxed text-gray-400 sm:text-lg">
            Your slot is locked in and a calendar invite is on its way to your
            inbox. Here&rsquo;s how to get the most out of your time with Tom.
          </p>

          {/* Next steps */}
          <div className="mb-10 space-y-3 text-left">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#BF0A30]/15">
                    <Icon className="h-5 w-5 text-[#BF0A30]" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`mb-1 text-lg font-bold text-white ${hFont}`}>
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

          {/* Support note */}
          <p className="mb-6 text-sm text-gray-500">
            Need to reschedule or didn&rsquo;t get the invite? Reach us at{" "}
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
