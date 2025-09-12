# API Getting Started Guide

## Overview

The Quality Platform API is built with NestJS and provides a RESTful interface for our sample e-commerce application. This API demonstrates best practices in quality engineering, including comprehensive testing, documentation, and monitoring.

## Quick Start

### Prerequisites
- Node.js 20.x or higher  
- pnpm (installed globally): `npm install -g pnpm`

### Initial Setup

```bash
# Clone and install dependencies
git clone https://github.com/antoniogomezgallardo/Quality-Platform.git
cd Quality-Platform
pnpm install

# Setup environment variables (create .env file)
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-development-secret-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000

# Initialize database
npx prisma generate
npx prisma migrate dev
pnpm run db:seed

# Start the development server
pnpm nx serve api
```

The API will be available at:
- **Base URL**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## API Endpoints

### Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Basic health check |
| GET | `/api/health/ready` | Readiness probe (for Kubernetes) |
| GET | `/api/health/live` | Liveness probe (for Kubernetes) |

### Application Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | API information and welcome message |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user account |
| POST | `/api/auth/login` | Login with email and password |
| GET | `/api/auth/me` | Get current user profile (requires JWT) |

### Product Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products with pagination & filters |
| GET | `/api/products/:id` | Get single product details |
| GET | `/api/products/categories` | Get all product categories |
| GET | `/api/products/category/:category` | Get products by category |
| GET | `/api/products/search/:term` | Search products by term |
| POST | `/api/products` | Create new product (Admin only) |
| PATCH | `/api/products/:id` | Update product (Admin only) |
| PATCH | `/api/products/:id/stock` | Update product stock (Admin only) |
| DELETE | `/api/products/:id` | Delete product (Admin only) |

### Order Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders with filtering (Admin only) |
| GET | `/api/orders/my-orders` | Get current user's orders with pagination |
| GET | `/api/orders/:id` | Get single order details (own orders or admin) |
| GET | `/api/orders/stats` | Get order statistics (user or global admin stats) |
| GET | `/api/orders/user/:userId` | Get orders for specific user (Admin only) |
| POST | `/api/orders` | Create new order with stock validation |
| PATCH | `/api/orders/:id` | Update order notes (own orders or admin) |
| PATCH | `/api/orders/:id/status` | Update order status (Admin only) |
| POST | `/api/orders/:id/cancel` | Cancel order and restore stock |

## API Documentation

The API uses OpenAPI 3.0 (Swagger) for documentation. You can access the interactive documentation at http://localhost:3000/api/docs when the server is running.

### Swagger Features

- **Interactive Testing**: Test endpoints directly from the browser
- **Schema Documentation**: Complete request/response schemas
- **Authentication Support**: JWT Bearer token authentication (when implemented)
- **Tag Organization**: Endpoints grouped by functionality

## Development Features

### Global Configuration

The API includes several production-ready global configurations:

- **Validation Pipe**: Automatic request validation using class-validator with DTO schemas
- **CORS**: Configured for development and production environments  
- **Global Prefix**: All routes prefixed with `/api` for clean URL structure
- **Environment Configuration**: Uses `@nestjs/config` for secure environment management
- **OpenAPI Documentation**: Comprehensive Swagger UI with interactive testing
- **JWT Authentication**: Secure token-based authentication with Passport.js

### Environment Variables

Create a `.env` file in the project root with these required variables:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"  # SQLite for development

# JWT Authentication (Required)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
PORT=3000
API_BASE_URL="http://localhost:3000"
```

**Security Note**: Never commit `.env` files to version control. Use strong, unique secrets in production.

## Health Monitoring

The API includes comprehensive health checks:

### Basic Health Check (`/api/health`)
Returns basic application status including:
- Application status
- Current timestamp
- Uptime in seconds
- Environment information
- Version information

### Readiness Check (`/api/health/ready`)
Verifies the application is ready to receive traffic:
- **Database connectivity**: Tests Prisma database connection with actual query
- **Configuration validation**: Ensures required environment variables are present
- **External service dependencies**: Ready for future service integrations

### Liveness Check (`/api/health/live`)
Confirms the application is alive and responsive:
- **Process health**: Validates the Node.js process is functioning
- **Memory usage**: Monitors memory consumption within safe limits
- **Response capability**: Ensures the application can respond to requests

## Architecture

### Module Structure

```
apps/api/src/
├── app/                 # Main application module
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── app.service.ts
├── health/              # Health check module
│   ├── dto/
│   ├── health.controller.ts
│   ├── health.service.ts
│   └── health.module.ts
└── main.ts             # Application bootstrap
```

### Key Features

1. **Modular Design**: Features organized into logical modules
2. **DTO Validation**: Request/response validation using class-validator
3. **OpenAPI Documentation**: Comprehensive API documentation
4. **Health Monitoring**: Production-ready health checks
5. **Environment Configuration**: Flexible configuration management

## Testing

### Running Tests

```bash
# Unit tests
pnpm nx test api

# E2E tests  
pnpm nx e2e api-e2e

# Test with coverage
pnpm nx test api --coverage

# Watch mode for development
pnpm nx test api --watch
```

### Test Structure

- **Unit Tests**: Located alongside source files (`*.spec.ts`)
- **E2E Tests**: Located in `apps/api-e2e/`
- **Test Utilities**: Shared testing utilities in test helpers

## Next Steps

This API foundation provides a production-ready base for:

### ✅ **Implemented Features**
1. **Authentication System**: Complete JWT-based authentication with secure user registration and login
2. **Database Integration**: Prisma ORM with SQLite (development) / PostgreSQL (production) support
3. **User Management**: Full user registration, profile management, and role-based access
4. **Product Management**: Complete CRUD operations with advanced filtering, search, and category management
5. **Order Management**: Complete order processing system with stock management and status workflow
6. **Health Monitoring**: Production-ready health checks with database connectivity testing
7. **API Documentation**: Interactive Swagger UI with comprehensive endpoint documentation
8. **Database Seeding**: Sample data including 10 products, 4 sample orders, and test users

### 🚀 **Coming Next**
1. **Shopping Cart**: Session-based cart functionality with multi-step checkout
2. **Payment Integration**: Structure for payment processor integration
3. **Advanced Order Features**: Bulk operations, order export, and reporting
4. **Frontend Application**: Next.js web interface for the API
5. **Advanced Testing**: Unit tests, integration tests, and e2e test suites

### 🏗️ **Architecture Patterns**
Each module follows established enterprise patterns:
- **Comprehensive Documentation**: OpenAPI/Swagger with detailed schemas
- **Health Monitoring**: Kubernetes-ready liveness and readiness probes
- **Input Validation**: Automatic validation using class-validator DTOs
- **Security**: JWT authentication, password hashing, and route protection
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Testing Strategy**: Ready for unit, integration, and e2e testing implementation

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 pnpm nx serve api
```

**Module resolution errors**:
```bash
# Clear Nx cache
pnpm nx reset

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**TypeScript compilation errors**:
```bash
# Check TypeScript configuration
npx nx build api

# Verify all imports are correct
npx tsc --noEmit -p apps/api/tsconfig.json
```

For more help, check the main project documentation or create an issue in the repository.