import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// After successful OAuth callback, NextAuth will redirect to this page (optional custom callback URL)
// which then notifies opener and closes (if popup) or redirects user onward.
export default function FinishPage() {
  // Notify opener (if popup) that auth flow completed.
  const script = `
    (function(){
      try { window.opener && window.opener.postMessage('auth:complete', window.location.origin); } catch(_) {}
      setTimeout(function(){ window.close(); }, 150);
    })();
  `;
  return (
    <html>
      <body>
        <p style={{fontFamily:'system-ui',padding:'1rem'}}>Authentication complete. You may close this window.</p>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </html>
  );
}
