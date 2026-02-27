"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AirdropForm } from "@/components/ui/AirdropForm";
import NeonDatePicker from "@/components/ui/NeonDatePicker";
import { updateAirdrop } from "./actions";
import { Edit3, X } from "lucide-react";

export const EditModal = ({ isOpen, onClose, data, userId }: any) => {
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
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateAirdrop(formData, userId, data.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 py-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.94, opacity: 0, y: 18 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0, y: 18 }}
                  transition={{ type: "spring", damping: 22, stiffness: 320 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-blue-500/25 bg-zinc-950/90 p-5 md:p-8 shadow-[0_0_70px_rgba(59,130,246,0.16)] backdrop-blur-xl [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <header className="flex items-start justify-between gap-4 mb-6 border-b border-white/5 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 grid place-items-center shadow-inner">
                        <Edit3 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-black text-zinc-50 uppercase tracking-tight">
                          Edit Target
                        </h2>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                          Update intel • Fix task date • Keep it clean
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="h-10 w-10 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-red-500/30 grid place-items-center transition-all active:scale-95"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 text-zinc-200" />
                    </button>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ✅ date manual + calendar. defaultValue ambil dari data.taskDate */}
                    <NeonDatePicker
                      name="taskDate"
                      label="Task Date"
                      defaultValue={data?.taskDate}
                      required
                    />

                    <AirdropForm defaultValues={data} />

                    <footer className="flex justify-end gap-3 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-3 text-[11px] font-black text-zinc-400 bg-zinc-900/60 border border-white/10 rounded-2xl uppercase tracking-widest hover:border-white/20 transition-all"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 text-[11px] font-black text-zinc-950 bg-blue-500 rounded-2xl hover:bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.35)] uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95"
                      >
                        {isSubmitting ? "Updating..." : "Update Target"}
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
};
