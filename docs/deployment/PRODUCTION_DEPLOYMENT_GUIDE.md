# Production Deployment Guide - Quality Platform v1.0.0

## Complete Production Deployment Process

### Table of Contents

1. [Pre-Deployment Requirements](#pre-deployment-requirements)
2. [Environment Preparation](#environment-preparation)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Monitoring Setup](#monitoring-setup)
6. [Security Configuration](#security-configuration)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Maintenance and Operations](#maintenance-and-operations)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedures](#rollback-procedures)

## Pre-Deployment Requirements

### 📋 Infrastructure Prerequisites

**Minimum Requirements:**
- **CPU**: 4 cores for production workloads
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 50GB SSD for application + database
- **Network**: Stable internet connection with public IP
- **SSL Certificate**: Valid TLS certificate for your domain

**Kubernetes Cluster (Recommended):**
- **Nodes**: 3+ nodes for high availability
- **Version**: Kubernetes 1.24+
- **Resources**: 2 CPU cores, 4GB RAM per node minimum
- **Storage Classes**: Dynamic provisioning enabled
- **Ingress Controller**: Nginx Ingress Controller installed

**Docker Environment (Alternative):**
- **Docker**: Version 24.0+
- **Docker Compose**: Version 2.20+
- **System**: Linux-based system (Ubuntu 22.04+ recommended)

### 🔐 Security Prerequisites

**Required Secrets:**
```bash
# Database credentials
DATABASE_URL="postgresql://prod_user:secure_password@postgres:5432/quality_platform_prod"

# JWT configuration
JWT_SECRET="your-production-jwt-secret-256-bits-minimum"
JWT_EXPIRES_IN="24h"

# Redis connection
REDIS_URL="redis://redis:6379"

# Domain-specific secrets
YOUR_DOMAIN_API_KEY="your-production-api-key"
STRIPE_API_KEY="sk_live_your_stripe_key"
SENDGRID_API_KEY="SG.your_sendgrid_key"

# SSL certificates (if not using Let's Encrypt)
TLS_CERT_PATH="/certs/tls.crt"
TLS_KEY_PATH="/certs/tls.key"
```

**Security Checklist:**
- [ ] All default passwords changed
- [ ] Strong, unique JWT secret generated
- [ ] SSL certificates valid and properly configured
- [ ] Database access restricted to application only
- [ ] Firewall rules configured (ports 80, 443, 22 only)
- [ ] Regular security updates scheduled

### 🌐 DNS and Domain Setup

**DNS Records Required:**
```
A     your-domain.com              → Your-Server-IP
A     api.your-domain.com          → Your-Server-IP
A     monitoring.your-domain.com   → Your-Server-IP
CNAME www.your-domain.com          → your-domain.com
```

## Environment Preparation

### Step 1: Server Setup

**Ubuntu 22.04 Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install kubectl (for Kubernetes)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Node.js (for build processes)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Reboot to apply group changes
sudo reboot
```

### Step 2: Application Deployment

**Clone and Prepare:**
```bash
# Create deployment directory
sudo mkdir -p /opt/quality-platform
sudo chown $USER:$USER /opt/quality-platform
cd /opt/quality-platform

# Clone repository (use your production branch)
git clone -b main https://github.com/your-org/quality-platform.git .

# Install dependencies
pnpm install --frozen-lockfile

# Build applications
pnpm build
```

### Step 3: Environment Configuration

**Create Production Environment File:**
```bash
# Create production environment file
sudo nano /opt/quality-platform/.env.production

# Add production configuration:
NODE_ENV=production
PORT=3000

# Database (use managed database service in production)
DATABASE_URL="postgresql://prod_user:secure_password@your-db-host:5432/quality_platform_prod"

# Redis (use managed Redis service)
REDIS_URL="redis://your-redis-host:6379"

# JWT Configuration
JWT_SECRET="your-production-jwt-secret-256-bits-minimum"
JWT_EXPIRES_IN="24h"

# Application URLs
API_BASE_URL="https://api.your-domain.com"
WEB_BASE_URL="https://your-domain.com"

# CORS origins
CORS_ORIGINS="https://your-domain.com,https://www.your-domain.com"

# Your domain-specific configuration
YOUR_DOMAIN_API_KEY="your-production-api-key"
NOTIFICATION_EMAIL="admin@your-domain.com"

# Third-party integrations
STRIPE_API_KEY="sk_live_your_stripe_key"
SENDGRID_API_KEY="SG.your_sendgrid_key"

# Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9090
```

**Secure the Environment File:**
```bash
sudo chmod 600 /opt/quality-platform/.env.production
sudo chown root:root /opt/quality-platform/.env.production
```

## Docker Deployment

### Step 1: Production Docker Compose

**Update docker-compose.prod.yml:**
```yaml
version: '3.9'

services:
  # Production Database
  postgres:
    image: postgres:16-alpine
    container_name: quality-platform-db-prod
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - quality-network

  # Production Redis
  redis:
    image: redis:7-alpine
    container_name: quality-platform-cache-prod
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_prod_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - quality-network

  # Production API
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: production
    container_name: quality-platform-api-prod
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: "postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}"
      REDIS_URL: "redis://:${REDIS_PASSWORD}@redis:6379"
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3001:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - quality-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Production Web
  web:
    build:
      context: .
      dockerfile: web/Dockerfile
      target: production
    container_name: quality-platform-web-prod
    restart: always
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: "https://api.your-domain.com"
    ports:
      - "3000:3000"
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - quality-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Production Nginx
  nginx:
    image: nginx:alpine
    container_name: quality-platform-nginx-prod
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx_logs:/var/log/nginx
    depends_on:
      - api
      - web
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - quality-network

  # Production Monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: quality-platform-prometheus-prod
    restart: always
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=15d'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.prod.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    networks:
      - quality-network

  grafana:
    image: grafana/grafana:latest
    container_name: quality-platform-grafana-prod
    restart: always
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
      GF_SERVER_ROOT_URL: "https://monitoring.your-domain.com"
    ports:
      - "3002:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    networks:
      - quality-network

volumes:
  postgres_prod_data:
  redis_prod_data:
  prometheus_data:
  grafana_data:
  nginx_logs:

networks:
  quality-network:
    driver: bridge
```

### Step 2: Nginx Configuration

**Create nginx/nginx.prod.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:3000;
    }

    upstream web {
        server web:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=web:10m rate=30r/s;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Main application
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/nginx/ssl/tls.crt;
        ssl_certificate_key /etc/nginx/ssl/tls.key;

        # Web application
        location / {
            limit_req zone=web burst=20 nodelay;
            proxy_pass http://web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # API server
    server {
        listen 80;
        server_name api.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.your-domain.com;

        ssl_certificate /etc/nginx/ssl/tls.crt;
        ssl_certificate_key /etc/nginx/ssl/tls.key;

        # API endpoints
        location / {
            limit_req zone=api burst=10 nodelay;
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # CORS for API
            add_header Access-Control-Allow-Origin "https://your-domain.com" always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Accept, Authorization, Cache-Control, Content-Type, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent, X-Requested-With" always;

            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }
    }

    # Monitoring
    server {
        listen 80;
        server_name monitoring.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name monitoring.your-domain.com;

        ssl_certificate /etc/nginx/ssl/tls.crt;
        ssl_certificate_key /etc/nginx/ssl/tls.key;

        # Basic authentication for monitoring
        auth_basic "Monitoring Area";
        auth_basic_user_file /etc/nginx/.htpasswd;

        # Grafana
        location / {
            proxy_pass http://grafana:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Prometheus
        location /prometheus {
            proxy_pass http://prometheus:9090;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Step 3: Deploy with Docker

```bash
# Create SSL certificates directory
mkdir -p nginx/ssl

# Copy your SSL certificates
sudo cp /path/to/your/tls.crt nginx/ssl/
sudo cp /path/to/your/tls.key nginx/ssl/

# Create authentication file for monitoring
sudo htpasswd -c nginx/.htpasswd admin

# Start production deployment
docker-compose -f docker-compose.prod.yml up -d

# Verify all services are running
docker-compose -f docker-compose.prod.yml ps

# Check logs for any issues
docker-compose -f docker-compose.prod.yml logs -f
```

## Kubernetes Deployment

### Step 1: Prepare Kubernetes Cluster

**Install Required Components:**
```bash
# Install Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Install cert-manager for Let's Encrypt
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.1/cert-manager.yaml

# Verify installations
kubectl get pods -n ingress-nginx
kubectl get pods -n cert-manager
```

### Step 2: Deploy to Kubernetes

**Create Namespace:**
```bash
kubectl apply -f k8s/base/namespace.yaml
```

**Deploy Secrets and Config:**
```bash
# Create production secrets
kubectl create secret generic quality-platform-secrets \
  --from-literal=DATABASE_URL="postgresql://prod_user:secure_password@postgres:5432/quality_platform_prod" \
  --from-literal=JWT_SECRET="your-production-jwt-secret-256-bits-minimum" \
  --from-literal=REDIS_URL="redis://redis:6379" \
  --from-literal=YOUR_DOMAIN_API_KEY="your-production-api-key" \
  --from-literal=STRIPE_API_KEY="sk_live_your_stripe_key" \
  --from-literal=SENDGRID_API_KEY="SG.your_sendgrid_key" \
  -n quality-platform

# Apply configuration
kubectl apply -f k8s/base/configmap.yaml
```

**Deploy Applications:**
```bash
# Deploy database and Redis
kubectl apply -f k8s/base/postgres-deployment.yaml
kubectl apply -f k8s/base/redis-deployment.yaml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n quality-platform --timeout=300s

# Deploy API and Web
kubectl apply -f k8s/base/api-deployment.yaml
kubectl apply -f k8s/base/web-deployment.yaml

# Deploy Ingress
kubectl apply -f k8s/base/ingress.yaml
```

**Verify Deployment:**
```bash
# Check all pods are running
kubectl get pods -n quality-platform

# Check services
kubectl get services -n quality-platform

# Check ingress
kubectl get ingress -n quality-platform

# View logs if needed
kubectl logs -l app=api -n quality-platform -f
```

### Step 3: SSL Configuration

**Let's Encrypt ClusterIssuer:**
```yaml
# k8s/cert-issuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@your-domain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

```bash
# Apply the certificate issuer
kubectl apply -f k8s/cert-issuer.yaml

# Certificates will be automatically created by ingress annotations
```

## Monitoring Setup

### Step 1: Deploy Monitoring Stack

**Deploy Prometheus and Grafana:**
```bash
# Deploy monitoring
kubectl apply -f k8s/monitoring/

# Verify monitoring pods
kubectl get pods -n quality-platform | grep -E "(prometheus|grafana)"

# Get Grafana admin password
kubectl get secret grafana-admin-secret -n quality-platform -o jsonpath="{.data.password}" | base64 --decode
```

### Step 2: Configure Dashboards

**Access Grafana:**
```bash
# Port forward for initial setup (if not using ingress)
kubectl port-forward service/grafana 3000:3000 -n quality-platform
```

**Import Dashboards:**
1. **Application Performance Dashboard**
   - API response times
   - Request rates
   - Error rates
   - Database query performance

2. **Infrastructure Dashboard**
   - CPU and memory usage
   - Network I/O
   - Disk usage
   - Container health

3. **Business Metrics Dashboard**
   - User activity
   - Feature usage
   - Error patterns
   - Performance trends

### Step 3: Configure Alerting

**Create Alert Rules:**
```yaml
# monitoring/alert-rules.yaml
groups:
- name: quality-platform-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is above 10% for 5 minutes"

  - alert: DatabaseDown
    expr: up{job="postgres"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database is down"
      description: "PostgreSQL database is not responding"

  - alert: HighCPUUsage
    expr: container_cpu_usage_seconds_total > 0.8
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage"
      description: "Container CPU usage is above 80% for 10 minutes"
```

**Configure Notifications:**
```yaml
# monitoring/alertmanager.yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@your-domain.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
- name: 'web.hook'
  email_configs:
  - to: 'admin@your-domain.com'
    subject: 'Quality Platform Alert: {{ .GroupLabels.alertname }}'
    body: |
      {{ range .Alerts }}
      Alert: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      {{ end }}
```

## Security Configuration

### Step 1: Network Security

**Firewall Configuration:**
```bash
# Ubuntu UFW setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# For Kubernetes clusters, configure network policies
kubectl apply -f k8s/security/network-policies.yaml
```

### Step 2: Application Security

**Security Headers Configuration:**
```yaml
# Already included in nginx.prod.conf
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";
```

**Rate Limiting:**
```bash
# Configure rate limiting in nginx (already in config)
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=web:10m rate=30r/s;
```

### Step 3: Database Security

**PostgreSQL Hardening:**
```sql
-- Create dedicated application user
CREATE USER quality_app_user WITH PASSWORD 'secure_app_password';
GRANT CONNECT ON DATABASE quality_platform_prod TO quality_app_user;
GRANT USAGE ON SCHEMA public TO quality_app_user;
GRANT CREATE ON SCHEMA public TO quality_app_user;

-- Revoke unnecessary permissions
REVOKE ALL ON DATABASE quality_platform_prod FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Configure connection limits
ALTER USER quality_app_user CONNECTION LIMIT 20;
```

## Post-Deployment Verification

### Step 1: Health Checks

**Automated Health Verification:**
```bash
#!/bin/bash
# health-check.sh

echo "🏥 Running post-deployment health checks..."

# Check main application
echo "Checking web application..."
curl -f -s https://your-domain.com/health || echo "❌ Web app health check failed"

# Check API
echo "Checking API..."
curl -f -s https://api.your-domain.com/api/health || echo "❌ API health check failed"

# Check database connectivity
echo "Checking database..."
curl -f -s https://api.your-domain.com/api/health/ready || echo "❌ Database connectivity failed"

# Check Redis
echo "Checking Redis cache..."
kubectl exec -it deployment/redis -n quality-platform -- redis-cli ping | grep PONG || echo "❌ Redis check failed"

# Check monitoring
echo "Checking monitoring..."
curl -f -s https://monitoring.your-domain.com/api/health || echo "❌ Monitoring check failed"

echo "✅ Health checks completed"
```

### Step 2: Smoke Tests

**Critical Path Testing:**
```bash
#!/bin/bash
# smoke-tests.sh

echo "🧪 Running smoke tests..."

API_BASE="https://api.your-domain.com/api"

# Test user registration
echo "Testing user registration..."
curl -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!","name":"Test User"}' \
  | grep -q "id" && echo "✅ User registration working" || echo "❌ User registration failed"

# Test login
echo "Testing user login..."
TOKEN=$(curl -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}' \
  | jq -r '.accessToken')

if [ "$TOKEN" != "null" ]; then
  echo "✅ User login working"
else
  echo "❌ User login failed"
  exit 1
fi

# Test protected endpoint
echo "Testing protected endpoints..."
curl -H "Authorization: Bearer $TOKEN" "$API_BASE/your-entities" \
  | grep -q "data" && echo "✅ Protected endpoints working" || echo "❌ Protected endpoints failed"

echo "✅ Smoke tests completed"
```

### Step 3: Performance Verification

**Load Testing:**
```bash
# Install k6 for load testing
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Run basic load test
k6 run --vus 10 --duration 30s performance-test.js
```

**performance-test.js:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // 10 virtual users
  duration: '30s',
};

export default function () {
  // Test main page
  let response = http.get('https://your-domain.com');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Test API endpoint
  response = http.get('https://api.your-domain.com/api/health');
  check(response, {
    'API status is 200': (r) => r.status === 200,
    'API response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

## Maintenance and Operations

### Step 1: Backup Procedures

**Database Backup:**
```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/database"
mkdir -p $BACKUP_DIR

# Create database dump
kubectl exec -it deployment/postgres -n quality-platform -- pg_dump \
  -U quality_app_user quality_platform_prod \
  > "$BACKUP_DIR/quality_platform_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/quality_platform_$DATE.sql"

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ Database backup completed: quality_platform_$DATE.sql.gz"
```

**Application Backup:**
```bash
#!/bin/bash
# backup-app.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/app"
mkdir -p $BACKUP_DIR

# Backup application configuration
tar -czf "$BACKUP_DIR/app_config_$DATE.tar.gz" \
  /opt/quality-platform/.env.production \
  /opt/quality-platform/k8s/ \
  /opt/quality-platform/nginx/ \
  /opt/quality-platform/monitoring/

echo "✅ Application backup completed: app_config_$DATE.tar.gz"
```

### Step 2: Update Procedures

**Rolling Update (Kubernetes):**
```bash
#!/bin/bash
# rolling-update.sh

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./rolling-update.sh <version>"
  exit 1
fi

echo "🚀 Starting rolling update to version $VERSION..."

# Update API
kubectl set image deployment/api api=your-org/quality-platform-api:$VERSION -n quality-platform
kubectl rollout status deployment/api -n quality-platform

# Update Web
kubectl set image deployment/web web=your-org/quality-platform-web:$VERSION -n quality-platform
kubectl rollout status deployment/web -n quality-platform

# Verify deployment
kubectl get pods -n quality-platform
./health-check.sh

echo "✅ Rolling update to $VERSION completed"
```

**Blue-Green Deployment:**
```bash
#!/bin/bash
# blue-green-deploy.sh

VERSION=$1
ENVIRONMENT=$2  # blue or green

if [ -z "$VERSION" ] || [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./blue-green-deploy.sh <version> <blue|green>"
  exit 1
fi

echo "🟦 Deploying version $VERSION to $ENVIRONMENT environment..."

# Deploy to staging environment
kubectl apply -f k8s/overlays/$ENVIRONMENT/

# Wait for deployment to be ready
kubectl wait --for=condition=available deployment/api-$ENVIRONMENT -n quality-platform --timeout=300s
kubectl wait --for=condition=available deployment/web-$ENVIRONMENT -n quality-platform --timeout=300s

# Run smoke tests on new environment
API_BASE="https://api-$ENVIRONMENT.your-domain.com/api"
./smoke-tests.sh $API_BASE

if [ $? -eq 0 ]; then
  echo "✅ Smoke tests passed, switching traffic to $ENVIRONMENT"

  # Switch ingress to new environment
  kubectl patch ingress quality-platform-ingress -n quality-platform \
    --type='json' -p="[{'op': 'replace', 'path': '/spec/rules/0/http/paths/0/backend/service/name', 'value': 'web-$ENVIRONMENT'}]"

  echo "✅ Traffic switched to $ENVIRONMENT environment"
else
  echo "❌ Smoke tests failed, keeping current environment"
  exit 1
fi
```

### Step 3: Monitoring and Alerting

**Log Aggregation:**
```bash
# Set up centralized logging with ELK stack or similar
# Configure log shipping from containers to central location

# For Docker deployment:
docker-compose -f docker-compose.prod.yml logs --tail=100 -f api web
```

**Metric Collection:**
```bash
# Configure custom metrics collection
# Add application-specific metrics to Prometheus

# Example: Business metrics
curl -X POST https://api.your-domain.com/metrics/business \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"metric":"orders_completed","value":1,"timestamp":"2024-01-01T10:00:00Z"}'
```

## Troubleshooting

### Common Issues and Solutions

**Issue 1: Pod Crash Loop**
```bash
# Check pod status
kubectl get pods -n quality-platform

# Check pod logs
kubectl logs pod-name -n quality-platform

# Check pod events
kubectl describe pod pod-name -n quality-platform

# Common solutions:
# - Check environment variables
# - Verify database connectivity
# - Check resource limits
```

**Issue 2: Database Connection Failed**
```bash
# Test database connectivity
kubectl exec -it deployment/api -n quality-platform -- npm run db:test

# Check database logs
kubectl logs deployment/postgres -n quality-platform

# Verify secrets
kubectl get secret quality-platform-secrets -n quality-platform -o yaml
```

**Issue 3: SSL Certificate Issues**
```bash
# Check certificate status
kubectl get certificate -n quality-platform

# Check cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Force certificate renewal
kubectl delete certificate quality-platform-tls -n quality-platform
kubectl apply -f k8s/base/ingress.yaml
```

**Issue 4: High Memory Usage**
```bash
# Check memory usage
kubectl top pods -n quality-platform

# Scale deployment if needed
kubectl scale deployment api --replicas=3 -n quality-platform

# Update resource limits
kubectl patch deployment api -n quality-platform -p '{"spec":{"template":{"spec":{"containers":[{"name":"api","resources":{"limits":{"memory":"1Gi"}}}]}}}}'
```

### Emergency Procedures

**Emergency Rollback:**
```bash
#!/bin/bash
# emergency-rollback.sh

echo "🚨 Initiating emergency rollback..."

# Rollback API
kubectl rollout undo deployment/api -n quality-platform

# Rollback Web
kubectl rollout undo deployment/web -n quality-platform

# Wait for rollback to complete
kubectl rollout status deployment/api -n quality-platform
kubectl rollout status deployment/web -n quality-platform

# Verify health
./health-check.sh

echo "✅ Emergency rollback completed"
```

**Scale Down for Maintenance:**
```bash
#!/bin/bash
# maintenance-mode.sh

echo "🔧 Entering maintenance mode..."

# Scale down to 0 replicas
kubectl scale deployment api --replicas=0 -n quality-platform
kubectl scale deployment web --replicas=0 -n quality-platform

# Deploy maintenance page
kubectl apply -f k8s/maintenance/maintenance-page.yaml

echo "✅ Maintenance mode enabled"
```

## Rollback Procedures

### Automated Rollback

**Health Check-Based Rollback:**
```bash
#!/bin/bash
# auto-rollback.sh

DEPLOYMENT_NAME=$1
NAMESPACE=${2:-quality-platform}
TIMEOUT=${3:-300}

echo "🔄 Monitoring deployment $DEPLOYMENT_NAME for rollback conditions..."

# Wait for deployment to be available
kubectl wait --for=condition=available deployment/$DEPLOYMENT_NAME -n $NAMESPACE --timeout=${TIMEOUT}s

# Run health checks
sleep 30  # Allow time for startup
./health-check.sh

if [ $? -ne 0 ]; then
  echo "❌ Health checks failed, initiating automatic rollback..."

  # Rollback deployment
  kubectl rollout undo deployment/$DEPLOYMENT_NAME -n $NAMESPACE

  # Wait for rollback to complete
  kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE

  echo "✅ Automatic rollback completed"

  # Send notification
  curl -X POST https://hooks.slack.com/your-webhook-url \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"🚨 Automatic rollback triggered for $DEPLOYMENT_NAME due to failed health checks\"}"
else
  echo "✅ Deployment healthy, no rollback needed"
fi
```

### Manual Rollback

**Quick Rollback Commands:**
```bash
# View rollout history
kubectl rollout history deployment/api -n quality-platform

# Rollback to previous version
kubectl rollout undo deployment/api -n quality-platform

# Rollback to specific revision
kubectl rollout undo deployment/api --to-revision=3 -n quality-platform

# Check rollback status
kubectl rollout status deployment/api -n quality-platform
```

### Database Rollback

**Schema Rollback:**
```bash
#!/bin/bash
# rollback-database.sh

BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./rollback-database.sh <backup_file>"
  exit 1
fi

echo "🗃️ Rolling back database to $BACKUP_FILE..."

# Create current backup before rollback
./backup-database.sh

# Stop API to prevent new connections
kubectl scale deployment api --replicas=0 -n quality-platform

# Restore database
kubectl exec -i deployment/postgres -n quality-platform -- psql \
  -U quality_app_user quality_platform_prod < $BACKUP_FILE

# Restart API
kubectl scale deployment api --replicas=3 -n quality-platform

# Wait for API to be ready
kubectl wait --for=condition=available deployment/api -n quality-platform --timeout=300s

echo "✅ Database rollback completed"
```

## Success Metrics

### Production Readiness Indicators

**Technical Health:**
- [ ] All pods running and healthy
- [ ] Health checks returning 200 OK
- [ ] SSL certificates valid and auto-renewing
- [ ] Monitoring dashboards showing green metrics
- [ ] No critical alerts firing
- [ ] Database backups completing successfully
- [ ] Log aggregation working
- [ ] Performance within defined budgets

**Security Compliance:**
- [ ] All security scans passing
- [ ] No high/critical vulnerabilities
- [ ] Network policies enforced
- [ ] Secrets properly encrypted
- [ ] Access controls validated
- [ ] Audit logging enabled

**Operational Excellence:**
- [ ] Runbooks documented and tested
- [ ] Incident response procedures validated
- [ ] Team trained on production procedures
- [ ] Rollback procedures tested
- [ ] Monitoring and alerting configured
- [ ] Backup and recovery tested

**Business Readiness:**
- [ ] User acceptance testing completed
- [ ] Performance meets SLA requirements
- [ ] Business metrics tracking correctly
- [ ] Support processes established
- [ ] Documentation complete and accessible

---

This comprehensive production deployment guide provides everything needed to deploy the Quality Platform v1.0.0 to production with confidence. The process includes automated health checks, monitoring setup, security hardening, and operational procedures that ensure a robust, maintainable production environment.

Remember to customize the domain names, certificates, and environment-specific configurations for your deployment. The guide follows industry best practices and provides both Docker and Kubernetes deployment options to accommodate different infrastructure preferences.