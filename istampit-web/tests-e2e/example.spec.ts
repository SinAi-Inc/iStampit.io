import { test, expect } from '@playwright/test';

// Basic smoke test: ensure homepage renders a primary heading (content may change over time).
test('homepage loads', async ({ page }) => {
  await page.goto('/');
  const h1 = page.locator('h1');
  await expect(h1.first()).toBeVisible({ timeout: 10000 });
  // Just assert it has some non-trivial text (>= 5 chars)
  const text = await h1.first().innerText();
  expect(text.trim().length).toBeGreaterThanOrEqual(5);
});
