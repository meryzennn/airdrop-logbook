"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SignOutButton } from "./SignOutButton";
import TowerLoader from "@/components/ui/TowerLoader";

function DashboardGate({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-[99999] grid place-items-center overflow-hidden bg-zinc-950">
      {/* glow milik loader sendiri */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[860px] rounded-full bg-emerald-500/14 blur-[110px]" />
        <div className="absolute -bottom-48 left-1/3 h-[420px] w-[720px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <TowerLoader />
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
            {label}
          </p>
          <p className="mt-1 text-[10px] font-bold text-zinc-500">
            Indexing logs & syncing airdrop
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayoutClient({
  children,
  user,
}: {
  children: ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const name = user?.name ?? "Operator";
  const email = user?.email ?? "";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  // random 2–4 detik setiap masuk dashboard
  const delayMs = useMemo(() => 2000 + Math.floor(Math.random() * 2001), []);
  const [gate, setGate] = useState(true);

  // lock scroll biar gak bleed
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarW}px`;

    const t = setTimeout(() => setGate(false), delayMs);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow || "";
      document.body.style.paddingRight = prevPad || "";
    };
  }, [delayMs]);

  // penting: selama gate true, jangan render dashboard belakang (biar gak “tembus”)
  if (gate) return <DashboardGate label="Loading dashboard…" />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-[var(--font-body)]">
      {/* BG glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full bg-emerald-500/14 blur-[90px]" />
        <div className="absolute -bottom-56 left-1/3 h-[420px] w-[760px] rounded-full bg-fuchsia-500/10 blur-[110px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50">
        <div className="border-b border-white/10 bg-zinc-950/55 backdrop-blur">
          <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          <div className="mx-auto max-w-6xl px-3 md:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Link
                  href="/"
                  aria-label="Back to landing page"
                  className="
                    group inline-flex h-9 w-9 flex-shrink-0 items-center justify-center
                    rounded-xl border border-white/10 bg-white/5
                    shadow-[0_0_0_1px_rgba(255,255,255,0.04)]
                    transition
                    hover:border-emerald-400/25 hover:bg-white/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/35
                  "
                  title="Back to landing"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-zinc-100 transition group-hover:-translate-x-[1px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </Link>

                <div className="min-w-0">
                  <p className="truncate text-sm md:text-[15px] font-black tracking-tight text-zinc-100">
                    Welcome <span className="text-emerald-300">{name}</span>
                  </p>
                  {email ? (
                    <p className="truncate text-[11px] font-bold text-zinc-400">
                      {email}
                    </p>
                  ) : (
                    <p className="truncate text-[11px] font-bold text-zinc-500">
                      —
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] font-black text-emerald-300">
                      {initials || "OP"}
                    </div>
                  )}
                </div>

                <SignOutButton />
              </div>
            </div>
          </div>

          <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 md:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
