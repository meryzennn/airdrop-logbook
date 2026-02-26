"use client";
import { motion } from "framer-motion";
import React from "react";

// NeonButton component inspired by Uiverse.io glass/neon styles
export const NeonButton = ({
  children,
  type = "button",
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <motion.button
      type={type}
      // Hover effect: slight scale up and neon green shadow glow
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 0px 15px 2px rgba(34, 197, 94, 0.5)",
      }}
      // Tap effect: slight scale down for tactile feedback
      whileTap={{ scale: 0.95 }}
      className="px-8 py-3 text-base font-bold text-green-600 dark:text-green-400 bg-transparent border-2 border-green-600 dark:border-green-400 rounded-xl transition-colors hover:bg-green-500/10"
    >
      {children}
    </motion.button>
  );
};
