"use client";

import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  text: string;
};

export default function SocialHubButton({ href, text }: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={text}
      className="
        group relative inline-flex h-11 w-[12rem] select-none items-center
        rounded-full border border-white/10 bg-transparent p-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/35
      "
    >
      {/* circle / rail */}
      <span
        aria-hidden
        className="
          absolute left-0 top-0 h-11 w-11
          rounded-full border border-white/10 bg-zinc-900/70 backdrop-blur
          shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_18px_rgba(16,185,129,0.18)]
          transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)]
          group-hover:w-full group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_28px_rgba(16,185,129,0.28)]
          group-active:scale-[0.96]
        "
      />

      {/* arrow */}
      <span
        aria-hidden
        className="
          absolute left-[0.95rem] top-1/2 -translate-y-1/2
          h-0.5 w-[1.125rem]
          bg-transparent
          transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)]
          group-hover:bg-white group-hover:translate-x-[8.7rem]
          group-active:translate-x-[9.35rem]
        "
      >
        <span
          className="
            absolute right-[0.06rem] top-1/2 -translate-y-1/2
            h-2.5 w-2.5 rotate-45
            border-r-2 border-t-2 border-white
          "
        />
      </span>

      {/* text */}
      <span
        className="
          relative z-10 w-full pl-[3.4rem] pr-4 text-center
          text-[11px] font-black uppercase tracking-widest
          text-white/55
          transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)]
          group-hover:-translate-x-6 group-hover:text-white
          group-active:text-white/70
        "
      >
        {text}
      </span>

      {/* tiny glow line (biar nyatu sama tema lu) */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 rounded-full opacity-0
          shadow-[0_0_0_1px_rgba(16,185,129,0.25)]
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />
    </Link>
  );
}
