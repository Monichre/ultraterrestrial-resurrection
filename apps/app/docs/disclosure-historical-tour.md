
# Database Schema

## topics
- **Columns:**
  - name (string)
  - summary (text)
  - photo (file, defaultPublicAccess: true)
  - photos (file[], defaultPublicAccess: true)
  - title (string, unique)
  - embedding (vector, dimension: 1536)
- **Referenced by:**
  - topic-subject-matter-experts (topic)
  - topics-testimonies (topic)
  - event-topic-subject-matter-experts (topic)
  - user-saved-topics (topic)

## personnel
- **Columns:**
  - bio (text)
  - role (string)
  - photo (file[])
  - rank (int)
  - credibility (int)
  - popularity (int)
  - name (string, unique)
  - authority (int)
  - embedding (vector, dimension: 1536)
- **Referenced by:**
  - organization-members (member)
  - event-subject-matter-experts (subject-matter-expert)
  - topic-subject-matter-experts (subject-matter-expert)
  - testimonies (witness)
  - event-topic-subject-matter-experts (subject-matter-expert)
  - user-saved-key-figure (key-figure)
  - documents (author)

## events
- **Columns:**
  - name (text)
  - description (text)
  - location (string)
  - latitude (float)
  - longitude (float)
  - date (datetime)
  - photos (file[])
  - metadata (json, defaultValue: "{}")
  - title (string, unique)
  - summary (text)
  - category (multiple)
  - embedding (vector, dimension: 1536)
- **Referenced by:**
  - event-subject-matter-experts (event)
  - testimonies (event)
  - event-topic-subject-matter-experts (event)
  - user-saved-events (event)

## organizations
- **Columns:**
  - name (string)
  - specialization (string)
  - description (text)
  - photo (text)
  - image (file, defaultPublicAccess: true)
  - title (string, unique)
  - embedding (vector, dimension: 500)
- **Referenced by:**
  - organization-members (organization)
  - testimonies (organization)
  - user-saved-organizations (organization)
  - documents (organization)

## sightings
- **Columns:**
  - date (datetime)
  - description (string)
  - media_link (string)
  - city (string)
  - state (string)
  - country (string)
  - shape (string)
  - duration_seconds (string)
  - duration_hours_min (string)
  - comments (string)
  - date_posted (datetime)
  - latitude (float)
  - longitude (float)
  - media (file[], defaultPublicAccess: true)
- **Referenced by:**
  - user-saved-sightings (sighting)

## event-subject-matter-experts
- **Columns:**
  - event (link to events)
  - subject-matter-expert (link to personnel)

## topic-subject-matter-experts
- **Columns:**
  - topic (link to topics)
  - subject-matter-expert (link to personnel)

## organization-members
- **Columns:**
  - member (link to personnel)
  - organization (link to organizations)

## testimonies
- **Columns:**
  - claim (text)
  - event (link to events)
  - summary (text)
  - witness (link to personnel)
  - documentation (file[])
  - date (datetime)
  - organization (link to organizations)
  - source (text)
  - media (file[], defaultPublicAccess: true)
  - context (text)
  - embedding (vector, dimension: 1536)
- **Referenced by:**
  - topics-testimonies (testimony)
  - user-saved-testimonies (testimony)

## topics-testimonies
- **Columns:**
  - topic (link to topics)
  - testimony (link to testimonies)

## documents
- **Columns:**
  - file (file[])
  - summary (text)
  - embedding (vector, dimension: 1536)
  - title (string)
  - date (datetime)
  - author (link to personnel)
  - organization (link to organizations)
  - url (text)
  - metadata (json)
  - images (file[], defaultPublicAccess: true)
  - processed (bool, defaultValue: "false")
- **Referenced by:**
  - user-saved-documents (document)
  - summary-files (document)

## locations
- **Columns:**
  - name (string)
  - coordinates (string)
  - google-maps-location-id (text)
  - city (string)
  - state (string)
  - latitude (float)
  - longitude (float)

## event-topic-subject-matter-experts
- **Columns:**
  - event (link to events)
  - topic (link to topics)
  - subject-matter-expert (link to personnel)

## users
- **Columns:**
  - email (email, unique)
  - name (string)
  - photo (file, defaultPublicAccess: true)
  - profile_image_url (string)
  - external_id (string)
- **Referenced by:**
  - user-saved-events (user)
  - user-saved-topics (user)
  - user-saved-key-figure (user)
  - user-saved-testimonies (user)
  - user-saved-documents (user)
  - user-notes (user)
  - user-saved-organizations (user)
  - user-saved-sightings (user)
  - mindmaps (user)

