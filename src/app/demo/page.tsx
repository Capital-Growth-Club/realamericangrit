"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import {
  Check,
  Wrench,
  Users,
  BarChart3,
  Crown,
  TrendingUp,
  Briefcase,
  DollarSign,
  Building2,
  Megaphone,
  PlayCircle,
  LayoutDashboard,
  Award,
  CalendarCheck,
} from "lucide-react";
import DemoBookingModal from "@/components/DemoBookingModal";

/* ─── heading font helper ─── */
const hFont = "font-[family-name:var(--font-bebas)]";

/* ─── CTA button (demo variant — opens the booking modal) ─── */
function CtaButton({
  variant = "red",
  className = "",
  label,
  onClick,
}: {
  variant?: "red" | "outline-white";
  className?: string;
  label?: string;
  onClick: () => void;
}) {
  const base = `inline-flex h-[64px] sm:h-[68px] items-center justify-center rounded-full px-10 text-xl sm:text-2xl font-bold tracking-[0.05em] cursor-pointer transition-colors duration-200 ${hFont}`;
  const styles = {
    red: `${base} bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] pulse-red`,
    "outline-white": `${base} border-2 border-white/30 text-white hover:bg-white/10 active:bg-white/5`,
  };
  const text = label ?? "Book My Demo";
  return (
    <button type="button" onClick={onClick} className={`${styles[variant]} ${className}`}>
      {text}
    </button>
  );
}

