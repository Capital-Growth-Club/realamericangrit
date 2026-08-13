import type { Metadata } from "next";
import { Mail, CalendarPlus, Gift, CalendarDays, Clock } from "lucide-react";
import WebinarRegisteredEvent from "@/components/WebinarRegisteredEvent";

const hFont = "font-[family-name:var(--font-bebas)]";

export const metadata: Metadata = {
  title: "You're Registered — Slow Season Webinar",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    icon: Mail,
    title: "Check Your Email",
    desc: "Your confirmation is on its way — along with a calendar invite so the training is locked into your schedule. If you don't see it in a couple minutes, check spam or promotions.",
  },
  {
    icon: CalendarPlus,
    title: "Add It To Your Calendar",
    desc: "Didn't get the calendar invite? No problem — your confirmation email has a one-click “Add to Calendar” link. Use it now so nothing gets in the way of September 3rd.",
  },
  {
    icon: Gift,
    title: "Watch For Your Bonuses",
    desc: "Between now and the event we'll send a few extra resources to help you get the most out of the training. Keep an eye on your inbox so you don't miss them.",
  },
];

export default function WebinarThanks() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#0B2341] text-white">
      <WebinarRegisteredEvent />
      {/* Top tricolor */}
      <div className="flex h-1 shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-[12%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#BF0A30]/[0.06] blur-[140px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-xl px-5 py-16 text-center sm:px-8 sm:py-20">
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
            className={`${hFont} text-5xl leading-none tracking-wide sm:text-6xl`}
          >
            You&apos;re Registered!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
            Your seat for{" "}
            <span className="font-semibold text-white">
              Break Out Of The Slow Season
            </span>{" "}
            is locked in. Here&apos;s what happens next.
          </p>

          {/* date/time chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#BF0A30]" />
              Thursday, September 3rd
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#BF0A30]" />
              12:00 PM PT
            </span>
          </div>

          {/* steps */}
          <div className="mt-10 space-y-4 text-left">
            {STEPS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#BF0A30]/15">
                  <Icon className="h-5 w-5 text-[#BF0A30]" />
                </span>
                <div>
                  <h3 className={`${hFont} text-xl tracking-wide`}>{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-white/50">
            See you live on September 3rd. 🇺🇸
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
