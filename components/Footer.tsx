"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import GithubStarButton from "@/components/footer/GithubStarButton";
import SocialHubButton from "@/components/footer/SocialHubButton";

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const SOCIAL_HUB = "https://0x5zen.vercel.app";

  return (
    <footer className="relative mt-16">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-44 left-1/2 -translate-x-1/2 h-[420px] w-[920px] rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -bottom-52 left-1/3 h-[380px] w-[620px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative border-t border-white/10 bg-zinc-950/55 backdrop-blur"
      >
        {/* top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/45 to-transparent" />

        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            {/* left: brand + copy */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
                <p className="text-sm font-black uppercase tracking-widest text-zinc-100">
                  Airdrop Logbook
                </p>
              </div>

              <p className="max-w-xl text-[12px] font-bold leading-relaxed text-zinc-400">
                A clean ops dashboard for Web3 hunters.
                <br />
                Log missions, track wallets, and move fast no noise, just
                progress.
              </p>

              <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                Crafted by <span className="text-emerald-400">0x5zen</span>
              </p>
            </div>

            {/* right: actions (hapus kalau lu ga mau button sama sekali) */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center md:justify-end">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <SocialHubButton href={SOCIAL_HUB} text="Social Hub" />
                  <GithubStarButton
                    href="https://github.com/meryzennn/airdrop-logbook"
                    label="Give Star on GitHub"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="mt-8 flex flex-col gap-2 border-t border-white/5 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              © {year} 0x5zen • Airdrop Logbook
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Intel first. HYPE later.
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
