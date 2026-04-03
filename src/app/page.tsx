"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  TrendingDown,
  Flame,
  DoorOpen,
  Target,
  Settings,
  ShieldAlert,
  Check,
  X,
  ShieldCheck,
  ArrowDown,
  Wrench,
  Users,
  BarChart3,
  Crown,
  PhoneOff,
  UserX,
  Star,
  TrendingUp,
} from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
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
  const defaultLabel = variant === "red" ? "Get Instant Access — $997/yr" : "Enroll Now — $997/yr";
  return (
    <button type="button" onClick={onClick} className={`${styles[variant]} ${className}`}>
      {label ?? defaultLabel}
    </button>
  );
}

/* ─── animation (respects reduced motion) ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduced = useReducedMotion();
  return (
    <section id={id} ref={ref} className={className}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >{children}</motion.div>
    </section>
  );
}

function Stagger({ children, i, className = "" }: { children: React.ReactNode; i: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  return (
    <motion.div ref={ref} className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.07, ease: "easeOut" }}
    >{children}</motion.div>
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
  { icon: TrendingDown, title: "Revenue Has Flatlined", desc: "You hit a ceiling and no matter how many hours you put in, the numbers won't budge." },
  { icon: Flame, title: "You ARE the Business", desc: "If you take a week off, things fall apart. Every decision, every fire — it all lands on you." },
  { icon: DoorOpen, title: "Can't Find or Keep Good People", desc: "You hire, you train, they leave. Or worse — they stay and underperform." },
  { icon: Target, title: "Sales Are Inconsistent", desc: "Some months are great, others are a scramble. You don't have a system — you have a prayer." },
  { icon: Settings, title: "No Systems, Just Chaos", desc: "Jobs fall through the cracks. Callbacks pile up. You're duct-taping processes together." },
  { icon: ShieldAlert, title: "Advice That Doesn't Apply", desc: "Generic coaching from people who've never run a truck or managed a crew." },
];


/* ═══════════════════════════════════════════ */
export default function Home() {
  const { visible } = useScrollNav();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Checkout modal */}
      <CheckoutModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ═══ LAUNCH BANNER — fixed above nav ═══ */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-[#1a3a6b] text-white px-4 py-3"
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -120 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-center gap-3 h-full">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute -inset-1.5 rounded-full bg-[#b71c1c] animate-ping opacity-60" />
            <span className="absolute -inset-0.5 rounded-full bg-[#b71c1c]/40 animate-pulse" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b71c1c]" />
          </span>
          <p className="text-sm sm:text-base font-semibold">
            Limited Time Launch Promo: <span className="line-through opacity-60">$1,997</span> <span className="font-bold">$997/yr</span> — ends May 31
          </p>
        </div>
      </motion.div>

      {/* ═══ NAV — slides down when scrolling up past hero ═══ */}
      <motion.nav
        className="fixed top-[44px] left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100"
        role="navigation"
        aria-label="Main"
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-[72px]">
          <a href="/" className="flex items-center gap-2.5 cursor-pointer" aria-label="Home">
            <div className="w-10 h-10 rounded-full bg-[#b71c1c] flex items-center justify-center">
              <span className={`text-sm font-black text-white tracking-tighter ${hFont}`}>RAG</span>
            </div>
            <span className={`font-extrabold text-base tracking-tight text-[#0a1628] ${hFont}`}>REAL AMERICAN GRIT</span>
          </a>
          <button type="button" onClick={openModal} className={`hidden sm:inline-flex h-11 items-center rounded-full bg-[#b71c1c] px-6 text-sm font-bold text-white cursor-pointer hover:bg-[#d32f2f] active:bg-[#9a0007] transition-colors duration-200 ${hFont}`}>
            Enroll Now — $997/yr
          </button>
        </div>
      </motion.nav>

      {/* Spacer for banner + nav */}
      <div className="h-[116px]" />

      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 flex z-10" aria-hidden="true">
          <div className="flex-1 bg-[#b71c1c]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#1a3a6b]" />
        </div>
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#b71c1c]/[0.05] rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-[820px] mx-auto px-5 sm:px-8 pt-16 sm:pt-24 md:pt-32 pb-20 sm:pb-28 md:pb-36 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className={`uppercase text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-400 mb-5 ${hFont}`}>
            Led by the President of ServiceTitan &amp; the #1 home services sales rep
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
            className={`text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.05] mb-5 ${hFont}`}>
            The Proven System to Take Your Home Service Company <span className="text-[#b71c1c]">Past 7&nbsp;Figures</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-[22px] text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            A step-by-step course &amp; coaching program built for owners of
            plumbing, HVAC, roofing, impact windows, and other blue-collar
            service businesses who are tired of being the bottleneck.
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="mb-8 w-full">
            <VSLPlayer />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CtaButton variant="red" className="w-full sm:w-auto" onClick={openModal} />
            <a href="#problems" className="inline-flex h-[60px] items-center justify-center gap-2 rounded-full border border-gray-600 px-8 text-base font-medium text-gray-300 cursor-pointer hover:border-white hover:text-white transition-colors duration-200 w-full sm:w-auto">
              See What&rsquo;s Inside <ArrowDown className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ CREDIBILITY ═══ */}
      <Section className="bg-[#f8f8f6] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="max-w-lg mb-10">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>Your Instructors</p>
            <h2 className={`text-3xl sm:text-4xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug ${hFont}`}>
              They&rsquo;ve built &amp; scaled what you&rsquo;re building.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <Stagger i={0} className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#1a3a6b] flex items-center justify-center text-white font-bold text-base shrink-0">TH</div>
                <div>
                  <p className={`font-extrabold text-[#0a1628] text-lg sm:text-xl ${hFont}`}>Tom Howard</p>
                  <p className="text-base text-[#b71c1c] font-semibold">President, ServiceTitan</p>
                </div>
              </div>
              <p className="text-base text-[#475569] leading-relaxed">
                Leads the <strong className="text-[#0a1628] font-semibold">$3&nbsp;billion</strong> publicly-traded software company built specifically for home service businesses. He knows what separates the companies that scale from the ones that stall.
              </p>
            </Stagger>
            <Stagger i={1} className="bg-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[52px] h-[52px] rounded-full bg-[#b71c1c] flex items-center justify-center text-white font-bold text-base shrink-0">TL</div>
                <div>
                  <p className={`font-extrabold text-[#0a1628] text-lg sm:text-xl ${hFont}`}>Trent Lowenstein</p>
                  <p className="text-base text-[#b71c1c] font-semibold">#1 Home Services Sales Rep</p>
                </div>
              </div>
              <p className="text-base text-[#475569] leading-relaxed">
                Has personally closed <strong className="text-[#0a1628] font-semibold">more home service deals than anyone</strong> in the country. He&rsquo;ll show you how to build a sales team that performs whether you&rsquo;re in the room or not.
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
                Your business is running — but you&rsquo;re running on empty.
              </h2>
              <p className="text-base text-[#475569] leading-relaxed mb-6">
                These are the bottlenecks that keep home service companies stuck between $500K and $5M.
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
              The work isn&rsquo;t the problem. Everything <span className="text-[#b71c1c]">around</span> it is.
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed font-light max-w-2xl mx-auto">
              You do great work. But without systems, leads slip, customers get
              frustrated, good people quit, and growth stalls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { icon: PhoneOff, title: "Leads Going Cold", desc: "New leads sit untouched for days. Nobody owns the follow-up — so your competitor closes them." },
              { icon: Target, title: "Inconsistent Sales", desc: "Your team wings every call. Some months are great, others are a scramble — and you can't explain why." },
              { icon: Star, title: "Customers Leaving Angry", desc: "A 3-day callback delay on something simple turns into a 2-star review that costs you 10 future jobs." },
              { icon: UserX, title: "Hires That Don't Stick", desc: "You find a solid hire but have no onboarding system. They're lost in 2 weeks and gone in 2 months." },
              { icon: Flame, title: "You Are the Bottleneck", desc: "You're the only one who knows how anything works. Take a week off and everything slows down." },
              { icon: TrendingUp, title: "Busy But Not Growing", desc: "Revenue is flat even though you're busier than ever. Margin leaks and rework eat everything you earn." },
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
              You build and fix things for a living.
            </p>
            <p className="text-gray-400 leading-relaxed max-w-lg mx-auto font-light">
              You&rsquo;ve rewired panels, replaced HVAC systems, ripped out
              roofs and put them back better. Your business is no
              different&nbsp;&mdash; it just needs the right blueprint.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ SOLUTION — VALUE STACK ═══ */}
      <Section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#1a3a6b] mb-3 ${hFont}`}>Introducing</p>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug mb-4 ${hFont}`}>
              The Real American Grit <span className="text-[#b71c1c]">Scaling System</span>
            </h2>
            <p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed">
              Here&rsquo;s exactly what you get inside — and what it would cost you to figure this out on your own.
            </p>
          </div>

          {/* Module cards */}
          {[
            {
              num: "01", icon: BarChart3, title: "Sales Team Systems", value: "$5,000",
              desc: "Without this, you cycle through bad sales hires, pay for consultants who don't understand your business, and lose deals every week to reps who wing it instead of following a system.",
              points: [
                "Plug-and-play sales scripts for in-home and phone closes",
                "Rep scorecard + KPI dashboard so you know who's performing",
                "Training system that gets new reps productive in weeks, not months",
                "Commission structures that drive performance without killing margins",
              ],
            },
            {
              num: "02", icon: Users, title: "Hiring & Retention", value: "$3,500",
              desc: "Every bad hire costs you months — recruiting, training, lost productivity, then starting over. Most owners churn through the same roles year after year because they don't have a system to find the right people and keep them.",
              points: [
                "Hiring pipeline that attracts A-players in a tight labor market",
                "Onboarding system that gets new hires contributing fast",
                "Compensation structures that keep your best people loyal",
                "Interview framework to filter out the wrong fits before they cost you",
              ],
            },
            {
              num: "03", icon: Wrench, title: "Fulfillment & Operations", value: "$4,000",
              desc: "Callbacks, rework, scheduling chaos, and bad reviews are silent margin killers. Most owners don't realize how much money walks out the door from sloppy ops until they actually fix it.",
              points: [
                "Job fulfillment SOPs so nothing falls through the cracks",
                "Quality control checkpoints that eliminate costly callbacks",
                "Scheduling and dispatch optimization for max crew efficiency",
                "Customer communication templates that prevent 1-star surprises",
              ],
            },
            {
              num: "04", icon: Crown, title: "Growth & Leadership", value: "$5,000",
              desc: "This is where you stop being the business and start owning it. The alternative is hiring a fractional COO or business coach — or worse, spending another year stuck as the bottleneck while revenue flatlines.",
              points: [
                "Leadership playbook to remove yourself as the daily bottleneck",
                "Financial clarity framework — know your numbers, protect your margins",
                "Build a management layer that runs operations without you",
                "Growth roadmap from $1M to $5M+ with clear milestones",
              ],
            },
          ].map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Stagger key={mod.num} i={i} className="mb-6">
                <div className="bg-[#f8f8f6] rounded-2xl p-7 sm:p-8 border border-gray-200">
                  {/* Top: label + title */}
                  <span className={`text-xs font-black text-[#b71c1c] tracking-wider ${hFont}`}>MODULE {mod.num}</span>
                  <h3 className={`font-bold text-2xl sm:text-3xl text-[#0a1628] mt-1 ${hFont}`}>{mod.title}</h3>

                  {/* Sleek divider */}
                  <div className="h-px bg-gray-300 mt-4 mb-5" />

                  {/* Description + bullets */}
                  <p className="text-base text-[#475569] leading-relaxed mb-5">{mod.desc}</p>
                  <p className={`text-sm font-bold uppercase tracking-[0.15em] text-[#0a1628] mb-3 ${hFont}`}>What you get:</p>
                  <ul className="space-y-2 mb-6">
                    {mod.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-base text-[#475569]">
                        <Check className="shrink-0 mt-1 w-4 h-4 text-[#1a3a6b]" strokeWidth={3} aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  {/* Value at bottom */}
                  <div className="h-px bg-gray-300 mb-5" />
                  <p className={`text-2xl sm:text-3xl font-black text-[#0a1628] ${hFont}`}>{mod.value} <span className="text-base font-semibold text-[#475569]">value</span></p>
                </div>
              </Stagger>
            );
          })}

          {/* Bonus: Community + Templates */}
          <Stagger i={4} className="mb-10">
            <div className="bg-[#0a1628] text-white rounded-2xl p-7 sm:p-8">
              <span className={`text-xs font-black text-[#b71c1c] tracking-wider ${hFont}`}>BONUS</span>
              <h3 className={`font-bold text-2xl sm:text-3xl mt-1 ${hFont}`}>Private Community + Templates</h3>

              <div className="h-px bg-white/10 mt-4 mb-5" />

              <p className="text-base text-gray-400 leading-relaxed mb-4">
                You&rsquo;re not doing this alone. Get a network of operators who&rsquo;ve already solved the problems you&rsquo;re facing, plus every script, SOP, and template ready to download and deploy — no building from scratch.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Private RAG community of vetted home service owners",
                  "Every script, SOP, and template — downloadable and editable",
                  "Future module updates and additions at no extra cost",
                ].map((pt, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-base text-gray-400">
                    <Check className="shrink-0 mt-1 w-4 h-4 text-[#b71c1c]" strokeWidth={3} aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="h-px bg-white/10 mb-5" />
              <p className={`text-2xl sm:text-3xl font-black text-white ${hFont}`}>$2,500 <span className="text-base font-semibold text-gray-400">value</span></p>
            </div>
          </Stagger>

          {/* ═══ VALUE STACK SUMMARY ═══ */}
          <Stagger i={5} className="mb-10">
            <div className="bg-[#f8f8f6] rounded-2xl p-7 sm:p-8 border-2 border-[#b71c1c]/20">
              <h3 className={`font-black text-2xl sm:text-3xl text-[#0a1628] text-center mb-8 ${hFont}`}>
                Everything You Get:
              </h3>
              <div className="space-y-3 max-w-md mx-auto mb-8">
                {[
                  { label: "Sales Team Systems", value: "$5,000" },
                  { label: "Hiring & Retention", value: "$3,500" },
                  { label: "Fulfillment & Operations", value: "$4,000" },
                  { label: "Growth & Leadership", value: "$5,000" },
                  { label: "Private Community + Templates", value: "$2,500" },
                ].map((row, j) => (
                  <div key={j} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <p className="text-base text-[#0a1628] font-medium">{row.label}</p>
                    <p className={`text-base font-bold text-[#475569] ${hFont}`}>{row.value}</p>
                  </div>
                ))}
              </div>

              <div className="text-center space-y-2 mb-8">
                <p className="text-base text-[#475569]">Total Value</p>
                <p className={`text-3xl sm:text-4xl font-black text-[#475569] line-through opacity-60 ${hFont}`}>$20,000</p>
                <p className="text-base text-[#475569]">Regular Price</p>
                <p className={`text-2xl sm:text-3xl font-black text-[#475569] line-through opacity-60 ${hFont}`}>$1,997/yr</p>
                <p className={`text-base font-bold text-[#b71c1c] uppercase tracking-wider ${hFont}`}>Launch Price — until May 31</p>
                <p className={`text-5xl sm:text-6xl font-black text-[#0a1628] ${hFont}`}>$997<span className="text-2xl text-[#475569] font-medium">/yr</span></p>
              </div>

              <div className="text-center">
                <CtaButton variant="red" onClick={openModal} label="CLAIM LIMITED $997 OFFER NOW" />
              </div>
            </div>
          </Stagger>
        </div>
      </Section>

      {/* ═══ WHO THIS IS FOR ═══ */}
      <Section className="py-16 sm:py-24 bg-[#f8f8f6]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className={`text-3xl sm:text-4xl font-black text-center text-[#0a1628] tracking-[-0.02em] mb-10 ${hFont}`}>
            Built for you if&hellip;
          </h2>
          <div className="space-y-3 mb-10">
            {[
              "You own a home service company doing $500K – $5M+ in revenue",
              "You have a team (or want to build one) but lack the systems to scale",
              "You're tired of being the technician, the manager, AND the salesperson",
              "You want frameworks from people who've actually done it — not theory",
              "You run plumbing, HVAC, roofing, windows, electrical, or similar trades",
            ].map((item, i) => (
              <Stagger key={i} i={i} className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                <Check className="shrink-0 w-5 h-5 text-[#1a3a6b]" strokeWidth={3} aria-hidden="true" />
                <p className="text-base text-[#0a1628] font-medium">{item}</p>
              </Stagger>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <CtaButton variant="outline-dark" onClick={openModal} />
          </div>
        </div>
      </Section>

      {/* ═══ CHECKOUT ═══ */}
      <Section id="enroll" className="py-16 sm:py-24 bg-white">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#b71c1c] mb-3 ${hFont}`}>Limited launch price</p>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#0a1628] tracking-[-0.02em] leading-snug mb-3 ${hFont}`}>
              Get the complete system.
            </h2>
            <p className="text-base text-[#475569]">
              Everything you need to install real systems and start growing.
            </p>
          </div>

          <div className="relative bg-[#0a1628] text-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#0a1628]/25">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[80px] bg-[#b71c1c]/20 rounded-full blur-[50px] pointer-events-none" aria-hidden="true" />

            <div className="relative">
              <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className={`text-5xl sm:text-6xl font-black ${hFont}`}>$997</span>
                <span className="text-gray-500 text-base font-medium">/year</span>
              </div>
              <p className="text-center text-gray-500 text-base mb-8">Full course access + coaching — billed annually</p>

              <ul className="space-y-2.5 mb-8">
                {[
                  "Full year of access to all 4 training modules",
                  "Frameworks from Tom Howard & Trent Lowenstein",
                  "Downloadable scripts, SOPs, and templates",
                  "Access to the private RAG community",
                  "Future module updates at no extra cost",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="shrink-0 w-4 h-4 text-[#b71c1c]" strokeWidth={3} aria-hidden="true" />
                    <p className="text-base text-gray-400">{item}</p>
                  </li>
                ))}
              </ul>

              <CheckoutForm />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ FINAL CTA ═══ */}
      <Section className="relative py-20 sm:py-28 bg-[#0a1628] text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[#b71c1c]/[0.06] rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.02em] leading-snug mb-4 ${hFont}`}>
            You built something real.<br />Now build it to <span className="text-[#b71c1c]">last.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-8 font-light leading-relaxed">
            Your competitors aren&rsquo;t waiting. The best operators are installing systems right now.
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
