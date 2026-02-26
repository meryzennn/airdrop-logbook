"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedGradientButton } from "@/components/ui/AnimatedGradientButton";
import { AirdropForm } from "@/components/ui/AirdropForm";
import { createAirdrop } from "./actions";
import { Plus, Target } from "lucide-react";

export default function AddAirdropModal({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    await createAirdrop(formData, userId);

    setIsSubmitting(false);
    setIsOpen(false);
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
              // Added py-8 to give top/bottom margin on scroll
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 py-8 sm:p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  // Added max-h-[90vh] and overflow-y-auto to make it scrollable on mobile
                  // Changed p-10 to p-5 md:p-10 for responsive padding
                  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/95 p-5 md:p-10 shadow-[0_0_60px_rgba(16,185,129,0.3)] backdrop-blur-xl custom-scrollbar"
                >
                  <header className="flex items-center gap-3 mb-6 md:mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4 md:pb-6">
                    <Target className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 shrink-0" />
                    <h2 className="text-xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                      New <span className="text-emerald-500">Airdrop</span>{" "}
                      Entry 🎯
                    </h2>
                  </header>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-8 md:space-y-12"
                  >
                    <AirdropForm />

                    <footer className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors rounded-xl bg-zinc-200 dark:bg-zinc-800"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-7 py-3 sm:py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "SAVING TARGET..." : "SAVE ENTRY"}
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
