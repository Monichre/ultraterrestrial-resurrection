-- PostgreSQL CSV Import Script
-- Import all CSV files from Xata exports into the local database
-- Run this script with: psql -d your_database < import-csv-data.sql

-- Set client encoding to UTF8 to handle special characters
\encoding UTF8

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Start transaction
BEGIN;

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
\copy users (id, email, external_id, name, photo, profile_image_url) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/users.csv' WITH CSV HEADER;

\echo 'Importing topics...'
CREATE TEMP TABLE temp_topics (
    id TEXT,
    embedding TEXT,
    name TEXT,
    photo TEXT,
    photos TEXT,
    summary TEXT,
    title TEXT
);

\copy temp_topics FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/topics.csv' WITH CSV HEADER;

INSERT INTO topics (id, name, summary, photo, photos, title, embedding)
SELECT 
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(summary),
    clean_csv_value(photo),
    parse_json_array(photos),
    clean_csv_value(title),
    parse_vector_embedding(embedding, 1536)
FROM temp_topics
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_topics;

\echo 'Importing personnel...'
CREATE TEMP TABLE temp_personnel (
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

\copy temp_personnel FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/personnel.csv' WITH CSV HEADER;

INSERT INTO personnel (id, bio, role, photo, rank, credibility, popularity, name, authority, embedding)
SELECT 
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
FROM temp_personnel
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_personnel;

\echo 'Importing events...'
CREATE TEMP TABLE temp_events (
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

\copy temp_events FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/events.csv' WITH CSV HEADER;

INSERT INTO events (id, name, description, location, latitude, longitude, date, photos, metadata, title, summary, category, embedding)
SELECT 
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
FROM temp_events
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_events;

\echo 'Importing organizations...'
CREATE TEMP TABLE temp_organizations (
    id TEXT,
    description TEXT,
    embedding TEXT,
    image TEXT,
    name TEXT,
    photo TEXT,
    specialization TEXT,
    title TEXT
);

\copy temp_organizations FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/organizations.csv' WITH CSV HEADER;

INSERT INTO organizations (id, name, specialization, description, photo, image, title, embedding)
SELECT 
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(specialization),
    clean_csv_value(description),
    clean_csv_value(photo),
    clean_csv_value(image),
    clean_csv_value(title),
    parse_vector_embedding(embedding, 500)
FROM temp_organizations
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_organizations;

\echo 'Importing locations...'
\copy locations (id, name, coordinates, google_maps_location_id, city, state, latitude, longitude) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/locations.csv' WITH CSV HEADER NULL '';

\echo 'Importing sightings...'
CREATE TEMP TABLE temp_sightings (
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

\copy temp_sightings FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/sightings.csv' WITH CSV HEADER;

INSERT INTO sightings (id, date, description, media_link, city, state, country, shape, duration_seconds, duration_hours_min, comments, date_posted, latitude, longitude, media)
SELECT 
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
FROM temp_sightings
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_sightings;

\echo 'Importing documents...'
CREATE TEMP TABLE temp_documents (
    id TEXT,
    author TEXT,
    date TEXT,
    embedding TEXT,
    file TEXT,
    images TEXT,
    metadata TEXT,
    organization TEXT,
    processed TEXT,
    summary TEXT,
    title TEXT,
    url TEXT
);

\copy temp_documents FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/documents.csv' WITH CSV HEADER;

INSERT INTO documents (id, file, summary, embedding, title, date, author, organization, url, metadata, images, processed)
SELECT 
    clean_csv_value(id),
    parse_json_array(file),
    clean_csv_value(summary),
    parse_vector_embedding(embedding, 1536),
    clean_csv_value(title),
    CASE WHEN clean_csv_value(date) != '' THEN clean_csv_value(date)::TIMESTAMP WITH TIME ZONE ELSE NULL END,
    clean_csv_value(author),
    clean_csv_value(organization),
    clean_csv_value(url),
    CASE WHEN clean_csv_value(metadata) != '' THEN clean_csv_value(metadata)::JSONB ELSE '{}'::JSONB END,
    parse_json_array(images),
    clean_csv_value(processed)
FROM temp_documents
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_documents;

\echo 'Importing testimonies...'
CREATE TEMP TABLE temp_testimonies (
    id TEXT,
    claim TEXT,
    context TEXT,
    date TEXT,
    documentation TEXT,
    embedding TEXT,
    event TEXT,
    media TEXT,
    organization TEXT,
    source TEXT,
    summary TEXT,
    witness TEXT
);

\copy temp_testimonies FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/testimonies.csv' WITH CSV HEADER;

INSERT INTO testimonies (id, claim, event, summary, witness, documentation, date, organization, source, media, context, embedding)
SELECT 
    clean_csv_value(id),
    clean_csv_value(claim),
    clean_csv_value(event),
    clean_csv_value(summary),
    clean_csv_value(witness),
    parse_json_array(documentation),
    CASE WHEN clean_csv_value(date) != '' THEN clean_csv_value(date)::TIMESTAMP WITH TIME ZONE ELSE NULL END,
    clean_csv_value(organization),
    clean_csv_value(source),
    parse_json_array(media),
    clean_csv_value(context),
    parse_vector_embedding(embedding, 1536)
FROM temp_testimonies
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_testimonies;

\echo 'Importing artifacts...'
CREATE TEMP TABLE temp_artifacts (
    id TEXT,
    date TEXT,
    description TEXT,
    embedding TEXT,
    images TEXT,
    name TEXT,
    origin TEXT,
    photos TEXT,
    source TEXT
);

\copy temp_artifacts FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/artifacts.csv' WITH CSV HEADER;

INSERT INTO artifacts (id, name, description, photos, date, source, origin, images, embedding)
SELECT 
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(description),
    parse_json_array(photos),
    clean_csv_value(date),
    clean_csv_value(source),
    clean_csv_value(origin),
    parse_json_array(images),
    parse_vector_embedding(embedding, 1536)
FROM temp_artifacts
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_artifacts;

\echo 'Importing key-figures...'
CREATE TEMP TABLE temp_key_figures (
    id TEXT,
    authority TEXT,
    bio TEXT,
    credibility TEXT,
    embedding TEXT,
    name TEXT,
    photo TEXT,
    popularity TEXT,
    rank TEXT,
    role TEXT,
    xataversion TEXT
);

\copy temp_key_figures FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/key-figures.csv' WITH CSV HEADER;

INSERT INTO key_figures (id, name, bio, photo, role, rank, credibility, popularity, authority, embedding, xataversion)
SELECT 
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(bio),
    clean_csv_value(photo),
    clean_csv_value(role),
    CASE WHEN clean_csv_value(rank) ~ '^\d+$' THEN clean_csv_value(rank)::INTEGER ELSE NULL END,
    CASE WHEN clean_csv_value(credibility) ~ '^\d+$' THEN clean_csv_value(credibility)::INTEGER ELSE NULL END,
    CASE WHEN clean_csv_value(popularity) ~ '^\d+$' THEN clean_csv_value(popularity)::INTEGER ELSE NULL END,
    CASE WHEN clean_csv_value(authority) ~ '^\d+$' THEN clean_csv_value(authority)::INTEGER ELSE NULL END,
    clean_csv_value(embedding),
    CASE WHEN clean_csv_value(xataversion) ~ '^\d+$' THEN clean_csv_value(xataversion)::INTEGER ELSE NULL END
FROM temp_key_figures
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_key_figures;

\echo 'Importing tags...'
\copy tags (id) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/tags.csv' WITH CSV HEADER NULL '';

\echo 'Importing theories...'
\copy theories (id) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/theories.csv' WITH CSV HEADER NULL '';

\echo 'Importing mindmaps...'
CREATE TEMP TABLE temp_mindmaps (
    id TEXT,
    embedding TEXT,
    file TEXT,
    json TEXT,
    "user" TEXT
);

\copy temp_mindmaps FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/mindmaps.csv' WITH CSV HEADER;

INSERT INTO mindmaps (id, json, embedding, "user", file)
SELECT 
    clean_csv_value(id),
    CASE WHEN clean_csv_value(json) != '' THEN clean_csv_value(json)::JSONB ELSE NULL END,
    parse_vector_embedding(embedding, 1536),
    clean_csv_value("user"),
    clean_csv_value(file)
FROM temp_mindmaps
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_mindmaps;

\echo 'Importing user-notes...'
CREATE TEMP TABLE temp_user_notes (
    id TEXT,
    content TEXT,
    diagrams TEXT,
    name TEXT,
    synopsis TEXT,
    "user" TEXT
);

\copy temp_user_notes FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-notes.csv' WITH CSV HEADER;

INSERT INTO user_notes (id, "user", name, content, synopsis, diagrams)
SELECT 
    clean_csv_value(id),
    clean_csv_value("user"),
    clean_csv_value(name),
    clean_csv_value(content),
    clean_csv_value(synopsis),
    parse_json_array(diagrams)
FROM temp_user_notes
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_user_notes;

-- 2. Import junction tables (depend on base tables)

\echo 'Importing event-subject-matter-experts...'
\copy event_subject_matter_experts (id, event, subject_matter_expert) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/event-subject-matter-experts.csv' WITH CSV HEADER NULL '';

\echo 'Importing topic-subject-matter-experts...'
\copy topic_subject_matter_experts (id, topic, subject_matter_expert) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/topic-subject-matter-experts.csv' WITH CSV HEADER NULL '';

\echo 'Importing organization-members...'
\copy organization_members (id, member, organization) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/organization-members.csv' WITH CSV HEADER NULL '';

\echo 'Importing topics-testimonies...'
\copy topics_testimonies (id, topic, testimony) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/topics-testimonies.csv' WITH CSV HEADER NULL '';

\echo 'Importing event-topic-subject-matter-experts...'
\copy event_topic_subject_matter_experts (id, event, topic, subject_matter_expert) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/event-topic-subject-matter-experts.csv' WITH CSV HEADER NULL '';

-- 3. Import user saved tables

\echo 'Importing user-saved-events...'
\copy user_saved_events (id, "user", event, theory, note, note_title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-saved-events.csv' WITH CSV HEADER NULL '';

\echo 'Importing user-saved-topics...'
\copy user_saved_topics (id, "user", topic, theory, note, note_title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-saved-topics.csv' WITH CSV HEADER NULL '';

\echo 'Importing user-saved-key-figure...'
\copy user_saved_key_figure (id, "user", key_figure, theory, note, note_title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-saved-key-figure.csv' WITH CSV HEADER NULL '';

\echo 'Importing user-saved-organizations...'
\copy user_saved_organizations (id, "user", organization, theory, note, note_title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-saved-organizations.csv' WITH CSV HEADER NULL '';

\echo 'Importing user-saved-sightings...'
\copy user_saved_sightings (id, "user", sighting, theory, note, note_title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-saved-sightings.csv' WITH CSV HEADER NULL '';

\echo 'Importing user-saved-testimonies...'
\copy user_saved_testimonies (id, "user", testimony, theory, note, note_title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-saved-testimonies.csv' WITH CSV HEADER NULL '';

\echo 'Importing user-saved-documents...'
\copy user_saved_documents (id, "user", document, theory, note, note_title) FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/user-saved-documents.csv' WITH CSV HEADER NULL '';

-- 4. Import processing tables

\echo 'Importing summary-files...'
CREATE TEMP TABLE temp_summary_files (
    id TEXT,
    content TEXT,
    document TEXT,
    embedding TEXT,
    file TEXT,
    images TEXT,
    metadata TEXT,
    name TEXT,
    source TEXT
);

\copy temp_summary_files FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/summary-files.csv' WITH CSV HEADER;

INSERT INTO summary_files (id, name, file, source, metadata, images, content, embedding, document)
SELECT 
    clean_csv_value(id),
    clean_csv_value(name),
    clean_csv_value(file),
    clean_csv_value(source),
    CASE WHEN clean_csv_value(metadata) != '' THEN clean_csv_value(metadata)::JSONB ELSE NULL END,
    clean_csv_value(images),
    clean_csv_value(content),
    parse_json_array(embedding),
    clean_csv_value(document)
FROM temp_summary_files
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_summary_files;

\echo 'Importing document-entities...'
CREATE TEMP TABLE temp_document_entities (
    id TEXT,
    document TEXT,
    entity_data TEXT,
    entity_type TEXT,
    metadata TEXT
);

\copy temp_document_entities FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/document-entities.csv' WITH CSV HEADER;

INSERT INTO document_entities (id, document, entity_type, entity_data, metadata)
SELECT 
    clean_csv_value(id),
    clean_csv_value(document),
    parse_json_array(entity_type),
    clean_csv_value(entity_data),
    CASE WHEN clean_csv_value(metadata) != '' THEN clean_csv_value(metadata)::JSONB ELSE NULL END
FROM temp_document_entities
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_document_entities;

\echo 'Importing document-chunks...'
CREATE TEMP TABLE temp_document_chunks (
    id TEXT,
    chunk_index TEXT,
    content TEXT,
    document TEXT,
    embedding TEXT,
    heading TEXT,
    page_number TEXT,
    token_count TEXT
);

\copy temp_document_chunks FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/document-chunks.csv' WITH CSV HEADER;

INSERT INTO document_chunks (id, document, chunk_index, content, token_count, embedding, page_number, heading)
SELECT 
    clean_csv_value(id),
    clean_csv_value(document),
    CASE WHEN clean_csv_value(chunk_index) ~ '^\d+$' THEN clean_csv_value(chunk_index)::INTEGER ELSE NULL END,
    clean_csv_value(content),
    CASE WHEN clean_csv_value(token_count) ~ '^\d+$' THEN clean_csv_value(token_count)::INTEGER ELSE NULL END,
    parse_vector_embedding(embedding, 3),
    CASE WHEN clean_csv_value(page_number) ~ '^\d+$' THEN clean_csv_value(page_number)::INTEGER ELSE NULL END,
    clean_csv_value(heading)
FROM temp_document_chunks
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_document_chunks;

\echo 'Importing document-processing-tasks...'
CREATE TEMP TABLE temp_document_processing_tasks (
    id TEXT,
    document TEXT,
    metadata TEXT,
    status TEXT,
    task TEXT
);

\copy temp_document_processing_tasks FROM '/Users/liamellis/Desktop/ultraterrestrial-resurrection/packages/db/docs/exports/document-processing-tasks.csv' WITH CSV HEADER;

INSERT INTO document_processing_tasks (id, document, task, status, metadata)
SELECT 
    clean_csv_value(id),
    clean_csv_value(document),
    parse_json_array(task),
    clean_csv_value(status),
    CASE WHEN clean_csv_value(metadata) != '' THEN clean_csv_value(metadata)::JSONB ELSE NULL END
FROM temp_document_processing_tasks
WHERE id IS NOT NULL AND id != '';

DROP TABLE temp_document_processing_tasks;

-- Clean up helper functions
DROP FUNCTION clean_csv_value(TEXT);
DROP FUNCTION parse_json_array(TEXT);
DROP FUNCTION parse_vector_embedding(TEXT, INTEGER);

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Update sequences to prevent ID conflicts
SELECT setval('users_id_seq', (SELECT MAX(regexp_replace(id, '^rec_', '')::bigint) FROM users WHERE id ~ '^rec_\d+$'), false);
SELECT setval('topics_id_seq', (SELECT MAX(regexp_replace(id, '^rec_', '')::bigint) FROM topics WHERE id ~ '^rec_\d+$'), false);

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
SELECT 'documents', count(*) FROM documents
UNION ALL
SELECT 'testimonies', count(*) FROM testimonies
UNION ALL
SELECT 'artifacts', count(*) FROM artifacts
UNION ALL
SELECT 'key_figures', count(*) FROM key_figures
UNION ALL
SELECT 'event_subject_matter_experts', count(*) FROM event_subject_matter_experts
UNION ALL
SELECT 'topic_subject_matter_experts', count(*) FROM topic_subject_matter_experts
UNION ALL
SELECT 'organization_members', count(*) FROM organization_members
UNION ALL
SELECT 'topics_testimonies', count(*) FROM topics_testimonies
UNION ALL
SELECT 'event_topic_subject_matter_experts', count(*) FROM event_topic_subject_matter_experts
UNION ALL
SELECT 'user_saved_events', count(*) FROM user_saved_events
UNION ALL
SELECT 'user_saved_topics', count(*) FROM user_saved_topics
UNION ALL
SELECT 'user_saved_key_figure', count(*) FROM user_saved_key_figure
UNION ALL
SELECT 'user_saved_organizations', count(*) FROM user_saved_organizations
UNION ALL
SELECT 'user_saved_sightings', count(*) FROM user_saved_sightings
UNION ALL
SELECT 'user_saved_testimonies', count(*) FROM user_saved_testimonies
UNION ALL
SELECT 'user_saved_documents', count(*) FROM user_saved_documents
UNION ALL
SELECT 'document_entities', count(*) FROM document_entities
UNION ALL
SELECT 'document_chunks', count(*) FROM document_chunks
UNION ALL
SELECT 'document_processing_tasks', count(*) FROM document_processing_tasks
UNION ALL
SELECT 'summary_files', count(*) FROM summary_files
ORDER BY table_name;
