"use client";
import { motion } from "framer-motion";
import React from "react";

// Uiverse.io inspired: Animated Spinning Border Gradient
export const AnimatedGradientButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      // The relative container hides the overflowing spinning background
      className={`relative inline-flex h-12 overflow-hidden rounded-xl p-[2px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* The spinning conic gradient background */}
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#052e16_50%,#10b981_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#34d399_0%,#022c22_50%,#34d399_100%)]" />

      {/* The inner button content that covers the middle of the gradient */}
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-950 px-6 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 backdrop-blur-3xl transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/90 gap-2">
        {children}
      </span>
    </motion.button>
  );
};
