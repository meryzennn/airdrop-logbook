// components/ui/GlassCard.tsx
import React from "react";

// Uiverse.io inspired Glassmorphism Card
export const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`backdrop-blur-xl bg-white/5 dark:bg-zinc-900/40 border border-white/10 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
};
