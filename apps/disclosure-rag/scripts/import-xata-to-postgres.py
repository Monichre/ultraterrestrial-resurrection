#!/usr/bin/env python3
"""
Import Xata CSV exports into PostgreSQL database
Handles 61,321+ UFO/UAP research records across 30 tables
"""

import asyncio
import asyncpg
import pandas as pd
import json
import csv
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

# Import our database connector
import sys
sys.path.append('../lib')
from connectors.ultraterrestrial_db import UltraterrestrialDB

class XataToPostgresImporter:
    def __init__(self, database_url: str, xata_exports_path: str):
        self.database_url = database_url
        self.exports_path = Path(xata_exports_path)
        self.db = None
        
        # Table import order (dependencies first)
        self.import_order = [
            # Independent tables first
            'users',
            'personnel', 
            'organizations',
            'topics',
            'events',
            'documents',
            'testimonies',
            'locations',
            'sightings',
            'artifacts',
            'key-figures',
            'tags',
            'theories',
            'mindmaps',
            
            # Relationship tables
            'organization-members',
            'event-subject-matter-experts',
            'topic-subject-matter-experts',
            'event-topic-subject-matter-experts',
            'topics-testimonies',
            
            # User saved items
            'user-notes',
            'user-saved-events',
            'user-saved-topics',
            'user-saved-key-figure',
            'user-saved-testimonies',
            'user-saved-documents',
            'user-saved-organizations',
            'user-saved-sightings',
            
            # Document processing tables
            'summary-files',
            'document-entities',
            'document-chunks',
            'document-processing-tasks'
        ]
        
        # PostgreSQL table name mappings (CSV filename -> PG table name)
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
        """Initialize database connection"""
        self.db = UltraterrestrialDB(self.database_url)
        await self.db.connect()
        print("✅ Connected to PostgreSQL database")

    async def close(self):
        """Close database connection"""
        if self.db:
            await self.db.close()

    def get_csv_path(self, table_name: str) -> Path:
        """Get CSV file path for table"""
        return self.exports_path / f"{table_name}.csv"

    def get_pg_table_name(self, csv_table_name: str) -> str:
        """Convert CSV table name to PostgreSQL table name"""
        return self.table_mappings.get(csv_table_name, csv_table_name)

    async def create_tables(self):
        """Create PostgreSQL tables from Xata schema"""
        print("📋 Creating PostgreSQL tables...")
        
        # Read schema
        schema_path = self.exports_path / "schema.json"
        with open(schema_path, 'r') as f:
            schema = json.load(f)
        
        for table_def in schema['tables']:
            table_name = self.get_pg_table_name(table_def['name'])
            await self.create_table_from_schema(table_name, table_def)

    async def create_table_from_schema(self, table_name: str, table_def: Dict[str, Any]):
        """Create individual table from Xata schema definition"""
        
        # Skip empty tables
        if not table_def.get('columns'):
            print(f"⏭️  Skipping empty table: {table_name}")
            return
            
        columns = []
        
        # Add xata_id as primary key
        columns.append("xata_id TEXT PRIMARY KEY")
        columns.append("xata_createdat TIMESTAMPTZ")
        columns.append("xata_updatedat TIMESTAMPTZ")
        columns.append("xata_version INTEGER DEFAULT 0")
        
        for col in table_def['columns']:
            col_name = col['name'].replace('-', '_')
            col_type = self.get_postgres_type(col)
            
            # Handle unique constraints
            unique_clause = " UNIQUE" if col.get('unique') else ""
            
            columns.append(f"{col_name} {col_type}{unique_clause}")
        
        # Create table SQL
        columns_sql = ",\n    ".join(columns)
        create_sql = f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            {columns_sql}
        );
        """
        
        await self.db.execute(create_sql)
        print(f"✅ Created table: {table_name}")

    def get_postgres_type(self, col_def: Dict[str, Any]) -> str:
        """Convert Xata column type to PostgreSQL type"""
        col_type = col_def['type']
        
        type_mapping = {
            'string': 'TEXT',
            'text': 'TEXT',
            'int': 'INTEGER',
            'float': 'DOUBLE PRECISION',
            'bool': 'BOOLEAN',
            'datetime': 'TIMESTAMPTZ',
            'email': 'TEXT',
            'json': 'JSONB',
            'file': 'JSONB',
            'file[]': 'JSONB',
            'multiple': 'TEXT[]',
            'link': 'TEXT',  # Store as xata_id reference
        }
        
        # Handle vector types
        if col_type == 'vector':
            dimension = col_def.get('vector', {}).get('dimension', 1536)
            return f'vector({dimension})'
            
        return type_mapping.get(col_type, 'TEXT')

    async def import_table(self, table_name: str) -> int:
        """Import single table from CSV"""
        csv_path = self.get_csv_path(table_name)
        pg_table_name = self.get_pg_table_name(table_name)
        
        if not csv_path.exists():
            print(f"⏭️  Skipping {table_name} - CSV not found")
            return 0
            
        # Check if CSV is empty
        with open(csv_path, 'r') as f:
            reader = csv.reader(f)
            try:
                headers = next(reader)
                first_row = next(reader)
            except StopIteration:
                print(f"⏭️  Skipping empty table: {table_name}")
                return 0
        
        print(f"📥 Importing {table_name} -> {pg_table_name}...")
        
        # Read CSV with pandas
        df = pd.read_csv(csv_path)
        
        if df.empty:
            print(f"⏭️  Skipping empty table: {table_name}")
            return 0
            
        # Clean column names (replace hyphens with underscores)
        df.columns = [col.replace('-', '_') for col in df.columns]
        
        # Handle special columns
        df = self.process_dataframe(df, table_name)
        
        # Batch insert
        batch_size = 100
        total_rows = len(df)
        imported = 0
        
        for i in range(0, total_rows, batch_size):
            batch = df.iloc[i:i + batch_size]
            success = await self.insert_batch(pg_table_name, batch)
            if success:
                imported += len(batch)
                print(f"  📊 {imported}/{total_rows} rows imported")
            else:
                print(f"  ❌ Failed to import batch {i//batch_size + 1}")
        
        print(f"✅ Completed {pg_table_name}: {imported} rows")
        return imported

    def process_dataframe(self, df: pd.DataFrame, table_name: str) -> pd.DataFrame:
        """Process DataFrame before PostgreSQL import"""
        
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

    def safe_json_parse(self, value) -> Optional[Dict]:
        """Safely parse JSON strings"""
        if pd.isna(value) or value is None:
            return None
        if isinstance(value, dict):
            return value
        try:
            return json.loads(value) if value else None
        except:
            return None

    def parse_vector(self, value) -> Optional[List[float]]:
        """Parse vector embedding strings"""
        if pd.isna(value) or value is None:
            return None
        try:
            if isinstance(value, str):
                # Remove brackets and split
                clean_value = value.strip('[]')
                return [float(x.strip()) for x in clean_value.split(',')]
            return value
        except:
            return None

    def parse_array(self, value) -> Optional[List[str]]:
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
        """Insert batch of records into PostgreSQL"""
        try:
            # Convert DataFrame to list of dicts
            records = batch_df.to_dict('records')
            
            if not records:
                return True
                
            # Get column names
            columns = list(records[0].keys())
            
            # Create placeholders
            placeholders = ', '.join([f'${i+1}' for i in range(len(columns))])
            columns_sql = ', '.join(columns)
            
            # Create INSERT statement
            insert_sql = f"""
            INSERT INTO {table_name} ({columns_sql})
            VALUES ({placeholders})
            ON CONFLICT (xata_id) DO UPDATE SET
                {', '.join([f'{col} = EXCLUDED.{col}' for col in columns if col != 'xata_id'])}
            """
            
            # Execute batch insert
            for record in records:
                values = [record.get(col) for col in columns]
                await self.db.execute(insert_sql, *values)
            
            return True
            
        except Exception as e:
            print(f"❌ Error inserting batch into {table_name}: {e}")
            return False

    async def run_import(self):
        """Run complete import process"""
        try:
            print("🚀 Starting Xata to PostgreSQL import...")
            print(f"📂 Source: {self.exports_path}")
            print(f"🗄️  Target: PostgreSQL")
            
            await self.connect()
            
            # Create tables
            await self.create_tables()
            
            # Import data in order
            total_imported = 0
            for table_name in self.import_order:
                imported = await self.import_table(table_name)
                total_imported += imported
            
            print(f"\n🎉 Import completed successfully!")
            print(f"📊 Total records imported: {total_imported:,}")
            
        except Exception as e:
            print(f"❌ Import failed: {e}")
            raise
        finally:
            await self.close()

async def main():
    """Main import function"""
    
    # Configuration
    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/ultraterrestrial')
    exports_path = os.getenv('XATA_EXPORTS_PATH', '../../../apps/app/scripts/xata-exports/exports')
    
    print("🛸 Ultraterrestrial UFO/UAP Database Import")
    print("=" * 50)
    print(f"Database: {database_url.split('@')[-1]}")  # Hide credentials
    print(f"Exports:  {exports_path}")
    print()
    
    # Create importer and run
    importer = XataToPostgresImporter(database_url, exports_path)
    await importer.run_import()

if __name__ == "__main__":
    asyncio.run(main())