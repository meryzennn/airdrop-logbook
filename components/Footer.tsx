"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import GithubStarButton from "@/components/footer/GithubStarButton";
import SocialHubButton from "@/components/footer/SocialHubButton";
import SocialTooltipBar from "@/components/footer/SocialTooltipBar";
import LegalGlowButton from "@/components/footer/LegalGlowButton";

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
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
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
                Log the grind, track wallets, and move fast no noise, just
                progress.
              </p>

              <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                Crafted by <span className="text-emerald-400">0x5zen</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <LegalGlowButton
                  href="/privacy"
                  text="Privacy"
                  accent="emerald"
                />
                <LegalGlowButton href="/terms" text="Terms" accent="sky" />
              </div>
            </div>

            {/* right: socials top + buttons bottom (rata kanan) */}
            <div className="w-full md:w-auto">
              <div className="flex w-full md:justify-end">
                <div className="flex w-full flex-col items-end gap-3 md:w-auto">
                  {/* TOP: SocialTooltipBar */}
                  <div className="ml-auto">
                    <SocialTooltipBar />
                  </div>

                  {/* BOTTOM: Give Star (left) + Social Hub (right) */}
                  <div
                    className="
                      w-full md:w-auto
                      overflow-x-auto py-1
                      [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                    "
                  >
                    {/* ml-auto biar nempel kanan kalau muat */}
                    <div className="ml-auto flex w-max items-center gap-2">
                      <GithubStarButton
                        href="https://github.com/meryzennn/airdrop-logbook"
                        label="Give Star on GitHub"
                      />
                      <SocialHubButton href={SOCIAL_HUB} text="Social Hub" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              © {year} 0x5zen • Airdrop Logbook
            </p>

            <div className="flex flex-col gap-2 md:items-end">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Build First . Log Fast . Stay Ops-mode
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
