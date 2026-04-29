"use client";

import { useRef, useState, useEffect } from "react";
import {
  TrendingDown,
  Flame,
  DoorOpen,
  Target,
  Settings,
  ShieldAlert,
  Check,
  ArrowDown,
  Wrench,
  Users,
  BarChart3,
  Crown,
  PhoneOff,
  UserX,
  Star,
  TrendingUp,
  Briefcase,
  DollarSign,
  Building2,
  Megaphone,
  PlayCircle,
  LayoutDashboard,
  Award,
  Palette,
} from "lucide-react";
import CheckoutModal from "@/components/CheckoutModal";
import VSLPlayer from "@/components/VSLPlayer";

/* ─── heading font helper ─── */
const hFont = "font-[family-name:var(--font-bebas)]";

/* ─── CTA button reusable ─── */
function CtaButton({ variant = "red", className = "", onClick, href, label }: { variant?: "red" | "outline-white" | "outline-dark"; className?: string; onClick?: () => void; href?: string; label?: string }) {
  const base = `inline-flex h-[64px] sm:h-[68px] items-center justify-center rounded-full px-10 text-xl sm:text-2xl font-bold tracking-[0.05em] cursor-pointer transition-colors duration-200 ${hFont}`;
  const styles = {
    red: `${base} bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] pulse-red`,
    "outline-white": `${base} border-2 border-white/30 text-white hover:bg-white/10 active:bg-white/5`,
    "outline-dark": `${base} border-2 border-[#0B2341]/20 text-[#0B2341] hover:bg-[#0B2341]/5 active:bg-[#0B2341]/10`,
  };
  const defaultLabel = variant === "red" ? "Train My Team — $997/m" : "Enroll Now — $997/m";
  const text = label ?? defaultLabel;
  if (href) {
    return (
      <a href={href} className={`${styles[variant]} ${className}`}>
        {text}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${styles[variant]} ${className}`}>
      {text}
    </button>
  );
}

/* ─── Scroll reveal — pure CSS transitions + IntersectionObserver (same as CGC) ─── */
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

/* Hero fade — triggers on mount with staggered delays */
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

      // Show nav when scrolling up or at the top
      if (y < heroHeight) {
        setVisible(true);
      } else if (y < lastY.current) {
        setVisible(true); // scrolling up
      } else {
        setVisible(false); // scrolling down
      }

      lastY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { visible, pastHero };
}

/* ─── data ─── */
const PROBLEMS = [
  { icon: TrendingDown, title: "Revenue Has Flatlined", desc: "You hit a ceiling. More hours, same number. The operational bottleneck is real — but you can't fix what you can't see." },
  { icon: Flame, title: "You ARE the Business", desc: "Every important call comes back to you. Take a week off and the wheels come off. Your team knows it. You know it." },
  { icon: DoorOpen, title: "Everything You Know Walks Out the Door", desc: "Every system, script, and SOP lives in your head. When a top tech quits, your playbook walks out with them." },
  { icon: UserX, title: "The Bad-Hire Cycle", desc: "You hire, they fail at 90 days, you blame the labor market, you start over. The actual problem? No onboarding system." },
  { icon: Target, title: "Sales Are Inconsistent", desc: "One tech closes 60%, another closes 20%. The difference is whatever they remember from the truck ride that morning." },
  { icon: ShieldAlert, title: "Tired of Theory", desc: "Coaches who've never run a truck. Gurus who've never sold an HVAC system in a living room. You want operators, not theorists." },
];

const HOW_IT_WORKS = [
  { num: "01", icon: Settings, title: "Subscribe & Assign", desc: "Add your team — GM, Service Manager, Sales Lead, CSRs, Techs. Assign courses by role in 5 minutes." },
  { num: "02", icon: PlayCircle, title: "They Train. They Certify.", desc: "Operators watch focused 6–12 minute video modules. They take comprehension quizzes. They earn a certificate per course." },
  { num: "03", icon: LayoutDashboard, title: "You Track. You Lead.", desc: "Watch progress on the owner dashboard. Tie certificates to pay or promotion. Stop being the trainer. Start being the CEO." },
];

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
    price: 3997,
    headline: "How to hire people who don't quit and walk off with what you taught them.",
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
    price: 9997,
    headline: "How to build the culture and leadership that runs without you.",
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
export default function Home() {
  const { visible } = useScrollNav();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  useReveal();
  useHeroFade();

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Checkout modal */}
      <CheckoutModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ═══ BANNER + NAV — single fixed block, no gap ═══ */}
      <div className={`nav-slide fixed top-0 left-0 right-0 z-50 ${visible ? "" : "hidden-up"}`}>
        {/* Announcement banner */}
        <div className="bg-[#06192F] text-white px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute -inset-1.5 rounded-full bg-[#BF0A30] animate-ping opacity-60" />
              <span className="absolute -inset-0.5 rounded-full bg-[#BF0A30]/40 animate-pulse" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#BF0A30]" />
            </span>
            <p className={`text-sm sm:text-xl md:text-2xl font-bold uppercase tracking-[0.12em] text-center ${hFont}`}>
              Live: Get The 9 Figure Operator Playbooks Before The Price Goes Up
            </p>
          </div>
        </div>
        {/* Nav — now navy to match brand */}
        <nav className="bg-[#0B2341] border-b border-white/10" role="navigation" aria-label="Main">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-[72px]">
            <a href="/coaching" className="flex items-center cursor-pointer" aria-label="Real American Grit University — Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
                alt="Real American Grit University"
                className="h-12 w-auto"
              />
            </a>
            <a href="#curriculum" className={`hidden sm:inline-flex h-12 items-center rounded-full bg-[#BF0A30] px-7 text-base sm:text-lg font-bold tracking-[0.05em] text-white cursor-pointer hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 ${hFont}`}>
              Show Me The Trainings
            </a>
          </div>
        </nav>
      </div>

      {/* Spacer for banner + nav — navy so no white gap between header and hero */}
      <div className="h-[120px] sm:h-[140px] bg-[#0B2341]" />

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#0B2341] text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 flex z-10" aria-hidden="true">
          <div className="flex-1 bg-[#BF0A30]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#0B2341]" />
        </div>
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#BF0A30]/[0.05] rounded-full blur-[140px] pointer-events-none glow-bg" aria-hidden="true" />

        <div className="relative max-w-[820px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 md:pt-32 pb-20 sm:pb-28 md:pb-36 text-center">
          <p className={`hero-fade uppercase text-base sm:text-lg md:text-xl font-bold tracking-[0.25em] text-gray-300 mb-6 ${hFont}`}>
            For home service owners doing $2M – $10M
          </p>

          <h1 className={`hero-fade text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black tracking-[0.05em] leading-[1.0] mb-5 ${hFont}`}>
            Stop Being The Reason Your Company <span className="text-[#BF0A30]">Can&rsquo;t Grow.</span>
          </h1>

          <p className="hero-fade text-lg sm:text-xl md:text-[22px] text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Train every operator on your team — GM, Service Manager, Install
            Manager, Sales Lead, CSR, Technician — with the exact SOPs that
            built a $1 billion home services operation. Without you
            having to be the trainer.
          </p>

          <div className="hero-fade mb-8 w-full">
            <VSLPlayer />
          </div>

          <div className="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <CtaButton variant="red" className="w-full sm:w-auto" href="#curriculum" label="Show Me The Trainings" />
          </div>

          <p className="hero-fade text-sm text-gray-500">
            Built by <span className="text-gray-300 font-medium">Tom Howard</span> (President of ServiceTitan · Owner of Leesair $1B+) and <span className="text-gray-300 font-medium">Phil Filaski</span> ($19.6M in residential HVAC sales)
          </p>
        </div>
      </section>

      {/* ═══ CREDIBILITY ═══ */}
      <Section className="bg-[#EDEDED] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className={`text-4xl sm:text-5xl font-black text-[#0B2341] tracking-[0.05em] leading-[1.1] ${hFont}`}>
              The Operators Behind It Who&rsquo;ve Actually Done It Themselves.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <Stagger i={0} className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#0B2341] flex items-center justify-center text-white font-bold text-base shrink-0">TH</div>
                <div>
                  <p className={`font-extrabold text-[#0B2341] text-2xl sm:text-3xl ${hFont}`}>Tom Howard</p>
                  <p className="text-base text-[#BF0A30] font-semibold">Owner of Leesair · President of ServiceTitan</p>
                </div>
              </div>
              <p className="text-base text-[#475569] leading-relaxed">
                Every system in this library came from <strong className="text-[#0B2341] font-semibold">Leesair</strong> — the home services operation Tom actually built, now valued past <strong className="text-[#0B2341] font-semibold">$1 billion</strong>. He&rsquo;s not a consultant. He lived it.
              </p>
            </Stagger>
            <Stagger i={1} className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#BF0A30] flex items-center justify-center text-white font-bold text-base shrink-0">PF</div>
                <div>
                  <p className={`font-extrabold text-[#0B2341] text-2xl sm:text-3xl ${hFont}`}>Phil Filaski</p>
                  <p className="text-base text-[#BF0A30] font-semibold">$19.6M Sold. In Living Rooms.</p>
                </div>
              </div>
              <p className="text-base text-[#475569] leading-relaxed">
                Phil is the <strong className="text-[#0B2341] font-semibold">#1 residential HVAC salesperson in the country</strong>. $19.6 million in personal residential sales — not over the phone, not on Zoom. In the home, knee-to-knee with the homeowner. He teaches the entire sales curriculum: the in-home process, objection handling, closing techniques, and the maintenance agreement plays.
              </p>
            </Stagger>
          </div>
        </div>
      </Section>

      {/* ═══ PROBLEMS ═══ */}
      <Section id="problems" className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-3 ${hFont}`}>Sound familiar?</p>
              <h2 className={`text-4xl sm:text-5xl font-black text-[#0B2341] tracking-[0.05em] leading-[1.1] mb-4 ${hFont}`}>
                You already know what&rsquo;s wrong.
              </h2>
              <p className="text-base text-[#475569] leading-relaxed">
                These are the bottlenecks that keep $2M – $10M home service companies stuck under their own ceiling.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROBLEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Stagger key={i} i={i} className="group p-5 rounded-xl bg-[#EDEDED] hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-200 cursor-default">
                    <Icon className="w-5 h-5 text-[#BF0A30] mb-3" aria-hidden="true" />
                    <p className={`font-extrabold text-[#0B2341] text-2xl sm:text-3xl tracking-[0.05em] mb-2 ${hFont}`}>{item.title}</p>
                    <p className="text-base sm:text-lg text-[#475569] leading-relaxed">{item.desc}</p>
                  </Stagger>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ AGITATION ═══ */}
      <Section className="relative py-20 sm:py-28 bg-[#0B2341] text-white">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: "linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-[0.05em] mb-5 ${hFont}`}>
              Your team is good people.<br />They just don&rsquo;t have <span className="text-[#BF0A30]">a standard.</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed font-light max-w-2xl mx-auto">
              No playbook. No training. No system. Just whatever you happened to teach them on the truck ride that morning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { icon: PhoneOff, title: "Leads Going Cold", desc: "New leads sit untouched. Nobody owns the follow-up — so your competitor closes them while your CSR's still hunting for the script." },
              { icon: Target, title: "Inconsistent Close Rates", desc: "Your team wings every call. Some months are great, others are a scramble — because there's no system, just whoever's on the truck." },
              { icon: Star, title: "Reviews Trickle In", desc: "A 3-day callback delay turns into a 2-star review that costs you 10 future jobs. Your CSR didn't know the right thing to say." },
              { icon: UserX, title: "New Hires Quit at 90 Days", desc: "You find a solid hire but have nothing to hand them on day one. They're lost in 2 weeks and gone in 2 months." },
              { icon: Flame, title: "You’re the Trainer Too", desc: "Every new hire learns from you. Every onboarding burns your week. Multiply by 6 hires a year — that's the bottleneck." },
              { icon: Briefcase, title: "The Business Won’t Sell", desc: "A buyer asked about your systems and now your company's worth half what you thought. Without documented playbooks, the business IS you." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Stagger key={i} i={i} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#BF0A30]/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#BF0A30]" aria-hidden="true" />
                  </div>
                  <p className={`font-bold text-white text-2xl mb-2 ${hFont}`}>{item.title}</p>
                  <p className="text-base text-gray-400 leading-relaxed">{item.desc}</p>
                </Stagger>
              );
            })}
          </div>

          {/* Blueprint close */}
          <div className="text-center border-t border-white/10 pt-10 max-w-2xl mx-auto">
            <p className={`text-2xl sm:text-3xl font-black tracking-[0.05em] mb-3 ${hFont}`}>
              You don&rsquo;t need another guru.
            </p>
            <p className="text-gray-400 leading-relaxed max-w-lg mx-auto font-light">
              You need an operating system. The training stops living in your
              head. The standard finally exists. The bottleneck is gone.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ SOLUTION INTRO ═══ */}
      <Section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#0B2341] mb-5 ${hFont}`}>Introducing</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
            alt="Real American Grit University"
            className="mx-auto h-auto w-auto max-h-36 sm:max-h-48 md:max-h-60 mb-7"
          />
          {/* Hidden h2 for SEO/a11y */}
          <h2 className="sr-only">What is Real American Grit University?</h2>
          <p className="text-lg text-[#475569] leading-relaxed mb-4">
            Get the <strong className="text-[#0B2341]">9 playbooks</strong> Tom used to run a <strong className="text-[#0B2341]">$1 billion home services company</strong> — now broken into video trainings that install a <strong className="text-[#0B2341]">9-figure standard</strong> into every operator on your team.
          </p>
          <p className="text-lg text-[#475569] leading-relaxed mb-4">
            Every department. Every role. Every operator. You assign the playbooks by role. Your team watches the videos. They take the quizzes. They earn the certificates. You watch their progress on one dashboard.
          </p>
          <p className="text-lg text-[#0B2341] font-bold leading-relaxed">
            You stop being the trainer. You start being the CEO.
          </p>
        </div>
      </Section>

      {/* ═══ HOW IT WORKS ═══ */}
      <Section className="py-16 sm:py-24 bg-[#EDEDED]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-3 ${hFont}`}>How it works</p>
            <h2 className={`text-4xl sm:text-5xl font-black text-[#0B2341] tracking-[0.05em] leading-[1.1] ${hFont}`}>
              Three steps. No rollout. No theory.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Stagger key={step.num} i={i} className="bg-white rounded-2xl p-7 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-base sm:text-lg font-black text-[#BF0A30] tracking-[0.25em] ${hFont}`}>STEP {step.num}</span>
                    <div className="h-px flex-1 bg-gray-200" />
                    <Icon className="w-5 h-5 text-[#0B2341]" aria-hidden="true" />
                  </div>
                  <p className={`font-bold text-[#0B2341] text-2xl sm:text-3xl tracking-[0.05em] mb-2 ${hFont}`}>{step.title}</p>
                  <p className="text-base sm:text-lg text-[#475569] leading-relaxed">{step.desc}</p>
                </Stagger>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══ CURRICULUM — 9 DEPARTMENTS ═══ */}
      <Section id="curriculum" className="scroll-mt-[140px] py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-3 ${hFont}`}>What&rsquo;s inside</p>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-[#0B2341] tracking-[0.05em] leading-[1.1] mb-4 ${hFont}`}>
              9 Departments. 50+ Courses. <span className="text-[#BF0A30]">Zero Theory.</span>
            </h2>
            <p className="text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Every system in this library came from a real $1 billion+
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
              <h3 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.05em] leading-[1.1] ${hFont}`}>
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

      {/* ═══ DEPARTMENT DEEP DIVES (9 sections) ═══ */}
      <Section className="py-20 sm:py-28 bg-[#0B2341] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#BF0A30]/[0.06] rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-5 ${hFont}`}>
            What you get — department by department
          </p>
          <h2 className={`text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black tracking-[0.05em] leading-[1.0] mb-6 ${hFont}`}>
            The 9-Figure Operator&rsquo;s <span className="text-[#BF0A30]">Playbook.</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The training system that turns your whole team into <span className="text-white font-semibold">9-figure operators</span>.
          </p>
        </div>
      </Section>

      {DEPARTMENT_DEEP.map((dept, i) => {
        const isReverse = i % 2 === 1;
        return (
          <Section key={dept.num} className={`py-20 sm:py-28 ${isReverse ? "bg-[#EDEDED]" : "bg-white"}`}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Playbook cover column */}
                <div className={`flex justify-center ${isReverse ? "lg:order-2 lg:justify-start" : "lg:justify-end"}`}>
                  {/* TODO: replace with <img src={`/playbooks/${dept.num}.webp`} ... /> when renders are ready */}
                  <div
                    className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[3/4] rounded-lg overflow-hidden shadow-2xl shadow-black/30 border border-white/10"
                    style={{ transform: "perspective(1200px) rotateY(-4deg)" }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B2341] via-[#0B2341] to-black" />
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#BF0A30]" />
                    <div
                      className="absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)",
                        backgroundSize: "12px 12px",
                      }}
                    />
                    <div className="relative h-full flex flex-col justify-between p-7 sm:p-8 text-white">
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-[#BF0A30] mb-2 ${hFont}`}>
                          The 9-Figure Operator&rsquo;s
                        </p>
                        <p className={`text-2xl sm:text-3xl font-black tracking-[0.05em] ${hFont}`}>
                          Playbook
                        </p>
                      </div>
                      <div>
                        <div className="h-[2px] bg-[#BF0A30] w-12 mb-3" />
                        <p className={`text-4xl sm:text-5xl font-black tracking-[0.05em] leading-[1.1] ${hFont}`}>
                          {dept.name}
                        </p>
                      </div>
                      <p className={`text-[10px] uppercase tracking-[0.3em] text-gray-500 self-end ${hFont}`}>
                        Vol. {dept.num}
                      </p>
                    </div>
                  </div>
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
        );
      })}

      {/* ═══ SALE-DAY MULTIPLIER ═══ */}
      <Section className="pt-4 sm:pt-8 pb-20 sm:pb-28 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-4 ${hFont}`}>
              The Bigger Win
            </p>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-[#0B2341] tracking-[0.05em] leading-[1.05] mb-6 ${hFont}`}>
              But here&rsquo;s what <span className="text-[#BF0A30]">nobody tells you</span> about all this.
            </h2>
          </div>

          <div className="space-y-5 text-lg sm:text-xl text-[#475569] leading-relaxed mb-12 max-w-2xl mx-auto">
            <p>
              When you go to sell your home services company, a buyer doesn&rsquo;t pay you for what you <em>say</em> it&rsquo;s worth. They pay for what&rsquo;s documented, trained, and transferable.
            </p>
            <p>
              These 9 playbooks aren&rsquo;t just training. They&rsquo;re the system documentation a buyer wants to see — the difference between a <strong className="text-[#0B2341]">2x EBITDA exit</strong> and a <strong className="text-[#0B2341]">4x+ EBITDA exit</strong>.
            </p>
          </div>

          {/* Stat callout */}
          <div className="bg-[#0B2341] text-white rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl shadow-[#0B2341]/25">
            <p className={`text-base sm:text-lg uppercase tracking-[0.25em] text-gray-400 mb-3 ${hFont}`}>
              On a $1M EBITDA shop
            </p>
            <p className={`text-5xl sm:text-6xl md:text-7xl font-black text-[#BF0A30] tracking-[0.05em] mb-3 ${hFont}`}>
              +$2 million
            </p>
            <p className="text-base sm:text-lg text-gray-300">
              in your pocket the day you sell.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ PRICING ANCHOR + WHITE-LABEL ═══ */}
      <Section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className={`text-base sm:text-lg md:text-xl font-bold uppercase tracking-[0.3em] text-[#BF0A30] mb-3 ${hFont}`}>What it actually costs you</p>
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-[#0B2341] tracking-[0.05em] leading-[1.05] mb-4 ${hFont}`}>
              <span className="line-through text-[#475569]/70">$64,973</span> a la carte. <br className="hidden sm:inline" /><span className="text-[#BF0A30]">$997/m with us.</span>
            </h2>
            <p className="text-lg sm:text-xl text-[#475569] max-w-xl mx-auto leading-relaxed">
              One library. Run it as Real American Grit, or fully rebrand it as your own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Standard */}
            <Stagger i={0} className="relative bg-[#EDEDED] rounded-2xl p-8 border-2 border-[#BF0A30]/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#BF0A30] text-white px-4 py-1 rounded-full">
                <p className={`text-sm sm:text-base font-bold tracking-[0.25em] ${hFont}`}>MOST POPULAR</p>
              </div>
              <p className={`text-base sm:text-lg font-black text-[#BF0A30] tracking-[0.25em] mb-2 ${hFont}`}>STANDARD</p>
              <h3 className={`font-black text-3xl sm:text-4xl text-[#0B2341] mb-1 ${hFont}`}>The Full Library</h3>
              <p className="text-base sm:text-lg text-[#475569] mb-5">Every department. Every operator on your team.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black text-[#0B2341] ${hFont}`}>$997</span>
                <span className="text-base text-[#475569] font-medium">/m</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "All 9 department curricula",
                  "Quizzes + certificates per course",
                  "Owner dashboard with progress tracking",
                  "23-day Sales Huddle Series",
                  "Quarterly content drops",
                  "Lock in $997/m before it goes to $1,497/m",
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-base text-[#475569]">
                    <Check className="shrink-0 mt-1 w-4 h-4 text-[#0B2341]" strokeWidth={3} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <CtaButton variant="red" className="w-full" onClick={openModal} />
            </Stagger>

            {/* White-Label */}
            <Stagger i={1} className="relative bg-[#0B2341] text-white rounded-2xl p-8 border-2 border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-[#BF0A30]" aria-hidden="true" />
                <p className={`text-base sm:text-lg font-black text-[#BF0A30] tracking-[0.25em] ${hFont}`}>WHITE-LABEL</p>
              </div>
              <h3 className={`font-black text-3xl sm:text-4xl mb-1 ${hFont}`}>Make It Yours</h3>
              <p className="text-base sm:text-lg text-gray-400 mb-5">Everything in Standard — fully rebranded as your company&rsquo;s own.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black ${hFont}`}>$1,497</span>
                <span className="text-base text-gray-400 font-medium">/m</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Everything in Standard",
                  "Certificates issued under your company name",
                  "Training portal branded as your operation",
                  "Looks like the entire system was built in-house",
                  "Use it as a recruiting and retention edge",
                  "Lock in $1,497/m before it goes to $1,997/m",
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-base text-gray-400">
                    <Check className="shrink-0 mt-1 w-4 h-4 text-[#BF0A30]" strokeWidth={3} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <CtaButton variant="outline-white" className="w-full" onClick={openModal} label="Upgrade to White-Label — $1,497/m" />
            </Stagger>
          </div>

          <p className="text-center text-sm text-[#475569]">
            Lock in your launch rate today — the price you join at is the price you keep.
          </p>
        </div>
      </Section>

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
          <CtaButton variant="red" onClick={openModal} />
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
