"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import {
  X as CloseIcon,
  Wallet,
  Send,
  Mail,
  FileText,
  Activity,
  Copy,
  Check,
  BarChart3,
  Grip,
  Clock3,
  CalendarDays,
} from "lucide-react";

const WebButtonWrapper = styled.div`
  .cta {
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
  }
  .cta span {
    padding-bottom: 7px;
    letter-spacing: 4px;
    font-size: 12px;
    padding-right: 14px;
    text-transform: uppercase;
    font-weight: 900;
    color: #e4e4e7;
  }
  .cta svg {
    transform: translateX(-8px);
    transition: all 0.3s ease;
    color: #10b981;
  }
  .cta:hover svg {
    transform: translateX(0);
  }
  .cta:active svg {
    transform: scale(0.9);
  }
  .hover-underline-animation {
    position: relative;
    padding-bottom: 10px;
  }
  .hover-underline-animation:after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #10b981;
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }
  .cta:hover .hover-underline-animation:after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;

const XLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

function Clamp({
  lines,
  title,
  className,
  children,
}: {
  lines: number;
  title?: string;
  className?: string;
  children: any;
}) {
  return (
    <span
      title={title}
      style={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        overflow: "hidden",
      }}
      className={className}
    >
      {children}
    </span>
  );
}

function fmtDateTime(v: any) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function fmtDateOnly(v: any) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  // DD/MM/YYYY
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export const DetailModal = ({ isOpen, onClose, data }: any) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = async () => {
    if (!data?.wallet) return;
    try {
      await navigator.clipboard.writeText(data.wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  if (!mounted || !data) return null;

  const statusColor =
    data.status === "LANDED"
      ? "text-emerald-500"
      : data.status === "RUGGED"
        ? "text-red-500"
        : "text-zinc-200";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 py-10 md:py-16 font-[var(--font-body)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
          />

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] px-4 py-2 bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl"
              >
                Copied
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl overflow-x-hidden [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* header */}
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-5">
              <div className="flex-1 min-w-0 pr-4 text-zinc-50">
                <Clamp
                  lines={3}
                  title={data.airdropName}
                  className="font-[var(--font-display)] font-black uppercase tracking-tight leading-[1.05] text-2xl md:text-4xl"
                >
                  {data.airdropName}
                </Clamp>

                {data.tokenTicker && (
                  <span
                    title={data.tokenTicker}
                    className="mt-3 inline-flex max-w-[240px] truncate px-3 py-1 text-[10px] bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 uppercase tracking-widest font-black"
                  >
                    {data.tokenTicker}
                  </span>
                )}

                <p className="mt-3 flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  <Activity size={14} /> Status:{" "}
                  <span className={statusColor}>{String(data.status)}</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-3 bg-zinc-800 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg"
                aria-label="Close"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800/50 p-5 rounded-3xl border border-white/5 shadow-inner min-w-0">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <BarChart3 size={14} className="text-emerald-500" /> Chain
                </p>
                <Clamp
                  lines={2}
                  title={data.chain}
                  className="font-[var(--font-display)] font-black text-white uppercase tracking-tight text-base md:text-lg leading-tight"
                >
                  {data.chain || "-"}
                </Clamp>
              </div>

              <div className="bg-zinc-800/50 p-5 rounded-3xl border border-white/5 shadow-inner min-w-0">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Wallet size={14} className="text-emerald-500" /> Wallet
                </p>
                <p className="text-[12px] font-black text-zinc-300 uppercase tracking-widest">
                  {data.wallet ? "REGISTERED" : "NOT LINKED"}
                </p>
              </div>

              <div className="bg-zinc-950/60 p-5 rounded-3xl border border-white/10 md:col-span-2 shadow-inner min-w-0">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Grip size={14} className="text-emerald-500" /> Full Address
                </p>

                {data.wallet ? (
                  <div className="flex items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-2xl border border-white/15 shadow-inner hover:border-emerald-500/35 transition-all min-w-0">
                    <span
                      title={data.wallet}
                      className="font-mono text-[14px] md:text-[16px] text-zinc-100 truncate min-w-0 flex-1 tracking-wide"
                    >
                      {data.wallet}
                    </span>

                    <button
                      onClick={handleCopy}
                      className={`p-3 shrink-0 rounded-xl transition-all border shadow-sm active:scale-90 ${
                        copied
                          ? "bg-emerald-500 text-zinc-950 border-emerald-500/40"
                          : "bg-white/5 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 border-white/10"
                      }`}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                ) : (
                  <p className="font-mono text-xs text-zinc-500 italic">
                    No address linked.
                  </p>
                )}
              </div>
            </div>

            {/* links + socials */}
            <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 mb-6 flex flex-col md:flex-row gap-6 items-center justify-between min-w-0">
              {data.websiteLink && (
                <WebButtonWrapper>
                  <button
                    className="cta"
                    onClick={() => window.open(data.websiteLink, "_blank")}
                  >
                    <span className="hover-underline-animation">
                      Visit Project
                    </span>
                    <svg
                      viewBox="0 0 46 16"
                      width={30}
                      height={10}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                        transform="translate(30)"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </WebButtonWrapper>
              )}

              <div className="flex flex-col gap-3 text-zinc-50 font-black uppercase tracking-widest text-[11px] min-w-0 w-full md:w-auto">
                {data.xHandle && (
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="mt-0.5 text-zinc-200">
                      <XLogo />
                    </span>
                    <Clamp lines={2} title={data.xHandle} className="min-w-0">
                      {data.xHandle}
                    </Clamp>
                  </div>
                )}

                {data.telegram && (
                  <div className="flex items-start gap-2 min-w-0">
                    <Send size={16} className="text-sky-400 mt-0.5" />
                    <Clamp lines={2} title={data.telegram} className="min-w-0">
                      {data.telegram}
                    </Clamp>
                  </div>
                )}

                {data.contactEmail && (
                  <div className="flex items-start gap-2 min-w-0">
                    <Mail size={16} className="text-amber-500 mt-0.5" />
                    <Clamp
                      lines={2}
                      title={data.contactEmail}
                      className="min-w-0"
                    >
                      {data.contactEmail}
                    </Clamp>
                  </div>
                )}
              </div>
            </div>

            {/* Intel Log */}
            <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 mb-6 shadow-inner">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock3 size={14} className="text-emerald-500" /> Airdrop Log
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <LogRow
                  icon={<CalendarDays size={14} className="text-zinc-400" />}
                  label="Created"
                  value={fmtDateTime(data.createdAt)}
                />

                <LogRow
                  icon={<CalendarDays size={14} className="text-zinc-400" />}
                  label="Task Date"
                  value={fmtDateOnly(data.taskDate)}
                />

                {/* ✅ tampil hanya kalau ada */}
                {data.landedAt ? (
                  <LogRow
                    icon={
                      <CalendarDays size={14} className="text-emerald-500" />
                    }
                    label="Landed At"
                    value={fmtDateTime(data.landedAt)}
                  />
                ) : null}

                {data.ruggedAt ? (
                  <LogRow
                    icon={<CalendarDays size={14} className="text-red-500" />}
                    label="Rugged At"
                    value={fmtDateTime(data.ruggedAt)}
                  />
                ) : null}

                <LogRow
                  icon={<Clock3 size={14} className="text-zinc-400" />}
                  label="Last Updated"
                  value={fmtDateTime(data.updatedAt)}
                />

                {data.status === "LANDED" && data.landedValue != null && (
                  <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Landed Value
                    </p>
                    <p className="mt-1 font-black text-zinc-100">
                      ${data.landedValue}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 shadow-inner">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FileText size={14} className="text-emerald-500" /> Notes
              </p>
              <p className="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap break-words">
                {data.description || "No tactical notes recorded."}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

function LogRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-3">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {label}
        </p>
      </div>
      <p className="mt-1 font-black text-zinc-100">{value}</p>
    </div>
  );
}
