import { signIn } from "@/auth";
import { NeonButton } from "@/components/ui/NeonButton";
import { Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 overflow-hidden">
      {/* Main content wrapper */}
      <div className="max-w-3xl text-center space-y-8 z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Track Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            Airdrop
          </span>{" "}
          Empire
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          The ultimate web3 logbook. Track your wallets, manage tasks, and
          ensure your airdrops land safely without the hassle.
        </p>

        {/* Auth.js v5 Login Form (Server Action) */}
        <form
          action={async () => {
            "use server";
            // Redirect to the private dashboard upon successful login
            await signIn("google", { redirectTo: "/dashboard" });
          }}
          className="flex justify-center mt-8"
        >
          <NeonButton type="submit">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Connect with Google
            </span>
          </NeonButton>
        </form>
      </div>

      {/* Background decoration: Radial glow effect visible only in Dark Mode */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/15 via-zinc-950/0 to-zinc-950/0 hidden dark:block"></div>
    </main>
  );
}
