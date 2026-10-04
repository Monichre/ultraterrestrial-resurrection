# Xata CLI Commands Usage Guide

**Version**: 1.0.0
**Last Updated**: September 19, 2025
**Package**: @db - Database abstraction layer for Ultraterrestrial Resurrection

---

## 🚀 **Quick Start**

The Xata CLI provides a comprehensive command-line interface for database operations. All commands use JSON input for structured requests and return JSON responses.

### **Prerequisites**

```bash
# Ensure environment variables are set
export XATA_API_KEY="your-api-key"
export XATA_BRANCH="main"

# Navigate to the db package
cd packages/db
```

### **Available Commands**

```bash
# Run smoke tests (recommended first step)
bun run smoke-test

# Interactive demo
bun run cmd:demo

# Direct CLI commands
bun run cmd:create '{"operation":"create","table":"topics","data":{...}}'
bun run cmd:read '{"operation":"read","table":"topics","id":"record-id"}'
bun run cmd:update '{"operation":"update","table":"topics","id":"record-id","data":{...}}'
bun run cmd:delete '{"operation":"delete","table":"topics","id":"record-id"}'
```

---

## 📊 **Command Reference**

### **Create Operations**

#### **Create a Topic**
```bash
bun run cmd:create '{
  "operation": "create",
  "table": "topics",
  "data": {
    "title": "UFO Research Methods",
    "name": "ufo-research-methods",
    "summary": "Comprehensive overview of scientific UFO investigation techniques"
  }
}'
```

#### **Create an Event**
```bash
bun run cmd:create '{
  "operation": "create",
  "table": "events",
  "data": {
    "title": "Phoenix Lights Sighting",
    "name": "Phoenix Lights 1997",
    "description": "Mass sighting of unidentified aerial phenomena over Phoenix, Arizona",
    "date": "1997-03-13T00:00:00.000Z",
    "location": "Phoenix, Arizona, USA",
    "latitude": 33.4484,
    "longitude": -112.0740,
    "summary": "Over 300 witnesses reported seeing a series of lights",
    "category": ["mass-sighting", "lights"]
  }
}'
```

#### **Create Personnel**
```bash
bun run cmd:create '{
  "operation": "create",
  "table": "personnel",
  "data": {
    "name": "Dr. John Smith",
    "role": "Research Scientist",
    "bio": "PhD in Aerospace Engineering with 20+ years experience in unidentified aerial phenomena research",
    "credibility": 9,
    "authority": 8,
    "rank": 5,
    "popularity": 7
  }
}'
```

### **Read Operations**

#### **Read Single Record**
```bash
bun run cmd:read '{
  "operation": "read",
  "table": "topics",
  "id": "rec_abc123..."
}'
```

#### **Read with Filters**
```bash
bun run cmd:read '{
  "operation": "read",
  "table": "events",
  "filter": {
    "category": { "$contains": "mass-sighting" }
  },
  "options": {
    "limit": 10
  }
}'
```

#### **Read with Column Selection**
```bash
bun run cmd:read '{
  "operation": "read",
  "table": "personnel",
  "filter": { "credibility": { "$gte": 8 } },
  "options": {
    "columns": ["name", "role", "credibility"],
    "limit": 5
  }
}'
```

### **Update Operations**

#### **Update Single Record**
```bash
bun run cmd:update '{
  "operation": "update",
  "table": "topics",
  "id": "rec_abc123...",
  "data": {
    "summary": "Updated summary with additional research findings"
  }
}'
```

#### **Bulk Update with Filter**
```bash
bun run cmd:update '{
  "operation": "update",
  "table": "events",
  "filter": {
    "date": { "$lt": "2000-01-01T00:00:00.000Z" }
  },
  "data": {
    "category": ["historical", "pre-2000"]
  }
}'
```

### **Delete Operations**

#### **Delete Single Record**
```bash
bun run cmd:delete '{
  "operation": "delete",
  "table": "topics",
  "id": "rec_abc123..."
}'
```

