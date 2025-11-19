#!/bin/bash
# Database restore script for credit card database
# Usage: ./scripts/restore_database.sh <backup_name> [--force]

set -e  # Exit on error

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Database file
DB_FILE="credit_cards.db"
BACKUP_DIR="$PROJECT_ROOT/backups"

# Check arguments
if [ -z "$1" ]; then
    echo "❌ Error: Backup name required!"
    echo ""
    echo "Usage: $0 <backup_name> [--force]"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR"/*.db 2>/dev/null | sed 's|.*/||' | sed 's|\.db$||' | sed 's|^|   - |' || echo "   (no backups found)"
    exit 1
fi

BACKUP_NAME="$1"
FORCE_RESTORE=false

if [ "$2" == "--force" ]; then
    FORCE_RESTORE=true
fi

# Check if backup exists
if [ -f "$BACKUP_DIR/${BACKUP_NAME}.db" ]; then
    BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.db"
    RESTORE_METHOD="file"
elif [ -f "$BACKUP_DIR/${BACKUP_NAME}.sql" ]; then
    BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.sql"
    RESTORE_METHOD="sql"
else
    echo "❌ Error: Backup '${BACKUP_NAME}' not found!"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR"/*.db 2>/dev/null | sed 's|.*/||' | sed 's|\.db$||' | sed 's|^|   - |' || echo "   (no .db backups found)"
    ls -1 "$BACKUP_DIR"/*.sql 2>/dev/null | sed 's|.*/||' | sed 's|\.sql$||' | sed 's|^|   - |' || echo "   (no .sql backups found)"
    exit 1
fi

# Check if database exists and prompt for confirmation
if [ -f "$DB_FILE" ] && [ "$FORCE_RESTORE" != "true" ]; then
    echo "⚠️  WARNING: Database file '$DB_FILE' already exists!"
    echo "   This will OVERWRITE the current database."
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        echo "❌ Restore cancelled."
        exit 1
    fi
fi

# Create backup of current database before restore (if it exists)
if [ -f "$DB_FILE" ]; then
    CURRENT_BACKUP="credit_cards_before_restore_$(date +%Y%m%d_%H%M%S).db"
    cp "$DB_FILE" "$BACKUP_DIR/${CURRENT_BACKUP}.db"
    echo "📦 Backed up current database to: ${CURRENT_BACKUP}.db"
fi

echo ""
echo "🔄 Restoring database from: ${BACKUP_NAME}"

# Restore based on method
if [ "$RESTORE_METHOD" == "file" ]; then
    # Restore from .db file
    cp "$BACKUP_FILE" "$DB_FILE"
    echo "✅ Database restored from .db file"
else
    # Restore from .sql dump
    rm -f "$DB_FILE"  # Remove existing database
    sqlite3 "$DB_FILE" < "$BACKUP_FILE"
    echo "✅ Database restored from .sql dump"
fi

# Verify restore
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Error: Restore failed - database file not created!"
    exit 1
fi

# Get database stats
TEMPLATE_CARDS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM credit_cards WHERE customer_id IS NULL;" 2>/dev/null || echo "0")
CUSTOMER_CARDS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM credit_cards WHERE customer_id IS NOT NULL;" 2>/dev/null || echo "0")
CUSTOMERS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM customers;" 2>/dev/null || echo "0")
BONUSES=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM category_bonuses;" 2>/dev/null || echo "0")
OFFERS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM offers;" 2>/dev/null || echo "0")
MERCHANTS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM merchant_categories;" 2>/dev/null || echo "0")

echo ""
echo "📊 Restored Database Statistics:"
echo "   Template cards: ${TEMPLATE_CARDS}"
echo "   Customer cards: ${CUSTOMER_CARDS}"
echo "   Customers: ${CUSTOMERS}"
echo "   Category bonuses: ${BONUSES}"
echo "   Offers: ${OFFERS}"
echo "   Merchants: ${MERCHANTS}"
echo ""
echo "✅ Restore complete!"

