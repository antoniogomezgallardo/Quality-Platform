# Quality Platform - Setup & Troubleshooting Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 20+ (LTS recommended)
- **pnpm**: Version 8+ (preferred package manager)
- **Git**: For version control
- **VS Code**: Recommended editor with workspace settings

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/antoniogomezgallardo/Quality-Platform.git
cd Quality-Platform

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local  # Or create manually

# 4. Initialize database
npx prisma migrate dev     # Creates database and applies migrations
npx prisma generate        # Generates Prisma client
pnpm db:seed              # Seeds with sample data

# 5. 🌟 Start development environment
pnpm dev                  # Starts both API (3001) + Web (4200)
```

## 🔧 Environment Configuration

### Required Environment Variables

Create `.env.local` in the project root:

```bash
# Database Configuration
DATABASE_URL="file:./dev.db"  # SQLite for development
# For production: DATABASE_URL="postgresql://user:password@localhost:5432/quality_platform"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
PORT=3001                 # API server port
API_BASE_URL="http://localhost:3001"

# Optional Configuration
LOG_LEVEL="debug"
```

### Web Application Environment

Create `web/.env.local`:

```bash
# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"  # API base URL for frontend
```

### Security Notes
- ⚠️ **Never commit .env files to version control**
- 🔑 **Use strong, unique JWT secrets in production**
- 🛡️ **Change default JWT secret before deployment**
- ⏰ **Consider shorter JWT expiration for sensitive applications**

## 🖥️ Development Environment

### Enhanced Development Scripts

The Quality Platform includes robust development tooling that resolves common issues automatically:

#### `pnpm dev` - Automated Development Environment

**Features:**
- 🔄 **Port Conflict Resolution**: Automatically kills processes blocking development ports
- 🧹 **Build Cache Cleanup**: Removes corrupted build directories (`.next`, `dist`)
- 📊 **Health Monitoring**: Validates server status and port availability
- 🎯 **Server Coordination**: Starts API first, then Web application
- 🛠️ **Error Recovery**: Handles permission issues gracefully

**What it does:**
1. Kills existing processes on ports 3001, 4200, 5555
2. Cleans build directories that may be corrupted
3. Starts API server with health checks
4. Starts Web server after API is ready
5. Provides colored console output for debugging

#### `pnpm dev:stop` - Comprehensive Cleanup

**Features:**
- 🛑 **Graceful Shutdown**: Properly terminates development servers
- 🌲 **Process Tree Termination**: Uses Windows `taskkill /F /T` for complete cleanup
- 🛡️ **Smart Protection**: Protects Claude Code and VS Code processes
- 🔍 **Port Validation**: Ensures ports are properly released

#### Additional Commands

```bash
# Development Management
pnpm dev:clean            # Alias for pnpm dev
pnpm dev:reset            # Stop all + restart fresh
pnpm dev:stop --all       # Aggressive cleanup (use with caution)

# Individual Services
pnpm nx serve api         # API only (http://localhost:3001/api)
pnpm nx serve web         # Web only (http://localhost:4200)

# Database Management
npx prisma studio         # Database GUI (http://localhost:5555)
npx prisma migrate dev    # Apply database migrations
npx prisma migrate reset  # Reset database (development only)
pnpm db:seed             # Seed with sample data
```

## 🌐 Access URLs

When development servers are running:

- **🌐 Web Application**: http://localhost:4200 (Next.js - in development)
- **🔌 API Base**: http://localhost:3001/api (NestJS - fully functional)
- **📚 API Documentation**: http://localhost:3001/api/docs (Swagger UI)
- **🏥 Health Check**: http://localhost:3001/api/health
- **🗃️ Database Studio**: http://localhost:5555 (when running `npx prisma studio`)

## 🐛 Common Issues & Solutions

### Port Conflicts

#### Problem: "EADDRINUSE: address already in use :::4200" or ":::3001"

**Quick Solutions:**
```bash
# Recommended fix - automated cleanup
pnpm dev:stop

# Complete reset if problems persist
pnpm dev:reset

# Nuclear option - kills ALL Node.js processes (use with caution)
pnpm dev:stop --all
```

**Manual Windows Commands (if automated cleanup fails):**
```bash
# Find processes using specific ports
netstat -ano | findstr :4200
netstat -ano | findstr :3001

# Kill specific process ID (replace XXXX with actual PID)
taskkill /F /PID XXXX

