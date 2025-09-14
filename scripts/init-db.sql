-- PostgreSQL initialization script for production
-- This script sets up the database with optimal configuration for production use

-- Create database if not exists (run as superuser)
-- CREATE DATABASE quality_platform WITH ENCODING 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';

-- Performance optimization settings
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';

-- Connection pooling settings
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET max_prepared_transactions = 0;

-- Logging configuration for production
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_duration = off;
ALTER SYSTEM SET log_error_verbosity = default;
ALTER SYSTEM SET log_hostname = on;
ALTER SYSTEM SET log_line_prefix = '%m [%p] %q%u@%d ';
ALTER SYSTEM SET log_lock_waits = on;
ALTER SYSTEM SET log_statement = 'ddl';
ALTER SYSTEM SET log_temp_files = 0;
ALTER SYSTEM SET log_timezone = 'UTC';

-- Create application user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_user
      WHERE usename = 'quality_user') THEN
      CREATE USER quality_user WITH PASSWORD 'change_in_production';
   END IF;
END
$do$;

-- Grant privileges
GRANT CONNECT ON DATABASE quality_platform TO quality_user;
GRANT USAGE ON SCHEMA public TO quality_user;
GRANT CREATE ON SCHEMA public TO quality_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO quality_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO quality_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO quality_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO quality_user;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for better performance (after migrations run)
-- These will be created by Prisma migrations, but included here for reference
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category ON products(category);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_id ON orders(user_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status ON orders(status);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);

-- Reload configuration
SELECT pg_reload_conf();