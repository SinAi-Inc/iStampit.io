import { test, expect } from '@playwright/test';

// Basic smoke test: ensure homepage renders a primary heading.
// Title text can drift; rely on visible H1 containing a stable keyword.
test('homepage loads', async ({ page }) => {
  await page.goto('/');
  const h1 = page.locator('h1');
  await expect(h1.first()).toBeVisible({ timeout: 10000 });
  await expect(h1.first()).toHaveText(/Verify|Stamp|OpenTimestamps/i);
});
