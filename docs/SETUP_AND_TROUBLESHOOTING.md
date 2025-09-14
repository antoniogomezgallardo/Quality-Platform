# Setup and Troubleshooting Guide

This comprehensive guide covers everything you need to set up the Quality Platform development environment and resolve common issues.

## Table of Contents

- [System Requirements](#system-requirements)
- [Initial Setup](#initial-setup)
- [Development Environment](#development-environment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Development Scripts](#development-scripts)
- [Common Issues & Solutions](#common-issues--solutions)
- [Windows-Specific Troubleshooting](#windows-specific-troubleshooting)
- [Performance Optimization](#performance-optimization)
- [Recovery Procedures](#recovery-procedures)
- [Getting Help](#getting-help)

## System Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **pnpm**: 8.0.0 or higher (package manager)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### Development Tools
- **Git**: 2.30+ with GitFlow support
- **VS Code**: Latest version (recommended)
- **Terminal**: PowerShell (Windows), Terminal (macOS), Bash (Linux)

### Optional Tools
- **Docker**: For containerized development (future)
- **PostgreSQL**: For production database setup
- **Postman**: For API testing

## Initial Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/quality-platform.git
cd quality-platform

# Verify GitFlow is set up
git flow version
```

### 2. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install project dependencies
pnpm install

# Verify installation
pnpm --version
```

### 3. Environment Configuration

```bash
# Create environment file
cp .env.example .env.local

# Edit the environment variables (see Environment Variables section)
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with sample data
pnpm db:seed
```

### 5. Verify Installation

```bash
# Start development servers
pnpm dev

# Verify APIs are working
curl http://localhost:3001/api/health
curl http://localhost:4200
```

## Development Environment

### 🚀 Automated Development Setup

The Quality Platform includes sophisticated development automation that eliminates common issues:

#### Features
- **Automatic Port Management**: Kills conflicting processes on development ports
- **Process Cleanup**: Removes orphaned Node.js processes
- **Build Cache Management**: Cleans corrupted build directories
- **Server Coordination**: Starts API before Web for proper initialization
- **Error Recovery**: Handles permission issues and provides clear status messages

#### Primary Commands

```bash
# 🌟 RECOMMENDED: Complete development environment
pnpm dev                    # Auto-cleanup + start API (3001) + Web (4200)
pnpm dev:clean             # Same as above (alias)

# 🛑 Stop development servers
pnpm dev:stop              # Clean shutdown of development processes
pnpm dev:stop --all        # Stop ALL Node.js processes (use with caution)

# 🔄 Reset and restart
pnpm dev:reset             # Stop all processes and restart clean
```

#### Individual Server Commands
```bash
# Start servers individually (if needed)
pnpm nx serve api          # API server on http://localhost:3001
pnpm nx serve web          # Web app on http://localhost:4200

# Database management
npx prisma studio          # Database GUI on http://localhost:5555
```

#### Development URLs
```bash
# 🌐 Web Application:     http://localhost:4200
# 🔌 API Base:            http://localhost:3001/api
# 📚 API Documentation:   http://localhost:3001/api/docs
# 🔍 Health Check:        http://localhost:3001/api/health
# 🗃️ Database Studio:     http://localhost:5555 (when running)
```

## Database Setup

### Development Database (SQLite)

```bash
# Initialize database
npx prisma migrate dev

# Reset database (removes all data)
npx prisma migrate reset

# View database
npx prisma studio
```

### Production Database (PostgreSQL)

```bash
# Install PostgreSQL locally (optional)
# macOS: brew install postgresql
# Windows: Download from postgresql.org
# Ubuntu: sudo apt install postgresql postgresql-contrib

# Update .env.local for PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/quality_platform"

# Run migrations on PostgreSQL
npx prisma migrate deploy
```

### Database Commands Reference

```bash
# Migrations
npx prisma migrate dev --name "description"  # Create and apply migration
npx prisma migrate deploy                    # Apply migrations (production)
npx prisma migrate reset                     # Reset database

# Client Generation
npx prisma generate                          # Generate Prisma client
npx prisma db push                          # Push schema without migration

# Data Management
pnpm db:seed                                # Seed with sample data
npx prisma studio                           # Database GUI
npx prisma db seed                          # Alternative seed command
```

## Environment Variables

### Required Variables

Create `.env.local` file in the project root:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production-abc123"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
PORT=3001
API_BASE_URL="http://localhost:3001"

# Optional: Logging
LOG_LEVEL="debug"
```

### Frontend Environment (Optional)

Create `web/.env.local` for frontend-specific variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Feature Flags (future)
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
```

### Testing Environment

Create `.env.test` for test configuration:

```env
DATABASE_URL="file:./test.db"
JWT_SECRET="test-secret-key"
NODE_ENV="test"
PORT=3333
```

### Security Notes

- ✅ **DO**: Use strong, unique JWT secrets in production
- ✅ **DO**: Keep .env files in .gitignore
- ❌ **DON'T**: Commit secrets to version control
- ❌ **DON'T**: Use default JWT secret in production

## Development Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "node dev-start.js",
    "dev:clean": "node dev-start.js",
    "dev:stop": "node dev-stop.js",
    "dev:reset": "node dev-stop.js && node dev-start.js",
    "db:seed": "npx prisma db seed"
  }
}
```

### Advanced Development Commands

```bash
# Build for production
pnpm nx build api          # Build API
pnpm nx build web          # Build Web app
pnpm build                 # Build all projects

# Code quality
pnpm nx lint api           # Lint API code
pnpm nx lint web           # Lint Web code
pnpm nx format             # Format all code

# Testing (when implemented)
pnpm test                  # Run all tests
pnpm test:unit             # Unit tests only
pnpm test:e2e              # End-to-end tests
pnpm test:watch            # Watch mode
```

## Common Issues & Solutions

### 🔴 Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::4200` or `:::3001`

**Solution**:
```bash
# Quick fix - automated cleanup
pnpm dev:stop

# Complete reset if problems persist
pnpm dev:reset

# Manual cleanup (Windows)
netstat -ano | findstr :4200
netstat -ano | findstr :3001
taskkill /F /PID [PID_NUMBER]

# Manual cleanup (macOS/Linux)
lsof -ti:4200 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### 🔴 Inspector/Debugger Port Conflicts

**Problem**: `Starting inspector on 127.0.0.1:9230 failed: address already in use`

**Solution**: The enhanced `dev-start.js` automatically handles this by using separate debug ports:
- API: 127.0.0.1:9230
- Web: 127.0.0.1:9231

If issues persist:
```bash
netstat -ano | findstr :9230
netstat -ano | findstr :9231
taskkill /F /PID [PID_NUMBER]
```

### 🔴 File Permission Errors (EPERM)

**Problem**: `EPERM: operation not permitted, open 'web\.next\trace'`

**Solution**:
```bash
# Windows - Remove read-only attributes
attrib -R "web\.next\*.*" /S /D

# Force remove directory
rmdir /S /Q "web\.next"
rmdir /S /Q "dist"

# Then restart
pnpm dev:reset
```

**Root Causes**:
- Antivirus software interference
- Previous crashed Node.js processes
- Windows file system locking

### 🔴 Build Directory Corruption

**Problem**: Compilation errors, "module not found", or stale cache issues

**Solution**:
```bash
# Automated cleanup (recommended)
pnpm dev:reset

# Manual cleanup
pnpm dev:stop

# Remove build directories
rm -rf web/.next
rm -rf dist
rm -rf node_modules/.cache
rm -rf web/.swc

# Clear package manager cache
pnpm store prune

# Restart
pnpm dev
```

### 🔴 Database Connection Issues

**Problem**: `Can't reach database server` or migration failures

**Solutions**:

#### SQLite Issues:
```bash
# Check database file permissions
ls -la dev.db

# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

#### PostgreSQL Issues:
```bash
# Check service status (macOS)
brew services list | grep postgres

# Check service status (Windows)
net start | findstr postgres

# Check connection
psql -h localhost -U username -d quality_platform
```

### 🔴 Dependency Installation Issues

**Problem**: Package installation failures or version conflicts

**Solutions**:
```bash
# Clear package manager cache
pnpm store prune

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install

# Check for version conflicts
pnpm outdated

# Update dependencies
pnpm update
```

### 🔴 Git and GitFlow Issues

**Problem**: GitFlow violations, commit rejections

**Solution**:
```bash
# Check current branch
git branch

# Switch to proper feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Fix GitFlow hook issues
chmod +x .husky/pre-commit
```

## Windows-Specific Troubleshooting

### PowerShell Execution Policy

**Problem**: Scripts cannot be executed

**Solution**:
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Alternative: Run specific script
powershell -ExecutionPolicy Bypass -File script.ps1
```

### Antivirus Interference

**Problem**: Files being deleted or access denied

**Solution**:
1. Add project folder to antivirus exclusions:
   - Windows Defender: Settings > Update & Security > Windows Security > Virus & threat protection > Exclusions
   - Add folder: `C:\path\to\quality-platform`

2. Exclude file types:
   - `.js`, `.ts`, `.json`, `.db` files

### Long Path Names

**Problem**: Path too long errors

**Solution**:
```powershell
# Enable long path support (Admin PowerShell)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# Alternative: Move project closer to root
# C:\dev\quality-platform instead of C:\Users\Username\Documents\Projects\quality-platform
```

### Windows Terminal Issues

**Problem**: Terminal encoding or color issues

**Solution**:
```bash
# Set UTF-8 encoding
chcp 65001

# Use Windows Terminal (recommended)
# Download from Microsoft Store

# Configure VS Code terminal
"terminal.integrated.shell.windows": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
```

## Performance Optimization

### Development Server Performance

#### Memory Usage
```bash
# Monitor Node.js memory usage
node --max-old-space-size=4096 dev-start.js

# Alternative: Set environment variable
set NODE_OPTIONS=--max-old-space-size=4096
pnpm dev
```

#### Build Performance
```bash
# Use SWC instead of Babel (already configured)
# Enable webpack caching (already configured)
# Use incremental TypeScript compilation
```

### Database Performance

#### SQLite Optimization
```sql
-- Enable WAL mode for better concurrency
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 1000000;
PRAGMA temp_store = memory;
```

#### Connection Pooling
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### System Resource Management

#### Windows Task Manager
- Monitor Node.js processes
- Check memory usage
- Kill orphaned processes

#### macOS Activity Monitor
- Monitor Node processes
- Check CPU and memory usage

#### Linux htop/ps
```bash
# Monitor Node.js processes
ps aux | grep node

# Kill by name
pkill -f node
```

## Recovery Procedures

### Complete Environment Reset

```bash
# 1. Stop everything
pnpm dev:stop --all

# 2. Clean all caches
pnpm store prune
rm -rf node_modules
rm -rf web/.next
rm -rf dist
rm -rf .nx/cache

# 3. Clean database
rm dev.db
rm test.db

# 4. Reinstall dependencies
pnpm install

# 5. Reset database
npx prisma migrate dev
pnpm db:seed

# 6. Restart
pnpm dev
```

### Git Repository Recovery

```bash
# Reset local changes
git stash
git checkout develop
git reset --hard origin/develop

# Clean untracked files
git clean -fd

# Re-pull latest changes
git pull origin develop
```

### Configuration Recovery

```bash
# Restore from examples
cp .env.example .env.local
cp .gitignore.example .gitignore

# Reset Husky hooks
pnpm husky install
chmod +x .husky/pre-commit
```

## Development Best Practices

### Daily Workflow

1. **Start Development**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   pnpm dev
   ```

2. **During Development**:
   - Make small, focused commits
   - Test changes frequently
   - Monitor console for errors

3. **End of Day**:
   ```bash
   # Save work
   git add .
   git commit -m "feat: progress on feature"
   git push origin feature/your-feature

   # Clean shutdown
   pnpm dev:stop
   ```

### Monitoring and Maintenance

#### Daily Checks
- [ ] Development servers start without errors
- [ ] Database connections are working
- [ ] No orphaned processes consuming resources
- [ ] Git status is clean

#### Weekly Maintenance
- [ ] Update dependencies: `pnpm update`
- [ ] Clear caches: `pnpm store prune`
- [ ] Check disk space
- [ ] Review and clean old feature branches

#### Monthly Tasks
- [ ] Review and update documentation
- [ ] Check for security updates
- [ ] Performance profiling
- [ ] Backup important data

## Getting Help

### Diagnostic Information

When reporting issues, include:

```bash
# System information
node --version
pnpm --version
git --version

# Project status
pnpm nx report

# Current processes
# Windows
tasklist | findstr node
netstat -ano | findstr :4200

# macOS/Linux
ps aux | grep node
lsof -i :4200
```

### Log Analysis

#### Development Server Logs
- API logs: Console output from `pnpm nx serve api`
- Web logs: Console output from `pnpm nx serve web`
- Database logs: Prisma query logs

#### Common Log Patterns
```bash
# Success patterns
"Nest application successfully started"
"Ready in [X]ms"
"✅ Web server ready"

# Error patterns
"EADDRINUSE"
"Cannot resolve module"
"Database connection failed"
"Permission denied"
```

### Support Channels

1. **Documentation**: Check existing guides first
2. **GitHub Issues**: Create detailed bug reports
3. **Team Chat**: For quick questions
4. **Code Review**: Get help during PR reviews

### Creating Bug Reports

Include the following information:

```markdown
## Bug Report

**Environment**:
- OS: Windows 10/macOS 12/Ubuntu 20.04
- Node.js: v18.x.x
- pnpm: v8.x.x

**Steps to Reproduce**:
1. Run `pnpm dev`
2. Navigate to http://localhost:4200
3. Error occurs

**Expected Behavior**:
Application should load normally

**Actual Behavior**:
Error message: [paste exact error]

**Logs**:
```
[paste relevant logs here]
```

**Additional Context**:
- First time setup or existing project?
- Any recent changes?
- Antivirus software running?
```

---

## Quick Reference

### Essential Commands

```bash
# Start development
pnpm dev

# Stop development
pnpm dev:stop

# Reset everything
pnpm dev:reset

# Database management
npx prisma studio
pnpm db:seed

# Check health
curl http://localhost:3001/api/health
```

### Important URLs

```bash
Web App:         http://localhost:4200
API:             http://localhost:3001/api
API Docs:        http://localhost:3001/api/docs
Database Studio: http://localhost:5555
Health Check:    http://localhost:3001/api/health
```

### Emergency Procedures

```bash
# Kill all Node processes (use with caution)
pnpm dev:stop --all

# Reset development environment
pnpm dev:reset

# Complete project reset
rm -rf node_modules && pnpm install && pnpm dev:reset
```

For additional support, refer to the [Testing Guide](./TESTING_GUIDE.md) or [Project Structure](./PROJECT_STRUCTURE.md) documentation.