"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Layers,
  ScanLine,
  CheckCircle2,
  Lock,
  Workflow,
  Timer,
  Search,
  Tags,
  BarChart3,
  ChevronDown,
} from "lucide-react";

import UserLoginButton from "@/components/ui/UserLoginButton";
import SparkleNeonButton from "@/components/ui/SparkleNeonButton";
import NavPillRadio from "@/components/ui/NavPillRadio";
import { signInWithGoogle } from "@/app/dashboard/actions";
import UserNavButton from "@/components/ui/UserNavButton";
import { useEffect, useRef, useState } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

type NavId = "product" | "workflow" | "features" | "faq";

/** Get dynamic header height so smooth-scroll never hides content behind the fixed nav. */
function getHeaderOffset() {
  const el = document.getElementById("site-header");
  return (el?.offsetHeight ?? 88) + 10;
}

/** Smooth scroll to a section with proper offset (offset is computed once per click). */
function scrollToId(id: NavId) {
  const el = document.getElementById(id);
  if (!el) return;

  const offset = getHeaderOffset();
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function LandingPage({ isAuthed }: { isAuthed: boolean }) {
  return (
    <div className="min-h-screen bg-[#060813] text-white">
      {/* BACKDROP */}
      <div className="pointer-events-none fixed inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            backgroundPosition: "center",
          }}
        />

        {/* Glow blobs */}
        <div className="absolute -top-56 left-1/2 h-[620px] w-[1200px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[160px]" />
        <div className="absolute top-0 left-[12%] h-[520px] w-[780px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
        <div className="absolute top-24 right-[10%] h-[520px] w-[900px] rounded-full bg-sky-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />
        </div>
      </div>

      <LandingNav isAuthed={isAuthed} />

      {/* HERO */}
      <section id="product" className="relative pt-28 md:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-14">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />
              <div className="absolute -right-24 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-500/14 via-sky-500/10 to-fuchsia-500/10 blur-[100px]" />
            </div>

            <div className="relative px-5 py-12 sm:px-10 lg:px-14 lg:py-16">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                {/* LEFT */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: easeOut }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-zinc-200"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-200" />
                    Ops Console for Airdrops
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    No spreadsheet pain
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: easeOut, delay: 0.05 }}
                    className="mt-7 sm:mt-8 text-balance text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.03]"
                  >
                    Run your airdrop ops
                    <span className="block">
                      like a system.
                      <br />
                      <span className="mt-2 block font-bold text-emerald-200">
                        Stay sharp.
                      </span>
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
                    className="mt-5 sm:mt-6 max-w-xl text-pretty text-[14px] font-bold leading-relaxed text-zinc-300"
                  >
                    One private dashboard to track targets, chains, wallets, and
                    socials. Flip status fast, record outcomes, and keep your
                    farming workflow clean every day.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: easeOut, delay: 0.15 }}
                    className="mt-8 sm:mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
                  >
                    {!isAuthed ? (
                      <form action={signInWithGoogle} className="inline-block">
                        <SparkleNeonButton
                          label="Continue with Google"
                          variant="google"
                          type="submit"
                        />
                      </form>
                    ) : (
                      <SparkleNeonButton
                        href="/dashboard"
                        label="Open Dashboard"
                        variant="dashboard"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => scrollToId("workflow")}
                      className="group inline-flex items-center gap-2 text-sm font-black text-white/90 hover:text-white"
                    >
                      See how it works
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: easeOut, delay: 0.2 }}
                    className="mt-7 sm:mt-8 flex flex-wrap gap-2"
                  >
                    <Chip
                      icon={<Lock className="h-3.5 w-3.5" />}
                      text="Private per user"
                    />
                    <Chip
                      icon={<Timer className="h-3.5 w-3.5" />}
                      text="Fast status flow"
                    />
                    <Chip
                      icon={<Search className="h-3.5 w-3.5" />}
                      text="Search & filters"
                    />
                    <Chip
                      icon={<BarChart3 className="h-3.5 w-3.5" />}
                      text="Insights-ready"
                    />
                  </motion.div>
                </div>

                {/* RIGHT */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: easeOut, delay: 0.08 }}
                  className="relative"
                >
                  <ConsolePreview />
                </motion.div>
              </div>

              <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
                <MiniValue
                  icon={<Zap className="h-4 w-4 text-emerald-200" />}
                  title="Fast Ops"
                  desc="Flip statuses in one click — no friction."
                />
                <MiniValue
                  icon={<Layers className="h-4 w-4 text-sky-200" />}
                  title="Everything in one place"
                  desc="Targets, wallets, handles, notes."
                />
                <MiniValue
                  icon={<Shield className="h-4 w-4 text-fuchsia-200" />}
                  title="Private by default"
                  desc="Google sign-in only, isolated per user."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="text-center"
          >
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-emerald-200">
              Workflow
            </p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-white sm:text-5xl">
              Clean steps.
              <br />
              Daily repeat.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-[14px] font-bold leading-relaxed text-zinc-300">
              This is built for momentum. You capture targets fast, keep the
              context attached, then move through execution without guessing
              what to do next.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-[13px] font-bold leading-relaxed text-zinc-400">
              When the workflow is structured, you spend less time organizing
              and more time farming.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08, delayChildren: 0.05 },
              },
            }}
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <StepCard
                num="01"
                title="Add targets"
                desc="Create a target with chain, wallet, socials, and notes. Keep the details structured so you can move fast later."
                icon={<Tags className="h-5 w-5 text-emerald-200" />}
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <StepCard
                num="02"
                title="Run tasks"
                desc="Update progress with clear statuses. Your dashboard becomes your daily checklist and keeps you consistent."
                icon={<Workflow className="h-5 w-5 text-sky-200" />}
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <StepCard
                num="03"
                title="Record outcomes"
                desc="Mark LANDED or RUGGED and keep the history. Review outcomes later and refine what you chase next."
                icon={<CheckCircle2 className="h-5 w-5 text-fuchsia-200" />}
              />
            </motion.div>
          </motion.div>

          {/* Extra workflow copy block */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: easeOut }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            >
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-zinc-400">
                The point
              </p>
              <p className="mt-3 text-xl sm:text-2xl font-black text-white leading-[1.15]">
                Keep context close, keep execution simple.
              </p>
              <p className="mt-3 text-[13px] font-bold leading-relaxed text-zinc-300">
                Your wallet, handles, notes, and chain live next to the target.
                You do not need to open ten tabs just to remember what you were
                doing.
              </p>
              <p className="mt-3 text-[13px] font-bold leading-relaxed text-zinc-400">
                The workflow stays the same every day. The targets change, the
                system does not.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: easeOut }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            >
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-zinc-400">
                Built for speed
              </p>

              <div className="mt-4 space-y-3">
                <GlowLine
                  title="Fast capture"
                  desc="Add a target once and reuse the context whenever you come back."
                />
                <GlowLine
                  title="Clear progress"
                  desc="Statuses make it obvious what is waiting, what is active, and what is finished."
                />
                <GlowLine
                  title="Review later"
                  desc="Outcomes create a feedback loop that improves your next decisions."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="text-center"
          >
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-sky-200">
              Features
            </p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-white sm:text-5xl leading-[1.06]">
              Built for daily ops.
              <br />
              Designed to stay clean.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-[14px] font-bold leading-relaxed text-zinc-300">
              This dashboard is built for one thing: keeping your airdrop
              workflow consistent. You capture targets fast, keep context
              attached, and record outcomes in a way that is easy to review
              later.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-[13px] font-bold leading-relaxed text-zinc-400">
              The goal is simple: less tab-switching, less guessing, and more
              repeatable execution.
            </p>
          </motion.div>

          {/* Feature cards (stagger) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08, delayChildren: 0.05 },
              },
            }}
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <FeatureCard
                title="Smart search"
                desc="Find anything instantly by name, chain, wallet, handle, or notes. Your context stays attached, so you never lose the thread."
                accent="emerald"
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <FeatureCard
                title="Status-first execution"
                desc="Built around action. You move from PLANNED to IN_PROGRESS to DONE, then record the final outcome when it is clear."
                accent="sky"
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: easeOut },
                },
              }}
            >
              <FeatureCard
                title="Outcome memory"
                desc="Mark LANDED or RUGGED and keep history you can actually learn from. Your future decisions get sharper over time."
                accent="fuchsia"
              />
            </motion.div>
          </motion.div>

          {/* Extra copy block + “highlights” (no hyphen bullets) */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: easeOut }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            >
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-zinc-400">
                Why this works
              </p>
              <p className="mt-3 text-xl sm:text-2xl font-black text-white leading-[1.15]">
                Your workflow becomes repeatable, not random.
              </p>
              <p className="mt-3 text-[13px] font-bold leading-relaxed text-zinc-300">
                Most people lose airdrops not because they are lazy, but because
                the process is messy. This turns it into a system: targets are
                structured, progress is visible, and outcomes are recorded.
              </p>
              <p className="mt-3 text-[13px] font-bold leading-relaxed text-zinc-400">
                When everything is organized, it is easier to focus on execution
                and easier to review what actually paid off.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease: easeOut, delay: 0.05 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                <Chip
                  icon={<Search className="h-3.5 w-3.5" />}
                  text="Search anything fast"
                />
                <Chip
                  icon={<Timer className="h-3.5 w-3.5" />}
                  text="Quick status updates"
                />
                <Chip
                  icon={<Lock className="h-3.5 w-3.5" />}
                  text="Private per user"
                />
                <Chip
                  icon={<BarChart3 className="h-3.5 w-3.5" />}
                  text="Reviewable outcomes"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: easeOut }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7"
            >
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-zinc-400">
                Best for
              </p>

              <div className="mt-4 space-y-3">
                <GlowLine
                  title="Daily farmers"
                  desc="You touch many targets and need one place to keep the story straight."
                />
                <GlowLine
                  title="Multi-chain grinders"
                  desc="Chains, wallets, and socials stay organized so you do not mix contexts."
                />
                <GlowLine
                  title="Outcome-focused ops"
                  desc="You care about what landed and why, not just checking tasks."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              {/* LEFT: Accordion */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: easeOut }}
                className="order-2 lg:order-1"
              >
                <FaqAccordion
                  items={[
                    {
                      q: "Is my data private?",
                      a: "Yes. Your data is isolated per user account through Google sign-in. You only see your own dashboard entries.",
                    },
                    {
                      q: "Do I need a spreadsheet anymore?",
                      a: "No. The dashboard replaces the messy sheet workflow by keeping targets, wallets, socials, and notes structured in one place.",
                    },
                    {
                      q: "Can I track outcomes like landed or rugged?",
                      a: "Yes. You can record outcomes so your history stays reviewable. This makes it easier to learn what actually worked.",
                    },
                    {
                      q: "Can I search across everything quickly?",
                      a: "Yes. Search is built to find targets by name, chain, wallet, handles, and notes. It is designed for speed.",
                    },
                    {
                      q: "Is it mobile friendly?",
                      a: "Yes. The layout is responsive and the navigation adapts for small screens, so you can update status quickly.",
                    },
                    {
                      q: "What is the best way to use it daily?",
                      a: "Add targets when you discover them, update status while you execute, and record outcomes once they are clear. The routine stays consistent, the targets change.",
                    },
                  ]}
                />
              </motion.div>

              {/* RIGHT: Copywriting panel (fills the empty area) */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: easeOut }}
                className="order-1 lg:order-2"
              >
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-7">
                  {/* subtle glow */}
                  <div className="pointer-events-none absolute -top-24 -right-24 h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-[90px]" />
                  <div className="pointer-events-none absolute -bottom-24 -left-24 h-[320px] w-[320px] rounded-full bg-sky-500/10 blur-[90px]" />

                  <p className="relative text-[12px] font-black uppercase tracking-[0.18em] text-zinc-400">
                    FAQ
                  </p>

                  <h3 className="relative mt-3 text-balance text-2xl sm:text-3xl font-black text-white leading-[1.1]">
                    Quick answers.
                    <br />
                    No confusion.
                  </h3>

                  <p className="relative mt-4 text-pretty text-[14px] font-bold leading-relaxed text-zinc-300">
                    This is built to stay simple. You sign in, track targets,
                    and keep your workflow repeatable. If you ever get lost, the
                    system is designed to bring you back to clarity fast.
                  </p>

                  <p className="relative mt-3 text-pretty text-[13px] font-bold leading-relaxed text-zinc-400">
                    The most common reason people miss airdrops is not effort.
                    It is missing context. This keeps chain, wallet, handles,
                    notes, and outcomes together so decisions stay clean.
                  </p>

                  <div className="relative mt-6 space-y-3">
                    <GlowLine
                      title="Less guessing"
                      desc="You always know what is planned, what is running, and what is finished."
                    />
                    <GlowLine
                      title="Context stays attached"
                      desc="Wallets, socials, and notes stay next to the target so you do not lose the story."
                    />
                    <GlowLine
                      title="Outcomes are reviewable"
                      desc="Record LANDED or RUGGED and learn what actually works over time."
                    />
                  </div>

                  <div className="relative mt-6 flex flex-wrap gap-2">
                    <Chip
                      icon={<Lock className="h-3.5 w-3.5" />}
                      text="Private per user"
                    />
                    <Chip
                      icon={<Search className="h-3.5 w-3.5" />}
                      text="Fast search"
                    />
                    <Chip
                      icon={<Timer className="h-3.5 w-3.5" />}
                      text="Quick updates"
                    />
                    <Chip
                      icon={<BarChart3 className="h-3.5 w-3.5" />}
                      text="Outcome memory"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function GlowLine({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70 shadow-[0_0_18px_rgba(16,185,129,0.25)]" />
        <p className="text-sm font-black text-white">{title}</p>
      </div>
      <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
        {desc}
      </p>
    </div>
  );
}

