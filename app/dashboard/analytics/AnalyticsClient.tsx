"use client";

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
  Legend,
  BarChart,
  Bar,
} from "recharts";

import type { AnalyticsData, PieName } from "./types";

const PIE_COLORS: Record<PieName, string> = {
  LANDED: "#10b981",
  RUGGED: "#ef4444",
  OTHER: "#3f3f46",
};

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6 font-[var(--font-body)]">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total" value={data.total} />
        <Card label="Done Rate" value={`${data.doneRate}%`} />
        <Card label="Landed Rate" value={`${data.landedRate}%`} />
        <Card label="Rugged Rate" value={`${data.ruggedRate}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">
            Landed vs Rugged
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pie}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {data.pie.map((p, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[p.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 text-[11px] text-zinc-400 font-black uppercase tracking-widest">
            Total {data.total} • Landed {data.landed} • Rugged {data.rugged}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 lg:col-span-2">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">
            Timeline (Last 30 Days)
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="created" stroke="#a1a1aa" />
                <Line type="monotone" dataKey="landed" stroke="#10b981" />
                <Line type="monotone" dataKey="rugged" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chain bar */}
      <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-4">
          Breakdown by Chain
        </p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byChain}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="chain" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
        {label}
      </p>
      <p className="mt-2 text-2xl text-zinc-100 font-black font-[var(--font-display)]">
        {value}
      </p>
    </div>
  );
}
