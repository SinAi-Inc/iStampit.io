export interface LedgerEntry {
  artifactId: string;
  title: string;
  sha256: string;
  otsUrl: string;
  status: 'pending' | 'complete';
  bitcoin?: { block?: number; timestamp?: string | null };
  tags: string[];
  createdAt: string;
}

export default function LedgerTable({ entries }: { entries: LedgerEntry[] }) {
  return (
    <table className="w-full text-sm border rounded overflow-hidden">
      <thead className="bg-slate-100 text-left">
        <tr>
          <th className="p-2">Title</th>
          <th className="p-2">SHA-256</th>
          <th className="p-2">Status</th>
          <th className="p-2">Block</th>
          <th className="p-2">Tags</th>
          <th className="p-2">Created</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.artifactId} className="border-t">
            <td className="p-2 whitespace-nowrap">{e.title}</td>
            <td className="p-2 font-mono text-xs break-all">{e.sha256.slice(0, 16)}…</td>
            <td className="p-2">{e.status}</td>
            <td className="p-2">{e.bitcoin?.block ?? ''}</td>
            <td className="p-2">{e.tags.join(', ')}</td>
            <td className="p-2 text-xs">{new Date(e.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
