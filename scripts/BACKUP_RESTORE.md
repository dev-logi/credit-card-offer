# Database Backup and Restore Scripts

## Overview

These scripts provide a comprehensive backup and restore solution for the credit card database before running the web scraping feature or making any major changes.

## Backup Script

**Location:** `scripts/backup_database.sh`

**Usage:**
```bash
# Automatic timestamped backup
./scripts/backup_database.sh

# Custom named backup
./scripts/backup_database.sh before_scraping_feature
```

**What it does:**
1. Creates a full database file copy (`.db`)
2. Creates an SQL dump (`.sql`) for text-based backup
3. Exports all tables to CSV files for easy inspection
4. Creates a quick link `credit_cards_before_scraping.db` (for automatic backups)
5. Displays database statistics

**Output:**
- `backups/{backup_name}.db` - Full database file
- `backups/{backup_name}.sql` - SQL dump
- `backups/{backup_name}_csv/` - CSV exports of all tables

## Restore Script

**Location:** `scripts/restore_database.sh`

**Usage:**
```bash
# Interactive restore (will prompt for confirmation)
./scripts/restore_database.sh test_backup

# Force restore (no confirmation prompt)
./scripts/restore_database.sh test_backup --force

# List available backups
./scripts/restore_database.sh
```

**What it does:**
1. Checks if backup exists (supports both `.db` and `.sql` files)
2. Creates a backup of current database before restoring (safety measure)
3. Restores from backup file or SQL dump
4. Verifies restore and displays statistics

**Safety Features:**
- Prompts for confirmation before overwriting existing database
- Automatically backs up current database before restore
- Supports both `.db` file and `.sql` dump restores

## Quick Start

### Before Running Web Scraping

```bash
# Create a backup
./scripts/backup_database.sh before_scraping

# This creates:
# - backups/before_scraping.db
# - backups/before_scraping.sql
# - backups/before_scraping_csv/
```

### If You Need to Restore

```bash
# Restore from backup
./scripts/restore_database.sh before_scraping

# Or restore from quick link (if using automatic backup)
./scripts/restore_database.sh credit_cards_before_scraping
```

## Backup Directory Structure

```
backups/
├── credit_cards_backup_20250114_153500.db
├── credit_cards_backup_20250114_153500.sql
├── credit_cards_backup_20250114_153500_csv/
│   ├── credit_cards.csv
│   ├── category_bonuses.csv
│   ├── offers.csv
│   ├── merchant_categories.csv
│   └── customers.csv
└── credit_cards_before_scraping.db -> (symlink to latest)
```

## Notes

- Backups are stored in `backups/` directory (excluded from git)
- The restore script automatically creates a backup of the current database before restoring
- Both `.db` file and `.sql` dump formats are supported
- CSV exports are useful for data analysis and inspection

