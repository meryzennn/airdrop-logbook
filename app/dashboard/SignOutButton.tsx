import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      {/* Uiverse.io Inspired: Expanding Circular Logout Button 
        Starts as a circle, expands into a pill shape on hover.
      */}
      <button
        type="submit"
        title="Sign Out"
        className="group flex items-center justify-start w-10 h-10 sm:w-12 sm:h-12 bg-zinc-200 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 shadow-sm hover:w-28 sm:hover:w-32 hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] active:scale-95"
      >
        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3 sm:group-hover:px-4">
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors duration-300" />
        </div>
        <div className="absolute right-3 sm:right-4 transform translate-x-full opacity-0 text-white text-xs sm:text-sm font-bold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          Sign Out
        </div>
      </button>
    </form>
  );
}
