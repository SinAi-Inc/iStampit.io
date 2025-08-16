import { test, expect } from '@playwright/test';

// Basic smoke test to ensure homepage responds and sets a title.
// Adjust the expected title regex if the real title differs.

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  // If title not yet defined, this will fail prompting update.
  await expect(page).toHaveTitle(/iStampit/i);
});
