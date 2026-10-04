#!/usr/bin/env python3
"""
Import core UFO/UAP tables to PostgreSQL wire-enabled database
Focus: key-figures, artifacts, events, topics, testimonies, organizations
"""

import asyncio
import asyncpg
import csv
import json
import os
import ssl
from pathlib import Path
from datetime import datetime

class CoreTableImporter:
    def __init__(self):
        self.postgres_url = os.getenv('DATABASE_URL')
        if not self.postgres_url:
            raise RuntimeError("DATABASE_URL environment variable must be set")
        self.exports_path = Path("/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports")
        
        # Core tables to import (order matters for dependencies)
        self.core_tables = [
            'organizations',    # Independent - import first
            'key-figures',     # May reference organizations
            'topics',          # Independent
            'events',          # Independent
            'testimonies',     # May reference events/people
            'artifacts'        # May reference events/locations
        ]
        
        # Table name mappings
        self.table_mappings = {
            'key-figures': 'key_figures'
        }
        
        print(f"🛸 Core Tables Import")
        print(f"📅 {datetime.now().isoformat()}")
        print(f"🎯 Focus: {', '.join(self.core_tables)}")
        print()

    async def connect(self):
        """Connect with optimized settings"""
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        self.conn = await asyncpg.connect(
            self.postgres_url, 
            ssl=ssl_context, 
            command_timeout=120,
            server_settings={'statement_timeout': '120000'}
        )
        print("✅ Connected to PostgreSQL")

    async def close(self):
        if hasattr(self, 'conn'):
            await self.conn.close()

    def get_pg_table_name(self, csv_name: str) -> str:
        return self.table_mappings.get(csv_name, csv_name)

    def clean_value(self, value):
        """Clean and prepare value for PostgreSQL"""
        if not value or str(value).strip() == '':
            return None
        
        # Handle JSON-like strings
        if isinstance(value, str):
            value = value.strip()
            # Try to parse as JSON for arrays/objects
            if value.startswith('[') or value.startswith('{'):
                try:
                    return json.loads(value)
                except:
                    pass
        
        return value

    async def import_table(self, table_name: str) -> int:
        """Import single core table"""
        csv_path = self.exports_path / f"{table_name}.csv"
        pg_table_name = self.get_pg_table_name(table_name)
        
        if not csv_path.exists():
            print(f"⏭️  Skipping {table_name} - file not found")
            return 0
        
        print(f"📥 Importing {table_name} -> {pg_table_name}")
        
        # Read CSV and process in smaller batches
        imported = 0
        batch_size = 25  # Small batches for reliability
        current_batch = []
        
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row_num, row in enumerate(reader):
                # Clean the row
                cleaned_row = {}
                for key, value in row.items():
                    clean_key = key.replace('-', '_')
                    cleaned_row[clean_key] = self.clean_value(value)
                
                current_batch.append(cleaned_row)
                
                # Process batch when full
                if len(current_batch) >= batch_size:
                    success = await self.insert_batch(pg_table_name, current_batch)
                    if success:
                        imported += len(current_batch)
                        print(f"  📊 {imported} rows imported...")
                    current_batch = []
                
                # Progress indicator for large files
                if (row_num + 1) % 1000 == 0:
                    print(f"  📖 Processing row {row_num + 1}")
            
            # Process final batch
            if current_batch:
                success = await self.insert_batch(pg_table_name, current_batch)
                if success:
                    imported += len(current_batch)
        
        print(f"✅ Completed {pg_table_name}: {imported} rows imported")
        return imported

    async def insert_batch(self, table_name: str, batch: list) -> bool:
        """Insert batch with proper error handling"""
        if not batch:
            return True
        
        try:
            # Get columns from first row
            columns = list(batch[0].keys())
            
            # Handle reserved keywords
            quoted_columns = []
            for col in columns:
                if col.lower() in ['user', 'order', 'group']:
                    quoted_columns.append(f'"{col}"')
                else:
                    quoted_columns.append(col)
            
            # Build INSERT statement
            placeholders = ', '.join([f'${i+1}' for i in range(len(columns))])
            columns_sql = ', '.join(quoted_columns)
            
            insert_sql = f"""
            INSERT INTO {table_name} ({columns_sql})
            VALUES ({placeholders})
            ON CONFLICT (xata_id) DO UPDATE SET
                {', '.join([f'{quoted_columns[i]} = EXCLUDED.{quoted_columns[i]}' for i in range(len(columns)) if columns[i] != 'xata_id'])}
            """
            
            # Insert each row individually for better error handling
            successful = 0
            for row in batch:
                try:
                    values = [row.get(col) for col in columns]
                    await self.conn.execute(insert_sql, *values)
                    successful += 1
                except Exception as row_error:
                    print(f"    ⚠️  Row error: {str(row_error)[:100]}...")
            
            return successful > 0
            
        except Exception as e:
            print(f"❌ Batch error in {table_name}: {e}")
            return False

    async def run_import(self):
        """Import all core tables"""
        try:
            await self.connect()
            
            total_imported = 0
            successful_tables = []
            
            for table_name in self.core_tables:
                try:
                    imported = await self.import_table(table_name)
                    if imported > 0:
                        successful_tables.append(table_name)
                        total_imported += imported
                except Exception as e:
                    print(f"❌ Failed {table_name}: {e}")
            
            print(f"\n🎉 Core tables import completed!")
            print(f"📊 Total records: {total_imported:,}")
            print(f"✅ Successful tables: {len(successful_tables)}/{len(self.core_tables)}")
            print(f"📋 Imported: {', '.join(successful_tables)}")
            
        except Exception as e:
            print(f"❌ Import failed: {e}")
            raise
        finally:
            await self.close()

async def main():
    importer = CoreTableImporter()
    await importer.run_import()

if __name__ == "__main__":
    asyncio.run(main())