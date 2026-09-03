import DemoLandingPage from "../_shared/DemoLandingPage";
import { HERO_VIDEO, HERO_VIDEO_MP4 } from "../_shared/constants";

// Variant B — HERO COPY challenger slot. Served via edge rewrite from /demo
// (see src/proxy.ts). Identical to control in every way except the hero
// headline + subheadline we're testing.
//
// To launch a test, uncomment CHALLENGER_HEADLINE / CHALLENGER_SUBHEADLINE and
// pass them below. While both are absent, B renders identically to A, so the
// 50/50 split is a harmless no-op.
//
// const CHALLENGER_HEADLINE = (<>Your challenger headline here.</>);
// const CHALLENGER_SUBHEADLINE = (<>Your challenger subheadline here.</>);

export default function DemoPageB() {
  return (
    <DemoLandingPage
      heroVideoSrc={HERO_VIDEO}
      heroVideoMp4={HERO_VIDEO_MP4}
      // heroHeadline={CHALLENGER_HEADLINE}
      // heroSubheadline={CHALLENGER_SUBHEADLINE}
    />
  );
}
