"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Palette } from "lucide-react";
import DemoBookingModal from "@/components/DemoBookingModal";
import HeroVideo from "@/components/HeroVideo";
import TimeOnPage from "@/components/TimeOnPage";
import { HERO_VIDEO, HERO_VIDEO_MP4 } from "../_shared/constants";
import { track } from "@/lib/analytics";

/*
 * /demo/grit — a standalone, story-driven long-form sales letter (Sabri Suby
 * "Sell Like Crazy" structure, grounded-grit RAG voice). NOT part of the
 * /demo A/B split. First-person narrator: Tom Howard. Distraction-free.
 *
 * The story physically walks through all nine playbooks in a natural arc,
 * each with its book cover inline, each transition flowing into the next.
 * Copy is set one-sentence-per-line (.story-line) to pull the reader down,
 * with sparse yellow highlighter markers (<Y>) placed as scroll anchors.
 */

const hFont = "font-[family-name:var(--font-bebas)]";

/* Reveal-on-scroll (adds .visible to .section-fade) */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-fade:not(.visible)");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* Section-by-section scroll funnel — tagged page:"grit" so this page's
   drop-off (incl. how deep into the playbooks) reads independently in GA4. */
function useSectionTracking() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-track-section]");
    if (!els.length) return;
    const seen = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          obs.unobserve(e.target);
          const name = (e.target as HTMLElement).dataset.trackSection ?? "";
          if (!name || seen.has(name)) return;
          seen.add(name);
          track("section_view", { section: name, page: "grit" });
        });
      },
      { threshold: 0, rootMargin: "0px 0px -25% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── tricolor accent stripe ─── */
function Stripe() {
  return (
    <div className="flex w-full" aria-hidden="true">
      <div className="h-1 flex-1 bg-[#BF0A30]" />
      <div className="h-1 flex-1 bg-white" />
      <div className="h-1 flex-1 bg-[#1a3a6b]" />
    </div>
  );
}

/* ─── emphasis helpers ─── */
function R({ children }: { children: React.ReactNode }) {
  return <span className="text-[#BF0A30] font-bold">{children}</span>;
}
function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold text-[#0B2341]">{children}</strong>;
}
/* yellow highlighter marker */
function Y({ children }: { children: React.ReactNode }) {
  return <mark className="marker-y">{children}</mark>;
}
/* headline-sized closing beat */
function Punch({ children }: { children: React.ReactNode }) {
  return <p className="story-punch">{children}</p>;
}

/* ─── skimmer speed-bump subhead ─── */
function Sub({ children, className = "mt-4 mb-8" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl sm:text-4xl md:text-[46px] font-black text-[#0B2341] tracking-[0.03em] leading-[1.05] ${className} ${hFont}`}>
      {children}
    </h2>
  );
}

/* ─── playbook book cover ─── */
function Cover({ src, name }: { src: string; name: string }) {
  return (
    <div className="my-9 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} Playbook`}
        loading="lazy"
        className="w-[340px] sm:w-[480px] max-w-full h-auto drop-shadow-[0_28px_56px_rgba(0,0,0,0.32)]"
      />
      <p className={`mt-4 text-lg sm:text-xl text-[#BF0A30] tracking-[0.12em] uppercase ${hFont}`}>
        The {name} Playbook
      </p>
    </div>
  );
}

/* ─── CTA button (opens the booking modal) ─── */
function Cta({
  onClick,
  label = "Book Your Training Platform Demo",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[64px] sm:h-[70px] items-center justify-center rounded-full bg-[#BF0A30] px-8 sm:px-10 text-xl sm:text-2xl font-bold tracking-[0.05em] text-white hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 pulse-red cursor-pointer ${hFont} ${className}`}
    >
      {label}
      <ArrowRight className="ml-2.5 w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
    </button>
  );
}

function CtaNote() {
  return (
    <p className="mt-4 text-sm text-gray-500 tracking-wide">
      15-minute walkthrough · nothing to install · see the exact systems live
    </p>
  );
}

/* The 9 playbooks and their a-la-carte value (sums to $64,973). */
const PLAYBOOKS: [string, string][] = [
  ["Sales", "$9,997"],
  ["Marketing", "$9,997"],
  ["Operations", "$9,997"],
  ["Leadership", "$9,997"],
  ["Financials", "$7,997"],
  ["Acquisitions", "$4,997"],
  ["Pricing", "$4,997"],
  ["HR & Hiring", "$3,997"],
  ["Corporate Structure", "$2,997"],
];

/* Bottom-of-page FAQ. */
const FAQS: [string, string][] = [
  [
    "What is the AI sales role-play?",
    "It’s a built-in practice partner for your reps. They run live, spoken in-home sales scenarios against an AI that plays the homeowner — stalls, price pushback, spouse objections, the whole conversation — and get scored feedback. As many reps as they want, before they’re ever in front of a real customer. It’s included in the Standard and White-Label plans.",
  ],
  [
    "Do I have to run the training myself?",
    "No — that’s the whole point. The platform does the teaching through 6–12 minute modules, quizzes, and certificates. You assign courses by role and track progress on the owner dashboard. You stop being the trainer.",
  ],
  [
    "How fast can my team start?",
    "The same day. You assign courses in about five minutes and your operators start on their phones. Most owners see their first certificates on the dashboard within the first week.",
  ],
  [
    "Is this only for HVAC?",
    "No. It’s built for home services across the board — HVAC, plumbing, electrical, roofing, and more. Pricing math, a P&L, and an in-home sales process don’t change much trade to trade. The standard underneath is the same.",
  ],
  [
    "What actually happens on the demo call?",
    "A 15-minute walkthrough of the platform — the nine departments, the owner dashboard, and the AI role-play — so you can see exactly how it drops into your shop. No pressure, no obligation.",
  ],
  [
    "What does it cost?",
    "Plans start at $549/m for the core library and $997/m for the full standard library (with the AI role-play). White-label runs $1,497/m. We’ll help you land on the right fit during the call.",
  ],
];

export default function GritStoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  useReveal();
  useSectionTracking();

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-white">
      <TimeOnPage page="grit" />
      <DemoBookingModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ═══ SLIM BRAND BAR (distraction-free — logo only) ═══ */}
      <header className="w-full">
        <Stripe />
        <div className="bg-[#0B2341] py-4 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
            alt="Real American Grit University"
            className="h-11 w-auto"
          />
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section
        data-track-section="hero"
        className="relative bg-[#0B2341] text-white overflow-hidden"
      >
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#BF0A30]/[0.05] rounded-full blur-[140px] pointer-events-none glow-bg" aria-hidden="true" />
        <div className="relative max-w-[820px] mx-auto px-5 sm:px-8 pt-14 sm:pt-20 md:pt-24 pb-20 sm:pb-28 text-center">
          <p className={`uppercase text-sm sm:text-base font-bold tracking-[0.25em] text-gray-300 mb-6 ${hFont}`}>
            For home service owners doing $2M &ndash; $10M
          </p>

          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-black tracking-[0.05em] leading-[0.95] mb-5 ${hFont}`}>
            Stop Being The <span className="text-[#BF0A30]">Duct Tape</span>{" "}That&rsquo;s Holding Your Business Together.
          </h1>

          <p className="text-lg sm:text-xl md:text-[22px] text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
            Real American Grit takes the 9 SOP Training playbooks that built a <strong className="text-gray-200 font-semibold">$150M/yr+ home services operation</strong>{" "}and installs them into every operator on your team &mdash; so your whole team can start operating like a 9-figure company without you.
          </p>

          <p className="text-sm sm:text-base text-gray-500 mb-8 tracking-wide">
            <span aria-hidden="true">&darr;</span> Watch the video below to see how <span aria-hidden="true">&darr;</span>
          </p>

          <div className="mb-8 w-full flex justify-center">
            <HeroVideo
              src={HERO_VIDEO}
              mp4Fallback={HERO_VIDEO_MP4}
              poster="/demo-hero-poster.jpg"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Cta onClick={open} className="w-full sm:w-auto" />
          </div>

          <p className="text-sm text-gray-500">
            Built by <span className="text-gray-300 font-medium">Tom Howard</span> (Owner of Lee&rsquo;s Air · $150M+ Annual Revenue) and <span className="text-gray-300 font-medium">Phil Filaski</span> ($19.6M in annual residential HVAC sales)
          </p>
        </div>
      </section>

      {/* ═══ THE STORY + PLAYBOOK WALK ═══ */}
      <section className="bg-[#FBFAF7] pt-16 sm:pt-24 pb-2 sm:pb-4">
        <div className="max-w-[680px] mx-auto px-5 sm:px-8">

          {/* ── the hook + origin ── */}
          <div data-track-section="story" className="section-fade">
            <p className="text-2xl sm:text-3xl text-[#0B2341] font-bold mb-8">
              Dear Home Service Business Owner,
            </p>
            <p className="story-line">If you want to finally build a home service business that runs without you&hellip;</p>
            <p className="story-line">One that prices right, closes every call, and holds its standard whether you&rsquo;re in the truck or on a beach&hellip;</p>
            <p className="story-line">And sells for a fortune the day you decide to walk away&hellip;</p>
            <p className="story-line"><Y>Then this is the most important letter you&rsquo;ll ever read.</Y></p>
            <p className="story-line">Here&rsquo;s why:</p>
            <Sub>My name is Tom Howard.</Sub>
            <p className="story-line">Years back, I took over a beat-up little HVAC shop in Fresno called Lee&rsquo;s Air.</p>
            <p className="story-line">Eleven employees. <B>$1.6 million a year.</B></p>
            <figure className="my-9">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tom-old-lees-air.webp"
                alt="Tom Howard with the original Lee's Air team and branding"
                loading="lazy"
                className="w-full rounded-xl shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
              />
              <figcaption className="mt-3 text-center text-sm text-[#64748b] italic">
                Lee&rsquo;s Air, back in the early days.
              </figcaption>
            </figure>
            <p className="story-line">Margins so thin I was basically working for free.</p>
            <p className="story-line">And I was doing every bit of it myself &mdash; pricing, selling, dispatching, hiring, putting out every fire.</p>
            <p className="story-line">My first year, I nearly doubled it to three.</p>
            <p className="story-line">And I figured that was the top. Three million was my ceiling for life.</p>
            <p className="story-line">I was wrong.</p>
            <p className="story-line">Today, Lee&rsquo;s Air does over <R>$150 million a year</R> &mdash; and it runs without me in the middle of it.</p>
          </div>

          {/* ── the vacation ── */}
          <div data-track-section="vacation" className="section-fade">
            <Sub>But before that, I lived through the worst vacation of my life.</Sub>
            <p className="story-line">A year or two in, I finally took my family away for a week.</p>
            <p className="story-line"><Y>I spent the whole thing on the phone.</Y></p>
            <p className="story-line">Pricing a job from a pool chair.</p>
            <p className="story-line">Talking a tech off the ledge at 9pm.</p>
            <p className="story-line">Approving a discount I never should&rsquo;ve approved.</p>
            <p className="story-line">By day three, my wife stopped asking if I was getting in the water.</p>
            <p className="story-line">The truth is, I hadn&rsquo;t built a business.</p>
            <p className="story-line"><Y>I&rsquo;d built a job that owned me.</Y></p>
            <p className="story-line">And I knew something had to change.</p>
          </div>

          {/* ── the real problem ── */}
          <div data-track-section="problem" className="section-fade">
            <p className="story-line">I was running a bigger and bigger company on pure feel.</p>
            <p className="story-line">And my team was operating the same way.</p>
            <p className="story-line">No systems. No processes. No standard.</p>
            <Punch>One sales rep closed 60% of his calls. The next closed 20%.</Punch>
            <p className="story-line">Fresh leads sat in the CRM until they went cold.</p>
            <p className="story-line">A 90-day hire washed out, and I blamed the labor market.</p>
            <p className="story-line">Same trucks, same leads, same prices.</p>
            <p className="story-line">The only difference was whatever I taught them on the ride-along that morning.</p>
            <p className="story-line">Every system I had lived in one place&hellip;</p>
            <p className="story-line">My head.</p>
            <p className="story-line">So when a good tech quit, <Y>my playbook walked out the door with him.</Y></p>
          </div>

          {/* ── the turn ── */}
          <div data-track-section="the_turn" className="section-fade">
            <Sub>So I stopped teaching, and started building.</Sub>
            <p className="story-line">Real systems. Real SOPs. Real processes.</p>
            <p className="story-line">The kind that could run a company better than I ever could &mdash; <B>without me in it.</B></p>
            <p className="story-line">And every system stuck in my head, I finally wrote down.</p>
            <p className="story-line">Not a binder nobody reads &mdash; a <B>system</B>, broken into the nine parts of a home service business that actually move the needle.</p>
            <p className="story-line">I built them one at a time, starting <Y>where the money was bleeding out the fastest&hellip;</Y></p>
          </div>

          {/* ── PLAYBOOK 1 · PRICING ── */}
          <div data-track-section="pb_pricing" className="section-fade">
            <p className="story-line">My pricing.</p>
            <Cover src="/pricing-playbook.webp" name="Pricing" />
            <p className="story-line">Most contractors are 5 to 15% underpriced and have no idea.</p>
            <p className="story-line">I was one of them.</p>
            <p className="story-line">So I threw out gut-feel quoting for good.</p>
            <p className="story-line">And rebuilt every price around the one number that actually protects your margin &mdash; gross profit per man-day.</p>
            <Punch>Over the next few years, my average install ticket climbed from $7,000 to <Y>$26,000.</Y></Punch>
            <p className="story-line"><Y>(This is the playbook that pays for the whole thing on day one, btw.)</Y></p>
          </div>

          {/* ── PLAYBOOK 2 · SALES ── */}
          <div data-track-section="pb_sales" className="section-fade">
            <p className="story-line">But fixing my prices meant nothing if my guys couldn&rsquo;t hold them.</p>
            <Cover src="/sales-playbook.webp" name="Sales" />
            <p className="story-line">So the next thing I wrote down was how we actually sell.</p>
            <p className="story-line">Every objection. Every stall. Every close.</p>
            <p className="story-line">The exact in-home process my partner Phil Filaski still runs today.</p>
            <p className="story-line"><Y>$19.6 million a year. Sold knee-to-knee in living rooms.</Y></p>
            <p className="story-line">Now it&rsquo;s a script a first-week rep can follow.</p>
          </div>

          {/* ── PLAYBOOK 3 · MARKETING ── */}
          <div data-track-section="pb_marketing" className="section-fade">
            <p className="story-line">But even the best closer still needs leads to sell to.</p>
            <Cover src="/marketing-playbook.webp" name="Marketing" />
            <p className="story-line">So I built the machine &mdash; the rebrand that <B>tripled our calls</B>, the positioning, the website, Google, paid ads, the follow-up.</p>
            <p className="story-line"><Y>A system that turns $1 of marketing into $10.</Y></p>
            <p className="story-line">At a cost-per-booked-job I could actually predict.</p>
          </div>

          {/* ── PLAYBOOK 4 · OPERATIONS ── */}
          <div data-track-section="pb_operations" className="section-fade">
            <p className="story-line">More leads. More sold jobs. More chaos.</p>
            <Cover src="/operations-playbook.webp" name="Operations" />
            <p className="story-line">The bottleneck didn&rsquo;t disappear. It just moved.</p>
            <p className="story-line">So I documented the operation itself &mdash; scheduling, quality control, inventory, the KPI dashboard.</p>
            <p className="story-line"><Y>Every SOP written down so the business runs without me in the building.</Y></p>
          </div>

          {/* mid-page soft CTA */}
          <div className="section-fade my-14 rounded-3xl bg-[#0B2341] text-white px-6 py-10 sm:px-10 sm:py-12 text-center">
            <p className={`text-2xl sm:text-3xl font-black tracking-[0.02em] leading-[1.1] mb-6 ${hFont}`}>
              Starting to see where this fits your shop?
            </p>
            <Cta onClick={open} className="w-full sm:w-auto" />
            <CtaNote />
          </div>

          {/* ── PLAYBOOK 5 · FINANCIALS ── */}
          <div data-track-section="pb_financials" className="section-fade">
            <p className="story-line">Now I could finally see the work.</p>
            <Cover src="/financials-playbook.webp" name="Financials" />
            <p className="story-line">But I still couldn&rsquo;t see the money.</p>
            <p className="story-line">So I learned to run the whole company off one page &mdash; the P&amp;L.</p>
            <p className="story-line">Job costing. Cash flow. The ratios that tell you if you&rsquo;re really ready to scale.</p>
            <Punch>&ldquo;Profitable but broke&rdquo; became impossible.</Punch>
          </div>

          {/* ── PLAYBOOK 6 · TAX / CORPORATE STRUCTURES ── */}
          <div data-track-section="pb_tax" className="section-fade">
            <p className="story-line">Making the money was one thing.</p>
            <Cover src="/corporate-structures-playbook.webp" name="Corporate Structures" />
            <p className="story-line">Keeping it was another.</p>
            <p className="story-line">The right entity. The right owner&rsquo;s comp.</p>
            <p className="story-line">The asset protection most contractors skip until it&rsquo;s too late.</p>
            <p className="story-line">The tax bill that quietly grows with your revenue&hellip;</p>
            <p className="story-line"><Y>finally handled.</Y></p>
          </div>

          {/* ── PLAYBOOK 7 · HR & HIRING ── */}
          <div data-track-section="pb_hr" className="section-fade">
            <p className="story-line">None of it holds if the wrong people are running it though.</p>
            <Cover src="/human-resources-playbook.webp" name="Human Resources" />
            <p className="story-line">I was stuck in the bad-hire cycle.</p>
            <p className="story-line">Hire, wash out at 90 days, blame the labor market, start over.</p>
            <p className="story-line">Then I stopped blaming the labor market.</p>
            <p className="story-line"><Y>There&rsquo;s no labor shortage &mdash; just a shortage of shops willing to pay for talent.</Y></p>
            <p className="story-line">So we paid like it, built our own school, and fixed how we hire, onboard, and hold people accountable.</p>
            <Punch>New hires productive in days &mdash; not months.</Punch>
          </div>

          {/* ── PLAYBOOK 8 · LEADERSHIP ── */}
          <div data-track-section="pb_leadership" className="section-fade">
            <p className="story-line">And then I did the hardest thing an owner can do.</p>
            <Cover src="/leadership-playbook.webp" name="Leadership" />
            <p className="story-line"><Y>I got out of the way.</Y></p>
            <p className="story-line">I promoted techs into managers without watching them drown.</p>
            <p className="story-line">I built standards and a culture that hold up whether I&rsquo;m in the room or not.</p>
            <p className="story-line">I stopped doing the work. I started leading it.</p>
          </div>

          {/* ── PLAYBOOK 9 · ACQUISITIONS ── */}
          <div data-track-section="pb_acquisitions" className="section-fade">
            <p className="story-line">Once the business ran without me, I had a new kind of problem.</p>
            <Cover src="/acquisitions-playbook.webp" name="Acquisitions" />
            <p className="story-line">Too much time. Too much cash.</p>
            <p className="story-line">So I started buying other shops.</p>
            <p className="story-line">Sourcing, deal structure, the operator-to-operator negotiation.</p>
            <Punch>Now I <Y>buy the competitor down the street</Y> instead of fighting him.</Punch>
          </div>

          {/* ── bridge: story → offer ── */}
          <div data-track-section="wrap" className="section-fade">
            <p className="story-line">Nine departments.</p>
            <p className="story-line">All of them running in unison &mdash; <B>without me doing it myself.</B></p>
            <p className="story-line">That&rsquo;s what took Lee&rsquo;s Air from a $1.6 million shop with eleven employees&hellip;</p>

            <div className="my-10 border-l-4 border-[#BF0A30] bg-white rounded-r-xl px-6 py-6 shadow-sm">
              <p className="text-2xl sm:text-3xl text-[#0B2341] leading-[1.4] font-medium">
                &hellip;to <R>over $150 million a year</R> &mdash; and a group valued north of <R>$450 million.</R>
              </p>
            </div>

            <p className="story-line">Now, here&rsquo;s the part that matters for you.</p>
            <p className="story-line">The same systems, SOPs, and processes we built to get there&hellip;</p>
            <p className="story-line"><Y>&hellip;are the exact ones we install directly into your operation, for you.</Y></p>
            <p className="story-line">Through our training platform &mdash; <B>Real American Grit.</B></p>
            <p className="story-line">If you&rsquo;re doing $2M to $10M and you&rsquo;re still wearing all the hats and putting out every fire yourself&hellip;</p>
            <p className="story-line">&hellip;it was built for you.</p>

            <div className="mt-12 rounded-3xl bg-[#0B2341] px-6 py-10 sm:px-10 sm:py-12 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/9-figure-bundle.webp"
                alt="The 9-Figure Operator's Playbooks — complete bundle"
                loading="lazy"
                decoding="async"
                className="w-full max-w-xl mx-auto h-auto mb-8"
              />
              <Cta onClick={open} label="Book Your Training Platform Demo" className="w-full sm:w-auto" />
              <CtaNote />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE EXIT ANGLE ═══ */}
      <section data-track-section="exit" className="bg-gradient-to-b from-[#FBFAF7] to-white pt-6 sm:pt-8 pb-10 sm:pb-12">
        <div className="section-fade max-w-[680px] mx-auto px-5 sm:px-8">
          <p className="story-line">But if the business running through you was the only problem, that&rsquo;d be bad enough.</p>
          <Sub className="mt-9 mb-8">Here&rsquo;s what nobody tells you until it&rsquo;s too late.</Sub>
          <p className="story-line">One day you&rsquo;ll go to sell this thing.</p>
          <p className="story-line">And a buyer doesn&rsquo;t pay you for what you say it&rsquo;s worth.</p>
          <p className="story-line">They pay for what&rsquo;s documented, trained, and transferable.</p>
          <p className="story-line">If the whole operation lives in your head, you&rsquo;re not selling a business.</p>
          <Punch>You&rsquo;re selling yourself a job.</Punch>
          <p className="story-line">That&rsquo;s two, maybe three times EBITDA on a good day.</p>
          <p className="story-line">But a shop with documented systems and trained, certified operators &mdash; one a new owner can just plug into?</p>
          <p className="story-line">That one sells for <Y>almost double.</Y></p>
          <p className="story-line">These playbooks run your business better today &mdash; and double what it&rsquo;s worth tomorrow.</p>

          <div className="mt-12 rounded-3xl bg-[#0B2341] text-white px-6 py-10 sm:px-10 sm:py-12 text-center">
            <h2 className={`text-3xl sm:text-4xl font-black tracking-[0.02em] leading-[1.1] mb-6 ${hFont}`}>
              Stop being the underpaid trainer. <span className="text-[#BF0A30]">Start being the CEO.</span>
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/9-figure-bundle.webp"
              alt="The 9-Figure Operator's Playbooks — complete bundle"
              loading="lazy"
              decoding="async"
              className="w-full max-w-md mx-auto h-auto mb-8"
            />
            <Cta onClick={open} className="w-full sm:w-auto" />
            <CtaNote />
          </div>
        </div>
      </section>

      {/* ═══ OBJECTIONS ═══ */}
      <section data-track-section="objections" className="bg-white pt-10 sm:pt-12 pb-16 sm:pb-24">
        <div className="section-fade max-w-[680px] mx-auto px-5 sm:px-8">
          <Sub>&ldquo;But I&rsquo;m not even in HVAC.&rdquo;</Sub>
          <p className="story-line">Doesn&rsquo;t matter.</p>
          <p className="story-line">Every home service operation runs on the same machine.</p>
          <p className="story-line">The trade on top is the only thing that changes.</p>
          <p className="story-line">Plumbing, electrical, roofing, HVAC &mdash; the pricing math, the P&amp;L, the in-home sale, the hiring are all the same.</p>
          <p className="story-line">It&rsquo;s exactly why Tom sits on the boards of some of the biggest operators in the country &mdash; across trades, not just HVAC.</p>
          <p className="story-line">And why he&rsquo;s scaled and sold multiple companies that had nothing to do with HVAC&hellip;</p>
          <p className="story-line"><Y>&hellip;all on these same universal systems.</Y></p>
          <p className="story-line">What changes is the logo on the truck.</p>
          <p className="story-line"><B>The standard underneath is the same.</B></p>

          <Sub className="mt-10 mb-8">&ldquo;I don&rsquo;t have time to train my team.&rdquo;</Sub>
          <p className="story-line">You&rsquo;re not the trainer anymore.</p>
          <p className="story-line">That&rsquo;s the entire point.</p>
          <p className="story-line">Your people watch focused 6&ndash;12 minute modules, take a quiz, earn a certificate.</p>
          <p className="story-line">You watch progress on a dashboard and tie it to pay or promotion.</p>
          <p className="story-line">Five minutes to assign. Then it runs without you.</p>

          <Sub className="mt-10 mb-8">&ldquo;My guys won&rsquo;t actually use it.&rdquo;</Sub>
          <p className="story-line">They will when it&rsquo;s tied to their paycheck.</p>
          <p className="story-line">And when it&rsquo;s this specific.</p>
          <p className="story-line">This isn&rsquo;t a motivation course.</p>
          <p className="story-line">It&rsquo;s the click-by-click of how the best shops in the country actually run.</p>
          <p className="story-line"><B>Your best people have been waiting for someone to hand them this.</B></p>
        </div>
      </section>

      {/* ═══ PROOF ═══ */}
      <section data-track-section="proof" className="bg-[#FBFAF7] py-16 sm:py-24">
        <div className="section-fade max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#0B2341] tracking-[0.03em] leading-[1.06] mb-10 text-center ${hFont}`}>
Who actually teaches this thing though?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-7 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#0B2341] flex items-center justify-center text-white font-bold shrink-0">TH</div>
                <div>
                  <p className={`font-extrabold text-[#0B2341] text-2xl sm:text-3xl ${hFont}`}>Tom Howard</p>
                  <p className="text-base text-[#BF0A30] font-semibold">Owner of Lee&rsquo;s Air · $150M+ Annual Revenue</p>
                </div>
              </div>
              <p className="text-lg text-[#475569] leading-relaxed">
                Tom started at Lee&rsquo;s Air at fifteen, sweeping floors. He came back to run it &mdash; and took it from $1.6M and eleven employees to over <B>$150M</B>, with a group now valued north of <B>$450M</B>. Every system in this library came from that operation. He&rsquo;s scaled and sold other companies and sits on the boards of some of the biggest operators in the nation. He&rsquo;s not a consultant. He lives it.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#BF0A30] flex items-center justify-center text-white font-bold shrink-0">PF</div>
                <div>
                  <p className={`font-extrabold text-[#0B2341] text-2xl sm:text-3xl ${hFont}`}>Phil Filaski</p>
                  <p className="text-base text-[#BF0A30] font-semibold">$19.6M Sold Annually. In Living Rooms.</p>
                </div>
              </div>
              <p className="text-lg text-[#475569] leading-relaxed">
                Phil is the <B>#1 residential HVAC salesperson in the country</B> &mdash; $19.6 million a year in personal residential sales. Not over the phone. In the home, knee-to-knee with the homeowner. He teaches the entire sales curriculum: the in-home process, objection handling, closing, and the maintenance-agreement plays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE OFFER — value stack + pricing ═══ */}
      <section data-track-section="offer" className="bg-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {/* bundle image */}
          <div className="section-fade flex justify-center mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/9-figure-bundle.webp"
              alt="The 9-Figure Operator's Playbooks — complete bundle"
              loading="lazy"
              decoding="async"
              className="w-full max-w-3xl h-auto"
            />
          </div>

          {/* value stack */}
          <div className="section-fade max-w-2xl mx-auto mb-14">
            <p className={`text-center text-sm sm:text-base font-black uppercase tracking-[0.3em] text-[#BF0A30] mb-3 ${hFont}`}>Everything you get</p>
            <h2 className={`text-center text-4xl sm:text-5xl font-black text-[#0B2341] tracking-[0.03em] leading-[1.05] mb-8 ${hFont}`}>
              All nine playbooks. One platform.
            </h2>
            <ul className="border-y border-gray-200 divide-y divide-gray-200">
              {PLAYBOOKS.map(([name, value]) => (
                <li key={name} className="flex items-center justify-between py-3.5">
                  <span className="text-lg text-[#0B2341] font-medium">The {name} Playbook</span>
                  <span className="text-lg text-[#475569] font-semibold">{value}</span>
                </li>
              ))}
              <li className="flex items-center justify-between py-4">
                <span className={`text-2xl text-[#0B2341] ${hFont} tracking-wide`}>Total value</span>
                <span className={`text-2xl text-[#0B2341] ${hFont}`}>$64,973</span>
              </li>
            </ul>
          </div>

          {/* price anchor */}
          <div className="section-fade text-center max-w-2xl mx-auto mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#0B2341] tracking-[0.03em] leading-[1.08] mb-4 ${hFont}`}>
              <span className="line-through text-[#475569]/60">$64,973</span> a la carte.<br className="hidden sm:inline" /> <span className="text-[#BF0A30]">From $549/m with us.</span>
            </h2>
            <p className="text-lg text-[#475569] leading-relaxed">
              One library. Three ways to roll it out &mdash; start with the essentials, run the full standard, or rebrand it as your own.
            </p>
          </div>

          {/* pricing tiers */}
          <div className="section-fade grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-4 pt-3">

            {/* Essentials */}
            <div className="bg-[#F5F5F3] rounded-2xl p-7 border-2 border-gray-200 flex flex-col">
              <p className={`text-base font-black text-[#BF0A30] tracking-[0.25em] mb-2 ${hFont}`}>ESSENTIALS</p>
              <h3 className={`font-black text-3xl text-[#0B2341] mb-1 ${hFont}`}>The Core Library</h3>
              <p className="text-base text-[#475569] mb-5">The standard library, minus the AI role-play module.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black text-[#0B2341] ${hFont}`}>$549</span>
                <span className="text-base text-[#475569] font-medium">/m</span>
              </div>
              <ul className="space-y-3 mb-7 flex-1">
                {["All 9 department curricula", "Quizzes + certificates per course", "Owner dashboard + progress tracking", "23-day Sales Huddle Series", "Quarterly content drops"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-base text-[#475569]"><Check className="shrink-0 mt-1 w-4 h-4 text-[#0B2341]" strokeWidth={3} aria-hidden="true" />{f}</li>
                ))}
              </ul>
              <button type="button" onClick={open} className={`w-full h-[56px] rounded-full border-2 border-[#BF0A30] text-[#BF0A30] font-bold text-lg tracking-[0.04em] hover:bg-[#BF0A30] hover:text-white transition-colors cursor-pointer ${hFont}`}>Book My Demo</button>
            </div>

            {/* Standard — most popular */}
            <div className="relative bg-[#0B2341] text-white rounded-2xl p-7 border-2 border-[#BF0A30] flex flex-col shadow-xl md:-mt-3 md:mb-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#BF0A30] text-white px-5 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-[#BF0A30]/30">
                <p className={`text-sm font-bold tracking-[0.25em] pl-[0.25em] ${hFont}`}>MOST POPULAR</p>
              </div>
              <p className={`text-base font-black text-[#BF0A30] tracking-[0.25em] mb-2 ${hFont}`}>STANDARD</p>
              <h3 className={`font-black text-3xl mb-1 ${hFont}`}>The Full Library</h3>
              <p className="text-base text-gray-300 mb-5">Every department. Every operator on your team.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black ${hFont}`}>$997</span>
                <span className="text-base text-gray-400 font-medium">/m</span>
              </div>
              <ul className="space-y-3 mb-7 flex-1">
                {["All 9 department curricula", <>Includes the <Y>AI sales role-play</Y> module</>, "Quizzes + certificates per course", "Owner dashboard + progress tracking", "23-day Sales Huddle Series", "Lock in $997/m before it goes to $1,497/m"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-base text-gray-200"><Check className="shrink-0 mt-1 w-4 h-4 text-[#BF0A30]" strokeWidth={3} aria-hidden="true" />{f}</li>
                ))}
              </ul>
              <button type="button" onClick={open} className={`w-full h-[56px] rounded-full bg-[#BF0A30] text-white font-bold text-lg tracking-[0.04em] hover:bg-[#D91C40] transition-colors cursor-pointer pulse-red ${hFont}`}>Book My Demo</button>
            </div>

            {/* White-Label */}
            <div className="bg-[#F5F5F3] rounded-2xl p-7 border-2 border-gray-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-[#BF0A30]" aria-hidden="true" />
                <p className={`text-base font-black text-[#BF0A30] tracking-[0.25em] ${hFont}`}>WHITE-LABEL</p>
              </div>
              <h3 className={`font-black text-3xl text-[#0B2341] mb-1 ${hFont}`}>Make It Yours</h3>
              <p className="text-base text-[#475569] mb-5">Everything in Standard &mdash; rebranded as your own.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black text-[#0B2341] ${hFont}`}>$1,497</span>
                <span className="text-base text-[#475569] font-medium">/m</span>
              </div>
              <ul className="space-y-3 mb-7 flex-1">
                {["Everything in Standard", "Certificates under your company name", "Portal branded as your operation", "Looks like it was built in-house", "A recruiting + retention edge"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-base text-[#475569]"><Check className="shrink-0 mt-1 w-4 h-4 text-[#0B2341]" strokeWidth={3} aria-hidden="true" />{f}</li>
                ))}
              </ul>
              <button type="button" onClick={open} className={`w-full h-[56px] rounded-full border-2 border-[#BF0A30] text-[#BF0A30] font-bold text-lg tracking-[0.04em] hover:bg-[#BF0A30] hover:text-white transition-colors cursor-pointer ${hFont}`}>Book My Demo</button>
            </div>
          </div>

          <p className="section-fade text-center text-sm text-gray-500 tracking-wide mt-8">
            Every plan starts with a 15-minute walkthrough. Nothing to install — see the exact systems live.
          </p>
        </div>
      </section>

      {/* ═══ RISK REVERSAL + FINAL CTA ═══ */}
      <section data-track-section="final_cta" className="relative bg-[#06192F] text-white pt-20 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[260px] bg-[#BF0A30]/[0.08] rounded-full blur-[110px] pointer-events-none glow-bg" aria-hidden="true" />
        <div className="section-fade relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.03em] leading-[1.02] mb-8 ${hFont}`}>
            Stop being the underpaid trainer. <span className="text-[#BF0A30]">Start being the CEO.</span>
          </h2>

          {/* bundle image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/9-figure-bundle.webp"
            alt="The 9-Figure Operator's Playbooks — complete bundle"
            loading="lazy"
            decoding="async"
            className="w-full max-w-lg mx-auto h-auto mb-8"
          />

          <p className="text-xl sm:text-2xl text-white font-semibold leading-snug mb-8">
            Book your training platform demo call to install the same systems that took Lee&rsquo;s Air past <span className="text-[#BF0A30]">$150 million</span> &mdash; and finally get your nights and weekends back.
          </p>

          <Cta onClick={open} className="w-full sm:w-auto" />
          <CtaNote />

          {/* P.S. */}
          <div className="mt-14 max-w-xl mx-auto text-left border-t border-white/10 pt-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              <B><span className="text-white">P.S.</span></B> &mdash; That vacation story? I take real ones now. My team runs the same nine playbooks whether I&rsquo;m there or not. That&rsquo;s the whole thing. That&rsquo;s what a standard buys you. Book the walkthrough and I&rsquo;ll show you how it&rsquo;s built.
            </p>
            <p className={`mt-4 text-xl text-white ${hFont} tracking-wide`}>— Tom Howard</p>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section data-track-section="faq" className="bg-[#06192F] text-white pt-4 pb-16 sm:pb-20">
        <div className="section-fade max-w-2xl mx-auto px-5 sm:px-8">
          <h2 className={`text-3xl sm:text-4xl font-black tracking-[0.03em] text-center mb-8 ${hFont}`}>
            Questions before you book?
          </h2>
          <div className="space-y-3">
            {FAQS.map(([q, a], i) => (
              <details key={i} className="group rounded-xl bg-white/[0.05] border border-white/10 px-5 py-4">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none text-white font-semibold text-lg leading-snug">
                  <span>{q}</span>
                  <span className="shrink-0 text-[#BF0A30] text-2xl leading-none transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-gray-300 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0B2341] text-center py-8 border-t border-white/10">
        <p className="text-xs text-gray-500">Real American Grit University · realamericangrit.com</p>
      </footer>
      <Stripe />
    </div>
  );
}
