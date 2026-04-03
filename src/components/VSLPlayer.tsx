"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const VSL_SRC = ""; // TODO: replace with actual VSL video URL

export default function VSLPlayer() {
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
    }, 20000);
  }, [unmuted, clearReplay]);

  /* kick off autoplay + replay loop */
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

  return (
    <div className="w-full max-w-[740px] mx-auto aspect-video rounded-xl overflow-hidden shadow-[0_16px_56px_rgba(0,0,0,0.3)] relative">
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        loop
        preload="auto"
        className="w-full h-full object-cover"
      >
        {VSL_SRC && <source src={VSL_SRC} type="video/mp4" />}
      </video>

      {/* placeholder if no video src yet */}
      {!VSL_SRC && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <p className="text-gray-400 text-sm font-medium">VSL Video Coming Soon</p>
        </div>
      )}

      {/* Unmute button */}
      {!unmuted && VSL_SRC && (
        <button
          onClick={handleUnmute}
          className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md text-white border border-white/15 rounded-full py-2.5 px-4 pl-3.5 text-[0.82rem] font-semibold cursor-pointer z-10 transition-all hover:bg-black/85 animate-[vsl-pulse_2s_ease-in-out_infinite]"
        >
          {/* muted speaker icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          <span>Tap to unmute</span>
        </button>
      )}
    </div>
  );
}
