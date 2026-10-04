#!/usr/bin/env python3
"""
CSV Import Script for PostgreSQL Database
Handles complex CSV files with embedded commas, quotes, and newlines properly.
"""

import csv
import json
import os
import sys
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
import psycopg2
from psycopg2.extras import execute_batch, Json
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://liamellis@localhost:5432/ultraterrestrial")

# CSV files directory
CSV_DIR = Path("/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports")

def clean_csv_value(value: str) -> Optional[str]:
    """Clean CSV value and handle nulls"""
    if not value or value == '' or value == '\\N':
        return None
    # Remove surrounding quotes if present
    if value.startswith('"') and value.endswith('"'):
        value = value[1:-1]
    return value

def parse_json_array(value: str) -> Optional[List[str]]:
    """Parse JSON array from CSV string"""
    if not value or value == '' or value == '\\N':
        return None
    
    # If it's already a JSON array, try to parse it
    if value.startswith('[') and value.endswith(']'):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            # If JSON parsing fails, return as single element array
            return [value]
    
    # If it's a single value, return as single element array
    return [value]

def parse_timestamp(value: str) -> Optional[datetime]:
    """Parse timestamp from various formats"""
    if not value or value == '' or value == '\\N':
        return None
    
    try:
        # Try ISO format first
        if 'T' in value:
            return datetime.fromisoformat(value.replace('Z', '+00:00'))
        # Try other common formats
        for fmt in ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d']:
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue
    except Exception as e:
        logger.warning(f"Could not parse timestamp '{value}': {e}")
    
    return None

def parse_int(value: str) -> Optional[int]:
    """Parse integer safely"""
    if not value or value == '' or value == '\\N':
        return None
    
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

def parse_float(value: str) -> Optional[float]:
    """Parse float safely"""
    if not value or value == '' or value == '\\N':
        return None
    
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def parse_jsonb(value: str) -> Optional[Json]:
    """Parse JSONB field"""
    if not value or value == '' or value == '\\N':
        return None
    
    try:
        parsed = json.loads(value)
        return Json(parsed)
    except json.JSONDecodeError:
        return Json({})

def get_unique_records(records: List[Dict], key_field: str = 'id') -> List[Dict]:
    """Remove duplicate records based on key field"""
    seen = set()
    unique_records = []
    
    for record in records:
        key_value = record.get(key_field)
        if key_value and key_value not in seen and key_value != key_field:
            seen.add(key_value)
            unique_records.append(record)
    
    return unique_records

def import_users(conn, cursor) -> int:
    """Import users table"""
    logger.info("Importing users...")
    
    csv_file = CSV_DIR / "users.csv"
    if not csv_file.exists():
        logger.warning(f"Users CSV file not found: {csv_file}")
        return 0
    
    records = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            record = {
                'id': clean_csv_value(row.get('id', '')),
                'email': clean_csv_value(row.get('email', '')),
                'external_id': clean_csv_value(row.get('external_id', '')),
                'name': clean_csv_value(row.get('name', '')),
                'photo': clean_csv_value(row.get('photo', '')),
                'profile_image_url': clean_csv_value(row.get('profile_image_url', ''))
            }
            if record['id']:
                records.append(record)
    
    # Remove duplicates
    unique_records = get_unique_records(records)
    
    # Clear existing data
    cursor.execute("TRUNCATE TABLE users RESTART IDENTITY CASCADE")
    
    # Insert records
    if unique_records:
        insert_sql = """
        INSERT INTO users (id, email, external_id, name, photo, profile_image_url)
        VALUES (%(id)s, %(email)s, %(external_id)s, %(name)s, %(photo)s, %(profile_image_url)s)
        ON CONFLICT (id) DO NOTHING
        """
        execute_batch(cursor, insert_sql, unique_records)
    
    conn.commit()
    logger.info(f"Imported {len(unique_records)} users")
    return len(unique_records)

def import_topics(conn, cursor) -> int:
    """Import topics table"""
    logger.info("Importing topics...")
    
    csv_file = CSV_DIR / "topics.csv"
    if not csv_file.exists():
        logger.warning(f"Topics CSV file not found: {csv_file}")
        return 0
    
    records = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            record = {
                'id': clean_csv_value(row.get('id', '')),
                'name': clean_csv_value(row.get('name', '')),
                'summary': clean_csv_value(row.get('summary', '')),
                'photo': clean_csv_value(row.get('photo', '')),
                'photos': parse_json_array(row.get('photos', '')),
                'title': clean_csv_value(row.get('title', '')),
                'embedding': None  # Skip embeddings for now
            }
            if record['id']:
                records.append(record)
    
    # Remove duplicates
    unique_records = get_unique_records(records)
    
    # Insert records
    if unique_records:
        insert_sql = """
        INSERT INTO topics (id, name, summary, photo, photos, title, embedding)
        VALUES (%(id)s, %(name)s, %(summary)s, %(photo)s, %(photos)s, %(title)s, %(embedding)s)
        ON CONFLICT (id) DO NOTHING
        """
        execute_batch(cursor, insert_sql, unique_records)
    
    conn.commit()
    logger.info(f"Imported {len(unique_records)} topics")
    return len(unique_records)

