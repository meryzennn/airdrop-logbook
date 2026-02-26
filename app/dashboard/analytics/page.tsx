// app/dashboard/analytics/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";
import type { AnalyticsData, PieName } from "./types";

// ganti path ini kalau auth kamu beda
import { auth } from "@/auth";
import { Status } from "@prisma/client";

function dayKey(d: Date) {
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) redirect("/");

  const airdrops = await prisma.airdrop.findMany({
    where: { userId },
    select: {
      status: true,
      chain: true,
      createdAt: true,
      landedAt: true,
      ruggedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const total = airdrops.length;

  let landed = 0;
  let rugged = 0;
  let doneLike = 0;

  const byChainMap = new Map<string, number>();

  for (const a of airdrops) {
    const st = a.status as Status;

    const c = (a.chain || "UNKNOWN").toUpperCase();
    byChainMap.set(c, (byChainMap.get(c) ?? 0) + 1);

    if (st === "LANDED") landed++;
    if (st === "RUGGED") rugged++;
    if (st === "DONE" || st === "LANDED" || st === "RUGGED") doneLike++;
  }

  const doneRate = total ? Math.round((doneLike / total) * 100) : 0;
  const landedRate = total ? Math.round((landed / total) * 100) : 0;
  const ruggedRate = total ? Math.round((rugged / total) * 100) : 0;

  const others = Math.max(0, total - landed - rugged);

  // ✅ IMPORTANT: pie.name harus PieName (union), bukan string
  const pie: { name: PieName; value: number }[] = [
    { name: "LANDED", value: landed },
    { name: "RUGGED", value: rugged },
    { name: "OTHER", value: others },
  ];

  // Timeline last 30 days
  const days = 30;
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));

  const timelineMap = new Map<
    string,
    { day: string; created: number; landed: number; rugged: number }
  >();

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const k = dayKey(d);
    timelineMap.set(k, { day: k, created: 0, landed: 0, rugged: 0 });
  }

  for (const a of airdrops) {
    const cK = a.createdAt ? dayKey(new Date(a.createdAt)) : null;
    if (cK && timelineMap.has(cK)) timelineMap.get(cK)!.created++;

    const lK = a.landedAt ? dayKey(new Date(a.landedAt)) : null;
    if (lK && timelineMap.has(lK)) timelineMap.get(lK)!.landed++;

    const rK = a.ruggedAt ? dayKey(new Date(a.ruggedAt)) : null;
    if (rK && timelineMap.has(rK)) timelineMap.get(rK)!.rugged++;
  }

  const timeline = Array.from(timelineMap.values());

  const byChain = Array.from(byChainMap.entries())
    .map(([chain, count]) => ({ chain, count }))
    .sort((a, b) => b.count - a.count);

  const payload: AnalyticsData = {
    total,
    landed,
    rugged,
    doneRate,
    landedRate,
    ruggedRate,
    pie,
    timeline,
    byChain,
  };

  return (
    <div className="px-2">
      <div className="mb-6">
        <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-zinc-100 uppercase tracking-tight">
          Analytics
        </h1>
        <p className="text-[11px] text-zinc-500 font-black uppercase tracking-widest mt-2">
          Landed / Rugged ratio • Timeline • Chain breakdown
        </p>
      </div>

      <AnalyticsClient data={payload} />
    </div>
  );
}
