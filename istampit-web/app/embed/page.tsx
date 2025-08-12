export default function EmbedDemo() {
  const snippet = `<script src=\"https://example.com/istampit-embed.js\" data-hash=\"<sha256>\"></script>`;
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Embed Widget Demo (WIP)</h2>
      <p className="text-sm text-slate-600">Below is a placeholder snippet for a future verification widget.</p>
      <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-auto" dangerouslySetInnerHTML={{ __html: snippet.replace(/</g,'&lt;') }} />
      <p className="text-xs text-slate-500">The real script will render a small status badge and modal verification panel.</p>
    </div>
  );
}
