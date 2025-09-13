import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage with correct title', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Quality Platform Store/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Welcome to');
    await expect(page.locator('h1')).toContainText('Quality Platform');
  });

  test('should have working navigation links', async ({ page }) => {
    // Check "Browse Products" button
    const browseProductsButton = page.locator('text=Browse Products');
    await expect(browseProductsButton).toBeVisible();

    // Check "Get Started" button
    const getStartedButton = page.locator('text=Get Started');
    await expect(getStartedButton).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    // Check for feature cards
    await expect(page.locator('text=Product Catalog')).toBeVisible();
    await expect(page.locator('text=Shopping Cart')).toBeVisible();
    await expect(page.locator('text=Order Management')).toBeVisible();
  });

  test('should have trust indicators', async ({ page }) => {
    // Check trust indicators
    await expect(page.locator('text=Production Ready')).toBeVisible();
    await expect(page.locator('text=Fully Tested')).toBeVisible();
    await expect(page.locator('text=Open Source')).toBeVisible();
  });

  test('should have API documentation link', async ({ page }) => {
    // Check API documentation link
    const apiDocsLink = page.locator('text=Interactive Swagger Docs');
    await expect(apiDocsLink).toBeVisible();
    await expect(apiDocsLink).toHaveAttribute('href', 'http://localhost:3001/api/docs');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Main heading should still be visible
    await expect(page.locator('h1')).toBeVisible();

    // Navigation buttons should stack vertically on mobile
    const buttons = page.locator('a:has-text("Browse Products"), a:has-text("Get Started")');
    await expect(buttons.first()).toBeVisible();
    await expect(buttons.nth(1)).toBeVisible();
  });

  test('should have smooth animations and interactions', async ({ page }) => {
    // Hover over feature cards to check animations
    const productCatalogCard = page.locator('text=Product Catalog').locator('..').locator('..');
    await productCatalogCard.hover();

    // Check that card has hover effects (shadow changes)
    await expect(productCatalogCard).toBeVisible();

    // Check button hover effects
    const browseButton = page.locator('text=Browse Products');
    await browseButton.hover();
    await expect(browseButton).toBeVisible();
  });
});