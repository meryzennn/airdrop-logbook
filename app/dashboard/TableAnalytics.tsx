"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Sector,
} from "recharts";
import { ChevronDown, ChevronUp, Sparkles, Coins } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

type PieName = "LANDED" | "RUGGED" | "OTHER";

const PIE_COLORS: Record<PieName, string> = {
  LANDED: "#10b981",
  RUGGED: "#ef4444",
  OTHER: "#3f3f46",
};

const COLLAPSE_MS = 240;

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(n);

/**
 * Recharts typings differ across versions.
 * In this project: PieProps may not include activeIndex -> cast to any.
 */
const PieAny = Pie as unknown as React.ComponentType<any>;

const renderActiveShape = (props: any) => {
  return (
    <Sector
      {...props}
      outerRadius={(props.outerRadius ?? 0) + 10}
      stroke="rgba(255,255,255,0.28)"
      strokeWidth={2}
    />
  );
};

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

export default function TableAnalytics({
  rows,
  days = 30,
  topChains = 8,
}: {
  rows: any[];
  days?: number;
  topChains?: number;
}) {
  const [open, setOpen] = useState(true);

  // Start false to avoid Recharts reading -1,-1 at first paint
  const [chartsReady, setChartsReady] = useState(false);

  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  // mount: show charts next frame
  useEffect(() => {
    const raf = requestAnimationFrame(() => setChartsReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // responsive detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();

    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  // Mobile: reduce bars count a bit
  const effectiveTopChains = useMemo(
    () => (isMobile ? Math.min(topChains, 8) : topChains),
    [isMobile, topChains],
  );

  const data = useMemo(() => {
    // Convert any date-ish value into ms (safe)
    const toTime = (v: any) => {
      if (!v) return 0;
      const t = new Date(v).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    /**
     * Deduplicate rows by `id` to prevent double counting in analytics.
     * If duplicates exist, keep the newest record based on updatedAt/landedAt/etc.
     */
    const uniqueMap = new Map<string, any>();
    let noIdCounter = 0;

    for (const r of rows ?? []) {
      const id = r?.id ? String(r.id) : "";
      if (!id) {
        uniqueMap.set(`__noid_${noIdCounter++}`, r);
        continue;
      }

      const prev = uniqueMap.get(id);
      if (!prev) {
        uniqueMap.set(id, r);
        continue;
      }

      const prevT = toTime(
        prev?.updatedAt ??
          prev?.landedAt ??
          prev?.ruggedAt ??
          prev?.taskDate ??
          prev?.createdAt,
      );
      const nextT = toTime(
        r?.updatedAt ??
          r?.landedAt ??
          r?.ruggedAt ??
          r?.taskDate ??
          r?.createdAt,
      );

      if (nextT >= prevT) uniqueMap.set(id, r);
    }

    const safeRows = Array.from(uniqueMap.values());

    const total = safeRows.length;

    let landed = 0;
    let rugged = 0;
    let doneLike = 0;

    // Sum landed values WITHOUT double-counting
    let landedUSD = 0;

    const byChainMap = new Map<string, number>();

    for (const r of safeRows) {
      const st = String(r?.status || "");
      const chain = String(r?.chain || "UNKNOWN").toUpperCase();
      byChainMap.set(chain, (byChainMap.get(chain) ?? 0) + 1);

      if (st === "LANDED") {
        landed++;
        const v = Number(r?.landedValue ?? 0);
        if (Number.isFinite(v) && v > 0) landedUSD += v;
      }

      if (st === "RUGGED") rugged++;
      if (st === "DONE" || st === "LANDED" || st === "RUGGED") doneLike++;
    }

    const doneRate = total ? Math.round((doneLike / total) * 100) : 0;
    const landedRate = total ? Math.round((landed / total) * 100) : 0;
    const ruggedRate = total ? Math.round((rugged / total) * 100) : 0;

    const others = Math.max(0, total - landed - rugged);

    const pie = [
      { name: "LANDED" as const, value: landed },
      { name: "RUGGED" as const, value: rugged },
      { name: "OTHER" as const, value: others },
    ];

    // Timeline last N days
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

    for (const r of safeRows) {
      const createdSrc = r?.taskDate ?? r?.createdAt;
      const createdK = createdSrc ? dayKey(new Date(createdSrc)) : null;
      if (createdK && timelineMap.has(createdK))
        timelineMap.get(createdK)!.created++;

      const landedK = r?.landedAt ? dayKey(new Date(r.landedAt)) : null;
      if (landedK && timelineMap.has(landedK))
        timelineMap.get(landedK)!.landed++;

      const ruggedK = r?.ruggedAt ? dayKey(new Date(r.ruggedAt)) : null;
      if (ruggedK && timelineMap.has(ruggedK))
        timelineMap.get(ruggedK)!.rugged++;
    }

    const timeline = Array.from(timelineMap.values());

    const byChain = Array.from(byChainMap.entries())
      .map(([chain, count]) => ({ chain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, effectiveTopChains);

    return {
      total,
      landed,
      rugged,
      landedUSD,
      doneRate,
      landedRate,
      ruggedRate,
      pie,
      timeline,
      byChain,
    };
  }, [rows, days, effectiveTopChains]);

  // toggle open: mount charts after collapse animation + 1 frame
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if (!open) {
      setChartsReady(false);
      return;
    }

    setChartsReady(false);
    timerRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => setChartsReady(true));
    }, COLLAPSE_MS + 120);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [open]);

  if (!rows?.length) return null;

  // ====== MOBILE BIGGER SIZING ======
  const pieOuter = isMobile ? 92 : 82;
  const pieInner = isMobile ? 58 : 50;

  const PIE_H_PX = isMobile ? 240 : 224;
  const LINE_H_PX = isMobile ? 240 : 224;
  const BAR_H_PX = isMobile ? 260 : 240;

  const axisTick = {
    fill: "rgba(161,161,170,0.95)",
    fontSize: isMobile ? 12 : 11,
    fontWeight: 900,
  } as const;

  const yAxisWidth = isMobile ? 42 : 40;

  return (
    <div className="px-2 mt-4 md:mt-0">
      <GlassCard className="mx-2 md:mx-0 p-0 overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 bg-zinc-950/60 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <Sparkles className="text-emerald-400" size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
                Grind Analytics
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 truncate">
                Based on current filters / search
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="h-10 px-4 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-emerald-500/30 text-zinc-200 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all"
          >
            {open ? (
              <>
                Hide <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>

        {/* Animated panel */}
        <motion.div
          initial={false}
          animate={
            open
              ? { maxHeight: 2200, opacity: 1, y: 0 }
              : { maxHeight: 0, opacity: 0, y: 8 }
          }
          transition={{ duration: COLLAPSE_MS / 1000, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
          className="bg-zinc-950/40"
        >
          <div className="p-5 space-y-6">
            <AnimatePresence mode="wait" initial={false}>
              {chartsReady ? (
                <motion.div
                  key={`charts-${isMobile ? "m" : "d"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-6"
                >
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 min-w-0">
                    <Stat label="Total" value={data.total} />
                    <Stat label="Done Rate" value={`${data.doneRate}%`} />
                    <Stat
                      label="Landed"
                      value={`${data.landedRate}%`}
                      accent="emerald"
                    />
                    <Stat
                      label="Rugged"
                      value={`${data.ruggedRate}%`}
                      accent="red"
                    />

                    {/* Mobile: Secured becomes longer + bigger */}
                    <Stat
                      label="Secured (USD)"
                      className="col-span-2 md:col-span-1 min-h-[104px] md:min-h-0"
                      valueClassName="text-3xl md:text-xl"
                      value={
                        <span className="inline-flex items-center gap-2">
                          <Coins size={20} className="text-emerald-400" />
                          {data.landedUSD > 0
                            ? `$ ${formatUSD(data.landedUSD)}`
                            : "—"}
                        </span>
                      }
                    />
                  </div>

                  {/* Charts grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-w-0">
                    {/* Pie */}
                    <div className="rounded-3xl bg-zinc-900/50 border border-white/10 p-4 md:p-5 relative overflow-hidden min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">
                        Landed vs Rugged
                      </p>

                      <div
                        className="relative w-full"
                        style={{ height: PIE_H_PX }}
                      >
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          minWidth={1}
                          minHeight={1}
                        >
                          <PieChart
                            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                          >
                            <PieAny
                              data={data.pie}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={pieOuter}
                              innerRadius={pieInner}
                              stroke="rgba(255,255,255,0.18)"
                              strokeWidth={1}
                              activeIndex={activePieIndex ?? undefined}
                              activeShape={renderActiveShape}
                              onMouseEnter={(_: any, idx: number) =>
                                setActivePieIndex(idx)
                              }
                              onMouseLeave={() => setActivePieIndex(null)}
                            >
                              {data.pie.map((p: any, idx: number) => (
                                <Cell
                                  key={idx}
                                  fill={PIE_COLORS[p.name as PieName]}
                                  opacity={
                                    activePieIndex === null
                                      ? 1
                                      : activePieIndex === idx
                                        ? 1
                                        : 0.55
                                  }
                                />
                              ))}
                            </PieAny>
                            <Tooltip
                              content={<NeonTooltip />}
                              wrapperStyle={{ zIndex: 9999 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-3 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                        Total {data.total} • Landed {data.landed} • Rugged{" "}
                        {data.rugged}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-3xl bg-zinc-900/50 border border-white/10 p-4 md:p-5 lg:col-span-2 relative overflow-hidden min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">
                        Timeline (Last {days} Days)
                      </p>

                      <div
                        className="relative w-full"
                        style={{ height: LINE_H_PX }}
                      >
                        <ResponsiveContainer
                          width="100%"
                          height="100%"
                          minWidth={1}
                          minHeight={1}
                        >
                          <LineChart
                            data={data.timeline}
                            margin={{
                              top: 10,
                              right: isMobile ? 10 : 12,
                              bottom: 10,
                              left: 0,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="rgba(255,255,255,0.10)"
                            />
                            <XAxis dataKey="day" hide />
                            <YAxis
                              allowDecimals={false}
                              tick={axisTick}
                              width={yAxisWidth}
                            />
                            <Tooltip
                              content={<NeonTooltip />}
                              wrapperStyle={{ zIndex: 9999 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="created"
                              stroke="#a1a1aa"
                              strokeWidth={3}
                              dot={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="landed"
                              stroke="#10b981"
                              strokeWidth={3}
                              dot={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="rugged"
                              stroke="#ef4444"
                              strokeWidth={3}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Top Chains */}
                  <div className="rounded-3xl bg-zinc-900/50 border border-white/10 p-4 md:p-5 relative overflow-hidden min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">
                      Top Chains (Filtered)
                    </p>

                    <div
                      className="relative w-full"
                      style={{ height: BAR_H_PX }}
                    >
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={1}
                        minHeight={1}
                      >
                        {isMobile ? (
                          // Mobile: horizontal bars (more readable & larger)
                          <BarChart
                            data={data.byChain}
                            layout="vertical"
                            margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="rgba(255,255,255,0.10)"
                            />
                            <XAxis
                              type="number"
                              allowDecimals={false}
                              tick={axisTick}
                            />
                            <YAxis
                              type="category"
                              dataKey="chain"
                              tick={axisTick}
                              width={72}
                            />
                            <Tooltip
                              content={<NeonTooltip />}
                              wrapperStyle={{ zIndex: 9999 }}
                            />
                            <Bar
                              dataKey="count"
                              fill="#22c55e"
                              radius={[10, 10, 10, 10]}
                              barSize={22}
                            />
                          </BarChart>
                        ) : (
                          // Desktop: normal bars
                          <BarChart
                            data={data.byChain}
                            barCategoryGap={18}
                            margin={{ top: 8, right: 12, bottom: 18, left: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="rgba(255,255,255,0.10)"
                            />
                            <XAxis dataKey="chain" tick={axisTick} />
                            <YAxis
                              allowDecimals={false}
                              tick={axisTick}
                              width={40}
                            />
                            <Tooltip
                              content={<NeonTooltip />}
                              wrapperStyle={{ zIndex: 9999 }}
                            />
                            <Bar
                              dataKey="count"
                              fill="#22c55e"
                              radius={[10, 10, 2, 2]}
                            />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.16 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 min-w-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[84px] rounded-2xl bg-zinc-900/50 border border-white/10 animate-pulse"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-w-0">
                    <div className="h-56 rounded-3xl bg-zinc-900/50 border border-white/10 animate-pulse" />
                    <div className="h-56 lg:col-span-2 rounded-3xl bg-zinc-900/50 border border-white/10 animate-pulse" />
                  </div>

                  <div className="h-60 rounded-3xl bg-zinc-900/50 border border-white/10 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </GlassCard>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  className,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "emerald" | "red";
  className?: string;
  valueClassName?: string;
}) {
  const accentCls =
    accent === "emerald"
      ? "shadow-[0_0_30px_rgba(16,185,129,0.12)]"
      : accent === "red"
        ? "shadow-[0_0_30px_rgba(239,68,68,0.10)]"
        : "";

  return (
    <div
      className={cx(
        "rounded-2xl bg-zinc-900/60 border border-white/10 p-4 min-w-0 overflow-hidden",
        accentCls,
        className,
      )}
    >
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
        {label}
      </p>
      <div
        className={cx(
          "mt-2 text-xl text-zinc-100 font-black font-[var(--font-display)]",
          valueClassName,
        )}
      >
        {value}
      </div>
    </div>
  );
}

function NeonTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl bg-zinc-950/95 border border-white/15 px-4 py-3 shadow-2xl backdrop-blur">
      {label ? (
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
          {label}
        </p>
      ) : null}

      <div className="space-y-1">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: p.color || p.fill || "#a1a1aa" }}
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-100">
                {String(p.name || p.dataKey || "Value")}
              </span>
            </div>

            <span className="text-[11px] font-black text-emerald-300">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
