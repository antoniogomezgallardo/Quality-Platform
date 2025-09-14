# Project Structure

This document provides a comprehensive overview of the Quality Platform monorepo organization, architecture, and implementation status.

## Overview

The Quality Platform is an Nx-based monorepo that demonstrates enterprise-grade quality engineering practices. The project is structured to support multiple applications, shared libraries, and comprehensive tooling for quality assurance and testing.

### Key Characteristics
- **Monorepo Architecture**: Nx workspace with shared build tools and dependencies
- **Full-Stack TypeScript**: End-to-end type safety across all applications
- **Quality-First Approach**: Built-in testing, linting, and quality gates
- **ISTQB Alignment**: Structured to support quality engineering training and certification

## Monorepo Structure

```
quality-platform/
├── 📁 apps/                          # Applications
│   ├── 📁 api/                       # ✅ NestJS Backend API (FULLY FUNCTIONAL)
│   │   ├── 📁 src/
│   │   │   ├── 📁 auth/              # JWT authentication system
│   │   │   ├── 📁 products/          # Product management module
│   │   │   ├── 📁 orders/            # Order processing module
│   │   │   ├── 📁 cart/              # Shopping cart module
│   │   │   ├── 📁 users/             # User management module
│   │   │   ├── 📁 prisma/            # Database service and migrations
│   │   │   ├── 📁 common/            # Shared utilities and guards
│   │   │   └── 📄 main.ts            # Application entry point
│   │   └── 📄 project.json           # Nx project configuration
│   │
│   ├── 📁 web/                       # 🚧 Next.js Frontend (IN DEVELOPMENT)
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/               # Next.js App Router
│   │   │   │   ├── 📁 (auth)/        # ✅ Authentication routes
│   │   │   │   ├── 📁 products/      # 🚧 Product pages (basic structure)
│   │   │   │   ├── 📁 cart/          # 📋 Cart pages (planned)
│   │   │   │   └── 📁 checkout/      # 📋 Checkout flow (planned)
│   │   │   ├── 📁 components/        # React components
│   │   │   │   ├── 📁 ui/            # ✅ Base UI components
│   │   │   │   ├── 📁 auth/          # ✅ Authentication forms
│   │   │   │   ├── 📁 layout/        # ✅ Navigation and layout
│   │   │   │   ├── 📁 products/      # 🚧 Product components
│   │   │   │   └── 📁 cart/          # 📋 Cart components (planned)
│   │   │   └── 📁 lib/               # Utilities and configurations
│   │   │       ├── 📁 api/           # 🚧 API client utilities
│   │   │       ├── 📁 auth/          # 🚧 Auth context and hooks
│   │   │       ├── 📁 hooks/         # 📋 React Query hooks (planned)
│   │   │       └── 📁 stores/        # 📋 Zustand stores (planned)
The Quality Platform follows a monorepo architecture managed by Nx, with clear separation of concerns between API, web application, CLI tools, testing, and documentation.

```
quality-platform/
├── 📦 apps/                    # Backend application code
│   ├── api/                    # NestJS backend API (✅ Production Ready)
│   │   ├── src/
│   │   │   ├── app/           # App module and controller
│   │   │   ├── auth/          # Authentication module (JWT + Passport.js)
│   │   │   ├── cart/          # Shopping cart module
│   │   │   ├── health/        # Health checks module
│   │   │   ├── orders/        # Order management module
│   │   │   ├── products/      # Product catalog module
│   │   │   ├── prisma/        # Database service (Prisma ORM)
│   │   │   └── main.ts        # Application entry point
│   │   └── project.json       # Nx project configuration
│   │
│   └── api-e2e/               # API E2E tests
│       └── src/
│           └── api/           # API integration tests
│
├── 🌐 web/                     # Next.js frontend application (✅ Production Ready)
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── (auth)/       # Authentication pages (login/register)
│   │   │   ├── products/     # Product catalog and detail pages
│   │   │   ├── cart/         # Shopping cart page
│   │   │   ├── checkout/     # Checkout pages
│   │   │   ├── globals.css   # Tailwind CSS v4 imports
│   │   │   ├── layout.tsx    # Root layout component
│   │   │   └── page.tsx      # Homepage
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/         # Authentication forms and components
│   │   │   ├── cart/         # Cart drawer and cart-related components
│   │   │   ├── layout/       # Navigation, layout, and structural components
│   │   │   ├── products/     # Product cards, grids, filters, search
│   │   │   └── ui/           # Base UI components (buttons, forms, etc.)
│   │   └── lib/              # Utilities and configurations
│   │       ├── api/          # API client and data fetching utilities
│   │       ├── auth/         # Authentication context and utilities
│   │       ├── hooks/        # Custom React Query hooks
│   │       └── stores/       # Zustand stores with localStorage persistence
│   │
│   ├── public/               # Static assets
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── next.config.js        # Next.js configuration
│   └── project.json          # Nx project configuration
│
├── ⚡ tools/                  # CLI Tools & Quality Automation (✅ Implemented)
│   ├── src/
│   │   ├── bin/              # CLI entry points
│   │   │   └── quality-tools.ts # Main CLI executable
│   │   ├── lib/
│   │   │   ├── commands/     # Command implementations
│   │   │   │   ├── quality-check.ts   # Quality validation command
│   │   │   │   ├── quality-report.ts  # Report generation command
│   │   │   │   └── index.ts          # Command exports
│   │   │   ├── config/       # Configuration management
│   │   │   │   ├── simple-config.ts  # Configuration loader
│   │   │   │   └── index.ts          # Config exports
│   │   │   ├── utils/        # Utility functions
│   │   │   │   ├── logger.ts         # Colored logging system
│   │   │   │   ├── process-runner.ts # Command execution
│   │   │   │   ├── report-formatter.ts # Multi-format reporting
│   │   │   │   └── index.ts          # Utility exports
│   │   │   └── cli.ts        # CLI framework (Commander.js)
│   │   └── index.ts          # Main library entry point
│   ├── README.md             # Comprehensive CLI documentation
│   ├── jest.config.ts        # CLI tools testing configuration
│   └── project.json          # Nx CLI project configuration
│
├── 📚 libs/                   # Shared Libraries (✅ Implemented)
│   └── shared/               # Common utilities, validation, and test helpers
│       ├── src/
│       │   ├── test-helpers/ # Testing utilities and fixtures
│       │   │   ├── assertions.ts    # Custom test assertions
│       │   │   ├── fixtures.ts      # Test data fixtures and builders
│       │   │   ├── mocks.ts         # Mock implementations and stubs
│       │   │   └── index.ts         # Test helper exports
│       │   ├── utilities/    # Common utility functions
│       │   │   ├── formatters.ts    # Data formatting utilities
│       │   │   ├── helpers.ts       # General purpose helpers
│       │   │   └── index.ts         # Utility exports
│       │   ├── validation/   # Validation schemas and utilities
│       │   │   ├── schemas.ts       # Zod validation schemas
│       │   │   ├── validators.ts    # Custom validation functions
│       │   │   └── index.ts         # Validation exports
│       │   └── index.ts      # Main library entry point
│       ├── README.md         # Shared libraries documentation
│       └── project.json      # Nx shared library configuration
│
├── 🧪 Testing
│   ├── web-e2e/              # Web E2E tests (Playwright)
│   │   └── src/
│   │       └── example.spec.ts
│   └── tests/                # Additional test suites
│       └── contract/         # API contract tests (future)
│
├── 🧠 .claude/                # Context Management System (✅ Implemented)
│   └── context-map.md       # Claude Code interaction patterns and navigation guide
│
├── 📜 scripts/               # Development Scripts (✅ Implemented)
│   └── context-helper.js     # Context loading and project analysis script
│
├── 📚 Documentation
│   ├── docs/                 # Project documentation
│   │   ├── api/             # API documentation
│   │   │   ├── authentication.md   # JWT authentication guide
│   │   │   ├── getting-started.md  # API quick start guide
│   │   │   ├── products.md         # Product management API
│   │   │   ├── orders.md           # Order management API
│   │   │   └── cart.md             # Shopping cart API
│   │   ├── frontend/        # Frontend documentation
│   │   │   ├── architecture.md     # Frontend architecture guide
│   │   │   └── components.md       # Component documentation
│   │   ├── database/        # Database schema docs
│   │   ├── deployment/      # Deployment guides
│   │   ├── development/     # Development guides
│   │   ├── training/        # ISTQB training materials
│   │   └── tutorials/       # Platform tutorials
│   │
│   ├── CHANGELOG.md         # Version history
│   ├── CLAUDE.md           # AI assistant guidelines and context management
│   ├── README.md           # Project overview with CLI tools and context system
│   └── PROJECT_STRUCTURE.md # This file - comprehensive structure guide
```

## Implementation Status

The Quality Platform has achieved production readiness with comprehensive infrastructure:
│
├── 📁 prisma/                        # ✅ Database Configuration (COMPLETE)
│   ├── 📄 schema.prisma              # Database schema definition
│   ├── 📄 seed.ts                    # Database seeding script
│   └── 📁 migrations/                # Database migration files
│
├── 📁 .husky/                        # ✅ Git Hooks (COMPLETE)
│   └── 📄 pre-commit                 # GitFlow enforcement hook
│
├── 📄 dev-start.js                   # ✅ Development automation script
├── 📄 dev-stop.js                    # ✅ Development cleanup script
├── 📄 package.json                   # ✅ Project dependencies and scripts
├── 📄 nx.json                        # ✅ Nx workspace configuration
├── 📄 tsconfig.base.json             # ✅ TypeScript configuration
├── 📄 .gitignore                     # ✅ Git ignore rules
├── 📄 README.md                      # ✅ Project overview and setup
├── 📄 CHANGELOG.md                   # ✅ Version history and changes
└── 📄 CLAUDE.md                      # ✅ Development guidelines
```

