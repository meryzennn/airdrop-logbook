import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "./SignOutButton";
import AirdropClientTable from "./AirdropClientTable";
import AddAirdropModal from "./AddAirdropModal";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;

  const userAirdrops = await prisma.airdrop.findMany({
    where: { userId: userId },
    orderBy: { taskDate: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 font-sans overflow-hidden relative">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] max-w-2xl h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40 border border-white/40 dark:border-zinc-800 shadow-xl">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Welcome,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                {session.user?.name || "Hunter"}
              </span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              Your Web3 Airdrop Hunting Logbook
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <AddAirdropModal userId={userId} />

            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform hover:scale-110"
                referrerPolicy="no-referrer"
              />
            )}
            <SignOutButton />
          </div>
        </header>

        {/* FIX: Pass userId props dengan bener ke tabel */}
        <AirdropClientTable airdrops={userAirdrops as any} userId={userId} />
      </div>
    </main>
  );
}
