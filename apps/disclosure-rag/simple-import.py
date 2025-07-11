#!/usr/bin/env python3
"""
Simple CSV import to PostgreSQL - test with key tables first
"""

import asyncio
import asyncpg
import csv
import ssl
from pathlib import Path
from datetime import datetime

async def simple_import():
    # Connection
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    exports_path = Path("/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports")
    
    print(f"🛸 Simple CSV Import Test")
    print(f"📅 {datetime.now().isoformat()}")
    print()
    
    # SSL setup
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        conn = await asyncpg.connect(postgres_url, ssl=ssl_context, command_timeout=60)
        print("✅ Connected to PostgreSQL")
        
        # Test with just a few key tables
        test_tables = ['events', 'topics', 'documents', 'personnel']
        total_imported = 0
        
        for table_name in test_tables:
            csv_path = exports_path / f"{table_name}.csv"
            
            if not csv_path.exists():
                print(f"⏭️  Skipping {table_name} - not found")
                continue
            
            print(f"📥 Importing {table_name}...")
            
            # Read CSV and get first few rows
            with open(csv_path, 'r') as f:
                reader = csv.DictReader(f)
                rows = []
                for i, row in enumerate(reader):
                    if i >= 10:  # Limit to first 10 rows for testing
                        break
                    
                    # Clean up None values
                    cleaned_row = {}
                    for key, value in row.items():
                        if value and value.strip():
                            cleaned_row[key.replace('-', '_')] = value.strip()
                        else:
                            cleaned_row[key.replace('-', '_')] = None
                    rows.append(cleaned_row)
            
            if not rows:
                print(f"⏭️  Skipping empty {table_name}")
                continue
            
            # Import rows
            imported = 0
            for row in rows:
                try:
                    # Build simple INSERT
                    columns = list(row.keys())
                    values = list(row.values())
                    
                    # Handle reserved keywords
                    quoted_columns = []
                    for col in columns:
                        if col.lower() == 'user':
                            quoted_columns.append(f'"{col}"')
                        else:
                            quoted_columns.append(col)
                    
                    placeholders = ', '.join([f'${i+1}' for i in range(len(values))])
                    columns_sql = ', '.join(quoted_columns)
                    
                    insert_sql = f"""
                    INSERT INTO {table_name} ({columns_sql})
                    VALUES ({placeholders})
                    ON CONFLICT (xata_id) DO NOTHING
                    """
                    
                    await conn.execute(insert_sql, *values)
                    imported += 1
                    
                except Exception as e:
                    print(f"  ❌ Row error: {e}")
            
            print(f"✅ {table_name}: {imported} rows imported")
            total_imported += imported
        
        print(f"\n🎉 Test import completed: {total_imported} total rows")
        await conn.close()
        
    except Exception as e:
        print(f"❌ Import failed: {e}")

if __name__ == "__main__":
    asyncio.run(simple_import())