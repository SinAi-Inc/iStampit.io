export default function Home() {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">Welcome.</p>
      <p>
        Head over to <code>/verify</code> to try the browser-based OpenTimestamps verification flow, or to <code>/ledger</code> (stub) for a
        future public ledger view.
      </p>
    </div>
  );
}
