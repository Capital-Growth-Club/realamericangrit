// Winning hero video from the A/B video test (the variant "B" cut — real
// human speaker leading with social proof). It beat the animation cut on both
// watch-time (2.6 min avg vs 1.2 min) and bookings, so it now serves 100% of
// traffic on every page. Single source of truth — import this everywhere.
// Web-optimized re-encode (CRF 23, faststart): 905MB -> 46MB, same length/quality,
// so the muted autoplay loop starts fast instead of buffering forever.
export const HERO_VIDEO =
  "https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/6a989a58738fb3768dfb683b.mp4";
