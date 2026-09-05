"use client";

import { useEffect, useState } from "react";

type Props = {
  /** ISO datetime string the countdown ends at. */
  deadline: string;
  /** Rendered once the deadline has passed. */
  onExpire?: () => void;
  className?: string;
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function getRemaining(deadline: string): Remaining {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Live countdown to `deadline`. Ticks every second; fires onExpire once. */
export default function Countdown({ deadline, onExpire, className }: Props) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(deadline));
    const id = setInterval(() => {
      setRemaining(getRemaining(deadline));
    }, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  useEffect(() => {
    if (remaining?.expired) onExpire?.();
  }, [remaining?.expired, onExpire]);

  // Render nothing until mounted (avoids a server/client time mismatch flash).
  if (!remaining || remaining.expired) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {[
          { label: "Days", value: remaining.days },
          { label: "Hours", value: remaining.hours },
          { label: "Min", value: remaining.minutes },
          { label: "Sec", value: remaining.seconds },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex min-w-[58px] flex-col items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 sm:min-w-[68px] sm:px-4 sm:py-3"
          >
            <span className="font-[family-name:var(--font-bebas)] text-2xl font-black leading-none text-white sm:text-3xl">
              {pad(unit.value)}
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 sm:text-xs">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