def import_personnel(conn, cursor) -> int:
    """Import personnel table"""
    logger.info("Importing personnel...")
    
    csv_file = CSV_DIR / "personnel.csv"
    if not csv_file.exists():
        logger.warning(f"Personnel CSV file not found: {csv_file}")
        return 0
    
    records = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            record = {
                'id': clean_csv_value(row.get('id', '')),
                'bio': clean_csv_value(row.get('bio', '')),
                'role': clean_csv_value(row.get('role', '')),
                'photo': parse_json_array(row.get('photo', '')),
                'rank': parse_int(row.get('rank', '')),
                'credibility': parse_int(row.get('credibility', '')),
                'popularity': parse_int(row.get('popularity', '')),
                'name': clean_csv_value(row.get('name', '')),
                'authority': parse_int(row.get('authority', '')),
                'embedding': None  # Skip embeddings for now
            }
            if record['id']:
                records.append(record)
    
    # Remove duplicates
    unique_records = get_unique_records(records)
    
    # Insert records
    if unique_records:
        insert_sql = """
        INSERT INTO personnel (id, bio, role, photo, rank, credibility, popularity, name, authority, embedding)
        VALUES (%(id)s, %(bio)s, %(role)s, %(photo)s, %(rank)s, %(credibility)s, %(popularity)s, %(name)s, %(authority)s, %(embedding)s)
        ON CONFLICT (id) DO NOTHING
        """
        execute_batch(cursor, insert_sql, unique_records)
    
    conn.commit()
    logger.info(f"Imported {len(unique_records)} personnel")
    return len(unique_records)

def import_events(conn, cursor) -> int:
    """Import events table"""
    logger.info("Importing events...")
    
    csv_file = CSV_DIR / "events.csv"
    if not csv_file.exists():
        logger.warning(f"Events CSV file not found: {csv_file}")
        return 0
    
    records = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            record = {
                'id': clean_csv_value(row.get('id', '')),
                'name': clean_csv_value(row.get('name', '')),
                'description': clean_csv_value(row.get('description', '')),
                'location': clean_csv_value(row.get('location', '')),
                'latitude': parse_float(row.get('latitude', '')),
                'longitude': parse_float(row.get('longitude', '')),
                'date': parse_timestamp(row.get('date', '')),
                'photos': parse_json_array(row.get('photos', '')),
                'metadata': parse_jsonb(row.get('metadata', '')),
                'title': clean_csv_value(row.get('title', '')),
                'summary': clean_csv_value(row.get('summary', '')),
                'category': parse_json_array(row.get('category', '')),
                'embedding': None  # Skip embeddings for now
            }
            if record['id']:
                records.append(record)
    
    # Remove duplicates
    unique_records = get_unique_records(records)
    
    # Insert records
    if unique_records:
        insert_sql = """
        INSERT INTO events (id, name, description, location, latitude, longitude, date, photos, metadata, title, summary, category, embedding)
        VALUES (%(id)s, %(name)s, %(description)s, %(location)s, %(latitude)s, %(longitude)s, %(date)s, %(photos)s, %(metadata)s, %(title)s, %(summary)s, %(category)s, %(embedding)s)
        ON CONFLICT (id) DO NOTHING
        """
        execute_batch(cursor, insert_sql, unique_records)
    
    conn.commit()
    logger.info(f"Imported {len(unique_records)} events")
    return len(unique_records)

def import_organizations(conn, cursor) -> int:
    """Import organizations table"""
    logger.info("Importing organizations...")
    
    csv_file = CSV_DIR / "organizations.csv"
    if not csv_file.exists():
        logger.warning(f"Organizations CSV file not found: {csv_file}")
        return 0
    
    records = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            record = {
                'id': clean_csv_value(row.get('id', '')),
                'name': clean_csv_value(row.get('name', '')),
                'specialization': clean_csv_value(row.get('specialization', '')),
                'description': clean_csv_value(row.get('description', '')),
                'photo': clean_csv_value(row.get('photo', '')),
                'image': clean_csv_value(row.get('image', '')),
                'title': clean_csv_value(row.get('title', '')),
                'embedding': None  # Skip embeddings for now
            }
            if record['id']:
                records.append(record)
    
    # Remove duplicates
    unique_records = get_unique_records(records)
    
    # Insert records
    if unique_records:
        insert_sql = """
        INSERT INTO organizations (id, name, specialization, description, photo, image, title, embedding)
        VALUES (%(id)s, %(name)s, %(specialization)s, %(description)s, %(photo)s, %(image)s, %(title)s, %(embedding)s)
        ON CONFLICT (id) DO NOTHING
        """
        execute_batch(cursor, insert_sql, unique_records)
    
    conn.commit()
    logger.info(f"Imported {len(unique_records)} organizations")
    return len(unique_records)

