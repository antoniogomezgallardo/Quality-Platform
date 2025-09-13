# Quality Platform Tutorial - Part 2: Basic Usage & Workflows

This tutorial covers the fundamental usage patterns and workflows you'll use daily with the Quality Platform.

## Table of Contents

1. [Development Workflow Overview](#development-workflow-overview)
2. [Using the Web Application](#using-the-web-application)
3. [API Development Patterns](#api-development-patterns)
4. [Testing Workflows](#testing-workflows)
5. [Quality Checks](#quality-checks)
6. [Database Operations](#database-operations)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

## Development Workflow Overview

The Quality Platform follows modern development practices with quality gates at every step:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Code      │───▶│    Test     │───▶│   Review    │───▶│   Deploy    │
│ Development │    │ Validation  │    │ & Approve   │    │ to Staging  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
 • Code changes      • Unit tests       • Code review      • Automated
 • Local testing     • Integration      • Quality gates    • deployment
 • Quality checks    • E2E testing      • Documentation    • Health checks
```

### Daily Development Loop

1. **Start Development Environment**
   ```bash
   # Quick start with our custom script
   node dev-start.js

   # Or individually
   pnpm nx serve api    # Terminal 1
   pnpm nx serve web    # Terminal 2
   ```

2. **Make Changes**
   - Edit code in your preferred editor
   - Follow existing patterns and conventions
   - Write tests for new functionality

3. **Validate Changes**
   ```bash
   # Run relevant tests
   pnpm test:unit
   pnpm test:integration

   # Check code quality
   pnpm nx lint api
   pnpm nx lint web

   # Generate quality report
   node scripts/quality-metrics.js
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add new feature with tests"
   git push origin feature/your-feature
   ```

## Using the Web Application

### Navigation & User Interface

The web application provides a modern, responsive interface:

#### Homepage (http://localhost:4200)
```
┌─────────────────────────────────────────────────────────────┐
│                    Quality Platform                          │
│  [Home] [Products] [Cart] [Login] [Register]               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🚀 Welcome to Quality Platform                             │
│                                                             │
│  Your comprehensive quality engineering solution            │
│  • Full-stack e-commerce demo                              │
│  • Comprehensive testing framework                          │
│  • Quality metrics and reporting                           │
│                                                             │
│  [Get Started] [View Products] [API Documentation]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Features

**1. Product Catalog**
- Browse products with search and filtering
- Category-based navigation
- Product detail views with images and descriptions
- Real-time stock information

**2. User Authentication**
```typescript
// Registration flow
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Login flow
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**3. Shopping Cart**
- Add/remove products
- Update quantities
- Persistent cart state (localStorage)
- Real-time price calculations

**4. Checkout Process**
- Multi-step checkout flow
- Form validation
- Order summary and confirmation

### Practical Exercise: Complete User Journey

Let's walk through a complete user journey:

```bash
# 1. Start the application
node dev-start.js

# 2. Open browser to http://localhost:4200
# 3. Click "Register" and create an account
# 4. Browse products and add items to cart
# 5. Proceed through checkout process
# 6. Verify order completion
```

**Expected Behavior:**
- Smooth navigation between pages
- Form validation working correctly
- Cart state persisting across page reloads
- Authentication working properly

## API Development Patterns

### API Structure

The NestJS API follows REST conventions with OpenAPI documentation:

```
/api
├── /health              # System health checks
├── /auth               # Authentication endpoints
│   ├── POST /register  # User registration
│   ├── POST /login     # User authentication
│   └── GET /me         # Current user profile
├── /products           # Product management
│   ├── GET /           # List products (paginated)
│   ├── GET /:id        # Get single product
│   ├── POST /          # Create product (admin)
│   ├── PUT /:id        # Update product (admin)
│   └── DELETE /:id     # Delete product (admin)
└── /docs              # Interactive API documentation
```

### Using the API

#### 1. Explore API Documentation

Visit http://localhost:3001/api/docs to see interactive Swagger documentation:

```
┌─────────────────────────────────────────────────────────────┐
│                    API Documentation                        │
│                                                             │
│  Authentication                                             │
│  ├── POST /api/auth/register    Create new user account    │
│  ├── POST /api/auth/login       Authenticate user          │
│  └── GET  /api/auth/me          Get current user           │
│                                                             │
│  Products                                                   │
│  ├── GET    /api/products       List all products          │
│  ├── GET    /api/products/:id   Get product by ID          │
│  ├── POST   /api/products       Create new product         │
│  ├── PUT    /api/products/:id   Update product             │
│  └── DELETE /api/products/:id   Delete product             │
│                                                             │
│  [Try it out] buttons allow testing directly               │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Test API Endpoints

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

**Get Products:**
```bash
curl http://localhost:3001/api/products
```

#### 3. Authentication Flow

```bash
# 1. Register or login to get JWT token
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Password123!"}' \
  | jq -r '.access_token')

# 2. Use token for authenticated requests
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### API Response Patterns

**Successful Response:**
```json
{
  "id": 1,
  "name": "Premium Headphones",
  "description": "High-quality wireless headphones",
  "price": 299.99,
  "category": "ELECTRONICS",
  "stock": 50,
  "imageUrl": "https://example.com/headphones.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

**Pagination Response:**
```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

## Testing Workflows

### Test Types & When to Use Them

```
Test Pyramid:

    🔺 E2E Tests (10%)          ← Full user journeys
   🔺🔺 Integration (20%)       ← API endpoints, DB operations
  🔺🔺🔺 Unit Tests (70%)       ← Individual functions, classes
```

### Unit Testing Workflow

**1. Write Unit Tests First (TDD)**
```typescript
// apps/api/src/products/products.service.spec.ts
describe('ProductsService', () => {
  it('should create a new product', async () => {
    // Given
    const productData = {
      name: 'Test Product',
      price: 99.99,
      category: ProductCategory.ELECTRONICS
    };

    // When
    const result = await service.create(productData);

    // Then
    expect(result).toBeDefined();
    expect(result.name).toBe('Test Product');
  });
});
```

**2. Run Tests**
```bash
# Run all unit tests
pnpm test:unit

# Run specific test file
pnpm test -- products.service.spec.ts

# Run tests in watch mode
pnpm test:unit --watch
```

### Integration Testing Workflow

**1. API Integration Tests**
```typescript
// tests/integration/products.e2e.spec.ts
describe('Products API (e2e)', () => {
  it('should create product with valid data', async () => {
    return request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Integration Test Product',
        price: 149.99,
        category: 'ELECTRONICS'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Integration Test Product');
      });
  });
});
```

**2. Run Integration Tests**
```bash
# Run API integration tests
pnpm test:integration

# Run with coverage
pnpm test:integration --coverage
```

### End-to-End Testing Workflow

**1. E2E User Journey Tests**
```typescript
// tests/e2e/checkout-flow.spec.ts
test('complete checkout process', async ({ page }) => {
  // Navigate to product page
  await page.goto('http://localhost:4200/products/1');

  // Add to cart
  await page.click('[data-testid="add-to-cart"]');

  // Go to checkout
  await page.click('[data-testid="cart-icon"]');
  await page.click('[data-testid="checkout-button"]');

  // Fill checkout form
  await page.fill('[data-testid="shipping-name"]', 'Test User');
  await page.fill('[data-testid="shipping-email"]', 'test@example.com');

  // Complete order
  await page.click('[data-testid="place-order"]');

  // Verify success
  await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
});
```

**2. Run E2E Tests**
```bash
# Run all E2E tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e -- checkout-flow

# Run with UI (see tests in browser)
pnpm test:e2e --ui
```

## Quality Checks

### Automated Quality Gates

Every change should pass these quality gates:

```bash
# 1. Linting (code style and potential issues)
pnpm nx lint api
pnpm nx lint web

# 2. Type checking
pnpm nx run api:typecheck
pnpm nx run web:typecheck

# 3. Unit tests with coverage
pnpm test:unit --coverage

# 4. Integration tests
pnpm test:integration

# 5. Security audit
npm audit

# 6. Quality metrics report
node scripts/quality-metrics.js
```

### Quality Metrics Dashboard

The quality metrics script provides comprehensive reporting:

```bash
node scripts/quality-metrics.js
```

**Sample Output:**
```
🔍 Collecting Quality Metrics...
═══════════════════════════════════

📊 Collecting Test Coverage...
   Statements: 85.2%
   Branches: 78.4%
   Functions: 92.1%
   Lines: 86.7%
   Average: 85.6%

🔧 Analyzing Code Quality...
   Files analyzed: 147
   Files with issues: 12
   Errors: 0
   Warnings: 8
   Quality Score: 84/100

🔒 Analyzing Security...
   Critical: 0
   High: 0
   Moderate: 2
   Low: 5
   Security Score: 87/100

🎯 Overall Quality Score: 85.5/100

💡 Recommendations:
   • Increase test coverage for edge cases
   • Address moderate security vulnerabilities
   • Fix remaining ESLint warnings
```

### Setting Quality Thresholds

Modify quality thresholds in configuration files:

**Jest Coverage (.nycrc.json):**
```json
{
  "statements": 70,
  "branches": 70,
  "functions": 70,
  "lines": 70
}
```

**ESLint Rules (.eslintrc.js):**
```javascript
module.exports = {
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error"
  }
};
```

## Database Operations

### Using Prisma Studio

Visual database management:

```bash
# Start Prisma Studio
npx prisma studio

# Opens browser at http://localhost:5555
```

**Features:**
- Browse and edit data visually
- Create and delete records
- Run queries directly
- View relationships between models

### Common Database Tasks

**1. Schema Changes**
```bash
# Edit schema file
code prisma/schema.prisma

# Apply changes
npx prisma migrate dev --name descriptive-change-name

# Generate updated client
npx prisma generate
```

**2. Seed Data**
```bash
# Run seed script
npx prisma db seed

# Reset database (development only)
npx prisma migrate reset
```

**3. Database Queries**
```typescript
// In your service files
const products = await this.prisma.product.findMany({
  where: {
    category: ProductCategory.ELECTRONICS,
    stock: { gt: 0 }
  },
  orderBy: { createdAt: 'desc' },
  take: 10
});
```

## Common Tasks

### 1. Adding a New Feature

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/new-amazing-feature

# 2. Develop feature with tests
# - Write failing test first
# - Implement feature
# - Make test pass
# - Refactor if needed

# 3. Run quality checks
pnpm test:unit
pnpm test:integration
node scripts/quality-metrics.js

# 4. Commit and push
git add .
git commit -m "feat: add amazing new feature with comprehensive tests"
git push origin feature/new-amazing-feature

# 5. Create pull request to develop branch
```

### 2. Debugging Issues

**Backend Issues:**
```bash
# Check API logs
pnpm nx serve api --verbose

# Check database connections
npx prisma studio

# Run specific tests
pnpm test -- --grep "failing test name"
```

**Frontend Issues:**
```bash
# Check web app logs
pnpm nx serve web --verbose

# Check browser console
# Open DevTools > Console

# Check React Query cache
# Install React Query DevTools
```

### 3. Updating Dependencies

```bash
# Check for updates
pnpm outdated

# Update specific package
pnpm add package-name@latest

# Update all packages (carefully)
pnpm update

# Run tests after updates
pnpm test:all
```

## Troubleshooting

### Common Issues & Solutions

**1. Port Already in Use**
```bash
# Error: Port 3001 is already in use
# Solution: Kill process or use different port

# Find process using port
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**2. Database Connection Issues**
```bash
# Error: Can't reach database server
# Solution: Check DATABASE_URL in .env.local

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

**3. Tests Failing**
```bash
# Error: Tests failing unexpectedly
# Solution: Check test database

# Run tests with verbose output
pnpm test:unit --verbose

# Run single test file
pnpm test -- specific-test-file.spec.ts
```

**4. Build Failures**
```bash
# Error: Build failing
# Solution: Check TypeScript errors

# Run type checking
pnpm nx run api:typecheck
pnpm nx run web:typecheck

# Check for linting issues
pnpm nx lint api --fix
pnpm nx lint web --fix
```

### Getting Help

1. **Check Documentation**: Look in `/docs` directory
2. **Review Examples**: Check existing test files for patterns
3. **API Documentation**: Visit http://localhost:3001/api/docs
4. **Quality Metrics**: Run `node scripts/quality-metrics.js` for insights
5. **GitHub Issues**: Create issue with detailed description and steps to reproduce

## Next Steps

You now understand the basic workflows and usage patterns. In the next tutorial, you'll learn how to interpret and act on test results.

👉 **[Part 3: Understanding Test Results →](./03-understanding-test-results.md)**

In the next part, you'll learn:
- How to read test output and coverage reports
- Interpreting quality metrics
- Identifying and fixing common issues
- Using test results to improve code quality

---

**Previous**: [← Part 1: Getting Started](./01-getting-started.md) | **Next**: [Part 3: Understanding Test Results →](./03-understanding-test-results.md)