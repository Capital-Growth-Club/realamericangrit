import DemoLandingPage from "./_shared/DemoLandingPage";

// Variant A — control. The hero video URL is the only difference between A
// and B; everything else is delivered by the shared DemoLandingPage
// component so we don't have to maintain the ~950-line page twice.
const HERO_VIDEO_A =
  "https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/6a430a3042c4669a15dc5372.mp4";

export default function DemoPage() {
  return <DemoLandingPage heroVideoSrc={HERO_VIDEO_A} />;
}
