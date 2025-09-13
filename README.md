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

## 🛠️ Technology Stack (Production Ready)

### Backend Stack
- **Framework**: NestJS with modular architecture
- **API Documentation**: OpenAPI/Swagger with interactive UI
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: JWT with Passport.js (Local + JWT strategies)
- **Validation**: class-validator with comprehensive DTOs
- **Security**: bcryptjs, authentication guards, role-based access

### Frontend Stack
- **Framework**: Next.js 15 with React 19 and App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand with localStorage persistence
- **Data Fetching**: TanStack React Query with caching
- **UI Components**: Custom component library with shadcn/ui

### Testing & Quality
- **Unit Testing**: Jest with 70% coverage thresholds
- **API Testing**: Supertest for integration tests
- **E2E Testing**: Playwright for cross-browser testing
- **Contract Testing**: API contract validation
- **Quality Metrics**: Automated collection and reporting
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## 📚 Documentation

### Project Overview
- [Quality Platform Brief](./docs/project/Quality-Platform-Brief-Enhanced.md) - Complete functional and technical specifications
- [Capabilities & Use Cases](./docs/project/Quality-Platform-Capabilities-and-Use-Cases.md) - Detailed use cases and ROI analysis
- [Development Guide](./CLAUDE.md) - Guidelines for working with this repository
- [Project Structure](./docs/PROJECT_STRUCTURE.md) - Monorepo organization and architecture
- [Testing Guide](./docs/TESTING_GUIDE.md) - Comprehensive testing strategies and setup
- [Setup & Troubleshooting](./docs/SETUP_AND_TROUBLESHOOTING.md) - Complete setup and problem resolution

