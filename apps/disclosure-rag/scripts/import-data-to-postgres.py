#!/usr/bin/env python3
"""
Import Xata CSV exports into PostgreSQL wire-enabled database
Handles 60,349+ UFO/UAP research records across 31 tables
"""

import asyncio
import asyncpg
import pandas as pd
import numpy as np
import json
import csv
import ssl
from pathlib import Path
from datetime import datetime

class DataImporter:
    def __init__(self):
        # PostgreSQL connection string from environment
        self.postgres_url = os.getenv("DATABASE_URL")
        if not self.postgres_url:
            raise RuntimeError("DATABASE_URL environment variable must be set")
        self.exports_path = Path("/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports")
        
        print(f"🛸 PostgreSQL Data Import")
        print(f"📅 {datetime.now().isoformat()}")
        print(f"📂 Source: {self.exports_path}")
        print(f"🗄️  Target: PostgreSQL wire-enabled instance")
        print()
        
        # Import order (dependencies first)
        self.import_order = [
            'users', 'personnel', 'organizations', 'topics', 'events', 
            'documents', 'testimonies', 'locations', 'sightings', 
            'artifacts', 'key-figures', 'tags', 'theories', 'mindmaps',
            'organization-members', 'event-subject-matter-experts',
            'topic-subject-matter-experts', 'event-topic-subject-matter-experts',
            'topics-testimonies', 'user-notes', 'user-saved-events',
            'user-saved-topics', 'user-saved-key-figure', 'user-saved-testimonies',
            'user-saved-documents', 'user-saved-organizations', 'user-saved-sightings',
            'summary-files', 'document-entities', 'document-chunks', 'document-processing-tasks'
        ]
        
        # Table name mappings (CSV -> PostgreSQL)
        self.table_mappings = {
            'key-figures': 'key_figures',
            'user-notes': 'user_notes',
            'user-saved-events': 'user_saved_events',
            'user-saved-topics': 'user_saved_topics',
            'user-saved-key-figure': 'user_saved_key_figure',
            'user-saved-testimonies': 'user_saved_testimonies',
            'user-saved-documents': 'user_saved_documents',
            'user-saved-organizations': 'user_saved_organizations',
            'user-saved-sightings': 'user_saved_sightings',
            'organization-members': 'organization_members',
            'event-subject-matter-experts': 'event_subject_matter_experts',
            'topic-subject-matter-experts': 'topic_subject_matter_experts',
            'event-topic-subject-matter-experts': 'event_topic_subject_matter_experts',
            'topics-testimonies': 'topics_testimonies',
            'summary-files': 'summary_files',
            'document-entities': 'document_entities',
            'document-chunks': 'document_chunks',
            'document-processing-tasks': 'document_processing_tasks'
        }

    async def connect(self):
        """Connect to PostgreSQL database"""
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        self.conn = await asyncpg.connect(self.postgres_url, ssl=ssl_context, command_timeout=30)
        print("✅ Connected to PostgreSQL database")

    async def close(self):
        """Close database connection"""
        if hasattr(self, 'conn'):
            await self.conn.close()

    def get_pg_table_name(self, csv_name: str) -> str:
        """Convert CSV table name to PostgreSQL table name"""
        return self.table_mappings.get(csv_name, csv_name)

    async def import_table(self, table_name: str) -> int:
        """Import single table from CSV"""
        csv_path = self.exports_path / f"{table_name}.csv"
        pg_table_name = self.get_pg_table_name(table_name)
        
        if not csv_path.exists():
            print(f"⏭️  Skipping {table_name} - CSV not found")
            return 0
        
        # Check if CSV has data
        try:
            with open(csv_path, 'r') as f:
                reader = csv.reader(f)
                headers = next(reader)
                first_row = next(reader)
        except StopIteration:
            print(f"⏭️  Skipping empty table: {table_name}")
            return 0
        
        print(f"📥 Importing {table_name} -> {pg_table_name}...")
        
        # Read CSV
        df = pd.read_csv(csv_path)
        
        if df.empty:
            print(f"⏭️  Skipping empty table: {table_name}")
            return 0
        
        # Clean column names
        df.columns = [col.replace('-', '_') for col in df.columns]
        
        # Process data
        df = self.process_dataframe(df, table_name)
        
        # Import in batches
        batch_size = 50  # Smaller batches for reliability
        total_rows = len(df)
        imported = 0
        
        for i in range(0, total_rows, batch_size):
            batch = df.iloc[i:i + batch_size]
            success = await self.insert_batch(pg_table_name, batch)
            if success:
                imported += len(batch)
                if imported % 100 == 0 or imported == total_rows:
                    print(f"  📊 {imported}/{total_rows} rows imported")
            else:
                print(f"  ❌ Failed batch {i//batch_size + 1}")
        
        print(f"✅ Completed {pg_table_name}: {imported} rows")
        return imported

    def process_dataframe(self, df: pd.DataFrame, table_name: str) -> pd.DataFrame:
        """Process DataFrame before import"""
        
        # Handle NaN values
        df = df.replace({np.nan: None})
        
        # Process JSON columns
        json_columns = ['metadata', 'json', 'file', 'photos', 'images', 'media', 'documentation']
        for col in json_columns:
            if col in df.columns:
                df[col] = df[col].apply(self.safe_json_parse)
        
        # Process vector embeddings
        if 'embedding' in df.columns:
            df['embedding'] = df['embedding'].apply(self.parse_vector)
        
        # Process datetime columns
        datetime_columns = ['date', 'date_posted', 'xata_createdat', 'xata_updatedat']
        for col in datetime_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        # Process array columns
        array_columns = ['category', 'photos', 'entity_type', 'task']
        for col in array_columns:
            if col in df.columns:
                df[col] = df[col].apply(self.parse_array)
        
        return df

    def safe_json_parse(self, value):
        """Safely parse JSON strings"""
        if pd.isna(value) or value is None:
            return None
        if isinstance(value, dict):
            return value
        try:
            return json.loads(value) if value else None
        except:
            return None

    def parse_vector(self, value):
        """Parse vector embedding strings"""
        if pd.isna(value) or value is None:
            return None
        try:
            if isinstance(value, str):
                clean_value = value.strip('[]')
                return [float(x.strip()) for x in clean_value.split(',')]
            return value
        except:
            return None

    def parse_array(self, value):
        """Parse array strings"""
        if pd.isna(value) or value is None:
            return None
        try:
            if isinstance(value, str):
                return value.split(',') if value else None
            return value
        except:
            return None

    async def insert_batch(self, table_name: str, batch_df: pd.DataFrame) -> bool:
        """Insert batch of records"""
        try:
            records = batch_df.to_dict('records')
            
            if not records:
                return True
            
            # Get columns
            columns = list(records[0].keys())
            
            # Handle reserved keywords by quoting
            quoted_columns = []
            for col in columns:
                if col.lower() in ['user']:
                    quoted_columns.append(f'"{col}"')
                else:
                    quoted_columns.append(col)
            
            # Create INSERT with conflict resolution
            placeholders = ', '.join([f'${i+1}' for i in range(len(columns))])
            columns_sql = ', '.join(quoted_columns)
            
            insert_sql = f"""
            INSERT INTO {table_name} ({columns_sql})
            VALUES ({placeholders})
            ON CONFLICT (xata_id) DO UPDATE SET
                {', '.join([f'{quoted_columns[i]} = EXCLUDED.{quoted_columns[i]}' for i in range(len(columns)) if columns[i] != 'xata_id'])}
            """
            
            # Execute batch
            for record in records:
                values = [record.get(col) for col in columns]
                await self.conn.execute(insert_sql, *values)
            
            return True
            
        except Exception as e:
            print(f"❌ Error inserting batch into {table_name}: {e}")
            return False

    async def run_import(self):
        """Run complete import process"""
        try:
            await self.connect()
            
            total_imported = 0
            successful_tables = 0
            
            for table_name in self.import_order:
                try:
                    imported = await self.import_table(table_name)
                    if imported > 0:
                        successful_tables += 1
                    total_imported += imported
                except Exception as e:
                    print(f"❌ Failed to import {table_name}: {e}")
            
            print(f"\n🎉 Import completed!")
            print(f"📊 Total records imported: {total_imported:,}")
            print(f"✅ Successful tables: {successful_tables}/{len(self.import_order)}")
            
        except Exception as e:
            print(f"❌ Import failed: {e}")
            raise
        finally:
            await self.close()

async def main():
    importer = DataImporter()
    await importer.run_import()

if __name__ == "__main__":
    asyncio.run(main())