# Quality Platform Tutorial - Part 5: Production Deployment & Infrastructure

Welcome to Part 5 of the Quality Platform tutorial series! In this comprehensive guide, you'll learn how to deploy the Quality Platform to production environments using Docker containers, Kubernetes orchestration, and modern DevOps practices.

## Table of Contents

1. [Overview](#overview)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Production Deployment](#kubernetes-production-deployment)
4. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
5. [Monitoring & Observability](#monitoring--observability)
6. [Security & Hardening](#security--hardening)
7. [Scaling & Performance](#scaling--performance)
8. [Backup & Recovery](#backup--recovery)
9. [Troubleshooting Production Issues](#troubleshooting-production-issues)
10. [Best Practices](#best-practices)

## Overview

The Quality Platform is designed for production deployment from day one. This tutorial covers the complete production infrastructure that enables:

- **Container Orchestration**: Docker and Kubernetes deployment
- **Automated CI/CD**: GitHub Actions pipelines for testing and deployment
- **Production Monitoring**: Prometheus metrics and Grafana dashboards
- **Security Hardening**: Rate limiting, security headers, authentication guards
- **High Availability**: Load balancing and auto-scaling capabilities
- **Data Persistence**: Production-grade PostgreSQL with backup strategies

### Production Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Load Balancer  │───▶│   Next.js Web   │───▶│   NestJS API    │
│    (Ingress)    │    │   (Frontend)    │    │   (Backend)     │
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

## Docker Deployment

### Quick Production Start

The simplest way to deploy the Quality Platform in a production-like environment:

```bash
# 1. Clone and setup
git clone https://github.com/your-org/quality-platform.git
cd quality-platform
git checkout main  # Use main branch for production

# 2. Configure production environment
cp .env.example .env.production
# Edit .env.production with your production values

# 3. Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify deployment
curl http://localhost:4200/health
curl http://localhost:3001/api/health
```

### Production Environment Configuration

Create a `.env.production` file with production-specific values:

```env
# Database Configuration (Production PostgreSQL)
DATABASE_URL="postgresql://quality_user:secure_password@postgres:5432/quality_platform"

# JWT Authentication (Use strong secrets)
JWT_SECRET="your-ultra-secure-production-jwt-secret-256-bits-minimum"
JWT_EXPIRES_IN="1d"  # Shorter expiration for production

# Application Configuration
NODE_ENV="production"
PORT=3000
API_BASE_URL="https://your-api-domain.com"

# Frontend Configuration
NEXT_PUBLIC_API_URL="https://your-api-domain.com/api"

# Security Configuration
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100

# Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9090

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Database Connection Pool
DATABASE_CONNECTION_LIMIT=20
DATABASE_POOL_TIMEOUT=30000
```

### Docker Compose Production Setup

The `docker-compose.prod.yml` includes:

**Services Included:**
- **API Server**: NestJS application with production optimizations
- **Web Server**: Next.js application with static optimization
- **PostgreSQL**: Production database with persistence
- **Redis**: Caching and session storage
- **Nginx**: Load balancer and reverse proxy
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards

**Key Features:**
- Multi-stage Docker builds for optimization
- Health checks for all services
- Persistent volumes for data
- Environment-specific configurations
- Resource limits and constraints

```bash
# View running services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale api=3

# Stop production deployment
docker-compose -f docker-compose.prod.yml down
```

### Docker Build Optimization

The production Docker images use multi-stage builds:

**API Dockerfile Features:**
- Node.js Alpine base image for minimal size
- Multi-stage build with separate deps and runtime stages
- Non-root user for security
- Health checks built-in
- Production optimizations

**Web Dockerfile Features:**
- Next.js standalone output for optimal size
- Static asset optimization
- Built-in reverse proxy configuration
- Performance monitoring integration

## Kubernetes Production Deployment

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured for your cluster
- Ingress controller (Nginx recommended)
- Cert-manager for TLS certificates (optional)

### Quick Kubernetes Deployment

```bash
# 1. Create namespace
kubectl create namespace quality-platform

# 2. Apply base manifests
kubectl apply -f k8s/base/ -n quality-platform

# 3. Verify deployment
kubectl get pods -n quality-platform
kubectl get services -n quality-platform

# 4. Check application health
kubectl port-forward svc/web-service 4200:4200 -n quality-platform
```

### Production Kubernetes Manifests

The `k8s/base/` directory contains:

**Core Application:**
- `api-deployment.yaml` - NestJS API with 3 replicas
- `web-deployment.yaml` - Next.js web application
- `postgres-statefulset.yaml` - PostgreSQL with persistent storage
- `redis-deployment.yaml` - Redis for caching

**Services & Networking:**
- `api-service.yaml` - API service configuration
- `web-service.yaml` - Web service configuration
- `ingress.yaml` - External traffic routing

**Configuration:**
- `configmap.yaml` - Application configuration
- `secrets.yaml` - Sensitive data (create separately)

**Storage:**
- `postgres-pvc.yaml` - Persistent volume claims
- `storage-class.yaml` - Storage class definitions

### Environment-Specific Deployments

```bash
# Development/Staging
kubectl apply -f k8s/base/ -n quality-platform-dev

# Production
kubectl apply -f k8s/production/ -n quality-platform-prod

# Monitor deployment
kubectl rollout status deployment/api -n quality-platform-prod
kubectl rollout status deployment/web -n quality-platform-prod
```

### Scaling Applications

```bash
# Scale API replicas
kubectl scale deployment api --replicas=5 -n quality-platform

# Scale web replicas
kubectl scale deployment web --replicas=3 -n quality-platform

# Auto-scaling (HPA)
kubectl autoscale deployment api --cpu-percent=70 --min=3 --max=10 -n quality-platform
```

## CI/CD Pipeline Setup

### GitHub Actions Workflow

The Quality Platform includes comprehensive CI/CD pipelines:

**CI Pipeline (`.github/workflows/ci.yml`):**
- Code quality checks (linting, type checking)
- Unit and integration testing
- Security scanning with Trivy
- Docker image building
- Multi-environment testing

**Release Pipeline (`.github/workflows/release.yml`):**
- Automated versioning with semantic-release
- Production Docker image building
- Kubernetes deployment automation
- Production health checks

### Deploying with GitHub Actions

```yaml
# Example deployment trigger
on:
  push:
    branches: [main]
  release:
    types: [created]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: |
          kubectl apply -f k8s/production/ -n quality-platform-prod
          kubectl rollout status deployment/api -n quality-platform-prod
```

### Required Secrets

Configure these secrets in your GitHub repository:

```bash
# Docker Registry
DOCKER_USERNAME=your-registry-username
DOCKER_PASSWORD=your-registry-password

# Kubernetes
KUBE_CONFIG_DATA=base64-encoded-kubeconfig

# Production Environment
PROD_DATABASE_URL=postgresql://...
PROD_JWT_SECRET=ultra-secure-production-secret
```

### Manual Deployment Commands

```bash
# Build and push Docker images
docker build -t your-registry/quality-api:latest apps/api/
docker build -t your-registry/quality-web:latest web/
docker push your-registry/quality-api:latest
docker push your-registry/quality-web:latest

# Update Kubernetes deployments
kubectl set image deployment/api api=your-registry/quality-api:latest -n quality-platform
kubectl set image deployment/web web=your-registry/quality-web:latest -n quality-platform
```

## Monitoring & Observability

### Prometheus Metrics

The Quality Platform exposes comprehensive metrics:

**Application Metrics:**
- HTTP request duration and count
- Database query performance
- Business metrics (orders, users, products)
- Error rates and success rates

**Infrastructure Metrics:**
- Pod resource usage (CPU, memory)
- Database connection pools
- Cache hit/miss rates
- Network latency

### Grafana Dashboards

Pre-configured dashboards include:

**Application Dashboard:**
- Request throughput and latency
- Error rates by endpoint
- Database query performance
- User activity and business metrics

**Infrastructure Dashboard:**
- Kubernetes cluster overview
- Resource utilization
- Service health status
- Network and storage metrics

### Accessing Monitoring

```bash
# Local development
docker-compose -f docker-compose.prod.yml up -d
# Grafana: http://localhost:3000 (admin/admin)
# Prometheus: http://localhost:9090

# Kubernetes
kubectl port-forward svc/grafana 3000:3000 -n monitoring
kubectl port-forward svc/prometheus 9090:9090 -n monitoring
```

### Setting Up Alerts

Example Prometheus alert rules:

```yaml
# High error rate alert
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "High error rate detected"
    description: "Error rate is {{ $value }} errors per second"

# Database connection issues
- alert: DatabaseConnectionHigh
  expr: pg_stat_activity_count > 15
  for: 1m
  labels:
    severity: warning
  annotations:
    summary: "High database connections"
```

## Security & Hardening

### Production Security Features

The Quality Platform includes enterprise-grade security:

**Rate Limiting:**
```typescript
// Global rate limiting
@UseGuards(RateLimitGuard)
// 100 requests per minute per IP
```

**Security Headers:**
- HTTPS enforcement
- Content Security Policy (CSP)
- HSTS headers
- XSS protection
- CSRF protection

**Authentication & Authorization:**
- JWT with secure secrets
- Password hashing with bcrypt
- Role-based access control
- API key authentication for services

### Security Scanning

Automated security scanning in CI/CD:

```bash
# Container image scanning
trivy image your-registry/quality-api:latest

# Dependency vulnerability scanning
npm audit --audit-level=moderate

# SAST scanning
# Integrated into GitHub Actions workflow
```

### Production Security Checklist

- [ ] Strong JWT secrets (256-bit minimum)
- [ ] HTTPS/TLS certificates configured
- [ ] Database connections encrypted
- [ ] Secrets managed via Kubernetes secrets
- [ ] Container images regularly updated
- [ ] Security scanning in CI/CD pipeline
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers implemented

## Scaling & Performance

### Horizontal Pod Autoscaling

```bash
# Create HPA for API
kubectl autoscale deployment api \
  --cpu-percent=70 \
  --min=3 \
  --max=20 \
  -n quality-platform

# Create HPA for Web
kubectl autoscale deployment web \
  --cpu-percent=60 \
  --min=2 \
  --max=10 \
  -n quality-platform
```

### Database Optimization

**Connection Pooling:**
```typescript
// Prisma connection pool configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 20
  poolTimeout = 30
}
```

**Query Optimization:**
- Database indexes on frequently queried fields
- Query result caching with Redis
- Connection pooling with pgBouncer

### Caching Strategy

**Redis Caching:**
```typescript
// Cache product listings
@CacheService.cache('products:all', 300) // 5 minutes
async getProducts() {
  return this.productService.findAll();
}
```

**CDN Integration:**
- Static assets served via CDN
- Next.js image optimization
- Gzip compression enabled

## Backup & Recovery

### Database Backup Strategy

**Automated Backups:**
```bash
# PostgreSQL backup job (Kubernetes CronJob)
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16-alpine
            command:
            - /bin/bash
            - -c
            - pg_dump $DATABASE_URL > /backup/backup-$(date +%Y%m%d).sql
```

**Backup Verification:**
```bash
# Test backup restoration
kubectl exec -it postgres-0 -- psql -U quality_user -d quality_platform_test < backup.sql
```

### Disaster Recovery Plan

**RTO (Recovery Time Objective):** 4 hours
**RPO (Recovery Point Objective):** 1 hour

**Recovery Procedures:**

1. **Database Recovery:**
   ```bash
   # Restore from latest backup
   kubectl exec -it postgres-0 -- pg_restore -U quality_user -d quality_platform backup.sql
   ```

2. **Application Recovery:**
   ```bash
   # Redeploy applications
   kubectl rollout restart deployment/api -n quality-platform
   kubectl rollout restart deployment/web -n quality-platform
   ```

3. **Verification:**
   ```bash
   # Health checks
   curl -f http://api.yourdomain.com/health
   curl -f http://yourdomain.com/health
   ```

## Troubleshooting Production Issues

### Common Production Problems

#### 🔴 Pod Startup Issues

**Problem:** Pods stuck in `CrashLoopBackOff`

**Diagnosis:**
```bash
kubectl describe pod api-deployment-xxx -n quality-platform
kubectl logs api-deployment-xxx -n quality-platform
```

**Common Causes:**
- Environment variable issues
- Database connection failures
- Resource limits too low
- Container image problems

#### 🔴 Database Connection Issues

**Problem:** API can't connect to PostgreSQL

**Diagnosis:**
```bash
# Check database pod status
kubectl get pods -l app=postgres -n quality-platform

# Test database connectivity
kubectl exec -it api-deployment-xxx -- nc -zv postgres 5432
```

**Solutions:**
- Verify DATABASE_URL configuration
- Check network policies
- Verify database credentials in secrets

#### 🔴 High Memory Usage

**Problem:** Pods consuming excessive memory

**Diagnosis:**
```bash
kubectl top pods -n quality-platform
kubectl describe pod api-deployment-xxx -n quality-platform
```

**Solutions:**
- Increase memory limits
- Check for memory leaks
- Optimize application code
- Implement proper garbage collection

### Performance Troubleshooting

#### Slow API Responses

```bash
# Check API performance metrics
kubectl port-forward svc/grafana 3000:3000 -n monitoring
# View API dashboard in Grafana

# Check database performance
kubectl exec -it postgres-0 -- psql -U quality_user -c "SELECT * FROM pg_stat_activity;"
```

#### Database Query Analysis

```sql
-- Slow query identification
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Active connections
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE state = 'active';
```

### Production Health Checks

```bash
# Comprehensive health check script
#!/bin/bash

# Check all pods are running
echo "Checking pod status..."
kubectl get pods -n quality-platform

# Check services are accessible
echo "Checking service health..."
curl -f http://api.yourdomain.com/health
curl -f http://yourdomain.com/health

# Check database connectivity
echo "Checking database..."
kubectl exec -it postgres-0 -- pg_isready -U quality_user

# Check resource usage
echo "Checking resource usage..."
kubectl top pods -n quality-platform
```

## Best Practices

### Production Deployment Checklist

**Pre-Deployment:**
- [ ] Code reviewed and merged to main branch
- [ ] All tests passing in CI/CD pipeline
- [ ] Security scan completed successfully
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Monitoring alerts configured

**Deployment:**
- [ ] Blue-green or rolling deployment strategy
- [ ] Health checks passing
- [ ] Database backup created before deployment
- [ ] Rollback plan prepared
- [ ] Post-deployment verification completed

**Post-Deployment:**
- [ ] Application health verified
- [ ] Performance metrics within acceptable ranges
- [ ] Error rates normal
- [ ] User acceptance testing passed
- [ ] Documentation updated

### Production Maintenance

**Regular Tasks:**
- Monitor application and infrastructure metrics
- Review security scan results
- Update dependencies monthly
- Database performance tuning
- Log analysis and cleanup
- Backup verification

**Monthly Tasks:**
- Security patch updates
- Performance review and optimization
- Cost analysis and optimization
- Disaster recovery testing
- Documentation updates

### GitFlow for Production

**Production Release Process:**
```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. Final testing and minor fixes only
# (No new features in release branch)

# 3. Merge to main and tag
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# 4. Merge back to develop
git checkout develop
git merge release/v1.1.0
git push origin develop

# 5. Deploy to production
# (Triggered automatically by tag creation)
```

## Next Steps

Congratulations! You now have a production-ready Quality Platform deployment.

👉 **[Part 6: Quality Metrics & Analysis →](./06-quality-metrics-analysis.md)**

In the next part, you'll learn:
- Advanced quality metrics collection and analysis
- Custom quality gates and thresholds
- Performance benchmarking and optimization
- Quality trend analysis and reporting

## Support & Resources

- **Production Monitoring**: Access Grafana dashboards for real-time metrics
- **CI/CD Pipeline**: GitHub Actions for automated deployment
- **Documentation**: Production deployment guides in `/docs/deployment/`
- **Security**: Security scanning results and recommendations
- **Troubleshooting**: Production issue resolution guides

## Glossary

- **HPA**: Horizontal Pod Autoscaler for automatic scaling
- **RTO**: Recovery Time Objective - maximum acceptable downtime
- **RPO**: Recovery Point Objective - maximum acceptable data loss
- **Blue-Green Deployment**: Zero-downtime deployment strategy
- **Rolling Deployment**: Gradual replacement of old pods with new ones
- **Circuit Breaker**: Pattern to handle service failures gracefully
- **Load Balancing**: Distributing traffic across multiple service instances

---

**Previous**: [← Part 4: Writing Effective Tests](./04-writing-effective-tests.md) | **Next**: [Part 6: Quality Metrics & Analysis →](./06-quality-metrics-analysis.md)