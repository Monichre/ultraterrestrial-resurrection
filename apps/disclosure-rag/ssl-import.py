#!/usr/bin/env python3
"""
SSL-aware PostgreSQL import for Xata wire-enabled database
"""

import asyncio
import asyncpg
import csv
import ssl
from pathlib import Path

async def import_csv_data():
    # SSL context that allows connection to Xata
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    database_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main"
    
    try:
        # Connect with custom SSL context
        conn = await asyncpg.connect(database_url, ssl=ssl_context)
        print("✅ Connected to PostgreSQL wire-enabled database")
        
        # Import topics first (smaller file)
        csv_path = "/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/topics.csv"
        
        if Path(csv_path).exists():
            print(f"📁 Importing {csv_path}")
            
            with open(csv_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                count = 0
                
                for row in reader:
                    try:
                        await conn.execute("""
                            INSERT INTO topics (id, name, summary, title)
                            VALUES ($1, $2, $3, $4)
                            ON CONFLICT (id) DO NOTHING
                        """, 
                        row.get('id', f'topic_{count}'),
                        row.get('name', ''),
                        row.get('summary', ''),
                        row.get('title', '')
                        )
                        count += 1
                        if count % 10 == 0:
                            print(f"  ✅ Imported {count} topics...")
                    except Exception as e:
                        print(f"  ⚠️  Error importing row {count}: {e}")
                        
                print(f"✅ Imported {count} topics total")
        else:
            print(f"❌ File not found: {csv_path}")
            
        await conn.close()
        print("✅ Import completed successfully")
        
    except Exception as e:
        print(f"❌ Import failed: {e}")

if __name__ == "__main__":
    asyncio.run(import_csv_data())