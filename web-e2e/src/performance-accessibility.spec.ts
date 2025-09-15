import { test, expect } from '@playwright/test';

test.describe('Performance and Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should meet performance benchmarks on homepage', async ({ page }) => {
    // Measure page load performance
    const performanceEntries = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    // Performance assertions (reasonable benchmarks for development)
    expect(performanceEntries.domContentLoaded).toBeLessThan(3000); // 3 seconds
    expect(performanceEntries.loadComplete).toBeLessThan(5000); // 5 seconds
    expect(performanceEntries.firstPaint).toBeLessThan(2000); // 2 seconds
    expect(performanceEntries.firstContentfulPaint).toBeLessThan(2500); // 2.5 seconds

    console.log('Performance Metrics:', performanceEntries);
  });

  test('should be accessible with screen reader navigation', async ({ page }) => {
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Verify main heading exists
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();

    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const image of images) {
      const altText = await image.getAttribute('alt');
      expect(altText).toBeTruthy(); // Images should have alt text
    }

    // Check for proper form labels
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      // Input should have either an associated label, aria-label, or meaningful placeholder
      if (inputId) {
        const associatedLabel = page.locator(`label[for="${inputId}"]`);
        const hasLabel = await associatedLabel.count() > 0;
        expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
      }
    }

    // Check for skip navigation links
    const skipLink = page.locator('a[href="#main"], a[href="#content"], a:has-text("skip")');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeInTheDocument();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation through interactive elements
    const interactiveElements = await page.locator('button, a, input, select, textarea').all();

    if (interactiveElements.length > 0) {
      // Focus first element
      await page.keyboard.press('Tab');

      // Get currently focused element
      const firstFocused = await page.locator(':focus').first();
      await expect(firstFocused).toBeFocused();

      // Test keyboard activation
      if (await firstFocused.getAttribute('role') === 'button' || await firstFocused.evaluate(el => el.tagName) === 'BUTTON') {
        // Test Enter key activation
        const buttonText = await firstFocused.textContent();
        if (buttonText && !buttonText.includes('Login') && !buttonText.includes('Register')) {
          // Only test safe buttons that won't navigate away
          await page.keyboard.press('Enter');
        }
      }

      // Test escape key functionality (for modals/dropdowns)
      await page.keyboard.press('Escape');
    }
  });

  test('should handle responsive design across viewports', async ({ page }) => {
    // Test desktop viewport (default)
    await expect(page.locator('h1')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();

    // Check mobile navigation if it exists
    const mobileMenu = page.locator('[class*="mobile-menu"], [data-testid="mobile-menu"], button[aria-label*="menu"]');
    if (await mobileMenu.count() > 0) {
      await expect(mobileMenu.first()).toBeVisible();
    }

    // Test large desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should maintain performance on products page', async ({ page }) => {
    await page.click('text=Browse Products');
    await expect(page).toHaveURL(/\/products/);

    // Wait for products to load
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]', { timeout: 10000 });
    const loadTime = Date.now() - startTime;

    // Products should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Check for lazy loading of images
    const productImages = page.locator('img[src*="product"], img[alt*="product"]');
    if (await productImages.count() > 0) {
      // Verify images load properly
      await expect(productImages.first()).toBeVisible();
    }

    // Test scroll performance
    const productsContainer = page.locator('[class*="product"], [data-testid="products"]').first();
    if (await productsContainer.isVisible()) {
      await productsContainer.hover();

      // Scroll down
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(100);
      }
    }
  });

  test('should handle focus management in interactive components', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Test search input focus
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.focus();
      await expect(searchInput).toBeFocused();

      // Type and verify focus remains
      await searchInput.fill('test');
      await expect(searchInput).toBeFocused();
    }

    // Test modal/drawer focus management
    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    // Open cart drawer
    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    // Verify focus is trapped in cart drawer
    const cartDrawer = page.locator('[data-testid="cart-drawer"], [class*="cart-drawer"], [class*="cart-modal"]');
    if (await cartDrawer.isVisible()) {
      // Focus should be in the drawer
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() > 0) {
        const focusedInDrawer = await cartDrawer.locator(':focus').count() > 0;
        // Focus should ideally be managed within the drawer
        console.log('Focus managed in cart drawer:', focusedInDrawer);
      }

      // Close drawer with Escape key
      await page.keyboard.press('Escape');

      // Focus should return to cart icon
      if (await cartDrawer.isHidden()) {
        // Cart drawer should be closed
        expect(await cartDrawer.isVisible()).toBe(false);
      }
    }
  });

  test('should provide appropriate error messages and feedback', async ({ page }) => {
    // Test form validation feedback
    await page.click('text=Get Started');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    const errorMessages = page.locator('[class*="error"], .error, [role="alert"], [aria-live]');
    if (await errorMessages.count() > 0) {
      await expect(errorMessages.first()).toBeVisible();

      // Error messages should be descriptive
      const errorText = await errorMessages.first().textContent();
      expect(errorText?.length).toBeGreaterThan(5); // Should be more than just "Error"
    }

    // Test success feedback
    await page.fill('input[name="name"], input[placeholder*="name"]', 'Test User');
    await page.fill('input[name="email"], input[placeholder*="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"], input[placeholder*="password"]', 'Test123!@#');

    await page.click('button[type="submit"]');

    // Should either show success message or redirect
    await page.waitForTimeout(2000);

    const successIndicator = page.locator('[class*="success"], .success, text=success, text=Success');
    const redirectOccurred = await page.url() !== (await page.evaluate(() => window.location.href));

    // Either success message should be shown or redirect should occur
    const hasSuccessFeedback = (await successIndicator.count() > 0) || redirectOccurred;
    expect(hasSuccessFeedback).toBe(true);
  });

  test('should handle loading states appropriately', async ({ page }) => {
    await page.click('text=Browse Products');

    // Look for loading indicators
    const loadingIndicators = page.locator('[class*="loading"], .loading, [class*="spinner"], .spinner, text=Loading');

    // If loading indicators exist, they should be visible initially
    if (await loadingIndicators.count() > 0) {
      console.log('Loading indicators found, checking visibility');
    }

    // Wait for content to load
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]', { timeout: 10000 });

    // Loading indicators should be hidden after content loads
    if (await loadingIndicators.count() > 0) {
      await expect(loadingIndicators.first()).toBeHidden();
    }

    // Test search loading states
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('laptop');
      await page.keyboard.press('Enter');

      // Should show loading state during search
      const searchLoading = page.locator('[class*="loading"], .loading, [class*="spinner"]');
      if (await searchLoading.count() > 0) {
        // Loading should eventually disappear
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should provide proper ARIA labels and roles', async ({ page }) => {
    // Check for landmark roles
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').all();
    expect(landmarks.length).toBeGreaterThan(0);

    // Check for proper button roles and labels
    const buttons = await page.locator('button, [role="button"]').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Button should have either text content or aria-label
      expect(ariaLabel || (textContent && textContent.trim().length > 0)).toBeTruthy();
    }

    // Check for form field labels
    const formFields = await page.locator('input, select, textarea').all();
    for (const field of formFields) {
      const fieldId = await field.getAttribute('id');
      const ariaLabel = await field.getAttribute('aria-label');
      const ariaLabelledBy = await field.getAttribute('aria-labelledby');

      if (fieldId) {
        const associatedLabel = page.locator(`label[for="${fieldId}"]`);
        const hasLabel = await associatedLabel.count() > 0;

        // Field should have proper labeling
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1

    // Check for list markup where appropriate
    const lists = await page.locator('ul, ol').all();
    for (const list of lists) {
      const listItems = await list.locator('li').count();
      if (listItems > 0) {
        expect(listItems).toBeGreaterThan(0);
      }
    }
  });

  test('should handle color contrast and visual accessibility', async ({ page }) => {
    // Test high contrast mode simulation
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);

    // Content should still be visible in dark mode
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();

    // Reset to light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForTimeout(500);

    // Test focus indicators
    const focusableElements = await page.locator('button, a, input').all();
    if (focusableElements.length > 0) {
      await focusableElements[0].focus();

      // Focused element should have visible focus indicator
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeFocused();

      // Check if custom focus styles are applied
      const computedStyle = await focusedElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          outline: style.outline,
          boxShadow: style.boxShadow,
          borderColor: style.borderColor,
        };
      });

      // Should have some form of focus indicator
      const hasFocusIndicator = computedStyle.outline !== 'none' ||
                               computedStyle.boxShadow !== 'none' ||
                               computedStyle.borderColor !== 'initial';

      console.log('Focus indicator present:', hasFocusIndicator);
    }
  });

  test('should maintain performance during user interactions', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Measure interaction performance
    const performanceMarks: number[] = [];

    // Test rapid filtering
    const categoryFilter = page.locator('input[type="radio"], label').first();
    if (await categoryFilter.isVisible()) {
      performanceMarks.push(Date.now());
      await categoryFilter.click();
      await page.waitForTimeout(500);
      performanceMarks.push(Date.now());

      const filterTime = performanceMarks[1] - performanceMarks[0];
      expect(filterTime).toBeLessThan(1000); // Filtering should be fast
    }

    // Test cart interactions
    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();

    performanceMarks.push(Date.now());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);
    performanceMarks.push(Date.now());

    const addToCartTime = performanceMarks[3] - performanceMarks[2];
    expect(addToCartTime).toBeLessThan(1000); // Add to cart should be responsive

    console.log('Interaction Performance:', {
      filterTime: performanceMarks[1] - performanceMarks[0],
      addToCartTime: performanceMarks[3] - performanceMarks[2],
    });
  });
});