// Embed security utilities for iStampit
// Provides derivation & validation of allowed postMessage origin for embeds.

const HOST_WHITELIST = [
  'istampit.io',
  'www.istampit.io',
  'localhost',
  '127.0.0.1'
];

export interface DeriveOriginOptions {
  paramOrigin?: string | null;
  referrer?: string;
}

function isValidHttpsOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') return false;
    return HOST_WHITELIST.some(h => url.hostname === h || url.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

export function deriveAllowedOrigin({ paramOrigin, referrer }: DeriveOriginOptions): string | null {
  if (paramOrigin && isValidHttpsOrigin(paramOrigin)) {
    return new URL(paramOrigin).origin;
  }
  if (referrer) {
    try {
      const ref = new URL(referrer);
      if (isValidHttpsOrigin(ref.origin)) return ref.origin;
    } catch { /* ignore */ }
  }
  return null; // fail closed (no wildcard)
}

export const EMBED_SECURITY_META = {
  whitelist: HOST_WHITELIST,
  deriveAllowedOrigin,
};

export default deriveAllowedOrigin;