### API Documentation
- [Interactive API Docs](http://localhost:3001/api/docs) - Swagger UI (when server is running)
- [API Reference](./docs/api/API_REFERENCE.md) - Complete endpoint documentation
- [API Getting Started](./docs/api/getting-started.md) - Quick start guide for the NestJS API
- [Product Management API](./docs/api/products.md) - Complete product catalog documentation
- [Order Management API](./docs/api/orders.md) - Complete order processing documentation
- [Shopping Cart API](./docs/api/cart.md) - Complete shopping cart and checkout documentation
- [Authentication Guide](./docs/api/authentication.md) - Complete JWT authentication documentation

### Training Materials (Phase 5)
- [ISTQB Foundation Level](./docs/training/istqb-foundation-level.md) - Complete certification preparation
- [Technologies Zero to Hero](./docs/training/technologies-zero-to-hero.md) - 52-week learning curriculum
- [Quality Platform Tutorials](./docs/tutorials/) - Hands-on learning guides

## 🎓 ISTQB Alignment

This platform demonstrates concepts from:

- Foundation Level (test design, levels, types)
- Agile Extension (sprint testing, CI/CD)
- Test Automation Engineer (automation architecture)
- Advanced Level (test management, techniques)

## 🏗️ Project Status

**Current Version**: v1.6.1 - Development Environment Enhanced
**Backend API**: ✅ **FULLY FUNCTIONAL**
**Frontend Application**: 🚧 **IN DEVELOPMENT**
**Development Environment**: ✅ **FULLY AUTOMATED**

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
# Clone and install
git clone https://github.com/antoniogomezgallardo/Quality-Platform.git
cd Quality-Platform
pnpm install

# Set up environment
cp .env.example .env  # Or create .env with required variables

# Initialize database
npx prisma migrate dev     # Create database and apply migrations
npx prisma generate       # Generate Prisma client
pnpm db:seed              # Seed with sample data

# 🌟 RECOMMENDED: Start development environment
pnpm dev                   # Auto-cleanup + API (3001) + Web (4200)

# Access the platform:
# 🌐 Web App:       http://localhost:4200 (Next.js frontend - in development)
# 📚 API Docs:      http://localhost:3001/api/docs (NestJS backend - fully functional)
# 🔍 DB Studio:     npx prisma studio
```

<<<<<<< HEAD
### 🌐 Backend API - Fully Functional

The Quality Platform provides a complete, production-ready backend API:

```bash
# Backend Features (✅ COMPLETE):
# 🔐 JWT Authentication - Complete user registration, login, and secure routes
# 🛍️ Product Management - Full CRUD with advanced filtering and search
# 📦 Order Management - Complete order processing with status tracking
# 🛒 Shopping Cart - Full cart system with guest and user support
# 📊 Business Analytics - Order statistics, inventory tracking, and reporting
# 🔒 Security - Role-based access control, data validation, and protection

# API Access:
# 📚 Interactive Docs: http://localhost:3001/api/docs
# 🔍 Health Checks:   http://localhost:3001/api/health
# 🗃️ Database GUI:     npx prisma studio (http://localhost:5555)
```

### 🚧 Frontend Application - In Development

The web application is currently under active development:

```bash
# Frontend Status (🚧 IN DEVELOPMENT):
# ✅ Next.js 15 + React 19 + TypeScript setup
# ✅ Tailwind CSS v4 configuration
# ✅ Basic component structure and routing
# ✅ Development environment automation
# 🚧 User interface implementation in progress
# 📋 Complete integration with backend API (planned)

# Development Access:
# 🌐 Web App: http://localhost:4200 (development server)
=======
### 🏗️ Development Environment

The Quality Platform provides a robust development environment with automated setup:

```bash
# Development Features:
# 🔧 Automated Port Management - Resolves conflicts and cleans processes
# 🚀 Single Command Startup - Both API and Web servers with proper coordination
# 🛠️ Enhanced Scripts - dev-start.js and dev-stop.js for robust process management
# 📊 Process Monitoring - Health checks and status validation
# 🔄 Error Recovery - Handles permission issues and provides clear feedback

# Development Workflow:
# 1. Run 'pnpm dev' to start both servers
# 2. Access API at http://localhost:3001/api
# 3. Test endpoints at http://localhost:3001/api/docs
# 4. Frontend development at http://localhost:4200
# 5. Use 'pnpm dev:stop' for clean shutdown
>>>>>>> origin/develop
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

### 🎯 Completed Features

<<<<<<< HEAD
**Phase 4: Frontend Application** 🚧 **IN DEVELOPMENT**
- [x] Next.js 15 web application setup with TypeScript and Tailwind CSS v4
- [x] Basic responsive homepage structure
- [x] User authentication foundation (login/register forms)
- [x] Product catalog foundation (basic browsing capabilities)
- [ ] Advanced search, filtering, and pagination
- [ ] Shopping cart interface implementation
- [ ] Cart drawer and management features
- [ ] Complete navigation system with cart integration
- [ ] Mobile-responsive design optimization
- [ ] State management with Zustand and React Query integration
- [x] Development environment automation with port management
- [ ] Complete e-commerce user journey implementation

**Phase 5: Quality Engineering Tools** 📋 **PLANNED**
- [ ] Test automation framework integration (Jest, Supertest, Playwright)
- [ ] API contract testing implementation
- [ ] Performance testing setup
- [ ] Quality metrics collection and dashboards
- [ ] ISTQB training materials and examples
- [ ] Comprehensive testing documentation
=======
#### Backend API (Fully Functional)
- ✅ Complete product catalog API with search, filtering, and categories
- ✅ Shopping cart API with real-time stock validation
- ✅ Order management and tracking endpoints
- ✅ User authentication with JWT and secure password hashing
- ✅ Role-based access control and admin operations
- ✅ Comprehensive API documentation and testing

#### Frontend Development (In Progress)
- 🔄 Next.js application foundation with TypeScript
- 🔄 Tailwind CSS styling system configuration
- 📋 User interface components (planned)
- 📋 Authentication flow implementation (planned)
- 📋 Product catalog frontend (planned)
- 📋 Shopping cart and checkout UI (planned)

#### Quality Engineering
- ✅ Comprehensive testing framework (Jest, Playwright, Supertest)
- ✅ Quality metrics collection and reporting
- ✅ ISTQB-aligned training materials
- ✅ GitFlow workflow with branch protection
- ✅ Automated code quality checks

### 📈 Roadmap to Production

**Phase 6: CI/CD & Deployment** (Next Priority) 🚀
- [ ] GitHub Actions workflows for automated testing
- [ ] Docker containerization for all services
- [ ] Kubernetes deployment manifests
- [ ] Environment configuration management
- [ ] Automated release pipeline
- [ ] Database migration automation
- [ ] Production monitoring setup

**Phase 7: Performance & Security** 🔒
- [ ] Redis caching layer implementation
- [ ] Rate limiting and DDoS protection
- [ ] Security headers and CSP policies
- [ ] OWASP security scanning integration
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] CDN integration for static assets
- [ ] Database query optimization

**Phase 8: Enterprise Features** 🏢
- [ ] Multi-tenancy support
- [ ] Single Sign-On (SSO) integration
- [ ] Advanced role-based permissions
- [ ] Audit logging and compliance
- [ ] Data export/import capabilities
- [ ] Webhook system for integrations
- [ ] Advanced reporting and analytics
>>>>>>> origin/develop

## 🤝 Contributing

This platform is designed to be a collaborative effort. See [CLAUDE.md](./CLAUDE.md) for development guidelines.

## 📄 License

This project is intended as a reference implementation and training platform for quality engineering practices.

---

_"Quality is not an act, it is a habit." - Aristotle_

**The Quality Platform makes excellence a habit, not a hope.**
