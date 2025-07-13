#!/usr/bin/env python3
"""
Direct SQL import from Xata exports
Simple, reliable approach for UFO/UAP database import
"""

import asyncio
import asyncpg
import csv
import json
import os
import uuid
import re
from pathlib import Path
from typing import Dict, List, Any, Optional

class DirectSQLImporter:
    def __init__(self, database_url: str, exports_path: str):
        self.database_url = database_url
        self.exports_path = Path(exports_path)
        self.conn = None
        
        # Simple table mapping
        self.tables_to_import = [
            ('users.csv', 'users', ['email', 'name', 'profile_image_url', 'external_id']),
            ('organizations.csv', 'organizations', ['name', 'specialization', 'description']),
            ('personnel.csv', 'personnel', ['name', 'bio', 'role', 'rank', 'credibility', 'popularity', 'authority']),
            ('topics.csv', 'topics', ['name', 'summary', 'title']),
            ('locations.csv', 'locations', ['name', 'coordinates', 'city', 'state', 'latitude', 'longitude']),
            ('events.csv', 'events', ['name', 'description', 'location', 'latitude', 'longitude', 'date', 'title', 'summary', 'category']),
            ('sightings.csv', 'sightings', ['date', 'description', 'media_link', 'city', 'state', 'country', 'shape', 'duration_seconds', 'duration_hours_min', 'comments', 'date_posted', 'latitude', 'longitude']),
            ('documents.csv', 'documents', ['title', 'summary', 'date', 'url', 'processed']),
            ('testimonies.csv', 'testimonies', ['claim', 'summary', 'date', 'source', 'context']),
            ('artifacts.csv', 'artifacts', ['name', 'description', 'date', 'source', 'origin']),
        ]

    async def connect(self):
        """Connect to PostgreSQL"""
        self.conn = await asyncpg.connect(self.database_url)
        print("✅ Connected to PostgreSQL")

    async def close(self):
        """Close connection"""
        if self.conn:
            await self.conn.close()

    def generate_uuid(self, xata_id: str = None) -> str:
        """Generate valid UUID"""
        if xata_id and len(xata_id) > 3:
            # Use hash of xata_id for consistency
            import hashlib
            hash_obj = hashlib.md5(xata_id.encode())
            hex_dig = hash_obj.hexdigest()
            # Format as UUID
            return f"{hex_dig[:8]}-{hex_dig[8:12]}-{hex_dig[12:16]}-{hex_dig[16:20]}-{hex_dig[20:]}"
        return str(uuid.uuid4())

    def clean_value(self, value: Any, column_name: str) -> Any:
        """Clean value for PostgreSQL"""
        if value is None or value == '' or value == 'NULL':
            return None
            
        # Handle specific column types
        if column_name in ['latitude', 'longitude']:
            try:
                return float(value)
            except (ValueError, TypeError):
                return None
                
        if column_name in ['rank', 'credibility', 'popularity', 'authority']:
            try:
                return int(value)
            except (ValueError, TypeError):
                return None
                
        if column_name in ['processed']:
            return str(value).lower() == 'true'
            
        if column_name in ['date', 'date_posted']:
            if value and value != '':
                # Clean date format
                try:
                    from datetime import datetime
                    # Try parsing common formats
                    for fmt in ['%Y-%m-%d', '%Y-%m-%dT%H:%M:%S', '%Y-%m-%dT%H:%M:%S.%f']:
                        try:
                            return datetime.strptime(str(value)[:19], fmt)
                        except:
                            continue
                    return None
                except:
                    return None
            return None
            
        # Clean text fields
        if isinstance(value, str):
            # Remove null bytes and clean up
            value = value.replace('\x00', '').strip()
            if len(value) > 50000:  # Truncate very long text
                value = value[:50000] + '...'
                
        return value

    async def import_table(self, csv_file: str, table_name: str, columns: List[str]) -> int:
        """Import single table"""
        csv_path = self.exports_path / csv_file
        
        if not csv_path.exists():
            print(f"⏭️  Skipping {csv_file} - file not found")
            return 0
            
        print(f"📥 Importing {csv_file} -> {table_name}")
        
        # Clear existing data
        await self.conn.execute(f"DELETE FROM {table_name}")
        
        imported = 0
        batch = []
        batch_size = 100
        
        try:
            with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
                # Skip malformed lines
                reader = csv.DictReader(f)
                
                for row_num, row in enumerate(reader):
                    try:
                        # Generate UUID
                        record_id = self.generate_uuid(row.get('id', ''))
                        
                        # Clean data
                        clean_row = {'xata_id': record_id}
                        for col in columns:
                            # Map CSV column to our column
                            csv_col = col.replace('_', '-') if col.replace('_', '-') in row else col
                            value = row.get(csv_col, row.get(col))
                            clean_row[col] = self.clean_value(value, col)
                        
                        batch.append(clean_row)
                        
                        # Process batch
                        if len(batch) >= batch_size:
                            success = await self.insert_batch(table_name, batch, columns)
                            if success:
                                imported += len(batch)
                                print(f"  📊 {imported} rows imported...")
                            batch = []
                            
                    except Exception as e:
                        print(f"  ⚠️  Skipping row {row_num}: {e}")
                        continue
                
                # Process remaining batch
                if batch:
                    success = await self.insert_batch(table_name, batch, columns)
                    if success:
                        imported += len(batch)
                        
        except Exception as e:
            print(f"❌ Error reading {csv_file}: {e}")
            return imported
            
        print(f"✅ Completed {table_name}: {imported} rows")
        return imported

    async def insert_batch(self, table_name: str, batch: List[Dict], columns: List[str]) -> bool:
        """Insert batch of records"""
        if not batch:
            return True
            
        try:
            # Prepare SQL
            all_columns = ['xata_id'] + columns
            placeholders = ', '.join([f'${i+1}' for i in range(len(all_columns))])
            columns_sql = ', '.join(all_columns)
            
            insert_sql = f"""
            INSERT INTO {table_name} ({columns_sql})
            VALUES ({placeholders})
            ON CONFLICT (xata_id) DO NOTHING
            """
            
            # Execute each record
            for record in batch:
                values = [record.get(col) for col in all_columns]
                await self.conn.execute(insert_sql, *values)
                
            return True
            
        except Exception as e:
            print(f"  ❌ Batch insert error: {e}")
            return False

    async def verify_import(self):
        """Verify import results"""
        print("\n📊 Import Summary:")
        print("-" * 30)
        
        total = 0
        for _, table_name, _ in self.tables_to_import:
            try:
                count = await self.conn.fetchval(f"SELECT COUNT(*) FROM {table_name}")
                print(f"{table_name}: {count:,} rows")
                total += count
            except Exception as e:
                print(f"{table_name}: Error - {e}")
                
        print(f"\nTotal records: {total:,}")

    async def run_import(self):
        """Run complete import"""
        try:
            print("🛸 UFO/UAP Direct SQL Import")
            print("=" * 40)
            
            await self.connect()
            
            total_imported = 0
            
            for csv_file, table_name, columns in self.tables_to_import:
                imported = await self.import_table(csv_file, table_name, columns)
                total_imported += imported
            
            await self.verify_import()
            
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
    
    importer = DirectSQLImporter(database_url, exports_path)
    await importer.run_import()

if __name__ == "__main__":
    asyncio.run(main())