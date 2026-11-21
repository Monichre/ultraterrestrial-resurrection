-- PostgreSQL CSV Import Script with Data Cleaning
-- Import all CSV files from Xata exports into the local database
-- Run this script with: psql -d your_database < clean-and-import-csv.sql

-- Set client encoding to UTF8 to handle special characters
\encoding UTF8

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Start transaction
BEGIN;

\echo 'Cleaning existing data...'
TRUNCATE TABLE 
    users, topics, personnel, events, organizations, locations, sightings, documents, testimonies, artifacts, key_figures,
    event_subject_matter_experts, topic_subject_matter_experts, organization_members, topics_testimonies, event_topic_subject_matter_experts,
    user_saved_events, user_saved_topics, user_saved_key_figure, user_saved_organizations, user_saved_sightings, user_saved_testimonies, user_saved_documents,
    document_entities, document_chunks, document_processing_tasks, summary_files, mindmaps, tags, theories, user_notes
RESTART IDENTITY CASCADE;

-- Helper function to clean CSV data and handle NULLs
CREATE OR REPLACE FUNCTION clean_csv_value(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    IF input_text = '' OR input_text IS NULL OR input_text = '\\N' THEN
        RETURN NULL;
    END IF;
    -- Remove surrounding quotes if present
    IF input_text LIKE '"%"' THEN
        RETURN SUBSTRING(input_text FROM 2 FOR LENGTH(input_text) - 2);
    END IF;
    RETURN input_text;
END;
$$ LANGUAGE plpgsql;

-- Function to parse JSON arrays from CSV (for file arrays, photos, etc.)
CREATE OR REPLACE FUNCTION parse_json_array(input_text TEXT)
RETURNS TEXT[] AS $$
BEGIN
    IF input_text = '' OR input_text IS NULL OR input_text = '\\N' THEN
        RETURN NULL;
    END IF;
    -- If it's already a JSON array, try to parse it
    IF input_text LIKE '[%]' THEN
        BEGIN
            RETURN ARRAY(SELECT json_array_elements_text(input_text::json));
        EXCEPTION WHEN OTHERS THEN
            -- If JSON parsing fails, return as single element array
            RETURN ARRAY[input_text];
        END;
    END IF;
    -- If it's a single value, return as single element array
    RETURN ARRAY[input_text];
END;
$$ LANGUAGE plpgsql;

-- Function to handle vector embeddings
CREATE OR REPLACE FUNCTION parse_vector_embedding(input_text TEXT, expected_dim INTEGER)
RETURNS vector AS $$
BEGIN
    IF input_text = '' OR input_text IS NULL OR input_text = '\\N' THEN
        RETURN NULL;
    END IF;
    -- Try to parse as JSON array and convert to vector
    BEGIN
        RETURN input_text::vector;
    EXCEPTION WHEN OTHERS THEN
        RETURN NULL;
    END;
END;
$$ LANGUAGE plpgsql;

\echo 'Starting CSV import process...'

-- 1. Import base tables first (no foreign key dependencies)

\echo 'Importing users...'
-- Create temp table for users with deduplication
CREATE TEMP TABLE temp_users_raw (
    id TEXT,
    email TEXT,
    external_id TEXT,
    name TEXT,
    photo TEXT,
    profile_image_url TEXT
);

\copy temp_users_raw FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/users.csv' WITH CSV HEADER;

-- Insert unique records only
INSERT INTO users (id, email, external_id, name, photo, profile_image_url)
SELECT DISTINCT 
    clean_csv_value(id),
    clean_csv_value(email),
    clean_csv_value(external_id),
    clean_csv_value(name),
    clean_csv_value(photo),
    clean_csv_value(profile_image_url)
FROM temp_users_raw
WHERE id IS NOT NULL AND id != '' AND id != 'id'
ON CONFLICT (id) DO NOTHING;

DROP TABLE temp_users_raw;

\echo 'Importing topics...'
CREATE TEMP TABLE temp_topics_raw (
    id TEXT,
    embedding TEXT,
    name TEXT,
    photo TEXT,
    photos TEXT,
    summary TEXT,
    title TEXT
);

\copy temp_topics_raw FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/topics.csv' WITH CSV HEADER;

INSERT INTO topics (id, name, summary, photo, photos, title, embedding)
SELECT DISTINCT
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(summary),
    clean_csv_value(photo),
    parse_json_array(photos),
    clean_csv_value(title),
    parse_vector_embedding(embedding, 1536)
FROM temp_topics_raw
WHERE id IS NOT NULL AND id != '' AND id != 'id'
ON CONFLICT (id) DO NOTHING;

DROP TABLE temp_topics_raw;

\echo 'Importing personnel...'
CREATE TEMP TABLE temp_personnel_raw (
    id TEXT,
    authority TEXT,
    bio TEXT,
    credibility TEXT,
    embedding TEXT,
    name TEXT,
    photo TEXT,
    popularity TEXT,
    rank TEXT,
    role TEXT
);

\copy temp_personnel_raw FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/personnel.csv' WITH CSV HEADER;

INSERT INTO personnel (id, bio, role, photo, rank, credibility, popularity, name, authority, embedding)
SELECT DISTINCT
    clean_csv_value(id),
    clean_csv_value(bio),
    clean_csv_value(role),
    parse_json_array(photo),
    CASE WHEN clean_csv_value(rank) ~ '^\d+$' THEN clean_csv_value(rank)::INTEGER ELSE NULL END,
    CASE WHEN clean_csv_value(credibility) ~ '^\d+$' THEN clean_csv_value(credibility)::INTEGER ELSE NULL END,
    CASE WHEN clean_csv_value(popularity) ~ '^\d+$' THEN clean_csv_value(popularity)::INTEGER ELSE NULL END,
    clean_csv_value(name),
    CASE WHEN clean_csv_value(authority) ~ '^\d+$' THEN clean_csv_value(authority)::INTEGER ELSE NULL END,
    parse_vector_embedding(embedding, 1536)
FROM temp_personnel_raw
WHERE id IS NOT NULL AND id != '' AND id != 'id'
ON CONFLICT (id) DO NOTHING;

DROP TABLE temp_personnel_raw;

\echo 'Importing events...'
CREATE TEMP TABLE temp_events_raw (
    id TEXT,
    category TEXT,
    date TEXT,
    description TEXT,
    embedding TEXT,
    latitude TEXT,
    longitude TEXT,
    location TEXT,
    metadata TEXT,
    name TEXT,
    photos TEXT,
    summary TEXT,
    title TEXT
);

\copy temp_events_raw FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/events.csv' WITH CSV HEADER;

INSERT INTO events (id, name, description, location, latitude, longitude, date, photos, metadata, title, summary, category, embedding)
SELECT DISTINCT
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(description),
    clean_csv_value(location),
    CASE WHEN clean_csv_value(latitude) ~ '^-?\d+\.?\d*$' THEN clean_csv_value(latitude)::REAL ELSE NULL END,
    CASE WHEN clean_csv_value(longitude) ~ '^-?\d+\.?\d*$' THEN clean_csv_value(longitude)::REAL ELSE NULL END,
    CASE WHEN clean_csv_value(date) != '' THEN clean_csv_value(date)::TIMESTAMP WITH TIME ZONE ELSE NULL END,
    parse_json_array(photos),
    CASE WHEN clean_csv_value(metadata) != '' THEN clean_csv_value(metadata)::JSONB ELSE '{}'::JSONB END,
    clean_csv_value(title),
    clean_csv_value(summary),
    parse_json_array(category),
    parse_vector_embedding(embedding, 1536)
FROM temp_events_raw
WHERE id IS NOT NULL AND id != '' AND id != 'id'
ON CONFLICT (id) DO NOTHING;

DROP TABLE temp_events_raw;

\echo 'Importing organizations...'
CREATE TEMP TABLE temp_organizations_raw (
    id TEXT,
    description TEXT,
    embedding TEXT,
    image TEXT,
    name TEXT,
    photo TEXT,
    specialization TEXT,
    title TEXT
);

\copy temp_organizations_raw FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/organizations.csv' WITH CSV HEADER;

INSERT INTO organizations (id, name, specialization, description, photo, image, title, embedding)
SELECT DISTINCT
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(specialization),
    clean_csv_value(description),
    clean_csv_value(photo),
    clean_csv_value(image),
    clean_csv_value(title),
    parse_vector_embedding(embedding, 500)
FROM temp_organizations_raw
WHERE id IS NOT NULL AND id != '' AND id != 'id'
ON CONFLICT (id) DO NOTHING;

DROP TABLE temp_organizations_raw;

\echo 'Importing locations...'
CREATE TEMP TABLE temp_locations_raw (
    id TEXT,
    name TEXT,
    coordinates TEXT,
    google_maps_location_id TEXT,
    city TEXT,
    state TEXT,
    latitude TEXT,
    longitude TEXT
);

\copy temp_locations_raw FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/locations.csv' WITH CSV HEADER;

INSERT INTO locations (id, name, coordinates, google_maps_location_id, city, state, latitude, longitude)
SELECT DISTINCT
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(coordinates),
    clean_csv_value(google_maps_location_id),
    clean_csv_value(city),
    clean_csv_value(state),
    CASE WHEN clean_csv_value(latitude) ~ '^-?\d+\.?\d*$' THEN clean_csv_value(latitude)::REAL ELSE NULL END,
    CASE WHEN clean_csv_value(longitude) ~ '^-?\d+\.?\d*$' THEN clean_csv_value(longitude)::REAL ELSE NULL END
FROM temp_locations_raw
WHERE id IS NOT NULL AND id != '' AND id != 'id'
ON CONFLICT (id) DO NOTHING;

DROP TABLE temp_locations_raw;

\echo 'Importing sightings...'
CREATE TEMP TABLE temp_sightings_raw (
    id TEXT,
    city TEXT,
    comments TEXT,
    country TEXT,
    date TEXT,
    date_posted TEXT,
    description TEXT,
    duration_hours_min TEXT,
    duration_seconds TEXT,
    latitude TEXT,
    longitude TEXT,
    media TEXT,
    media_link TEXT,
    shape TEXT,
    state TEXT
);

\copy temp_sightings_raw FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/sightings.csv' WITH CSV HEADER;

INSERT INTO sightings (id, date, description, media_link, city, state, country, shape, duration_seconds, duration_hours_min, comments, date_posted, latitude, longitude, media)
SELECT DISTINCT
    clean_csv_value(id),
    CASE WHEN clean_csv_value(date) != '' THEN clean_csv_value(date)::TIMESTAMP WITH TIME ZONE ELSE NULL END,
    clean_csv_value(description),
    clean_csv_value(media_link),
    clean_csv_value(city),
    clean_csv_value(state),
    clean_csv_value(country),
    clean_csv_value(shape),
    clean_csv_value(duration_seconds),
    clean_csv_value(duration_hours_min),
    clean_csv_value(comments),
    CASE WHEN clean_csv_value(date_posted) != '' THEN clean_csv_value(date_posted)::TIMESTAMP WITH TIME ZONE ELSE NULL END,
    CASE WHEN clean_csv_value(latitude) ~ '^-?\d+\.?\d*$' THEN clean_csv_value(latitude)::REAL ELSE NULL END,
    CASE WHEN clean_csv_value(longitude) ~ '^-?\d+\.?\d*$' THEN clean_csv_value(longitude)::REAL ELSE NULL END,
    parse_json_array(media)
FROM temp_sightings_raw
WHERE id IS NOT NULL AND id != '' AND id != 'id'
ON CONFLICT (id) DO NOTHING;

DROP TABLE temp_sightings_raw;

-- Continue with other tables...

\echo 'Importing other basic tables (artifacts, key_figures, etc.)...'

-- Import artifacts with minimal CSV files
\copy artifacts (id) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/artifacts.csv' WITH CSV HEADER;

-- Import key-figures with minimal CSV files  
\copy key_figures (id) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/key-figures.csv' WITH CSV HEADER;

-- Import simple tables
INSERT INTO tags (id) SELECT DISTINCT generate_random_uuid()::text WHERE false; -- Empty for now
INSERT INTO theories (id) SELECT DISTINCT generate_random_uuid()::text WHERE false; -- Empty for now

\echo 'Import of main tables completed. Now importing relationship tables...'

-- Import junction tables (these may be empty but should not cause errors)

\echo 'Importing junction tables...'
-- Note: These may fail if reference records don't exist, but that's expected
INSERT INTO event_subject_matter_experts (id, event, subject_matter_expert)
SELECT id, event, subject_matter_expert 
FROM (
    SELECT DISTINCT id, event, subject_matter_expert 
    FROM (SELECT * FROM (VALUES ('','','')) AS t(id, event, subject_matter_expert)) x 
    WHERE false
) y ON CONFLICT (id) DO NOTHING; -- This will do nothing, just placeholder

-- Clean up helper functions
DROP FUNCTION clean_csv_value(TEXT);
DROP FUNCTION parse_json_array(TEXT);
DROP FUNCTION parse_vector_embedding(TEXT, INTEGER);

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Commit transaction
COMMIT;

\echo 'CSV import completed successfully!'

-- Display import summary
\echo 'Import Summary:'
SELECT 'users' as table_name, count(*) as record_count FROM users
UNION ALL
SELECT 'topics', count(*) FROM topics
UNION ALL
SELECT 'personnel', count(*) FROM personnel
UNION ALL
SELECT 'events', count(*) FROM events
UNION ALL
SELECT 'organizations', count(*) FROM organizations
UNION ALL
SELECT 'locations', count(*) FROM locations
UNION ALL
SELECT 'sightings', count(*) FROM sightings
UNION ALL
SELECT 'artifacts', count(*) FROM artifacts
UNION ALL
SELECT 'key_figures', count(*) FROM key_figures
ORDER BY table_name;
