# Quality Platform Tutorial - Part 1: Getting Started

Welcome to the Quality Platform! This comprehensive tutorial series will guide you from zero to hero in using our quality engineering platform effectively.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [First Steps](#first-steps)
5. [Understanding the Architecture](#understanding-the-architecture)
6. [What You'll Learn](#what-youll-learn)
7. [Tutorial Structure](#tutorial-structure)

## Overview

The Quality Platform is a comprehensive monorepo designed to accelerate projects with good practices, train teams in QA/QE approaches, and demonstrate ISTQB-aligned concepts. It's built with modern technologies and follows industry best practices.

### Key Features

- **Full-Stack Application**: Complete e-commerce platform with API and web frontend
- **Production Infrastructure**: Docker containerization, Kubernetes orchestration, CI/CD pipelines
- **Quality Engineering Tools**: Comprehensive testing framework (unit, integration, E2E, contract)
- **Monitoring & Observability**: Prometheus metrics, Grafana dashboards, real-time alerts
- **Security Hardening**: Rate limiting, security headers, authentication guards
- **Automated Quality Metrics**: Code coverage, quality scoring, and security analysis
- **ISTQB Training Materials**: Foundation-level certification preparation
- **Modern Tech Stack**: NestJS, Next.js 15, React 19, Prisma, TypeScript, Docker, Kubernetes
- **GitFlow Methodology**: Professional version control and release management

### Business Value

- **Risk Reduction**: Comprehensive testing reduces escaped defects
- **Team Training**: Hands-on learning with real-world examples
- **Accelerated Development**: Reusable platform with proven patterns
- **Quality Assurance**: Built-in quality gates and metrics

## Prerequisites

### Required Knowledge (Beginner Level)
- Basic understanding of web development
- Familiarity with command line/terminal
- Basic Git knowledge (clone, commit, push)
- Understanding of APIs and web applications

### System Requirements

#### Option 1: Docker Development (Recommended)
- **Docker Desktop**: Latest version with Kubernetes enabled
- **Git**: Latest version
- **Code Editor**: VS Code recommended
- **Operating System**: Windows, macOS, or Linux
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space for containers

#### Option 2: Native Development
- **Node.js**: Version 20 or higher
- **PostgreSQL**: Version 16 or higher (production) or SQLite (development)
- **Redis**: Latest version (optional for caching)
- **Git**: Latest version
- **Code Editor**: VS Code recommended
- **Operating System**: Windows, macOS, or Linux
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space

### Optional but Helpful
- Experience with JavaScript/TypeScript
- Basic understanding of testing concepts
- Familiarity with modern web frameworks

## Installation & Setup

### Quick Start with Docker (Recommended)

#### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-org/quality-platform.git
cd quality-platform

# Switch to develop branch (following GitFlow)
git checkout develop

# Copy environment configuration
cp .env.example .env
```

#### Step 2: Start with Docker

```bash
# Start the entire platform with Docker Compose
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

**That's it!** Your Quality Platform is now running:
- **Web Application**: http://localhost:4200
- **API Documentation**: http://localhost:3001/api/docs
- **Database Admin**: http://localhost:5050 (pgAdmin)
- **Monitoring**: http://localhost:3000 (Grafana, if enabled)

---

### Alternative: Native Development Setup

#### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/quality-platform.git
cd quality-platform

# Switch to develop branch (following GitFlow)
git checkout develop
```

#### Step 2: Install Dependencies

```bash
# Install all dependencies using pnpm (faster than npm)
pnpm install

# If you don't have pnpm installed:
npm install -g pnpm
pnpm install
```

#### Step 3: Environment Configuration

Create your environment variables file:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the file with your preferred editor
code .env.local
```

Required environment variables:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Application Configuration
NODE_ENV="development"
PORT=3000

# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### Step 4: Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

#### Step 5: Start the Development Environment

```bash
# 🚀 RECOMMENDED: Start with automated port management
pnpm dev

# Alternative: Start both API and Web servers
node dev-start.js

# Or manually start each service:
# Terminal 1 - API Server
pnpm nx serve api

# Terminal 2 - Web Application
pnpm nx serve web
```

**New Development Features:**
- **Automatic Port Management**: Kills conflicting processes automatically
- **Context Loading**: Shows current git branch and project status
- **Health Checks**: Verifies all services are running correctly
- **Clean Shutdown**: Proper cleanup when stopping servers

#### Step 6: Verify Installation

**For Docker Setup:**
Open your browser and visit:
- **Web Application**: http://localhost:4200
- **API Documentation**: http://localhost:3001/api/docs
- **Database Admin**: http://localhost:5050 (pgAdmin)
- **API Health Check**: http://localhost:3001/api/health

**For Native Setup:**
Open your browser and visit:
- **Web Application**: http://localhost:4200
- **API Documentation**: http://localhost:3001/api/docs
- **API Health Check**: http://localhost:3001/api/health
- **Database Studio**: `npx prisma studio` (http://localhost:5555)

## First Steps

### 1. Explore the Web Application

Navigate to http://localhost:4200 and explore:

- **Homepage**: Modern landing page with platform overview
- **Products**: Browse the sample e-commerce catalog
- **Authentication**: Register a new account or login
- **Shopping Cart**: Add products and manage your cart
- **Checkout Process**: Multi-step checkout flow

### 2. Test the API

Visit http://localhost:3001/api/docs to explore:

- **Interactive API Documentation**: Swagger/OpenAPI interface
- **Authentication Endpoints**: Registration and login with JWT
- **Product Management**: Full CRUD operations with categories and search
- **Order Management**: Complete order lifecycle with status tracking
- **Shopping Cart**: Session-based and persistent cart functionality
- **Health Checks**: System status and readiness probes
- **Admin Operations**: Product and order management for admin users

### 3. Production Features Overview

#### Quality Engineering Tools
```bash
# Run comprehensive quality checks
pnpm quality:check

# Generate detailed quality report
pnpm quality:report

# Run specific test suites
pnpm test:unit        # Jest unit tests
pnpm test:integration # Supertest API tests
pnpm test:e2e         # Playwright browser tests
pnpm test:contract    # API contract validation
```

#### Context Management System
```bash
# Get project overview
pnpm context:summary

# Get git context
pnpm context:git

# Get feature-specific context
pnpm context:feature api    # API development context
pnpm context:feature web    # Frontend development context
```

#### Production Deployment
```bash
# Docker deployment
docker-compose -f docker-compose.prod.yml up -d

# Kubernetes deployment (requires cluster)
kubectl apply -f k8s/base/

# Check deployment status
kubectl get pods -n quality-platform
```
node scripts/quality-metrics.js
```

### 4. Explore the Codebase

Key directories to examine:

```
quality-platform/
├── apps/api/          # NestJS API application
├── web/               # Next.js 15 web application
├── apps/api-e2e/      # API integration tests
├── web-e2e/           # Web E2E tests (Playwright)
├── libs/shared/       # Shared libraries and utilities
├── tools/             # CLI tools and quality automation
├── k8s/               # Kubernetes deployment manifests
├── scripts/           # Database, backup, and utility scripts
├── docs/              # Comprehensive documentation
├── prisma/            # Database schema and migrations
├── .github/           # CI/CD workflows
├── docker-compose.yml # Local development setup
└── Dockerfile*        # Container definitions
```

## Understanding the Architecture

### Monorepo Structure

The Quality Platform uses Nx monorepo architecture:

- **Unified Development**: Single repository for all components
- **Shared Dependencies**: Common libraries and configurations
- **Coordinated Testing**: Cross-application test execution
- **Consistent Tooling**: Standardized build and deployment

### Production Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Load Balancer  │───▶│   Next.js Web   │───▶│   NestJS API    │
│    (Nginx)      │    │   (Frontend)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monitoring    │    │   TanStack      │    │   PostgreSQL    │
│ Grafana+Prometheus│    │   React Query   │    │   + Prisma ORM  │
│   (Observability) │    │   (State Mgmt)  │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         ▼                       ▼              ┌─────────────────┐
┌─────────────────┐    ┌─────────────────┐    │      Redis      │
│   CI/CD Pipeline│    │    Security     │    │    (Caching)    │
│  GitHub Actions │    │ Rate Limiting   │    │                 │
│   (Automation)  │    │ + Auth Guards   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Quality Engineering & DevOps Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Unit Tests  │───▶│Integration  │───▶│  E2E Tests  │───▶│   Deploy    │
│   (Jest)    │    │ Tests (API) │    │ (Playwright)│    │ (Kubernetes)│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Code Quality │    │Security Scan│    │Performance  │    │ Monitoring  │
│   Linting   │    │   (Trivy)   │    │  Testing    │    │  & Alerts   │
│  Coverage   │    │   Audit     │    │   (k6)      │    │ (Grafana)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                 ┌─────────────────┐
                 │ Quality Metrics │
                 │   & Reports     │
                 └─────────────────┘
```

## What You'll Learn

### Beginner Level (Parts 1-3)
- Platform setup and configuration
- Basic usage patterns and workflows
- Understanding the codebase structure
- Running tests and interpreting results

### Intermediate Level (Parts 4-6)
- Writing effective tests (unit, integration, E2E)
- Quality metrics analysis and improvement
- Customizing the platform for your needs
- Advanced testing patterns and practices

### Advanced Level (Parts 7-9)
- Implementing new features with quality gates
- Creating custom quality agents and metrics
- Advanced deployment and production considerations
- Contributing to the platform development

### Expert Level (Parts 10-12)
- Platform architecture and design decisions
- Building quality engineering culture
- Training team members effectively
- Scaling quality practices across organizations

## Tutorial Structure

This tutorial series is organized into 12 comprehensive parts:

### Foundation (Parts 1-3)
1. **Getting Started** (This document)
2. **Basic Usage & Workflows**
3. **Understanding Test Results**

### Development (Parts 4-6)
4. **Writing Effective Tests**
5. **Quality Metrics & Analysis**
6. **Customization & Configuration**

### Advanced (Parts 7-9)
7. **Feature Development with Quality Gates**
8. **Custom Quality Agents**
9. **Production Deployment & Monitoring**

### Mastery (Parts 10-12)
10. **Platform Architecture Deep Dive**
11. **Building Quality Culture**
12. **Training & Team Development**

## Production Environment (Optional)

### Docker Deployment

For a production-like environment:

```bash
# Deploy with Docker Compose (production configuration)
docker-compose -f docker-compose.prod.yml up -d

# Access production services
# Web: http://localhost:4200
# API: http://localhost:3001
# Monitoring: http://localhost:3000 (Grafana)
```

### Kubernetes Deployment

For full production deployment:

```bash
# Deploy to Kubernetes cluster
kubectl apply -f k8s/base/

# Check deployment status
kubectl get pods -n quality-platform

# Access via ingress or port-forward
kubectl port-forward svc/web-service 4200:4200 -n quality-platform
```

### Monitoring & Observability

Access production monitoring:

- **Prometheus Metrics**: http://localhost:9090
- **Grafana Dashboards**: http://localhost:3000
- **Application Logs**: `kubectl logs -f deployment/api -n quality-platform`
- **Health Checks**: http://localhost:3001/api/health

## Next Steps

Now that you have the platform running, proceed to:

👉 **[Part 2: Basic Usage & Workflows](./02-basic-usage-workflows.md)**

In the next part, you'll learn:
- How to use the web application effectively
- API interaction patterns
- CI/CD workflows and GitFlow methodology
- Quality automation and monitoring
- Production deployment strategies

## Support & Resources

- **Documentation**: `/docs` directory
- **Examples**: `/examples` directory (coming soon)
- **Issues**: Create GitHub issues for bugs or questions
- **Contributing**: See CONTRIBUTING.md for guidelines

## Glossary

- **Quality Platform**: Our comprehensive quality engineering platform with production infrastructure
- **Monorepo**: Single repository containing multiple applications and shared infrastructure
- **Quality Gates**: Automated checks that must pass before deployment (linting, testing, security)
- **ISTQB**: International Software Testing Qualifications Board
- **GitFlow**: Branch-based development workflow methodology with feature/release branches
- **E2E**: End-to-End testing across the entire application flow
- **Container Orchestration**: Kubernetes-based deployment and scaling
- **Observability**: Monitoring, logging, and alerting with Prometheus/Grafana
- **CI/CD**: Continuous Integration/Continuous Deployment with GitHub Actions
- **Infrastructure as Code**: Kubernetes manifests and Docker configurations

---

**Next**: [Part 2: Basic Usage & Workflows →](./02-basic-usage-workflows.md)