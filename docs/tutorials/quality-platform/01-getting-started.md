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
- **Quality Engineering Tools**: Comprehensive testing framework (unit, integration, E2E, contract)
- **Automated Quality Metrics**: Code coverage, quality scoring, and security analysis
- **ISTQB Training Materials**: Foundation-level certification preparation
- **Modern Tech Stack**: NestJS, Next.js 15, React 19, Prisma, TypeScript
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
- **Node.js**: Version 20 or higher
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

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/quality-platform.git
cd quality-platform

# Switch to develop branch (following GitFlow)
git checkout develop
```

### Step 2: Install Dependencies

```bash
# Install all dependencies using pnpm (faster than npm)
pnpm install

# If you don't have pnpm installed:
npm install -g pnpm
pnpm install
```

### Step 3: Environment Configuration

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

### Step 5: Start the Development Environment

```bash
# Start both API and Web servers with our custom script
node dev-start.js

# Or manually start each service:
# Terminal 1 - API Server
pnpm nx serve api

# Terminal 2 - Web Application
pnpm nx serve web
```

### Step 6: Verify Installation

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
- **Authentication Endpoints**: Registration and login
- **Product Management**: CRUD operations for products
- **Health Checks**: System status and readiness probes

### 3. Run Your First Tests

```bash
# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run end-to-end tests
pnpm test:e2e

# Generate quality metrics report
node scripts/quality-metrics.js
```

### 4. Explore the Codebase

Key directories to examine:

```
quality-platform/
├── apps/api/          # NestJS API application
├── apps/web/          # Next.js web application
├── tests/             # Integration and contract tests
├── scripts/           # Quality metrics and utilities
├── docs/              # Documentation and tutorials
└── prisma/            # Database schema and migrations
```

## Understanding the Architecture

### Monorepo Structure

The Quality Platform uses Nx monorepo architecture:

- **Unified Development**: Single repository for all components
- **Shared Dependencies**: Common libraries and configurations
- **Coordinated Testing**: Cross-application test execution
- **Consistent Tooling**: Standardized build and deployment

### Application Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js Web   │───▶│   NestJS API    │
│   (Frontend)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   TanStack      │    │     Prisma      │
│   React Query   │    │   ORM + SQLite  │
│   (State Mgmt)  │    │   (Database)    │
└─────────────────┘    └─────────────────┘
```

### Quality Engineering Pipeline

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Unit Tests  │───▶│Integration  │───▶│  E2E Tests  │
│   (Jest)    │    │ Tests (API) │    │ (Playwright)│
└─────────────┘    └─────────────┘    └─────────────┘
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
9. **Deployment & Production**

### Mastery (Parts 10-12)
10. **Platform Architecture Deep Dive**
11. **Building Quality Culture**
12. **Training & Team Development**

## Next Steps

Now that you have the platform running, proceed to:

👉 **[Part 2: Basic Usage & Workflows](./02-basic-usage-workflows.md)**

In the next part, you'll learn:
- How to use the web application effectively
- API interaction patterns
- Basic testing workflows
- Development best practices

## Support & Resources

- **Documentation**: `/docs` directory
- **Examples**: `/examples` directory (coming soon)
- **Issues**: Create GitHub issues for bugs or questions
- **Contributing**: See CONTRIBUTING.md for guidelines

## Glossary

- **Quality Platform**: Our comprehensive quality engineering platform
- **Monorepo**: Single repository containing multiple applications
- **Quality Gates**: Automated checks that must pass before deployment
- **ISTQB**: International Software Testing Qualifications Board
- **GitFlow**: Branch-based development workflow methodology
- **E2E**: End-to-End testing across the entire application flow

---

**Next**: [Part 2: Basic Usage & Workflows →](./02-basic-usage-workflows.md)