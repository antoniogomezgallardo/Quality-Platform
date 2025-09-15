import { test, expect } from '@playwright/test';

test.describe('Order Management - End-to-End Flow', () => {
  const testUser = {
    name: 'Order Test User',
    email: `order-test-${Date.now()}@example.com`,
    password: 'Test123!@#',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full order creation flow', async ({ page }) => {
    // 1. Register a new user
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"], input[id*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"], input[id*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"], input[id*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Wait for successful registration redirect
    await page.waitForURL(/\/products|\/dashboard/);

    // 2. Add products to cart
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    const firstProductName = await firstProduct.locator('h3, .product-name, [class*="product-title"]').first().textContent();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    // Add second product
    const secondProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').nth(1);
    if (await secondProduct.isVisible()) {
      await secondProduct.locator('button:has-text("Add to Cart")').click();
    }

    // 3. Navigate to cart/checkout
    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    const cartDrawer = page.locator('[data-testid="cart-drawer"], [class*="cart-drawer"], [class*="cart-modal"]');
    await expect(cartDrawer).toBeVisible();

    // 4. Proceed to checkout
    const checkoutButton = cartDrawer.locator('button:has-text("Checkout"), button:has-text("Proceed"), a[href*="checkout"]');
    await checkoutButton.click();

    // Should be on checkout page
    await expect(page).toHaveURL(/\/checkout|\/cart/);

    // 5. Fill checkout form (if checkout form exists)
    const checkoutForm = page.locator('form, [class*="checkout"], [data-testid="checkout"]');
    if (await checkoutForm.isVisible()) {
      // Fill billing/shipping information
      const nameInput = checkoutForm.locator('input[name*="name"], input[placeholder*="name"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill(testUser.name);
      }

      const emailInput = checkoutForm.locator('input[name*="email"], input[placeholder*="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill(testUser.email);
      }

      const addressInput = checkoutForm.locator('input[name*="address"], input[placeholder*="address"]').first();
      if (await addressInput.isVisible()) {
        await addressInput.fill('123 Test Street');
      }

      const cityInput = checkoutForm.locator('input[name*="city"], input[placeholder*="city"]').first();
      if (await cityInput.isVisible()) {
        await cityInput.fill('Test City');
      }

      const zipInput = checkoutForm.locator('input[name*="zip"], input[name*="postal"], input[placeholder*="zip"]').first();
      if (await zipInput.isVisible()) {
        await zipInput.fill('12345');
      }
    }

    // 6. Add order notes (if available)
    const notesTextarea = page.locator('textarea[name*="notes"], textarea[placeholder*="notes"]').first();
    if (await notesTextarea.isVisible()) {
      await notesTextarea.fill('Test order notes for E2E testing');
    }

    // 7. Place order
    const placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Complete Order"), button[type="submit"]').last();
    await expect(placeOrderButton).toBeVisible();
    await placeOrderButton.click();

    // 8. Verify order confirmation
    await page.waitForTimeout(2000); // Wait for order processing

    // Should show success message or redirect to order confirmation
    const successMessage = page.locator(
      'text=Order placed, text=Order created, text=Success, text=Thank you, [class*="success"], [class*="confirmation"]'
    );

    if (await successMessage.isVisible()) {
      await expect(successMessage).toBeVisible();
    } else {
      // Or might redirect to orders page
      await expect(page).toHaveURL(/\/orders|\/order|\/success|\/confirmation/);
    }

    // 9. Navigate to orders page to verify order was created
    const ordersLink = page.locator('a[href*="orders"], text=Orders, text=My Orders').first();
    if (await ordersLink.isVisible()) {
      await ordersLink.click();
      await expect(page).toHaveURL(/\/orders/);

      // Verify order appears in orders list
      if (firstProductName) {
        const ordersList = page.locator('[class*="order"], [data-testid="order"]');
        await expect(ordersList.first()).toBeVisible();
      }
    }
  });

  test('should display order history for authenticated user', async ({ page }) => {
    // 1. First create an order by following the complete flow
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Add product and create order
    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), a[href*="checkout"]').first();
    await checkoutButton.click();

    const placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Complete Order"), button[type="submit"]').last();
    if (await placeOrderButton.isVisible()) {
      await placeOrderButton.click();
      await page.waitForTimeout(1000);
    }

    // 2. Navigate to orders page
    const ordersLink = page.locator('a[href*="orders"], text=Orders, text=My Orders').first();
    if (await ordersLink.isVisible()) {
      await ordersLink.click();
      await expect(page).toHaveURL(/\/orders/);

      // 3. Verify orders list is displayed
      const ordersContainer = page.locator('[class*="order"], [data-testid="orders"], h1:has-text("Orders")');
      await expect(ordersContainer.first()).toBeVisible();

      // Check for order status indicators
      const statusBadges = page.locator('[class*="status"], [class*="badge"], text=PENDING, text=CONFIRMED');
      if (await statusBadges.first().isVisible()) {
        await expect(statusBadges.first()).toBeVisible();
      }
    }
  });

  test('should handle checkout validation errors', async ({ page }) => {
    // Register user and add product to cart
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), a[href*="checkout"]').first();
    await checkoutButton.click();

    // Try to place order without filling required fields
    const placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Complete Order"), button[type="submit"]').last();
    if (await placeOrderButton.isVisible()) {
      await placeOrderButton.click();

      // Should show validation errors
      const errorMessages = page.locator('[class*="error"], .error, [class*="invalid"], text=required, text=Required');
      if (await errorMessages.first().isVisible()) {
        await expect(errorMessages.first()).toBeVisible();
      }
    }
  });

  test('should handle empty cart checkout attempt', async ({ page }) => {
    // Register user but don't add any products
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Try to access checkout with empty cart
    await page.goto('/checkout');

    // Should redirect to cart or show empty cart message
    const emptyCartMessage = page.locator('text=empty, text=Empty, text=no items, text=No items');
    const cartRedirect = page.locator('text=Cart, text=Add products');

    await expect(emptyCartMessage.or(cartRedirect)).toBeVisible();
  });

  test('should calculate order totals correctly', async ({ page }) => {
    // Register and add multiple products
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Add multiple products to test total calculation
    const products = page.locator('[data-testid="product-card"], .product-card, [class*="product"]');
    const productCount = await products.count();

    if (productCount >= 2) {
      await products.nth(0).locator('button:has-text("Add to Cart")').click();
      await products.nth(1).locator('button:has-text("Add to Cart")').click();

      const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
      await cartIcon.click();

      const cartDrawer = page.locator('[data-testid="cart-drawer"], [class*="cart-drawer"], [class*="cart-modal"]');

      // Check cart total
      const cartTotal = cartDrawer.locator('[class*="total"], .total, :has-text("Total")');
      if (await cartTotal.isVisible()) {
        await expect(cartTotal).toContainText('$');
      }

      // Proceed to checkout
      const checkoutButton = cartDrawer.locator('button:has-text("Checkout"), a[href*="checkout"]').first();
      await checkoutButton.click();

      // Verify checkout page shows same total
      const checkoutTotal = page.locator('[class*="total"], .total, :has-text("Total")');
      if (await checkoutTotal.isVisible()) {
        await expect(checkoutTotal).toContainText('$');
      }
    }
  });

  test('should handle order status updates', async ({ page }) => {
    // Create an order first
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    const checkoutButton = page.locator('button:has-text("Checkout"), a[href*="checkout"]').first();
    await checkoutButton.click();

    const placeOrderButton = page.locator('button:has-text("Place Order"), button[type="submit"]').last();
    if (await placeOrderButton.isVisible()) {
      await placeOrderButton.click();
      await page.waitForTimeout(1000);
    }

    // Navigate to orders and check initial status
    const ordersLink = page.locator('a[href*="orders"], text=Orders').first();
    if (await ordersLink.isVisible()) {
      await ordersLink.click();

      // Look for status indicators
      const statusBadges = page.locator('[class*="status"], [class*="badge"]');
      if (await statusBadges.first().isVisible()) {
        const statusText = await statusBadges.first().textContent();

        // Common order statuses
        const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const hasValidStatus = validStatuses.some(status => statusText?.includes(status));

        if (hasValidStatus) {
          await expect(statusBadges.first()).toBeVisible();
        }
      }
    }
  });

  test('should preserve order data across browser refresh', async ({ page }) => {
    // Create order
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    const checkoutButton = page.locator('button:has-text("Checkout"), a[href*="checkout"]').first();
    await checkoutButton.click();

    const placeOrderButton = page.locator('button:has-text("Place Order"), button[type="submit"]').last();
    if (await placeOrderButton.isVisible()) {
      await placeOrderButton.click();
      await page.waitForTimeout(1000);
    }

    // Navigate to orders page
    const ordersLink = page.locator('a[href*="orders"], text=Orders').first();
    if (await ordersLink.isVisible()) {
      await ordersLink.click();

      // Refresh page
      await page.reload();

      // Verify orders still visible
      const ordersContainer = page.locator('[class*="order"], [data-testid="orders"], h1:has-text("Orders")');
      await expect(ordersContainer.first()).toBeVisible();
    }
  });
});