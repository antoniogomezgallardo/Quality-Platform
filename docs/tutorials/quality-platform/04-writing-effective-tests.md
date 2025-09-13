# Quality Platform Tutorial - Part 4: Writing Effective Tests

This tutorial teaches you how to write comprehensive, maintainable, and effective tests using Test-Driven Development (TDD) principles.

## Table of Contents

1. [Test-Driven Development (TDD)](#test-driven-development-tdd)
2. [Writing Unit Tests](#writing-unit-tests)
3. [Integration Testing](#integration-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Contract Testing](#contract-testing)
6. [Test Patterns & Best Practices](#test-patterns--best-practices)
7. [Mocking & Test Doubles](#mocking--test-doubles)
8. [Data Management in Tests](#data-management-in-tests)

## Test-Driven Development (TDD)

### The TDD Cycle: Red-Green-Refactor

```
🔴 RED    →    🟢 GREEN    →    🔵 REFACTOR
Write failing   Make it pass    Improve design
    test            test            & code
     ↑                               ↓
     └─────────────────────────────────┘
                 Repeat cycle
```

### TDD Benefits

- **Better Design**: Tests force you to think about interfaces first
- **Higher Coverage**: Every feature starts with a test
- **Faster Feedback**: Immediate validation of functionality
- **Regression Safety**: Changes can't break existing features
- **Living Documentation**: Tests document expected behavior

### Practical TDD Example

Let's implement a `PriceCalculator` service using TDD:

**Step 1: Write Failing Test (RED)**
```typescript
// apps/api/src/pricing/price-calculator.service.spec.ts
describe('PriceCalculatorService', () => {
  let service: PriceCalculatorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PriceCalculatorService],
    }).compile();

    service = module.get<PriceCalculatorService>(PriceCalculatorService);
  });

  describe('calculateTotal', () => {
    it('should calculate total for single item', () => {
      // Given
      const items = [
        { price: 100, quantity: 2 }
      ];

      // When
      const total = service.calculateTotal(items);

      // Then
      expect(total).toBe(200);
    });
  });
});
```

**Step 2: Make Test Pass (GREEN)**
```typescript
// apps/api/src/pricing/price-calculator.service.ts
import { Injectable } from '@nestjs/common';

export interface CartItem {
  price: number;
  quantity: number;
}

@Injectable()
export class PriceCalculatorService {
  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}
```

**Step 3: Refactor (BLUE)**
```typescript
// Refactor for clarity and edge cases
@Injectable()
export class PriceCalculatorService {
  calculateTotal(items: CartItem[]): number {
    if (!items || items.length === 0) {
      return 0;
    }

    return items.reduce((total, item) => {
      this.validateItem(item);
      return total + (item.price * item.quantity);
    }, 0);
  }

  private validateItem(item: CartItem): void {
    if (item.price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (item.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
  }
}
```

**Step 4: Add More Tests**
```typescript
describe('calculateTotal', () => {
  it('should calculate total for single item', () => {
    const items = [{ price: 100, quantity: 2 }];
    expect(service.calculateTotal(items)).toBe(200);
  });

  it('should calculate total for multiple items', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 3 }
    ];
    expect(service.calculateTotal(items)).toBe(350);
  });

  it('should return 0 for empty cart', () => {
    expect(service.calculateTotal([])).toBe(0);
  });

  it('should throw error for negative price', () => {
    const items = [{ price: -10, quantity: 1 }];
    expect(() => service.calculateTotal(items))
      .toThrow('Price cannot be negative');
  });

  it('should throw error for negative quantity', () => {
    const items = [{ price: 10, quantity: -1 }];
    expect(() => service.calculateTotal(items))
      .toThrow('Quantity cannot be negative');
  });
});
```

## Writing Unit Tests

### Unit Test Structure

**Anatomy of a Good Unit Test:**
```typescript
describe('ComponentUnderTest', () => {  // Test Suite
  let component: ComponentUnderTest;
  let dependencies: MockedDependencies;

  beforeEach(() => {
    // Setup - Run before each test
  });

  afterEach(() => {
    // Teardown - Run after each test
  });

  describe('methodBeingTested', () => {  // Nested suite
    it('should behave correctly in normal case', () => {
      // Given - Arrange test data
      const input = createValidInput();

      // When - Act on the component
      const result = component.methodBeingTested(input);

      // Then - Assert the outcome
      expect(result).toEqual(expectedOutput);
    });

    it('should handle edge case appropriately', () => {
      // Test edge cases, errors, boundaries
    });
  });
});
```

### Real-World Example: User Service

```typescript
// apps/api/src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt module
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
    };

    it('should create user with hashed password', async () => {
      // Given
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prismaService.user.findFirst.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
      });

      // When
      const result = await service.create(createUserDto);

      // Then
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: 'New User',
          email: 'new@example.com',
          password: hashedPassword,
          role: 'USER',
        },
      });
      expect(result.password).toBeUndefined(); // Password should be removed
      expect(result.email).toBe('new@example.com');
    });

    it('should throw ConflictException if email already exists', async () => {
      // Given
      prismaService.user.findFirst.mockResolvedValue(mockUser);

      // When & Then
      await expect(service.create(createUserDto))
        .rejects
        .toThrow(ConflictException);

      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw error if password hashing fails', async () => {
      // Given
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash failed'));
      prismaService.user.findFirst.mockResolvedValue(null);

      // When & Then
      await expect(service.create(createUserDto))
        .rejects
        .toThrow('Hash failed');
    });
  });

  describe('findById', () => {
    it('should return user without password', async () => {
      // Given
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      // When
      const result = await service.findById(1);

      // Then
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result.password).toBeUndefined();
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      // Given
      prismaService.user.findUnique.mockResolvedValue(null);

      // When & Then
      await expect(service.findById(999))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('validatePassword', () => {
    it('should return true for correct password', async () => {
      // Given
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // When
      const result = await service.validatePassword('plainPassword', 'hashedPassword');

      // Then
      expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      // Given
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // When
      const result = await service.validatePassword('wrongPassword', 'hashedPassword');

      // Then
      expect(result).toBe(false);
    });
  });
});
```

### Unit Test Best Practices

**1. Test Naming Convention:**
```typescript
// ✅ Good: Descriptive and specific
it('should throw ConflictException when email already exists')
it('should return user without password field')
it('should hash password with bcrypt before storing')

// ❌ Bad: Vague or generic
it('should work')
it('should test create function')
it('should return something')
```

**2. Test Data Management:**
```typescript
// ✅ Good: Use factories or builders
const createValidUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
  ...overrides,
});

// Usage
const validUser = createValidUser();
const userWithBadEmail = createValidUser({ email: 'invalid-email' });

// ❌ Bad: Hardcoded test data everywhere
it('test 1', () => {
  const user = { name: 'John', email: 'john@test.com', password: 'pass' };
});

it('test 2', () => {
  const user = { name: 'John', email: 'john@test.com', password: 'pass' };
});
```

**3. Assertion Patterns:**
```typescript
// ✅ Good: Specific assertions
expect(user.id).toBe(1);
expect(user.email).toBe('test@example.com');
expect(user.password).toBeUndefined();
expect(mockService.create).toHaveBeenCalledWith(expectedData);

// ✅ Good: Test behavior, not implementation
expect(result).toHaveProperty('token');
expect(result.user).not.toHaveProperty('password');

// ❌ Bad: Over-specific implementation testing
expect(mockService.create).toHaveBeenCalledTimes(1);
expect(mockService.findFirst).toHaveBeenCalledBefore(mockService.create);
```

## Integration Testing

### API Integration Tests

Integration tests verify that your API endpoints work correctly with real database operations:

```typescript
// tests/integration/products.e2e.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../apps/api/src/app/app.module';
import { PrismaService } from '../../apps/api/src/prisma/prisma.service';

describe('Products API (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let regularUserToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    // Setup test users and tokens
    await setupTestData();
  });

  beforeEach(async () => {
    // Clean up products before each test
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await cleanupTestData();
    await app.close();
  });

  async function setupTestData() {
    // Create admin user
    const adminResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'Password123!',
        role: 'ADMIN',
      });

    adminToken = adminResponse.body.access_token;

    // Create regular user
    const userResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'Password123!',
      });

    regularUserToken = userResponse.body.access_token;
  }

  async function cleanupTestData() {
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
  }

  describe('POST /api/products', () => {
    const validProductData = {
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      category: 'ELECTRONICS',
      imageUrl: 'https://example.com/image.jpg',
      stock: 10,
    };

    it('should create product with admin token', async () => {
      // When
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validProductData)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        name: validProductData.name,
        price: validProductData.price,
        category: validProductData.category,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');

      // Verify in database
      const productInDb = await prisma.product.findUnique({
        where: { id: response.body.id },
      });
      expect(productInDb).toBeTruthy();
      expect(productInDb.name).toBe(validProductData.name);
    });

    it('should return 403 for regular user', async () => {
      // When
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(validProductData)
        .expect(403);

      // Then
      expect(response.body).toMatchObject({
        statusCode: 403,
        error: 'Forbidden',
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      // When
      await request(app.getHttpServer())
        .post('/api/products')
        .send(validProductData)
        .expect(401);
    });

    it('should validate required fields', async () => {
      // When
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({}) // Empty data
        .expect(400);

      // Then
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('name'),
          expect.stringContaining('price'),
          expect.stringContaining('category'),
        ])
      );
    });

    it('should validate price is positive', async () => {
      // When
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validProductData, price: -10 })
        .expect(400);

      // Then
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('price must be a positive number'),
        ])
      );
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create test products
      await prisma.product.createMany({
        data: [
          {
            name: 'Product 1',
            description: 'First product',
            price: 100,
            category: 'ELECTRONICS',
            stock: 5,
          },
          {
            name: 'Product 2',
            description: 'Second product',
            price: 200,
            category: 'CLOTHING',
            stock: 10,
          },
          {
            name: 'Product 3',
            description: 'Third product',
            price: 300,
            category: 'ELECTRONICS',
            stock: 15,
          },
        ],
      });
    });

    it('should return paginated products', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      // Then
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.products).toHaveLength(3);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
      });
    });

    it('should filter products by category', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .query({ category: 'ELECTRONICS' })
        .expect(200);

      // Then
      expect(response.body.products).toHaveLength(2);
      expect(response.body.products.every(p => p.category === 'ELECTRONICS')).toBe(true);
    });

    it('should support pagination', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .query({ page: 1, limit: 2 })
        .expect(200);

      // Then
      expect(response.body.products).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
      });
    });
  });

  describe('GET /api/products/:id', () => {
    let testProduct: any;

    beforeEach(async () => {
      testProduct = await prisma.product.create({
        data: {
          name: 'Single Test Product',
          description: 'For single product tests',
          price: 150,
          category: 'BOOKS',
          stock: 20,
        },
      });
    });

    it('should return single product by ID', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get(`/api/products/${testProduct.id}`)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: testProduct.id,
        name: 'Single Test Product',
        price: 150,
        category: 'BOOKS',
      });
    });

    it('should return 404 for non-existent product', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get('/api/products/999999')
        .expect(404);

      // Then
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Not Found',
      });
    });

    it('should return 400 for invalid ID format', async () => {
      // When
      await request(app.getHttpServer())
        .get('/api/products/invalid-id')
        .expect(400);
    });
  });
});
```

### Database Testing Patterns

**1. Test Database Isolation:**
```typescript
// Use separate test database
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'file:./test.db';

// Or use transactions for isolation
describe('UserService', () => {
  let transaction;

  beforeEach(async () => {
    transaction = await prisma.$begin();
  });

  afterEach(async () => {
    await transaction.$rollback();
  });

  it('should create user within transaction', async () => {
    // Test runs within transaction, rolled back after
    const user = await service.create(userData, transaction);
    expect(user).toBeDefined();
  });
});
```

**2. Test Data Builders:**
```typescript
// tests/helpers/test-data-builders.ts
export class ProductBuilder {
  private product: Partial<Product> = {
    name: 'Test Product',
    price: 100,
    category: 'ELECTRONICS',
    stock: 10,
  };

  withName(name: string): ProductBuilder {
    this.product.name = name;
    return this;
  }

  withPrice(price: number): ProductBuilder {
    this.product.price = price;
    return this;
  }

  withCategory(category: string): ProductBuilder {
    this.product.category = category;
    return this;
  }

  build(): CreateProductDto {
    return this.product as CreateProductDto;
  }

  async create(prisma: PrismaService): Promise<Product> {
    return prisma.product.create({ data: this.build() });
  }
}

// Usage in tests
const product = new ProductBuilder()
  .withName('Premium Headphones')
  .withPrice(299.99)
  .withCategory('ELECTRONICS')
  .build();
```

## End-to-End Testing

E2E tests validate complete user workflows using Playwright:

```typescript
// tests/e2e/shopping-cart.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('http://localhost:4200');

    // Register a test user
    await registerTestUser(page);
  });

  test('should add items to cart and checkout', async ({ page }) => {
    // Navigate to products
    await page.click('[data-testid="products-link"]');
    await expect(page).toHaveURL(/.*products/);

    // Add first product to cart
    await page.click('[data-testid="product-card"]:first-child [data-testid="add-to-cart"]');

    // Verify cart badge updates
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');

    // Add second product
    await page.click('[data-testid="product-card"]:nth-child(2) [data-testid="add-to-cart"]');
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('2');

    // Open cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();

    // Verify cart contents
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(2);

    // Update quantity
    await page.click('[data-testid="quantity-increase"]:first-child');
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('3');

    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL(/.*checkout/);

    // Fill checkout form
    await page.fill('[data-testid="shipping-name"]', 'John Doe');
    await page.fill('[data-testid="shipping-address"]', '123 Test Street');
    await page.fill('[data-testid="shipping-city"]', 'Test City');
    await page.fill('[data-testid="shipping-zip"]', '12345');

    // Select payment method
    await page.click('[data-testid="payment-credit-card"]');
    await page.fill('[data-testid="card-number"]', '4532015112830366');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    // Place order
    await page.click('[data-testid="place-order"]');

    // Verify success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toContainText(/ORDER-\d+/);

    // Verify cart is empty
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('0');
  });

  test('should persist cart across page reloads', async ({ page }) => {
    // Add item to cart
    await page.goto('http://localhost:4200/products');
    await page.click('[data-testid="product-card"]:first-child [data-testid="add-to-cart"]');

    // Reload page
    await page.reload();

    // Verify cart persists
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');
  });

  test('should handle out of stock items', async ({ page }) => {
    // Navigate to out of stock product (if any)
    await page.goto('http://localhost:4200/products/out-of-stock-item');

    // Verify add to cart is disabled
    await expect(page.locator('[data-testid="add-to-cart"]')).toBeDisabled();
    await expect(page.locator('[data-testid="out-of-stock-message"]')).toBeVisible();
  });

  async function registerTestUser(page: Page) {
    await page.click('[data-testid="register-link"]');
    await page.fill('[data-testid="register-name"]', 'Test User');
    await page.fill('[data-testid="register-email"]', `test-${Date.now()}@example.com`);
    await page.fill('[data-testid="register-password"]', 'Password123!');
    await page.click('[data-testid="register-submit"]');

    // Wait for successful registration
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  }
});
```

### E2E Testing Best Practices

**1. Page Object Model:**
```typescript
// tests/e2e/pages/product-page.ts
export class ProductPage {
  constructor(private page: Page) {}

  async goto(productId: string) {
    await this.page.goto(`http://localhost:4200/products/${productId}`);
  }

  async addToCart() {
    await this.page.click('[data-testid="add-to-cart"]');
  }

  async getProductName() {
    return this.page.textContent('[data-testid="product-name"]');
  }

  async getPrice() {
    return this.page.textContent('[data-testid="product-price"]');
  }

  async isOutOfStock() {
    return this.page.isVisible('[data-testid="out-of-stock-message"]');
  }
}

// Usage in tests
test('should display product details', async ({ page }) => {
  const productPage = new ProductPage(page);

  await productPage.goto('1');

  const name = await productPage.getProductName();
  const price = await productPage.getPrice();

  expect(name).toBe('Expected Product Name');
  expect(price).toContain('$');
});
```

**2. Test Data Management:**
```typescript
// tests/e2e/fixtures/test-data.ts
export class TestDataManager {
  private apiClient: ApiClient;

  constructor(baseUrl: string) {
    this.apiClient = new ApiClient(baseUrl);
  }

  async createTestUser(userData: Partial<User> = {}): Promise<User> {
    const defaultUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!',
      ...userData,
    };

    return this.apiClient.post('/auth/register', defaultUser);
  }

  async createTestProduct(productData: Partial<Product> = {}): Promise<Product> {
    const defaultProduct = {
      name: 'Test Product',
      price: 99.99,
      category: 'ELECTRONICS',
      stock: 10,
      ...productData,
    };

    return this.apiClient.post('/products', defaultProduct);
  }

  async cleanup() {
    // Clean up test data
    await this.apiClient.delete('/test-data/cleanup');
  }
}
```

## Contract Testing

Contract tests ensure API compatibility:

```typescript
// tests/contract/api-contract.spec.ts
import { Test } from '@nestjs/testing';
import { AppModule } from '../../apps/api/src/app/app.module';
import * as request from 'supertest';

describe('API Contract Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Product API Contract', () => {
    it('GET /api/products should return expected schema', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(200);

      // Validate response structure
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('pagination');

      // Validate pagination schema
      const pagination = response.body.pagination;
      expect(pagination).toMatchObject({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      });

      // Validate product schema (if products exist)
      if (response.body.products.length > 0) {
        const product = response.body.products[0];
        expect(product).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          category: expect.any(String),
          imageUrl: expect.any(String),
          stock: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });

        // Validate date format
        expect(new Date(product.createdAt)).toBeInstanceOf(Date);
        expect(new Date(product.updatedAt)).toBeInstanceOf(Date);
      }
    });

    it('POST /api/products should accept expected schema', async () => {
      const adminToken = await getAdminToken(app);

      const validProduct = {
        name: 'Contract Test Product',
        description: 'Testing API contract',
        price: 199.99,
        category: 'ELECTRONICS',
        imageUrl: 'https://example.com/image.jpg',
        stock: 5,
      };

      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validProduct)
        .expect(201);

      // Verify response matches expected schema
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: validProduct.name,
        description: validProduct.description,
        price: validProduct.price,
        category: validProduct.category,
        imageUrl: validProduct.imageUrl,
        stock: validProduct.stock,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return consistent error format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send({}) // Invalid data
        .expect(400);

      // Verify error response schema
      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(Array),
        error: expect.any(String),
      });

      // Verify error messages are descriptive
      expect(response.body.message.length).toBeGreaterThan(0);
      response.body.message.forEach((msg: string) => {
        expect(typeof msg).toBe('string');
        expect(msg.length).toBeGreaterThan(0);
      });
    });
  });

  async function getAdminToken(app: INestApplication): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: `admin-${Date.now()}@example.com`,
        password: 'Password123!',
        role: 'ADMIN',
      });

    return response.body.access_token;
  }
});
```

## Test Patterns & Best Practices

### The AAA Pattern

**Arrange-Act-Assert** structure:

```typescript
it('should calculate discount for VIP customers', () => {
  // Arrange - Set up test data and conditions
  const customer = createCustomer({ type: 'VIP', purchaseHistory: 5000 });
  const order = createOrder({ total: 1000, items: [{ price: 500 }, { price: 500 }] });
  const discountService = new DiscountService();

  // Act - Execute the functionality being tested
  const discount = discountService.calculateDiscount(customer, order);

  // Assert - Verify the expected outcome
  expect(discount.percentage).toBe(10);
  expect(discount.amount).toBe(100);
  expect(discount.reason).toBe('VIP_CUSTOMER_DISCOUNT');
});
```

### Test Categories & Naming

```typescript
// ✅ Good: Organized by feature/behavior
describe('DiscountService', () => {
  describe('calculateDiscount', () => {
    describe('when customer is VIP', () => {
      it('should apply 10% discount for orders over $500');
      it('should apply 15% discount for orders over $1000');
      it('should cap discount at $200 maximum');
    });

    describe('when customer is regular', () => {
      it('should apply 5% discount for orders over $1000');
      it('should not apply discount for orders under $1000');
    });

    describe('when order contains restricted items', () => {
      it('should exclude restricted items from discount calculation');
      it('should apply discount only to eligible items');
    });
  });
});
```

### Error Testing Patterns

```typescript
describe('error handling', () => {
  it('should throw ValidationError for invalid email format', async () => {
    // Test specific error type
    await expect(service.register({ email: 'invalid' }))
      .rejects
      .toThrow(ValidationError);
  });

  it('should throw error with descriptive message', async () => {
    // Test error message
    await expect(service.register({ email: 'invalid' }))
      .rejects
      .toThrow('Email format is invalid');
  });

  it('should handle database connection errors gracefully', async () => {
    // Mock database failure
    jest.spyOn(prisma, 'user').mockImplementation(() => {
      throw new Error('Database connection failed');
    });

    // Test graceful error handling
    await expect(service.findUser(1))
      .rejects
      .toThrow(ServiceUnavailableError);
  });
});
```

## Mocking & Test Doubles

### Types of Test Doubles

**1. Stubs** - Provide predefined responses:
```typescript
const userServiceStub = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Test User' }),
  create: jest.fn().mockResolvedValue({ id: 2, name: 'New User' }),
};
```

**2. Mocks** - Verify interactions:
```typescript
const emailServiceMock = {
  sendWelcomeEmail: jest.fn(),
  sendResetPassword: jest.fn(),
};