## user-saved-events
- **Columns:**
  - user (link to users)
  - event (link to events)
  - theory (link to user-notes)
  - note (text)
  - note-title (string)

## user-saved-topics
- **Columns:**
  - user (link to users)
  - topic (link to topics)
  - theory (link to user-notes)
  - note (text)
  - note-title (string)

## user-saved-key-figure
- **Columns:**
  - user (link to users)
  - key-figure (link to personnel)
  - theory (link to user-notes)
  - note (text)
  - note-title (string)

## user-saved-testimonies
- **Columns:**
  - user (link to users)
  - testimony (link to testimonies)
  - theory (link to user-notes)
  - note (text)
  - note-title (string)

## user-saved-documents
- **Columns:**
  - user (link to users)
  - document (link to documents)
  - theory (link to user-notes)
  - note (text)
  - note-title (string)

## user-notes
- **Columns:**
  - user (link to users)
  - name (string)
  - content (text)
  - synopsis (text)
  - diagrams (file[], defaultPublicAccess: true)
- **Referenced by:**
  - user-saved-sightings (theory)
  - user-saved-testimonies (theory)
  - user-saved-topics (theory)
  - user-saved-key-figure (theory)
  - user-saved-organizations (theory)
  - user-saved-events (theory)
  - user-saved-documents (theory)

## user-saved-organizations
- **Columns:**
  - user (link to users)
  - organization (link to organizations)
  - theory (link to user-notes)
  - note (text)
  - note-title (string)

## user-saved-sightings
- **Columns:**
  - user (link to users)
  - sighting (link to sightings)
  - theory (link to user-notes)
  - note (text)
  - note-title (string)

## tags
- **Columns:** (none)

## theories
- **Columns:** (none)

## mindmaps
- **Columns:**
  - json (json, defaultValue: "{}")
  - embedding (vector, dimension: 1536)
  - user (link to users)
  - file (file, defaultPublicAccess: true)

## artifacts
- **Columns:**
  - name (string, unique)
  - description (text)
  - photos (multiple)
  - date (string)
  - source (text)
  - origin (text)
  - images (file[], defaultPublicAccess: true)
  - embedding (vector, dimension: 1536)

## key-figures
- **Columns:**
  - name (text)
  - bio (text)
  - photo (text)
  - role (text)
  - rank (int)
  - credibility (int)
  - popularity (int)
  - authority (int)
  - embedding (text)
  - xataversion (int)

## summary-files
- **Columns:**
  - name (text)
  - file (file)
  - source (text)
  - metadata (json)
  - images (file)
  - content (text)
  - embedding (multiple, dimension: 0)
  - document (link to documents, unique)




### Schema File

