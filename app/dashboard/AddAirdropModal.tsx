"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedGradientButton } from "@/components/ui/AnimatedGradientButton";
import { AirdropForm } from "@/components/ui/AirdropForm";
import NeonDatePicker from "@/components/ui/NeonDatePicker";
import { createAirdrop } from "./actions";
import { Plus, Target, X } from "lucide-react";

export default function AddAirdropModal({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createAirdrop(formData, userId);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatedGradientButton onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" /> Add New Target
      </AnimatedGradientButton>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 py-8 sm:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.94, opacity: 0, y: 18 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0, y: 18 }}
                  transition={{ type: "spring", damping: 22, stiffness: 320 }}
                  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-emerald-500/20 bg-zinc-950/90 p-5 md:p-8 shadow-[0_0_70px_rgba(16,185,129,0.18)] backdrop-blur-xl [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* header */}
                  <header className="flex items-start justify-between gap-4 mb-6 border-b border-white/5 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center shadow-inner">
                        <Target className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-zinc-50 uppercase tracking-tight">
                          New Target
                        </h2>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          Add Task • Set task date • Track outcome
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="h-10 w-10 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-red-500/30 grid place-items-center transition-all active:scale-95"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 text-zinc-200" />
                    </button>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ✅ manual date DD/MM/YYYY + calendar */}
                    <NeonDatePicker
                      name="taskDate"
                      label="Task Date"
                      required
                      // kalau mau default hari ini, uncomment:
                      // defaultValue={new Date()}
                    />

                    {/* existing form fields */}
                    <AirdropForm />

                    <footer className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full sm:w-auto px-5 py-3 text-[11px] font-black text-zinc-400 bg-zinc-900/60 border border-white/10 rounded-2xl uppercase tracking-widest hover:border-white/20 transition-all"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-3 text-[11px] font-black text-zinc-950 bg-emerald-500 rounded-2xl hover:bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.35)] uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95"
                      >
                        {isSubmitting ? "Saving..." : "Save Entry"}
                      </button>
                    </footer>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
