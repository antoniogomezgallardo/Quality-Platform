# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the Quality Platform monorepo - a reusable quality platform designed to accelerate projects with good practices, train teams in QA/QE approaches, and demonstrate ISTQB-aligned concepts.

## Project Philosophy

When working on this codebase:

1. **Prioritize business value** - Justify all changes in business terms (risk reduction, decision enablement, metric improvement)
2. **Maintain functional clarity** - Write acceptance criteria in business language, avoid technical jargon unless essential
3. **Follow GitFlow methodology** - Use feature/, bugfix/, release/, and hotfix/ branches appropriately
4. **Ensure quality gates** - All code must pass linting, type checking, and tests before merging

## Monorepo Structure

The project follows this structure:

```
quality-platform/
├── api/            # NestJS API application
├── web/            # Next.js 15 web application with React 19
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── (auth)/     # Authentication pages (login/register)
│   │   │   ├── products/   # Product catalog and detail pages
│   │   │   ├── cart/       # Shopping cart page
│   │   │   └── checkout/   # Checkout pages
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Authentication forms and components
│   │   │   ├── cart/       # Cart drawer and cart-related components
│   │   │   ├── layout/     # Navigation, layout, and structural components
│   │   │   ├── products/   # Product cards, grids, filters, search
│   │   │   └── ui/         # Base UI components (buttons, forms, etc.)
│   │   └── lib/            # Utilities and configurations
│   │       ├── api/        # API client and data fetching utilities
│   │       ├── auth/       # Authentication context and utilities
│   │       ├── hooks/      # Custom React Query hooks
│   │       └── stores/     # Zustand stores
├── web-e2e/        # Web e2e tests
├── api-e2e/        # API e2e tests
├── libs/           # Shared libraries (future)
├── tools/          # Development tools (future)
├── templates/      # Document templates (future)
├── examples/       # Test implementation examples (future)
└── docs/           # Project documentation
```

## Development Commands

### 🚀 Port Management Solution

The project includes an automated port management system (`dev-start.js`) that solves common development issues:

**Problems Solved:**
- Port conflicts when starting development servers
- Orphaned Node.js processes blocking ports
- Build cache corruption causing compilation errors
- Manual process management and cleanup

**Features:**
- Automatically kills processes on target ports (3001, 4200, 5555, etc.)
- Cleans corrupted build directories (`.next`, `dist`)
- Starts servers in correct dependency order (API first, then Web)
- Colored console output for easy debugging
- Graceful error handling for permission issues
- Single command to start entire development environment

**Usage:**
```bash
pnpm dev        # Recommended way to start development environment
pnpm dev:clean  # Alias for the same command
```

**What it does:**
1. Kills existing processes on development ports
2. Cleans build directories that may be corrupted
3. Starts API server on port 3001 with proper environment variables
4. Starts Web server on port 4200
5. Provides status updates and access URLs

### Initial Setup (Completed ✅)
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local  # If .env.example exists, or create .env.local manually

# Required environment variables for .env.local:
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="your-super-secret-jwt-key-change-in-production" 
# JWT_EXPIRES_IN="7d"
# NODE_ENV="development"
# PORT=3000

# Initialize and setup database
npx prisma migrate dev     # Creates database and applies migrations
npx prisma generate       # Generates Prisma client
```

### Current Development (Implemented)
```bash
# 🚀 RECOMMENDED: Start Both Servers with Port Management
pnpm dev                       # Start API (port 3001) + Web (port 4200) with auto-cleanup
pnpm dev:clean                 # Same as above, alias for convenience

# 🛑 Stop Development Servers (NEW)
pnpm dev:stop                  # Stop development servers cleanly
pnpm dev:stop --all            # Stop ALL Node.js processes (use with caution)
pnpm dev:reset                 # Stop all processes and restart development environment

# Individual Server Commands
pnpm nx serve api              # Start NestJS API server on http://localhost:3001/api
pnpm nx serve web              # Start Next.js web app on http://localhost:4200

# 🗃️ Database Management (Prisma)
npx prisma migrate dev         # Create and apply database migrations
npx prisma generate            # Generate Prisma client after schema changes
npx prisma studio              # Open Prisma Studio (database GUI) on http://localhost:5555
pnpm db:seed                   # Seed database with sample products and users
npx prisma migrate reset       # Reset database (development only)
npx prisma db push             # Push schema changes without migration files

# 🏗️ Building and Testing
pnpm nx build api              # Build API for production
pnpm nx build web              # Build web app for production
pnpm nx lint web               # Lint web application code with ESLint
pnpm nx test api               # Run API unit tests (when implemented)
pnpm nx test web               # Run web unit tests (when implemented)
pnpm nx e2e api-e2e            # Run API integration tests (when implemented)
pnpm nx e2e web-e2e            # Run web e2e tests (when implemented)

