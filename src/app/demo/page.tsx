import DemoLandingPage from "./_shared/DemoLandingPage";
import { HERO_VIDEO } from "./_shared/constants";

// Variant A — CONTROL. Serves the winning B video + the control headline
// (defined in DemoLandingPage). The A/B split now tests the HEADLINE, not the
// video — the challenger headline lives in /demo/b. Both arms share HERO_VIDEO.
export default function DemoPage() {
  return <DemoLandingPage heroVideoSrc={HERO_VIDEO} />;
}
