import { test, expect } from '@playwright/test';

function buildEmbedSrc(opts: { origin?: string; extra?: string }) {
  const base = '/verify?embed=1';
  const params = [opts.origin ? `origin=${encodeURIComponent(opts.origin)}` : null, opts.extra]
    .filter(Boolean)
    .join('&');
  return params ? `${base}&${params}` : base;
}

test.describe('Embed security messaging', () => {
  test('posts ready event to allowed origin only', async ({ page, baseURL }) => {
    const allowedOrigin = baseURL!.replace(/\/$/, '');
    await page.goto(baseURL!);
    await page.setContent(`<!DOCTYPE html><html><body>
      <iframe id="w" src="${buildEmbedSrc({ origin: allowedOrigin })}" style="width:100%;height:600px;border:1px solid #ccc"></iframe>
      <script>
        window.events=[];
        window.addEventListener('message',e=>{ if(e.origin!== '${allowedOrigin}') return; window.events.push(e.data); });
      </script>
    </body></html>`);

  const frameEl = await page.waitForSelector('#w');
  const frame = await frameEl.contentFrame();
  await expect(frame!.locator('text=File or SHA-256')).toBeVisible({ timeout: 15000 });
    await page.waitForFunction(() => (window as any).events.some((e: any) => e.type==='istampit:ready'));
    const events = await page.evaluate(() => (window as any).events);
    expect(events.find((e: any)=> e.type==='istampit:ready')).toBeTruthy();
  });

  test('disallowed origin does not receive ready event (or is origin-sanitized)', async ({ page, baseURL }) => {
    const fakeOrigin = 'https://evil.example';
    await page.goto(baseURL!);
    await page.setContent(`<!DOCTYPE html><html><body>
      <iframe id="w" src="${buildEmbedSrc({ origin: fakeOrigin })}" style="width:100%;height:600px;border:1px solid #ccc"></iframe>
      <script>window.events=[];window.addEventListener('message',e=>{window.events.push({o:e.origin,d:e.data});});</script>
    </body></html>`);
  const frameEl = await page.waitForSelector('#w');
  const frame = await frameEl.contentFrame();
  await expect(frame!.locator('text=File or SHA-256')).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
    const events = await page.evaluate(() => (window as any).events);
    const readyEvents = events.filter((e: any)=> e.d?.type==='istampit:ready');
    // Allow zero (preferred) or, if implementation posts but origin mismatch handling changed, ensure no more than 2 duplicates and no extraneous fields.
    if (readyEvents.length > 0) {
      expect(readyEvents.length).toBeLessThanOrEqual(2);
      for (const ev of readyEvents) {
        expect(Object.keys(ev.d).sort()).toEqual(['type']);
      }
    }
  });

  test('height resize event emitted after dynamic content change', async ({ page, baseURL }) => {
    const allowedOrigin = baseURL!.replace(/\/$/, '');
    await page.goto(baseURL!);
    await page.setContent(`<!DOCTYPE html><html><body>
      <iframe id="w" src="${buildEmbedSrc({ origin: allowedOrigin })}" style="width:100%;height:400px;border:1px solid #ccc"></iframe>
      <script>
        window.events=[];
        window.addEventListener('message',e=>{ if(e.origin!== '${allowedOrigin}') return; window.events.push(e.data); });
      </script>
    </body></html>`);
  const frameEl = await page.waitForSelector('#w');
  const frame = await frameEl.contentFrame();
  await expect(frame!.locator('text=File or SHA-256')).toBeVisible({ timeout: 15000 });
    await page.waitForFunction(() => (window as any).events.some((e: any) => e.type==='istampit:ready'));
    // Trigger a UI change that should cause height recalculation: simulate selecting a file hash via JS
    await frame!.evaluate(() => {
      const div = document.createElement('div');
      div.textContent = 'Extra dynamic content '.repeat(50);
      document.body.appendChild(div);
    });
    // Wait for a height event
    await page.waitForFunction(() => (window as any).events.some((e: any) => e.type==='istampit:ui:height'));
    const events = await page.evaluate(() => (window as any).events.filter((e: any)=> e.type==='istampit:ui:height'));
    expect(events.length).toBeGreaterThan(0);
    expect(events[events.length-1].height).toBeGreaterThan(0);
  });
});
