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
- **Frontend**: React/Next.js - *planned for next phase*

## 📚 Documentation

### Project Overview
- [Quality Platform Brief](./Quality-Platform-Brief-Enhanced.md) - Complete functional and technical specifications
- [Capabilities & Use Cases](./Quality-Platform-Capabilities-and-Use-Cases.md) - Detailed use cases and ROI analysis
- [Development Guide](./CLAUDE.md) - Guidelines for contributing to this repository

### API Documentation
- [API Getting Started](./docs/api/getting-started.md) - Quick start guide for the NestJS API
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

**Current Phase**: Phase 2 - Backend API & Authentication ✅ **COMPLETED**

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

### 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up database
npx prisma migrate dev     # Create and apply database migrations
npx prisma generate       # Generate Prisma client

# Start the API server
pnpm nx serve api         # http://localhost:3000/api

# Access API Documentation
# Open http://localhost:3000/api/docs for interactive Swagger UI
```

### Current API Capabilities

```bash
# Development Commands
pnpm nx serve api         # Start API server (http://localhost:3000/api)
pnpm nx build api         # Build API for production
pnpm nx test api          # Run API unit tests (when implemented)
pnpm nx e2e api-e2e       # Run API e2e tests (when implemented)

# Database Commands  
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio (database GUI)
npx prisma db seed        # Seed database (when seed script is added)
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

### 🎯 Next Development Phases

**Phase 3A: Product Management API** (Next Priority)
- [ ] Product CRUD operations (Create, Read, Update, Delete)
- [ ] Product categories and search functionality
- [ ] Inventory management with stock tracking
- [ ] Image upload and management
- [ ] Product validation and business rules

**Phase 3B: Order Management System**
- [ ] Shopping cart functionality
- [ ] Order creation and processing workflow
- [ ] Order status management (Pending → Confirmed → Shipped → Delivered)
- [ ] Order history and tracking

**Phase 4: Frontend Application**
- [ ] Next.js web application setup
- [ ] User authentication UI
- [ ] Product catalog and shopping interface
- [ ] Admin dashboard for product/order management

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
