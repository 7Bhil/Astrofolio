import { test, expect } from '@playwright/test';

test.describe('Astrofolio E2E Tests', () => {
  test('should load the home page in French', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bhilal CHITOU/);
    await expect(page.getByRole('heading', { level: 1, name: /Bhilal CHITOU/i })).toBeVisible();
  });

  test('should toggle dark/light theme', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    // Click theme toggle (using first() to avoid ambiguity if two buttons exist)
    await page.getByLabel('Toggle theme').first().click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    
    // Click again to return to dark
    await page.getByLabel('Toggle theme').first().click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('should switch language to English', async ({ page }) => {
    await page.goto('/');
    
    // Click language toggle
    await page.getByLabel('Toggle language').first().click();
    
    // Should be on /en/
    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should show validation errors on contact form', async ({ page }) => {
    await page.goto('/#contact');
    
    // Wait for the button to be ready
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    
    // Scroll and click
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    
    // Check for error messages (wait for them to appear)
    await expect(page.locator('#name-error')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#email-error')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#message-error')).toBeVisible({ timeout: 10000 });
  });
});
