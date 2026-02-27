"use client";

import React from "react";
import { motion } from "framer-motion";
import ShareWebsiteButton from "@/components/footer/ShareWebsiteButton";
import GithubStarButton from "@/components/footer/GithubStarButton";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-14">
      {/* glow backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-[420px] w-[900px] rounded-full bg-emerald-500/12 blur-[90px]" />
        <div className="absolute -bottom-44 left-1/3 h-[360px] w-[520px] rounded-full bg-fuchsia-500/10 blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative border-t border-white/10 bg-zinc-950/60 backdrop-blur"
      >
        <div className="mx-auto max-w-6xl px-5 py-12">
          {/* top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* brand */}
            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05, duration: 0.35 }}
                className="text-sm font-black uppercase tracking-widest text-zinc-100"
              >
                Airdrop Logbook
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="text-[12px] text-zinc-400 font-bold leading-relaxed"
              >
                Track intel. Execute missions. Secure the bag.
                <br />A personal ops dashboard for Web3 hunters—built for speed,
                clarity, and vibes.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.14, duration: 0.35 }}
                className="text-[11px] font-black uppercase tracking-widest text-zinc-500"
              >
                Built by <span className="text-emerald-400">0x5zen</span>
              </motion.p>
            </div>

            {/* links */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Notes
              </p>

              <ul className="space-y-2 text-[12px] font-bold">
                <li>
                  <a
                    href="/dashboard"
                    className="text-zinc-300 hover:text-emerald-400 transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/analytics"
                    className="text-zinc-300 hover:text-emerald-400 transition-colors"
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-zinc-300 hover:text-emerald-400 transition-colors"
                  >
                    Home
                  </a>
                </li>
              </ul>
            </div>

            {/* actions */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Actions
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12, duration: 0.35 }}
                className="flex flex-wrap items-center gap-3"
              >
                <ShareWebsiteButton />

                <GithubStarButton
                  href="https://github.com/0x5zen/airdrop-logbook"
                  label="Star 0x5zen on GitHub"
                />
              </motion.div>

              <p className="text-[11px] text-zinc-500 font-bold leading-relaxed">
                If this helps your workflow, share it with your squad.
                <br />
                More features coming: smarter analytics, tags, and faster ops.
              </p>
            </div>
          </div>

          {/* bottom row */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              © {year} 0x5zen • Airdrop Logbook
            </p>

            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              “Intel first. Hype later.”
            </p>
          </div>
        </div>

        {/* animated scanline */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
        />
      </motion.div>
    </footer>
  );
}