# 🌐 Access URLs (when servers are running):
# Web Application:    http://localhost:4200
# API Base:           http://localhost:3001/api
# API Documentation:  http://localhost:3001/api/docs
# Database Studio:    http://localhost:5555 (when running prisma studio)
# API Health Check:   http://localhost:3001/api/health
```

### Quality Checks

```bash
# Phase 5 Quality Engineering Tools (Implemented ✅)
node scripts/quality-metrics.js  # Generate comprehensive quality report
pnpm test:unit                   # Run Jest unit tests with coverage
pnpm test:integration           # Run Supertest API integration tests
pnpm test:e2e                   # Run Playwright end-to-end tests
pnpm test:contract              # Run API contract validation tests

# Legacy commands (to be implemented in future phases)
pnpm quality:check        # Run all quality validations
pnpm quality:report       # Generate executive summary
pnpm risk:assess --pr=123 # Analyze PR for risk
pnpm contract:validate    # Check for breaking changes
pnpm flow:trace --flow=order-checkout # Visualize business flow
```

### Testing

```bash
# Phase 5 Testing Framework (Implemented ✅)
pnpm test              # Run all tests (unit + integration + e2e)
pnpm test:unit         # Run Jest unit tests with coverage reporting
pnpm test:integration  # Run Supertest integration tests
pnpm test:e2e          # Run Playwright end-to-end tests
pnpm test:contract     # Run API contract validation tests
pnpm test:watch        # Run tests in watch mode
pnpm test -- AuthService # Run specific test suite

# Quality Metrics and Analysis
node scripts/quality-metrics.js # Generate comprehensive quality metrics
```

### Development

```bash
pnpm dev               # Start development server
pnpm build             # Build all packages
pnpm lint              # Run linting
pnpm format            # Format code
pnpm typecheck         # Run TypeScript checks
```

### Code Generation

```bash
pnpm generate:module --name=payment     # Create new module
pnpm generate:tests --type=integration --module=payment # Add tests
pnpm generate:component --name=Button   # Create component
```

### Frontend Development (Substantially Complete ✅)

```bash
# 🌐 Web Application Development
pnpm nx serve web               # Start Next.js dev server (http://localhost:4200)
pnpm nx build web              # Build web app for production
pnpm nx lint web               # Lint web application code with ESLint
pnpm nx test web               # Run web unit tests (when implemented)
pnpm nx e2e web-e2e            # Run web e2e tests (when implemented)

# 🔧 Frontend Code Quality
pnpm nx lint web --fix         # Auto-fix linting issues
pnpm nx test web --watch       # Run tests in watch mode
pnpm nx build web --prod       # Production build with optimizations
```

**Implemented Features ✅**
- **Homepage**: Modern responsive landing page with gradients and animations
- **Authentication**: Complete login/register system with JWT integration
- **Product Catalog**: Browse products with search, filters, and pagination
- **Shopping Cart**: Full cart functionality with persistent storage and real-time updates
- **Navigation**: Dynamic navbar with cart badge and user authentication status
- **Responsive Design**: Mobile-first design optimized for all screen sizes
- **State Management**: Zustand stores with localStorage persistence
- **API Integration**: React Query hooks for efficient data fetching

**Component Architecture:**
```
web/src/components/
├── auth/         # Login, Register, AuthForm components ✅
├── products/     # ProductCard, ProductGrid, ProductFilters ✅
├── cart/         # CartDrawer, CartItem, CartBadge ✅
├── ui/           # Button, Input, Loading components ✅
└── layout/       # Navigation, Layout components ✅
```

**State Management (Zustand) ✅**
```
web/src/lib/stores/
├── auth.ts       # User authentication state and JWT management
├── cart.ts       # Shopping cart state with localStorage persistence
└── products.ts   # Product catalog state and filtering
```

**API Integration (React Query) ✅**
```
web/src/lib/hooks/
├── useAuth.ts    # Authentication hooks (login, register, logout)
├── useProducts.ts # Product fetching and filtering hooks
└── useCart.ts    # Shopping cart API integration hooks
```

## Architecture Principles

### Testing Strategy

- **Test Pyramid**: 70% unit, 20% integration, 10% E2E
- **Test Naming**: Use Given-When-Then format
- **Test Data**: Use factories and builders, not hardcoded data

### Quality Agents Architecture

The platform includes specialized agents:

- **QualityAgent**: Runs tests and generates reports
- **ContractAgent**: Validates API compatibility
- **RiskAgent**: Analyzes changes for impact
- **MetricsAgent**: Collects quality metrics
- **DocumentationAgent**: Syncs docs with code

### Contract-First Development

All services must define OpenAPI contracts before implementation. Contracts serve as the source of truth for API compatibility.

### Functional Observability

Every critical business flow must expose observable signals without requiring code knowledge:

- Business metrics (orders completed, users registered)
- Flow health indicators (success rates, error patterns)
- Performance metrics (response times per flow)

## Task Management Rules

When creating or modifying tasks:

1. Use business language, not technical jargon
2. Include clear acceptance criteria (3-5 bullets)
3. Specify deliverables (checklist, report, evidence)
4. Prioritize by risk/impact, not technology
5. Keep tasks to 1-4 hours; split if larger

Task format:

```
Title: [Verb + Outcome]
Description: [Business value statement]
Acceptance Criteria:
  1. [Observable outcome]
  2. [Measurable result]
  3. [Verifiable artifact]
