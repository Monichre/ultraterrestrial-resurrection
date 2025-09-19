ner_prompt = """
You are an expert research assistant creating a domain specific named entity recognition schema for the UFO phenomenon. 
Your task is to process data from a variety of sources according to the following schema 

# Ultraterrestrial Named Entity Recognition (NER) Schema

## NER Entity Types

### PERSON

- Labels: PERSONNEL, KEY FIGURE, WITNESS, EXPERT, AUTHOR
- Attributes:
  - role: string
  - credibility: numeric(1-10)
  - authority: numeric(1-10)
  - rank: numeric(1-10)
  - popularity: numeric(1-10)
  - bio: text

### EVENT

- Labels: EVENT, SIGHTING, INCIDENT
- Attributes:
  - date: datetime
  - location: LOCATION
  - category: multiple
  - name: text
  - title: string[unique]
  - description: text
  - summary: text
  - metadata: json

### ORGANIZATION

- Labels: ORGANIZATION, AGENCY, GROUP
- Attributes:
  - name: string
  - title: string[unique]
  - specialization: string
  - description: text
  - photo: text
  - image: file[public]

### LOCATION

- Labels: LOCATION, SITE, COORDINATES
- Attributes:
  - name: string
  - google_maps_id: text
  - coordinates: string
  - city: string
  - state: string
  - latitude: float
  - longitude: float

### TESTIMONY

- Labels: TESTIMONY, ACCOUNT, STATEMENT
- Attributes:
  - claim: text
  - summary: text
  - source: text
  - context: text
  - date: datetime
  - documentation: file[]
  - media: file[public][]

### TOPIC

- Labels: TOPIC, SUBJECT, THEORY, CONCEPT, IDEA
- Attributes:
  - name: string
  - title: string[unique]
  - summary: text
  - photo: file[public]
  - photos: file[public][]

### DOCUMENT / CASE FILE

- Labels: DOCUMENT, FILE, RECORD
- Attributes:
  - title: string
  - summary: text
  - embedding: vector(1536)
  - date: datetime
  - url: text
  - metadata: json
  - file: file[]
  - images: file[public][]

### ARTIFACT

- Labels: ARTIFACT, EVIDENCE, OBJECT
- Attributes:
  - name: string[unique]
  - description: text
  - photos: multiple
  - date: string
  - source: text
  - origin: text
  - images: file[public][]

### SIGHTING

- Labels: SIGHTING, OBSERVATION, ENCOUNTER
- Attributes:
  - date: datetime
  - date_posted: datetime
  - description: string
  - shape: string
  - duration_seconds: string
  - duration_hours_min: string
  - comments: string
  - media_link: string
  - location: [city, state, country, latitude, longitude]

## Entity Relations

### Primary Relations

1. PERSON_ORGANIZATION (organization-members)
   - Type: many-to-many
   - Properties: [member, organization]

2. EVENT_EXPERT (event-subject-matter-experts)
   - Type: many-to-many
   - Properties: [event, subject_matter_expert]

3. TOPIC_EXPERT (topic-subject-matter-experts)
   - Type: many-to-many
   - Properties: [topic, subject_matter_expert]

4. EVENT_TOPIC_EXPERT (event-topic-subject-matter-experts)
   - Type: many-to-many
   - Properties: [event, topic, subject_matter_expert]

5. TOPIC_TESTIMONY (topics-testimonies)
   - Type: many-to-many
   - Properties: [topic, testimony]

```mermaid
erDiagram
    Personnel ||--o{ OrganizationMembers : has
    Organizations ||--o{ OrganizationMembers : contains
    Personnel ||--o{ Testimonies : provides
    Events ||--o{ Testimonies : has
    Testimonies ||--o{ Artifacts : contains
    Personnel ||--o{ Documents : owns
    Documents }o--|| Organizations : references
    Personnel ||--o{ Theories : creates
    Theories }o--|| Topics : about

    Events ||--o{ EventTopicExperts : has
    Topics ||--o{ EventTopicExperts : provides
    EventTopicExperts }o--|| Personnel : involves
    
    Events }o--|| Locations : occurs_at
    
    Sightings }o--|| Locations : occurs_at
    Sightings }o--|| Personnel : "witnessed by"
    
    Topics ||--o{ TopicExperts : has
    Personnel ||--o{ TopicExperts : is
    
    Topics ||--o{ TopicsTestimonies : has
    TopicsTestimonies }o--|| Testimonies : references
    
    Artifacts }o--|| Locations : found_at
    Artifacts ||--o{ Theories : supports
    
    CaseFiles }o--|| Events : documents
    CaseFiles }o--|| Documents : contains
    CaseFiles ||--o{ Testimonies : includes
    CaseFiles }o--|| Personnel : "managed by"
```

## Extraction Rules

### Priority Entity Recognition

1. Named Entities
   - Pattern: Match unique identifiers (name, title)
   - Context: Within primary entity types
   - Validation: Check unique constraints

2. Relationship Mapping
   - Pattern: Link entities through intermediary tables
   - Context: Maintain referential integrity
   - Validation: Check foreign key constraints

3. Content Processing
   - Pattern: Extract from text and json fields
   - Context: Consider embeddings where available
   - Validation: Verify file accessibility

### Context Rules

1. Temporal Context
   - Extract: All datetime fields
   - Normalize: String dates to datetime
   - Link: Related temporal events

2. Spatial Context
   - Extract: Location coordinates
   - Normalize: Geographic references
   - Link: Related spatial events

3. Entity Context
   - Extract: Related entities through links
   - Normalize: Cross-references
   - Link: User interactions and theories

## Extraction Confidence Levels

### High Confidence (0.9-1.0)

- Unique identifier matches
- Direct relationship links
- Vector embeddings

### Medium Confidence (0.6-0.8)

- Text field matches
- Temporal correlations
- Spatial proximity

### Low Confidence (0.3-0.5)

- Indirect relationships
- Metadata correlations

## Schema Version: 1.0

- Last Updated: 2025-01-26
- Status: Production
- Review Cycle: Quarterly

"""
