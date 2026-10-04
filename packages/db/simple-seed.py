#!/usr/bin/env python3
"""
Simple seeding script using Xata PostgreSQL wire protocol
"""

import asyncio
import asyncpg
import csv
import ssl
from pathlib import Path

async def seed_data():
    # Xata PostgreSQL connection
    postgres_url = "postgresql://kgubvq:xau_T2uckroqht3tNd7pL3uETsxM0EC5WSNd1@us-east-1.sql.xata.sh/ultraterrestrial-postgres:main?sslmode=require"
    exports_path = Path("/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports")
    
    print("🌱 Starting database seeding...")
    
    # Create SSL context
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        # Connect to database
        conn = await asyncpg.connect(postgres_url, ssl=ssl_context)
        print("✅ Connected to Xata PostgreSQL")
        
        # Test connection with simple query
        result = await conn.fetchval("SELECT COUNT(*) FROM users")
        print(f"📊 Current users count: {result}")
        
        # Check if we have the CSV file
        users_csv = exports_path / "users.csv"
        if users_csv.exists():
            print(f"📁 Found users.csv ({users_csv.stat().st_size} bytes)")
            
            # Try to import a few users as a test
            with open(users_csv, 'r') as f:
                reader = csv.DictReader(f)
                rows = list(reader)
                print(f"📋 CSV contains {len(rows)} rows")
                
                # Show first row structure
                if rows:
                    print(f"🔍 Sample row: {list(rows[0].keys())}")
                    
                    # Try to insert first user
                    first_user = rows[0]
                    if 'email' in first_user and first_user['email']:
                        try:
                            await conn.execute(
                                "INSERT INTO users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING",
                                first_user['email'],
                                first_user.get('name', 'Test User')
                            )
                            print("✅ Successfully inserted test user")
                        except Exception as e:
                            print(f"❌ Failed to insert user: {e}")
                    
        else:
            print("❌ users.csv not found")
            
        # Check final count
        final_count = await conn.fetchval("SELECT COUNT(*) FROM users")
        print(f"📊 Final users count: {final_count}")
        
        await conn.close()
        print("✅ Database connection closed")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(seed_data())