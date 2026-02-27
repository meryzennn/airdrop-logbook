"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, Layers, ScanLine } from "lucide-react";
import SparkleNeonButton from "@/components/ui/SparkleNeonButton";
import { signInWithGoogle } from "@/app/dashboard/actions";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function LandingHero({ isAuthed }: { isAuthed: boolean }) {
  return (
    <section className="relative overflow-hidden">
      {/* BACKDROP */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[1100px] rounded-full bg-emerald-500/12 blur-[120px]" />
        <div className="absolute top-24 left-1/3 h-[380px] w-[620px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute top-36 right-1/4 h-[340px] w-[560px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/45" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pt-16 md:pt-20 pb-14">
        {/* TOP BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/60 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-200 shadow-[0_0_30px_rgba(16,185,129,0.12)]"
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Airdrop Logbook
          <span className="mx-1 h-1 w-1 rounded-full bg-white/20" />
          Ops-grade tracking
          <span className="mx-1 h-1 w-1 rounded-full bg-white/20" />
          built by <span className="text-emerald-300">0x5zen</span>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-10 items-center">
          {/* HERO COPY */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08, delayChildren: 0.05 },
              },
            }}
            className="space-y-7"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: easeOut },
                },
              }}
              className="font-[var(--font-display)] text-4xl md:text-6xl font-black tracking-tight text-zinc-100 leading-[1.02] max-w-3xl"
            >
              Stop losing airdrops
              <span className="block">
                to chaos.
                <span className="ml-3 text-emerald-400 italic">
                  Go ops-mode.
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: easeOut },
                },
              }}
              className="text-[13px] md:text-[14px] font-bold text-zinc-400 leading-relaxed max-w-2xl"
            >
              Log every mission tasks, wallets, socials, notes.then flip
              statuses in one click. Track what actually works with outcomes:
              landed vs rugged, timeline signals, and chain breakdowns.
            </motion.p>

            {/* CTA ROW */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: easeOut },
                },
              }}
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
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
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: easeOut },
                },
              }}
              className="text-[11px] font-bold text-zinc-500"
            >
              Google sign-in only • Private per user • Dark mode • No
              spreadsheet pain
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: easeOut },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl"
            >
              <MiniStat
                icon={<Zap className="h-4 w-4 text-emerald-400" />}
                label="Fast Ops"
                value="PLANNED → LANDED"
              />
              <MiniStat
                icon={<Layers className="h-4 w-4 text-sky-400" />}
                label="Smart Filters"
                value="Chain / Date / Search"
              />
              <MiniStat
                icon={<ScanLine className="h-4 w-4 text-fuchsia-400" />}
                label="Outcomes"
                value="Landed vs Rugged"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* FEATURES */}
        <div id="features" className="pt-14 md:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Feature
              title="Logbook Table"
              desc="Fast input, clean columns, and quick status controls."
              accent="emerald"
            />
            <Feature
              title="Ops Filters"
              desc="Search across fields + chain filters + status presets."
              accent="sky"
            />
            <Feature
              title="Outcome Tracking"
              desc="Mark landed / rugged and read your performance over time."
              accent="fuchsia"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/55 px-4 py-3 hover:border-white/15 transition">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {label}
        </p>
      </div>
      <p className="mt-2 text-[12px] font-black text-zinc-200">{value}</p>
    </div>
  );
}

function Feature({
  title,
  desc,
  accent,
}: {
  title: string;
  desc: string;
  accent: "emerald" | "sky" | "fuchsia";
}) {
  const accentCls =
    accent === "emerald"
      ? "text-emerald-300 hover:border-emerald-500/25"
      : accent === "sky"
        ? "text-sky-300 hover:border-sky-500/25"
        : "text-fuchsia-300 hover:border-fuchsia-500/25";

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-zinc-950/55 backdrop-blur px-6 py-6 transition ${accentCls}`}
    >
      <p className="text-[11px] font-black uppercase tracking-widest">
        {title}
      </p>
      <p className="mt-2 text-[13px] font-bold text-zinc-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
