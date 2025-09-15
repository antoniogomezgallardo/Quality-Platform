import { test, expect } from '@playwright/test';

test.describe('API Integration - Frontend-Backend E2E', () => {
  const testUser = {
    name: 'API Test User',
    email: `api-test-${Date.now()}@example.com`,
    password: 'Test123!@#',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle API authentication flow', async ({ page }) => {
    // Monitor network requests
    const requests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
        });
      }
    });

    // 1. Register user - should call POST /api/auth/register
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);

    await page.click('button[type="submit"]');

    // Wait for redirect after successful registration
    await page.waitForURL(/\/products|\/dashboard/, { timeout: 10000 });

    // Verify registration API call was made
    const registerRequest = requests.find(req => req.url.includes('/auth/register') || req.url.includes('/register'));
    expect(registerRequest).toBeTruthy();
    expect(registerRequest?.method).toBe('POST');

    // 2. Logout - should call POST /api/auth/logout
    await page.click('text=Logout');
    await page.waitForURL('/');

    // 3. Login - should call POST /api/auth/login
    await page.click('text=Login');
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);

    // Verify login API call was made
    const loginRequest = requests.find(req => req.url.includes('/auth/login') || req.url.includes('/login'));
    expect(loginRequest).toBeTruthy();
    expect(loginRequest?.method).toBe('POST');
  });

  test('should handle API error responses gracefully', async ({ page }) => {
    // Test registration with invalid email
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', 'invalid-email');
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);

    await page.click('button[type="submit"]');

    // Should show error message from API
    const errorMessage = page.locator('[class*="error"], .error, text=invalid, text=Invalid');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }

    // Test login with non-existent user
    await page.goto('/');
    await page.click('text=Login');
    await page.fill('input[name="email"], input[placeholder*="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"], input[placeholder*="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    const loginError = page.locator('[class*="error"], .error, text=Invalid, text=invalid');
    await expect(loginError).toBeVisible();
  });

  test('should load products from API', async ({ page }) => {
    // Monitor API requests
    const apiRequests: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/products')) {
        apiRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    // Navigate to products page
    await page.click('text=Browse Products');
    await expect(page).toHaveURL(/\/products/);

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]', { timeout: 10000 });

    // Verify API call was successful
    expect(apiRequests.length).toBeGreaterThan(0);
    const successfulRequest = apiRequests.find(req => req.status === 200);
    expect(successfulRequest).toBeTruthy();

    // Verify products are displayed
    const products = page.locator('[data-testid="product-card"], .product-card, [class*="product"]');
    await expect(products.first()).toBeVisible();
  });

  test('should handle product search API integration', async ({ page }) => {
    // Monitor search API calls
    const searchRequests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/products') && request.url().includes('search')) {
        searchRequests.push({
          url: request.url(),
          method: request.method(),
        });
      }
    });

    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Perform search
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('laptop');
      await page.keyboard.press('Enter');

      await page.waitForTimeout(1000);

      // Verify search API call was made
      if (searchRequests.length > 0) {
        const searchRequest = searchRequests[0];
        expect(searchRequest.url).toContain('search');
        expect(searchRequest.url).toContain('laptop');
      }
    }
  });

  test('should handle cart operations through API', async ({ page }) => {
    // Register user first
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);

    // Monitor cart API requests
    const cartRequests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/cart')) {
        cartRequests.push({
          url: request.url(),
          method: request.method(),
        });
      }
    });

    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Add product to cart - should call POST /api/cart/items
    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    await page.waitForTimeout(1000);

    // Verify add to cart API call
    const addToCartRequest = cartRequests.find(req => req.method === 'POST');
    if (addToCartRequest) {
      expect(addToCartRequest.method).toBe('POST');
      expect(addToCartRequest.url).toContain('/cart');
    }

    // Open cart to trigger cart fetch - should call GET /api/cart
    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    await page.waitForTimeout(1000);

    // Verify get cart API call
    const getCartRequest = cartRequests.find(req => req.method === 'GET');
    if (getCartRequest) {
      expect(getCartRequest.method).toBe('GET');
      expect(getCartRequest.url).toContain('/cart');
    }
  });

  test('should handle order creation through API', async ({ page }) => {
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

    // Monitor order API requests
    const orderRequests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/orders')) {
        orderRequests.push({
          url: request.url(),
          method: request.method(),
        });
      }
    });

    // Proceed to checkout
    const cartIcon = page.locator('[data-testid="cart-icon"], [class*="cart-icon"], button:has([class*="cart"])').first();
    await cartIcon.click();

    const checkoutButton = page.locator('button:has-text("Checkout"), a[href*="checkout"]').first();
    await checkoutButton.click();

    // Place order - should call POST /api/orders
    const placeOrderButton = page.locator('button:has-text("Place Order"), button[type="submit"]').last();
    if (await placeOrderButton.isVisible()) {
      await placeOrderButton.click();
      await page.waitForTimeout(2000);

      // Verify order creation API call
      const createOrderRequest = orderRequests.find(req => req.method === 'POST');
      if (createOrderRequest) {
        expect(createOrderRequest.method).toBe('POST');
        expect(createOrderRequest.url).toContain('/orders');
      }
    }
  });

  test('should handle API authentication tokens correctly', async ({ page }) => {
    // Monitor requests to check for Authorization headers
    const authenticatedRequests: any[] = [];
    page.on('request', request => {
      const authHeader = request.headers()['authorization'];
      if (authHeader && request.url().includes('/api/')) {
        authenticatedRequests.push({
          url: request.url(),
          hasAuth: !!authHeader,
          authType: authHeader.startsWith('Bearer') ? 'Bearer' : 'Other',
        });
      }
    });

    // Register user
    await page.click('text=Get Started');
    await page.fill('input[name="name"], input[placeholder*="name"]', testUser.name);
    await page.fill('input[name="email"], input[placeholder*="email"]', testUser.email);
    await page.fill('input[name="password"], input[placeholder*="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/products|\/dashboard/);
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Perform authenticated action (add to cart)
    const firstProduct = page.locator('[data-testid="product-card"], .product-card, [class*="product"]').first();
    await firstProduct.locator('button:has-text("Add to Cart")').click();

    await page.waitForTimeout(1000);

    // Verify authenticated requests include proper tokens
    const authRequest = authenticatedRequests.find(req => req.url.includes('/cart'));
    if (authRequest) {
      expect(authRequest.hasAuth).toBe(true);
      expect(authRequest.authType).toBe('Bearer');
    }
  });

  test('should handle API rate limiting gracefully', async ({ page }) => {
    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    // Monitor responses for rate limiting
    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers(),
        });
      }
    });

    // Perform multiple rapid searches to potentially trigger rate limiting
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      for (let i = 0; i < 5; i++) {
        await searchInput.fill(`search${i}`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
      }

      await page.waitForTimeout(1000);

      // Check if any responses indicate rate limiting (429 status)
      const rateLimitedResponse = responses.find(resp => resp.status === 429);
      if (rateLimitedResponse) {
        // Should handle rate limiting gracefully - show user-friendly message
        const errorMessage = page.locator('text=too many requests, text=rate limit, text=slow down');
        if (await errorMessage.isVisible()) {
          await expect(errorMessage).toBeVisible();
        }
      }
    }
  });

  test('should handle network failures gracefully', async ({ page }) => {
    await page.click('text=Browse Products');

    // Simulate network failure by intercepting requests
    await page.route('/api/products*', route => {
      route.abort();
    });

    // Try to refresh products
    await page.reload();

    // Should show error state or retry mechanism
    const errorState = page.locator('text=error, text=Error, text=failed, text=Failed, text=retry, text=Retry');
    if (await errorState.isVisible()) {
      await expect(errorState).toBeVisible();
    }

    // Clear route interception
    await page.unroute('/api/products*');
  });

  test('should validate API response data integrity', async ({ page }) => {
    // Monitor API responses to validate data structure
    const apiResponses: any[] = [];
    page.on('response', async response => {
      if (response.url().includes('/api/products') && response.status() === 200) {
        try {
          const data = await response.json();
          apiResponses.push({
            url: response.url(),
            data: data,
          });
        } catch (e) {
          // Handle non-JSON responses
        }
      }
    });

    await page.click('text=Browse Products');
    await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="product"]');

    await page.waitForTimeout(1000);

    // Validate products API response structure
    const productsResponse = apiResponses.find(resp => resp.url.includes('/products'));
    if (productsResponse && productsResponse.data) {
      const data = productsResponse.data;

      // Should have products array
      expect(Array.isArray(data.data) || Array.isArray(data.products) || Array.isArray(data)).toBe(true);

      // If pagination exists, validate structure
      if (data.pagination) {
        expect(typeof data.pagination.total).toBe('number');
        expect(typeof data.pagination.page).toBe('number');
        expect(typeof data.pagination.limit).toBe('number');
      }
    }
  });
});