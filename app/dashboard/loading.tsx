import React from "react";
import TowerLoader from "@/components/ui/TowerLoader";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 grid place-items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[860px] rounded-full bg-emerald-500/14 blur-[110px]" />
        <div className="absolute -bottom-48 left-1/3 h-[420px] w-[720px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <TowerLoader />
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
            Loading dashboard…
          </p>
          <p className="mt-1 text-[10px] font-bold text-zinc-500">
            Streaming data from server
          </p>
        </div>
      </div>
    </div>
  );
}
