"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  Twitter,
  Send,
  Mail,
  FileText,
  Activity,
  Coins,
} from "lucide-react";

export const DetailModal = ({ isOpen, onClose, data }: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!data) return null;

  return (
    <>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-50 dark:bg-zinc-900/95 p-8 shadow-[0_0_60px_rgba(16,185,129,0.2)] backdrop-blur-xl"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    <div>
                      <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                        {data.airdropName}
                        {data.tokenTicker && (
                          <span className="px-3 py-1 text-sm font-black bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/30">
                            {data.tokenTicker}
                          </span>
                        )}
                      </h2>
                      <p className="text-sm font-bold text-zinc-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4" /> STATUS:{" "}
                        <span
                          className={
                            data.status === "LANDED"
                              ? "text-emerald-500"
                              : data.status === "RUGGED"
                                ? "text-red-500"
                                : "text-blue-500"
                          }
                        >
                          {data.status}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Grid Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        Network / Chain
                      </p>
                      <p className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-emerald-500" />{" "}
                        {data.chain}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        Wallet Used
                      </p>
                      <p className="font-mono text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2 break-all">
                        <Wallet className="w-4 h-4 text-emerald-500" />{" "}
                        {data.wallet || "Not specified"}
                      </p>
                    </div>

                    {data.status === "LANDED" && data.landedValue && (
                      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30 md:col-span-2 text-center">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                          Total Profit
                        </p>
                        <p className="text-3xl font-black text-emerald-500">
                          +${data.landedValue}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Socials & Waitlist */}
                  <div className="bg-white dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 mb-6 flex flex-wrap gap-6">
                    {data.xHandle && (
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Twitter className="w-4 h-4 text-blue-400" />{" "}
                        {data.xHandle}
                      </div>
                    )}
                    {data.telegram && (
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Send className="w-4 h-4 text-sky-400" />{" "}
                        {data.telegram}
                      </div>
                    )}
                    {data.contactEmail && (
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Mail className="w-4 h-4 text-amber-500" />{" "}
                        {data.contactEmail}
                      </div>
                    )}
                    {!data.xHandle && !data.telegram && !data.contactEmail && (
                      <p className="text-sm text-zinc-500 font-bold">
                        No waitlist/social data recorded.
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="bg-white dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Notes & Tasks
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {data.description || "No notes provided."}
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
