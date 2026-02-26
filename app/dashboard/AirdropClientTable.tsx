"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonToggle } from "@/components/ui/NeonToggle";
import { UiverseCheckbox } from "@/components/ui/UiverseCheckbox";
import { UiverseInput } from "@/components/ui/UiverseInput";
import {
  toggleDoneStatus,
  markAsLanded,
  markAsRugged,
  deleteAirdrops,
} from "./actions";
import {
  Wallet,
  Twitter,
  Send,
  Mail,
  Search,
  Edit,
  Trash2,
  CalendarDays,
  BarChart3,
  Grip,
} from "lucide-react";

// Update tipe data biar TS ga bawel
type Airdrop = {
  id: string;
  airdropName: string;
  chain: string;
  tokenTicker: string | null;
  landedValue: number | null;
  taskDate: Date;
  status: string;
  wallet: string | null;
  xHandle: string | null;
  telegram: string | null;
  contactEmail: string | null;
  description: string | null;
};

export default function AirdropClientTable({
  airdrops,
  userId,
}: {
  airdrops: Airdrop[];
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk Bulk Delete (Checkbox)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // State untuk Modal "Mark Landed"
  const [landingModalOpen, setLandingModalOpen] = useState(false);
  const [selectedAirdropId, setSelectedAirdropId] = useState("");
  const [dollarInput, setDollarInput] = useState("");

  // Logic Pagination
  const totalPages = Math.ceil(airdrops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = airdrops.slice(startIndex, startIndex + itemsPerPage);

  // Logic Checkbox
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData.map((item) => item.id));
    }
  };

  // Logic Delete
  const handleDeleteSelected = () => {
    if (confirm(`Yakin mau hapus ${selectedIds.length} data ini bro?`)) {
      startTransition(() => {
        deleteAirdrops(selectedIds);
        setSelectedIds([]);
      });
    }
  };

  // Logic Submit Dollar Landed
  const handleLandedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      markAsLanded(selectedAirdropId, Number(dollarInput));
      setLandingModalOpen(false);
      setDollarInput("");
    });
  };

  if (airdrops.length === 0) {
    return (
      <GlassCard className="text-center p-12">
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          No airdrops tracked yet. Click the button above to add a real entry!
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Top Bar: Bulk Actions & Pagination Info */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0 || isPending}
            // Uiverse Inspired: Glowing Red Bulk Delete Button
            className="group flex items-center gap-2 px-5 py-2.5 text-xs font-black text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            HAPUS TERPILIH ({selectedIds.length})
          </button>
        </div>
        <div className="text-xs font-bold text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800 px-4 py-2 rounded-lg">
          PAGE {currentPage} OF {totalPages || 1}
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW (hidden on small screens) --- */}
      <div className="hidden md:block">
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900/50">
                <th className="p-5 w-[5%] text-center">
                  <UiverseCheckbox
                    checked={
                      selectedIds.length === currentData.length &&
                      currentData.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-5 font-bold w-[28%]">Project & Info</th>
                <th className="p-5 font-bold w-[12%]">Chain</th>
                <th className="p-5 font-bold w-[15%] text-center">Done?</th>
                <th className="p-5 font-bold w-[15%] text-center">Status</th>
                <th className="p-5 font-bold w-[25%] text-right pr-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
              {currentData.map((item) => {
                const isDone =
                  item.status === "DONE" ||
                  item.status === "LANDED" ||
                  item.status === "RUGGED";
                const isFinished =
                  item.status === "LANDED" || item.status === "RUGGED";

                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 group"
                  >
                    <td className="p-5 text-center">
                      <UiverseCheckbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>

                    {/* Project Info & Icons */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <p
                          className="font-extrabold text-zinc-900 dark:text-zinc-50 text-base truncate"
                          title={item.airdropName}
                        >
                          {item.airdropName}
                        </p>
                        {item.tokenTicker && (
                          <span className="px-2.5 py-1 text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 rounded-md text-zinc-600 dark:text-zinc-300">
                            {item.tokenTicker}
                          </span>
                        )}
                      </div>

                      {/* Contact Info (Larger icons with title) */}
                      <div className="flex items-center gap-3">
                        {item.wallet && (
                          <div
                            title={item.wallet}
                            className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-300/50 dark:border-zinc-700/50"
                          >
                            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                            {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                          </div>
                        )}
                        <div className="flex items-center gap-2.5 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                          {item.xHandle && (
                            <span
                              title={`X: ${item.xHandle}`}
                              className="cursor-pointer"
                            >
                              <Twitter className="w-4 h-4 text-zinc-400 hover:text-blue-400 transition-colors" />
                            </span>
                          )}
                          {item.telegram && (
                            <span
                              title={`TG: ${item.telegram}`}
                              className="cursor-pointer"
                            >
                              <Send className="w-4 h-4 text-zinc-400 hover:text-sky-400 transition-colors" />
                            </span>
                          )}
                          {item.contactEmail && (
                            <span
                              title={`Email: ${item.contactEmail}`}
                              className="cursor-pointer"
                            >
                              <Mail className="w-4 h-4 text-zinc-400 hover:text-amber-500 transition-colors" />
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Chain */}
                    <td className="p-5 Chain">
                      <span className="px-3 py-1 text-xs font-bold rounded-md bg-zinc-200/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {item.chain}
                      </span>
                    </td>

                    {/* Neon Toggle */}
                    <td className="p-5 Toggle Done">
                      <div className="flex justify-center">
                        <NeonToggle
                          isOn={isDone}
                          onToggle={() => {
                            if (!isFinished)
                              startTransition(() => {
                                toggleDoneStatus(item.id, item.status);
                              });
                          }}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-5 Status">
                      <div className="flex flex-col items-center">
                        <span
                          className={`inline-block w-24 px-2 py-1.5 text-[10px] font-black tracking-wider uppercase rounded-lg border text-center ${
                            item.status === "LANDED"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              : item.status === "RUGGED"
                                ? "bg-red-500/10 text-red-500 border-red-500/30"
                                : item.status === "DONE"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                  : "bg-orange-500/10 text-orange-500 border-orange-500/30"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                        {item.status === "LANDED" && item.landedValue && (
                          <p className="text-xs font-black text-emerald-500 mt-1.5">
                            +${item.landedValue}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-5 pr-6 Actions flex items-center justify-end gap-2 mt-4">
                      <button
                        title="View Detail"
                        className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-all"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit Target"
                        className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-all mr-2"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {!isFinished && (
                        <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                          <button
                            onClick={() => {
                              setSelectedAirdropId(item.id);
                              setLandingModalOpen(true);
                            }}
                            disabled={isPending}
                            className="px-3 py-1.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/50 rounded-lg hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            LANDED 💸
                          </button>
                          <button
                            onClick={() =>
                              startTransition(() => {
                                markAsRugged(item.id);
                              })
                            }
                            disabled={isPending}
                            className="px-3 py-1.5 text-[10px] font-bold text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                          >
                            RUGGED 💀
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* --- MOBILE CARD VIEW (hidden on desktop) --- */}
      <div className="md:hidden space-y-4">
        {currentData.map((item) => {
          const isDone =
            item.status === "DONE" ||
            item.status === "LANDED" ||
            item.status === "RUGGED";
          const isFinished =
            item.status === "LANDED" || item.status === "RUGGED";

          return (
            <GlassCard key={item.id} className="p-5 space-y-5">
              {/* Mobile Header: Checkbox + Project Name */}
              <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <UiverseCheckbox
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-zinc-900 dark:text-zinc-50 text-lg truncate flex-1">
                      {item.airdropName}
                    </p>
                    {item.tokenTicker && (
                      <span className="px-2.5 py-1 text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 rounded-md text-zinc-600 dark:text-zinc-300">
                        {item.tokenTicker}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                    <CalendarDays className="w-3 h-3 text-emerald-500" />{" "}
                    {new Date(item.taskDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Mobile Body: Contacts & Chain */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1.5 col-span-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Network / Chain
                  </p>
                  <span className="px-3 py-1 text-xs font-bold rounded-md bg-zinc-200/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5" /> {item.chain}
                  </span>
                </div>

                <div className="col-span-2 space-y-3 pt-1">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    Contact Info
                  </p>
                  <div className="grid grid-cols-2 gap-3 flex-wrap">
                    {/* Larger Contact Badges with Real Icons */}
                    {item.wallet && (
                      <div
                        title={item.wallet}
                        className="flex items-center gap-2 text-xs text-zinc-900 dark:text-zinc-100 font-mono bg-zinc-200/50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-300/50 dark:border-zinc-700/50 truncate"
                      >
                        <Wallet className="w-4 h-4 text-emerald-500" />{" "}
                        {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                      </div>
                    )}
                    {item.xHandle && (
                      <div
                        title={item.xHandle}
                        className="flex items-center gap-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-200/50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-300/50 dark:border-zinc-700/50"
                      >
                        <Twitter className="w-4 h-4 text-blue-400" /> Twitter
                      </div>
                    )}
                    {item.telegram && (
                      <div
                        title={item.telegram}
                        className="flex items-center gap-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-200/50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-300/50 dark:border-zinc-700/50"
                      >
                        <Send className="w-4 h-4 text-sky-400" /> Telegram
                      </div>
                    )}
                    {item.contactEmail && (
                      <div
                        title={item.contactEmail}
                        className="flex items-center gap-2 text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-200/50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-300/50 dark:border-zinc-700/50"
                      >
                        <Mail className="w-4 h-4 text-amber-500" /> Email
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Footer: Status, Toggle, & Actions */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-2 grid grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-left">
                    Done?
                  </p>
                  <NeonToggle
                    isOn={isDone}
                    onToggle={() => {
                      if (!isFinished)
                        startTransition(() => {
                          toggleDoneStatus(item.id, item.status);
                        });
                    }}
                  />
                </div>
                <div className="flex flex-col items-end space-y-1.5">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1.5 text-[10px] font-black tracking-wider uppercase rounded-lg border text-center ${
                      item.status === "LANDED"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        : item.status === "RUGGED"
                          ? "bg-red-500/10 text-red-500 border-red-500/30"
                          : item.status === "DONE"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                            : "bg-orange-500/10 text-orange-500 border-orange-500/30"
                    }`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                  {item.status === "LANDED" && item.landedValue && (
                    <p className="text-xs font-black text-emerald-500 mt-0.5">
                      +${item.landedValue}
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile Actions Button Group */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  title="View Detail"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-zinc-200 dark:bg-zinc-800 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  <Search className="w-4 h-4" /> DETAIL
                </button>
                <button
                  title="Edit Target"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-zinc-200 dark:bg-zinc-800 rounded-xl hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Edit className="w-4 h-4" /> EDIT
                </button>

                {!isFinished && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAirdropId(item.id);
                        setLandingModalOpen(true);
                      }}
                      disabled={isPending}
                      className="w-full px-4 py-2.5 text-[10px] font-black tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500 hover:text-white transition-all duration-300 active:scale-95 disabled:opacity-50"
                    >
                      LANDED 💸
                    </button>
                    <button
                      onClick={() =>
                        startTransition(() => {
                          markAsRugged(item.id);
                        })
                      }
                      disabled={isPending}
                      className="w-full px-4 py-2.5 text-[10px] font-black tracking-wider text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95 disabled:opacity-50"
                    >
                      RUGGED 💀
                    </button>
                  </>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Pagination Controls (Always centered and properly sized) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6 relative z-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-zinc-200 dark:bg-zinc-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-500 hover:text-white transition-colors shadow-sm duration-300"
          >
            &lt;
          </button>
          <span className="text-sm font-bold bg-zinc-200 dark:bg-zinc-800 px-4 py-2 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-zinc-200 dark:bg-zinc-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-500 hover:text-white transition-colors shadow-sm duration-300"
          >
            &gt;
          </button>
        </div>
      )}

      {/* Modal Input Dollar (Uiverse Glass Modal style) */}
      <AnimatePresence>
        {landingModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLandingModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-50 dark:bg-zinc-900/95 p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-xl"
            >
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-2">
                Congratz Bro! 🎉
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Cair berapa dollar nih dari target ini?
              </p>

              <form onSubmit={handleLandedSubmit}>
                <UiverseInput
                  id="dollar"
                  label="Landed Value (USD)"
                  type="number"
                  step="0.01"
                  required
                  value={dollarInput}
                  onChange={(e) => setDollarInput(e.target.value)}
                  startIcon={<Grip />}
                />
                <div className="flex justify-end gap-3 mt-10 pt-5 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setLandingModalOpen(false)}
                    className="px-5 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-7 py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                  >
                    SAVE 💸
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
