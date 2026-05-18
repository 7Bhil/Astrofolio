# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Astrofolio E2E Tests >> should toggle dark/light theme
- Location: tests/e2e.spec.ts:10:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('html')
Expected: "light"
Received: "dark"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('html')
    12 × locator resolved to <html lang="fr" data-theme="dark">…</html>
       - unexpected value "dark"

```

```yaml
- document:
  - banner
  - main
  - contentinfo
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Astrofolio E2E Tests', () => {
  4  |   test('should load the home page in French', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveTitle(/7Bhil/);
  7  |     await expect(page.getByRole('heading', { level: 1, name: /Bhilal CHITOU/i })).toBeVisible();
  8  |   });
  9  | 
  10 |   test('should toggle dark/light theme', async ({ page }) => {
  11 |     await page.goto('/');
  12 |     
  13 |     // Check initial theme
  14 |     const html = page.locator('html');
  15 |     await expect(html).toHaveAttribute('data-theme', 'dark');
  16 |     
  17 |     // Click theme toggle (using first() to avoid ambiguity if two buttons exist)
  18 |     await page.getByLabel('Toggle theme').first().click();
> 19 |     await expect(html).toHaveAttribute('data-theme', 'light');
     |                        ^ Error: expect(locator).toHaveAttribute(expected) failed
  20 |     
  21 |     // Click again to return to dark
  22 |     await page.getByLabel('Toggle theme').first().click();
  23 |     await expect(html).toHaveAttribute('data-theme', 'dark');
  24 |   });
  25 | 
  26 |   test('should switch language to English', async ({ page }) => {
  27 |     await page.goto('/');
  28 |     
  29 |     // Click language toggle
  30 |     await page.getByLabel('Toggle language').first().click();
  31 |     
  32 |     // Should be on /en/
  33 |     await expect(page).toHaveURL(/\/en\//);
  34 |     await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  35 |   });
  36 | 
  37 |   test('should show validation errors on contact form', async ({ page }) => {
  38 |     await page.goto('/#contact');
  39 |     
  40 |     // Wait for the button to be ready
  41 |     const submitBtn = page.locator('button[type="submit"]');
  42 |     await expect(submitBtn).toBeVisible();
  43 |     
  44 |     // Scroll and click
  45 |     await submitBtn.scrollIntoViewIfNeeded();
  46 |     await submitBtn.click();
  47 |     
  48 |     // Check for error messages (wait for them to appear)
  49 |     await expect(page.locator('#name-error')).toBeVisible({ timeout: 10000 });
  50 |     await expect(page.locator('#email-error')).toBeVisible({ timeout: 10000 });
  51 |     await expect(page.locator('#message-error')).toBeVisible({ timeout: 10000 });
  52 |   });
  53 | });
  54 | 
```