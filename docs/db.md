# PostgreSQL Database Schema Conversion

## Schema Mapping

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Create tables with proper types and constraints
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  summary TEXT,
  photo TEXT, -- Store file path or URL
  photos TEXT[], -- Array of file paths or URLs
  title TEXT UNIQUE
);

CREATE TABLE personnel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bio TEXT,
  role TEXT,
  photo TEXT[],
  rank INTEGER,
  credibility INTEGER,
  popularity INTEGER,
  name TEXT UNIQUE,
  authority INTEGER
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  description TEXT,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  date TIMESTAMP,
  photos TEXT[],
  metadata JSONB DEFAULT '{}',
  title TEXT UNIQUE,
  summary TEXT,
  category TEXT[]
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  specialization TEXT,
  description TEXT,
  photo TEXT,
  image TEXT,
  title TEXT UNIQUE
);

CREATE TABLE sightings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP,
  description TEXT,
  media_link TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  shape TEXT,
  duration_seconds TEXT,
  duration_hours_min TEXT,
  comments TEXT,
  date_posted TIMESTAMP,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  name TEXT,
  photo TEXT,
  profile_image_url TEXT,
  external_id TEXT
);

CREATE TABLE user_theories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT,
  content TEXT,
  synopsis TEXT,
  diagrams TEXT[]
);

-- Junction tables for many-to-many relationships
CREATE TABLE event_subject_matter_experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  subject_matter_expert_id UUID REFERENCES personnel(id)
);

CREATE TABLE topic_subject_matter_experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id),
  subject_matter_expert_id UUID REFERENCES personnel(id)
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES personnel(id),
  organization_id UUID REFERENCES organizations(id)
);

CREATE TABLE testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim TEXT,
  event_id UUID REFERENCES events(id),
  summary TEXT,
  witness_id UUID REFERENCES personnel(id),
  documentation TEXT[],
  date TIMESTAMP,
  organization_id UUID REFERENCES organizations(id),
  source TEXT,
  media TEXT[],
  context TEXT
);

CREATE TABLE topics_testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id),
  testimony_id UUID REFERENCES testimonies(id)
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file TEXT[],
  summary TEXT,
  embedding vector(1536),
  title TEXT,
  date TIMESTAMP,
  author_id UUID REFERENCES personnel(id),
  organization_id UUID REFERENCES organizations(id),
  url TEXT,
  metadata JSONB,
  images TEXT[]
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  coordinates TEXT,
  google_maps_location_id TEXT,
  city TEXT,
  state TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
);

CREATE TABLE event_topic_subject_matter_experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  topic_id UUID REFERENCES topics(id),
  subject_matter_expert_id UUID REFERENCES personnel(id)
);

-- User saved items tables
CREATE TABLE user_saved_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  theory_id UUID REFERENCES user_theories(id),
  note TEXT,
  note_title TEXT
);

CREATE TABLE user_saved_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  topic_id UUID REFERENCES topics(id),
  theory_id UUID REFERENCES user_theories(id),
  note TEXT,
  note_title TEXT
);

CREATE TABLE user_saved_key_figure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  key_figure_id UUID REFERENCES personnel(id),
  theory_id UUID REFERENCES user_theories(id),
  note TEXT,
  note_title TEXT
);

CREATE TABLE user_saved_testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  testimony_id UUID REFERENCES testimonies(id),
  theory_id UUID REFERENCES user_theories(id),
  note TEXT,
  note_title TEXT
);

CREATE TABLE user_saved_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  document_id UUID REFERENCES documents(id),
  theory_id UUID REFERENCES user_theories(id),
  note TEXT,
  note_title TEXT
);

CREATE TABLE user_saved_organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id),
  theory_id UUID REFERENCES user_theories(id),
  note TEXT,
  note_title TEXT
);

CREATE TABLE user_saved_sightings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  sighting_id UUID REFERENCES sightings(id),
  theory_id UUID REFERENCES user_theories(id),
  note TEXT,
  note_title TEXT
);

CREATE TABLE mindmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  json JSONB DEFAULT '{}',
  embedding vector(1536),
  user_id UUID REFERENCES users(id),
  file TEXT
);

CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE,
  description TEXT,
  photos TEXT[],
  date TEXT,
  source TEXT,
  origin TEXT,
  images TEXT[]
);

CREATE TABLE case_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  -- Add fields as needed based on requirements
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  -- Add fields as needed based on requirements
);

CREATE TABLE theories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  -- Add fields as needed based on requirements
);

-- Create indexes for performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_sightings_date ON sightings(date);
CREATE INDEX idx_testimonies_date ON testimonies(date);
CREATE INDEX idx_documents_date ON documents(date);
CREATE INDEX idx_personnel_name ON personnel(name);
CREATE INDEX idx_topics_title ON topics(title);
CREATE INDEX idx_organizations_title ON organizations(title);
```

## Conversion Plan

### 1. Set up PostgreSQL Environment

- Install PostgreSQL 14+ for vector support
- Install pgvector extension for embedding vectors
- Create a new database

### 2. Create Schema Conversion Script

- Transform schema.json into a SQL script like above
- Standardize naming (use snake_case for PostgreSQL)
- Map column types appropriately
- Add primary keys (UUID)
- Define foreign key relationships

### 3. Handle Special Types

- For vector fields: Install pgvector `CREATE EXTENSION pgvector;`
- For JSON: Use JSONB for better performance
- File fields: Store as TEXT paths/URLs
- Array fields: Use PostgreSQL array types

### 4. Data Migration Plan

- Create a data import order respecting foreign key constraints:
  1. Independent tables first (users, personnel, topics, events, organizations, etc.)
  2. Junction tables after their dependencies
  3. User-saved items last

### 5. Create Indexes

- Add indexes on frequently queried columns
- Add indexes on foreign keys
- Consider composite indexes for common query patterns

### 6. Implement Data Access Layer

- Create TypeScript interfaces matching the schema
- Set up a database connector (e.g., Prisma, Drizzle, or raw pg)
- Implement repository pattern for data access

### 7. Deploy and Test

- Run migration scripts in staging environment
- Verify data integrity and relationships
- Load test with representative data volume

### 8. Implementation Notes

- Replace hyphens with underscores in column/table names
- Convert camelCase to snake_case for PostgreSQL consistency
- Use proper constraints (NOT NULL, UNIQUE)
- Consider adding created_at/updated_at timestamps to all tables

## Type Mapping Reference

| Original Type | PostgreSQL Type |
|---------------|----------------|
| string        | TEXT           |
| text          | TEXT           |
| int           | INTEGER        |
| float         | DOUBLE PRECISION |
| datetime      | TIMESTAMP      |
| file          | TEXT           |
| file[]        | TEXT[]         |
| json          | JSONB          |
| vector        | vector(1536)   |
| link          | UUID + Foreign Key |
| email         | TEXT + UNIQUE  |
| multiple      | TEXT[]         |

## Node.js Integration Example

```typescript
// Example TypeScript interface for personnel table
interface Personnel {
  id: string;
  bio: string | null;
  role: string | null;
  photo: string[] | null;
  rank: number | null;
  credibility: number | null;
  popularity: number | null;
  name: string;
  authority: number | null;
}

// Example database query using node-postgres
const getPersonnelById = async (id: string): Promise<Personnel | null> => {
  const query = {
    text: 'SELECT * FROM personnel WHERE id = $1',
    values: [id],
  };
  
  try {
    const result = await pool.query(query);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return null;
  }
};
```