# Kill process tree (more effective)
taskkill /F /T /PID XXXX
```

#### Root Cause Prevention:
- Always use `pnpm dev:stop` before closing your terminal
- Use `pnpm dev:reset` if you encounter any startup issues
- Avoid force-closing terminal windows during development

### Inspector/Debugger Port Conflicts

#### Problem: "Starting inspector on 127.0.0.1:9230 failed: address already in use"

**✅ This issue has been RESOLVED in v1.6.1**

**Solution:** The enhanced development scripts now automatically handle this by:
- Removing hardcoded inspector ports from development configuration
- Using dynamic port assignment for Node.js debugging
- Comprehensive process cleanup before server startup

**If the issue persists:**
```bash
# Kill processes on inspector ports
netstat -ano | findstr :9230
netstat -ano | findstr :9231
taskkill /F /PID [PID_NUMBER]
```

### File Permission Errors (EPERM)

#### Problem: `EPERM: operation not permitted, open 'web\.next\trace'`

**✅ This issue is now handled automatically by the development scripts**

**Automated Solution:** The `pnpm dev` command now:
- Removes read-only attributes from build directories
- Uses multiple cleanup methods for robust file removal
- Handles Windows-specific file locking issues

**Manual Recovery (if needed):**
```bash
# Remove read-only attributes (Windows)
attrib -R "web\.next\*.*" /S /D

# Force delete directory
rmdir /S /Q "web\.next"
```

**Root Causes:**
- Windows file system locking
- Antivirus software interference
- Previous crashed processes holding file handles

### Build Directory Corruption

#### Problem: Compilation errors, stale cache, "module not found" errors

**Automated Solution:**
```bash
# The enhanced dev script handles this automatically
pnpm dev:reset
```

**Manual Cleanup (if needed):**
```bash
# Stop development servers
pnpm dev:stop

# Remove corrupted directories
# These are automatically cleaned by pnpm dev:
# - web/.next
# - dist
# - node_modules/.cache
# - web/.swc

# Restart development
pnpm dev
```

### Tailwind CSS Build Errors

#### Problem: PostCSS plugin errors, CSS compilation issues

**✅ Resolved in v1.6.1 with proper Tailwind CSS v4 configuration**

**Current Configuration:**
- **PostCSS**: Uses `@tailwindcss/postcss` plugin for v4 compatibility
- **CSS Import**: Uses `@import "tailwindcss"` syntax in `global.css`
- **Configuration**: Proper `tailwind.config.js` with v4-compatible settings

**If issues persist:**
```bash
# Clear Next.js cache
pnpm dev:reset

# Verify configuration files:
# - web/postcss.config.js should use '@tailwindcss/postcss'
# - web/src/app/global.css should use '@import "tailwindcss"'
# - web/tailwind.config.js should exist with proper configuration
```

### Database Issues

#### Problem: Database connection errors, migration failures

**Solutions:**
```bash
# Reset database (development only)
npx prisma migrate reset

# Apply pending migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Verify database connection
npx prisma db pull  # Should show existing schema
```

**Database File Location:**
- Development: `apps/api/src/dev.db` (SQLite)
- Test: Configured per test suite

## 🖥️ Windows-Specific Issues

### Antivirus Interference
- **Symptom**: Files cannot be deleted, permission errors during builds
- **Solution**: Add project folder to antivirus exclusions
- **Path to exclude**: `C:\Users\[YourName]\path\to\Quality-Platform`

### PowerShell Execution Policy
- **Symptom**: Scripts fail to run with execution policy errors
- **Solution**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Long Path Names
- **Symptom**: "Path too long" errors during npm/pnpm operations
- **Solution**: Enable long path support in Windows or move project closer to root drive

### Windows Defender Real-Time Protection
- **Symptom**: Slow file operations, permission errors
- **Solution**: Add exclusions for:
  - Project directory
  - Node.js installation directory
  - npm/pnpm cache directories

## 🔄 Recovery Procedures

### Complete Environment Reset

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

### Network/Port Issues

```bash
# Check what's using your ports
netstat -ano | findstr :4200
netstat -ano | findstr :3001

# Reset network stack (Administrator Command Prompt)
netsh int ip reset
netsh winsock reset
# Restart computer after these commands
```

### Git Repository Issues

```bash
# Reset to known good state
git status
git stash  # Save any local changes
git checkout develop
git pull origin develop

# If you have local commits to preserve:
git checkout -b backup-branch  # Save current state
git checkout develop
git pull origin develop
```

## 📊 Health Check & Monitoring

### Development Server Health

The development environment includes comprehensive health monitoring:

```bash
# Check API server status
curl http://localhost:3001/api/health