#### **Delete with Filter**
```bash
bun run cmd:delete '{
  "operation": "delete",
  "table": "events",
  "filter": {
    "category": { "$contains": "test" }
  }
}'
```

### **Search Operations**

#### **Text Search**
```bash
bun run cmd:read '{
  "operation": "search",
  "table": "topics",
  "options": {
    "searchQuery": "UFO disclosure"
  }
}'
```

#### **Vector Search** (for tables with embeddings)
```bash
bun run cmd:read '{
  "operation": "search",
  "table": "topics",
  "options": {
    "vectorSearch": {
      "embedding": [0.1, 0.2, 0.3, ...],  // 1536-dimensional vector
      "maxResults": 10
    }
  }
}'
```

### **Bulk Operations**

#### **Bulk Create**
```bash
bun run cmd:create '{
  "operation": "bulk",
  "table": "topics",
  "data": [
    {
      "title": "Topic 1",
      "name": "topic-1",
      "summary": "Summary 1"
    },
    {
      "title": "Topic 2",
      "name": "topic-2",
      "summary": "Summary 2"
    }
  ]
}'
```

---

## 📋 **Available Tables & Schemas**

### **Core Tables**

| Table | Required Fields | Optional Fields |
|-------|----------------|-----------------|
| `topics` | `title`, `name`, `summary` | `photo`, `photos`, `embedding` |
| `events` | `title`, `name`, `description`, `date`, `location`, `summary` | `latitude`, `longitude`, `photos`, `metadata`, `category`, `embedding` |
| `personnel` | `name`, `role`, `bio` | `photo`, `rank`, `credibility`, `popularity`, `authority`, `embedding` |
| `organizations` | `title`, `name` | `specialization`, `description`, `photo`, `image`, `embedding` |
| `testimonies` | `claim` | `event`, `summary`, `witness`, `documentation`, `date`, `organization`, `source`, `media`, `context`, `embedding` |
| `documents` | `title` | `file`, `summary`, `embedding`, `date`, `author`, `organization`, `url`, `metadata`, `images`, `processed` |
| `locations` | `name` | `coordinates`, `google-maps-location-id`, `city`, `state`, `latitude`, `longitude` |
| `sightings` | `date`, `description` | `media_link`, `city`, `state`, `country`, `shape`, `duration_seconds`, `duration_hours_min`, `comments`, `date_posted`, `latitude`, `longitude`, `media` |
| `users` | `email` | `name`, `photo`, `profile_image_url`, `external_id` |
| `user-notes` | `name`, `user` | `content`, `synopsis`, `diagrams` |
| `mindmaps` | `user` | `json`, `embedding`, `file` |
| `artifacts` | `name` | `description`, `photos`, `date`, `source`, `origin`, `images`, `embedding` |

### **Relationship Tables**

| Table | Purpose |
|-------|---------|
| `event-subject-matter-experts` | Links events to personnel experts |
| `topic-subject-matter-experts` | Links topics to personnel experts |
| `organization-members` | Links organizations to personnel members |
| `topics-testimonies` | Links topics to testimonies |
| `event-topic-subject-matter-experts` | Complex relationship table |
| `user-saved-*` | User bookmark tables for various entities |
| `summary-files` | Links summaries to documents |

---

## 🔍 **Advanced Query Examples**

### **Complex Filters**

```bash
# Events with high credibility witnesses
bun run cmd:read '{
  "operation": "read",
  "table": "events",
  "filter": {
    "$and": [
      { "date": { "$gte": "2000-01-01T00:00:00.000Z" } },
      { "latitude": { "$exists": true } },
      { "longitude": { "$exists": true } }
    ]
  },
  "options": {
    "columns": ["title", "date", "location", "latitude", "longitude"],
    "limit": 20
  }
}'
```

### **Geospatial Queries**

```bash
# Events within radius (note: requires post-processing)
bun run cmd:read '{
  "operation": "read",
  "table": "events",
  "filter": {
    "latitude": { "$gte": 30, "$lte": 40 },
    "longitude": { "$gte": -120, "$lte": -110 }
  }
}'
```

