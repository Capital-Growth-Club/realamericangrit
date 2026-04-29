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
const hFont = "font-[family-name:var(--font-outfit)]";

/* ─── CTA button reusable ─── */
function CtaButton({ variant = "red", className = "", onClick, label }: { variant?: "red" | "outline-white" | "outline-dark"; className?: string; onClick?: () => void; label?: string }) {
  const base = `inline-flex h-[60px] items-center justify-center rounded-full px-10 text-lg font-bold cursor-pointer transition-colors duration-200 ${hFont}`;
  const styles = {
    red: `${base} bg-[#b71c1c] text-white hover:bg-[#d32f2f] active:bg-[#9a0007] pulse-red`,
    "outline-white": `${base} border-2 border-white/30 text-white hover:bg-white/10 active:bg-white/5`,
    "outline-dark": `${base} border-2 border-[#0a1628]/20 text-[#0a1628] hover:bg-[#0a1628]/5 active:bg-[#0a1628]/10`,
  };
  const defaultLabel = variant === "red" ? "Train My Team — $997/mo" : "Enroll Now — $997/mo";
  return (
    <button type="button" onClick={onClick} className={`${styles[variant]} ${className}`}>
      {label ?? defaultLabel}
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
  { icon: TrendingUp, name: "Sales Training", desc: "Stop guessing why one tech closes 60% and another closes 20%. Your team runs the same proven in-home process — every call, every home, every time." },
  { icon: Briefcase, name: "Acquisitions", desc: "Buy a competitor without overpaying. Sell the company for what it's actually worth." },
  { icon: DollarSign, name: "Pricing for Profit", desc: "Most contractors are 5–15% under-priced and don't realize it. This is the section that pays for the subscription on day one." },
  { icon: Building2, name: "Corporate Structure", desc: "You finally understand the structure of your own business — and you fix the parts that are quietly costing you money or exposing you to risk." },
  { icon: BarChart3, name: "Financials for Operators", desc: "Profitable contractors go broke every year because nobody read the cash flow. This is the section that makes that impossible." },
  { icon: Megaphone, name: "Marketing", desc: "Your marketing stops being a slot machine. You know which dollar produces a booked job — and what to do with the leads everyone else lets die." },
  { icon: Wrench, name: "Operational Excellence", desc: "Fewer callbacks. Better reviews. Higher billable efficiency. The operation runs without you having to be in it." },
  { icon: Users, name: "Human Resources", desc: "Hiring becomes a pipeline, not a panic. Onboarding is structured. Your best people stay. Your bad fits leave fast and cheap." },
  { icon: Crown, name: "Leadership", desc: "Your managers actually manage. They make decisions, run their departments, hold the standard. You stop being the only adult in the room." },
];

const DEPARTMENT_DEEP = [
  {
    icon: TrendingUp,
    num: "01",
    name: "Sales Training",
    headline: "Uncover the closing playbook behind $19.6M in personal sales — in a single year.",
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
    headline: "How to buy a competitor without overpaying — and sell for what you're worth.",
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
    name: "Pricing for Profit",
    headline: "How to recover the 5–15% margin you're losing every month.",
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
    headline: "How to pay yourself first — and the IRS less.",
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
    name: "Financials for Operators",
    headline: "Discover how to run the business off your numbers — not your bank balance.",
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
    headline: "The secret behind turning every $1 of marketing into $10 in revenue.",
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
    name: "Operational Excellence",
    headline: "The real strategies for growing your company so it doesn't need you in it.",
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
    headline: "Uncover how to hire people who actually stick — even in this labor market.",
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
    headline: "The blueprint to finding and nurturing lasting leaders for your operation.",
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
        {/* Banner */}
        <div className="bg-[#1a3a6b] text-white px-4 py-3">
          <div className="flex items-center justify-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute -inset-1.5 rounded-full bg-[#b71c1c] animate-ping opacity-60" />
              <span className="absolute -inset-0.5 rounded-full bg-[#b71c1c]/40 animate-pulse" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b71c1c]" />
            </span>
            <p className="text-[11px] sm:text-base font-semibold">
              Now Live: Train Your Entire Team — <span className="font-bold">$997/mo</span> · 14-Day Money-Back Guarantee
            </p>
          </div>
        </div>
        {/* Nav */}
        <nav className="bg-white border-b border-gray-100" role="navigation" aria-label="Main">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-[72px]">
            <a href="/coaching" className="flex items-center gap-2.5 cursor-pointer" aria-label="Home">
              <div className="w-10 h-10 rounded-full bg-[#b71c1c] flex items-center justify-center">
                <span className={`text-sm font-black text-white tracking-tighter ${hFont}`}>RAG</span>
              </div>
              <span className={`font-extrabold text-base tracking-tight text-[#0a1628] ${hFont}`}>REAL AMERICAN GRIT</span>
            </a>
            <button type="button" onClick={openModal} className={`hidden sm:inline-flex h-11 items-center rounded-full bg-[#b71c1c] px-6 text-sm font-bold text-white cursor-pointer hover:bg-[#d32f2f] active:bg-[#9a0007] transition-colors duration-200 ${hFont}`}>
              Enroll Now — $997/mo
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for banner + nav */}
      <div className="h-[116px]" />

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 flex z-10" aria-hidden="true">
          <div className="flex-1 bg-[#b71c1c]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#1a3a6b]" />
        </div>
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#b71c1c]/[0.05] rounded-full blur-[140px] pointer-events-none glow-bg" aria-hidden="true" />

        <div className="relative max-w-[820px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 md:pt-32 pb-20 sm:pb-28 md:pb-36 text-center">
          <p className={`hero-fade uppercase text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-400 mb-5 ${hFont}`}>
            For home service owners doing $2M – $10M
          </p>

          <h1 className={`hero-fade text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.05] mb-5 ${hFont}`}>
            Stop Being The Reason Your Company <span className="text-[#b71c1c]">Can&rsquo;t Grow.</span>
          </h1>

          <p className="hero-fade text-lg sm:text-xl md:text-[22px] text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Train every operator on your team — GM, Service Manager, Install
            Manager, Sales Lead, CSR, Technician — with the exact SOPs that
            scaled a home services business past $120 million. Without you
            having to be the trainer.
          </p>

          <div className="hero-fade mb-8 w-full">
            <VSLPlayer />
          </div>

          <div className="hero-fade flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <CtaButton variant="red" className="w-full sm:w-auto" onClick={openModal} />
            <a href="#curriculum" className="inline-flex h-[60px] items-center justify-center gap-2 rounded-full border border-gray-600 px-8 text-base font-medium text-gray-300 cursor-pointer hover:border-white hover:text-white transition-colors duration-200 w-full sm:w-auto">
              See What&rsquo;s Inside <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          <p className="hero-fade text-sm text-gray-500">
            Built by <span className="text-gray-300 font-medium">Tom Howard</span> ($120M+ home services operator) and <span className="text-gray-300 font-medium">Phil Filaski</span> ($19.6M in residential HVAC sales)
          </p>
        </div>
      </section>

      {/* ═══ CREDIBILITY ═══ */}
      <Section className="bg-[#f8f8f6] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-lg mb-10">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>The Operators Behind It</p>
            <h2 className={`text-3xl sm:text-4xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug ${hFont}`}>
              They were in the truck.<br />They read about it in a book.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <Stagger i={0} className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#1a3a6b] flex items-center justify-center text-white font-bold text-base shrink-0">TH</div>
                <div>
                  <p className={`font-extrabold text-[#0a1628] text-lg sm:text-xl ${hFont}`}>Tom Howard</p>
                  <p className="text-base text-[#b71c1c] font-semibold">From 11 Employees to $120M+</p>
                </div>
              </div>
              <p className="text-base text-[#475569] leading-relaxed">
                Tom started where most owners are stuck — <strong className="text-[#0a1628] font-semibold">11 employees, $1.6M in revenue</strong>, trucks breaking down, customers complaining, doing everything himself. He scaled that company past <strong className="text-[#0a1628] font-semibold">$120 million</strong> on a trajectory toward $1 billion. Every category in the library comes from what he actually did. He&rsquo;s not a consultant. He lived it.
              </p>
            </Stagger>
            <Stagger i={1} className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#b71c1c] flex items-center justify-center text-white font-bold text-base shrink-0">PF</div>
                <div>
                  <p className={`font-extrabold text-[#0a1628] text-lg sm:text-xl ${hFont}`}>Phil Filaski</p>
                  <p className="text-base text-[#b71c1c] font-semibold">$19.6M Sold. In Living Rooms.</p>
                </div>
              </div>
              <p className="text-base text-[#475569] leading-relaxed">
                Phil is the <strong className="text-[#0a1628] font-semibold">#1 residential HVAC salesperson in the country</strong>. $19.6 million in personal residential sales — not over the phone, not on Zoom. In the home, knee-to-knee with the homeowner. He teaches the entire sales curriculum: the in-home process, objection handling, closing techniques, and the maintenance agreement plays.
              </p>
            </Stagger>
          </div>

          {/* CTA */}
          <div className="text-center">
            <CtaButton variant="outline-dark" onClick={openModal} />
          </div>
        </div>
      </Section>

      {/* ═══ PROBLEMS ═══ */}
      <Section id="problems" className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>Sound familiar?</p>
              <h2 className={`text-3xl sm:text-4xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug mb-4 ${hFont}`}>
                You already know what&rsquo;s wrong.
              </h2>
              <p className="text-base text-[#475569] leading-relaxed mb-6">
                These are the bottlenecks that keep $2M – $10M home service companies stuck under their own ceiling.
              </p>
              {/* CTA in sidebar on desktop */}
              <div className="hidden lg:block">
                <CtaButton variant="red" className="w-full text-base px-6" onClick={openModal} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROBLEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Stagger key={i} i={i} className="group p-5 rounded-xl bg-[#f8f8f6] hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-200 cursor-default">
                    <Icon className="w-5 h-5 text-[#b71c1c] mb-3" aria-hidden="true" />
                    <p className={`font-extrabold text-[#0a1628] text-xl sm:text-2xl mb-1.5 ${hFont}`}>{item.title}</p>
                    <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
                  </Stagger>
                );
              })}
            </div>
          </div>
          {/* CTA on mobile (below cards) */}
          <div className="text-center mt-10 lg:hidden">
            <CtaButton variant="red" className="w-full sm:w-auto" onClick={openModal} />
          </div>
        </div>
      </Section>

      {/* ═══ AGITATION ═══ */}
      <Section className="relative py-20 sm:py-28 bg-[#0a1628] text-white">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" aria-hidden="true"
          style={{ backgroundImage: "linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-[1.1] tracking-[-0.02em] mb-5 ${hFont}`}>
              Your team is good people.<br />They just don&rsquo;t have <span className="text-[#b71c1c]">a standard.</span>
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
                  <div className="w-10 h-10 rounded-xl bg-[#b71c1c]/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#b71c1c]" aria-hidden="true" />
                  </div>
                  <p className={`font-bold text-white text-lg mb-2 ${hFont}`}>{item.title}</p>
                  <p className="text-base text-gray-400 leading-relaxed">{item.desc}</p>
                </Stagger>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mb-14">
            <CtaButton variant="red" onClick={openModal} />
          </div>

          {/* Blueprint close */}
          <div className="text-center border-t border-white/10 pt-10 max-w-2xl mx-auto">
            <p className={`text-2xl sm:text-3xl font-black tracking-[-0.02em] mb-3 ${hFont}`}>
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
          <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#1a3a6b] mb-3 ${hFont}`}>Introducing</p>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug mb-5 ${hFont}`}>
            Real American Grit is <span className="text-[#b71c1c]">the operating system.</span>
          </h2>
          <p className="text-lg text-[#475569] leading-relaxed mb-4">
            A monthly subscription that hands you a complete, certificate-tracked
            training library — built directly from the systems that took a home
            services company from <strong className="text-[#0a1628]">11 employees to over $120 million</strong>.
          </p>
          <p className="text-lg text-[#475569] leading-relaxed">
            Every department. Every role. Every system. You assign courses by
            role. Your team watches the videos. They take the quizzes. They earn
            the certificates. You watch their progress on a single dashboard.
          </p>
        </div>
      </Section>

      {/* ═══ HOW IT WORKS ═══ */}
      <Section className="py-16 sm:py-24 bg-[#f8f8f6]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>How it works</p>
            <h2 className={`text-3xl sm:text-4xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug ${hFont}`}>
              Three steps. No rollout. No theory.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Stagger key={step.num} i={i} className="bg-white rounded-2xl p-7 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-black text-[#b71c1c] tracking-wider ${hFont}`}>STEP {step.num}</span>
                    <div className="h-px flex-1 bg-gray-200" />
                    <Icon className="w-5 h-5 text-[#0a1628]" aria-hidden="true" />
                  </div>
                  <p className={`font-bold text-[#0a1628] text-xl mb-2 ${hFont}`}>{step.title}</p>
                  <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
                </Stagger>
              );
            })}
          </div>

          <div className="text-center">
            <CtaButton variant="red" onClick={openModal} />
          </div>
        </div>
      </Section>

      {/* ═══ CURRICULUM — 9 DEPARTMENTS ═══ */}
      <Section id="curriculum" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>What&rsquo;s inside</p>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug mb-4 ${hFont}`}>
              9 Departments. 50+ Courses. <span className="text-[#b71c1c]">Zero Theory.</span>
            </h2>
            <p className="text-base text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Every system in this library was used in a real home services
              operation that scaled past $120 million. Not a single module is
              theoretical.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <Stagger key={dept.name} i={i} className="bg-[#f8f8f6] rounded-2xl p-6 border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-[#b71c1c]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#b71c1c]" aria-hidden="true" />
                  </div>
                  <p className={`font-bold text-[#0a1628] text-xl mb-2 ${hFont}`}>{dept.name}</p>
                  <p className="text-sm text-[#475569] leading-relaxed">{dept.desc}</p>
                </Stagger>
              );
            })}
          </div>

          {/* Platform features */}
          <div className="bg-[#0a1628] text-white rounded-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>Plus the platform</p>
              <h3 className={`text-2xl sm:text-3xl font-black tracking-[-0.02em] ${hFont}`}>
                The accountability layer that makes it actually work.
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PLATFORM.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-[#b71c1c]" aria-hidden="true" />
                    </div>
                    <p className={`font-bold text-white text-base mb-1.5 ${hFont}`}>{feat.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-10">
            <CtaButton variant="red" onClick={openModal} />
          </div>
        </div>
      </Section>

      {/* ═══ DEPARTMENT DEEP DIVES (9 sections) ═══ */}
      <Section className="py-20 sm:py-28 bg-[#0a1628] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#b71c1c]/[0.06] rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <p className={`text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-5 ${hFont}`}>
            What you get — department by department
          </p>
          <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.02] mb-6 ${hFont}`}>
            The 9-Figure Systems<br className="hidden sm:inline" /> &amp; Training <span className="text-[#b71c1c]">Blueprint.</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Pulled from the operation that scaled <span className="text-white font-semibold">$1.6M → $120M+</span>.
          </p>
        </div>
      </Section>

      {DEPARTMENT_DEEP.map((dept, i) => {
        const Icon = dept.icon;
        const dark = i % 2 === 1;
        return (
          <Section key={dept.num} className={`py-20 sm:py-28 ${dark ? "bg-[#f8f8f6]" : "bg-white"}`}>
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-14">
                {/* Number + Icon column */}
                <div className="flex lg:flex-col items-center lg:items-start gap-5 lg:gap-6">
                  <div
                    className={`text-[6rem] sm:text-[7.5rem] lg:text-[9rem] font-black text-[#b71c1c] leading-[0.8] tracking-[-0.05em] ${hFont}`}
                    aria-hidden="true"
                  >
                    {dept.num}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#b71c1c]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 text-[#b71c1c]" aria-hidden="true" />
                  </div>
                </div>

                {/* Content column */}
                <div>
                  <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#475569] mb-3 ${hFont}`}>
                    Department
                  </p>
                  <h3 className={`font-black text-4xl sm:text-5xl lg:text-6xl text-[#0a1628] mb-7 tracking-[-0.03em] leading-[1.02] ${hFont}`}>
                    {dept.name}
                  </h3>
                  <p className={`border-l-4 border-[#b71c1c] pl-5 text-xl sm:text-2xl text-[#0a1628] font-bold mb-8 leading-snug ${hFont}`}>
                    {dept.headline}
                  </p>
                  <ul className="space-y-6 max-w-2xl">
                    {dept.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3.5">
                        <Check className="shrink-0 mt-1.5 w-5 h-5 text-[#b71c1c]" strokeWidth={3} aria-hidden="true" />
                        <div>
                          <p className={`text-lg sm:text-xl text-[#0a1628] font-bold leading-snug tracking-tight ${hFont}`}>
                            {b.title}
                          </p>
                          <p className="text-sm sm:text-base text-[#475569] mt-1 leading-snug">
                            {b.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                    <li className="flex gap-3.5 pt-1">
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center text-[#b71c1c] font-black text-2xl leading-none mt-0.5" aria-hidden="true">+</span>
                      <p className={`text-sm font-black text-[#b71c1c] tracking-[0.2em] uppercase pt-1 ${hFont}`}>
                        Plus more inside
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        );
      })}

      {/* CTA after deep dives */}
      <Section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <CtaButton variant="red" onClick={openModal} />
        </div>
      </Section>

      {/* ═══ WHO THIS IS FOR ═══ */}
      <Section className="py-16 sm:py-24 bg-[#f8f8f6]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className={`text-3xl sm:text-4xl font-black text-center text-[#0a1628] tracking-[-0.02em] mb-10 ${hFont}`}>
            Built for you if&hellip;
          </h2>
          <div className="space-y-3 mb-12">
            {[
              "You run a home services company doing $2M – $10M",
              "You're in HVAC, plumbing, electrical, roofing, impact windows, garage, or any blue-collar trade",
              "You have a team of 5–40 — and you're tired of being the only one who knows how anything works",
              "You're done watching everything you taught walk out the door every time someone quits",
              "You want frameworks from people who actually ran trucks — not theory from people who read a book",
              "You want your business to be worth something — not just a job you can't sell",
            ].map((item, i) => (
              <Stagger key={i} i={i} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                <Check className="shrink-0 w-5 h-5 text-[#1a3a6b]" strokeWidth={3} aria-hidden="true" />
                <p className="text-base text-[#0a1628] font-medium">{item}</p>
              </Stagger>
            ))}
          </div>

          {/* Not for you if */}
          <div className="border-t border-gray-300 pt-10">
            <h3 className={`text-2xl font-black text-center text-[#0a1628] tracking-[-0.02em] mb-6 ${hFont}`}>
              This isn&rsquo;t for you if&hellip;
            </h3>
            <div className="space-y-2 max-w-xl mx-auto">
              {[
                "You're a true solo operator with no plans to hire",
                "You think your business is too special for systems",
                "You'd rather pay $30K a year for a coaching program",
                "You don't actually want to grow",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#475569]">
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 font-bold">✗</span>
                  <p className="text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <CtaButton variant="outline-dark" onClick={openModal} />
          </div>
        </div>
      </Section>

      {/* ═══ PRICING ANCHOR + WHITE-LABEL ═══ */}
      <Section className="py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>Pricing</p>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug mb-4 ${hFont}`}>
              One library. <span className="text-[#b71c1c]">Two ways to run it.</span>
            </h2>
            <p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed">
              Same complete training system. Run it as Real American Grit, or
              fully rebrand it as your own company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Standard */}
            <Stagger i={0} className="relative bg-[#f8f8f6] rounded-2xl p-8 border-2 border-[#b71c1c]/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#b71c1c] text-white px-4 py-1 rounded-full">
                <p className={`text-xs font-bold tracking-wider ${hFont}`}>MOST POPULAR</p>
              </div>
              <p className={`text-xs font-black text-[#b71c1c] tracking-wider mb-2 ${hFont}`}>STANDARD</p>
              <h3 className={`font-black text-2xl text-[#0a1628] mb-1 ${hFont}`}>The Full Library</h3>
              <p className="text-sm text-[#475569] mb-5">Every department. Every operator on your team.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black text-[#0a1628] ${hFont}`}>$997</span>
                <span className="text-base text-[#475569] font-medium">/month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "All 9 department curricula",
                  "Quizzes + certificates per course",
                  "Owner dashboard with progress tracking",
                  "23-day Sales Huddle Series",
                  "Quarterly content drops",
                  "Cancel anytime · 14-day money-back",
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-base text-[#475569]">
                    <Check className="shrink-0 mt-1 w-4 h-4 text-[#1a3a6b]" strokeWidth={3} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <CtaButton variant="red" className="w-full" onClick={openModal} />
            </Stagger>

            {/* White-Label */}
            <Stagger i={1} className="relative bg-[#0a1628] text-white rounded-2xl p-8 border-2 border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-[#b71c1c]" aria-hidden="true" />
                <p className={`text-xs font-black text-[#b71c1c] tracking-wider ${hFont}`}>WHITE-LABEL</p>
              </div>
              <h3 className={`font-black text-2xl mb-1 ${hFont}`}>Make It Yours</h3>
              <p className="text-sm text-gray-400 mb-5">Everything in Standard — fully rebranded as your company&rsquo;s own.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-5xl font-black ${hFont}`}>$1,497</span>
                <span className="text-base text-gray-400 font-medium">/month</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Everything in Standard",
                  "Certificates issued under your company name",
                  "Training portal branded as your operation",
                  "Looks like the entire system was built in-house",
                  "Use it as a recruiting and retention edge",
                  "Cancel anytime · 14-day money-back",
                ].map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-base text-gray-400">
                    <Check className="shrink-0 mt-1 w-4 h-4 text-[#b71c1c]" strokeWidth={3} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <CtaButton variant="outline-white" className="w-full" onClick={openModal} label="Upgrade to White-Label — $1,497/mo" />
            </Stagger>
          </div>

          <p className="text-center text-sm text-[#475569]">
            14-day money-back guarantee. Cancel anytime in the dashboard. No phone tag, no &ldquo;retention specialists.&rdquo;
          </p>
        </div>
      </Section>

      {/* ═══ FINAL CTA ═══ */}
      <Section className="relative py-20 sm:py-28 bg-[#0a1628] text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#b71c1c]/[0.06] rounded-full blur-[100px] pointer-events-none glow-bg" aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.02em] leading-snug mb-4 ${hFont}`}>
            Your business is worth what your <span className="text-[#b71c1c]">systems</span> are worth.
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-8 font-light leading-relaxed">
            Right now, the operation runs on what&rsquo;s in your head. That&rsquo;s not a business — that&rsquo;s a job. Hand it over.
          </p>
          <CtaButton variant="red" onClick={openModal} />
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#060e1a] text-gray-500 py-10" role="contentinfo">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#b71c1c] flex items-center justify-center" aria-hidden="true">
              <span className={`text-[10px] font-black text-white tracking-tighter ${hFont}`}>RAG</span>
            </div>
            <span className={`font-bold text-gray-400 ${hFont}`}>Real American Grit</span>
          </div>
          <p>© {new Date().getFullYear()} Real American Grit. All rights reserved.</p>
          <a href="mailto:info@realamericangrit.com" className="cursor-pointer hover:text-white transition-colors duration-200">
            info@realamericangrit.com
          </a>
        </div>
        <div className="mt-8 h-1 flex" aria-hidden="true">
          <div className="flex-1 bg-[#b71c1c]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#1a3a6b]" />
        </div>
      </footer>
    </div>
  );
}
