/**
 * Unit tests for mock generators
 */

import {
  createMockUser,
  createMockProduct,
  createMockOrder,
  createMockAddress,
  createMockUsers,
  createMockProducts,
  createMockApiResponse,
  createMockTokens,
} from './mocks';

describe('Mock Generators', () => {
  describe('createMockUser', () => {
    it('should create a mock user with default values', () => {
      const user = createMockUser();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firstName', 'John');
      expect(user).toHaveProperty('lastName', 'Doe');
      expect(user).toHaveProperty('role', 'USER');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);

      // ID should be a valid UUID format
      expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should accept overrides', () => {
      const overrides = {
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'ADMIN' as const,
      };

      const user = createMockUser(overrides);

      expect(user.firstName).toBe('Jane');
      expect(user.lastName).toBe('Smith');
      expect(user.role).toBe('ADMIN');
      expect(user.email).toBe('jane.smith@example.com');
    });
  });

  describe('createMockProduct', () => {
    it('should create a mock product with default values', () => {
      const product = createMockProduct();

      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('sku');
      expect(product).toHaveProperty('stock');
      expect(product).toHaveProperty('category', 'Electronics');
      expect(product).toHaveProperty('active', true);
      expect(product.images).toBeInstanceOf(Array);
      expect(product.images.length).toBeGreaterThan(0);

      // Price should be reasonable
      expect(product.price).toBeGreaterThan(0);
      expect(product.price).toBeLessThan(1010);

      // Stock should be reasonable
      expect(product.stock).toBeGreaterThan(0);
      expect(product.stock).toBeLessThan(101);
    });

    it('should accept overrides', () => {
      const overrides = {
        name: 'Custom Product',
        category: 'Books',
        price: 29.99,
        active: false,
      };

      const product = createMockProduct(overrides);

      expect(product.name).toBe('Custom Product');
      expect(product.category).toBe('Books');
      expect(product.price).toBe(29.99);
      expect(product.active).toBe(false);
    });
  });

  describe('createMockOrder', () => {
    it('should create a mock order with default values', () => {
      const order = createMockOrder();

      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('status', 'PENDING');
      expect(order).toHaveProperty('shippingAddress');
      expect(order).toHaveProperty('billingAddress');
      expect(order).toHaveProperty('paymentMethod', 'credit_card');

      expect(order.items).toBeInstanceOf(Array);
      expect(order.items.length).toBeGreaterThan(0);

      // Total should equal sum of item subtotals
      const expectedTotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
      expect(order.total).toBe(expectedTotal);

      // Each item should have required properties
      order.items.forEach(item => {
        expect(item).toHaveProperty('productId');
        expect(item).toHaveProperty('quantity');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('subtotal');
        expect(item.subtotal).toBe(item.quantity * item.price);
      });
    });

    it('should accept overrides', () => {
      const customItems = [
        {
          productId: 'custom-id',
          quantity: 1,
          price: 100,
          subtotal: 100,
        },
      ];

      const order = createMockOrder({
        items: customItems,
        status: 'DELIVERED',
        paymentMethod: 'paypal',
      });

      expect(order.items).toBe(customItems);
      expect(order.status).toBe('DELIVERED');
      expect(order.paymentMethod).toBe('paypal');
      expect(order.total).toBe(100);
    });
  });

  describe('createMockAddress', () => {
    it('should create a mock address with default values', () => {
      const address = createMockAddress();

      expect(address).toEqual({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'US',
        postalCode: '10001',
      });
    });

    it('should accept overrides', () => {
      const overrides = {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
      };

      const address = createMockAddress(overrides);

      expect(address.street).toBe('456 Oak Ave');
      expect(address.city).toBe('Los Angeles');
      expect(address.state).toBe('CA');
      expect(address.country).toBe('US'); // Should keep default
      expect(address.postalCode).toBe('10001'); // Should keep default
    });
  });

  describe('createMockUsers', () => {
    it('should create multiple users', () => {
      const users = createMockUsers(3);

      expect(users).toHaveLength(3);
      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
      });

      // Should have unique emails
      const emails = users.map(u => u.email);
      expect(new Set(emails).size).toBe(emails.length);
    });
  });

  describe('createMockProducts', () => {
    it('should create multiple products', () => {
      const products = createMockProducts(5);

      expect(products).toHaveLength(5);
      products.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('price');
      });

      // Should have unique names
      const names = products.map(p => p.name);
      expect(new Set(names).size).toBe(names.length);
    });
  });

  describe('createMockApiResponse', () => {
    it('should create successful API response by default', () => {
      const data = { message: 'Hello' };
      const response = createMockApiResponse(data);

      expect(response).toMatchObject({
        success: true,
        data,
        statusCode: 200,
        message: 'Request successful',
      });

      expect(response).toHaveProperty('timestamp');
      expect(response.error).toBeUndefined();
    });

    it('should create error response with options', () => {
      const response = createMockApiResponse(undefined, {
        success: false,
        error: 'Something went wrong',
        statusCode: 400,
      });

      expect(response).toMatchObject({
        success: false,
        error: 'Something went wrong',
        statusCode: 400,
        message: 'Request failed',
      });

      expect(response.data).toBeUndefined();
    });
  });

  describe('createMockTokens', () => {
    it('should create mock JWT tokens', () => {
      const tokens = createMockTokens();

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');

      // Access token should be JWT-like format (allowing = padding)
      expect(tokens.accessToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_]+$/);

      // Refresh token should be a long random string
      expect(tokens.refreshToken).toHaveLength(64);
    });
  });
});