/* ----------------- NAV (Mobile optimized) ----------------- */

function LandingNav({ isAuthed }: { isAuthed: boolean }) {
  const [nav, setNav] = useState<NavId>("product");

  // When user clicks a tab, lock the active state for a short time
  // to prevent the scroll listener from bouncing the selection.
  const lockRef = useRef<NavId | null>(null);
  const lockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const ids: NavId[] = ["product", "workflow", "features", "faq"];

    let ticking = false;

    const updateActiveFromScroll = () => {
      const offset = getHeaderOffset();
      const y = window.scrollY + offset + 20;

      let current: NavId = "product";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= y) current = id;
      }

      setNav((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      // If we are in "locked" mode (user just clicked), do nothing.
      if (lockRef.current) return;

      // Throttle updates to animation frames (smooth + low jank).
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        updateActiveFromScroll();
      });
    };

    // Initial sync
    updateActiveFromScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleNavChange = (id: NavId) => {
    setNav(id);

    // Lock to prevent "bounce" during smooth scrolling.
    lockRef.current = id;

    if (lockTimerRef.current) window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      lockRef.current = null;
    }, 700);

    scrollToId(id);
  };

  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#060813]/60 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 md:py-4">
        {/* Row 1: brand + auth */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleNavChange("product")}
            className="flex items-center gap-2"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
              <ScanLine className="h-4 w-4 text-emerald-200" />
            </div>
            <span className="text-sm font-black tracking-tight text-white">
              Airdrop Ops
            </span>
          </button>

          {/* Desktop pill nav */}
          <div className="hidden md:flex flex-1 justify-center">
            <NavPillRadio value={nav} onChange={handleNavChange} />
          </div>

          <div className="flex items-center gap-2">
            {!isAuthed ? (
              <form action={signInWithGoogle}>
                <UserNavButton variant="login" label="Log In" />
              </form>
            ) : (
              <UserNavButton
                variant="dashboard"
                label="Dashboard"
                href="/dashboard"
              />
            )}
          </div>
        </div>

        {/* Row 2 (mobile): pill nav */}
        <div className="mt-3 flex md:hidden justify-center">
          <div className="w-full max-w-[520px] overflow-x-auto">
            <div className="flex justify-center">
              <NavPillRadio value={nav} onChange={handleNavChange} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ----------------- UI PARTS ----------------- */

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[11px] font-black text-zinc-200">
      <span className="text-emerald-200/90">{icon}</span>
      {text}
    </div>
  );
}

