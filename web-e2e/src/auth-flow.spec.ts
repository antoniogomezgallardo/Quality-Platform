import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testUser = {
    name: 'E2E Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'Test123!@#',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full registration flow', async ({ page }) => {
    // Navigate to registration page
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/\/register/);

    // Fill registration form
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Submit registration
    await page.click('button[type="submit"]');

    // Should redirect to products page after successful registration
    await expect(page).toHaveURL(/\/products/);

    // Should show user name in navigation
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();

    // Should show logout option
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should handle registration validation errors', async ({ page }) => {
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/\/register/);

    // Submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();

    // Test invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();

    // Test weak password
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Password must be at least')).toBeVisible();
  });

  test('should complete login flow', async ({ page }) => {
    // First register a user
    await page.click('text=Get Started');
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL('/');

    // Navigate to login page
    await page.click('text=Login');
    await expect(page).toHaveURL(/\/login/);

    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Submit login
    await page.click('button[type="submit"]');

    // Should redirect to products page
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
  });

  test('should handle login errors', async ({ page }) => {
    await page.click('text=Login');

    // Try with non-existent email
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Register and login first
    await page.click('text=Get Started');
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Logout
    await page.click('text=Logout');

    // Should redirect to homepage
    await expect(page).toHaveURL('/');

    // Should show login/register buttons again
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Get Started')).toBeVisible();

    // User name should not be visible
    await expect(page.locator(`text=${testUser.name}`)).not.toBeVisible();
  });

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/products');

    // Should redirect to login page or show login prompt
    await expect(
      page.locator('text=Login').or(page.locator('text=Please log in'))
    ).toBeVisible();
  });

  test('should persist authentication across page reloads', async ({ page }) => {
    // Register user
    await page.click('text=Get Started');
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Reload page
    await page.reload();

    // Should still be authenticated
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
  });
});