/* ─── CTA callout band — placed between sections to keep "Book My Demo" reachable ─── */
function CtaCallout({
  onClick,
  headline,
  bg = "navy",
}: {
  onClick: () => void;
  headline: React.ReactNode;
  bg?: "navy" | "deep";
}) {
  const bgClass = bg === "deep" ? "bg-[#06192F]" : "bg-[#0B2341]";
  return (
    <section className={`relative py-12 sm:py-16 ${bgClass} text-white overflow-hidden`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-[#BF0A30]/[0.07] rounded-full blur-[110px] pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BF0A30]/15 border border-[#BF0A30]/30 mb-4">
          <CalendarCheck className="w-3.5 h-3.5 text-[#BF0A30]" aria-hidden="true" />
          <p className={`text-xs font-bold tracking-[0.2em] text-[#BF0A30] ${hFont}`}>
            30-MINUTE WALKTHROUGH
          </p>
        </div>
        <p className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.05em] leading-[1.05] mb-6 ${hFont}`}>
          {headline}
        </p>
        <CtaButton variant="red" label="Book My Demo" onClick={onClick} />
      </div>
    </section>
  );
}

/* ─── Scroll reveal ─── */
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
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useHeroFade() {
  useEffect(() => {
    const els = document.querySelectorAll(".hero-fade");
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 100 + i * 100);
    });
  }, []);
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`section-fade ${className}`}>
      {children}
    </section>
  );
}

function Stagger({ children, i, className = "" }: { children: React.ReactNode; i: number; className?: string }) {
  return (
    <div className={`section-fade ${className}`} data-d={i < 5 ? i : 4}>
      {children}
    </div>
  );
}

/* ─── scroll-aware nav hook ─── */
function useScrollNav() {
  const [visible, setVisible] = useState(true);
  const [pastHero, setPastHero] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;

      setPastHero(y > heroHeight);

      if (y < heroHeight) {
        setVisible(true);
      } else if (y < lastY.current) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { visible, pastHero };
}

/* ─── data ─── */
const DEPARTMENTS = [
  { icon: TrendingUp, name: "Sales", desc: "Stop guessing why one tech closes 60% and another closes 20%. Your team runs the same proven in-home process — every call, every home, every time." },
  { icon: Briefcase, name: "Acquisitions", desc: "Buy a competitor without overpaying. Sell the company for what it's actually worth." },
  { icon: DollarSign, name: "Pricing", desc: "Most contractors are 5–15% under-priced and don't realize it. This is the section that pays for the subscription on day one." },
  { icon: Building2, name: "Corporate Structure", desc: "You finally understand the structure of your own business — and you fix the parts that are quietly costing you money or exposing you to risk." },
  { icon: BarChart3, name: "Financials", desc: "Profitable contractors go broke every year because nobody read the cash flow. This is the section that makes that impossible." },
  { icon: Megaphone, name: "Marketing", desc: "Your marketing stops being a slot machine. You know which dollar produces a booked job — and what to do with the leads everyone else lets die." },
  { icon: Wrench, name: "Operations", desc: "Fewer callbacks. Better reviews. Higher billable efficiency. The operation runs without you having to be in it." },
  { icon: Users, name: "Human Resources", desc: "Hiring becomes a pipeline, not a panic. Onboarding is structured. Your best people stay. Your bad fits leave fast and cheap." },
  { icon: Crown, name: "Leadership", desc: "Your managers actually manage. They make decisions, run their departments, hold the standard. You stop being the only adult in the room." },
];

const DEPARTMENT_DEEP = [
  {
    icon: TrendingUp,
    num: "01",
    name: "Sales",
    image: "/Sales Playbook.png",
    price: 9997,
    headline: "How to turn every rep into a top closer.",
    bullets: [
      { title: "The $19.6M Step-by-Step In-Home Sales Process", desc: "Hand your reps the proven sequence they run on every in-home call." },
      { title: "FLIP, Selling Tech, or Hybrid", desc: "Discover the sales model that closes more deals for your shop." },
      { title: "The Advanced Objection Handling Playbook", desc: "Crush stalls, spouse excuses, and price pushback." },
      { title: "The Golden Nugget Close", desc: "Land maintenance agreements on most closed jobs." },
      { title: "The 23-Day Sales Huddle Series", desc: "Get 23 days of morning meetings already written for your team." },
    ],
  },
  {
    icon: Briefcase,
    num: "02",
    name: "Acquisitions",
    image: "/Acquisitions Playbook.png",
    price: 4997,
    headline: "How to scale through acquisitions without overpaying.",
    bullets: [
      { title: "The Acquisition Sourcing Framework", desc: "Get the playbook for finding and pricing home service deals worth buying." },
      { title: "The Deal Structure Playbook", desc: "Know whether to fold a competitor into your shop or run them as their own brand." },
      { title: "The Operator-to-Operator Negotiation Script", desc: "Sit down with the other owner backed by a proven script — no overpaying." },
      { title: "The Sale-Ready Audit", desc: "Set up today so a buyer pays what the company is actually worth." },
    ],
  },
  {
    icon: DollarSign,
    num: "03",
    name: "Pricing",
    image: "/Pricing Playbook.png",
    price: 4997,
    headline: "How to make more money on every job you sell.",
    bullets: [
      { title: "Markup vs. Divisor — The Margin Breakdown", desc: "Recover the 5–15% margin most contractors leave on the table." },
      { title: "The Divisor Method Pricebook", desc: "Use the pricebook that protects margin automatically." },
      { title: "The Gross Profit Per Man-Day Filter", desc: "Filter every job before it ever gets quoted." },
      { title: "Overhead Per Man-Day + Billable Efficiency", desc: "Watch the two numbers most owners ignore until it's too late." },
      { title: "The Margin Adjustment Cadence", desc: "Hold pricing through vendor and labor cost shifts." },
    ],
  },
  {
    icon: Building2,
    num: "04",
    name: "Corporate Structure",
    image: "/Corporate Structures Playbook.png",
    price: 2997,
    headline: "How to keep more of the money you make.",
    bullets: [
      { title: "The Tax Strategy for Scaling Shops", desc: "Cut the tax bill that quietly grows with revenue." },
      { title: "The LLC vs. S-Corp Restructure Decision", desc: "Know when your current entity starts costing more than it saves." },
      { title: "The Owner's Comp Strategy", desc: "Pay yourself the right way without overpaying the IRS." },
      { title: "The Asset Protection Stack", desc: "Plug in the liability firewall most contractors skip." },
    ],
  },
  {
    icon: BarChart3,
    num: "05",
    name: "Financials",
    image: "/Financials Playbook.png",
    price: 7997,
    headline: "How to stop feeling broke and spend money confidently.",
    bullets: [
      { title: "The P&L Walkthrough — Line by Line", desc: "Run the business off your P&L — not the bank balance." },
      { title: "Job Costing + Field Accountability", desc: "Spot margin leaks before they ever hit cash." },
      { title: "The Assets, Liabilities & Equity Playbook", desc: "Decode every number on the balance sheet without the accountant-speak." },
      { title: "The Operator's Cash Flow Rhythm", desc: "Make \"profitable but broke\" impossible." },
      { title: "The Contractor Financial Ratios Scorecard", desc: "Know if you're really ready to scale." },
    ],
  },
  {
    icon: Megaphone,
    num: "06",
    name: "Marketing",
    image: "/Marketing Playbook.png",
    price: 9997,
    headline: "How to turn $1 of marketing into $10.",
    bullets: [
      { title: "The Positioning & Differentiation Framework", desc: "Stop competing with the cheapest guy in town." },
      { title: "The Lead-Generating Website Blueprint", desc: "Plug in the website blueprint that produces calls, not impressions." },
      { title: "Google Business Profile Mastery", desc: "Win local SEO so the phone rings on autopilot." },
      { title: "The Paid Ads Playbook — LSAs, Google, Facebook & Lead Aggregators", desc: "Run paid ads at a known cost-per-booked-job." },
      { title: "The Follow-Up & Lifetime Value System", desc: "Resurrect dead leads everyone else lets die." },
      { title: "The 144-Minute Service Guarantee", desc: "Turn every install into a 5-star review." },
    ],
  },
  {
    icon: Wrench,
    num: "07",
    name: "Operations",
    image: "/Operations Playbook.png",
    price: 9997,
    headline: "How to take a month off without anything falling apart.",
    bullets: [
      { title: "The Scheduling & Capacity Planning Grid", desc: "End the daily dispatch fire drill." },
      { title: "The Quality Control Checkpoint System", desc: "Cut callbacks before they cost the next job." },
      { title: "The Inventory & Asset Management Framework", desc: "Get every truck stocked right, every time." },
      { title: "The Metrics & KPI Dashboard", desc: "Plug in the dashboard layer for visibility you've never had." },
      { title: "The SOPs & Systems Framework", desc: "Get the operation documented so it runs without you." },
      { title: "The Operator's Growth Sequence", desc: "Scale without breaking the business." },
    ],
  },
  {
    icon: Users,
    num: "08",
    name: "Human Resources",
    image: "/Human Resources Playbook.png",
    price: 3997,
    headline: "How to hire and retain good talent forever.",
    bullets: [
      { title: "The Workforce Planning Framework", desc: "Plug in the hiring pipeline that works in any labor market." },
      { title: "The Structured Onboarding System", desc: "Get new hires productive in days, not months." },
      { title: "The Performance & Accountability Playbook", desc: "Run real performance management without becoming HR yourself." },
      { title: "The Pay-for-Performance Ladder", desc: "Keep your best people loyal." },
      { title: "The Trades-Specific HR Stack", desc: "Get compliance, risk, and safety covered." },
    ],
  },
  {
    icon: Crown,
    num: "09",
    name: "Leadership",
    image: "/Leadership Playbook.png",
    price: 9997,
    headline: "How to build culture and leadership that runs without you.",
    bullets: [
      { title: "The Leadership Transition Sequence", desc: "Step out of doing the work and into leading it." },
      { title: "The Authority Foundations Framework", desc: "Get the credibility, respect, and authority your team actually follows." },
      { title: "The Manager Development Playbook", desc: "Promote techs into managers without watching them flounder." },
      { title: "The Performance Conversation Script", desc: "Run accountability without becoming the bad guy." },
      { title: "The Owner's Decision Framework", desc: "Decide under pressure without flinching." },
      { title: "The Succession Stack", desc: "Get standards and culture that hold up after you sell." },
    ],
  },
];

const PLATFORM = [
  { icon: Award, title: "Certificates per Course", desc: "Every operator earns a printed-and-trackable certificate per course. Goes in the personnel file. Can be tied to compensation." },
  { icon: LayoutDashboard, title: "Owner Dashboard", desc: "See who's started what, who's finished, and who's dragging their feet. The accountability layer that makes the whole thing work." },
  { icon: PlayCircle, title: "23-Day Sales Huddle Series", desc: "Bite-sized morning meeting content your Sales Lead can run without writing huddle agendas themselves." },
  { icon: TrendingUp, title: "Quarterly Content Drops", desc: "Tom and Phil are still operators. New modules drop quarterly as the field evolves. No extra cost." },
];


/* ═══════════════════════════════════════════ */
export default function Demo() {
  const { visible } = useScrollNav();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  useReveal();
  useHeroFade();

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <DemoBookingModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ═══ BANNER + NAV ═══ */}
      <div className={`nav-slide fixed top-0 left-0 right-0 z-50 ${visible ? "" : "hidden-up"}`}>
        <div className="bg-[#06192F] text-white px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute -inset-1.5 rounded-full bg-[#BF0A30] animate-ping opacity-60" />
              <span className="absolute -inset-0.5 rounded-full bg-[#BF0A30]/40 animate-pulse" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#BF0A30]" />
            </span>
            <p className={`text-sm sm:text-xl md:text-2xl font-bold uppercase tracking-[0.12em] text-center ${hFont}`}>
              See It Live: Book A Free Walkthrough Of The Platform
            </p>
          </div>
        </div>
        <nav className="bg-[#0B2341] border-b border-white/10" role="navigation" aria-label="Main">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-[72px]">
            <a href="/demo" className="flex items-center cursor-pointer" aria-label="Real American Grit University — Demo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
                alt="Real American Grit University"
                className="h-12 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={openModal}
              className={`hidden sm:inline-flex h-12 items-center rounded-full bg-[#BF0A30] px-7 text-base sm:text-lg font-bold tracking-[0.05em] text-white cursor-pointer hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 ${hFont}`}
            >
              Book My Demo
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for banner + nav */}
      <div className="h-[120px] sm:h-[140px] bg-[#0B2341]" />

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#0B2341] text-white overflow-hidden">
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#BF0A30]/[0.05] rounded-full blur-[140px] pointer-events-none glow-bg" aria-hidden="true" />

        <div className="relative max-w-[820px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 md:pt-32 pb-20 sm:pb-28 md:pb-36 text-center">
          <p className={`hero-fade uppercase text-sm sm:text-base font-bold tracking-[0.25em] text-gray-300 mb-6 ${hFont}`}>
            For home service owners doing $2M – $10M
          </p>

          <h1 className={`hero-fade text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-black tracking-[0.05em] leading-[0.95] mb-5 ${hFont}`}>
            Stop Being<br className="md:hidden" /> The Reason<br className="md:hidden" /> Your Company<br /> <span className="text-[#BF0A30]">Can&rsquo;t Grow.</span>
          </h1>

          <p className="hero-fade text-lg sm:text-xl md:text-[22px] text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Train every operator on your team — GM, Service Manager, Install
            Manager, Sales Lead, CSR, Technician — with the exact SOPs that
            built a $140M+ home services operation. Without you
            having to be the trainer.
          </p>

          <div className="hero-fade mb-8 w-full flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/9 Figure Operators Bundle.png"
              alt="The 9-Figure Operator's Playbooks — complete bundle"
              className="w-full max-w-3xl h-auto"
            />
          </div>

          <div className="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <CtaButton variant="red" className="w-full sm:w-auto" label="Book My Demo" onClick={openModal} />
          </div>

          <p className="hero-fade text-sm text-gray-500">
            Built by <span className="text-gray-300 font-medium">Tom Howard</span> (Owner of Lee&rsquo;s Air · $140M+ Annual Revenue) and <span className="text-gray-300 font-medium">Phil Filaski</span> ($19.6M in residential HVAC sales)
          </p>
        </div>
      </section>

      {/* ═══ CURRICULUM — 9 DEPARTMENTS ═══ */}
      <Section id="curriculum" className="scroll-mt-[140px] py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-3 ${hFont}`}>What&rsquo;s inside</p>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-[#0B2341] tracking-[0.05em] leading-[1.1] mb-4 ${hFont}`}>
              9 Departments. 50+ Courses. <span className="text-[#BF0A30]">Zero Theory.</span>
            </h2>
            <p className="text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Every system in this library came from a real $140M+
              home services operation. Not a single module is theoretical.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <Stagger key={dept.name} i={i} className="bg-[#EDEDED] rounded-2xl p-6 border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-[#BF0A30]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#BF0A30]" aria-hidden="true" />
                  </div>
                  <p className={`font-bold text-[#0B2341] text-2xl sm:text-3xl tracking-[0.05em] mb-2 ${hFont}`}>{dept.name}</p>
                  <p className="text-base sm:text-lg text-[#475569] leading-relaxed">{dept.desc}</p>
                </Stagger>
              );
            })}
          </div>

          {/* Platform features */}
          <div className="bg-[#0B2341] text-white rounded-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-4 ${hFont}`}>Plus the platform</p>
              <h3 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.05em] leading-[1.1] ${hFont}`}>
                The accountability layer that makes it actually work.
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PLATFORM.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="text-left">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#BF0A30]" aria-hidden="true" />
                    </div>
                    <p className={`font-bold text-white text-xl sm:text-2xl mb-2 tracking-[0.05em] ${hFont}`}>{feat.title}</p>
                    <p className="text-base sm:text-lg text-gray-400 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <CtaCallout
        onClick={openModal}
        headline={<>See the platform that runs the <span className="text-[#BF0A30]">whole operation</span>.</>}
      />

      {/* ═══ DEPARTMENT DEEP DIVES (9 sections) ═══ */}
      <Section className="py-20 sm:py-28 bg-[#0B2341] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#BF0A30]/[0.06] rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-5 ${hFont}`}>
            What you get — department by department
          </p>
          <h2 className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-[0.05em] leading-[0.95] mb-6 ${hFont}`}>
            The 9-Figure<br className="md:hidden" /> Operator&rsquo;s<br /> <span className="text-[#BF0A30]">Playbooks.</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The training system that turns your whole team into <span className="text-white font-semibold">9-figure operators</span>.
          </p>
        </div>
      </Section>

      {DEPARTMENT_DEEP.map((dept, i) => {
        const isReverse = i % 2 === 1;
        // Insert a CTA callout after Pricing (i=2), Marketing (i=5), and Leadership (i=8)
        // — three natural breakpoints across the 9 deep-dive sections.
        const showCalloutAfter = i === 2 || i === 5 || i === 8;
        const calloutHeadlines = [
          <>Want a guided tour of <span className="text-[#BF0A30]">pricing &amp; financials</span>?</>,
          <>Ready to see the <span className="text-[#BF0A30]">marketing engine</span> live?</>,
          <>See how it all <span className="text-[#BF0A30]">runs without you</span>.</>,
        ];
        const headlineIdx = i === 2 ? 0 : i === 5 ? 1 : 2;
        return (
          <Fragment key={dept.num}>
          <Section className={`py-20 sm:py-28 ${isReverse ? "bg-[#EDEDED]" : "bg-white"}`}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Playbook cover column */}
                <div className={`flex justify-center ${isReverse ? "lg:order-2 lg:justify-start" : "lg:justify-end"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dept.image}
                    alt={`The 9-Figure Operator's ${dept.name} Playbook`}
                    className="w-full max-w-[380px] sm:max-w-[440px] h-auto"
                    style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.08)) drop-shadow(0 24px 36px rgba(0,0,0,0.22))" }}
                  />
                </div>

                {/* Content column */}
                <div className={isReverse ? "lg:order-1" : ""}>
                  <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-4 ${hFont}`}>
                    The 9-Figure Operator&rsquo;s Playbook · Vol. {dept.num}
                  </p>
                  <h3 className={`font-black text-5xl sm:text-6xl lg:text-7xl text-[#0B2341] mb-6 tracking-[0.05em] leading-[1.02] ${hFont}`}>
                    {dept.name}
                  </h3>
                  <p className={`border-l-4 border-[#BF0A30] pl-5 text-3xl sm:text-4xl md:text-5xl text-[#0B2341] font-bold mb-10 leading-[1.05] tracking-[0.05em] ${hFont}`}>
                    {dept.headline}
                  </p>
                  <ul className="space-y-5 max-w-2xl">
                    {dept.bullets.map((b, j) => (
                      <li key={j} className="flex gap-4">
                        <Check className="shrink-0 mt-2 w-6 h-6 text-[#BF0A30]" strokeWidth={3} aria-hidden="true" />
                        <div>
                          <p className={`text-xl sm:text-2xl text-[#0B2341] font-bold leading-[1.1] tracking-[0.05em] ${hFont}`}>
                            {b.title}
                          </p>
                          <p className="text-base sm:text-lg text-[#475569] mt-1.5 leading-snug">
                            {b.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                    <li className="flex gap-4 pt-2">
                      <span className="shrink-0 w-6 h-6 flex items-center justify-center text-[#BF0A30] font-black text-3xl leading-none mt-1" aria-hidden="true">+</span>
                      <p className={`text-base sm:text-lg font-black text-[#BF0A30] tracking-[0.2em] uppercase pt-1 ${hFont}`}>
                        Plus more inside
                      </p>
                    </li>
                  </ul>

                  {/* Value tag */}
                  <div className="mt-10 pt-7 border-t border-gray-200">
                    <p className={`text-4xl sm:text-5xl font-black text-[#0B2341] tracking-[0.05em] ${hFont}`}>
                      ${dept.price.toLocaleString()} <span className="text-lg sm:text-xl font-bold text-[#475569] uppercase tracking-[0.2em] ml-2">Value</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
          {showCalloutAfter && (
            <CtaCallout
              onClick={openModal}
              headline={calloutHeadlines[headlineIdx]}
              bg={i === 5 ? "deep" : "navy"}
            />
          )}
          </Fragment>
        );
      })}

      {/* ═══ FINAL CTA ═══ */}
      <Section className="relative py-20 sm:py-28 bg-[#0B2341] text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#BF0A30]/[0.06] rounded-full blur-[100px] pointer-events-none glow-bg" aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.05em] leading-[1.1] mb-4 ${hFont}`}>
            Your business is worth what your <span className="text-[#BF0A30]">systems</span> are worth.
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-8 font-light leading-relaxed">
            Right now, the operation runs on what&rsquo;s in your head. That&rsquo;s not a business — that&rsquo;s a job. Hand it over.
          </p>
          <CtaButton variant="red" label="Book My Demo" onClick={openModal} />
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#06192F] text-gray-500 py-10" role="contentinfo">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex flex-col items-center sm:items-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
              alt="Real American Grit University"
              className="h-9 w-auto"
            />
            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] text-[#BF0A30] ${hFont}`}>
              Build. Grow. Succeed.
            </p>
          </div>
          <p>© {new Date().getFullYear()} Real American Grit University. All rights reserved.</p>
          <a href="mailto:info@realamericangrit.com" className="cursor-pointer hover:text-white transition-colors duration-200">
            info@realamericangrit.com
          </a>
        </div>
        <div className="mt-8 h-1 flex" aria-hidden="true">
          <div className="flex-1 bg-[#BF0A30]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#0B2341]" />
        </div>
      </footer>
    </div>
  );
}
