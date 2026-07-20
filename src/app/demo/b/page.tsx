import DemoLandingPage from "../_shared/DemoLandingPage";

// Variant B — served via edge rewrite in src/proxy.ts when a visitor is
// bucketed into the "b" branch. URL bar still shows /demo; only the hero
// video changes.
const HERO_VIDEO_B =
  "https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/6a5d1512bc0b1f5d2e51131c.mp4";

export default function DemoPageB() {
  return <DemoLandingPage heroVideoSrc={HERO_VIDEO_B} />;
}
