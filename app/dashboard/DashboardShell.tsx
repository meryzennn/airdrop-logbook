"use client";

import type { ReactNode } from "react";
import { SignOutButton } from "./SignOutButton";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-black tracking-wide text-zinc-100">
            Airdrop Logbook
          </div>
          <SignOutButton />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