def import_sightings(conn, cursor) -> int:
    """Import sightings table"""
    logger.info("Importing sightings...")
    
    csv_file = CSV_DIR / "sightings.csv"
    if not csv_file.exists():
        logger.warning(f"Sightings CSV file not found: {csv_file}")
        return 0
    
    records = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            record = {
                'id': clean_csv_value(row.get('id', '')),
                'date': parse_timestamp(row.get('date', '')),
                'description': clean_csv_value(row.get('description', '')),
                'media_link': clean_csv_value(row.get('media_link', '')),
                'city': clean_csv_value(row.get('city', '')),
                'state': clean_csv_value(row.get('state', '')),
                'country': clean_csv_value(row.get('country', '')),
                'shape': clean_csv_value(row.get('shape', '')),
                'duration_seconds': clean_csv_value(row.get('duration_seconds', '')),
                'duration_hours_min': clean_csv_value(row.get('duration_hours_min', '')),
                'comments': clean_csv_value(row.get('comments', '')),
                'date_posted': parse_timestamp(row.get('date_posted', '')),
                'latitude': parse_float(row.get('latitude', '')),
                'longitude': parse_float(row.get('longitude', '')),
                'media': parse_json_array(row.get('media', ''))
            }
            if record['id']:
                records.append(record)
    
    # Remove duplicates
    unique_records = get_unique_records(records)
    
    # Insert records
    if unique_records:
        insert_sql = """
        INSERT INTO sightings (id, date, description, media_link, city, state, country, shape, duration_seconds, duration_hours_min, comments, date_posted, latitude, longitude, media)
        VALUES (%(id)s, %(date)s, %(description)s, %(media_link)s, %(city)s, %(state)s, %(country)s, %(shape)s, %(duration_seconds)s, %(duration_hours_min)s, %(comments)s, %(date_posted)s, %(latitude)s, %(longitude)s, %(media)s)
        ON CONFLICT (id) DO NOTHING
        """
        execute_batch(cursor, insert_sql, unique_records)
    
    conn.commit()
    logger.info(f"Imported {len(unique_records)} sightings")
    return len(unique_records)

def main():
    """Main import function"""
    logger.info("Starting CSV import process...")
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Disable foreign key checks and drop unique constraints temporarily
        cursor.execute("SET session_replication_role = replica")
        
        # Drop unique constraints that might cause issues during import
        constraints_to_drop = [
            "ALTER TABLE topics DROP CONSTRAINT IF EXISTS uk_topics_title",
            "ALTER TABLE personnel DROP CONSTRAINT IF EXISTS uk_personnel_name", 
            "ALTER TABLE events DROP CONSTRAINT IF EXISTS uk_events_title",
            "ALTER TABLE organizations DROP CONSTRAINT IF EXISTS uk_organizations_title",
            "ALTER TABLE artifacts DROP CONSTRAINT IF EXISTS uk_artifacts_name"
        ]
        
        for constraint in constraints_to_drop:
            try:
                cursor.execute(constraint)
            except Exception as e:
                logger.warning(f"Could not drop constraint: {e}")
        
        conn.commit()
        
        # Import each table in order
        import_counts = {}
        import_counts['users'] = import_users(conn, cursor)
        import_counts['topics'] = import_topics(conn, cursor)
        import_counts['personnel'] = import_personnel(conn, cursor)
        import_counts['events'] = import_events(conn, cursor)
        import_counts['organizations'] = import_organizations(conn, cursor)
        import_counts['sightings'] = import_sightings(conn, cursor)
        
        # Re-enable foreign key checks and recreate unique constraints
        cursor.execute("SET session_replication_role = DEFAULT")
        
        # Recreate unique constraints
        constraints_to_recreate = [
            "ALTER TABLE topics ADD CONSTRAINT uk_topics_title UNIQUE (title)",
            "ALTER TABLE personnel ADD CONSTRAINT uk_personnel_name UNIQUE (name)", 
            "ALTER TABLE events ADD CONSTRAINT uk_events_title UNIQUE (title)",
            "ALTER TABLE organizations ADD CONSTRAINT uk_organizations_title UNIQUE (title)",
            "ALTER TABLE artifacts ADD CONSTRAINT uk_artifacts_name UNIQUE (name)"
        ]
        
        for constraint in constraints_to_recreate:
            try:
                cursor.execute(constraint)
            except Exception as e:
                logger.warning(f"Could not recreate constraint (may have duplicates): {e}")
        
        conn.commit()
        
        # Display summary
        logger.info("Import completed successfully!")
        logger.info("Import Summary:")
        for table, count in import_counts.items():
            logger.info(f"  {table}: {count} records")
        
        # Show final counts from database
        cursor.execute("""
            SELECT 'users' as table_name, count(*) as records FROM users
            UNION ALL SELECT 'topics', count(*) FROM topics
            UNION ALL SELECT 'personnel', count(*) FROM personnel  
            UNION ALL SELECT 'events', count(*) FROM events
            UNION ALL SELECT 'organizations', count(*) FROM organizations
            UNION ALL SELECT 'sightings', count(*) FROM sightings
            ORDER BY table_name
        """)
        
        logger.info("Final database counts:")
        for table, count in cursor.fetchall():
            logger.info(f"  {table}: {count} records")
        
        conn.commit()
        cursor.close()
        conn.close()
        
    except Exception as e:
        logger.error(f"Import failed: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        sys.exit(1)

if __name__ == "__main__":
    main()
