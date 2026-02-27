"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  name: string; // field name untuk dikirim ke server (misal "taskDate")
  label?: string;
  defaultValue?: Date | string | null; // Date object atau ISO/any string date
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string; // default "DD/MM/YYYY"
};

type YMD = { y: number; m: number; d: number };

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function isValidYMD({ y, m, d }: YMD) {
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

// convert YMD -> "YYYY-MM-DD" (buat hidden input)
function toISODate(ymd: YMD) {
  return `${ymd.y}-${pad2(ymd.m)}-${pad2(ymd.d)}`;
}

// convert YMD -> "DD/MM/YYYY" (buat display)
function toDMY(ymd: YMD) {
  return `${pad2(ymd.d)}/${pad2(ymd.m)}/${ymd.y}`;
}

// parse "DD/MM/YYYY" or digits -> YMD
function parseDMY(value: string): YMD | null {
  const v = value.trim();
  // accept "DD/MM/YYYY" or "DD-MM-YYYY"
  const m = v.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    const ymd = { y, m: mo, d };
    return isValidYMD(ymd) ? ymd : null;
  }
  return null;
}

// parse ISO date "YYYY-MM-DD" -> YMD
function parseISODate(value: string): YMD | null {
  const v = value.trim();
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const ymd = { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
  return isValidYMD(ymd) ? ymd : null;
}

// mask input digits -> "DD/MM/YYYY"
function maskDMY(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);

  let out = dd;
  if (mm.length) out += `/${mm}`;
  if (yyyy.length) out += `/${yyyy}`;
  return out;
}

function ymdFromDate(dt: Date): YMD {
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() };
}

