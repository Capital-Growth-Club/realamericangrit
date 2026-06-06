import { CalendarCheck, Mail, Video, CalendarPlus } from "lucide-react";
import ScheduleEvent from "@/components/ScheduleEvent";

const hFont = "font-[family-name:var(--font-bebas)]";

const STEPS = [
  {
    icon: Mail,
    title: "Check Your Email",
    desc: "A calendar invite is on its way with the meeting details, dial-in link, and a quick note on what to bring to the demo.",
  },
  {
    icon: Video,
    title: "Show Up Ready",
    desc: "Have a rough idea of your top 1–2 bottlenecks. We'll tailor the walkthrough to the parts of the platform that actually solve them.",
  },
  {
    icon: CalendarCheck,
    title: "Walk Out With A Plan",
    desc: "By the end of the call you'll know whether the system fits your shop, what onboarding looks like, and what the next 15 minutes would cost you.",
  },
];

// Merge-field tokens GHL substitutes into the redirect URL. If GHL fails to
// substitute (token shows up literally) we hide the button instead of
// linking to garbage.
function parseUrl(raw: string | string[] | undefined): string | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (!v) return null;
  if (v.includes("{{") || v.includes("}}")) return null; // literal merge token
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export default async function DemoBooked({
  searchParams,
}: {
  searchParams: Promise<{ google?: string; outlook?: string }>;
}) {
  const params = await searchParams;
  const googleUrl = parseUrl(params.google);
  const outlookUrl = parseUrl(params.outlook);
  const hasCalendarLinks = googleUrl || outlookUrl;
  return (
    <div className="relative min-h-[100dvh] bg-[#0B2341] text-white flex flex-col">
      <ScheduleEvent />
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
            Demo Booked
          </p>
          <h1 className={`text-4xl sm:text-5xl font-black tracking-[0.05em] leading-[1.1] mb-5 ${hFont}`}>
            You&rsquo;re On The Calendar.
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-10 max-w-md mx-auto">
            We&rsquo;ve got your slot locked in.{" "}
            {hasCalendarLinks
              ? "Add it to your calendar so you don't miss it."
              : "Check your email for the calendar invite."}
          </p>

          {/* Add-to-calendar buttons (only if GHL passed the URLs) */}
          {hasCalendarLinks && (
            <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-md mx-auto">
              {googleUrl && (
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#BF0A30] text-white px-5 text-base font-bold tracking-[0.05em] cursor-pointer hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 ${hFont}`}
                >
                  <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                  Add To Google Calendar
                </a>
              )}
              {outlookUrl && (
                <a
                  href={outlookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full border-2 border-white/30 text-white px-5 text-base font-bold tracking-[0.05em] cursor-pointer hover:bg-white/10 active:bg-white/5 transition-colors duration-200 ${hFont}`}
                >
                  <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                  Add To Outlook
                </a>
              )}
            </div>
          )}

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
            Need to reschedule or didn&rsquo;t get the invite? Reach us at{" "}
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
