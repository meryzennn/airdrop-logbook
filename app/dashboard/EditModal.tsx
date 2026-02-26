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

  useEffect(() => {
    setMounted(true);
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

                {/* FIXED: No visible scrollbar logic */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] border border-blue-500/30 bg-zinc-900 p-10 shadow-2xl backdrop-blur-xl [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <header className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                    <Edit3 size={32} className="text-blue-500 shrink-0" />
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                      Modify Target
                    </h2>
                  </header>
                  <form onSubmit={handleSubmit} className="space-y-12">
                    <AirdropForm defaultValues={data} />
                    <footer className="flex justify-end gap-3 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-zinc-500 bg-zinc-800 rounded-xl uppercase tracking-widest"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-7 py-2.5 text-sm font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-400 disabled:opacity-50 uppercase tracking-widest shadow-lg"
                      >
                        {isSubmitting ? "Locking Log..." : "Update Target"}
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
