/**
 * Mock data generators for testing
 */

import { randomString, generateUUID } from '../utilities/helpers';

/**
 * User mock interface
 */
export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product mock interface
 */
export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  images: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order mock interface
 */
export interface MockOrder {
  id: string;
  userId: string;
  items: MockOrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: MockAddress;
  billingAddress: MockAddress;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order item mock interface
 */
export interface MockOrderItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * Address mock interface
 */
export interface MockAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * Create a mock user
 * @param overrides - Properties to override
 * @returns Mock user object
 */
export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  const now = new Date();
  const firstName = overrides?.firstName || 'John';
  const lastName = overrides?.lastName || 'Doe';
  const email = overrides?.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  return {
    id: generateUUID(),
    email,
    password: '$2b$10$K.0HbBPEKHxpRz8XfZYJdOYZh8zGJxXQCaUMFRmDDcMrNQTPKqMfi', // hashed "password123"
    firstName,
    lastName,
    phone: '+1 (555) 123-4567',
    role: 'USER',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock product
 * @param overrides - Properties to override
 * @returns Mock product object
 */
export function createMockProduct(overrides?: Partial<MockProduct>): MockProduct {
  const now = new Date();
  const name = overrides?.name || `Product ${randomString(5)}`;
  const sku = overrides?.sku || `SKU-${randomString(8).toUpperCase()}`;

  return {
    id: generateUUID(),
    name,
    description: `This is a description for ${name}. It's a high-quality product with excellent features.`,
    price: Math.floor(Math.random() * 1000) + 10,
    sku,
    stock: Math.floor(Math.random() * 100) + 1,
    category: 'Electronics',
    images: [
      'https://via.placeholder.com/400x400',
      'https://via.placeholder.com/400x400/888888',
    ],
    active: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock order
 * @param overrides - Properties to override
 * @returns Mock order object
 */
export function createMockOrder(overrides?: Partial<MockOrder>): MockOrder {
  const now = new Date();
  const items = overrides?.items || [
    {
      productId: generateUUID(),
      quantity: 2,
      price: 29.99,
      subtotal: 59.98,
    },
    {
      productId: generateUUID(),
      quantity: 1,
      price: 149.99,
      subtotal: 149.99,
    },
  ];

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: generateUUID(),
    userId: generateUUID(),
    items,
    total,
    status: 'PENDING',
    shippingAddress: createMockAddress(),
    billingAddress: createMockAddress(),
    paymentMethod: 'credit_card',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Create a mock address
 * @param overrides - Properties to override
 * @returns Mock address object
 */
export function createMockAddress(overrides?: Partial<MockAddress>): MockAddress {
  return {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'US',
    postalCode: '10001',
    ...overrides,
  };
}

/**
 * Create multiple mock users
 * @param count - Number of users to create
 * @param overrides - Properties to override for all users
 * @returns Array of mock users
 */
export function createMockUsers(count: number, overrides?: Partial<MockUser>): MockUser[] {
  const users: MockUser[] = [];
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    users.push(createMockUser({
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      ...overrides,
    }));
  }

  return users;
}

/**
 * Create multiple mock products
 * @param count - Number of products to create
 * @param overrides - Properties to override for all products
 * @returns Array of mock products
 */
export function createMockProducts(count: number, overrides?: Partial<MockProduct>): MockProduct[] {
  const products: MockProduct[] = [];
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
  const adjectives = ['Premium', 'Deluxe', 'Professional', 'Essential', 'Ultimate', 'Classic'];
  const nouns = ['Widget', 'Gadget', 'Device', 'Tool', 'Instrument', 'Accessory'];

  for (let i = 0; i < count; i++) {
    const adjective = adjectives[i % adjectives.length];
    const noun = nouns[i % nouns.length];
    const category = categories[i % categories.length];

    products.push(createMockProduct({
      name: `${adjective} ${noun} ${i + 1}`,
      category,
      price: Math.floor(Math.random() * 500) + 10,
      stock: Math.floor(Math.random() * 100) + 1,
      ...overrides,
    }));
  }

  return products;
}

/**
 * Create a mock API response
 * @param data - Response data
 * @param options - Response options
 * @returns Mock API response object
 */
export interface MockApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
  timestamp: string;
}

export function createMockApiResponse<T>(
  data?: T,
  options?: {
    success?: boolean;
    error?: string;
    message?: string;
    statusCode?: number;
  }
): MockApiResponse<T> {
  const { success = true, error, message, statusCode = 200 } = options || {};

  return {
    success,
    data: success ? data : undefined,
    error: !success ? error || 'An error occurred' : undefined,
    message: message || (success ? 'Request successful' : 'Request failed'),
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create mock authentication tokens
 * @returns Mock JWT tokens
 */
export function createMockTokens() {
  return {
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify({
      sub: generateUUID(),
      email: 'user@example.com',
      role: 'USER',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    })).toString('base64')}.${randomString(32)}`,
    refreshToken: randomString(64),
  };
}