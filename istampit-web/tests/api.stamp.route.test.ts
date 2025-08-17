import { describe, it, expect, vi } from 'vitest';
import { POST } from '../app/api/stamp/route';

// Minimal mock for NextRequest
class MockRequest {
  constructor(private body: any){ }
  async json(){ return this.body; }
  headers = new Map<string,string>();
}

// Mock spawn by monkey patching run? Instead we rely on actual handler expecting 'istampit'
// For unit isolation we could abstract, but here we'll skip if istampit unavailable.

describe('/api/stamp POST', () => {
  it('returns base64 receipt for valid hash (pseudo test)', async () => {
    const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    // Skip if istampit CLI not on PATH
    const which = process.platform === 'win32' ? 'where' : 'which';
    const { spawnSync } = await import('child_process');
    const chk = spawnSync(which, ['istampit']);
    if (chk.status !== 0) {
      console.warn('Skipping CLI-dependent test (istampit not found)');
      return;
    }
    const req: any = new MockRequest({ hash });
    const res = await POST(req);
    const text = await res.text();
    const data = JSON.parse(text);
    expect(data.hash).toBe(hash);
    expect(data.receiptB64).toBeTruthy();
  }, 20000);
});
