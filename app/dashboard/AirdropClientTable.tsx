"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
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
  Send,
  Mail,
  Search,
  Edit,
  Trash2,
  BarChart3,
  Grip,
  Banknote,
  Skull,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { DetailModal } from "./DetailModal";
import { EditModal } from "./EditModal";
import AddAirdropModal from "./AddAirdropModal";

const StyledHamburger = styled.div`
  .hamburger {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hamburger input {
    display: none;
  }
  .hamburger svg {
    height: 2.2em;
    transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .line {
    fill: none;
    stroke: #e4e4e7;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3;
    transition:
      stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
      stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .line-top-bottom {
    stroke-dasharray: 12 63;
  }
  .hamburger input:checked + svg {
    transform: rotate(-45deg);
  }
  .hamburger input:checked + svg .line-top-bottom {
    stroke-dasharray: 20 300;
    stroke-dashoffset: -32.42;
  }
  .hamburger:hover .line {
    stroke: #10b981;
  }
`;

const XLogo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function AirdropClientTable({
  airdrops,
  userId,
}: {
  airdrops: any[];
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showRuggedOverlay, setShowRuggedOverlay] = useState(false);
  const [showLandedOverlay, setShowLandedOverlay] = useState(false);
  const [landingModalOpen, setLandingModalOpen] = useState(false);
  const [selectedAirdropId, setSelectedAirdropId] = useState("");
  const [dollarInput, setDollarInput] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAirdropData, setSelectedAirdropData] = useState<any | null>(
    null,
  );

  const totalPages = Math.ceil(airdrops.length / itemsPerPage);
  const currentData = airdrops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleRuggedAction = (id: string) => {
    setShowRuggedOverlay(true);
    setActiveMenuId(null);
    startTransition(() => markAsRugged(id));
    setTimeout(() => setShowRuggedOverlay(false), 5000);
  };

  const handleLandedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      markAsLanded(selectedAirdropId, Number(dollarInput));
      setLandingModalOpen(false);
      setDollarInput("");
      setActiveMenuId(null);
      setShowLandedOverlay(true);
      setTimeout(() => setShowLandedOverlay(false), 5000);
    });
  };

  if (airdrops.length === 0)
    return (
      <GlassCard className="p-12 text-center border-dashed border-zinc-800">
        <AddAirdropModal userId={userId} />
        <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest">
          No Logs Found
        </p>
      </GlassCard>
    );

  return (
    <div className="space-y-6 relative font-sans">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <AddAirdropModal userId={userId} />
          <button
            onClick={() => setDeleteModalOpen(true)}
            disabled={selectedIds.length === 0 || isPending}
            className="px-5 h-12 bg-zinc-900 border border-red-500/20 text-red-500 font-black rounded-xl text-[11px] tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
          >
            DELETE ({selectedIds.length})
          </button>
        </div>
        {/* Page counter at top */}
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
          LOGS PAGE {currentPage} OF {totalPages || 1}
        </div>
      </div>

      {/* Desktop Table View - STRICT GEOMETRY */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden border border-zinc-200 dark:border-zinc-800/80 shadow-lg p-0">
          <table className="w-full text-left border-collapse table-fixed min-w-full">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                <th className="p-5 w-[60px] text-center">
                  <UiverseCheckbox
                    checked={selectedIds.length === currentData.length}
                    onChange={() =>
                      selectedIds.length === currentData.length
                        ? setSelectedIds([])
                        : setSelectedIds(currentData.map((i) => i.id))
                    }
                  />
                </th>
                <th className="p-5 w-[300px] font-black text-white">
                  Project & Info
                </th>
                <th className="p-5 w-[160px] font-bold text-center">Chain</th>
                <th className="p-5 w-[100px] font-bold text-center">Done?</th>
                <th className="p-5 w-[120px] font-bold text-center">Status</th>
                <th className="p-5 w-[200px] font-bold text-center">Actions</th>
                {/* FIXED: MENU header locked inside table boundaries */}
                <th className="p-5 w-[80px] font-bold text-center">Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
              {currentData.map((item) => {
                const isFinished =
                  item.status === "LANDED" || item.status === "RUGGED";
                return (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 group"
                  >
                    <td className="p-5 w-[60px] text-center">
                      <UiverseCheckbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((i) => i !== item.id)
                              : [...prev, item.id],
                          )
                        }
                      />
                    </td>
                    <td className="p-5 w-[300px] overflow-hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-black text-white text-base truncate max-w-[180px] uppercase tracking-tighter">
                          {item.airdropName}
                        </p>
                        {item.tokenTicker && (
                          <span className="px-2 py-0.5 text-[10px] font-black bg-zinc-700 rounded text-zinc-300 uppercase shrink-0 truncate max-w-[80px]">
                            {item.tokenTicker}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-zinc-400">
                        {item.wallet && (
                          <div className="flex items-center gap-1 text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50 shrink-0">
                            <Wallet size={12} className="text-emerald-500" />{" "}
                            {item.wallet.slice(0, 6)}...
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {item.websiteLink && (
                            <a
                              href={item.websiteLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-pink-400 transition-colors"
                            >
                              <Globe size={14} />
                            </a>
                          )}
                          <span className="hover:text-zinc-50 cursor-pointer">
                            <XLogo />
                          </span>
                          <span className="hover:text-sky-400 cursor-pointer">
                            <Send size={14} />
                          </span>
                          <span className="hover:text-amber-500 cursor-pointer">
                            <Mail size={14} />
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 w-[160px] text-center">
                      <span className="px-3 py-1 bg-zinc-800 rounded-md inline-flex items-center gap-2 text-[10px] font-bold uppercase truncate max-w-[140px] shadow-sm">
                        <BarChart3 size={12} /> {item.chain}
                      </span>
                    </td>
                    <td className="p-5 w-[100px] text-center">
                      <div className="flex justify-center">
                        <NeonToggle
                          isOn={
                            item.status !== "PLANNED" &&
                            item.status !== "IN_PROGRESS"
                          }
                          onToggle={() => {
                            if (!isFinished)
                              startTransition(() =>
                                toggleDoneStatus(item.id, item.status),
                              );
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-5 w-[120px] text-center">
                      <span
                        className={`inline-block w-24 px-2 py-1.5 text-[10px] font-black uppercase rounded-lg border text-center ${item.status === "LANDED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : item.status === "RUGGED" ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-zinc-100 dark:bg-zinc-800"}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-5 w-[200px] text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAirdropData(item);
                            setViewModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-[10px] font-black text-emerald-500 border border-emerald-500/50 rounded-lg hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest"
                        >
                          DETAIL
                        </button>
                        {!isFinished && (
                          <button
                            onClick={() => {
                              setSelectedAirdropData(item);
                              setEditModalOpen(true);
                            }}
                            className="px-3 py-1.5 text-[10px] font-black text-blue-500 border border-blue-500/50 rounded-lg hover:bg-blue-500 hover:text-white transition-all uppercase tracking-widest"
                          >
                            EDIT
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-5 w-[80px] text-center">
                      {!isFinished && (
                        <div className="relative inline-block">
                          <StyledHamburger>
                            <label className="hamburger">
                              <input
                                type="checkbox"
                                checked={activeMenuId === item.id}
                                onChange={() =>
                                  setActiveMenuId(
                                    activeMenuId === item.id ? null : item.id,
                                  )
                                }
                              />
                              <svg viewBox="0 0 32 32">
                                <path
                                  className="line line-top-bottom"
                                  d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                                />
                                <path className="line" d="M7 16 27 16" />
                              </svg>
                            </label>
                          </StyledHamburger>
                          <AnimatePresence>
                            {activeMenuId === item.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                className="absolute right-0 top-full mt-3 w-44 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-[150] overflow-hidden"
                              >
                                <button
                                  onClick={() => {
                                    setSelectedAirdropId(item.id);
                                    setLandingModalOpen(true);
                                  }}
                                  className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-emerald-500 hover:bg-emerald-500/10 transition-colors uppercase border-b border-zinc-200 dark:border-zinc-800"
                                >
                                  <Banknote size={16} /> Mark Landed
                                </button>
                                <button
                                  onClick={() => handleRuggedAction(item.id)}
                                  className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-red-500 hover:bg-red-500/10 transition-colors uppercase"
                                >
                                  <Skull size={16} /> Mark Rugged
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
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

      {/* Mobile Card View mapping correctly */}
      <div className="md:hidden space-y-4">
        {currentData.map((item) => {
          const isFinished =
            item.status === "LANDED" || item.status === "RUGGED";
          return (
            <GlassCard
              key={item.id}
              className="p-5 flex flex-col gap-4 border border-zinc-800 shadow-md"
            >
              <div className="flex items-start justify-between gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <UiverseCheckbox
                    checked={selectedIds.includes(item.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((i) => i !== item.id)
                          : [...prev, item.id],
                      )
                    }
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="font-black text-white text-base truncate uppercase tracking-tighter leading-tight break-all">
                      {item.airdropName}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase truncate">
                      {item.tokenTicker || "NO TICKER"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-[9px] font-black tracking-wider uppercase rounded border ${item.status === "LANDED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" : "bg-zinc-800 border-zinc-700"}`}
                >
                  {item.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2 mt-1">
                <NeonToggle
                  isOn={
                    item.status !== "PLANNED" && item.status !== "IN_PROGRESS"
                  }
                  onToggle={() => {
                    if (!isFinished)
                      startTransition(() =>
                        toggleDoneStatus(item.id, item.status),
                      );
                  }}
                />
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      setSelectedAirdropData(item);
                      setViewModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-[10px] font-black text-emerald-500 border border-emerald-500/20 rounded-lg"
                  >
                    DETAIL
                  </button>
                  {!isFinished && (
                    <div className="relative">
                      <StyledHamburger>
                        <label className="hamburger">
                          <input
                            type="checkbox"
                            checked={activeMenuId === item.id}
                            onChange={() =>
                              setActiveMenuId(
                                activeMenuId === item.id ? null : item.id,
                              )
                            }
                          />
                          <svg viewBox="0 0 32 32">
                            <path
                              className="line line-top-bottom"
                              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                            />
                            <path className="line" d="M7 16 27 16" />
                          </svg>
                        </label>
                      </StyledHamburger>
                      <AnimatePresence>
                        {activeMenuId === item.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -5 }}
                            className="absolute right-0 bottom-full mb-3 w-40 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-[150] overflow-hidden"
                          >
                            <button
                              onClick={() => {
                                setSelectedAirdropId(item.id);
                                setLandingModalOpen(true);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black text-emerald-500 text-left uppercase"
                            >
                              Mark Landed
                            </button>
                            <button
                              onClick={() => handleRuggedAction(item.id)}
                              className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-black text-red-500 text-left uppercase border-t border-zinc-200 dark:border-zinc-800"
                            >
                              Mark Rugged
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* FIXED: RESTORED PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-10 pb-6 border-t border-white/5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="group flex items-center gap-2 px-6 py-2.5 text-[10px] font-black text-zinc-500 hover:text-emerald-500 disabled:opacity-20 transition-all uppercase tracking-[0.2em] bg-zinc-900 border border-white/5 rounded-xl shadow-xl active:scale-95"
          >
            ← Previous
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              {currentPage}
            </span>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              of
            </span>
            <span className="text-[11px] font-black text-zinc-400">
              {totalPages}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="group flex items-center gap-2 px-6 py-2.5 text-[10px] font-black text-zinc-500 hover:text-emerald-500 disabled:opacity-20 transition-all uppercase tracking-[0.2em] bg-zinc-900 border border-white/5 rounded-xl shadow-xl active:scale-95"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modals & Drama remain exactly same logic */}
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

      <AnimatePresence>
        {showRuggedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="mb-8 text-red-500"
            >
              <Skull size={160} strokeWidth={1} />
            </motion.div>
            <h1 className="text-7xl font-black text-red-500 uppercase tracking-tighter italic shadow-2xl">
              YOU GOT RUGGED!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLandedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-xl text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-8 text-emerald-500"
            >
              <Banknote size={160} strokeWidth={1} />
            </motion.div>
            <h1 className="text-7xl font-black text-emerald-500 uppercase tracking-tighter italic shadow-2xl">
              BAG SECURED!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {landingModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
              className="relative w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-zinc-900 p-8 shadow-2xl text-center"
            >
              <h3 className="text-2xl font-black text-white mb-6 uppercase">
                Bag Amount ($)
              </h3>
              <form
                onSubmit={handleLandedSubmit}
                className="space-y-6 text-left"
              >
                <UiverseInput
                  id="dollar"
                  label="Landed Value"
                  type="number"
                  step="0.01"
                  required
                  value={dollarInput}
                  onChange={(e) => setDollarInput(e.target.value)}
                  startIcon={<Grip />}
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-500 text-zinc-950 font-black rounded-xl uppercase tracking-widest shadow-lg"
                >
                  Lock Profit 💸
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
