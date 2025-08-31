#!/bin/bash

# CSV Import Runner Script for PostgreSQL
# This script imports all CSV data from Xata exports into a PostgreSQL database

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}  PostgreSQL CSV Import Script${NC}"
echo -e "${BLUE}===========================================${NC}"

# Check if database connection parameters are provided
if [ -z "$DATABASE_URL" ] && [ -z "$1" ]; then
    echo -e "${RED}Error: No database connection specified.${NC}"
    echo "Usage: $0 [DATABASE_URL]"
    echo "   or: DATABASE_URL=postgresql://user:pass@host:port/db $0"
    echo ""
    echo "Example:"
    echo "  $0 'postgresql://postgres:password@localhost:5432/ultraterrestrial'"
    echo "  DATABASE_URL='postgresql://postgres:password@localhost:5432/ultraterrestrial' $0"
    exit 1
fi

# Use provided URL or environment variable
DB_URL=${1:-$DATABASE_URL}

echo -e "${YELLOW}Database URL: ${DB_URL}${NC}"
echo ""

# Check if CSV files directory exists
CSV_DIR="/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports"
if [ ! -d "$CSV_DIR" ]; then
    echo -e "${RED}Error: CSV directory not found at $CSV_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}CSV files directory: $CSV_DIR${NC}"

# Check if required CSV files exist
required_files=(
    "users.csv"
    "topics.csv" 
    "personnel.csv"
    "events.csv"
    "organizations.csv"
    "sightings.csv"
)

echo -e "${YELLOW}Checking required CSV files...${NC}"
for file in "${required_files[@]}"; do
    if [ ! -f "$CSV_DIR/$file" ]; then
        echo -e "${RED}Error: Required file $file not found in $CSV_DIR${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ Found $file${NC}"
    fi
done

echo ""

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"
if ! psql "$DB_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to database${NC}"
    echo "Please check your database URL and ensure PostgreSQL is running"
    exit 1
fi
echo -e "${GREEN}✓ Database connection successful${NC}"

# Check if pgvector extension is available
echo -e "${YELLOW}Checking pgvector extension...${NC}"
if ! psql "$DB_URL" -c "SELECT * FROM pg_extension WHERE extname = 'vector';" > /dev/null 2>&1; then
    echo -e "${YELLOW}Warning: pgvector extension not found. Attempting to create...${NC}"
    if ! psql "$DB_URL" -c "CREATE EXTENSION IF NOT EXISTS vector;" > /dev/null 2>&1; then
        echo -e "${RED}Error: Cannot create pgvector extension${NC}"
        echo "Please install pgvector or contact your database administrator"
        exit 1
    fi
fi
echo -e "${GREEN}✓ pgvector extension available${NC}"

echo ""
echo -e "${YELLOW}Starting CSV import process...${NC}"

# Run the import script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMPORT_SCRIPT="$SCRIPT_DIR/import-csv-data.sql"

if [ ! -f "$IMPORT_SCRIPT" ]; then
    echo -e "${RED}Error: Import script not found at $IMPORT_SCRIPT${NC}"
    exit 1
fi

echo -e "${BLUE}Executing import script...${NC}"
if psql "$DB_URL" -f "$IMPORT_SCRIPT"; then
    echo ""
    echo -e "${GREEN}===========================================${NC}"
    echo -e "${GREEN}  CSV Import Completed Successfully!${NC}"
    echo -e "${GREEN}===========================================${NC}"
    
    # Show final record counts
    echo -e "${BLUE}Final record counts:${NC}"
    psql "$DB_URL" -c "
        SELECT 'users' as table_name, count(*) as records FROM users
        UNION ALL SELECT 'topics', count(*) FROM topics
        UNION ALL SELECT 'personnel', count(*) FROM personnel  
        UNION ALL SELECT 'events', count(*) FROM events
        UNION ALL SELECT 'organizations', count(*) FROM organizations
        UNION ALL SELECT 'sightings', count(*) FROM sightings
        UNION ALL SELECT 'documents', count(*) FROM documents
        UNION ALL SELECT 'testimonies', count(*) FROM testimonies
        ORDER BY table_name;
    "
else
    echo -e "${RED}===========================================${NC}"
    echo -e "${RED}  CSV Import Failed!${NC}"
    echo -e "${RED}===========================================${NC}"
    exit 1
fi
