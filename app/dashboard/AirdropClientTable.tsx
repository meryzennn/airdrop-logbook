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
  Banknote,
  Skull,
} from "lucide-react";
import { DetailModal } from "./DetailModal";
import { EditModal } from "./EditModal";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [landingModalOpen, setLandingModalOpen] = useState(false);
  const [selectedAirdropId, setSelectedAirdropId] = useState("");
  const [dollarInput, setDollarInput] = useState("");

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAirdropData, setSelectedAirdropData] =
    useState<Airdrop | null>(null);

  const totalPages = Math.ceil(airdrops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = airdrops.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  const toggleSelectAll = () =>
    selectedIds.length === currentData.length
      ? setSelectedIds([])
      : setSelectedIds(currentData.map((item) => item.id));

  const handleDeleteSelected = () => {
    if (confirm(`Yakin mau hapus ${selectedIds.length} data ini bro?`)) {
      startTransition(() => {
        deleteAirdrops(selectedIds);
        setSelectedIds([]);
      });
    }
  };

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
          No targets tracked yet. Click the button above to add a real entry!
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Top Bar: Bulk Actions & Pagination */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center px-2">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0 || isPending}
          className="group flex items-center gap-2 px-5 py-2 text-xs font-black text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95"
        >
          <Trash2 className="w-4 h-4" /> HAPUS TERPILIH ({selectedIds.length})
        </button>
        <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
          PAGE {currentPage} OF {totalPages || 1}
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block">
        <GlassCard className="overflow-x-auto p-0 border border-zinc-200 dark:border-zinc-800/80">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              {/* FIX: Hapus background putih/abu-abu, dibikin transparan polos aja biar nyatu */}
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
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
                <th className="p-5 font-bold w-[10%] text-center">Done?</th>
                <th className="p-5 font-bold w-[15%] text-center">Status</th>
                <th className="p-5 font-bold w-[30%] text-right pr-6">
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

                    <td className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <p
                          className="font-extrabold text-zinc-900 dark:text-zinc-50 text-base truncate"
                          title={item.airdropName}
                        >
                          {item.airdropName}
                        </p>
                        {item.tokenTicker && (
                          <span className="px-2 py-0.5 text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300">
                            {item.tokenTicker}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {item.wallet && (
                          <div
                            title={item.wallet}
                            className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-300/50 dark:border-zinc-700/50"
                          >
                            <Wallet className="w-3.5 h-3.5 text-emerald-500" />{" "}
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

                    <td className="p-5">
                      <span className="px-3 py-1 text-xs font-bold rounded-md bg-zinc-200/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5" /> {item.chain}
                      </span>
                    </td>
                    <td className="p-5">
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
                    <td className="p-5">
                      <div className="flex flex-col items-center">
                        <span
                          className={`inline-block w-24 px-2 py-1.5 text-[10px] font-black tracking-wider uppercase rounded-lg border text-center ${item.status === "LANDED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : item.status === "RUGGED" ? "bg-red-500/10 text-red-500 border-red-500/30" : item.status === "DONE" ? "bg-blue-500/10 text-blue-500 border-blue-500/30" : "bg-orange-500/10 text-orange-500 border-orange-500/30"}`}
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

                    <td className="p-5 pr-6">
                      <div className="flex justify-end items-center gap-2">
                        {/* FIX: Tombol Action (Landed & Rugged) di Kiri, pake style unlucky-treefrog-77, Emoji diganti Lucide Icons */}
                        {!isFinished && (
                          <div className="flex items-center gap-2 border-r border-zinc-200 dark:border-zinc-700 pr-3 mr-1">
                            <button
                              onClick={() => {
                                setSelectedAirdropId(item.id);
                                setLandingModalOpen(true);
                              }}
                              disabled={isPending}
                              className="relative inline-flex items-center justify-center px-3 py-1.5 text-[10px] font-black tracking-widest text-emerald-500 transition-all duration-300 bg-zinc-100 dark:bg-[#18181b] rounded border border-emerald-500/20 hover:border-emerald-500 hover:text-emerald-400 hover:shadow-[inset_0_0_10px_rgba(16,185,129,0.2),_0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 overflow-hidden"
                            >
                              <Banknote className="w-3.5 h-3.5 mr-1.5" /> LANDED
                            </button>
                            <button
                              onClick={() =>
                                startTransition(() => {
                                  markAsRugged(item.id);
                                })
                              }
                              disabled={isPending}
                              className="relative inline-flex items-center justify-center px-3 py-1.5 text-[10px] font-black tracking-widest text-red-500 transition-all duration-300 bg-zinc-100 dark:bg-[#18181b] rounded border border-red-500/20 hover:border-red-500 hover:text-red-400 hover:shadow-[inset_0_0_10px_rgba(239,68,68,0.2),_0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50 overflow-hidden"
                            >
                              <Skull className="w-3.5 h-3.5 mr-1.5" /> RUGGED
                            </button>
                          </div>
                        )}

                        {/* FIX: Tombol Management (Detail & Edit) di Paling Kanan */}
                        <button
                          onClick={() => {
                            setSelectedAirdropData(item);
                            setViewModalOpen(true);
                          }}
                          title="View Detail"
                          className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-all"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAirdropData(item);
                            setEditModalOpen(true);
                          }}
                          title="Edit Target"
                          className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* --- MOBILE CARD VIEW (Fully Responsive & Clean) --- */}
      <div className="md:hidden space-y-4">
        {currentData.map((item) => {
          const isDone =
            item.status === "DONE" ||
            item.status === "LANDED" ||
            item.status === "RUGGED";
          const isFinished =
            item.status === "LANDED" || item.status === "RUGGED";

          return (
            <GlassCard
              key={item.id}
              className="p-5 flex flex-col gap-4 border border-zinc-200 dark:border-zinc-800/80 shadow-md"
            >
              {/* Top: Checkbox, Name, Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="mt-1">
                    <UiverseCheckbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </div>
                  <div className="flex flex-col truncate">
                    <p className="font-extrabold text-zinc-900 dark:text-zinc-50 text-base truncate">
                      {item.airdropName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.tokenTicker && (
                        <span className="px-2 py-0.5 text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300">
                          {item.tokenTicker}
                        </span>
                      )}
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />{" "}
                        {new Date(item.taskDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`inline-block px-2 py-1 text-[9px] font-black tracking-wider uppercase rounded border text-center ${item.status === "LANDED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : item.status === "RUGGED" ? "bg-red-500/10 text-red-500 border-red-500/30" : item.status === "DONE" ? "bg-blue-500/10 text-blue-500 border-blue-500/30" : "bg-orange-500/10 text-orange-500 border-orange-500/30"}`}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                  {item.status === "LANDED" && item.landedValue && (
                    <p className="text-[10px] font-black text-emerald-500 mt-1">
                      +${item.landedValue}
                    </p>
                  )}
                </div>
              </div>

              {/* Middle: Chain & Contacts Grid */}
              <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />{" "}
                  {item.chain}
                </div>
                {item.wallet && (
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                    <Wallet className="w-4 h-4 shrink-0" />{" "}
                    {item.wallet.slice(0, 8)}...{item.wallet.slice(-4)}
                  </div>
                )}
                <div className="flex gap-4 sm:col-span-2 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                  {item.xHandle && (
                    <span
                      title={`X: ${item.xHandle}`}
                      className="flex items-center gap-1.5 text-xs text-zinc-500"
                    >
                      <Twitter className="w-3.5 h-3.5 text-blue-400" />{" "}
                      {item.xHandle}
                    </span>
                  )}
                  {item.telegram && (
                    <span
                      title={`TG: ${item.telegram}`}
                      className="flex items-center gap-1.5 text-xs text-zinc-500"
                    >
                      <Send className="w-3.5 h-3.5 text-sky-400" />{" "}
                      {item.telegram}
                    </span>
                  )}
                  {item.contactEmail && (
                    <span
                      title={`Email: ${item.contactEmail}`}
                      className="flex items-center gap-1.5 text-xs text-zinc-500"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-500" /> Email
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Toggle & Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Done?
                  </span>
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedAirdropData(item);
                      setViewModalOpen(true);
                    }}
                    className="p-2 text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:text-emerald-500 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAirdropData(item);
                      setEditModalOpen(true);
                    }}
                    className="p-2 text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:text-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Status Buttons (Full Width in Mobile) */}
              {!isFinished && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => {
                      setSelectedAirdropId(item.id);
                      setLandingModalOpen(true);
                    }}
                    disabled={isPending}
                    className="relative flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] font-black tracking-widest text-emerald-500 bg-zinc-100 dark:bg-[#18181b] rounded-lg border border-emerald-500/20 shadow-[inset_0_0_5px_rgba(16,185,129,0.1)] hover:border-emerald-500 hover:shadow-[inset_0_0_10px_rgba(16,185,129,0.2),_0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Banknote className="w-4 h-4" /> LANDED
                  </button>
                  <button
                    onClick={() =>
                      startTransition(() => {
                        markAsRugged(item.id);
                      })
                    }
                    disabled={isPending}
                    className="relative flex items-center justify-center gap-2 px-3 py-2.5 text-[10px] font-black tracking-widest text-red-500 bg-zinc-100 dark:bg-[#18181b] rounded-lg border border-red-500/20 shadow-[inset_0_0_5px_rgba(239,68,68,0.1)] hover:border-red-500 hover:shadow-[inset_0_0_10px_rgba(239,68,68,0.2),_0_0_15px_rgba(239,68,68,0.3)] transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Skull className="w-4 h-4" /> RUGGED
                  </button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-bold bg-zinc-200 dark:bg-zinc-800 rounded-lg disabled:opacity-30 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            PREV
          </button>
          <span className="text-sm font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-bold bg-zinc-200 dark:bg-zinc-800 rounded-lg disabled:opacity-30 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            NEXT
          </button>
        </div>
      )}

      {/* Modals */}
      <DetailModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={selectedAirdropData}
      />
      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        data={selectedAirdropData}
        userId={userId}
      />

      {/* Modal Landed Dollar */}
      <AnimatePresence>
        {landingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              className="relative w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-zinc-900 p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
            >
              <h3 className="text-2xl font-extrabold text-white mb-2">
                Congratz Bro! 🎉
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
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
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setLandingModalOpen(false)}
                    className="px-4 py-2 text-sm font-bold text-zinc-400"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 text-sm font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
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