## Implementation Status

### Legend
- ✅ **FULLY FUNCTIONAL**: Complete implementation, production-ready
- 🚧 **IN DEVELOPMENT**: Basic structure implemented, features being developed
- 📋 **PLANNED**: Documented and ready for implementation
- 📁 **FUTURE**: Planned for future phases

### Current Status Summary (v1.6.1)

#### Backend API ✅ **FULLY FUNCTIONAL**
- Complete NestJS application with all major features
- JWT authentication with role-based access control
- Full CRUD operations for products, orders, and cart
- Comprehensive API documentation with Swagger/OpenAPI
- Production-ready with proper validation and error handling
- Database integration with Prisma ORM

#### Frontend Application 🚧 **IN DEVELOPMENT**
- Next.js 15 + React 19 + TypeScript foundation established
- Tailwind CSS v4 configuration complete
- Basic component structure and routing
- Authentication foundation implemented
- Product catalog foundation in place
- Full UI implementation and API integration in progress

#### Development Environment ✅ **FULLY AUTOMATED**
- Sophisticated port management and process cleanup
- GitFlow enforcement with pre-commit hooks
- Comprehensive documentation and troubleshooting guides
- Automated development server coordination

#### Testing Framework 📋 **PLANNED**
- Complete testing strategy documented
- Framework configurations ready (Jest, Supertest, Playwright)
- Test examples and patterns prepared
- Ready for implementation in Phase 5