function clampMonthYear(base: Date) {
  // normalize to first day
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

// Monday-first calendar offset
function mondayIndex(jsDay: number) {
  // JS: 0 Sun..6 Sat -> Mon=0..Sun=6
  return (jsDay + 6) % 7;
}

export default function NeonDatePicker({
  name,
  label = "Task Date",
  defaultValue = null,
  required,
  disabled,
  className,
  placeholder = "DD/MM/YYYY",
}: Props) {
  const [open, setOpen] = useState(false);

  // displayed input "DD/MM/YYYY"
  const [display, setDisplay] = useState<string>("");

  // hidden value "YYYY-MM-DD" (yang dikirim ke server)
  const [iso, setIso] = useState<string>("");

  // validation
  const [isInvalid, setIsInvalid] = useState(false);

  // calendar view month
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    clampMonthYear(new Date()),
  );

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // init default value
  useEffect(() => {
    if (!defaultValue) return;

    let ymd: YMD | null = null;

    if (defaultValue instanceof Date) {
      ymd = ymdFromDate(defaultValue);
    } else if (typeof defaultValue === "string") {
      // try ISO first
      ymd = parseISODate(defaultValue) || parseDMY(defaultValue);
      // try Date parse fallback
      if (!ymd) {
        const dt = new Date(defaultValue);
        if (!Number.isNaN(dt.getTime())) ymd = ymdFromDate(dt);
      }
    }

    if (ymd && isValidYMD(ymd)) {
      setIso(toISODate(ymd));
      setDisplay(toDMY(ymd));
      setIsInvalid(false);
      setViewMonth(clampMonthYear(new Date(ymd.y, ymd.m - 1, 1)));
    }
  }, [defaultValue]);

  // close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(t)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const selectedYMD = useMemo(() => parseISODate(iso), [iso]);

  const monthLabel = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    });
    return fmt.format(viewMonth);
  }, [viewMonth]);

  const daysGrid = useMemo(() => {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth(); // 0-based
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const firstOffset = mondayIndex(first.getDay());
    const totalDays = last.getDate();

    // 6 rows * 7 cols
    const cells: Array<{ ymd: YMD | null; muted?: boolean }> = [];

    // prev month fill
    const prevLast = new Date(y, m, 0).getDate();
    for (let i = 0; i < firstOffset; i++) {
      const d = prevLast - (firstOffset - 1 - i);
      const prev = new Date(y, m - 1, d);
      cells.push({ ymd: ymdFromDate(prev), muted: true });
    }

    // current month
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ ymd: { y, m: m + 1, d } });
    }

    // next month fill
    while (cells.length < 42) {
      const idx = cells.length - (firstOffset + totalDays) + 1;
      const next = new Date(y, m + 1, idx);
      cells.push({ ymd: ymdFromDate(next), muted: true });
    }

    return cells;
  }, [viewMonth]);

  const onInputChange = (v: string) => {
    const masked = maskDMY(v);
    setDisplay(masked);

    const parsed = parseDMY(masked);
    if (!masked || masked.length < 10) {
      // belum lengkap
      setIsInvalid(false);
      setIso("");
      return;
    }

    if (parsed) {
      setIso(toISODate(parsed));
      setIsInvalid(false);
      setViewMonth(clampMonthYear(new Date(parsed.y, parsed.m - 1, 1)));
    } else {
      setIso("");
      setIsInvalid(true);
    }
  };

  const pickDate = (ymd: YMD) => {
    setIso(toISODate(ymd));
    setDisplay(toDMY(ymd));
    setIsInvalid(false);
    setOpen(false);
  };

  const goPrevMonth = () => {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() - 1);
    setViewMonth(clampMonthYear(d));
  };

  const goNextMonth = () => {
    const d = new Date(viewMonth);
    d.setMonth(d.getMonth() + 1);
    setViewMonth(clampMonthYear(d));
  };

  const setToday = () => {
    const ymd = ymdFromDate(new Date());
    pickDate(ymd);
  };

  const clear = () => {
    setIso("");
    setDisplay("");
    setIsInvalid(false);
    setOpen(false);
  };

  const ringClass = isInvalid
    ? "ring-2 ring-red-500/60"
    : open
      ? "ring-2 ring-emerald-500/40"
      : "ring-1 ring-white/10";

  return (
    <div ref={wrapperRef} className={`w-full ${className || ""}`}>
      {label && (
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {label} {required ? <span className="text-red-500">*</span> : null}
        </p>
      )}

      {/* hidden ISO input -> server action baca dari formData.get(name) */}
      <input type="hidden" name={name} value={iso} />

      <div
        className={`relative rounded-2xl bg-zinc-950/60 border border-white/10 shadow-inner ${ringClass}`}
      >
        <div className="flex items-center gap-2 p-3">
          <input
            value={display}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder}
            inputMode="numeric"
            disabled={disabled}
            onFocus={() => setOpen(true)}
            className="w-full bg-transparent outline-none text-zinc-100 font-black tracking-widest text-[12px] placeholder:text-zinc-600"
          />

          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((s) => !s)}
            className="shrink-0 h-10 w-10 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-emerald-500/30 hover:bg-zinc-900 text-zinc-200 grid place-items-center transition-all active:scale-95"
            aria-label="Open calendar"
          >
            <CalendarDays size={18} className="text-emerald-400" />
          </button>
        </div>

        {/* helper text */}
        <div className="px-3 pb-3 -mt-1">
          {isInvalid ? (
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
              Invalid date. Use DD/MM/YYYY.
            </p>
          ) : (
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {iso ? `Saved: ${iso}` : "Type or pick from calendar"}
            </p>
          )}
        </div>

        {/* Calendar Popover */}
        <AnimatePresence>
          {open && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.14 }}
              className="absolute z-[9999] left-0 right-0 mt-2 p-4 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  className="h-10 w-10 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-emerald-500/30 grid place-items-center transition-all active:scale-95"
                  aria-label="Prev month"
                >
                  <ChevronLeft size={18} className="text-zinc-200" />
                </button>

                <div className="flex-1 text-center">
                  <p className="font-[var(--font-display)] text-zinc-100 font-black uppercase tracking-widest text-[11px]">
                    {monthLabel}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goNextMonth}
                  className="h-10 w-10 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-emerald-500/30 grid place-items-center transition-all active:scale-95"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} className="text-zinc-200" />
                </button>
              </div>

              {/* Week header (Mon first) */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
                  <div
                    key={w}
                    className="text-center text-[9px] font-black uppercase tracking-widest text-zinc-500"
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-2">
                {daysGrid.map((cell, idx) => {
                  const ymd = cell.ymd;
                  if (!ymd) {
                    return <div key={idx} className="h-10" />;
                  }

                  const isSel =
                    selectedYMD &&
                    selectedYMD.y === ymd.y &&
                    selectedYMD.m === ymd.m &&
                    selectedYMD.d === ymd.d;

                  const isToday = (() => {
                    const t = ymdFromDate(new Date());
                    return t.y === ymd.y && t.m === ymd.m && t.d === ymd.d;
                  })();

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => pickDate(ymd)}
                      className={[
                        "h-10 rounded-xl border text-[11px] font-black tracking-widest transition-all active:scale-95",
                        cell.muted
                          ? "bg-zinc-900/40 border-white/5 text-zinc-600 hover:border-white/10"
                          : "bg-zinc-900/60 border-white/10 text-zinc-100 hover:border-emerald-500/30",
                        isToday ? "ring-2 ring-emerald-500/20" : "",
                        isSel
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                          : "",
                      ].join(" ")}
                      aria-label={toDMY(ymd)}
                    >
                      {pad2(ymd.d)}
                    </button>
                  );
                })}
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={setToday}
                  className="flex-1 h-10 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-emerald-500/30 text-zinc-100 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={clear}
                  className="h-10 w-10 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-red-500/30 text-zinc-100 grid place-items-center transition-all active:scale-95"
                  aria-label="Clear"
                >
                  <X size={16} className="text-red-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
