"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { SignOutButton } from "./SignOutButton";

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-[var(--font-body)]">
      {/* BG glow (biar nyatu sama vibe table) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 h-[520px] w-[920px] rounded-full bg-emerald-500/14 blur-[90px]" />
        <div className="absolute -bottom-56 left-1/3 h-[420px] w-[760px] rounded-full bg-fuchsia-500/10 blur-[110px]" />
      </div>

      {/* HEADER: vibe AirdropClientTable */}
      <header className="sticky top-0 z-50">
        <div className="border-b border-white/10 bg-zinc-950/60 backdrop-blur">
          <div className="mx-auto max-w-6xl px-3 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left */}
              <div className="min-w-0">
                <div className="mt-3 min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    Welcome back
                  </p>
                  <p className="text-lg md:text-xl font-black tracking-tight text-zinc-100 truncate">
                    {name}
                  </p>
                  {email && (
                    <p className="text-[11px] font-bold text-zinc-400 truncate">
                      {email}
                    </p>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-xl">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-[11px] font-black text-emerald-300">
                      {initials || "OP"}
                    </div>
                  )}
                </div>

                <SignOutButton />
              </div>
            </div>
          </div>

          {/* neon line */}
          <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-6xl px-3 md:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