## Backend Architecture

### NestJS Application Structure

```
apps/api/src/
├── 📁 auth/                          # Authentication Module ✅
│   ├── 📄 auth.controller.ts         # Login, register endpoints
│   ├── 📄 auth.service.ts            # JWT token management
│   ├── 📄 auth.module.ts             # Module configuration
│   ├── 📁 guards/                    # Route protection
│   ├── 📁 strategies/                # Passport strategies
│   └── 📁 dto/                       # Data transfer objects
│
├── 📁 products/                      # Product Management ✅
│   ├── 📄 products.controller.ts     # CRUD endpoints with filtering
│   ├── 📄 products.service.ts        # Business logic
│   ├── 📄 products.module.ts         # Module configuration
│   └── 📁 dto/                       # Request/response DTOs
│
├── 📁 orders/                        # Order Processing ✅
│   ├── 📄 orders.controller.ts       # Order management endpoints
│   ├── 📄 orders.service.ts          # Order business logic
│   ├── 📄 orders.module.ts           # Module configuration
│   └── 📁 dto/                       # Order DTOs
│
├── 📁 cart/                          # Shopping Cart ✅
│   ├── 📄 cart.controller.ts         # Cart management endpoints
│   ├── 📄 cart.service.ts            # Cart business logic
│   ├── 📄 cart.module.ts             # Module configuration
│   └── 📁 dto/                       # Cart DTOs
│
├── 📁 users/                         # User Management ✅
│   ├── 📄 users.controller.ts        # User profile endpoints
│   ├── 📄 users.service.ts           # User management logic
│   └── 📄 users.module.ts            # Module configuration
│
├── 📁 prisma/                        # Database Layer ✅
│   ├── 📄 prisma.service.ts          # Database service
│   └── 📄 prisma.module.ts           # Prisma module
│
├── 📁 common/                        # Shared Utilities ✅
│   ├── 📁 guards/                    # Authentication guards
│   ├── 📁 decorators/                # Custom decorators
│   ├── 📁 filters/                   # Exception filters
│   └── 📁 interceptors/              # Response interceptors
│
└── 📄 main.ts                        # Application bootstrap
```

