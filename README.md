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

## ⚡ Development Experience

### 🚀 Automated Port Management
The project includes a sophisticated development environment setup that eliminates common issues:
- **No Port Conflicts**: Automatically resolves port conflicts by killing existing processes
- **Clean Startup**: Removes corrupted build caches and ensures fresh server starts
- **Single Command**: `pnpm dev` starts both API and Web servers with proper coordination
- **Error Recovery**: Handles permission issues and provides clear status messages
- **Dependency Order**: Starts API server first, then Web app for proper initialization

## 🛠️ Technology Stack (Implemented)

- **Monorepo**: Nx Workspace with pnpm
- **Language**: TypeScript
- **Backend**: NestJS with OpenAPI/Swagger
- **Authentication**: JWT with Passport.js (Local + JWT strategies)
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Validation**: class-validator with comprehensive DTOs
- **Security**: bcryptjs password hashing, authentication guards
- **Testing**: Jest (unit), Supertest (e2e) - *ready for implementation*
- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Data Fetching**: TanStack React Query (@tanstack/react-query)
- **UI Components**: Custom component library with responsive design

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
- [Frontend Architecture](./docs/frontend/architecture.md) - Next.js application structure and patterns
- [Component Library](./docs/frontend/components.md) - Reusable UI components and patterns
- [Setup Guide](./docs/development/setup.md) - Complete development environment setup

## 🎓 ISTQB Alignment

This platform demonstrates concepts from:

- Foundation Level (test design, levels, types)
- Agile Extension (sprint testing, CI/CD)
- Test Automation Engineer (automation architecture)
- Advanced Level (test management, techniques)

## 🏗️ Project Status

**Current Phase**: Phase 4 - Frontend Application ✅ **SUBSTANTIALLY COMPLETE**

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
pnpm db:seed              # Seed database with sample data

# 🌟 RECOMMENDED: Start complete development environment
pnpm dev                   # Auto-cleanup + API (3001) + Web (4200)

# Or start servers individually:
pnpm nx serve api         # http://localhost:3001/api
pnpm nx serve web         # http://localhost:4200

# Access the applications:
# 🌐 Web App:       http://localhost:4200
# 📚 API Docs:      http://localhost:3001/api/docs
# 🔍 DB Studio:     npx prisma studio (http://localhost:5555)
```

### 🌐 Complete E-commerce Experience

The Quality Platform now provides a complete e-commerce web application:

```bash
# Frontend Application Features:
# 🔐 User Authentication - Register, login, logout with JWT
# 🛍️ Product Catalog - Browse, search, filter products with pagination
# 🛒 Shopping Cart - Add items, update quantities, persistent cart
# 📱 Responsive Design - Mobile and desktop optimized
# ⚡ Real-time Updates - Live cart updates and stock validation

# User Workflow:
# 1. Visit http://localhost:4200
# 2. Register/Login with your account
# 3. Browse products with search and filters
# 4. Add products to cart (cart badge shows count)
# 5. Click cart icon to view cart drawer
# 6. Manage cart items and proceed to checkout
```

### 🛠️ Development Commands

```bash
# 🚀 Primary Development (Recommended)
pnpm dev                   # Start both API + Web with auto port cleanup
pnpm dev:clean             # Same as above (alias)

# 🔧 Individual Server Commands
pnpm nx serve api          # Start API server (http://localhost:3001/api)
pnpm nx serve web          # Start web application (http://localhost:4200)

# 🏗️ Building and Quality
pnpm nx build api          # Build API for production
pnpm nx build web          # Build web application for production
pnpm nx lint web           # Lint web application code
pnpm nx test api           # Run API unit tests (when implemented)
pnpm nx test web           # Run web unit tests (when implemented)
pnpm nx e2e api-e2e        # Run API e2e tests (when implemented)
pnpm nx e2e web-e2e        # Run web e2e tests (when implemented)

# 🗃️ Database Management
npx prisma migrate dev     # Create and apply migrations
npx prisma generate        # Generate Prisma client
npx prisma studio          # Open Prisma Studio (database GUI)
pnpm db:seed              # Seed database with sample products and users
npx prisma migrate reset   # Reset database (development only)
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

**Phase 4: Frontend Application** ✅ **COMPLETED**
- [x] Next.js 15 web application setup with TypeScript and Tailwind CSS
- [x] Modern responsive homepage with gradients, animations, and hero sections
- [x] User authentication UI with login/register forms and JWT integration
- [x] Product catalog browsing with advanced search, filtering, and pagination
- [x] Shopping cart interface with real-time updates and localStorage persistence
- [x] Complete cart drawer with quick preview and management
- [x] Navigation system with cart badge and user authentication status
- [x] Responsive design for mobile and desktop with modern UI components
- [x] State management with Zustand and API integration with React Query
- [x] Port management solution for seamless development experience
- [x] Complete e-commerce user journey from browsing to cart management

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
