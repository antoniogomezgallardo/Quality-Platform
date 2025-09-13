# Quality Platform Testing Guide

## 🎯 Testing Philosophy

The Quality Platform implements a comprehensive testing strategy following the test pyramid methodology:

- **70% Unit Tests**: Fast, focused tests for individual components and functions
- **20% Integration Tests**: API endpoint testing with database integration
- **10% End-to-End Tests**: Full user journey testing across the entire application

## 🏗️ Testing Architecture

### Current Testing Infrastructure

```
testing/
├── 🧪 Unit Testing (Jest)
│   ├── API modules (apps/api/src/**/*.spec.ts)
│   ├── Web components (web/src/**/*.test.tsx)
│   ├── Utilities and services
│   └── Coverage reporting (70% minimum)
│
├── 🔌 Integration Testing (Supertest)
│   ├── API endpoints testing
│   ├── Database integration
│   ├── Authentication flows
│   └── Business logic validation
│
├── 🎭 End-to-End Testing (Playwright)
│   ├── User journey testing
│   ├── Cross-browser testing
│   ├── Visual regression testing
│   └── Performance testing
│
└── 📋 Contract Testing
    ├── API schema validation
    ├── Backward compatibility
    └── Breaking change detection
```

## 🛠️ Testing Framework Setup

### Jest Configuration (Unit Tests)

**Location**: `web/jest.config.ts`, API uses default Jest config

```typescript
// web/jest.config.ts
export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Playwright Configuration (E2E Tests)

**Location**: `web-e2e/playwright.config.ts`

```typescript
// Key features:
// - Cross-browser testing (Chrome, Firefox, Safari, Edge)
// - Automatic server startup and teardown
// - Video recording on test failure
// - Screenshot comparison
// - Mobile device emulation
```

### Test Database Setup

```bash
# Test database isolation
DATABASE_URL_TEST="file:./test.db"

