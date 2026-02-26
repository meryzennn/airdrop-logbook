"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AirdropForm } from "@/components/ui/AirdropForm";
import { updateAirdrop } from "./actions";
import { Edit3 } from "lucide-react";

export const EditModal = ({ isOpen, onClose, data, userId }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    await updateAirdrop(formData, userId, data.id);
    setIsSubmitting(false);
    onClose();
  };

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
                  className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-blue-500/30 bg-zinc-50 dark:bg-zinc-900/95 p-10 shadow-[0_0_60px_rgba(59,130,246,0.2)] backdrop-blur-xl"
                >
                  <header className="flex items-center gap-3 mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                    <Edit3 className="w-8 h-8 text-blue-500" />
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                      Edit <span className="text-blue-500">Target</span> ✏️
                    </h2>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-12">
                    <AirdropForm defaultValues={data} />

                    <footer className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors rounded-xl bg-zinc-100 dark:bg-zinc-800"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-7 py-2.5 text-sm font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "UPDATING..." : "UPDATE TARGET"}
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