```json{
  "tables": [
    {
      "name": "topics",
      "columns": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "summary",
          "type": "text"
        },
        {
          "name": "photo",
          "type": "file",
          "file": {
            "defaultPublicAccess": true
          }
        },
        {
          "name": "photos",
          "type": "file[]",
          "file[]": {
            "defaultPublicAccess": true
          }
        },
        {
          "name": "title",
          "type": "string",
          "unique": true
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 1536
          }
        }
      ],
      "revLinks": [
        {
          "column": "topic",
          "table": "topic-subject-matter-experts"
        },
        {
          "column": "topic",
          "table": "topics-testimonies"
        },
        {
          "column": "topic",
          "table": "event-topic-subject-matter-experts"
        },
        {
          "column": "topic",
          "table": "user-saved-topics"
        }
      ]
    },
    {
      "name": "personnel",
      "columns": [
        {
          "name": "bio",
          "type": "text"
        },
        {
          "name": "role",
          "type": "string"
        },
        {
          "name": "photo",
          "type": "file[]"
        },
        {
          "name": "rank",
          "type": "int"
        },
        {
          "name": "credibility",
          "type": "int"
        },
        {
          "name": "popularity",
          "type": "int"
        },
        {
          "name": "name",
          "type": "string",
          "unique": true
        },
        {
          "name": "authority",
          "type": "int"
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 1536
          }
        }
      ],
      "revLinks": [
        {
          "column": "member",
          "table": "organization-members"
        },
        {
          "column": "subject-matter-expert",
          "table": "event-subject-matter-experts"
        },
        {
          "column": "subject-matter-expert",
          "table": "topic-subject-matter-experts"
        },
        {
          "column": "witness",
          "table": "testimonies"
        },
        {
          "column": "subject-matter-expert",
          "table": "event-topic-subject-matter-experts"
        },
        {
          "column": "key-figure",
          "table": "user-saved-key-figure"
        },
        {
          "column": "author",
          "table": "documents"
        }
      ]
    },
    {
      "name": "events",
      "columns": [
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "latitude",
          "type": "float"
        },
        {
          "name": "longitude",
          "type": "float"
        },
        {
          "name": "date",
          "type": "datetime"
        },
        {
          "name": "photos",
          "type": "file[]"
        },
        {
          "name": "metadata",
          "type": "json",
          "defaultValue": "{}"
        },
        {
          "name": "title",
          "type": "string",
          "unique": true
        },
        {
          "name": "summary",
          "type": "text"
        },
        {
          "name": "category",
          "type": "multiple"
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 1536
          }
        }
      ],
      "revLinks": [
        {
          "column": "event",
          "table": "event-subject-matter-experts"
        },
        {
          "column": "event",
          "table": "testimonies"
        },
        {
          "column": "event",
          "table": "event-topic-subject-matter-experts"
        },
        {
          "column": "event",
          "table": "user-saved-events"
        }
      ]
    },
    {
      "name": "organizations",
      "columns": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "specialization",
          "type": "string"
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "photo",
          "type": "text"
        },
        {
          "name": "image",
          "type": "file",
          "file": {
            "defaultPublicAccess": true
          }
        },
        {
          "name": "title",
          "type": "string",
          "unique": true
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 500
          }
        }
      ],
      "revLinks": [
        {
          "column": "organization",
          "table": "organization-members"
        },
        {
          "column": "organization",
          "table": "testimonies"
        },
        {
          "column": "organization",
          "table": "user-saved-organizations"
        },
        {
          "column": "organization",
          "table": "documents"
        }
      ]
    },
    {
      "name": "sightings",
      "columns": [
        {
          "name": "date",
          "type": "datetime"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "media_link",
          "type": "string"
        },
        {
          "name": "city",
          "type": "string"
        },
        {
          "name": "state",
          "type": "string"
        },
        {
          "name": "country",
          "type": "string"
        },
        {
          "name": "shape",
          "type": "string"
        },
        {
          "name": "duration_seconds",
          "type": "string"
        },
        {
          "name": "duration_hours_min",
          "type": "string"
        },
        {
          "name": "comments",
          "type": "string"
        },
        {
          "name": "date_posted",
          "type": "datetime"
        },
        {
          "name": "latitude",
          "type": "float"
        },
        {
          "name": "longitude",
          "type": "float"
        },
        {
          "name": "media",
          "type": "file[]",
          "file[]": {
            "defaultPublicAccess": true
          }
        }
      ],
      "revLinks": [
        {
          "column": "sighting",
          "table": "user-saved-sightings"
        }
      ]
    },
    {
      "name": "event-subject-matter-experts",
      "columns": [
        {
          "name": "event",
          "type": "link",
          "link": {
            "table": "events"
          }
        },
        {
          "name": "subject-matter-expert",
          "type": "link",
          "link": {
            "table": "personnel"
          }
        }
      ]
    },
    {
      "name": "topic-subject-matter-experts",
      "columns": [
        {
          "name": "topic",
          "type": "link",
          "link": {
            "table": "topics"
          }
        },
        {
          "name": "subject-matter-expert",
          "type": "link",
          "link": {
            "table": "personnel"
          }
        }
      ]
    },
    {
      "name": "organization-members",
      "columns": [
        {
          "name": "member",
          "type": "link",
          "link": {
            "table": "personnel"
          }
        },
        {
          "name": "organization",
          "type": "link",
          "link": {
            "table": "organizations"
          }
        }
      ]
    },
    {
      "name": "testimonies",
      "columns": [
        {
          "name": "claim",
          "type": "text"
        },
        {
          "name": "event",
          "type": "link",
          "link": {
            "table": "events"
          }
        },
        {
          "name": "summary",
          "type": "text"
        },
        {
          "name": "witness",
          "type": "link",
          "link": {
            "table": "personnel"
          }
        },
        {
          "name": "documentation",
          "type": "file[]"
        },
        {
          "name": "date",
          "type": "datetime"
        },
        {
          "name": "organization",
          "type": "link",
          "link": {
            "table": "organizations"
          }
        },
        {
          "name": "source",
          "type": "text"
        },
        {
          "name": "media",
          "type": "file[]",
          "file[]": {
            "defaultPublicAccess": true
          }
        },
        {
          "name": "context",
          "type": "text"
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 1536
          }
        }
      ],
      "revLinks": [
        {
          "column": "testimony",
          "table": "topics-testimonies"
        },
        {
          "column": "testimony",
          "table": "user-saved-testimonies"
        }
      ]
    },
    {
      "name": "topics-testimonies",
      "columns": [
        {
          "name": "topic",
          "type": "link",
          "link": {
            "table": "topics"
          }
        },
        {
          "name": "testimony",
          "type": "link",
          "link": {
            "table": "testimonies"
          }
        }
      ]
    },
    {
      "name": "documents",
      "columns": [
        {
          "name": "file",
          "type": "file[]"
        },
        {
          "name": "summary",
          "type": "text"
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 1536
          }
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "date",
          "type": "datetime"
        },
        {
          "name": "author",
          "type": "link",
          "link": {
            "table": "personnel"
          }
        },
        {
          "name": "organization",
          "type": "link",
          "link": {
            "table": "organizations"
          }
        },
        {
          "name": "url",
          "type": "text"
        },
        {
          "name": "metadata",
          "type": "json"
        },
        {
          "name": "images",
          "type": "file[]",
          "file[]": {
            "defaultPublicAccess": true
          }
        },
        {
          "name": "processed",
          "type": "bool",
          "defaultValue": "false"
        }
      ],
      "revLinks": [
        {
          "column": "document",
          "table": "user-saved-documents"
        },
        {
          "column": "document",
          "table": "summary-files"
        }
      ]
    },
    {
      "name": "locations",
      "columns": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "coordinates",
          "type": "string"
        },
        {
          "name": "google-maps-location-id",
          "type": "text"
        },
        {
          "name": "city",
          "type": "string"
        },
        {
          "name": "state",
          "type": "string"
        },
        {
          "name": "latitude",
          "type": "float"
        },
        {
          "name": "longitude",
          "type": "float"
        }
      ]
    },
    {
      "name": "event-topic-subject-matter-experts",
      "columns": [
        {
          "name": "event",
          "type": "link",
          "link": {
            "table": "events"
          }
        },
        {
          "name": "topic",
          "type": "link",
          "link": {
            "table": "topics"
          }
        },
        {
          "name": "subject-matter-expert",
          "type": "link",
          "link": {
            "table": "personnel"
          }
        }
      ]
    },
    {
      "name": "users",
      "columns": [
        {
          "name": "email",
          "type": "email",
          "unique": true
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "photo",
          "type": "file",
          "file": {
            "defaultPublicAccess": true
          }
        },
        {
          "name": "profile_image_url",
          "type": "string"
        },
        {
          "name": "external_id",
          "type": "string"
        }
      ],
      "revLinks": [
        {
          "column": "user",
          "table": "user-saved-events"
        },
        {
          "column": "user",
          "table": "user-saved-topics"
        },
        {
          "column": "user",
          "table": "user-saved-key-figure"
        },
        {
          "column": "user",
          "table": "user-saved-testimonies"
        },
        {
          "column": "user",
          "table": "user-saved-documents"
        },
        {
          "column": "user",
          "table": "user-notes"
        },
        {
          "column": "user",
          "table": "user-saved-organizations"
        },
        {
          "column": "user",
          "table": "user-saved-sightings"
        },
        {
          "column": "user",
          "table": "mindmaps"
        }
      ]
    },
    {
      "name": "user-saved-events",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "event",
          "type": "link",
          "link": {
            "table": "events"
          }
        },
        {
          "name": "theory",
          "type": "link",
          "link": {
            "table": "user-notes"
          }
        },
        {
          "name": "note",
          "type": "text"
        },
        {
          "name": "note-title",
          "type": "string"
        }
      ]
    },
    {
      "name": "user-saved-topics",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "topic",
          "type": "link",
          "link": {
            "table": "topics"
          }
        },
        {
          "name": "theory",
          "type": "link",
          "link": {
            "table": "user-notes"
          }
        },
        {
          "name": "note",
          "type": "text"
        },
        {
          "name": "note-title",
          "type": "string"
        }
      ]
    },
    {
      "name": "user-saved-key-figure",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "key-figure",
          "type": "link",
          "link": {
            "table": "personnel"
          }
        },
        {
          "name": "theory",
          "type": "link",
          "link": {
            "table": "user-notes"
          }
        },
        {
          "name": "note",
          "type": "text"
        },
        {
          "name": "note-title",
          "type": "string"
        }
      ]
    },
    {
      "name": "user-saved-testimonies",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "testimony",
          "type": "link",
          "link": {
            "table": "testimonies"
          }
        },
        {
          "name": "theory",
          "type": "link",
          "link": {
            "table": "user-notes"
          }
        },
        {
          "name": "note",
          "type": "text"
        },
        {
          "name": "note-title",
          "type": "string"
        }
      ]
    },
    {
      "name": "user-saved-documents",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "document",
          "type": "link",
          "link": {
            "table": "documents"
          }
        },
        {
          "name": "theory",
          "type": "link",
          "link": {
            "table": "user-notes"
          }
        },
        {
          "name": "note",
          "type": "text"
        },
        {
          "name": "note-title",
          "type": "string"
        }
      ]
    },
    {
      "name": "user-notes",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "synopsis",
          "type": "text"
        },
        {
          "name": "diagrams",
          "type": "file[]",
          "file[]": {
            "defaultPublicAccess": true
          }
        }
      ],
      "revLinks": [
        {
          "column": "theory",
          "table": "user-saved-sightings"
        },
        {
          "column": "theory",
          "table": "user-saved-testimonies"
        },
        {
          "column": "theory",
          "table": "user-saved-topics"
        },
        {
          "column": "theory",
          "table": "user-saved-key-figure"
        },
        {
          "column": "theory",
          "table": "user-saved-organizations"
        },
        {
          "column": "theory",
          "table": "user-saved-events"
        },
        {
          "column": "theory",
          "table": "user-saved-documents"
        }
      ]
    },
    {
      "name": "user-saved-organizations",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "organization",
          "type": "link",
          "link": {
            "table": "organizations"
          }
        },
        {
          "name": "theory",
          "type": "link",
          "link": {
            "table": "user-notes"
          }
        },
        {
          "name": "note",
          "type": "text"
        },
        {
          "name": "note-title",
          "type": "string"
        }
      ]
    },
    {
      "name": "user-saved-sightings",
      "columns": [
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "sighting",
          "type": "link",
          "link": {
            "table": "sightings"
          }
        },
        {
          "name": "theory",
          "type": "link",
          "link": {
            "table": "user-notes"
          }
        },
        {
          "name": "note",
          "type": "text"
        },
        {
          "name": "note-title",
          "type": "string"
        }
      ]
    },
    {
      "name": "tags",
      "columns": []
    },
    {
      "name": "theories",
      "columns": []
    },
    {
      "name": "mindmaps",
      "columns": [
        {
          "name": "json",
          "type": "json",
          "defaultValue": "{}"
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 1536
          }
        },
        {
          "name": "user",
          "type": "link",
          "link": {
            "table": "users"
          }
        },
        {
          "name": "file",
          "type": "file",
          "file": {
            "defaultPublicAccess": true
          }
        }
      ]
    },
    {
      "name": "artifacts",
      "columns": [
        {
          "name": "name",
          "type": "string",
          "unique": true
        },
        {
          "name": "description",
          "type": "text"
        },
        {
          "name": "photos",
          "type": "multiple"
        },
        {
          "name": "date",
          "type": "string"
        },
        {
          "name": "source",
          "type": "text"
        },
        {
          "name": "origin",
          "type": "text"
        },
        {
          "name": "images",
          "type": "file[]",
          "file[]": {
            "defaultPublicAccess": true
          }
        },
        {
          "name": "embedding",
          "type": "vector",
          "vector": {
            "dimension": 1536
          }
        }
      ]
    },
    {
      "name": "key-figures",
      "columns": [
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "bio",
          "type": "text"
        },
        {
          "name": "photo",
          "type": "text"
        },
        {
          "name": "role",
          "type": "text"
        },
        {
          "name": "rank",
          "type": "int"
        },
        {
          "name": "credibility",
          "type": "int"
        },
        {
          "name": "popularity",
          "type": "int"
        },
        {
          "name": "authority",
          "type": "int"
        },
        {
          "name": "embedding",
          "type": "text"
        },
        {
          "name": "xataversion",
          "type": "int"
        }
      ]
    },
    {
      "name": "summary-files",
      "columns": [
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "file",
          "type": "file"
        },
        {
          "name": "source",
          "type": "text"
        },
        {
          "name": "metadata",
          "type": "json"
        },
        {
          "name": "images",
          "type": "file"
        },
        {
          "name": "content",
          "type": "text"
        },
        {
          "name": "embedding",
          "type": "multiple",
          "vector": {
            "dimension": 0
          }
        },
        {
          "name": "document",
          "type": "link",
          "link": {
            "table": "documents"
          },
          "unique": true
        }
      ]
    }
  ]
}
```
