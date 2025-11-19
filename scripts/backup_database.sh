#!/bin/bash
# Database backup script for credit card database
# Usage: ./scripts/backup_database.sh [backup_name]

set -e  # Exit on error

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Database file
DB_FILE="credit_cards.db"

# Check if database exists
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Error: Database file '$DB_FILE' not found!"
    exit 1
fi

# Create backup directory
BACKUP_DIR="$PROJECT_ROOT/backups"
mkdir -p "$BACKUP_DIR"

# Generate backup name
if [ -n "$1" ]; then
    BACKUP_NAME="$1"
else
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="credit_cards_backup_${TIMESTAMP}"
fi

echo "📦 Creating database backup: ${BACKUP_NAME}"
echo ""

# 1. Full database file copy
cp "$DB_FILE" "$BACKUP_DIR/${BACKUP_NAME}.db"
echo "✅ Database file copied: ${BACKUP_NAME}.db"

# 2. SQL dump
sqlite3 "$DB_FILE" .dump > "$BACKUP_DIR/${BACKUP_NAME}.sql"
echo "✅ SQL dump created: ${BACKUP_NAME}.sql"

# 3. CSV exports
CSV_DIR="$BACKUP_DIR/${BACKUP_NAME}_csv"
mkdir -p "$CSV_DIR"

sqlite3 -header -csv "$DB_FILE" "SELECT * FROM credit_cards;" > "$CSV_DIR/credit_cards.csv"
echo "   - credit_cards.csv"

sqlite3 -header -csv "$DB_FILE" "SELECT * FROM category_bonuses;" > "$CSV_DIR/category_bonuses.csv"
echo "   - category_bonuses.csv"

sqlite3 -header -csv "$DB_FILE" "SELECT * FROM offers;" > "$CSV_DIR/offers.csv"
echo "   - offers.csv"

sqlite3 -header -csv "$DB_FILE" "SELECT * FROM merchant_categories;" > "$CSV_DIR/merchant_categories.csv"
echo "   - merchant_categories.csv"

sqlite3 -header -csv "$DB_FILE" "SELECT * FROM customers;" > "$CSV_DIR/customers.csv"
echo "   - customers.csv"

echo "✅ CSV exports created in ${BACKUP_NAME}_csv/"

# 4. Create a "before-scraping" symlink for easy access (if no custom name)
if [ -z "$1" ]; then
    ln -sf "${BACKUP_NAME}.db" "$BACKUP_DIR/credit_cards_before_scraping.db"
    echo "✅ Quick link created: credit_cards_before_scraping.db"
fi

# 5. Get database stats
TEMPLATE_CARDS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM credit_cards WHERE customer_id IS NULL;" 2>/dev/null || echo "0")
CUSTOMER_CARDS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM credit_cards WHERE customer_id IS NOT NULL;" 2>/dev/null || echo "0")
CUSTOMERS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM customers;" 2>/dev/null || echo "0")
BONUSES=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM category_bonuses;" 2>/dev/null || echo "0")
OFFERS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM offers;" 2>/dev/null || echo "0")
MERCHANTS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM merchant_categories;" 2>/dev/null || echo "0")

echo ""
echo "📊 Database Statistics:"
echo "   Template cards: ${TEMPLATE_CARDS}"
echo "   Customer cards: ${CUSTOMER_CARDS}"
echo "   Customers: ${CUSTOMERS}"
echo "   Category bonuses: ${BONUSES}"
echo "   Offers: ${OFFERS}"
echo "   Merchants: ${MERCHANTS}"

echo ""
echo "📦 Backup Summary:"
echo "   Database file: $BACKUP_DIR/${BACKUP_NAME}.db"
echo "   SQL dump: $BACKUP_DIR/${BACKUP_NAME}.sql"
echo "   CSV files: $BACKUP_DIR/${BACKUP_NAME}_csv/"
if [ -z "$1" ]; then
    echo "   Quick link: $BACKUP_DIR/credit_cards_before_scraping.db"
fi
echo ""
echo "✅ Backup complete!"

