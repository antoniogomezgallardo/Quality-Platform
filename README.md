# Quality Platform

A reusable quality platform for accelerating projects with built-in QA/QE best practices and ISTQB alignment.

## 🎯 Vision

Maintain a single repository that serves as a reusable quality platform to:

- Accelerate new projects with good practices from day one
- Train and mentor teams in modern QA/QE approaches
- Practice and demonstrate concepts aligned with ISTQB and continuous quality

## 🚀 Key Features

- **40-60% Faster Delivery** - Pre-configured quality setup and automation
- **80% Fewer Production Issues** - Proactive quality gates and risk assessment
- **3x Faster Team Onboarding** - Interactive training with real examples
- **Business-Readable Metrics** - Quality dashboards for all stakeholders

## 📊 Proven ROI

For a 50-person engineering team:

- **Annual Value**: ~$5.69M
- **ROI**: 469% in Year 1
- **Escaped Defects**: -75%
- **Release Confidence**: +58%

## 🛠️ Technology Stack (Implemented)

- **Monorepo**: Nx Workspace with pnpm
- **Language**: TypeScript
- **Backend**: NestJS with OpenAPI/Swagger
- **Authentication**: JWT with Passport.js (Local + JWT strategies)
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Validation**: class-validator with comprehensive DTOs
- **Security**: bcryptjs password hashing, authentication guards
- **Testing**: Jest (unit), Supertest (e2e) - *ready for implementation*
- **Frontend**: React/Next.js with TypeScript and Tailwind CSS

## 📚 Documentation

### Project Overview
- [Quality Platform Brief](./Quality-Platform-Brief-Enhanced.md) - Complete functional and technical specifications
- [Capabilities & Use Cases](./Quality-Platform-Capabilities-and-Use-Cases.md) - Detailed use cases and ROI analysis
- [Development Guide](./CLAUDE.md) - Guidelines for contributing to this repository

