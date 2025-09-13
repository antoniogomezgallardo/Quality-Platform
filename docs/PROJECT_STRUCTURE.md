# Quality Platform - Project Structure Guide

## 📁 Directory Overview

The Quality Platform follows a monorepo architecture managed by Nx, with clear separation of concerns between API, web application, testing, and documentation.

```
quality-platform/
├── 📦 apps/                    # Application code
│   ├── api/                    # NestJS backend API
│   │   ├── src/
│   │   │   ├── app/           # App module and controller
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── cart/          # Shopping cart module
│   │   │   ├── health/        # Health checks module
│   │   │   ├── orders/        # Order management module
│   │   │   ├── products/      # Product catalog module
│   │   │   ├── prisma/        # Database service
│   │   │   └── main.ts        # Application entry point
│   │   └── project.json       # Nx project configuration
│   │
│   └── api-e2e/               # API E2E tests
│       └── src/
│           └── api/           # API integration tests
│
├── 🌐 web/                     # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── (auth)/       # Authentication pages group
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── cart/         # Shopping cart page
│   │   │   ├── checkout/     # Checkout flow
│   │   │   ├── products/     # Product catalog pages
│   │   │   └── page.tsx      # Homepage
│   │   │
│   │   ├── components/        # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── cart/         # Cart components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── products/     # Product components
│   │   │   └── ui/           # Base UI components
│   │   │
│   │   └── lib/              # Utilities and libraries
│   │       ├── api/          # API client
│   │       ├── auth/         # Auth context
│   │       ├── hooks/        # Custom React hooks
│   │       └── stores/       # Zustand state stores
│   │
│   ├── public/               # Static assets
│   └── project.json          # Nx project configuration
│
├── 🧪 Testing
│   ├── e2e/                  # End-to-end tests
│   │   ├── auth-flow.spec.ts
│   │   └── homepage.spec.ts
│   │
│   ├── tests/                # Additional test suites
│   │   └── contract/         # API contract tests
│   │
│   └── web-e2e/              # Web E2E tests
│       └── src/
│
├── 📚 Documentation
│   ├── docs/                 # Project documentation
│   │   ├── api/             # API documentation
│   │   ├── architecture/    # Architecture decisions
│   │   ├── database/        # Database schema docs
│   │   ├── deployment/      # Deployment guides
│   │   ├── development/     # Development guides
│   │   ├── frontend/        # Frontend documentation
│   │   ├── guides/          # How-to guides
│   │   ├── training/        # ISTQB training materials
│   │   └── tutorials/       # Platform tutorials
│   │
│   ├── CHANGELOG.md         # Version history
│   ├── CLAUDE.md           # AI assistant guidelines
│   └── README.md           # Project overview
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
│   ├── dev-start.js        # Development startup script
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