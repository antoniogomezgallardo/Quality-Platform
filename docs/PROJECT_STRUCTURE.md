# Quality Platform - Project Structure Guide

## 📁 Directory Overview

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
│
├── 🗄️ Database
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Database seeding
│   │   ├── migrations/     # Database migrations
│   │   └── dev.db          # SQLite dev database
│
├── ⚙️ Configuration
│   ├── .claude/            # Claude AI settings
│   ├── .nx/                # Nx cache and metadata
│   ├── .vscode/            # VS Code settings
│   ├── .env                # Environment variables
│   ├── .gitignore          # Git ignore rules
│   ├── nx.json             # Nx configuration
│   ├── tsconfig.base.json  # TypeScript config
│   ├── jest.config.js      # Jest configuration
│   ├── playwright.config.ts # Playwright config
│   └── package.json        # Dependencies
│
├── 🛠️ Scripts & Tools
│   ├── scripts/
│   │   └── quality-metrics.js # Quality reporting
│   │
│   ├── dev-start.js        # Enhanced development startup script
│   │                       # - Port conflict resolution
│   │                       # - Process cleanup and monitoring
│   │                       # - Server coordination (API → Web)
│   │                       # - Health checks and validation
│   ├── dev-stop.js         # Comprehensive development cleanup
│   │                       # - Windows process tree termination
│   │                       # - Safe shutdown with protection
│   │                       # - Port cleanup and validation
│   ├── libs/               # Shared libraries (future)
│   ├── tools/              # Development tools (future)
│   └── templates/          # Document templates (future)
│
└── 📦 Build Outputs
    └── dist/               # Compiled applications
```

## 🏗️ Module Structure

### API Modules (NestJS)

Each API module follows a consistent structure:

```
module-name/
├── module-name.module.ts      # Module definition
├── module-name.controller.ts  # HTTP endpoints
├── module-name.service.ts     # Business logic
├── dto/                       # Data Transfer Objects
│   ├── create-*.dto.ts       # Creation DTOs
│   ├── update-*.dto.ts       # Update DTOs
│   ├── query-*.dto.ts        # Query/filter DTOs
│   └── *-response.dto.ts     # Response DTOs
├── guards/                    # Authorization guards
├── decorators/               # Custom decorators
└── *.spec.ts                 # Unit tests
```

### Frontend Structure (Next.js)

```
web/src/
├── app/                      # Pages (App Router)
│   ├── (group)/             # Route groups
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Page component
│
├── components/              # React components
│   ├── feature/            # Feature-specific
│   └── ui/                 # Reusable UI
│
└── lib/                    # Utilities
    ├── api/               # API integration
    ├── hooks/             # Custom hooks
    └── stores/            # State management
```

## 📝 File Naming Conventions

- **TypeScript/JavaScript**: `kebab-case.ts`
- **React Components**: `PascalCase.tsx`
- **Test Files**: `*.spec.ts` or `*.test.ts`
- **Documentation**: `UPPERCASE.md` or `kebab-case.md`
- **Configuration**: `lowercase.config.ts`

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `nx.json` | Nx workspace configuration |
| `tsconfig.base.json` | Shared TypeScript settings |
| `jest.config.js` | Test runner configuration |
| `playwright.config.ts` | E2E test configuration |
| `.env` | Environment variables |
| `prisma/schema.prisma` | Database schema |

## 🚀 Development Workflow

1. **Feature Development**: Create feature branch from `develop`
2. **Implementation**: Code in appropriate module/component
3. **Testing**: Add tests in same directory or test folder
4. **Documentation**: Update relevant docs
5. **Quality Check**: Run linting and tests
6. **Merge**: PR to `develop`, then release to `main`

## 📦 Key Dependencies

### Backend
- NestJS - API framework
- Prisma - ORM
- Passport - Authentication
- class-validator - Validation
- Swagger - API documentation

### Frontend
- Next.js 15 - React framework
- React 19 - UI library
- Tailwind CSS - Styling
- Zustand - State management
- React Query - Data fetching

### Testing
- Jest - Unit testing
- Playwright - E2E testing
- Supertest - API testing

## 🔄 Build & Deployment

- **Development**: `pnpm dev` starts both API and web
- **Production Build**: `pnpm nx build api` and `pnpm nx build web`
- **Testing**: `pnpm nx test` and `pnpm nx e2e`
- **Database**: Prisma migrations for schema changes

## 📊 Project Statistics

- **Total Modules**: 8 API modules, 15+ React components
- **API Endpoints**: 40+ REST endpoints
- **Test Coverage Target**: 70% minimum
- **Frontend Pages**: 10+ pages with dynamic routing
- **Database Tables**: 6 core tables with relationships

This structure supports scalability, maintainability, and follows best practices for enterprise-grade applications.