### **Relationship Queries**

```bash
# Get events with their experts
bun run cmd:read '{
  "operation": "read",
  "table": "events",
  "options": {
    "columns": ["*", "event-subject-matter-experts.*", "event-subject-matter-experts.subject-matter-expert.*"]
  }
}'
```

---

## 🧪 **Testing & Validation**

### **Run Smoke Tests**

```bash
# Comprehensive test suite
bun run smoke-test

# Expected output: 95%+ success rate
# Tests create, read, update, delete operations
# Validates error handling and edge cases
```

### **Manual Testing Examples**

```bash
# Test connection
bun run cmd:read '{"operation":"read","table":"topics","options":{"limit":1}}'

# Test error handling
bun run cmd:read '{"operation":"read","table":"nonexistent","id":"fake-id"}'

# Test data validation
bun run cmd:create '{"operation":"create","table":"topics"}'
```

---

## 🚨 **Error Handling**

### **Common Error Responses**

```json
{
  "success": false,
  "error": "Unknown table: invalid_table",
  "metadata": {
    "operation": "read",
    "table": "invalid_table",
    "executionTime": 5
  }
}
```

```json
{
  "success": false,
  "error": "Data is required for create operation",
  "metadata": {
    "operation": "create",
    "table": "topics",
    "executionTime": 2
  }
}
```

```json
{
  "success": false,
  "error": "Record not found: invalid-id-12345",
  "metadata": {
    "operation": "read",
    "table": "topics",
    "executionTime": 45
  }
}
```

### **Schema Validation Errors**

```json
{
  "success": false,
  "error": "Unexpected error: invalid record: column [invalid_column]: column not found",
  "metadata": {
    "operation": "create",
    "table": "topics",
    "executionTime": 120
  }
}
```

---

## ⚡ **Performance Tips**

### **Use Column Selection**
```bash
# Only fetch needed columns
bun run cmd:read '{
  "operation": "read",
  "table": "events",
  "options": {
    "columns": ["id", "title", "date"],
    "limit": 100
  }
}'
```

### **Use Filters Effectively**
```bash
# Filter before fetching
bun run cmd:read '{
  "operation": "read",
  "table": "personnel",
  "filter": { "credibility": { "$gte": 8 } },
  "options": { "limit": 50 }
}'
```

### **Batch Operations**
```bash
# Use bulk operations for multiple records
bun run cmd:create '{
  "operation": "bulk",
  "table": "topics",
  "data": [...]  // Array of records
}'
```

---

## 🔧 **Troubleshooting**

### **Environment Issues**

```bash
# Check environment variables
echo $XATA_API_KEY
echo $XATA_BRANCH

# Test basic connectivity
curl -H "Authorization: Bearer $XATA_API_KEY" \
     https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial
```

### **Schema Mismatches**

- Always refer to `XATA_SCHEMA.md` for current table structures
- Use the smoke tests to validate your data formats
- Check for required vs optional fields

### **Rate Limiting**

- Xata has rate limits; use pagination for large datasets
- Implement exponential backoff for retries
- Consider caching for frequently accessed data

---

## 📚 **Additional Resources**

- **[XATA_METHODS.md](./XATA_METHODS.md)** - Complete CRUD operation patterns
- **[XATA_EXAMPLES.md](./XATA_EXAMPLES.md)** - Code examples and integrations
- **[XATA_SCHEMA.md](./XATA_SCHEMA.md)** - Complete database schema reference
- **[XATA_TROUBLESHOOTING.md](./XATA_TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🎯 **Best Practices**

1. **Always validate data** before sending to CLI
2. **Use filters** to limit result sets
3. **Select specific columns** when you don't need all data
4. **Handle errors gracefully** in your applications
5. **Test operations** with the smoke test suite first
6. **Use bulk operations** for multiple record operations
7. **Monitor execution times** for performance optimization

---

*This CLI provides a robust, production-ready interface for all Xata database operations in the Ultraterrestrial Resurrection platform.*