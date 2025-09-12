# Deployment Guide

## Overview

This guide covers deployment strategies for the Quality Platform API across different environments. The platform is designed to be cloud-native and supports various deployment scenarios from simple VPS hosting to enterprise Kubernetes clusters.

## Environment Configurations

### Development Environment

**Database**: SQLite (file-based)
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
PORT=3000
JWT_SECRET="development-secret-key"
JWT_EXPIRES_IN="7d"
```

### Production Environment

**Database**: PostgreSQL (managed or self-hosted)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quality_platform"
NODE_ENV="production"
PORT=3000
JWT_SECRET="super-secure-production-secret-256-bit-key"
JWT_EXPIRES_IN="1d"
LOG_LEVEL="info"
```

### Staging Environment

**Database**: PostgreSQL (smaller instance)
```env
DATABASE_URL="postgresql://username:password@staging-db:5432/quality_platform_staging"
NODE_ENV="staging"
PORT=3000
JWT_SECRET="staging-secret-key-different-from-prod"
JWT_EXPIRES_IN="7d"
LOG_LEVEL="debug"
```

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Docker Setup

Create `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm nx build api

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma ./node_modules/.pnpm/@prisma

# Generate Prisma client for production
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "dist/apps/api/main.js"]
```

#### Docker Compose for Development

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/quality_platform
      - JWT_SECRET=your-production-secret-key
      - JWT_EXPIRES_IN=1d
    depends_on:
      - db
    volumes:
      - ./prisma:/app/prisma

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: quality_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Build and Deploy

```bash
# Build Docker image
docker build -t quality-platform-api .

# Run with Docker Compose
docker-compose up -d

# Apply database migrations
docker-compose exec app npx prisma migrate deploy
```

### 2. Traditional VPS Deployment

#### Prerequisites

```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install PM2 (process manager)
npm install -g pm2
```

#### Deployment Steps

```bash
# 1. Clone and setup application
git clone https://github.com/antoniogomezgallardo/Quality-Platform.git
cd Quality-Platform

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with production values

# 4. Build application
pnpm nx build api

# 5. Setup database
createdb quality_platform
npx prisma migrate deploy

# 6. Create PM2 ecosystem file
```

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'quality-platform-api',
    script: 'dist/apps/api/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# 7. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Cloud Platform Deployments

#### AWS Elastic Beanstalk

1. **Create `Procfile`**:
```
web: node dist/apps/api/main.js
```

2. **Create `.ebextensions/01_nodecommand.config`**:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

3. **Deploy**:
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init
eb create quality-platform-api
eb deploy
```

#### Heroku Deployment

1. **Create `Procfile`**:
```
web: node dist/apps/api/main.js
release: npx prisma migrate deploy
```

2. **Deploy**:
```bash
# Install Heroku CLI and login
heroku create quality-platform-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set DATABASE_URL=your-postgres-url

# Deploy
git push heroku main
```

#### Vercel Deployment

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/apps/api/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/apps/api/main.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 4. Kubernetes Deployment

#### Deployment Configuration

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: quality-platform-api
  labels:
    app: quality-platform-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: quality-platform-api
  template:
    metadata:
      labels:
        app: quality-platform-api
    spec:
      containers:
      - name: api
        image: quality-platform-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        livenessProbe:
          httpGet:
            path: /api/health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: 500m
            memory: 512Mi
          requests:
            cpu: 250m
            memory: 256Mi
```

#### Service Configuration

Create `k8s/service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: quality-platform-api-service
spec:
  selector:
    app: quality-platform-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

#### Ingress Configuration

Create `k8s/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: quality-platform-api-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.your-domain.com
    secretName: api-tls
  rules:
  - host: api.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: quality-platform-api-service
            port:
              number: 80
```

## Database Migrations

### Production Migration Strategy

```bash
# 1. Backup database
pg_dump quality_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply migrations
npx prisma migrate deploy

# 3. Verify application health
curl https://your-api.com/api/health/ready
```

### Zero-Downtime Migrations

1. **Use blue-green deployment**
2. **Apply backward-compatible schema changes first**
3. **Deploy application code**
4. **Remove deprecated fields in subsequent deployment**

## Monitoring and Observability

### Health Checks

The API provides three health check endpoints:

- **`/api/health`**: Basic health status
- **`/api/health/ready`**: Readiness check (database connectivity)
- **`/api/health/live`**: Liveness check (process health)

### Logging Configuration

Production logging setup:

```typescript
// main.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn', 'log'] 
      : ['error', 'warn', 'log', 'debug'],
  });
  
  logger.log(`Application running on port ${port}`);
}
```

### Metrics Collection (Recommended)

Add Prometheus metrics:

```bash
pnpm add @willsoto/nestjs-prometheus prom-client
```

```typescript
// app.module.ts
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register(),
    // other imports
  ],
})
export class AppModule {}
```

## Security Considerations

### Environment Variables

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### SSL/TLS Configuration

Use Let's Encrypt for free SSL certificates:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw deny 3000   # Block direct API access
sudo ufw enable
```

## Performance Optimization

### Application Optimization

1. **Enable compression**:
```typescript
// main.ts
import * as compression from 'compression';
app.use(compression());
```

2. **Set up caching**:
```typescript
// Install cache manager
pnpm add cache-manager
```

3. **Database connection pooling**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=20&pool_timeout=20"
```

### Infrastructure Optimization

1. **Use CDN for static assets**
2. **Implement database read replicas**
3. **Set up Redis for caching**
4. **Use load balancers for multiple instances**

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump quality_platform > /backups/quality_platform_$DATE.sql
gzip /backups/quality_platform_$DATE.sql

# Cleanup old backups (keep 30 days)
find /backups -name "quality_platform_*.sql.gz" -mtime +30 -delete
```

### Application Backups

```bash
# Backup configuration and environment
tar -czf config_backup_$(date +%Y%m%d).tar.gz .env ecosystem.config.js
```

## Rollback Procedures

### Application Rollback

```bash
# With PM2
pm2 stop quality-platform-api
git checkout previous-tag
pnpm install
pnpm nx build api
pm2 start ecosystem.config.js

# With Docker
docker stop quality-platform-api
docker run -d --name quality-platform-api quality-platform-api:previous-tag
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d quality_platform backup_file.sql

# Or use Prisma migrations
npx prisma migrate reset
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build application
      run: pnpm nx build api
    
    - name: Run tests
      run: pnpm nx test api
    
    - name: Deploy to server
      run: |
        # Deploy script here
        ssh user@server 'cd /app && git pull && pnpm install && pnpm nx build api && pm2 restart quality-platform-api'
```

## Troubleshooting

### Common Deployment Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000
kill -9 <PID>
```

#### Database Connection Issues
```bash
# Test database connectivity
psql -h hostname -U username -d database_name -c "SELECT 1"
```

#### Permission Issues
```bash
# Fix file permissions
chown -R nodejs:nodejs /app
chmod +x start_script.sh
```

#### Memory Issues
```bash
# Monitor memory usage
htop
# Or
docker stats
```

### Monitoring Commands

```bash
# Check application logs
pm2 logs quality-platform-api

# Check system resources
htop
df -h
free -h

# Check database connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'quality_platform';
```

This deployment guide provides comprehensive coverage for various deployment scenarios. Choose the approach that best fits your infrastructure requirements and operational capabilities.