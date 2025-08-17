import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import * as child from 'child_process';
import { POST } from '../app/api/stamp/route';

// Minimal mock request object
class MockRequest {
  constructor(private body: any) {}
  async json() { return this.body; }
  headers = new Map<string,string>();
}

describe('POST /api/stamp (integration, mocked CLI)', () => {
  const realSpawn = child.spawn;
  const tmpWrites: string[] = [];

  beforeAll(() => {
    vi.spyOn(child, 'spawn').mockImplementation((cmd: any, args: readonly string[] = []) => {
      const outFileIdx = args.indexOf('--out');
      const outFile = outFileIdx !== -1 ? args[outFileIdx+1] : null;
      const hash = args[args.indexOf('--hash')+1];
      if (outFile) tmpWrites.push(outFile);
      if (outFile) {
        require('fs').writeFileSync(outFile, Buffer.from('fake-ots-' + hash.slice(0,8)));
      }
  const stdoutChunks: Buffer[] = [Buffer.from(JSON.stringify({ ok: true, hash }))];
      const fake: any = {
        stdout: { on: (ev: string, fn: Function) => { if (ev === 'data') stdoutChunks.forEach(c=>fn(c)); return fake.stdout; } },
        stderr: { on: () => {} },
        on: (ev: string, fn: Function) => { if (ev === 'close') setTimeout(()=>fn(0),0); return fake; }
      };
      return fake;
    });
  });

  afterAll(() => {
    (child.spawn as any).mockRestore?.();
    tmpWrites.forEach(f => { try { require('fs').unlinkSync(f); } catch {} });
  });

  it('returns expected JSON shape and base64 receipt', async () => {
    const hash = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const req: any = new MockRequest({ hash });
    const res = await POST(req);
    const text = await res.text();
    const data = JSON.parse(text);
    expect(data.hash).toBe(hash);
    expect(data.filename).toBe(hash + '.ots');
    expect(typeof data.size).toBe('number');
    expect(data.size).toBeGreaterThan(0);
    expect(typeof data.receiptB64).toBe('string');
    const decoded = Buffer.from(data.receiptB64, 'base64').toString('utf8');
    expect(decoded.startsWith('fake-ots-')).toBe(true);
  });
});
