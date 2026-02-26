"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export const SignOutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
};
