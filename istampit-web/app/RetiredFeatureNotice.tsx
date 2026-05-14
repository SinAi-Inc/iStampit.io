import Link from 'next/link';

type RetiredFeatureNoticeProps = {
  title: string;
  description: string;
};

export default function RetiredFeatureNotice({ title, description }: RetiredFeatureNoticeProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fdf2f8,transparent_35%),radial-gradient(circle_at_bottom,#e0f2fe,transparent_30%),linear-gradient(180deg,#fff7ed_0%,#ffffff_40%,#f8fafc_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10 lg:p-12">
        <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
          Retired surface
        </div>

        <div className="mt-8 space-y-5">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-700">{description}</p>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            iStampit is in retirement mode. The public site remains online as a goodbye notice and archive while the remaining API and infrastructure surfaces are decommissioned.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Archive</div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              The public ledger remains available as historical reference while shutdown work is completed.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">API</div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Live stamping and verification flows are being withdrawn before the Fly.io API service is shut down.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Source</div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Repository history stays available for archival review even after public product operations end.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/" className="btn-primary btn-lg">
            Return to goodbye page
          </Link>
          <Link href="/ledger" className="btn-outline btn-lg">
            View ledger archive
          </Link>
          <Link href="https://github.com/SinAi-Inc/iStampit.io" className="btn-outline btn-lg">
            Review source archive
          </Link>
        </div>
      </div>
    </main>
  );
}
