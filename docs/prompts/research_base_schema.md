# UAP Research Knowledge System Schema v2.0

## Core Entity Types

### PERSON

- Labels: [WITNESS, INVESTIGATOR, EXPERT, OFFICIAL, RESEARCHER, CONTACTEE]
- Attributes:
  - id: uuid [primary_key]
  - full_name: string [required, indexed]
  - aliases: string[]
  - role: enum(ROLE_TYPES)
  - credentials: {
    - title: string
    - organization: ref(ORGANIZATION)
    - years_experience: integer
    - specializations: string[]
    - security_clearance: enum(CLEARANCE_LEVELS)
  }
  - metrics: {
    - reliability_score: float(0.0-1.0) [computed]
    - technical_expertise: float(0.0-1.0)
    - research_impact: float(0.0-1.0)
    - public_visibility: float(0.0-1.0)
  }
  - verification_status: enum(VERIFICATION_STATES)
  - biography: text [indexed]
  - contact_info: {
    - email: email [private]
    - phone: string [private]
    - social_media: json [private]
  }

### EVENT

- Labels: [SIGHTING, ENCOUNTER, INCIDENT, LANDING, ABDUCTION, CONTACT]
- Attributes:
  - id: uuid [primary_key]
  - title: string [required, unique, indexed]
  - event_type: enum(EVENT_TYPES) [required]
  - date_time: datetime [required, indexed]
  - duration: interval
  - location: ref(LOCATION) [required]
  - witnesses: ref(PERSON)[]
  - classification: enum(CLOSE_ENCOUNTER_TYPES)
  - environment_conditions: {
    - temperature: float
    - visibility: float(0.0-1.0)
    - cloud_cover: float(0.0-1.0)
    - precipitation: string
    - moon_phase: float(0.0-1.0)
    - light_conditions: enum(LIGHT_CONDITIONS)
  }
  - phenomena: {
    - electromagnetic_effects: boolean
    - physical_traces: boolean
    - biological_effects: boolean
    - psychological_effects: boolean
    - vehicle_interference: boolean
  }
  - verification_status: enum(VERIFICATION_STATES)
  - evidence: ref(ARTIFACT)[]
  - metadata: jsonb [indexed]

### ORGANIZATION

- Labels: [AGENCY, RESEARCH_GROUP, MILITARY, CIVILIAN_ORG]
- Attributes:
  - id: uuid [primary_key]
  - name: string [required, unique, indexed]
  - type: enum(ORGANIZATION_TYPES)
  - jurisdiction: string[]
  - founding_date: date
  - status: enum(STATUS_TYPES)
  - security_level: enum(CLEARANCE_LEVELS)
  - parent_org: ref(ORGANIZATION)
  - subsidiaries: ref(ORGANIZATION)[]
  - key_personnel: ref(PERSON)[]
  - metadata: jsonb [indexed]

### LOCATION

- Labels: [SITE, HOTSPOT, FACILITY, BASE]
- Attributes:
  - id: uuid [primary_key]
  - name: string [indexed]
  - type: enum(LOCATION_TYPES)
  - coordinates: {
    - latitude: decimal(10,8) [required]
    - longitude: decimal(11,8) [required]
    - altitude: float // meters above sea level
    - accuracy: float // meters of uncertainty
  }
  - address: {
    - street: string
    - city: string
    - state: string
    - country: string
    - postal_code: string
  }
  - geohash: string [indexed]
  - activity_metrics: {
    - frequency: float // normalized activity frequency
    - intensity: float // normalized phenomenon intensity
    - pattern_confidence: float(0.0-1.0)
  }
  - security_classification: enum(CLEARANCE_LEVELS)
  - metadata: jsonb [indexed]

### ARTIFACT

- Labels: [PHYSICAL_EVIDENCE, TRACE, DEBRIS, MEDIA]
- Attributes:
  - id: uuid [primary_key]
  - name: string [required, indexed]
  - type: enum(ARTIFACT_TYPES)
  - discovery_date: datetime
  - discovery_location: ref(LOCATION)
  - chain_of_custody: {
    custodian: ref(PERSON)
    timestamp: datetime
    action: enum(CUSTODY_ACTIONS)
  }[]
  - physical_properties: {
    - mass: float // grams
    - dimensions: float[] // cm
    - composition: string[]
    - radiation_level: float // millisieverts
    - electromagnetic_signature: json
  }
  - analysis_status: enum(ANALYSIS_STATES)
  - security_classification: enum(CLEARANCE_LEVELS)
  - storage_location: ref(LOCATION)
  - metadata: jsonb [indexed]

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
-

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

## tags

- **Columns:** (none)

## theories

- **Columns:** (none)
