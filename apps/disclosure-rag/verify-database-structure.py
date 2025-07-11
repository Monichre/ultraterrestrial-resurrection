#!/usr/bin/env python3
"""
Verify PostgreSQL database structure and table counts
"""

import asyncio
import asyncpg
import ssl
from datetime import datetime

async def verify_database():
    """Verify database structure and show table counts"""
    
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    
    print(f"🔍 Database Structure Verification")
    print(f"📅 {datetime.now().isoformat()}")
    print()
    
    # Configure SSL context for Xata connection
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    conn = await asyncpg.connect(postgres_url, ssl=ssl_context)
    print("✅ Connected to PostgreSQL database")
    
    # Get list of tables
    tables_query = """
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
    """
    
    tables = await conn.fetch(tables_query)
    print(f"\n📊 Found {len(tables)} tables:")
    
    total_records = 0
    for table in tables:
        table_name = table['table_name']
        try:
            count_query = f"SELECT COUNT(*) as count FROM {table_name};"
            result = await conn.fetchrow(count_query)
            count = result['count'] if result else 0
            total_records += count
            print(f"  ✅ {table_name}: {count:,} records")
        except Exception as e:
            print(f"  ❌ {table_name}: Error - {e}")
    
    print(f"\n📈 Total records in database: {total_records:,}")
    
    # Check for any missing expected tables
    expected_tables = [
        'topics', 'personnel', 'events', 'organizations', 'sightings', 
        'documents', 'testimonies', 'locations', 'artifacts', 'users',
        'mindmaps', 'user_saved_events', 'user_saved_topics', 'user_notes',
        'organization_members', 'event_subject_matter_experts', 
        'topic_subject_matter_experts', 'topics_testimonies'
    ]
    
    existing_tables = [t['table_name'] for t in tables]
    missing_tables = [t for t in expected_tables if t not in existing_tables]
    
    if missing_tables:
        print(f"\n⚠️  Missing expected tables: {missing_tables}")
    else:
        print(f"\n✅ All expected tables are present!")
    
    await conn.close()
    print(f"\n🎉 Database verification completed!")

if __name__ == "__main__":
    asyncio.run(verify_database())