// app/dashboard/analytics/types.ts

export type PieName = "LANDED" | "RUGGED" | "OTHER";

export type PiePoint = {
  name: PieName;
  value: number;
};

export type TimelinePoint = {
  day: string; // YYYY-MM-DD
  created: number;
  landed: number;
  rugged: number;
};

export type ChainPoint = {
  chain: string;
  count: number;
};

export type AnalyticsData = {
  total: number;
  landed: number;
  rugged: number;
  doneRate: number;
  landedRate: number;
  ruggedRate: number;
  pie: PiePoint[];
  timeline: TimelinePoint[];
  byChain: ChainPoint[];
};