### Key Features Implemented

#### Authentication & Authorization ✅
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Passport.js integration with Local and JWT strategies
- Password hashing with bcryptjs
- Protected routes with guards

#### API Endpoints ✅
- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Products**: Full CRUD with advanced filtering and search
- **Orders**: Complete order management with status tracking
- **Cart**: Session-based and user-persistent cart management
- **Health Checks**: System monitoring and database connectivity

#### Data Validation ✅
- class-validator for comprehensive DTO validation
- Custom validation pipes
- Proper error handling and response formatting

#### Documentation ✅
- OpenAPI/Swagger integration
- Interactive API documentation at `/api/docs`
- Comprehensive endpoint documentation

## Frontend Architecture

### Next.js Application Structure

```
apps/web/src/
├── 📁 app/                           # Next.js App Router
│   ├── 📄 layout.tsx                 # ✅ Root layout with providers
│   ├── 📄 page.tsx                   # ✅ Homepage
│   ├── 📄 global.css                 # ✅ Tailwind CSS imports
│   ├── 📁 (auth)/                    # Authentication Routes
│   │   ├── 📁 login/                 # ✅ Login page
│   │   └── 📁 register/              # ✅ Register page
│   ├── 📁 products/                  # Product Pages 🚧
│   │   ├── 📄 page.tsx               # Product listing page
│   │   └── 📁 [id]/                  # Product detail page
│   ├── 📁 cart/                      # Cart Pages 📋
│   │   └── 📄 page.tsx               # Shopping cart page
│   └── 📁 checkout/                  # Checkout Flow 📋
│       ├── 📄 page.tsx               # Checkout form
│       └── 📁 success/               # Order confirmation
│
├── 📁 components/                    # React Components
│   ├── 📁 ui/                        # Base Components ✅
│   │   ├── 📄 button.tsx             # Button component
│   │   ├── 📄 input.tsx              # Input component
│   │   ├── 📄 card.tsx               # Card component
│   │   └── 📄 loading.tsx            # Loading states
│   ├── 📁 auth/                      # Auth Components ✅
│   │   ├── 📄 LoginForm.tsx          # Login form
│   │   ├── 📄 RegisterForm.tsx       # Registration form
│   │   └── 📄 AuthProvider.tsx       # Auth context provider
│   ├── 📁 layout/                    # Layout Components ✅
│   │   ├── 📄 Navigation.tsx         # Main navigation
│   │   ├── 📄 Header.tsx             # Site header
│   │   └── 📄 Footer.tsx             # Site footer
│   ├── 📁 products/                  # Product Components 🚧
│   │   ├── 📄 ProductCard.tsx        # Product card display
│   │   ├── 📄 ProductGrid.tsx        # Product grid layout
│   │   ├── 📄 ProductFilters.tsx     # Filtering interface
│   │   └── 📄 ProductSearch.tsx      # Search functionality
│   └── 📁 cart/                      # Cart Components 📋
│       ├── 📄 CartDrawer.tsx         # Slide-out cart
│       ├── 📄 CartItem.tsx           # Individual cart item
│       └── 📄 CartBadge.tsx          # Cart item count badge
│
└── 📁 lib/                           # Utilities & Configuration
    ├── 📁 api/                       # API Client 🚧
    │   ├── 📄 client.ts              # HTTP client configuration
    │   ├── 📄 products.ts            # Product API calls
    │   ├── 📄 auth.ts                # Authentication API calls
    │   └── 📄 cart.ts                # Cart API calls
    ├── 📁 auth/                      # Authentication 🚧
    │   ├── 📄 context.tsx            # Auth context
    │   ├── 📄 provider.tsx           # Auth provider
    │   └── 📄 hooks.ts               # Auth hooks
    ├── 📁 hooks/                     # React Query Hooks 📋
    │   ├── 📄 useProducts.ts         # Product data hooks
    │   ├── 📄 useCart.ts             # Cart data hooks
    │   └── 📄 useAuth.ts             # Auth hooks
    └── 📁 stores/                    # Zustand Stores 📋
        ├── 📄 auth.ts                # Auth state management
        ├── 📄 cart.ts                # Cart state management
        └── 📄 products.ts            # Product state management
```

