# API Getting Started Guide

## Overview

The Quality Platform API is built with NestJS and provides a RESTful interface for our sample e-commerce application. This API demonstrates best practices in quality engineering, including comprehensive testing, documentation, and monitoring.

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- pnpm (installed globally)

### Running the API

```bash
# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm nx serve api

# Or using npm script
pnpm run dev:api
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

## API Documentation

The API uses OpenAPI 3.0 (Swagger) for documentation. You can access the interactive documentation at http://localhost:3000/api/docs when the server is running.

### Swagger Features

- **Interactive Testing**: Test endpoints directly from the browser
- **Schema Documentation**: Complete request/response schemas
- **Authentication Support**: JWT Bearer token authentication (when implemented)
- **Tag Organization**: Endpoints grouped by functionality

## Development Features

### Global Configuration

The API includes several global configurations:

- **Validation Pipe**: Automatic request validation using class-validator
- **CORS**: Configured for development and production environments  
- **Global Prefix**: All routes prefixed with `/api`
- **Environment Configuration**: Uses `@nestjs/config` for environment management

### Environment Variables

Create a `.env.local` file in the project root:

```env
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
```

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
- Database connectivity (when implemented)
- External service dependencies
- Required configuration

### Liveness Check (`/api/health/live`)
Confirms the application is alive and responsive:
- Process status
- Memory usage
- Basic functionality

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

This API setup provides the foundation for:

1. **Authentication Module**: JWT-based authentication system
2. **Database Integration**: Prisma ORM with PostgreSQL
3. **Product Management**: CRUD operations for products
4. **Order System**: Complete order processing workflow
5. **User Management**: User registration and profile management

Each module will follow the same patterns established in this foundation:
- Comprehensive documentation with Swagger
- Health checks and monitoring
- Input validation and error handling
- Comprehensive testing coverage

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