import React from "react";

// Kita tambahin properti startIcon di sini biar TS ga bawel
interface UiverseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  startIcon?: React.ReactNode;
}

// Uiverse.io Inspired: Floating Label + Glowing Underline + Icon Support
export const UiverseInput = ({
  label,
  id,
  required,
  startIcon,
  className = "",
  ...props
}: UiverseInputProps) => {
  return (
    <div className="relative w-full mt-4">
      {/* Kalau ada icon yang dikirim, render di sebelah kiri */}
      {startIcon && (
        <div className="absolute left-0 top-2.5 text-zinc-400 dark:text-zinc-500 [&>svg]:w-5 [&>svg]:h-5 pointer-events-none transition-colors peer-focus:text-emerald-500">
          {startIcon}
        </div>
      )}

      <input
        id={id}
        name={id}
        required={required}
        placeholder=" " // Spacer wajib buat CSS peer-placeholder-shown
        className={`peer block w-full appearance-none border-0 border-b-2 border-zinc-300 dark:border-zinc-700 bg-transparent py-2.5 text-sm text-zinc-900 dark:text-zinc-50 focus:border-emerald-500 focus:outline-none focus:ring-0 transition-colors ${
          startIcon ? "pl-8" : "px-0" // Kasih jarak teks kalau ada icon
        } ${className}`}
        {...props}
      />

      {/* Animasi Floating Label yang menyesuaikan posisi icon */}
      <label
        htmlFor={id}
        className={`absolute top-2.5 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-zinc-500 dark:text-zinc-400 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-emerald-500 font-semibold ${
          startIcon ? "left-8 peer-focus:left-0" : "left-0"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};