# Database setup for tests
npx prisma migrate deploy --schema=./prisma/schema.prisma
npx prisma db seed
```

## 📝 Writing Tests

### Unit Tests (Jest)

#### API Service Tests
```typescript
// apps/api/src/products/products.service.spec.ts
describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      // Given
      const createProductDto = {
        name: 'Test Product',
        price: 99.99,
        category: 'Electronics',
        description: 'Test description',
        stockQuantity: 100,
      };

      const expectedProduct = { id: 1, ...createProductDto };
      jest.spyOn(prismaService.product, 'create').mockResolvedValue(expectedProduct);

      // When
      const result = await service.create(createProductDto);

      // Then
      expect(result).toEqual(expectedProduct);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: createProductDto,
      });
    });
  });
});
```

#### React Component Tests
```typescript
// web/src/components/products/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    category: 'Electronics',
    description: 'Test description',
    stockQuantity: 10,
    isActive: true,
  };

  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    mockOnAddToCart.mockClear();
  });

  it('should render product information correctly', () => {
    // Given
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    // Then
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('should call onAddToCart when add to cart button is clicked', () => {
    // Given
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

    // When
    fireEvent.click(addToCartButton);

    // Then
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### Integration Tests (Supertest)

```typescript
// apps/api-e2e/src/api/products.spec.ts
describe('Products API (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Setup app with same configuration as main.ts
    setupApp(app);
    await app.init();

    // Create test user and get JWT token
    const authResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
        role: 'ADMIN',
      });

    jwtToken = authResponse.body.access_token;
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      // Given
      const expectedProducts = await prismaService.product.findMany({
        take: 10,
        skip: 0,
      });

      // When
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .query({ page: 1, limit: 10 })
        .expect(200);

      // Then
      expect(response.body.data).toHaveLength(expectedProducts.length);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product with valid data', async () => {
      // Given
      const createProductDto = {
        name: 'Integration Test Product',
        price: 199.99,
        category: 'Testing',
        description: 'Product created during integration test',
        stockQuantity: 50,
      };

      // When
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createProductDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject(createProductDto);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();

      // Verify product was actually created in database
      const createdProduct = await prismaService.product.findUnique({
        where: { id: response.body.id },
      });
      expect(createdProduct).toBeTruthy();
    });

    it('should return 401 when no authentication token provided', async () => {
      // When & Then
      await request(app.getHttpServer())
        .post('/api/products')
        .send({
          name: 'Unauthorized Product',
          price: 99.99,
          category: 'Test',
          description: 'Should not be created',
          stockQuantity: 10,
        })
        .expect(401);
    });
  });
});
```

### End-to-End Tests (Playwright)

```typescript
// web-e2e/src/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete user registration and login flow', async ({ page }) => {
    // Given
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass123!',
    };

    // Navigate to registration page
    await page.goto('/auth/register');

    // When - User registers
    await page.fill('[data-testid=email-input]', testUser.email);
    await page.fill('[data-testid=password-input]', testUser.password);
    await page.fill('[data-testid=confirm-password-input]', testUser.password);
    await page.click('[data-testid=register-button]');

    // Then - Registration should succeed and redirect to login
    await expect(page).toHaveURL('/auth/login');
    await expect(page.locator('[data-testid=success-message]')).toBeVisible();

    // When - User logs in with new credentials
    await page.fill('[data-testid=email-input]', testUser.email);
    await page.fill('[data-testid=password-input]', testUser.password);
    await page.click('[data-testid=login-button]');

    // Then - Should be redirected to homepage and authenticated
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid=user-menu]')).toBeVisible();
    await expect(page.locator('[data-testid=logout-button]')).toBeVisible();
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    // Given
    await page.goto('/auth/login');

    // When
    await page.fill('[data-testid=email-input]', 'invalid@example.com');
    await page.fill('[data-testid=password-input]', 'wrongpassword');
    await page.click('[data-testid=login-button]');

    // Then
    await expect(page.locator('[data-testid=error-message]')).toBeVisible();
    await expect(page.locator('[data-testid=error-message]')).toContainText('Invalid credentials');
    await expect(page).toHaveURL('/auth/login'); // Should stay on login page
  });
});

// web-e2e/src/shopping-flow.spec.ts
test.describe('Shopping Flow', () => {
  test('should complete full shopping journey', async ({ page, context }) => {
    // Given - User is logged in
    await context.addCookies([{
      name: 'auth-token',
      value: 'valid-jwt-token',
      domain: 'localhost',
      path: '/',
    }]);

    // Navigate to products page
    await page.goto('/products');

    // When - User searches for products
    await page.fill('[data-testid=search-input]', 'laptop');
    await page.press('[data-testid=search-input]', 'Enter');

    // Then - Should show search results
    await expect(page.locator('[data-testid=product-card]')).toHaveCountGreaterThan(0);

    // When - User adds product to cart
    await page.click('[data-testid=product-card]:first-child [data-testid=add-to-cart-button]');

    // Then - Cart badge should update
    await expect(page.locator('[data-testid=cart-badge]')).toHaveText('1');

    // When - User opens cart
    await page.click('[data-testid=cart-button]');

    // Then - Cart drawer should open with product
    await expect(page.locator('[data-testid=cart-drawer]')).toBeVisible();
    await expect(page.locator('[data-testid=cart-item]')).toHaveCount(1);

    // When - User proceeds to checkout
    await page.click('[data-testid=checkout-button]');

    // Then - Should navigate to checkout page
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator('[data-testid=order-summary]')).toBeVisible();
  });
});
```

## 🔧 Test Data Management

### Test Factories

```typescript
// tests/factories/product.factory.ts
export class ProductFactory {
  static create(overrides: Partial<Product> = {}): Product {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      stockQuantity: faker.number.int({ min: 0, max: 100 }),
      isActive: true,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<Product> = {}): Product[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// tests/factories/user.factory.ts
export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'USER',
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides,
    };
  }

  static admin(overrides: Partial<User> = {}): User {
    return this.create({ role: 'ADMIN', ...overrides });
  }
}
```

### Database Seeding for Tests

```typescript
// tests/setup/seed-test-data.ts
export async function seedTestData(prisma: PrismaService) {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const adminUser = await prisma.user.create({
    data: UserFactory.admin({
      email: 'admin@test.com',
      password: await bcrypt.hash('AdminPass123!', 12),
    }),
  });

  const regularUser = await prisma.user.create({
    data: UserFactory.create({
      email: 'user@test.com',
      password: await bcrypt.hash('UserPass123!', 12),
    }),
  });

  // Create test products
  const products = await Promise.all(
    ProductFactory.createMany(20).map(product =>
      prisma.product.create({ data: product })
    )
  );

  return { adminUser, regularUser, products };
}
```

## 🎯 Testing Commands

### Running Tests

```bash
# Unit Tests
pnpm test:unit                 # Run all unit tests
pnpm test:unit --watch         # Run in watch mode
pnpm test:unit --coverage      # Run with coverage report
pnpm test:unit ProductService  # Run specific test suite

# Integration Tests
pnpm test:integration         # Run API integration tests
pnpm test:integration --verbose # Run with detailed output

# End-to-End Tests
pnpm test:e2e                 # Run all E2E tests
pnpm test:e2e --headed        # Run with visible browser
pnpm test:e2e --debug         # Run in debug mode
pnpm test:e2e auth-flow       # Run specific test file

# All Tests
pnpm test                     # Run entire test suite
pnpm test:ci                  # Run tests in CI mode (no watch, with coverage)

# Quality Metrics
node scripts/quality-metrics.js  # Generate quality report including test metrics
```

### Coverage Reports

```bash
# Generate coverage report
pnpm test:unit --coverage

# Coverage files location:
# - coverage/lcov-report/index.html (HTML report)
# - coverage/lcov.info (LCOV format)
# - coverage/clover.xml (Clover format)
```

## 📊 Quality Metrics Integration

### Coverage Thresholds

```javascript
// Minimum coverage requirements (enforced in CI/CD)
{
  "branches": 70,
  "functions": 70,
  "lines": 70,
  "statements": 70
}
```

### Quality Gates

- **Unit Test Coverage**: Minimum 70% across all metrics
- **Integration Test Success**: All API endpoints must pass
- **E2E Test Success**: Critical user journeys must pass
- **Performance Tests**: Page load times under 3 seconds
- **Security Tests**: No high/critical vulnerabilities

## 🐛 Debugging Tests

### Jest Debugging

```bash
# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand --testNamePattern="should create product"

# VS Code debugging configuration
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Playwright Debugging

```bash
# Debug with visible browser
pnpm test:e2e --debug --headed

# Trace viewer for failed tests
npx playwright show-trace test-results/auth-flow-should-login/trace.zip
```

## 🔄 Continuous Integration

### GitHub Actions Integration

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:unit --coverage
      - run: pnpm test:integration
      - run: pnpm test:e2e

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## 📋 Testing Best Practices

### General Principles
- **AAA Pattern**: Arrange, Act, Assert structure
- **Descriptive Names**: Test names should describe the scenario
- **Independent Tests**: Each test should be able to run in isolation
- **Fast Feedback**: Unit tests should run quickly (<1s each)
- **Realistic Data**: Use factories instead of hardcoded test data

### Test Organization
- **Group Related Tests**: Use `describe` blocks effectively
- **Setup and Teardown**: Use `beforeEach`/`afterEach` for test isolation
- **Shared Test Utilities**: Extract common test logic into utilities
- **Test Documentation**: Include examples and edge cases

### API Testing
- **Test All HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Test Authentication**: Both authenticated and unauthenticated scenarios
- **Test Validation**: Invalid input scenarios and error responses
- **Test Business Logic**: Verify business rules are enforced

### Frontend Testing
- **User-Centric Tests**: Test what users see and interact with
- **Accessibility Testing**: Include keyboard navigation and screen readers
- **Loading States**: Test loading, error, and empty states
- **Mobile Responsiveness**: Test on different screen sizes

## 🎯 Quality Goals

Our testing strategy aims to achieve:

- **80% Bug Prevention**: Catch issues before production
- **90% Feature Confidence**: Ensure new features work as expected
- **95% Regression Protection**: Prevent breaking existing functionality
- **100% Critical Path Coverage**: All business-critical flows tested

---

*This testing guide is continuously updated as we expand our testing capabilities and learn from our quality engineering practices.*