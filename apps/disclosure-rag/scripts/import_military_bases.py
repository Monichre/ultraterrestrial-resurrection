#!/usr/bin/env python3
"""
Import military bases data with proper geo_point_2d parsing
"""

import asyncio
import pandas as pd
import json
import asyncpg
import sys
from pathlib import Path

async def import_military_bases():
    """Import military bases CSV with geo coordinate parsing"""
    
    # Database connection
    conn = await asyncpg.connect('postgresql://liamellis@localhost:5432/ultraterrestrial')
    
    try:
        # Read CSV
        df = pd.read_csv('exports/military-bases.csv')
        print(f"📊 Found {len(df)} military installations")
        
        # Parse geo_point_2d JSON to extract lat/lon
        def parse_geo_point(geo_str):
            try:
                # Parse the JSON string
                geo_data = json.loads(geo_str)
                return geo_data.get('lat'), geo_data.get('lon')
            except:
                return None, None
        
        # Extract coordinates
        df[['latitude', 'longitude']] = df['geo_point_2d'].apply(
            lambda x: pd.Series(parse_geo_point(x))
        )
        
        # Clean data
        df = df.fillna('')
        
        # Insert data
        insert_query = """
        INSERT INTO military_installations (
            geo_point_2d, objectid_1, objectid, component, site_name, 
            joint_base, state_terr, country, oper_stat, perimeter, 
            area, shape_leng, shape_area, latitude, longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        """
        
        records = []
        for _, row in df.iterrows():
            # Convert numeric fields safely
            def safe_float(val):
                try:
                    return float(val) if val != '' else None
                except:
                    return None
            
            def safe_int(val):
                try:
                    return int(val) if val != '' else None
                except:
                    return None
            
            record = (
                row['geo_point_2d'],  # Keep as string for JSONB
                safe_int(row['objectid_1']),
                safe_int(row['objectid']),
                str(row['component'])[:100],
                str(row['site_name'])[:255],
                str(row['joint_base'])[:255],
                str(row['state_terr'])[:100],
                str(row['country'])[:100],
                str(row['oper_stat'])[:50],
                safe_float(row['perimeter']),
                safe_float(row['area']),
                safe_float(row['shape_leng']),
                safe_float(row['shape_area']),
                safe_float(row['latitude']),
                safe_float(row['longitude'])
            )
            records.append(record)
        
        # Batch insert
        await conn.executemany(insert_query, records)
        print(f"✅ Imported {len(records)} military installations")
        
        # Verify import
        count = await conn.fetchval("SELECT COUNT(*) FROM military_installations")
        print(f"📊 Total installations in database: {count}")
        
        # Show sample data
        samples = await conn.fetch("""
            SELECT site_name, component, state_terr, latitude, longitude 
            FROM military_installations 
            WHERE latitude IS NOT NULL 
            ORDER BY site_name 
            LIMIT 10
        """)
        
        print("\n🏛️  Sample military installations:")
        for sample in samples:
            print(f"  • {sample['site_name']} ({sample['component']}) - {sample['state_terr']}")
        
    except Exception as e:
        print(f"❌ Import failed: {e}")
        raise
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(import_military_bases())