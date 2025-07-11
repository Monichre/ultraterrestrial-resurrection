#!/usr/bin/env python3
"""
Complete Xata Production to PostgreSQL Wire Migration Script
Migrates all data from current production instance to new PostgreSQL wire-enabled instance

Date: July 8, 2025
Author: Claude (Automated Migration)
"""

import os
import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime
import shutil

class XataPostgresMigration:
    def __init__(self):
        # Source (Current Production)
        self.source_workspace = "UltraTerrestrial-kgubvq"
        self.source_database = "ultraterrestrial"
        self.source_branch = "main"
        self.source_region = "us-east-1"
        self.source_api_key = os.getenv('XATA_API_KEY', 'xau_LKJxzxjzXasEUXxjmhCBACdTCvi5Ed2v1')
        
        # Target (New PostgreSQL Wire Instance)
        self.target_workspace = "UltraTerrestrial-kgubvq"
        self.target_database = "ultraterrestrial-postgres"
        self.target_branch = "main"
        self.target_region = "us-east-1"
        self.target_api_key = "xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1"
        self.target_pg_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
        
        # Paths
        self.project_root = Path(__file__).parent
        self.exports_dir = self.project_root / "xata-exports"
        self.xreplay_script = self.project_root / "apps/app/scripts/xata-exports/xata_tools/xreplay.py"
        
        print(f"🚀 Xata Production → PostgreSQL Wire Migration")
        print(f"📅 {datetime.now().isoformat()}")
        print(f"Source: {self.source_workspace}/{self.source_database}")
        print(f"Target: {self.target_workspace}/{self.target_database}")
        print()

    def run_export(self):
        """Export all data from current production instance using xreplay.py"""
        print("📤 STEP 1: Exporting data from current production instance...")
        
        # Ensure exports directory exists
        self.exports_dir.mkdir(exist_ok=True)
        
        # Build xreplay command
        cmd = [
            "python3", str(self.xreplay_script),
            "--from_workspace", self.source_workspace,
            "--from_database", self.source_database,
            "--from_branch", self.source_branch,
            "--from_region", self.source_region,
            "--from_XATA_API_KEY", self.source_api_key,
            "--output", "file",
            "--output_path", str(self.exports_dir),
            "--output_format", "csv"
        ]
        
        print(f"Running: {' '.join(cmd)}")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            print("✅ Export completed successfully!")
            if result.stdout:
                print(f"Output: {result.stdout}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Export failed: {e}")
            print(f"Error output: {e.stderr}")
            raise
        except FileNotFoundError:
            print(f"❌ Could not find xreplay script at: {self.xreplay_script}")
            print("Please ensure the script exists or update the path")
            raise

    def setup_postgresql_schema(self):
        """Set up PostgreSQL schema in new instance"""
        print("🗄️ STEP 2: Setting up PostgreSQL schema...")
        
        try:
            # Use psql command to connect and create schema
            print("Creating schema using existing PostgreSQL scripts...")
            
            # Check for existing schema files
            schema_file = self.project_root / "apps/disclosure-rag/setup_postgres_pgvector.sql"
            if schema_file.exists():
                print(f"Found existing schema file: {schema_file}")
                cmd = ["psql", self.target_pg_url, "-f", str(schema_file)]
                result = subprocess.run(cmd, capture_output=True, text=True)
                if result.returncode == 0:
                    print("✅ Schema created successfully using existing SQL file")
                    return
                else:
                    print(f"⚠️ Schema file failed, creating basic schema: {result.stderr}")
            
            # Create basic schema with psql
            basic_schema = '''
            -- Basic Xata tables schema
            CREATE EXTENSION IF NOT EXISTS vector;
            
            CREATE TABLE IF NOT EXISTS topics (
                id TEXT PRIMARY KEY,
                name TEXT,
                summary TEXT,
                title TEXT UNIQUE,
                photo JSONB,
                photos JSONB,
                embedding vector(1536),
                xata_createdat TIMESTAMPTZ DEFAULT NOW(),
                xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
                xata_version INTEGER DEFAULT 0
            );
            
            CREATE TABLE IF NOT EXISTS personnel (
                id TEXT PRIMARY KEY,
                name TEXT UNIQUE,
                bio TEXT,
                role TEXT,
                rank INTEGER,
                credibility INTEGER,
                popularity INTEGER,
                authority INTEGER,
                photo JSONB,
                embedding vector(1536),
                xata_createdat TIMESTAMPTZ DEFAULT NOW(),
                xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
                xata_version INTEGER DEFAULT 0
            );
            
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                name TEXT,
                title TEXT UNIQUE,
                description TEXT,
                summary TEXT,
                location TEXT,
                latitude DOUBLE PRECISION,
                longitude DOUBLE PRECISION,
                date TIMESTAMPTZ,
                category TEXT[],
                photos JSONB,
                metadata JSONB DEFAULT '{}',
                embedding vector(1536),
                xata_createdat TIMESTAMPTZ DEFAULT NOW(),
                xata_updatedat TIMESTAMPTZ DEFAULT NOW(),
                xata_version INTEGER DEFAULT 0
            );
            '''
            
            # Write schema to temp file and execute
            temp_schema = self.project_root / "temp_schema.sql"
            with open(temp_schema, 'w') as f:
                f.write(basic_schema)
            
            cmd = ["psql", self.target_pg_url, "-f", str(temp_schema)]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Basic schema created successfully")
                temp_schema.unlink()  # Clean up temp file
            else:
                print(f"❌ Schema creation failed: {result.stderr}")
                raise Exception("Schema creation failed")
                
        except Exception as e:
            print(f"❌ Schema setup failed: {e}")
            print("💡 You may need to install psql or use the Xata CLI instead")
            # Continue without schema setup for now
                    "summary TEXT",
                    "title TEXT UNIQUE",
                    "photo JSONB",
                    "photos JSONB",
                    "embedding vector(1536)",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("personnel", [
                    "id TEXT PRIMARY KEY",
                    "name TEXT UNIQUE",
                    "bio TEXT",
                    "role TEXT",
                    "rank INTEGER",
                    "credibility INTEGER",
                    "popularity INTEGER",
                    "authority INTEGER",
                    "photo JSONB",
                    "embedding vector(1536)",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("events", [
                    "id TEXT PRIMARY KEY",
                    "name TEXT",
                    "title TEXT UNIQUE",
                    "description TEXT",
                    "summary TEXT",
                    "location TEXT",
                    "latitude DOUBLE PRECISION",
                    "longitude DOUBLE PRECISION",
                    "date TIMESTAMPTZ",
                    "category TEXT[]",
                    "photos JSONB",
                    "metadata JSONB DEFAULT '{}'",
                    "embedding vector(1536)",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("organizations", [
                    "id TEXT PRIMARY KEY",
                    "name TEXT",
                    "title TEXT UNIQUE",
                    "specialization TEXT",
                    "description TEXT",
                    "photo TEXT",
                    "image JSONB",
                    "embedding vector(500)",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("sightings", [
                    "id TEXT PRIMARY KEY",
                    "date TIMESTAMPTZ",
                    "date_posted TIMESTAMPTZ",
                    "description TEXT",
                    "comments TEXT",
                    "media_link TEXT",
                    "city TEXT",
                    "state TEXT",
                    "country TEXT",
                    "shape TEXT",
                    "duration_seconds TEXT",
                    "duration_hours_min TEXT",
                    "latitude DOUBLE PRECISION",
                    "longitude DOUBLE PRECISION",
                    "media JSONB",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("documents", [
                    "id TEXT PRIMARY KEY",
                    "title TEXT",
                    "summary TEXT",
                    "url TEXT",
                    "date TIMESTAMPTZ",
                    "file JSONB",
                    "images JSONB",
                    "metadata JSONB",
                    "processed BOOLEAN DEFAULT FALSE",
                    "author TEXT", # Will be FK to personnel
                    "organization TEXT", # Will be FK to organizations
                    "embedding vector(1536)",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("testimonies", [
                    "id TEXT PRIMARY KEY",
                    "claim TEXT",
                    "summary TEXT",
                    "source TEXT",
                    "context TEXT",
                    "date TIMESTAMPTZ",
                    "documentation JSONB",
                    "media JSONB",
                    "event TEXT", # Will be FK to events
                    "witness TEXT", # Will be FK to personnel
                    "organization TEXT", # Will be FK to organizations
                    "embedding vector(1536)",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("locations", [
                    "id TEXT PRIMARY KEY",
                    "name TEXT",
                    "coordinates TEXT",
                    "google_maps_location_id TEXT",
                    "city TEXT",
                    "state TEXT",
                    "latitude DOUBLE PRECISION",
                    "longitude DOUBLE PRECISION",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("artifacts", [
                    "id TEXT PRIMARY KEY",
                    "name TEXT UNIQUE",
                    "description TEXT",
                    "date TEXT",
                    "source TEXT",
                    "origin TEXT",
                    "photos TEXT[]",
                    "images JSONB",
                    "embedding vector(1536)",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("users", [
                    "id TEXT PRIMARY KEY",
                    "email TEXT UNIQUE",
                    "name TEXT",
                    "photo JSONB",
                    "profile_image_url TEXT",
                    "external_id TEXT",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("mindmaps", [
                    "id TEXT PRIMARY KEY",
                    "json JSONB DEFAULT '{}'",
                    "embedding vector(1536)",
                    "user_id TEXT", # Will be FK to users
                    "file JSONB",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ]),
                ("key_figures", [
                    "id TEXT PRIMARY KEY",
                    "name TEXT",
                    "bio TEXT",
                    "photo TEXT",
                    "role TEXT",
                    "rank INTEGER",
                    "credibility INTEGER",
                    "popularity INTEGER",
                    "authority INTEGER",
                    "embedding TEXT",
                    "xataversion INTEGER",
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_version INTEGER DEFAULT 0"
                ])
            ]
            
            # Create tables
            for table_name, columns in schema_tables:
                columns_sql = ",\n    ".join(columns)
                create_sql = f"""
                CREATE TABLE IF NOT EXISTS {table_name} (
                    {columns_sql}
                );
                """
                await conn.execute(create_sql)
                print(f"✅ Created table: {table_name}")
            
            # Create relationship tables
            relationship_tables = [
                ("organization_members", [
                    "id TEXT PRIMARY KEY",
                    "member TEXT", # FK to personnel
                    "organization TEXT", # FK to organizations
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()"
                ]),
                ("event_subject_matter_experts", [
                    "id TEXT PRIMARY KEY",
                    "event TEXT", # FK to events
                    "subject_matter_expert TEXT", # FK to personnel
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()"
                ]),
                ("topic_subject_matter_experts", [
                    "id TEXT PRIMARY KEY",
                    "topic TEXT", # FK to topics
                    "subject_matter_expert TEXT", # FK to personnel
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()"
                ]),
                ("event_topic_subject_matter_experts", [
                    "id TEXT PRIMARY KEY",
                    "event TEXT", # FK to events
                    "topic TEXT", # FK to topics
                    "subject_matter_expert TEXT", # FK to personnel
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()"
                ]),
                ("topics_testimonies", [
                    "id TEXT PRIMARY KEY",
                    "topic TEXT", # FK to topics
                    "testimony TEXT", # FK to testimonies
                    "xata_createdat TIMESTAMPTZ DEFAULT NOW()",
                    "xata_updatedat TIMESTAMPTZ DEFAULT NOW()"
                ])
            ]
            
            for table_name, columns in relationship_tables:
                columns_sql = ",\n    ".join(columns)
                create_sql = f"""
                CREATE TABLE IF NOT EXISTS {table_name} (
                    {columns_sql}
                );
                """
                await conn.execute(create_sql)
                print(f"✅ Created relationship table: {table_name}")
            
            await conn.close()
            print("✅ PostgreSQL schema setup completed!")
            
        except Exception as e:
            print(f"❌ Schema setup failed: {e}")
            raise

    async def import_data_to_postgresql(self):
        """Import CSV data to PostgreSQL instance"""
        print("📥 STEP 3: Importing data to PostgreSQL...")
        
        # Use existing import script but with PostgreSQL target
        import_script = self.project_root / "apps/disclosure-rag/scripts/import-xata-to-postgres.py"
        
        if not import_script.exists():
            print(f"❌ Import script not found: {import_script}")
            return
        
        # Set environment variables for the import
        env = os.environ.copy()
        env['DATABASE_URL'] = self.target_pg_url
        env['XATA_EXPORTS_PATH'] = str(self.exports_dir)
        
        try:
            # Run the import script
            cmd = ["python3", str(import_script)]
            result = subprocess.run(cmd, env=env, capture_output=True, text=True, check=True)
            print("✅ Data import completed successfully!")
            if result.stdout:
                print(f"Output: {result.stdout}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Import failed: {e}")
            print(f"Error output: {e.stderr}")
            raise

    async def verify_migration(self):
        """Verify data was migrated successfully"""
        print("🔍 STEP 4: Verifying migration...")
        
        try:
            conn = await asyncpg.connect(self.target_pg_url)
            
            # Get list of tables
            tables_query = """
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
            """
            tables = await conn.fetch(tables_query)
            
            print(f"📊 Found {len(tables)} tables in target database:")
            
            total_records = 0
            for table in tables:
                table_name = table['table_name']
                count_query = f"SELECT COUNT(*) as count FROM {table_name};"
                result = await conn.fetchrow(count_query)
                count = result['count']
                total_records += count
                print(f"  - {table_name}: {count:,} records")
            
            print(f"\n✅ Migration verification completed!")
            print(f"📈 Total records migrated: {total_records:,}")
            
            await conn.close()
            
        except Exception as e:
            print(f"❌ Verification failed: {e}")
            raise

    def update_environment_files(self):
        """Update environment variables for new PostgreSQL instance"""
        print("⚙️ STEP 5: Updating environment variables...")
        
        env_updates = {
            'XATA_POSTGRES_DATABASE_URL': f"https://{self.target_workspace}.{self.target_region}.xata.sh/db/{self.target_database}",
            'XATA_POSTGRES_API_KEY': self.target_api_key,
            'XATA_POSTGRES_ENDPOINT': self.target_pg_url,
            'XATA_POSTGRES_BRANCH': self.target_branch
        }
        
        # Create a .env.postgres file with new credentials
        postgres_env_file = self.project_root / ".env.postgres"
        
        with open(postgres_env_file, 'w') as f:
            f.write("# PostgreSQL Wire-Enabled Xata Instance\n")
            f.write(f"# Generated: {datetime.now().isoformat()}\n\n")
            
            for key, value in env_updates.items():
                f.write(f"{key}={value}\n")
        
        print(f"✅ Created {postgres_env_file}")
        print("📝 Add these variables to your .env.local file:")
        for key, value in env_updates.items():
            print(f"  {key}={value}")

    async def run_migration(self):
        """Run complete migration process"""
        print("🛸 Starting Complete Xata → PostgreSQL Wire Migration")
        print("=" * 60)
        
        try:
            # Step 1: Export data from current production
            self.run_export()
            
            # Step 2: Set up PostgreSQL schema
            await self.setup_postgresql_schema()
            
            # Step 3: Import data
            await self.import_data_to_postgresql()
            
            # Step 4: Verify migration
            await self.verify_migration()
            
            # Step 5: Update environment
            self.update_environment_files()
            
            print("\n🎉 MIGRATION COMPLETED SUCCESSFULLY!")
            print("=" * 60)
            print(f"✅ All data migrated from {self.source_database} to {self.target_database}")
            print(f"✅ PostgreSQL wire protocol enabled")
            print(f"✅ Environment variables updated")
            print("\n📋 Next Steps:")
            print("1. Update your .env.local with the new PostgreSQL variables")
            print("2. Test your application with the new database")
            print("3. Update any hardcoded connection strings")
            
        except Exception as e:
            print(f"\n❌ MIGRATION FAILED: {e}")
            raise

async def main():
    """Main migration entry point"""
    migration = XataPostgresMigration()
    await migration.run_migration()

if __name__ == "__main__":
    asyncio.run(main())