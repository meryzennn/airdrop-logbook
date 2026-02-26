"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X as CloseIcon,
  Wallet,
  Send,
  Mail,
  FileText,
  Activity,
  Coins,
  Copy,
  Check,
  Globe,
  BarChart3,
  Grip,
} from "lucide-react";

const XLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export const DetailModal = ({ isOpen, onClose, data }: any) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // FIXED: Constant dependency array [isOpen]
  useEffect(() => {
    setMounted(true);
    // FIXED: Lock background scroll context fix
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.wallet || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDynamicFontSize = (text: string) => {
    const len = text?.length || 0;
    if (len < 12) return "text-3xl md:text-5xl";
    return "text-xl md:text-3xl";
  };

  return (
    <>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 py-10 md:py-20">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl custom-scrollbar overflow-x-hidden font-sans"
                >
                  <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                    <div className="flex-1 min-w-0 pr-4 text-zinc-50">
                      <h2 className="font-black uppercase tracking-tighter leading-snug break-all text-3xl md:text-5xl font-black">
                        {data.airdropName}
                        {data.tokenTicker && (
                          <span className="ml-3 px-3 py-1 text-sm bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 shrink-0 uppercase">
                            {data.tokenTicker}
                          </span>
                        )}
                      </h2>
                      <p className="mt-4 flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest">
                        <Activity size={14} /> Status:{" "}
                        <span className="text-emerald-500">{data.status}</span>
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-3 bg-zinc-800 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg"
                    >
                      <CloseIcon size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch font-sans">
                    <div className="bg-zinc-800/50 p-6 rounded-3xl border border-white/5 flex flex-col justify-center shadow-inner">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BarChart3 size={14} className="text-emerald-500" />{" "}
                        Chain
                      </p>
                      <p
                        className={`font-black text-white uppercase break-all leading-tight ${getDynamicFontSize(data.chain)}`}
                      >
                        {data.chain}
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Wallet size={14} className="text-emerald-500" /> Wallet
                        Info
                      </p>
                      <p className="text-lg font-bold text-zinc-400 uppercase tracking-widest truncate">
                        {data.wallet ? "REGISTERED" : "UNLINKED"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-700/50 min-w-0 md:col-span-2 shadow-inner">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Grip size={14} className="text-emerald-500" /> Full
                        Intel Address
                      </p>
                      {data.wallet ? (
                        <div className="flex items-center justify-between gap-4 bg-zinc-100 dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-hidden">
                          <span className="font-mono text-[10px] md:text-xs text-zinc-900 dark:text-zinc-50 break-all leading-relaxed flex-1 font-black tracking-wider uppercase">
                            {data.wallet}
                          </span>
                          <button
                            onClick={handleCopy}
                            className="p-2.5 shrink-0 bg-white dark:bg-zinc-800 rounded-xl hover:bg-emerald-500 hover:text-white text-zinc-500 transition-all border border-zinc-200 dark:border-zinc-700 shadow-sm active:scale-90"
                          >
                            {copied ? (
                              <Check size={16} className="text-emerald-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 italic">
                          No tackle address linked.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-zinc-800/30 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-700/50 mb-8 flex flex-wrap gap-x-6 gap-y-4 items-center justify-center text-zinc-50 sm:justify-start">
                    {data.websiteLink && (
                      <a
                        href={data.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-black text-sm text-pink-500 hover:underline shrink-0 tracking-widest uppercase leading-none"
                      >
                        Website
                      </a>
                    )}
                    {data.xHandle && (
                      <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest shrink-0">
                        <XLogo /> <span>{data.xHandle}</span>
                      </div>
                    )}
                    {data.telegram && (
                      <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest shrink-0">
                        <Send size={16} className="text-sky-400" />{" "}
                        <span>{data.telegram}</span>
                      </div>
                    )}
                    {data.contactEmail && (
                      <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest shrink-0">
                        <Mail size={16} className="text-amber-500" />{" "}
                        <span>{data.contactEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2 text-zinc-50">
                      <FileText size={14} className="text-emerald-500" /> Notes
                    </p>
                    <p className="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap break-words min-w-0 break-words">
                      {data.description || "No notes recorded."}
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
