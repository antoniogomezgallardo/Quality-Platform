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

## Monorepo Structure (Once Initialized)

The project will follow this structure:

```
quality-platform/
├── apps/           # Deployable applications (web, api, docs)
├── libs/           # Shared libraries (contracts, test-utils, metrics)
├── tools/          # Development tools (agents, generators, scripts)
├── templates/      # Document templates (strategies, checklists)
├── examples/       # Test implementation examples
└── docs/           # Project documentation
```

## Development Commands

### Initial Setup (Completed ✅)
```bash
pnpm install
cp .env.example .env.local
# Database setup will be added in next phase
```

### Current API Development
```bash
# Start NestJS API server
pnpm nx serve api               # http://localhost:3000/api

# API Testing and Building
pnpm nx test api               # Run API unit tests
pnpm nx e2e api-e2e            # Run API integration tests
pnpm nx build api              # Build API for production
pnpm nx test api --watch       # Watch mode for development

# Available Endpoints:
# GET /api                     - API welcome message  
# GET /api/health             - Health check
# GET /api/health/ready       - Readiness probe
# GET /api/health/live        - Liveness probe
# GET /api/docs               - Interactive Swagger documentation
```

### Quality Checks

```bash
pnpm quality:check        # Run all quality validations
pnpm quality:report       # Generate executive summary
pnpm risk:assess --pr=123 # Analyze PR for risk
pnpm contract:validate    # Check for breaking changes
pnpm flow:trace --flow=order-checkout # Visualize business flow
```

### Testing

```bash
pnpm test              # Run all tests
pnpm test:unit         # Run unit tests only
pnpm test:integration  # Run integration tests
pnpm test:e2e          # Run end-to-end tests
pnpm test:watch        # Run tests in watch mode
pnpm test -- OrderService # Run specific test suite
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

### Branch Naming

- `feature/JIRA-123-description`
- `bugfix/JIRA-456-description`
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

## Success Metrics to Track

When implementing features, ensure they contribute to:

- **Reducing escaped defects**
- **Shortening cycle time** from "ready to test" to "ready to release"
- **Increasing perceived reliability** of critical flows
- **Decreasing rate of breaking changes**
- **Improving internal adoption** of quality practices

## Technology Stack (When Implemented)

- **Monorepo**: Nx or Turborepo
- **Runtime**: Node.js 18+
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Frontend**: React/Next.js
- **Backend**: NestJS or Express
- **Testing**: Jest, Testing Library, Playwright
- **Database**: PostgreSQL (production), SQLite (training)
- **Documentation**: Docusaurus

## Environment Variables

Required environment variables (in .env.local):

```
NODE_ENV=development
API_PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
LOG_LEVEL=debug
```

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

This platform demonstrates ISTQB concepts:

- **Foundation Level**: Test design, levels, types
- **Agile Extension**: Sprint testing, CI/CD
- **Test Automation Engineer**: Automation architecture
- **Advanced Level**: Test management, techniques

Map all test examples to relevant ISTQB syllabi sections for training purposes.