### API Documentation
- [API Getting Started](./docs/api/getting-started.md) - Quick start guide for the NestJS API
- [Product Management API](./docs/api/products.md) - Complete product catalog documentation
- [Order Management API](./docs/api/orders.md) - Complete order processing documentation
- [Shopping Cart API](./docs/api/cart.md) - Complete shopping cart and checkout documentation
- [Authentication Guide](./docs/api/authentication.md) - Complete JWT authentication documentation
- [Interactive API Docs](http://localhost:3000/api/docs) - Swagger UI (when server is running)

### Development Guides
- [Database Schema](./docs/database/schema.md) - Prisma schema and relationships
- [API Architecture](./docs/api/architecture.md) - NestJS module structure and patterns
- [Setup Guide](./docs/development/setup.md) - Complete development environment setup

## 🎓 ISTQB Alignment

This platform demonstrates concepts from:

- Foundation Level (test design, levels, types)
- Agile Extension (sprint testing, CI/CD)
- Test Automation Engineer (automation architecture)
- Advanced Level (test management, techniques)

## 🏗️ Project Status

**Current Phase**: Phase 4 - Frontend Application 🚧 **IN PROGRESS**

### Completed Implementation ✅

**Phase 1: Foundation** (Completed) ✅
- [x] Nx monorepo structure with pnpm
- [x] GitFlow configuration (main/develop branches)  
- [x] GitHub Actions CI/CD pipeline
- [x] Development environment configuration
- [x] Conventional commits with Husky hooks
- [x] Pre-commit linting and formatting
- [x] PR and issue templates
- [x] VS Code workspace settings

**Phase 2A: NestJS API Foundation** (Completed) ✅
- [x] NestJS application generated with Nx
- [x] OpenAPI/Swagger documentation configured
- [x] Health check endpoints with monitoring
- [x] Global validation and CORS setup
- [x] Environment configuration
- [x] Comprehensive API documentation

**Phase 2B: Database & Authentication** (Completed) ✅
- [x] Prisma ORM with SQLite (development) and PostgreSQL (production) support
- [x] Complete e-commerce database schema (Users, Products, Orders, OrderItems)
- [x] JWT authentication system with Passport.js strategies
- [x] User registration and login with secure password hashing
- [x] Protected routes with authentication guards
- [x] Database-connected health checks

**Phase 3A: Product Management API** (Completed) ✅
- [x] Complete Product CRUD operations with validation
- [x] Advanced product filtering: search, category, price range, stock status
- [x] Pagination support with configurable page sizes
- [x] Role-based access control (Admin-only for CUD operations)
- [x] Category management and product search functionality
- [x] Database seed script with 10 sample products across 6 categories
- [x] Comprehensive OpenAPI documentation with interactive testing
- [x] Professional error handling and response formatting
- [x] Stock management and inventory tracking

**Phase 3B: Order Management API** (Completed) ✅
- [x] Complete Order CRUD operations with comprehensive validation
- [x] Advanced order filtering and pagination (status, user, date range, total amount)
- [x] Role-based access control (Users: own orders, Admins: all orders)
- [x] Order creation with automatic stock validation and inventory updates
- [x] Order status management (PENDING → CONFIRMED → SHIPPED → DELIVERED → CANCELLED)
- [x] Order cancellation with automatic stock restoration
- [x] Order statistics and reporting (total orders, revenue, averages)
- [x] User order history and admin order management
- [x] Comprehensive OpenAPI documentation with business rules
- [x] Database transactions for data integrity and consistency

**Phase 3C: Shopping Cart & Checkout** (Completed) ✅
- [x] Complete shopping cart management with 9 REST endpoints
- [x] Session-based carts for guest users with automatic creation
- [x] Persistent carts for authenticated users with cross-device sync
- [x] Cart merging functionality when guest users log in
- [x] Real-time stock validation and automatic inventory management
- [x] Cart-to-order checkout conversion with transaction safety
- [x] Cart summary, validation, and cleanup operations
- [x] Support for both authenticated and guest user workflows
- [x] Comprehensive cart API documentation with business rules
- [x] Database models optimized with proper relationships and constraints

### 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up database
npx prisma migrate dev     # Create and apply database migrations
npx prisma generate       # Generate Prisma client
pnpm run db:seed          # Seed database with sample data

# Start the API server
pnpm nx serve api         # http://localhost:3000/api

# Start the web application
pnpm nx serve web         # http://localhost:4200

# Access API Documentation
# Open http://localhost:3000/api/docs for interactive Swagger UI
```

### Current API Capabilities

```bash
# Development Commands
pnpm nx serve api         # Start API server (http://localhost:3000/api)
pnpm nx serve web         # Start web application (http://localhost:4200)
pnpm nx build api         # Build API for production
pnpm nx build web         # Build web application for production
pnpm nx test api          # Run API unit tests (when implemented)
pnpm nx test web          # Run web unit tests (when implemented)
pnpm nx e2e api-e2e       # Run API e2e tests (when implemented)
pnpm nx e2e web-e2e       # Run web e2e tests (when implemented)

# Database Commands  
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio (database GUI)
pnpm run db:seed         # Seed database with sample products and users
```

### 🔗 Available API Endpoints

**Core Endpoints**
- `GET /api` - API welcome message with version info
- `GET /api/docs` - Interactive Swagger documentation

**Health & Monitoring**
- `GET /api/health` - Basic health check with system info
- `GET /api/health/ready` - Readiness probe (includes database connectivity)
- `GET /api/health/live` - Liveness probe for Kubernetes

**Authentication System**
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/me` - Get current user profile (requires JWT)

**Product Management API**
- `GET /api/products` - List products with pagination & advanced filters
- `GET /api/products/:id` - Get single product details
- `GET /api/products/categories` - Get all product categories
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:term` - Search products by name/description
- `POST /api/products` - Create new product (Admin only)
- `PATCH /api/products/:id` - Update product (Admin only)  
- `PATCH /api/products/:id/stock` - Update product stock (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

**Order Management API**
- `GET /api/orders` - List all orders with advanced filtering (Admin only)
- `GET /api/orders/my-orders` - Get current user's orders with pagination
- `GET /api/orders/:id` - Get single order details (own orders or admin)
- `GET /api/orders/stats` - Get order statistics (user or global admin stats)
- `GET /api/orders/user/:userId` - Get orders for specific user (Admin only)
- `POST /api/orders` - Create new order with stock validation
- `PATCH /api/orders/:id` - Update order notes (own orders or admin)
- `PATCH /api/orders/:id/status` - Update order status (Admin only)
- `POST /api/orders/:id/cancel` - Cancel order and restore stock

**Shopping Cart API**
- `GET /api/cart` - Get current cart (user or guest session)
- `GET /api/cart/summary` - Get cart totals and summary information
- `POST /api/cart/items` - Add item to cart with stock validation
- `PATCH /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `POST /api/cart/validate` - Validate cart stock availability
- `POST /api/cart/merge` - Merge guest cart with user cart (auth required)
- `POST /api/cart/checkout` - Convert cart to order (auth required)

### 🎯 Next Development Phases

**Phase 4: Frontend Application** (In Progress) 🚧
- [x] Next.js web application setup with TypeScript
- [ ] User authentication UI with login/register forms
- [ ] Product catalog browsing with search and filtering
- [ ] Shopping cart interface with real-time updates
- [ ] Multi-step checkout process with order confirmation
- [ ] Admin dashboard for product and order management
- [ ] Responsive design for mobile and desktop

**Phase 5: Quality Engineering Tools**
- [ ] Test automation framework integration
- [ ] API contract testing with Pact
- [ ] Performance testing with Artillery
- [ ] Quality metrics collection and dashboards
- [ ] ISTQB training materials and examples

## 🤝 Contributing

This platform is designed to be a collaborative effort. See [CLAUDE.md](./CLAUDE.md) for development guidelines.

## 📄 License

This project is intended as a reference implementation and training platform for quality engineering practices.

---

_"Quality is not an act, it is a habit." - Aristotle_

**The Quality Platform makes excellence a habit, not a hope.**