function MiniValue({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
          {icon}
        </div>
        <p className="text-sm font-black text-white">{title}</p>
      </div>
      <p className="mt-3 text-[13px] font-bold leading-relaxed text-zinc-300">
        {desc}
      </p>
    </div>
  );
}

function StepCard({
  num,
  title,
  desc,
  icon,
}: {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20">
          {icon}
        </div>
        <span className="text-[12px] font-black tracking-[0.18em] text-zinc-500">
          {num}
        </span>
      </div>
      <p className="mt-5 text-lg font-black text-white">{title}</p>
      <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
        {desc}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  accent,
}: {
  title: string;
  desc: string;
  accent: "emerald" | "sky" | "fuchsia";
}) {
  const accentGlow =
    accent === "emerald"
      ? "shadow-[0_0_60px_rgba(16,185,129,0.12)]"
      : accent === "sky"
        ? "shadow-[0_0_60px_rgba(56,189,248,0.10)]"
        : "shadow-[0_0_60px_rgba(217,70,239,0.10)]";

  const accentText =
    accent === "emerald"
      ? "text-emerald-200"
      : accent === "sky"
        ? "text-sky-200"
        : "text-fuchsia-200";

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 ${accentGlow}`}
    >
      <p
        className={`text-[12px] font-black uppercase tracking-[0.18em] ${accentText}`}
      >
        {title}
      </p>
      <p className="mt-3 text-[13px] font-bold leading-relaxed text-zinc-300">
        {desc}
      </p>
      <button
        type="button"
        onClick={() => scrollToId("workflow")}
        className="mt-4 inline-flex items-center gap-2 text-sm font-black text-white/90 hover:text-white"
      ></button>
    </div>
  );
}
function FaqAccordion({
  items,
}: {
  items: Array<{
    q: string;
    a: string;
  }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <FaqItem
          key={item.q}
          index={idx}
          q={item.q}
          a={item.a}
          isOpen={openIndex === idx}
          onToggle={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
        />
      ))}
    </div>
  );
}
function FaqItem({
  index,
  q,
  a,
  isOpen,
  onToggle,
}: {
  index: number;
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentId = `faq-content-${index}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <p className="text-[13px] sm:text-sm font-black text-white">{q}</p>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-300"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <p className="text-[13px] font-bold leading-relaxed text-zinc-300">
                {a}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ----------------- PREVIEW ----------------- */

function ConsolePreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[32px] bg-emerald-500/10 blur-[26px]" />

      <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_50px_140px_rgba(0,0,0,0.6)]">
        <div className="rounded-[22px] border border-white/10 bg-[#0b1020] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
                <ScanLine className="h-4 w-4 text-emerald-200" />
              </div>
              <div>
                <p className="text-[12px] font-black text-white">Ops Console</p>
                <p className="text-[11px] font-bold text-zinc-500">
                  Daily targets • Status flow • Outcomes
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-[11px] font-black text-emerald-100">
              Ready
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-emerald-200" />
              <span className="text-[12px] font-black text-zinc-400">
                Search targets, wallets, handles...
              </span>
              <span className="ml-auto rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] font-black text-zinc-300">
                ⌘ K
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ModuleCard
              title="Targets"
              meta="Chain • Wallet • Socials"
              pill="Today"
              accent="emerald"
            />
            <ModuleCard
              title="Status Flow"
              meta="PLANNED → DONE"
              pill="Fast"
              accent="sky"
            />
            <ModuleCard
              title="Outcomes"
              meta="LANDED / RUGGED"
              pill="Track"
              accent="fuchsia"
            />
            <ModuleCard
              title="Notes"
              meta="Keep context & links"
              pill="Clean"
              accent="emerald"
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">
              RECENT ACTIVITY
            </p>
            <div className="mt-3 space-y-3">
              <SkeletonRow label="Updated status → DONE" tag="BSC" />
              <SkeletonRow label="Marked outcome → LANDED" tag="BASE" />
              <SkeletonRow label="Added new target" tag="SOL" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  title,
  meta,
  pill,
  accent,
}: {
  title: string;
  meta: string;
  pill: string;
  accent: "emerald" | "sky" | "fuchsia";
}) {
  const ring =
    accent === "emerald"
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
      : accent === "sky"
        ? "border-sky-400/20 bg-sky-500/10 text-sky-100"
        : "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-100";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-black text-white">{title}</p>
        <span
          className={`rounded-xl border px-3 py-1 text-[10px] font-black ${ring}`}
        >
          {pill}
        </span>
      </div>
      <p className="mt-2 text-[12px] font-bold text-zinc-400">{meta}</p>
      <div className="mt-3 h-2 w-full rounded-full bg-white/[0.04]">
        <div className="h-2 w-[62%] rounded-full bg-white/15" />
      </div>
    </div>
  );
}

function SkeletonRow({ label, tag }: { label: string; tag: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70 shadow-[0_0_18px_rgba(16,185,129,0.25)]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-black text-white">{label}</p>
        <p className="mt-1 text-[11px] font-bold text-zinc-500">
          Chain: {tag} • just now
        </p>
      </div>
      <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-black text-zinc-200">
        {tag}
      </span>
    </div>
  );
}