Dependencies: [None or list]
Priority: [High/Medium/Low based on risk]
```

## Quality Criteria for All Changes

Every change must meet these criteria:

1. **Functional clarity**: Purpose and usage are documented
2. **Robustness**: Critical paths have error handling
3. **Compatibility**: Breaking changes are announced
4. **Testability**: Changes include appropriate tests
5. **Observability**: Business flows remain traceable

## GitFlow Workflow

**⚠️ CRITICAL: NEVER work directly on `develop` or `main` branches!**

Git pre-commit hook is installed to prevent direct commits to these branches.

### Branch Flow

1. **New Feature Development**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/description
   # Make changes and commit
   git push origin feature/description
   # Create PR to merge into develop
   ```

2. **Bug Fixes**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b bugfix/description
   # Fix bug and commit
   git push origin bugfix/description
   # Create PR to merge into develop
   ```

3. **Release Process**:
   ```bash
   # After features are merged to develop
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.x.x
   # Final testing and minor fixes only
   git checkout main
   git merge release/v1.x.x
   git tag v1.x.x
   git push origin main --tags
   git checkout develop
   git merge release/v1.x.x  # Merge back any release fixes
   ```

4. **Hotfixes**:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/v1.x.y-description
   # Fix critical issue
   git checkout main
   git merge hotfix/v1.x.y-description
   git tag v1.x.y
   git checkout develop
   git merge hotfix/v1.x.y-description  # Apply fix to develop too
   ```

### Branch Naming

- `feature/description` (no JIRA required, descriptive name)
- `bugfix/description`
- `release/v1.2.0`
- `hotfix/v1.2.1-description`

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

### PR Requirements

1. All CI checks pass
2. At least 1 approval
3. Documentation updated if needed
4. Quality gates met (coverage, performance, security)

### GitFlow Prevention Measures

- **Pre-commit hook**: Blocks commits to develop/main branches
- **Branch protection**: Use GitHub/GitLab branch protection rules in production
- **Code review**: All changes must go through PR process

## Success Metrics to Track

When implementing features, ensure they contribute to:

- **Reducing escaped defects**
- **Shortening cycle time** from "ready to test" to "ready to release"
- **Increasing perceived reliability** of critical flows
- **Decreasing rate of breaking changes**
- **Improving internal adoption** of quality practices

## Technology Stack (Implemented)

- **Monorepo**: Nx Workspace
- **Runtime**: Node.js 20+
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Backend**: NestJS with OpenAPI/Swagger
- **Authentication**: JWT with Passport.js (Local + JWT strategies)
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Validation**: class-validator with comprehensive DTOs
- **Security**: bcryptjs password hashing, authentication guards
- **Testing**: Jest (ready), Supertest (ready) - *tests to be implemented*
- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Data Fetching**: TanStack React Query (@tanstack/react-query)
- **Documentation**: Markdown + Swagger UI

## Environment Variables

Required environment variables (in .env or .env.local):

```env
# Database Configuration
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://user:password@localhost:5432/quality_platform" # PostgreSQL for production

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration  
NODE_ENV="development"
PORT=3000
API_BASE_URL="http://localhost:3000"

# Optional: Logging
LOG_LEVEL=debug

# Frontend Configuration (web/.env.local)
NEXT_PUBLIC_API_URL="http://localhost:3000/api"  # API base URL for frontend
```

**Important Security Notes:**
- Never commit .env files to version control
- Use strong, unique JWT secrets in production  
- Change default JWT secret before deployment
- Consider shorter JWT expiration for sensitive applications

## Troubleshooting Development Issues

### Common Startup Problems

#### 🔴 Port Already in Use Errors

**Problem**: `EADDRINUSE: address already in use :::4200` or `:::3001`

**Solutions**:
```bash
# Quick fix - stop all development processes
pnpm dev:stop

# Complete reset if problems persist
pnpm dev:reset

# Manual cleanup if scripts fail
pnpm dev:stop --all  # Kills ALL Node.js processes (use with caution)
```

**Manual Windows Commands** (if automated cleanup fails):
```bash
# Find processes using specific ports
netstat -ano | findstr :4200
netstat -ano | findstr :3001

# Kill specific process ID (replace XXXX with actual PID)
taskkill /F /PID XXXX
```

