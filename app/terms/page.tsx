// app/terms/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import BackButton from "@/components/ui/BackButton";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#060813] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-56 left-1/2 h-[620px] w-[1200px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[160px]" />
        <div className="absolute top-0 left-[12%] h-[520px] w-[780px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
        <div className="absolute top-24 right-[10%] h-[520px] w-[900px] rounded-full bg-sky-500/10 blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-16">
        <div className="mb-6">
          <BackButton fallbackHref="/" label="Back" />
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-zinc-400">
            Terms
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-white">
            Use it for ops.
            <span className="block text-emerald-200">Not for promises.</span>
          </h1>

          <p className="mt-6 text-[14px] font-bold leading-relaxed text-zinc-300">
            Airdrop Logbook is a tracking tool. It does not guarantee airdrops,
            rewards, or outcomes. You are responsible for what you track and how
            you use the information.
          </p>

          <div className="mt-10 space-y-8">
            <section>
              <h2 className="text-lg font-black text-white">Account access</h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                Login is provided via Google sign-in. You are responsible for
                maintaining the security of your Google account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">Acceptable use</h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                Do not use the service to store illegal content or to violate
                the rights of others. Do not attempt to break, scrape, or abuse
                the system.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">No warranties</h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                The service is provided as is. We do not provide guarantees
                about uptime, accuracy, or availability.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">
                Limitation of liability
              </h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                We are not liable for losses, missed opportunities, or outcomes
                related to airdrops or any Web3 activity. Use at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">Changes</h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                We may update these terms as the product evolves. Continued use
                means you accept the updated terms.
              </p>
            </section>
          </div>

          <div className="mt-10 text-[11px] font-bold text-zinc-500">
            Last updated: {new Date().toISOString().slice(0, 10)}
          </div>
        </div>
      </div>
    </main>
  );
}
