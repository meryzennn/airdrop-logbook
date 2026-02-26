// components/ui/NeonToggle.tsx
"use client";
import { motion } from "framer-motion";

interface NeonToggleProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
}

// Uiverse.io inspired Neon Toggle Switch using Framer Motion
export const NeonToggle = ({ isOn, onToggle, label }: NeonToggleProps) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
      <div
        className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${
          isOn
            ? "bg-green-500 shadow-[0_0_12px_#22c55e]"
            : "bg-zinc-300 dark:bg-zinc-700"
        }`}
      >
        <motion.div
          className="bg-white w-6 h-6 rounded-full shadow-md"
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          animate={{ x: isOn ? 24 : 0 }}
        />
      </div>
      {label && (
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {label}
        </span>
      )}
    </div>
  );
};
