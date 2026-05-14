import Link from 'next/link';

const IS_PAGES_STATIC = process.env.NEXT_PUBLIC_PAGES_STATIC === '1';

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fdf2f8,transparent_35%),radial-gradient(circle_at_bottom,#e0f2fe,transparent_30%),linear-gradient(180deg,#fff7ed_0%,#ffffff_40%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top,#3f1d2e,transparent_30%),radial-gradient(circle_at_bottom,#0f2740,transparent_30%),linear-gradient(180deg,#111827_0%,#0f172a_100%)]">
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
              <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200">
                Project retired
              </div>
              <div className="mt-8 max-w-3xl space-y-6">
                <h1 id="hero-heading" className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                  iStampit is signing off.
                </h1>
                <p className="text-lg leading-8 text-slate-700 dark:text-slate-200 sm:text-xl">
                  Thank you to every researcher, creator, developer, and team that trusted iStampit.
                  As of May 2026, the project is being sunset and its public services are being retired.
                </p>
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  The istampit.io landing page remains online as the official goodbye notice while deployment workflows,
                  companion packages, and related infrastructure are decommissioned in an orderly way.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/ledger" prefetch={!IS_PAGES_STATIC} className="btn-primary btn-lg">
                  View public ledger archive
                </Link>
                <Link href="https://github.com/SinAi-Inc/iStampit.io" className="btn-outline btn-lg">
                  Review project archive
                </Link>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Site</div>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    The istampit.io homepage now serves as the public retirement landing page and final project notice.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Code</div>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    Companion repositories and packages are being marked as retired so no one mistakes them for active products.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Infra</div>
                  <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    DNS, hosting, API, and any non-core cloud resources are being inventoried and retired in sequence while the landing page stays online.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/80 bg-slate-900 px-6 py-10 text-white dark:border-slate-800 lg:border-l lg:border-t-0 lg:px-10 lg:py-16">
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Sunset message</p>
                  <blockquote className="mt-4 border-l-2 border-cyan-400 pl-4 text-lg leading-8 text-slate-100">
                    “Goodbye from iStampit. Thank you for using the project and for helping prove what mattered, when it mattered.”
                  </blockquote>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold text-white">What happens next</h2>
                  <ul className="mt-4 space-y-4 text-sm leading-6 text-slate-200">
                    <li>Keep the istampit.io retirement landing page live as the default public experience during the goodbye window.</li>
                    <li>Retire remaining operational surfaces, including hosted API endpoints and automation workflows.</li>
                    <li>Preserve the public ledger and source repositories as an archive of the project.</li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6">
                  <h2 className="text-xl font-semibold text-amber-100">Status</h2>
                  <p className="mt-3 text-sm leading-6 text-amber-50/90">
                    Active timestamping, verification, and promotional messaging are being withdrawn. This page is intentionally minimal so the shutdown can happen without ambiguity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
