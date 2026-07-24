import DemoLandingPage from "../_shared/DemoLandingPage";
import { HERO_VIDEO } from "../_shared/constants";

// Variant B — HEADLINE challenger slot. Served via edge rewrite from /demo
// (see src/proxy.ts). Same winning video as control; only the hero headline
// differs once a challenger is set.
//
// TODO(headline test): pass heroHeadline={CHALLENGER} below to go live.
// Until then B renders identically to A (control headline), so the 50/50
// split is a harmless no-op.
export default function DemoPageB() {
  return <DemoLandingPage heroVideoSrc={HERO_VIDEO} />;
}
