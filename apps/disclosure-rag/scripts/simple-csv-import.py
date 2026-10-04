#!/usr/bin/env python3
"""
Simple CSV import from Xata exports to existing PostgreSQL database
Handles 61,321+ UFO/UAP research records
"""

import asyncio
import asyncpg
import pandas as pd
import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
import numpy as np

class SimpleCSVImporter:
    def __init__(self, database_url: str, exports_path: str):
        self.database_url = database_url
        self.exports_path = Path(exports_path)
        self.conn = None
        
        # Map CSV files to existing PostgreSQL tables
        self.table_mappings = {
            'topics.csv': 'topics',
            'personnel.csv': 'personnel',
            'events.csv': 'events',
            'organizations.csv': 'organizations',
            'sightings.csv': 'sightings',
            'locations.csv': 'locations',
            'users.csv': 'users',
            'testimonies.csv': 'testimonies',
            'documents.csv': 'documents',
            'artifacts.csv': 'artifacts',
            'key-figures.csv': 'personnel',  # Merge key-figures into personnel
            'organization-members.csv': 'organization_members',
            'event-subject-matter-experts.csv': 'event_subject_matter_experts',
            'topic-subject-matter-experts.csv': 'topic_subject_matter_experts',
            'event-topic-subject-matter-experts.csv': 'event_topic_subject_matter_experts',
            'topics-testimonies.csv': 'topics_testimonies',
            'user-notes.csv': 'user_notes',
            'user-saved-events.csv': 'user_saved_events',
            'user-saved-topics.csv': 'user_saved_topics',
            'user-saved-testimonies.csv': 'user_saved_testimonies',
            'user-saved-documents.csv': 'user_saved_documents',
            'user-saved-organizations.csv': 'user_saved_organizations',
            'user-saved-sightings.csv': 'user_saved_sightings',
            'summary-files.csv': 'summary_files',
            'document-entities.csv': 'document_entities',
            'document-chunks.csv': 'document_chunks',
            'document-processing-tasks.csv': 'document_processing_tasks',
            'mindmaps.csv': 'mindmaps'
        }

    async def connect(self):
        """Connect to PostgreSQL"""
        self.conn = await asyncpg.connect(self.database_url)
        print("✅ Connected to PostgreSQL")

    async def close(self):
        """Close connection"""
        if self.conn:
            await self.conn.close()

    async def import_csv(self, csv_file: str, table_name: str) -> int:
        """Import single CSV file"""
        csv_path = self.exports_path / csv_file
        
        if not csv_path.exists():
            print(f"⏭️  Skipping {csv_file} - file not found")
            return 0
            
        print(f"📥 Importing {csv_file} -> {table_name}")
        
        # Read CSV
        try:
            df = pd.read_csv(csv_path)
        except pd.errors.EmptyDataError:
            print(f"⏭️  Skipping empty file: {csv_file}")
            return 0
            
        if df.empty:
            print(f"⏭️  Skipping empty data: {csv_file}")
            return 0
        
        # Clean column names
        df.columns = [col.replace('-', '_').lower() for col in df.columns]
        
        # Handle NaN values
        df = df.replace({np.nan: None})
        
        # Get existing table structure
        columns_info = await self.get_table_columns(table_name)
        existing_columns = [col['name'] for col in columns_info]
        
        # Filter DataFrame to only include existing columns
        available_columns = [col for col in df.columns if col in existing_columns]
        df_filtered = df[available_columns]
        
        if df_filtered.empty:
            print(f"⚠️  No matching columns for {table_name}")
            return 0
        
        # Import in batches
        batch_size = 100
        total_rows = len(df_filtered)
        imported = 0
        
        for i in range(0, total_rows, batch_size):
            batch = df_filtered.iloc[i:i + batch_size]
            success = await self.insert_batch(table_name, batch, available_columns)
            if success:
                imported += len(batch)
                print(f"  📊 {imported}/{total_rows} rows")
            else:
                print(f"  ❌ Failed batch {i//batch_size + 1}")
        
        print(f"✅ Completed {table_name}: {imported} rows")
        return imported

    async def get_table_columns(self, table_name: str) -> List[Dict]:
        """Get table column information"""
        query = """
        SELECT column_name as name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
        """
        rows = await self.conn.fetch(query, table_name)
        return [dict(row) for row in rows]

    async def insert_batch(self, table_name: str, batch_df: pd.DataFrame, columns: List[str]) -> bool:
        """Insert batch of records"""
        try:
            records = batch_df.to_dict('records')
            
            if not records:
                return True
            
            # Create INSERT statement with conflict resolution
            columns_sql = ', '.join(columns)
            placeholders = ', '.join([f'${i+1}' for i in range(len(columns))])
            
            # Use xata_id for conflict resolution if available, otherwise use first column
            conflict_column = 'xata_id' if 'xata_id' in columns else columns[0]
            
            insert_sql = f"""
            INSERT INTO {table_name} ({columns_sql})
            VALUES ({placeholders})
            ON CONFLICT ({conflict_column}) DO NOTHING
            """
            
            # Execute batch
            for record in records:
                values = [record.get(col) for col in columns]
                # Clean values
                values = [self.clean_value(v) for v in values]
                await self.conn.execute(insert_sql, *values)
            
            return True
            
        except Exception as e:
            print(f"❌ Error in {table_name}: {e}")
            return False

    def clean_value(self, value):
        """Clean value for PostgreSQL insertion"""
        if pd.isna(value) or value is None:
            return None
        
        # Handle JSON strings
        if isinstance(value, str) and (value.startswith('{') or value.startswith('[')):
            try:
                return json.loads(value)
            except:
                return value
                
        return value

    async def run_import(self):
        """Run complete import"""
        try:
            print("🛸 UFO/UAP Database Import Starting...")
            print(f"📂 Source: {self.exports_path}")
            print("=" * 50)
            
            await self.connect()
            
            total_imported = 0
            
            # Import each CSV file
            for csv_file, table_name in self.table_mappings.items():
                imported = await self.import_csv(csv_file, table_name)
                total_imported += imported
            
            print("\n🎉 Import completed!")
            print(f"📊 Total records imported: {total_imported:,}")
            
        except Exception as e:
            print(f"❌ Import failed: {e}")
            raise
        finally:
            await self.close()

async def main():
    """Main function"""
    database_url = os.getenv('DATABASE_URL', 'postgresql://liamellis@localhost:5432/ultraterrestrial')
    exports_path = '../../../apps/app/scripts/xata-exports/exports'
    
    importer = SimpleCSVImporter(database_url, exports_path)
    await importer.run_import()

if __name__ == "__main__":
    asyncio.run(main())