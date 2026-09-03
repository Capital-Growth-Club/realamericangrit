import DemoLandingPage from "../_shared/DemoLandingPage";
import { HERO_VIDEO, HERO_VIDEO_MP4 } from "../_shared/constants";

// Variant B — HERO COPY challenger. Served via edge rewrite from /demo (see
// src/proxy.ts). Identical to control in every way except the hero headline +
// subheadline being tested below.
const CHALLENGER_HEADLINE = (
  <>
    Never Train Another Employee Or Department{" "}
    <span className="text-[#BF0A30]">Ever Again</span>.
  </>
);

const CHALLENGER_SUBHEADLINE = (
  <>
    Stop being the bottleneck. Our platform trains and certifies your entire
    team for you &mdash; so you&rsquo;re free to focus on the work that{" "}
    <strong className="text-gray-200 font-semibold">
      actually grows your profit
    </strong>
    .
  </>
);

export default function DemoPageB() {
  return (
    <DemoLandingPage
      heroVideoSrc={HERO_VIDEO}
      heroVideoMp4={HERO_VIDEO_MP4}
      heroHeadline={CHALLENGER_HEADLINE}
      heroSubheadline={CHALLENGER_SUBHEADLINE}
    />
  );
}
