import { test, expect } from '@playwright/test';

test.describe('Astrofolio E2E Tests', () => {
  test('should load the home page in French', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/7Bhil/);
    await expect(page.getByRole('heading', { level: 1, name: /Bhilal CHITOU/i })).toBeVisible();
  });

  test('should toggle dark/light theme', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    // Click theme toggle (using first() to avoid ambiguity if two buttons exist)
    await page.getByLabel(/theme|thème/i).first().click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    
    // Click again to return to dark
    await page.getByLabel(/theme|thème/i).first().click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('should switch language to English', async ({ page }) => {
    await page.goto('/');
    
    // Click language toggle
    await page.getByLabel(/langue|language/i).first().click();
    
    // Should be on /en/
    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should expose WhatsApp contact link', async ({ page }) => {
    await page.goto('/#contact');

    const whatsappLink = page.getByRole('link', { name: /whatsapp/i });
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toHaveAttribute('href', /wa\.me\/2290144242964/);
  });
});