// Test interaction
await service.registerUser(userData);
expect(emailServiceMock.sendWelcomeEmail).toHaveBeenCalledWith(
  userData.email,
  expect.objectContaining({ name: userData.name })
);
```

**3. Spies** - Monitor real objects:
```typescript
const loggerSpy = jest.spyOn(console, 'log');

service.processOrder(order);

expect(loggerSpy).toHaveBeenCalledWith('Order processed:', order.id);

loggerSpy.mockRestore();
```

### Effective Mocking Strategies

**1. Mock External Dependencies:**
```typescript
// Mock HTTP client
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockAxios.post.mockClear();
  mockAxios.get.mockClear();
});

it('should call external API with correct data', async () => {
  // Given
  mockAxios.post.mockResolvedValue({ data: { success: true } });

  // When
  await service.processPayment(paymentData);

  // Then
  expect(mockAxios.post).toHaveBeenCalledWith(
    'https://payment.api/process',
    paymentData,
    expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': expect.any(String),
      }),
    })
  );
});
```

**2. Partial Mocking:**
```typescript
// Mock only specific methods
jest.mock('./user.service', () => ({
  ...jest.requireActual('./user.service'),
  sendNotification: jest.fn(),
}));
```

**3. Mock Implementation Based on Input:**
```typescript
const mockUserService = {
  findById: jest.fn().mockImplementation((id) => {
    if (id === 1) return Promise.resolve({ id: 1, name: 'Admin' });
    if (id === 2) return Promise.resolve({ id: 2, name: 'User' });
    return Promise.resolve(null);
  }),
};
```

## Data Management in Tests

### Test Database Strategies

**1. In-Memory Database:**
```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

