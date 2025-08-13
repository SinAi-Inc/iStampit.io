import { test, expect } from '@playwright/test';

function buildEmbedSrc(opts: { origin: string; e2e?: boolean }) {
  const base = '/verify?embed=1';
  const params = [`origin=${encodeURIComponent(opts.origin)}`, opts.e2e ? 'e2e=1' : null]
    .filter(Boolean)
    .join('&');
  return `${base}&${params}`;
}

test('simulated verification result posts to allowed origin', async ({ page, baseURL }) => {
  const allowedOrigin = baseURL!.replace(/\/$/, '');
  await page.goto(baseURL!);
  await page.setContent(`<!DOCTYPE html><html><body>
    <iframe id="w" src="${buildEmbedSrc({ origin: allowedOrigin, e2e: true })}" style="width:100%;height:600px;border:1px solid #ccc"></iframe>
    <script>
      window.events=[];
      window.addEventListener('message',e=>{ if(e.origin!== '${allowedOrigin}') return; window.events.push(e.data); });
    </script>
  </body></html>`);

  const frame = await (await page.waitForSelector('#w')).contentFrame();
  await expect(frame!.locator('text=File or SHA-256')).toBeVisible();

  await page.waitForFunction(() => (window as any).events.some((e: any) => e.type==='istampit:ready'));

  await frame!.evaluate(() => (window as any).__istampitSimulateResult && (window as any).__istampitSimulateResult());

  await page.waitForFunction(() => (window as any).events.some((e: any) => e.type==='istampit:verify:result'));
  const events = await page.evaluate(() => (window as any).events);
  const resultEvt = events.find((e: any)=> e.type==='istampit:verify:result');
  expect(resultEvt).toBeTruthy();
  expect(resultEvt.status).toBe('confirmed');
});
