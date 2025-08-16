import { test, expect } from '@playwright/test';

// This test simulates opening the popup by intercepting window.open and then dispatching
// the postMessage event that the finish page would send. Since real OAuth can't run in CI,
// we focus on verifying the page reacts to 'auth:complete'.

test.describe('Popup auth flow (synthetic)', () => {
  test('receives auth:complete message and updates badge (synthetic session)', async ({ page, baseURL }) => {
    // Ensure server reachable (retry a few times)
    for (let i=0;i<5;i++) {
      const ok = await fetch(baseURL || 'http://localhost:3000').then(r=>r.ok).catch(()=>false);
      if (ok) break; if (i===4) test.skip(true, 'Dev server not reachable'); await new Promise(r=>setTimeout(r,1000));
    }
    await page.goto('/');

    // Skip if static demo build (badge hidden)
    const isStatic = await page.evaluate(() => window?.process?.env?.NEXT_PUBLIC_PAGES_STATIC === '1');
    if (isStatic) test.skip();

    // Intercept fetch to /api/auth/session after completion to return a fake user
    await page.route('**/api/auth/session', async (route, request) => {
      if (request.method() === 'GET' && request.url().includes('/api/auth/session')) {
        const headers = { 'Content-Type': 'application/json' };
        // If we have not yet simulated completion respond unauthenticated first
        const completed = await page.evaluate(() => (window as any).__popupTestCompleted || false);
        if (!completed) {
          route.fulfill({ status: 200, headers, body: JSON.stringify({ user: null }) });
        } else {
          route.fulfill({ status: 200, headers, body: JSON.stringify({ user: { email: 'tester@example.com' } }) });
        }
        return;
      }
      route.fallback();
    });

    // Click sign in button (will attempt to open popup)
    const btn = page.getByRole('button', { name: /sign in/i });
    await expect(btn).toBeVisible();
    await btn.click();

    // Simulate popup completing by sending message
    await page.evaluate(() => {
      (window as any).__popupTestCompleted = true;
      window.postMessage('auth:complete', '*');
    });

    // Badge should eventually show truncated email or Signed in text
    await expect(page.getByText(/tester@example.com|Signed in/i)).toBeVisible({ timeout: 5000 });
  });
});
