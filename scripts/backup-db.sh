#!/bin/bash

# PostgreSQL Backup Script for Production
# This script creates compressed backups with rotation

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-quality_platform}"
DB_USER="${DB_USER:-quality_user}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to send notifications (integrate with your monitoring)
notify() {
    local status=$1
    local message=$2
    # Add notification logic here (Slack, email, etc.)
    log "$status: $message"
}

# Perform backup
log "Starting backup of database: $DB_NAME"

# Use pg_dump with compression
if PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --verbose \
    2>/tmp/backup_error.log | gzip > "$BACKUP_FILE"; then

    # Get backup size
    BACKUP_SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
    log "Backup completed successfully: $BACKUP_FILE (Size: $BACKUP_SIZE)"

    # Verify backup integrity
    if gunzip -t "$BACKUP_FILE" 2>/dev/null; then
        log "Backup integrity verified"
        notify "SUCCESS" "Database backup completed: $DB_NAME ($BACKUP_SIZE)"
    else
        log "ERROR: Backup integrity check failed"
        notify "ERROR" "Database backup integrity check failed: $DB_NAME"
        exit 1
    fi

    # Clean old backups
    log "Cleaning backups older than $RETENTION_DAYS days"
    find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

    # List remaining backups
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/${DB_NAME}_*.sql.gz 2>/dev/null | wc -l)
    log "Current backup count: $BACKUP_COUNT"

else
    ERROR_MSG=$(tail -n 5 /tmp/backup_error.log)
    log "ERROR: Backup failed - $ERROR_MSG"
    notify "ERROR" "Database backup failed: $DB_NAME - $ERROR_MSG"
    exit 1
fi

# Optional: Upload to S3 or other cloud storage
if [ -n "$AWS_S3_BUCKET" ]; then
    log "Uploading backup to S3: s3://$AWS_S3_BUCKET/backups/"
    if aws s3 cp "$BACKUP_FILE" "s3://$AWS_S3_BUCKET/backups/" \
        --storage-class STANDARD_IA \
        --server-side-encryption AES256; then
        log "S3 upload completed"
        notify "SUCCESS" "Backup uploaded to S3: $BACKUP_FILE"
    else
        log "WARNING: S3 upload failed"
        notify "WARNING" "S3 upload failed for: $BACKUP_FILE"
    fi
fi

log "Backup process completed"