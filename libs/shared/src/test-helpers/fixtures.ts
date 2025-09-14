/**
 * Test fixtures and test data sets
 */

import { MockUser, MockProduct, MockOrder } from './mocks';

/**
 * Predefined test users
 */
export const testUsers: Record<string, MockUser> = {
  admin: {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'admin@quality-platform.com',
    password: '$2b$10$K.0HbBPEKHxpRz8XfZYJdOYZh8zGJxXQCaUMFRmDDcMrNQTPKqMfi',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1 (555) 000-0001',
    role: 'ADMIN',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  regularUser: {
    id: '00000000-0000-4000-8000-000000000002',
    email: 'user@example.com',
    password: '$2b$10$K.0HbBPEKHxpRz8XfZYJdOYZh8zGJxXQCaUMFRmDDcMrNQTPKqMfi',
    firstName: 'Regular',
    lastName: 'User',
    phone: '+1 (555) 000-0002',
    role: 'USER',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  testUser: {
    id: '00000000-0000-4000-8000-000000000003',
    email: 'test@example.com',
    password: '$2b$10$K.0HbBPEKHxpRz8XfZYJdOYZh8zGJxXQCaUMFRmDDcMrNQTPKqMfi',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1 (555) 000-0003',
    role: 'USER',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
};

/**
 * Predefined test products
 */
export const testProducts: Record<string, MockProduct> = {
  laptop: {
    id: '00000000-0000-4000-8000-000000000101',
    name: 'Professional Laptop',
    description: 'High-performance laptop for professionals with Intel Core i7, 16GB RAM, 512GB SSD',
    price: 1299.99,
    sku: 'LAPTOP-PRO-001',
    stock: 50,
    category: 'Electronics',
    images: [
      'https://via.placeholder.com/400x400/0066cc/ffffff?text=Laptop',
      'https://via.placeholder.com/400x400/0066cc/ffffff?text=Laptop+Side',
    ],
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  smartphone: {
    id: '00000000-0000-4000-8000-000000000102',
    name: 'Flagship Smartphone',
    description: 'Latest smartphone with 5G, triple camera system, and all-day battery life',
    price: 999.99,
    sku: 'PHONE-FLAG-001',
    stock: 100,
    category: 'Electronics',
    images: [
      'https://via.placeholder.com/400x400/333333/ffffff?text=Phone',
      'https://via.placeholder.com/400x400/333333/ffffff?text=Phone+Back',
    ],
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  headphones: {
    id: '00000000-0000-4000-8000-000000000103',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    sku: 'AUDIO-HEAD-001',
    stock: 75,
    category: 'Electronics',
    images: [
      'https://via.placeholder.com/400x400/666666/ffffff?text=Headphones',
    ],
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  outOfStock: {
    id: '00000000-0000-4000-8000-000000000104',
    name: 'Limited Edition Item',
    description: 'This item is currently out of stock',
    price: 199.99,
    sku: 'LIMITED-001',
    stock: 0,
    category: 'Special',
    images: [
      'https://via.placeholder.com/400x400/ff0000/ffffff?text=Out+of+Stock',
    ],
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  inactive: {
    id: '00000000-0000-4000-8000-000000000105',
    name: 'Discontinued Product',
    description: 'This product has been discontinued',
    price: 99.99,
    sku: 'DISC-001',
    stock: 10,
    category: 'Clearance',
    images: [
      'https://via.placeholder.com/400x400/999999/ffffff?text=Discontinued',
    ],
    active: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};

/**
 * Predefined test orders
 */
export const testOrders: Record<string, MockOrder> = {
  pendingOrder: {
    id: '00000000-0000-4000-8000-000000000201',
    userId: testUsers.regularUser.id,
    items: [
      {
        productId: testProducts.laptop.id,
        quantity: 1,
        price: testProducts.laptop.price,
        subtotal: testProducts.laptop.price,
      },
      {
        productId: testProducts.headphones.id,
        quantity: 2,
        price: testProducts.headphones.price,
        subtotal: testProducts.headphones.price * 2,
      },
    ],
    total: testProducts.laptop.price + (testProducts.headphones.price * 2),
    status: 'PENDING',
    shippingAddress: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      country: 'US',
      postalCode: '12345',
    },
    billingAddress: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      country: 'US',
      postalCode: '12345',
    },
    paymentMethod: 'credit_card',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  deliveredOrder: {
    id: '00000000-0000-4000-8000-000000000202',
    userId: testUsers.regularUser.id,
    items: [
      {
        productId: testProducts.smartphone.id,
        quantity: 1,
        price: testProducts.smartphone.price,
        subtotal: testProducts.smartphone.price,
      },
    ],
    total: testProducts.smartphone.price,
    status: 'DELIVERED',
    shippingAddress: {
      street: '456 Delivery Ave',
      city: 'Ship City',
      state: 'SC',
      country: 'US',
      postalCode: '54321',
    },
    billingAddress: {
      street: '456 Delivery Ave',
      city: 'Ship City',
      state: 'SC',
      country: 'US',
      postalCode: '54321',
    },
    paymentMethod: 'paypal',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
  },
};

/**
 * Test data sets for different scenarios
 */
export const testDataSets = {
  /**
   * Valid input data for various validation scenarios
   */
  validInputs: {
    emails: [
      'user@example.com',
      'test.user@company.co.uk',
      'firstname+lastname@domain.org',
    ],
    phones: [
      '+1 (555) 123-4567',
      '555-123-4567',
      '+44 20 7123 4567',
    ],
    urls: [
      'https://www.example.com',
      'http://subdomain.example.org/path',
      'https://example.com:8080/api',
    ],
    creditCards: [
      '4111111111111111', // Visa test card
      '5555555555554444', // Mastercard test card
      '378282246310005',  // American Express test card
    ],
  },

  /**
   * Invalid input data for testing validation failures
   */
  invalidInputs: {
    emails: [
      'notanemail',
      '@example.com',
      'user@',
      'user@.com',
    ],
    phones: [
      '123',
      'phone-number',
      '12345',
    ],
    urls: [
      'not-a-url',
      'ftp://invalid-protocol.com',
      'http://',
      '//missing-protocol.com',
    ],
    creditCards: [
      '1234567890123456', // Invalid Luhn
      '0000000000000000', // All zeros
      'not-a-card-number',
    ],
  },

  /**
   * Edge case data for boundary testing
   */
  edgeCases: {
    emptyStrings: ['', ' ', '  ', '\t', '\n'],
    nullValues: [null, undefined, NaN],
    specialCharacters: ['!@#$%^&*()', '<script>alert("xss")</script>', '"; DROP TABLE users;'],
    veryLongStrings: [
      'a'.repeat(1000),
      'test '.repeat(500),
    ],
    boundarNumbers: [0, -1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
  },
};

/**
 * Test configuration presets
 */
export const testConfigs = {
  /**
   * Default test database configuration
   */
  database: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
  },

  /**
   * Default test server configuration
   */
  server: {
    port: 0, // Random port
    host: 'localhost',
    cors: true,
    logging: false,
  },

  /**
   * Default test timeouts
   */
  timeouts: {
    unit: 5000,
    integration: 10000,
    e2e: 30000,
  },

  /**
   * Default test environment variables
   */
  environment: {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '1h',
    DATABASE_URL: 'sqlite::memory:',
    LOG_LEVEL: 'error',
  },
};