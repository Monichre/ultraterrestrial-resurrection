#!/usr/bin/env python3
"""
Test single record insert to verify connection and table structure
"""

import asyncio
import asyncpg
import ssl
from datetime import datetime

async def test_insert():
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    
    print(f"🧪 Testing single record insert")
    print(f"📅 {datetime.now().isoformat()}")
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        conn = await asyncpg.connect(postgres_url, ssl=ssl_context, command_timeout=30)
        print("✅ Connected to PostgreSQL")
        
        # Test simple insert into organizations table
        test_sql = """
        INSERT INTO organizations (xata_id, name, description, category)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (xata_id) DO UPDATE SET name = EXCLUDED.name
        """
        
        await conn.execute(test_sql, 
            'test_org_123', 
            'Test Organization', 
            'Testing database connectivity',
            'test'
        )
        
        print("✅ Test insert successful")
        
        # Verify the record
        result = await conn.fetchrow("SELECT * FROM organizations WHERE xata_id = $1", 'test_org_123')
        if result:
            print(f"✅ Record verified: {result['name']}")
        else:
            print("❌ Record not found")
        
        # Check table count
        count = await conn.fetchval("SELECT COUNT(*) FROM organizations")
        print(f"📊 Total organizations: {count}")
        
        await conn.close()
        print("✅ Test completed successfully")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_insert())