### Frontend Technology Stack

#### Core Technologies ✅
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety
- **Tailwind CSS v4**: Modern utility-first styling

#### Planned Integrations 📋
- **Zustand**: State management for client-side state
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation

## Development Infrastructure

### Automation Scripts ✅

#### Port Management System
```javascript
// dev-start.js - Comprehensive development automation
- Automatic port conflict resolution
- Process cleanup and management
- Build cache cleaning
- Server startup coordination
- Error handling and recovery
```

#### Development Commands
```bash
pnpm dev              # Complete development environment
pnpm dev:stop         # Clean shutdown
pnpm dev:reset        # Stop and restart clean
```

### Git Workflow ✅

#### GitFlow Enforcement
```bash
# .husky/pre-commit - Automated GitFlow compliance
- Prevents direct commits to main/develop
- Provides guidance on proper branch workflows
- Ensures methodology compliance
```

#### Branch Strategy
- `main`: Production-ready releases
- `develop`: Integration branch
- `feature/*`: New feature development
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation
- `hotfix/*`: Critical fixes

### Build and Quality ✅

#### Nx Workspace Configuration
```json
// nx.json - Monorepo build coordination
- Shared build tools and configurations
- Dependency graph management
- Incremental builds and caching
- Task pipeline optimization
```

#### Code Quality Tools
- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hook management

## Documentation Organization

### Documentation Structure ✅

#### Project Documentation
```
docs/
├── 📄 PROJECT_STRUCTURE.md          # This document
├── 📄 TESTING_GUIDE.md              # Testing strategies and setup
├── 📄 SETUP_AND_TROUBLESHOOTING.md  # Setup and problem resolution
└── 📁 project/                      # Detailed project documentation
```

#### API Documentation
```
docs/api/
└── 📄 API_REFERENCE.md              # Complete API endpoint reference
```

#### Training Materials (Phase 5)
```
docs/training/
├── 📄 istqb-foundation-level.md     # ISTQB certification prep
└── 📄 technologies-zero-to-hero.md  # Comprehensive tech curriculum
```

### Documentation Standards

#### Content Quality
- Clear, actionable instructions
- Code examples and screenshots
- Troubleshooting sections
- Regular updates and maintenance

#### Organization Principles
- Logical information hierarchy
- Cross-referencing between documents
- Version control for documentation changes
- Accessibility and searchability

## Future Roadmap

### Phase 5: Quality Engineering Tools 📋 **NEXT**

#### Testing Framework Implementation
- Jest unit testing setup and configuration
- Supertest API integration testing
- Playwright end-to-end testing
- Test coverage reporting and quality gates

#### Quality Metrics System
- Automated quality analysis scripts
- Code coverage tracking
- Performance monitoring
- Security vulnerability scanning

#### Training Materials
- Complete ISTQB Foundation Level preparation
- 52-week technology learning curriculum
- Interactive quality platform tutorials
- Hands-on testing examples

### Phase 6: Advanced Features 📁 **FUTURE**

#### Shared Libraries
- Common TypeScript interfaces and types
- Shared utility functions and helpers
- Reusable UI component library
- Cross-application state management

#### Development Tools
- Quality automation agents
- Code generators and scaffolding
- Advanced debugging and profiling tools
- Performance analysis utilities

#### Production Readiness
- Docker containerization
- CI/CD pipeline enhancement
- Production deployment automation
- Monitoring and alerting systems

### Long-term Vision

#### Enterprise Integration
- Multi-tenant architecture support
- Advanced role-based permissions
- Audit logging and compliance features
- Integration with enterprise tools

#### AI and Automation
- AI-powered code review and suggestions
- Automated test generation
- Intelligent quality analysis
- Predictive performance monitoring

---

## Contributing to the Structure

### Adding New Features

1. **Follow the established patterns**
2. **Update relevant documentation**
3. **Maintain implementation status indicators**
4. **Follow GitFlow methodology**

### Structure Modifications

1. **Document rationale for changes**
2. **Update all affected documentation**
3. **Communicate changes to team**
4. **Maintain backward compatibility**

For more information on specific implementation details, refer to:
- [Setup and Troubleshooting Guide](./SETUP_AND_TROUBLESHOOTING.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Development Guidelines](../CLAUDE.md)