#### 🔴 Inspector/Debugger Port Conflicts

**Problem**: `Starting inspector on 127.0.0.1:9230 failed: address already in use`

**Solution**: This is now automatically handled by the enhanced `pnpm dev` command. If it persists:
```bash
# Kill processes on inspector ports
netstat -ano | findstr :9230
netstat -ano | findstr :9231
taskkill /F /PID [PID_NUMBER]
```

#### 🔴 File Permission Errors (EPERM)

**Problem**: `EPERM: operation not permitted, open 'web\.next\trace'`

**Solutions**:
```bash
# The enhanced dev script now handles this automatically, but if it fails:

# Remove read-only attributes (Windows)
attrib -R "web\.next\*.*" /S /D

# Force delete directory
rmdir /S /Q "web\.next"

# Alternative cleanup
rd /S /Q "web\.next"
```

**Root Cause**: Windows file locking, antivirus interference, or previous crashed processes.

#### 🔴 Build Directory Corruption

**Problem**: Compilation errors, stale cache, or "module not found" errors

**Solution**:
```bash
# Clean restart (recommended)
pnpm dev:reset

# Manual cleanup
pnpm dev:stop
# Remove these directories manually if needed:
# - web\.next
# - dist
# - node_modules\.cache
# - web\.swc
pnpm dev
```

### Windows-Specific Issues

#### Antivirus Interference
- **Symptom**: Files cannot be deleted, permission errors
- **Solution**: Add project folder to antivirus exclusions

#### PowerShell Execution Policy
- **Symptom**: Scripts fail to run
- **Solution**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

#### Long Path Names
- **Symptom**: Path too long errors
- **Solution**: Enable long path support in Windows or move project closer to root

### Recovery Procedures

#### Complete Environment Reset
```bash
# 1. Stop everything
pnpm dev:stop --all

# 2. Clean dependencies (if needed)
rm -rf node_modules
pnpm install

# 3. Clean database (if corrupted)
npx prisma migrate reset

# 4. Restart fresh
pnpm dev
```

#### Network/Port Issues
```bash
# Check what's using your ports
netstat -ano | findstr :4200
netstat -ano | findstr :3001

# Reset network stack (Administrator CMD)
netsh int ip reset
netsh winsock reset
```

### Prevention Best Practices

1. **Always use `pnpm dev:stop`** before closing your terminal
2. **Use `pnpm dev:reset`** if you encounter any startup issues
3. **Keep your terminal open** while developing to allow proper cleanup
4. **Avoid force-closing** terminal windows during development
5. **Add project to antivirus exclusions** to prevent file locking

### Getting Help

If troubleshooting steps don't resolve the issue:

1. **Check Process Status**: Run `pnpm dev:stop` and verify no errors
2. **Restart Terminal**: Close and reopen your terminal with administrator privileges
3. **Check Windows Task Manager**: Look for orphaned Node.js processes
4. **System Restart**: As a last resort, restart Windows to clear all processes

### Monitoring and Prevention

The enhanced development scripts now include:

- **Automatic port conflict detection** before startup
- **Improved cleanup** of orphaned processes
- **File permission handling** for Windows
- **Process monitoring** during development
- **Graceful shutdown** handling for Ctrl+C

## Performance Budgets

Maintain these performance targets:

- API response: < 200ms (p95)
- Page load: < 3s (3G network)
- Bundle size: < 200KB (gzipped)
- Database queries: < 50ms

## Security Considerations

- Run security scans on every commit (SAST)
- Check dependencies for vulnerabilities (Snyk/Dependabot)
- Never commit secrets (use .env.local)
- Implement GDPR compliance from the start
- Follow OWASP guidelines for web security

## ISTQB Alignment

This platform demonstrates ISTQB concepts with comprehensive training materials:

- **Foundation Level**: Complete certification preparation in `docs/training/istqb-foundation-level.md`
- **Test Design**: Practical examples of test design techniques with real code
- **Test Levels**: Implementation of unit, integration, system, and acceptance testing
- **Test Types**: Functional, non-functional, and structural testing examples
- **Test Automation**: Comprehensive automation architecture with Jest, Supertest, and Playwright
- **Quality Management**: Metrics collection, analysis, and continuous improvement processes

### Training Materials (Phase 5 ✅)

- **ISTQB Foundation Level Preparation**: Complete syllabus coverage with 40 sample exam questions
- **Technologies Zero to Hero**: 52-week comprehensive learning curriculum
- **Quality Platform Usage Tutorials**: 12-part tutorial series from beginner to expert
- **Hands-on Examples**: Real-world testing scenarios using the platform

Map all test examples to relevant ISTQB syllabi sections for training purposes.
