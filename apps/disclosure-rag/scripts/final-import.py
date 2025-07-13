#!/usr/bin/env python3
"""
Final CSV import script - matches existing PostgreSQL schema
Simple import of UFO/UAP research data without schema changes
"""

import asyncio
import asyncpg
import csv
import os
import uuid
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

class FinalImporter:
    def __init__(self, database_url: str, exports_path: str):
        self.database_url = database_url
        self.exports_path = Path(exports_path)
        self.conn = None

    async def connect(self):
        """Connect to PostgreSQL"""
        self.conn = await asyncpg.connect(self.database_url)
        print("✅ Connected to PostgreSQL")

    async def close(self):
        """Close connection"""
        if self.conn:
            await self.conn.close()

    def clean_value(self, value: Any, column_type: str = 'text') -> Any:
        """Clean value for PostgreSQL"""
        if value is None or value == '' or value == 'NULL':
            return None
            
        if column_type in ['double precision', 'real']:
            try:
                return float(value)
            except (ValueError, TypeError):
                return None
                
        if column_type in ['integer', 'bigint']:
            try:
                return int(value)
            except (ValueError, TypeError):
                return None
                
        if column_type == 'boolean':
            return str(value).lower() in ['true', '1', 'yes']
            
        if column_type in ['timestamp', 'timestamp without time zone', 'timestamptz']:
            if value and str(value).strip():
                try:
                    # Clean up timestamp
                    val_str = str(value).strip()
                    if 'T' in val_str:
                        val_str = val_str.split('T')[0]  # Take just date part
                    return datetime.strptime(val_str[:10], '%Y-%m-%d')
                except:
                    return None
            return None
            
        # Clean text
        if isinstance(value, str):
            value = value.replace('\x00', '').strip()
            if len(value) > 10000:  # Truncate very long text
                value = value[:10000] + '...'
                
        return value

    async def get_table_schema(self, table_name: str) -> Dict[str, str]:
        """Get table column types"""
        query = """
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
        """
        rows = await self.conn.fetch(query, table_name)
        return {row['column_name']: row['data_type'] for row in rows}

    async def import_table_simple(self, csv_file: str, table_name: str) -> int:
        """Simple table import matching existing schema"""
        csv_path = self.exports_path / csv_file
        
        if not csv_path.exists():
            print(f"⏭️  Skipping {csv_file} - file not found")
            return 0
            
        print(f"📥 Importing {csv_file} -> {table_name}")
        
        # Get table schema
        schema = await self.get_table_schema(table_name)
        
        if not schema:
            print(f"❌ Table {table_name} not found")
            return 0
            
        # Clear existing data
        await self.conn.execute(f"DELETE FROM {table_name}")
        
        imported = 0
        batch = []
        batch_size = 50  # Smaller batches
        
        try:
            with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
                reader = csv.DictReader(f)
                
                for row_num, row in enumerate(reader):
                    try:
                        # Prepare record with UUID
                        record = {'id': str(uuid.uuid4())}
                        
                        # Map CSV columns to table columns
                        for csv_col, value in row.items():
                            # Convert CSV column name to PostgreSQL column name
                            pg_col = csv_col.replace('-', '_').lower()
                            
                            if pg_col in schema and pg_col != 'id':
                                clean_val = self.clean_value(value, schema[pg_col])
                                record[pg_col] = clean_val
                        
                        batch.append(record)
                        
                        # Process batch
                        if len(batch) >= batch_size:
                            success = await self.insert_batch_simple(table_name, batch, schema)
                            if success:
                                imported += len(batch)
                                print(f"  📊 {imported} rows imported...")
                            batch = []
                            
                    except Exception as e:
                        print(f"  ⚠️  Skipping row {row_num}: {e}")
                        continue
                
                # Process remaining batch
                if batch:
                    success = await self.insert_batch_simple(table_name, batch, schema)
                    if success:
                        imported += len(batch)
                        
        except Exception as e:
            print(f"❌ Error reading {csv_file}: {e}")
            return imported
            
        print(f"✅ Completed {table_name}: {imported} rows")
        return imported

    async def insert_batch_simple(self, table_name: str, batch: List[Dict], schema: Dict[str, str]) -> bool:
        """Insert batch with error handling"""
        if not batch:
            return True
            
        for record in batch:
            try:
                # Get columns that exist in both record and schema
                columns = [col for col in record.keys() if col in schema]
                values = [record[col] for col in columns]
                
                # Create INSERT
                placeholders = ', '.join([f'${i+1}' for i in range(len(columns))])
                columns_sql = ', '.join(columns)
                
                insert_sql = f"""
                INSERT INTO {table_name} ({columns_sql})
                VALUES ({placeholders})
                ON CONFLICT (id) DO NOTHING
                """
                
                await self.conn.execute(insert_sql, *values)
                
            except Exception as e:
                print(f"  ⚠️  Insert error: {e}")
                continue
                
        return True

    async def run_import(self):
        """Run import for key tables"""
        try:
            print("🛸 UFO/UAP Simple Import")
            print("=" * 30)
            
            await self.connect()
            
            # Import key tables only
            key_tables = [
                ('users.csv', 'users'),
                ('organizations.csv', 'organizations'),
                ('personnel.csv', 'personnel'),
                ('topics.csv', 'topics'),
                ('events.csv', 'events'),
                ('testimonies.csv', 'testimonies'),
                ('documents.csv', 'documents'),
                ('sightings.csv', 'sightings'),
                ('locations.csv', 'locations'),
                ('artifacts.csv', 'artifacts'),
            ]
            
            total_imported = 0
            
            for csv_file, table_name in key_tables:
                imported = await self.import_table_simple(csv_file, table_name)
                total_imported += imported
            
            # Summary
            print("\n📊 Import Summary:")
            for _, table_name in key_tables:
                try:
                    count = await self.conn.fetchval(f"SELECT COUNT(*) FROM {table_name}")
                    print(f"  {table_name}: {count:,} rows")
                except:
                    print(f"  {table_name}: Error")
            
            print(f"\n🎉 Import completed!")
            print(f"📊 Total processed: {total_imported:,}")
            
        except Exception as e:
            print(f"❌ Import failed: {e}")
            raise
        finally:
            await self.close()

async def main():
    """Main function"""
    database_url = os.getenv('DATABASE_URL', 'postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require')
    exports_path = '../../../apps/app/scripts/xata-exports/exports'
    
    importer = FinalImporter(database_url, exports_path)
    await importer.run_import()

if __name__ == "__main__":
    asyncio.run(main())