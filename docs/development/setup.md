# Development Setup Guide

## Overview

This guide provides comprehensive instructions for setting up the Quality Platform development environment. The platform uses modern tools and follows best practices for enterprise-level development.

## Prerequisites

### Required Software

1. **Node.js** (v20.x or higher)
   ```bash
   # Check version
   node --version
   # Should return v20.x.x or higher
   ```

2. **pnpm** (Package Manager)
   ```bash
   # Install pnpm globally
   npm install -g pnpm
   
   # Verify installation
   pnpm --version
   ```

3. **Git** (for version control)
   ```bash
   # Check version
   git --version
   ```

### Optional but Recommended

1. **VS Code** - IDE with excellent TypeScript support
2. **Prisma Studio** - Database GUI (comes with Prisma)
3. **Postman/Insomnia** - API testing (though Swagger UI is built-in)

## ⚡ Port Management

The Quality Platform includes an automated port management system that:
- Resolves port conflicts automatically
- Cleans build caches
- Starts servers in correct order
- Provides comprehensive error handling

## Initial Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/antoniogomezgallardo/Quality-Platform.git
cd Quality-Platform
```

### 2. Install Dependencies

```bash
# Install all dependencies using pnpm
pnpm install
```

This will install:
- NestJS framework and related packages
- Prisma ORM and database tools
- JWT authentication libraries
- Validation and security packages
- Development tools (TypeScript, ESLint, Prettier)

### 3. Environment Configuration

Create environment variables file:

```bash
# Create .env file in the project root
touch .env
```

Add the following configuration to `.env`:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
PORT=3000
API_BASE_URL="http://localhost:3000"
```

**Important:** Never commit `.env` files to version control. They are already included in `.gitignore`.

### 4. Database Setup

Initialize the database with Prisma:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma migrate dev
```

This will:
- Create a SQLite database file (`dev.db`) in your project root
- Apply the initial migration with User, Product, Order, and OrderItem tables
- Generate the Prisma client for database operations

### 5. Verify Setup

Start the development server:

```bash
# Start the NestJS API server
pnpm nx serve api
```

You should see output similar to:
```
🚀 Application is running on: http://localhost:3000/api
📚 API Documentation: http://localhost:3000/api/docs
🏥 Health Check: http://localhost:3000/api/health
```

### 6. Test the API

Open your browser and visit:

1. **API Health Check**: http://localhost:3000/api/health
2. **API Documentation**: http://localhost:3000/api/docs
3. **API Welcome**: http://localhost:3000/api

All endpoints should respond successfully.

## Development Workflow

### Daily Development Commands

```bash
# Start development server (with hot reload)
pnpm nx serve api

# Build the API
pnpm nx build api

# Run tests (when implemented)
pnpm nx test api
pnpm nx e2e api-e2e

# Database operations
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Apply schema changes
npx prisma generate      # Regenerate client after schema changes
```

### Code Quality Tools

The project includes several code quality tools:

```bash
# Linting (automatically runs on commit)
npx eslint apps/api/src/**/*.ts

# Formatting (automatically runs on commit)  
npx prettier --write apps/api/src/**/*.ts

# TypeScript checking
npx tsc --noEmit --project apps/api/tsconfig.json
```

### Git Workflow (GitFlow)

The project follows GitFlow methodology:

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make changes, commit following conventional commits
git add .
git commit -m "feat(auth): add password reset functionality"

# Push and create PR to develop
git push origin feature/your-feature-name
```

## IDE Setup (VS Code)

### Recommended Extensions

The project includes VS Code settings in `.vscode/settings.json`. Install these extensions for the best experience:

1. **TypeScript and JavaScript Support** (built-in)
2. **Prisma** - Database schema support
3. **ESLint** - Code linting
4. **Prettier** - Code formatting
5. **REST Client** - API testing within VS Code

### VS Code Configuration

The project includes workspace settings that:
- Auto-format on save
- Run ESLint on save
- Use Prettier for formatting
- Configure proper TypeScript paths

## Database Development

### Prisma Studio

Launch the database GUI:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- Browse all tables and data
- Create, edit, and delete records
- Visualize relationships
- Run queries

### Schema Changes

When you modify `prisma/schema.prisma`:

```bash
# 1. Generate migration
npx prisma migrate dev --name describe_your_changes

# 2. This automatically runs:
#    - Creates migration files
#    - Applies migration to database  
#    - Regenerates Prisma client
```

### Database Reset (Development Only)

To reset your development database:

