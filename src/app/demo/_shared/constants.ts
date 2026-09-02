// Winning hero video from the A/B video test (the variant "B" cut — real
// human speaker leading with social proof). It beat the animation cut on both
// watch-time (2.6 min avg vs 1.2 min) and bookings, so it now serves 100% of
// traffic on every page. Single source of truth — import this everywhere.
//
// HERO_VIDEO is a Bunny Stream HLS playlist: adaptive bitrate that auto-matches
// each viewer's connection (no mobile buffering). HeroVideo plays it via hls.js
// (or native HLS on Safari/iOS) and falls back to HERO_VIDEO_MP4 if HLS can't
// load — HERO_VIDEO_MP4 is the web-optimized 46MB re-encode on the GHL CDN.
export const HERO_VIDEO =
  "https://vz-e88dba28-7f3.b-cdn.net/867e7951-1717-4315-b47c-768c27f7d501/playlist.m3u8";

export const HERO_VIDEO_MP4 =
  "https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/6a989a58738fb3768dfb683b.mp4";
