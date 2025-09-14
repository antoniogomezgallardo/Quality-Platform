# Testing Guide

This guide provides comprehensive testing strategies, setup instructions, and best practices for the Quality Platform.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Pyramid](#test-pyramid)
- [Framework Setup](#framework-setup)
- [Unit Testing (Jest)](#unit-testing-jest)
- [Integration Testing (Supertest)](#integration-testing-supertest)
- [End-to-End Testing (Playwright)](#end-to-end-testing-playwright)
- [Contract Testing](#contract-testing)
- [Testing Best Practices](#testing-best-practices)
- [Running Tests](#running-tests)
- [Coverage Requirements](#coverage-requirements)
- [CI/CD Integration](#cicd-integration)

## Testing Philosophy

The Quality Platform follows these core testing principles:

### Test-Driven Development (TDD)
- Write tests before implementation (Red-Green-Refactor cycle)
- Use tests as design documentation
- Ensure comprehensive coverage of business logic

### Behavior-Driven Development (BDD)
- Structure tests using Given-When-Then format
- Focus on business behavior over technical implementation
- Use descriptive test names that explain business value

### Quality Gates
- All code must pass tests before merging
- Minimum coverage thresholds enforced
- Automated testing in CI/CD pipeline

## Test Pyramid

The Quality Platform implements a balanced test pyramid:

```
    /\     10% E2E Tests
   /  \    (Playwright - Cross-browser, User workflows)
  /____\
 /      \  20% Integration Tests
/        \ (Supertest - API endpoints, Database integration)
/__________\
   70% Unit Tests
   (Jest - Business logic, Components, Services)
```

### Unit Tests (70%)
- **Purpose**: Test individual components, functions, and business logic
- **Framework**: Jest with TypeScript support
- **Scope**: Fast, isolated, focused on single units of code
- **Target**: 70% of total test suite

### Integration Tests (20%)
- **Purpose**: Test API endpoints, database interactions, and service integration
- **Framework**: Supertest with Jest
- **Scope**: Test component interaction and data flow
- **Target**: 20% of total test suite

### End-to-End Tests (10%)
- **Purpose**: Test complete user workflows across the entire application
- **Framework**: Playwright
- **Scope**: Full browser automation, user journey validation
- **Target**: 10% of total test suite

## Framework Setup

### Prerequisites

```bash
# Install dependencies
pnpm install

# Set up test database
cp .env.example .env.test
# Configure DATABASE_URL for test environment
```

### Test Environment Configuration

```bash
# .env.test
DATABASE_URL="file:./test.db"
JWT_SECRET="test-secret"
NODE_ENV="test"
PORT=3333
```

## Unit Testing (Jest)

### Configuration

Jest is configured with TypeScript support and comprehensive coverage reporting:

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps', '<rootDir>/libs'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx}',
    '!apps/**/*.d.ts',
    '!apps/**/*.spec.ts',
    '!apps/**/main.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Unit Test Examples

#### Service Testing
```typescript
// apps/api/src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            }
          }
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      // Given
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 }
      ];
      jest.spyOn(prisma.product, 'findMany').mockResolvedValue(mockProducts);

      // When
      const result = await service.findAll({ page: 1, limit: 10 });

      // Then
      expect(result.data).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10
      });
    });
  });
});
```

#### Component Testing (React)
```typescript
// apps/web/src/components/products/ProductCard.spec.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'A test product',
    imageUrl: 'https://example.com/image.jpg'
  };

  it('should display product information correctly', () => {
    // Given & When
    render(<ProductCard product={mockProduct} />);

    // Then
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('A test product')).toBeInTheDocument();
  });

  it('should handle add to cart action', async () => {
    // Given
    const mockOnAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    // When
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(addButton);

    // Then
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

## Integration Testing (Supertest)

### API Integration Tests

```typescript
// apps/api-e2e/src/products.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Products API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();

    // Get auth token for protected routes
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });

    authToken = loginResponse.body.access_token;
  });

  beforeEach(async () => {
    // Clean database
    await prisma.product.deleteMany();
  });

  describe('GET /products', () => {
    it('should return paginated products', async () => {
      // Given
      await prisma.product.createMany({
        data: [
          { name: 'Product 1', price: 100, description: 'Desc 1' },
          { name: 'Product 2', price: 200, description: 'Desc 2' }
        ]
      });

      // When & Then
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(2);
    });
  });

  describe('POST /products', () => {
    it('should create a new product when authenticated as admin', async () => {
      // Given
      const newProduct = {
        name: 'New Product',
        price: 150,
        description: 'New product description',
        category: 'electronics'
      };

      // When & Then
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);

      // Verify in database
      const created = await prisma.product.findUnique({
        where: { id: response.body.id }
      });
      expect(created).toBeTruthy();
    });

    it('should reject unauthorized requests', async () => {
      // Given
      const newProduct = {
        name: 'Unauthorized Product',
        price: 100,
        description: 'Should not be created'
      };

      // When & Then
      await request(app.getHttpServer())
        .post('/products')
        .send(newProduct)
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Database Integration Tests

```typescript
// apps/api/src/orders/orders.integration.spec.ts
describe('Orders Integration', () => {
  it('should create order and update stock atomically', async () => {
    // Given
    const product = await prisma.product.create({
      data: { name: 'Test Product', price: 100, stock: 10 }
    });

    const orderData = {
      items: [
        { productId: product.id, quantity: 5, price: product.price }
      ]
    };

    // When
    const order = await ordersService.create(orderData, user.id);

    // Then
    expect(order.status).toBe('PENDING');
    expect(order.total).toBe(500);

    // Verify stock was updated
    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id }
    });
    expect(updatedProduct.stock).toBe(5);
  });
});
```

## End-to-End Testing (Playwright)

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './web-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm nx serve api',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm nx serve web',
      port: 4200,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

### E2E Test Examples

#### Authentication Flow
```typescript
// web-e2e/src/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to register, login, and logout', async ({ page }) => {
    // Given
    await page.goto('/');

    // When - Register
    await page.click('text=Sign Up');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.fill('[data-testid=confirmPassword]', 'password123');
    await page.click('[data-testid=submit]');

    // Then - Should be logged in
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('[data-testid=user-menu]')).toBeVisible();

    // When - Logout
    await page.click('[data-testid=user-menu]');
    await page.click('text=Logout');

    // Then - Should be logged out
    await expect(page.locator('text=Sign In')).toBeVisible();
  });
});
```

#### Shopping Flow
```typescript
// web-e2e/src/shopping-flow.spec.ts
test.describe('Shopping Flow', () => {
  test('should complete full shopping journey', async ({ page }) => {
    // Given - Logged in user
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-submit]');

    // When - Browse products
    await page.goto('/products');
    await expect(page.locator('[data-testid=product-grid]')).toBeVisible();

    // When - Add to cart
    const firstProduct = page.locator('[data-testid=product-card]').first();
    await firstProduct.locator('[data-testid=add-to-cart]').click();

    // Then - Cart should update
    await expect(page.locator('[data-testid=cart-badge]')).toHaveText('1');

    // When - View cart
    await page.click('[data-testid=cart-icon]');
    await expect(page.locator('[data-testid=cart-drawer]')).toBeVisible();

    // When - Proceed to checkout
    await page.click('[data-testid=checkout-button]');
    await expect(page.locator('[data-testid=checkout-form]')).toBeVisible();

    // When - Complete order
    await page.fill('[data-testid=shipping-address]', '123 Test St');
    await page.click('[data-testid=place-order]');

    // Then - Order should be created
    await expect(page.locator('text=Order Confirmation')).toBeVisible();
    await expect(page.locator('[data-testid=order-number]')).toBeVisible();
  });
});
```

## Contract Testing

### API Contract Validation

```typescript
// apps/api-e2e/src/contract-tests.spec.ts
import { validateApiContract } from '../utils/contract-validator';

describe('API Contract Tests', () => {
  test('should maintain backward compatibility', async () => {
    const endpoints = [
      { method: 'GET', path: '/products' },
      { method: 'POST', path: '/products' },
      { method: 'GET', path: '/orders' },
    ];

    for (const endpoint of endpoints) {
      const response = await request(app.getHttpServer())
        [endpoint.method.toLowerCase()](endpoint.path);

      const isValid = validateApiContract(endpoint, response);
      expect(isValid.valid).toBe(true);

      if (!isValid.valid) {
        console.error(`Contract violation in ${endpoint.method} ${endpoint.path}:`, isValid.errors);
      }
    }
  });
});
```

## Testing Best Practices

### Test Structure

#### AAA Pattern (Arrange-Act-Assert)
```typescript
test('should calculate order total correctly', () => {
  // Arrange
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ];

  // Act
  const total = calculateOrderTotal(items);

  // Assert
  expect(total).toBe(250);
});
```

#### Given-When-Then (BDD Style)
```typescript
test('should reject order when insufficient stock', async () => {
  // Given
  const product = await createTestProduct({ stock: 5 });
  const orderRequest = { productId: product.id, quantity: 10 };

  // When
  const result = ordersService.create(orderRequest);

  // Then
  await expect(result).rejects.toThrow('Insufficient stock');
});
```

### Test Data Management

#### Test Factories
```typescript
// tests/factories/product.factory.ts
export const createTestProduct = (overrides = {}) => {
  return {
    name: 'Test Product',
    price: 99.99,
    description: 'Test description',
    stock: 10,
    category: 'electronics',
    ...overrides
  };
};

export const createTestUser = (overrides = {}) => {
  return {
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'USER',
    ...overrides
  };
};
```

#### Database Seeding for Tests
```typescript
// tests/utils/test-db.ts
export class TestDatabase {
  static async seed() {
    // Create test admin user
    await prisma.user.create({
      data: createTestUser({
        email: 'admin@test.com',
        role: 'ADMIN'
      })
    });

    // Create test products
    const products = await prisma.product.createMany({
      data: [
        createTestProduct({ name: 'Product 1', category: 'electronics' }),
        createTestProduct({ name: 'Product 2', category: 'clothing' }),
      ]
    });

    return { products };
  }

  static async cleanup() {
    const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      }
    }
  }
}
```

### Mocking Strategies

#### Service Mocking
```typescript
const mockPrismaService = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
};

const mockEmailService = {
  sendOrderConfirmation: jest.fn(),
  sendPasswordReset: jest.fn(),
};
```

#### HTTP Mocking for External APIs
```typescript
import nock from 'nock';

describe('Payment Integration', () => {
  beforeEach(() => {
    nock('https://api.stripe.com')
      .post('/v1/charges')
      .reply(200, { id: 'ch_test_123', status: 'succeeded' });
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
```

## Running Tests

### Command Reference

```bash
# Run all tests
pnpm test

# Unit tests only
pnpm test:unit

# Integration tests only
pnpm test:integration

# E2E tests only
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test products.spec.ts

# Run tests matching pattern
pnpm test --testNamePattern="should create product"
```

### Test Scripts Configuration

```json
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:unit": "jest --testMatch='**/*.spec.ts'",
    "test:integration": "jest --testMatch='**/*.integration.spec.ts'",
    "test:e2e": "playwright test",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "jest --runInBand --no-cache"
  }
}
```

## Coverage Requirements

### Minimum Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  },
  './apps/api/src/': {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Coverage Analysis

- **Statements**: Percentage of executable statements that have been executed
- **Branches**: Percentage of if/else and switch/case branches that have been executed
- **Functions**: Percentage of functions that have been called
- **Lines**: Percentage of executable lines that have been covered

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run unit tests
        run: pnpm test:unit
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Run integration tests
        run: pnpm test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: pnpm test:e2e
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Quality Gates

```yaml
# Require all tests to pass
- name: Quality Gate - Tests
  run: pnpm test

# Require minimum coverage
- name: Quality Gate - Coverage
  run: |
    pnpm test:coverage
    if [ $(cat coverage/coverage-summary.json | jq '.total.lines.pct') -lt 70 ]; then
      echo "Coverage below 70%"
      exit 1
    fi
```

## Troubleshooting

### Common Issues

#### Tests Failing Due to Database State
```bash
# Reset test database
npm run db:reset:test

# Clear Jest cache
npx jest --clearCache
```

#### Port Conflicts in E2E Tests
```bash
# Kill processes on test ports
pnpm dev:stop
```

#### Playwright Browser Issues
```bash
# Reinstall browsers
npx playwright install

# Run with headed browsers for debugging
npx playwright test --headed
```

### Debugging Tests

#### Unit Test Debugging
```bash
# Debug specific test
npx jest --runInBand --no-cache products.spec.ts

# Debug with VS Code
# Add breakpoint and use Jest extension
```

#### E2E Test Debugging
```bash
# Run with UI mode
npx playwright test --ui

# Generate and view trace
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Performance Optimization

#### Parallel Test Execution
```javascript
// jest.config.js
module.exports = {
  maxWorkers: '50%', // Use 50% of available CPU cores
  testTimeout: 30000, // 30 second timeout
};
```

#### Test Database Optimization
```typescript
// Use in-memory database for unit tests
const testConfig = {
  DATABASE_URL: 'file::memory:?cache=shared'
};
```

---

## Next Steps

1. **Set up testing framework**: Configure Jest, Supertest, and Playwright
2. **Write initial tests**: Start with critical business logic unit tests
3. **Add integration tests**: Test API endpoints and database interactions
4. **Implement E2E tests**: Cover main user workflows
5. **Set up CI/CD**: Automate testing in GitHub Actions
6. **Monitor coverage**: Ensure quality thresholds are met
7. **Train team**: Share testing best practices and patterns

For questions or support with testing implementation, refer to the [Setup & Troubleshooting Guide](./SETUP_AND_TROUBLESHOOTING.md) or create an issue in the repository.