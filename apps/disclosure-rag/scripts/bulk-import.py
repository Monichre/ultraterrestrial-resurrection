#!/usr/bin/env python3
"""
Bulk import Xata CSV exports using PostgreSQL COPY command
Fast import of 61,321+ UFO/UAP research records
"""

import asyncio
import asyncpg
import csv
import json
import os
import uuid
from pathlib import Path
from typing import Dict, List, Any, Optional
import tempfile

class BulkImporter:
    def __init__(self, database_url: str, exports_path: str):
        self.database_url = database_url
        self.exports_path = Path(exports_path)
        self.conn = None
        
        # Priority order for imports (respect foreign keys)
        self.import_tables = [
            ('users.csv', 'users'),
            ('organizations.csv', 'organizations'),  
            ('personnel.csv', 'personnel'),
            ('topics.csv', 'topics'),
            ('events.csv', 'events'),
            ('locations.csv', 'locations'),
            ('sightings.csv', 'sightings'),
            ('documents.csv', 'documents'),
            ('testimonies.csv', 'testimonies'),
            ('artifacts.csv', 'artifacts'),
        ]

    async def connect(self):
        """Connect to PostgreSQL"""
        self.conn = await asyncpg.connect(self.database_url)
        print("✅ Connected to PostgreSQL")

    async def close(self):
        """Close connection"""
        if self.conn:
            await self.conn.close()

    def convert_xata_id_to_uuid(self, xata_id: str) -> str:
        """Convert Xata ID to valid UUID"""
        if not xata_id or xata_id == '':
            return str(uuid.uuid4())
        
        # Remove 'rec_' prefix if present
        clean_id = xata_id.replace('rec_', '')
        
        # Pad or truncate to 32 characters
        if len(clean_id) < 32:
            clean_id = clean_id.ljust(32, '0')
        elif len(clean_id) > 32:
            clean_id = clean_id[:32]
        
        # Insert UUID hyphens: 8-4-4-4-12
        formatted_uuid = f"{clean_id[:8]}-{clean_id[8:12]}-{clean_id[12:16]}-{clean_id[16:20]}-{clean_id[20:32]}"
        return formatted_uuid

    async def prepare_csv_for_import(self, csv_file: str, table_name: str) -> Optional[str]:
        """Prepare CSV file for PostgreSQL import"""
        csv_path = self.exports_path / csv_file
        
        if not csv_path.exists():
            print(f"⏭️  Skipping {csv_file} - file not found")
            return None
            
        print(f"🔄 Preparing {csv_file} for {table_name}")
        
        # Get table structure
        columns_info = await self.get_table_columns(table_name)
        pg_columns = [col['name'] for col in columns_info if col['name'] != 'id']
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv')
        
        try:
            with open(csv_path, 'r', encoding='utf-8') as infile:
                reader = csv.DictReader(infile)
                
                # Write header with PostgreSQL column names
                writer = csv.DictWriter(temp_file, fieldnames=pg_columns)
                writer.writeheader()
                
                count = 0
                for row in reader:
                    # Convert and clean data
                    clean_row = self.clean_row_data(row, table_name)
                    
                    # Only include columns that exist in PostgreSQL
                    pg_row = {}
                    for col in pg_columns:
                        if col in clean_row:
                            pg_row[col] = clean_row[col]
                        else:
                            pg_row[col] = None
                    
                    writer.writerow(pg_row)
                    count += 1
                    
                    if count % 1000 == 0:
                        print(f"  📊 Processed {count} rows...")
                
                print(f"  ✅ Prepared {count} rows for import")
                
        except Exception as e:
            print(f"❌ Error preparing {csv_file}: {e}")
            temp_file.close()
            os.unlink(temp_file.name)
            return None
            
        temp_file.close()
        return temp_file.name

    def clean_row_data(self, row: Dict[str, Any], table_name: str) -> Dict[str, Any]:
        """Clean row data for PostgreSQL"""
        clean_row = {}
        
        for key, value in row.items():
            # Convert key format
            clean_key = key.replace('-', '_').lower()
            
            # Handle Xata ID conversion
            if clean_key == 'id' or clean_key == 'xata_id':
                clean_row['xata_id'] = self.convert_xata_id_to_uuid(value)
                continue
            
            # Handle empty values
            if value == '' or value is None:
                clean_row[clean_key] = None
                continue
            
            # Handle JSON fields
            if clean_key in ['metadata', 'photos', 'images', 'file', 'media']:
                try:
                    clean_row[clean_key] = json.loads(value) if value else None
                except:
                    clean_row[clean_key] = value
                continue
            
            # Handle arrays
            if clean_key in ['category']:
                clean_row[clean_key] = value.split(',') if value else None
                continue
            
            # Handle boolean fields
            if clean_key in ['processed']:
                clean_row[clean_key] = value.lower() == 'true' if value else False
                continue
                
            # Default handling
            clean_row[clean_key] = value
        
        return clean_row

    async def get_table_columns(self, table_name: str) -> List[Dict]:
        """Get table column information"""
        query = """
        SELECT column_name as name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
        """
        rows = await self.conn.fetch(query, table_name)
        return [dict(row) for row in rows]

    async def import_table_copy(self, csv_file: str, table_name: str) -> int:
        """Import table using COPY command"""
        
        # Prepare CSV file
        temp_csv = await self.prepare_csv_for_import(csv_file, table_name)
        if not temp_csv:
            return 0
        
        try:
            print(f"📥 Importing to {table_name}...")
            
            # Get column names
            columns_info = await self.get_table_columns(table_name)
            columns = [col['name'] for col in columns_info if col['name'] != 'id']
            columns_sql = ', '.join(columns)
            
            # Use COPY command for bulk import
            copy_sql = f"""
            COPY {table_name} ({columns_sql})
            FROM STDIN
            WITH (FORMAT CSV, HEADER true, NULL '')
            """
            
            # Read the file and import
            with open(temp_csv, 'r') as f:
                await self.conn.copy_from_query(copy_sql, f)
            
            # Get count
            count_result = await self.conn.fetchval(f"SELECT COUNT(*) FROM {table_name}")
            print(f"✅ Imported {table_name}: {count_result} total rows")
            
            return count_result
            
        except Exception as e:
            print(f"❌ Error importing {table_name}: {e}")
            return 0
        finally:
            # Clean up temp file
            if temp_csv and os.path.exists(temp_csv):
                os.unlink(temp_csv)

    async def clear_tables(self):
        """Clear existing data"""
        print("🗑️  Clearing existing data...")
        
        # Get all tables in reverse order
        tables = [table for _, table in reversed(self.import_tables)]
        
        for table in tables:
            try:
                await self.conn.execute(f"TRUNCATE TABLE {table} CASCADE")
                print(f"  🗑️  Cleared {table}")
            except Exception as e:
                print(f"  ⚠️  Could not clear {table}: {e}")

    async def run_import(self):
        """Run complete import"""
        try:
            print("🛸 UFO/UAP Bulk Database Import")
            print("=" * 50)
            
            await self.connect()
            
            # Clear existing data
            await self.clear_tables()
            
            total_imported = 0
            
            # Import each table
            for csv_file, table_name in self.import_tables:
                imported = await self.import_table_copy(csv_file, table_name)
                total_imported += imported
            
            print("\n🎉 Bulk import completed!")
            print(f"📊 Total records: {total_imported:,}")
            
        except Exception as e:
            print(f"❌ Import failed: {e}")
            raise
        finally:
            await self.close()

async def main():
    """Main function"""
    database_url = os.getenv('DATABASE_URL', 'postgresql://liamellis@localhost:5432/ultraterrestrial')
    exports_path = '../../../apps/app/scripts/xata-exports/exports'
    
    importer = BulkImporter(database_url, exports_path)
    await importer.run_import()

if __name__ == "__main__":
    asyncio.run(main())