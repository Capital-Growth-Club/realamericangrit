"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { track } from "@/lib/analytics";

type Props = {
  src: string;
  /** How long (ms) to play before looping back to 0 if the user never interacts. */
  replayIntervalMs?: number;
  /** Override the outer container's classes (sizing, shadow, rounding). */
  className?: string;
  /** Optional poster image while the video is loading. */
  poster?: string;
};

const SPEEDS = [1, 1.25, 1.5, 1.75, 2] as const;

/**
 * Auto-playing muted video with a "Tap to unmute" overlay + custom controls
 * post-unmute (rewind/play/pause/forward/speed/fullscreen). Fires GA4 + Meta
 * Pixel tracking events at every meaningful step: unmute, play/pause,
 * progress checkpoints (10% intervals), completion, seek, speed change,
 * fullscreen toggle, and watch-end (with reason: paused, ended, tab_hidden,
 * page_unload, unmounted). Loops back to 0 every replayIntervalMs while
 * still muted.
 */
export default function HeroVideo({
  src,
  replayIntervalMs = 15000,
  className,
  poster,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const replayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmutedRef = useRef(false);
  const progressMarksRef = useRef<Set<number>>(new Set());
  const [unmuted, setUnmuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      if (v && !unmutedRef.current) {
        v.currentTime = 0;
        v.play().catch(() => {});
        startReplayTimer();
      }
    }, replayIntervalMs);
  }, [replayIntervalMs, clearReplay]);

  // Core lifecycle: autoplay muted, replay loop, and all tracking listeners.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const fireWatchEnd = (reason: string) => {
      if (!unmutedRef.current || !v.duration) return;
      const currentSec = Math.round(v.currentTime);
      const totalSec = Math.round(v.duration);
      const percent = totalSec ? Math.round((currentSec / totalSec) * 100) : 0;
      track("video_watch_end", {
        video_src: src,
        last_position_sec: currentSec,
        last_position_num: currentSec,
        duration_sec: totalSec,
        duration_num: totalSec,
        percent_watched: percent,
        percent_watched_num: percent,
        stopped_reason: reason,
      });
    };

    const onPlay = () => {
      setIsPlaying(true);
      if (!unmutedRef.current) startReplayTimer();
    };
    const onPause = () => {
      setIsPlaying(false);
      if (unmutedRef.current) {
        track("video_pause", {
          video_src: src,
          current_time_sec: Math.round(v.currentTime),
          current_time_num: Math.round(v.currentTime),
        });
        // Only report the "watch end" if the user actually stopped (not just
        // buffering on a scrub).
        if (!v.seeking) fireWatchEnd("paused");
      }
    };
    const onEnded = () => {
      if (unmutedRef.current) {
        track("video_complete", { video_src: src });
        fireWatchEnd("ended");
      }
    };
    const onTimeUpdate = () => {
      if (!unmutedRef.current || !v.duration) return;
      const pct = Math.floor((v.currentTime / v.duration) * 100);
      for (const mark of [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) {
        if (pct >= mark && !progressMarksRef.current.has(mark)) {
          progressMarksRef.current.add(mark);
          track("video_progress", {
            video_src: src,
            percent: mark,
            percent_num: mark,
            current_time_sec: Math.round(v.currentTime),
            current_time_num: Math.round(v.currentTime),
          });
        }
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") fireWatchEnd("tab_hidden");
    };
    const onBeforeUnload = () => fireWatchEnd("page_unload");

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("timeupdate", onTimeUpdate);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);
    v.play().catch(() => {});

    return () => {
      // Fire a final watch-end if unmounting mid-play.
      if (unmutedRef.current && !v.paused && !v.ended) {
        fireWatchEnd("unmounted");
      }
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("timeupdate", onTimeUpdate);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
      clearReplay();
    };
  }, [src, startReplayTimer, clearReplay]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function handleUnmute() {
    const v = videoRef.current;
    if (!v) return;
    unmutedRef.current = true;
    setUnmuted(true);
    v.muted = false;
    v.loop = false;
    clearReplay();
    // First "real" play always starts from the beginning, regardless of where
    // the muted preview loop happened to be.
    v.currentTime = 0;
    v.play().catch(() => {});
    // Reset progress marks so we count checkpoints for the "real" watch.
    progressMarksRef.current = new Set();
    track("video_unmute_play", { video_src: src });
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      track("video_resume", {
        video_src: src,
        current_time_sec: Math.round(v.currentTime),
        current_time_num: Math.round(v.currentTime),
      });
    } else {
      v.pause();
      // Pause event listener above fires video_pause + watch_end.
    }
  }

  function seekBy(delta: number) {
    const v = videoRef.current;
    if (!v) return;
    const duration = v.duration || 0;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + delta));
    track("video_seek", {
      video_src: src,
      direction: delta > 0 ? "forward" : "rewind",
      amount_sec: Math.abs(delta),
      amount_num: Math.abs(delta),
      current_time_sec: Math.round(v.currentTime),
      current_time_num: Math.round(v.currentTime),
    });
  }

  function cycleSpeed() {
    const v = videoRef.current;
    if (!v) return;
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    const nextSpeed = SPEEDS[nextIndex];
    v.playbackRate = nextSpeed;
    setSpeedIndex(nextIndex);
    track("video_speed_change", {
      video_src: src,
      speed: nextSpeed,
      speed_num: nextSpeed,
    });
  }

  function toggleFullscreen() {
    const v = videoRef.current;
    if (!v) return;
    track("video_fullscreen_toggle", {
      video_src: src,
      entering: !document.fullscreenElement,
    });
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      const target = (wrapperRef.current ?? v) as HTMLElement & {
        webkitRequestFullscreen?: () => void;
      };
      const anyV = v as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
      };
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(() => {});
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      } else if (anyV.webkitEnterFullscreen) {
        anyV.webkitEnterFullscreen();
      }
    }
  }

  const containerClass =
    className ??
    "w-full max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden shadow-[0_16px_56px_rgba(0,0,0,0.3)] relative";

  return (
    <div ref={wrapperRef} className={`group ${containerClass}`}>
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

      {/* Tap anywhere to pause/play (post-unmute). Sits above the video but
          below the z-10 controls, so the control buttons still win their taps.
          Essential on mobile, where the bottom controls only reveal on hover. */}
      {unmuted && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          tabIndex={-1}
          className="absolute inset-0 z-0 cursor-pointer"
        />
      )}

      {/* Tap-to-unmute overlay */}
      {!unmuted && (
        <button
          type="button"
          onClick={handleUnmute}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
          aria-label="Play video with sound"
        >
          <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#BF0A30] text-white shadow-[0_8px_28px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-110 active:scale-95 animate-[vsl-pulse_2s_ease-in-out_infinite]">
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

      {/* Custom controls — hover to reveal, fade in/out */}
      {unmuted && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 px-3 py-3 md:px-4 md:py-4 bg-gradient-to-t from-black/75 via-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-10">
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => seekBy(-10)}
              aria-label="Rewind 10 seconds"
              className="relative w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9" />
                <path d="M3 4v5h5" />
              </svg>
              <span className="absolute -bottom-0.5 text-[9px] font-bold">10</span>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-12 h-12 rounded-full bg-[#BF0A30] hover:bg-[#D91C40] text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => seekBy(10)}
              aria-label="Forward 10 seconds"
              className="relative w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9" />
                <path d="M21 4v5h-5" />
              </svg>
              <span className="absolute -bottom-0.5 text-[9px] font-bold">10</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={cycleSpeed}
              aria-label="Playback speed"
              className="min-w-[52px] h-9 px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-sm font-bold backdrop-blur-md transition-colors cursor-pointer"
            >
              {SPEEDS[speedIndex]}x
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
