// app/privacy/page.tsx
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import BackButton from "@/components/ui/BackButton";

export default function PrivacyPage() {
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
            Privacy Policy
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-white">
            Private by default.
            <span className="block text-emerald-200">Minimal data.</span>
          </h1>

          <p className="mt-6 text-[14px] font-bold leading-relaxed text-zinc-300">
            Airdrop Logbook is designed as a private ops dashboard. We collect
            only what is needed to run the product and keep your data isolated
            per user.
          </p>

          <div className="mt-10 space-y-8">
            <section>
              <h2 className="text-lg font-black text-white">What we collect</h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                We store your Google account email and basic profile details
                used for authentication. Your entries are stored under your user
                ID and are not shared with other users.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">
                What you store in the dashboard
              </h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                You may store target names, chains, task dates, wallet strings,
                handles, contact fields, notes, and outcome statuses. This data
                is visible only to your account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">
                Cookies and sessions
              </h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                We use cookies or session storage required for login and to keep
                you signed in. We do not sell personal data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">
                Data retention and deletion
              </h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                Your data stays in your account until you delete it. If you want
                full account deletion, remove entries first and then contact the
                maintainer to request deletion of the user record.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">Security</h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                Access is protected by Google sign-in. We strongly recommend
                enabling 2FA on your Google account.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-white">Contact</h2>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-zinc-300">
                Questions about privacy can be directed to the maintainer via
                the Social Hub linked in the footer.
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