// tests/setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file::memory:?cache=shared',
    },
  },
});

beforeAll(async () => {
  await prisma.$connect();
  // Run migrations
  await exec('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

**2. Transaction Rollback:**
```typescript
describe('UserService', () => {
  let transaction;

  beforeEach(async () => {
    transaction = await prisma.$begin();
  });

  afterEach(async () => {
    await transaction.$rollback();
  });

  it('should create user within transaction', async () => {
    const user = await service.create(userData, { tx: transaction });
    expect(user).toBeDefined();
    // Data will be rolled back after test
  });
});
```

### Test Data Factories

```typescript
// tests/factories/user.factory.ts
export class UserFactory {
  static build(overrides: Partial<User> = {}): CreateUserDto {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: 'Password123!',
      role: 'USER',
      ...overrides,
    };
  }

  static async create(
    prisma: PrismaService,
    overrides: Partial<User> = {}
  ): Promise<User> {
    const userData = this.build(overrides);
    return prisma.user.create({ data: userData });
  }

  static buildMany(count: number, overrides: Partial<User> = {}): CreateUserDto[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }
}

// Usage
const user = UserFactory.build({ email: 'specific@example.com' });
const createdUser = await UserFactory.create(prisma, { role: 'ADMIN' });
const users = UserFactory.buildMany(5, { role: 'USER' });
```

## Next Steps

You now know how to write comprehensive tests across all levels. In the next tutorial, you'll learn how to analyze and improve quality metrics.

👉 **[Part 5: Quality Metrics & Analysis →](./05-quality-metrics-analysis.md)**

In the next part, you'll learn:
- Deep dive into quality metrics interpretation
- Setting up quality gates and thresholds
- Creating custom quality reports
- Tracking quality improvements over time

---

**Previous**: [← Part 3: Understanding Test Results](./03-understanding-test-results.md) | **Next**: [Part 5: Quality Metrics & Analysis →](./05-quality-metrics-analysis.md)