```bash
# WARNING: This deletes all data
npx prisma migrate reset
```

## API Testing

### Using Swagger UI

1. Start the development server: `pnpm nx serve api`
2. Open http://localhost:3000/api/docs
3. Test endpoints directly in the browser

### Authentication Testing

1. **Register a user**:
   ```bash
   POST /api/auth/register
   {
     "email": "test@example.com",
     "username": "testuser",
     "password": "password123",
     "firstName": "Test",
     "lastName": "User"
   }
   ```

2. **Copy the access_token from the response**

3. **Access protected endpoints**:
   - Click "Authorize" in Swagger UI
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - Test the `/api/auth/me` endpoint

### Using curl

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser", 
    "password": "password123"
  }'

# Login (alternative to registration)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Use the access_token from above response
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Error: Port 3000 is already in use
# Solution: Kill the process or use different port
npx kill-port 3000
# Or set different port:
PORT=3001 pnpm nx serve api
```

#### Database Connection Issues
```bash
# Error: Can't reach database server
# Solution: Regenerate Prisma client
npx prisma generate
npx prisma migrate dev
```

#### Module Resolution Errors
```bash
# Error: Cannot find module
# Solution: Clear Nx cache and reinstall
pnpm nx reset
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### TypeScript Compilation Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit --project apps/api/tsconfig.json

# Verify all imports and dependencies
pnpm nx build api
```

### Environment Issues

#### Missing Environment Variables
Ensure your `.env` file contains all required variables:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

#### Database File Permissions
On Unix systems, ensure the database file is writable:
```bash
chmod 664 dev.db
```

### Performance Issues

#### Slow Startup
- Clear Nx cache: `pnpm nx reset`
- Update Node.js to latest LTS version
- Check for conflicting processes

#### Database Queries
- Use Prisma Studio to inspect query performance
- Check database file size (SQLite)
- Monitor memory usage during development

## Development Best Practices

### Code Organization

1. **Follow the existing module structure**:
   ```
   feature/
   ├── dto/              # Data transfer objects
   ├── guards/           # Route guards
   ├── feature.controller.ts
   ├── feature.service.ts
   └── feature.module.ts
   ```

2. **Use TypeScript strictly**:
   - Enable all strict mode flags
   - Define proper types for all functions
   - Use DTOs for all API endpoints

3. **Follow naming conventions**:
   - Controllers: `FeatureController`
   - Services: `FeatureService`
   - DTOs: `CreateFeatureDto`, `UpdateFeatureDto`
   - Files: `feature.controller.ts`, `feature.service.ts`

### API Development

1. **Always use DTOs with validation**:
   ```typescript
   export class CreateUserDto {
     @IsEmail()
     @IsNotEmpty()
     email: string;
   }
   ```

2. **Document all endpoints with OpenAPI**:
   ```typescript
   @ApiOperation({ summary: 'Create user' })
   @ApiResponse({ status: 201, type: UserResponseDto })
   @Post()
   async create(@Body() dto: CreateUserDto) {}
   ```

3. **Use proper HTTP status codes**:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error

### Database Development

1. **Use transactions for data consistency**:
   ```typescript
   await prisma.$transaction([
     prisma.user.create({ data: userData }),
     prisma.profile.create({ data: profileData }),
   ]);
   ```

2. **Optimize queries**:
   ```typescript
   // Good: Select only needed fields
   const users = await prisma.user.findMany({
     select: { id: true, email: true },
   });

   // Good: Use pagination
   const users = await prisma.user.findMany({
     skip: offset,
     take: limit,
   });
   ```

3. **Handle errors gracefully**:
   ```typescript
   try {
     const user = await prisma.user.create({ data });
   } catch (error) {
     if (error.code === 'P2002') {
       throw new ConflictException('User already exists');
     }
     throw error;
   }
   ```

## Next Steps

Once your development environment is set up:

1. **Explore the API documentation**: http://localhost:3000/api/docs
2. **Read the architecture guide**: `docs/api/architecture.md`
3. **Review the database schema**: `docs/database/schema.md`
4. **Check out the authentication flow**: `docs/api/authentication.md`

For contributing to the project, see the [Development Guide](../../CLAUDE.md).

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [troubleshooting section](#troubleshooting) above
2. Review existing [GitHub issues](https://github.com/antoniogomezgallardo/Quality-Platform/issues)
3. Create a new issue with detailed information about your environment and the problem

The development environment is designed to be straightforward and consistent across different platforms. Following this guide should give you a fully functional Quality Platform development setup.