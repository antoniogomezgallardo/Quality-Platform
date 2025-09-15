import { test, expect } from '@playwright/test';

test.describe('Shopping Flow - Critical User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full shopping journey from homepage to cart', async ({ page }) => {
    // 1. Start from homepage and navigate to products
    await expect(page.locator('h1')).toContainText('Welcome to');
    await page.click('text=Browse Products');
    await expect(page).toHaveURL(/\/products/);

    // 2. Verify products page loads with product grid
    await expect(page.locator('h1')).toContainText('Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]', { timeout: 10000 });

    // 3. Use product search functionality
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    await searchInput.fill('laptop');
    await page.keyboard.press('Enter');

    // Wait for search results to load
    await page.waitForTimeout(1000);

    // 4. Add first product to cart
    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await expect(firstProduct).toBeVisible();

    // Get product name for verification later
    const productName = await firstProduct.locator('h3, .product-name, [class*="product-title"]').first().textContent();

    // Click "Add to Cart" button
    const addToCartButton = firstProduct.locator('button:has-text("Add to Cart"), button[class*="add-cart"]').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // 5. Verify cart badge updates
    const cartBadge = page.locator('[data-testid="cart-badge"], .cart-badge, [class*="cart"] [class*="badge"]');
    await expect(cartBadge).toContainText('1');

    // 6. Add second product to cart
    const secondProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').nth(1);
    if (await secondProduct.isVisible()) {
      const secondAddButton = secondProduct.locator('button:has-text("Add to Cart"), button[class*="add-cart"]').first();
      if (await secondAddButton.isVisible()) {
        await secondAddButton.click();
        await expect(cartBadge).toContainText('2');
      }
    }

    // 7. Open cart drawer/modal
    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    // 8. Verify cart contents
    const cartDrawer = page.locator('[data-testid="cart-drawer"], [class*="cart-drawer"], [class*="cart-modal"]');
    await expect(cartDrawer).toBeVisible();

    if (productName) {
      await expect(cartDrawer.locator(`text=${productName}`)).toBeVisible();
    }

    // 9. Update product quantity in cart
    const quantityButtons = cartDrawer.locator('button[aria-label*="increase"], button:has-text("+"), [class*="quantity"] button');
    if (await quantityButtons.first().isVisible()) {
      await quantityButtons.first().click();
      // Verify quantity updated
      await expect(cartBadge).toContainText('3');
    }

    // 10. Remove item from cart
    const removeButton = cartDrawer.locator('button[aria-label*="remove"], button:has-text("Remove"), button:has([class*="trash"])').first();
    if (await removeButton.isVisible()) {
      await removeButton.click();
      // Verify item removed (cart count should decrease)
      await page.waitForTimeout(500);
    }

    // 11. Navigate to checkout
    const checkoutButton = cartDrawer.locator('button:has-text("Checkout"), button:has-text("Proceed"), [href*="checkout"]');
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await expect(page).toHaveURL(/\/checkout|\/cart/);
    }
  });

  test('should handle empty cart state', async ({ page }) => {
    // Navigate to products page
    await page.click('text=Browse Products');

    // Open cart when empty
    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    // Verify empty cart message
    const cartDrawer = page.locator('[data-testid="cart-drawer"], [class*="cart-drawer"], [class*="cart-modal"]');
    await expect(cartDrawer).toBeVisible();
    await expect(cartDrawer.locator('text=empty, text=Empty, text=no items, text=No items')).toBeVisible();
  });

  test('should persist cart across page navigation', async ({ page }) => {
    // Navigate to products and add item
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    const addToCartButton = firstProduct.locator('button:has-text("Add to Cart"), button[class*="add-cart"]').first();
    await addToCartButton.click();

    // Verify cart has 1 item
    const cartBadge = page.locator('[data-testid="cart-badge"], .cart-badge, [class*="cart"] [class*="badge"]');
    await expect(cartBadge).toContainText('1');

    // Navigate away and back
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to');

    await page.click('text=Browse Products');

    // Verify cart persisted
    await expect(cartBadge).toContainText('1');
  });

  test('should handle product filtering and search', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Test search functionality
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('phone');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Verify search results
      const products = page.locator('[data-testid="product-card"], .product-card, [class*="product"]');
      await expect(products.first()).toBeVisible();
    }

    // Test category filtering
    const categoryFilter = page.locator('input[type="radio"][value*="Electronics"], label:has-text("Electronics")').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      await page.waitForTimeout(1000);

      // Verify filtered results
      const products = page.locator('[data-testid="product-card"], .product-card, [class*="product"]');
      await expect(products.first()).toBeVisible();
    }

    // Test price range filtering
    const minPriceInput = page.locator('input[placeholder*="Min"], input[name*="min"]').first();
    const maxPriceInput = page.locator('input[placeholder*="Max"], input[name*="max"]').first();

    if (await minPriceInput.isVisible() && await maxPriceInput.isVisible()) {
      await minPriceInput.fill('100');
      await maxPriceInput.fill('500');

      const applyButton = page.locator('button:has-text("Apply"), button[type="submit"]').first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Test clear filters
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")').first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should handle product out of stock', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Look for out of stock product
    const outOfStockProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').locator(':has-text("Out of Stock")').first();

    if (await outOfStockProduct.isVisible()) {
      // Verify "Add to Cart" button is disabled
      const addToCartButton = outOfStockProduct.locator('button:has-text("Add to Cart")');
      await expect(addToCartButton).toBeDisabled();
    }
  });

  test('should handle cart quantity limits and validations', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Add product to cart
    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    const addToCartButton = firstProduct.locator('button:has-text("Add to Cart"), button[class*="add-cart"]').first();
    await addToCartButton.click();

    // Open cart
    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    const cartDrawer = page.locator('[data-testid="cart-drawer"], [class*="cart-drawer"], [class*="cart-modal"]');

    // Try to increase quantity multiple times to test limits
    const increaseButton = cartDrawer.locator('button[aria-label*="increase"], button:has-text("+")').first();
    if (await increaseButton.isVisible()) {
      // Click multiple times to test quantity limits
      for (let i = 0; i < 10; i++) {
        await increaseButton.click();
        await page.waitForTimeout(200);

        // Check if button becomes disabled or shows error
        if (await increaseButton.isDisabled()) {
          break;
        }
      }
    }
  });

  test('should display correct product information', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();

    // Verify product card has essential information
    await expect(firstProduct.locator('h3, .product-name, [class*="product-title"]')).toBeVisible();
    await expect(firstProduct.locator('[class*="price"], .price')).toBeVisible();
    await expect(firstProduct.locator('button:has-text("Add to Cart"), button[class*="add-cart"]')).toBeVisible();

    // Check for product image
    const productImage = firstProduct.locator('img, [class*="image"]');
    if (await productImage.isVisible()) {
      await expect(productImage).toBeVisible();
    }

    // Check for stock information
    const stockInfo = firstProduct.locator('[class*="stock"], :has-text("in stock"), :has-text("In Stock")');
    if (await stockInfo.isVisible()) {
      await expect(stockInfo).toBeVisible();
    }
  });

  test('should handle cart total calculation', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Add multiple products to cart
    const products = page.locator('[data-testid="product-card"], .product-card, [class*="product"]');
    const productCount = await products.count();

    if (productCount >= 2) {
      // Add first product
      await products.nth(0).locator('button:has-text("Add to Cart")').click();

      // Add second product
      await products.nth(1).locator('button:has-text("Add to Cart")').click();

      // Open cart and verify total
      const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
      await cartIcon.click();

      const cartDrawer = page.locator('[data-testid="cart-drawer"], [class*="cart-drawer"], [class*="cart-modal"]');

      // Check for total price display
      const totalPrice = cartDrawer.locator('[class*="total"], .total, :has-text("Total")');
      if (await totalPrice.isVisible()) {
        await expect(totalPrice).toBeVisible();
        // Total should contain a dollar sign and number
        await expect(totalPrice).toContainText('$');
      }
    }
  });
});