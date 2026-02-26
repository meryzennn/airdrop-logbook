import React from "react";

interface UiverseCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

// Uiverse.io Inspired: Glowing Checkbox with Pop Animation
export const UiverseCheckbox = ({
  checked,
  onChange,
}: UiverseCheckboxProps) => {
  return (
    <div className="inline-flex items-center">
      <label className="relative flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-5 h-5 bg-zinc-200/50 dark:bg-zinc-800/50 border-2 border-zinc-400 dark:border-zinc-600 rounded-md peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-hover:border-emerald-400 dark:peer-hover:border-emerald-400 transition-all duration-300 shadow-sm peer-checked:shadow-[0_0_12px_rgba(16,185,129,0.6)] flex justify-center items-center">
          {/* SVG Checkmark yang muncul dengan animasi scale */}
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className={`w-3.5 h-3.5 text-white font-extrabold transition-transform duration-300 ${checked ? "scale-100" : "scale-0"}`}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </label>
    </div>
  );
};