# Check database connectivity
curl http://localhost:3001/api/health/ready

# Monitor process status
# The dev scripts provide colored console output showing:
# - Port cleanup status
# - Server startup progress
# - Health check results
# - Error messages and warnings
```

### System Requirements Validation

```bash
# Check Node.js version (should be 20+)
node --version

# Check pnpm version (should be 8+)
pnpm --version

# Check available disk space (need ~2GB for node_modules)
# Windows: dir
# Linux/Mac: df -h

# Check available memory (recommend 8GB+ RAM)
# Windows: wmic OS get TotalVisibleMemorySize /value
# Linux: free -h
# Mac: vm_stat
```

## 🛠️ IDE Setup (VS Code)

### Recommended Extensions

The project includes VS Code workspace settings. Install these extensions:

- **TypeScript and JavaScript Language Features** (built-in)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - CSS class suggestions
- **Prisma** - Database schema editing
- **Jest** - Test running and debugging
- **GitLens** - Enhanced Git capabilities

### Workspace Configuration

The project includes `.vscode/settings.json` with:
- Prettier as default formatter
- Auto-format on save
- ESLint integration
- File associations for better editing experience

### Debugging Configuration

VS Code debugging is configured for:
- **API Debugging**: Debug NestJS application with breakpoints
- **Jest Tests**: Debug unit tests with IDE integration
- **Database Queries**: Prisma client debugging

## 🎯 Performance Optimization

### Development Performance

If development is slow:

```bash
# Clear all caches
pnpm dev:stop
rm -rf node_modules/.cache
rm -rf web/.next
rm -rf dist

# Restart with clean slate
pnpm dev

# Monitor system resources
# - Check CPU usage (Node.js processes)
# - Check memory usage (should be <4GB total)
# - Check disk I/O (antivirus scanning can slow things down)
```

### Build Performance

```bash
# Optimize for faster builds
export NODE_OPTIONS="--max-old-space-size=8192"  # Increase Node.js memory

# Use faster builds (development only)
# These settings are already configured in next.config.js
```

## 📞 Getting Help

### Self-Service Debugging

1. **Check Process Status**: Run `pnpm dev:stop` and verify no errors
2. **Restart Terminal**: Close and reopen with administrator privileges if needed
3. **Check Task Manager**: Look for orphaned Node.js processes
4. **Review Logs**: Check console output for specific error messages
5. **System Restart**: As last resort, restart Windows to clear all processes

### Documentation Resources

- **API Documentation**: http://localhost:3001/api/docs (when running)
- **Project Structure**: `docs/PROJECT_STRUCTURE.md`
- **Testing Guide**: `docs/TESTING_GUIDE.md`
- **Development Guide**: `CLAUDE.md`

### Common Error Patterns

| Error Pattern | Quick Fix |
|---------------|-----------|
| Port already in use | `pnpm dev:stop` |
| Permission denied | Run terminal as administrator |
| Module not found | `pnpm install` |
| Database error | `npx prisma migrate reset` |
| Build cache issues | `pnpm dev:reset` |
| Tailwind CSS errors | Already fixed in v1.6.1 |
| Inspector port conflicts | Already fixed in v1.6.1 |

## 🎉 Success Indicators

Your development environment is working correctly when:

- ✅ `pnpm dev` starts both servers without errors
- ✅ http://localhost:3001/api returns welcome message
- ✅ http://localhost:3001/api/docs shows Swagger UI
- ✅ http://localhost:4200 loads Next.js application
- ✅ No port conflict or permission errors in console
- ✅ Database operations work (`npx prisma studio`)

## 🔧 Advanced Configuration

### Custom Port Configuration

If you need to use different ports:

```bash
# Edit package.json scripts or create custom scripts
# API_PORT=3002 WEB_PORT=4201 pnpm dev

# Update environment variables accordingly
# PORT=3002 in .env.local
# Update NEXT_PUBLIC_API_URL in web/.env.local
```

### Database Configuration

```bash
# Switch to PostgreSQL (production-like)
# 1. Install PostgreSQL locally
# 2. Update DATABASE_URL in .env.local
# 3. Run: npx prisma migrate reset
```

### Multi-Developer Setup

```bash
# Each developer should use unique database
# DATABASE_URL="file:./dev-[developer-name].db"

# Or use Docker for consistency
# See docs/deployment/docker.md (when available)
```

---

*This guide is continuously updated based on common issues and developer feedback. The enhanced development environment (v1.6.1) has resolved most persistent setup issues.*