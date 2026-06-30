"use client";

import { useRef, useState, useEffect, useCallback } from "react";

type Props = {
  src: string;
  /** How long (ms) to play before looping back to 0 if the user never interacts. */
  replayIntervalMs?: number;
  /** Override the outer container's classes (sizing, shadow, rounding). */
  className?: string;
  /** Optional poster image while the video is loading. */
  poster?: string;
};

/**
 * Auto-playing muted video with a "Tap to unmute" overlay — mirrors the
 * hero pattern on capitalgrowthclub.com. Plays muted on mount, loops back
 * to 0 every `replayIntervalMs` until the user interacts. Clicking unmute
 * stops the loop, swaps in native controls, and continues from the user's
 * current position (or from 0 if they unmuted in the first second).
 */
export default function HeroVideo({
  src,
  replayIntervalMs = 15000,
  className,
  poster,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const replayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unmuted, setUnmuted] = useState(false);

  const clearReplay = useCallback(() => {
    if (replayTimer.current) {
      clearTimeout(replayTimer.current);
      replayTimer.current = null;
    }
  }, []);

  const startReplayTimer = useCallback(() => {
    clearReplay();
    replayTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && !unmuted) {
        v.currentTime = 0;
        v.play().catch(() => {});
        startReplayTimer();
      }
    }, replayIntervalMs);
  }, [unmuted, replayIntervalMs, clearReplay]);

  // Kick off autoplay + replay loop on mount.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => {
      if (!unmuted) startReplayTimer();
    };
    v.addEventListener("play", onPlay);
    v.play().catch(() => {});

    return () => {
      v.removeEventListener("play", onPlay);
      clearReplay();
    };
  }, [unmuted, startReplayTimer, clearReplay]);

  function handleUnmute() {
    const v = videoRef.current;
    if (!v) return;

    setUnmuted(true);
    v.muted = false;
    v.loop = false;
    v.controls = true;
    clearReplay();

    if (v.currentTime < 1) v.currentTime = 0;
    v.play().catch(() => {});
  }

  const containerClass =
    className ??
    "w-full max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden shadow-[0_16px_56px_rgba(0,0,0,0.3)] relative";

  return (
    <div className={containerClass}>
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        loop
        preload="auto"
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {!unmuted && (
        <button
          type="button"
          onClick={handleUnmute}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 group"
          aria-label="Play video with sound"
        >
          <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#BF0A30] text-white shadow-[0_8px_28px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-110 group-active:scale-95 animate-[vsl-pulse_2s_ease-in-out_infinite]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-9 h-9 sm:w-11 sm:h-11 ml-1.5"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
