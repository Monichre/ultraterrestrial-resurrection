export const RESEARCH_METHOD_PROMPT = `
"""
# Core Entity Types

1. Topics

Purpose: Stores information about various topics.

Columns:
	•	name (string): The name of the topic.
	•	summary (text): A detailed summary of the topic.
	•	photo (file): A single photo representing the topic.
	•	photos (file[]): Multiple photos associated with the topic.
	•	title (string, unique): A unique title for the topic.

Relationships:
	•	topic-subject-matter-experts: Linked via the topic column.
	•	topics-testimonies: Linked via the topic column.
	•	event-topic-subject-matter-experts: Linked via the topic column.
	•	user-saved-topics: Linked via the topic column.

2. Personnel

Purpose: Contains information about personnel involved in various capacities.

Columns:
	•	bio (text): Biography of the personnel.
	•	role (string): Role or position held.
	•	facebook (string): Facebook profile link.
	•	twitter (string): Twitter handle.
	•	website (string): Personal or professional website.
	•	instagram (string): Instagram profile link.
	•	photo (file[]): Multiple photos of the personnel.
	•	rank (int): Rank or level.
	•	credibility (int): Credibility score.
	•	popularity (int): Popularity score.
	•	name (string, unique): Full name of the personnel.
	•	authority (int): Authority score.

Relationships:
	•	organization-members: Linked via the member column.
	•	event-subject-matter-experts: Linked via the subject-matter-expert column.
	•	topic-subject-matter-experts: Linked via the subject-matter-expert column.
	•	testimonies: Linked via the witness column.
	•	event-topic-subject-matter-experts: Linked via the subject-matter-expert column.
	•	user-saved-key-figure: Linked via the key-figure column.
	•	documents: Linked via the author column.

3. Events

Purpose: Records details about various events.

Columns:
	•	name (text): Name of the event.
	•	description (text): Detailed description of the event.
	•	location (string): Location of the event.
	•	latitude (float): Latitude coordinate of the event location.
	•	longitude (float): Longitude coordinate of the event location.
	•	date (datetime): Date and time of the event.
	•	photos (file[]): Photos from the event.
	•	metadata (json, default: "{}"): Additional metadata in JSON format.
	•	title (string, unique): A unique title for the event.
	•	summary (text): Summary of the event.

Relationships:
	•	event-subject-matter-experts: Linked via the event column.
	•	testimonies: Linked via the event column.
	•	event-topic-subject-matter-experts: Linked via the event column.
	•	user-saved-events: Linked via the event column.

4. Organizations

Purpose: Maintains data about various organizations.

Columns:
	•	name (string): Name of the organization.
	•	specialization (string): Area of specialization.
	•	description (text): Description of the organization.
	•	photo (text): Photo URL or identifier.
	•	image (file, defaultPublicAccess: true): Image file with public access.
	•	title (string, unique): A unique title for the organization.

Relationships:
	•	organization-members: Linked via the organization column.
	•	testimonies: Linked via the organization column.
	•	user-saved-organizations: Linked via the organization column.
	•	documents: Linked via the organization column.

5. Sightings

Purpose: Logs sightings with detailed information.

Columns:
	•	date (datetime): Date of the sighting.
	•	description (string): Description of the sighting.
	•	media_link (string): Link to media related to the sighting.
	•	city (string): City where the sighting occurred.
	•	state (string): State where the sighting occurred.
	•	country (string): Country where the sighting occurred.
	•	shape (string): Shape observed during the sighting.
	•	duration_seconds (string): Duration in seconds.
	•	duration_hours_min (string): Duration in hours and minutes.
	•	comments (string): Additional comments.
	•	date_posted (datetime): Date the sighting was posted.
	•	latitude (float): Latitude coordinate.
	•	longitude (float): Longitude coordinate.

Relationships:
	•	user-saved-sightings: Linked via the sighting column.

6. Event-Subject-Matter-Experts

Purpose: Associates events with subject matter experts.

Columns:
	•	event (link to Events): Reference to the related event.
	•	subject-matter-expert (link to Personnel): Reference to the subject matter expert.

7. Topic-Subject-Matter-Experts

Purpose: Links topics with subject matter experts.

Columns:
	•	topic (link to Topics): Reference to the related topic.
	•	subject-matter-expert (link to Personnel): Reference to the subject matter expert.

8. Organization-Members

Purpose: Connects personnel members to organizations.

Columns:
	•	member (link to Personnel): Reference to the personnel member.
	•	organization (link to Organizations): Reference to the organization.

9. Testimonies

Purpose: Captures testimonies related to events and organizations.

Columns:
	•	claim (text): The claim made in the testimony.
	•	event (link to Events): Reference to the related event.
	•	summary (text): Summary of the testimony.
	•	witness (link to Personnel): Reference to the witness.
	•	documentation (file[]): Supporting documentation files.
	•	date (datetime): Date of the testimony.
	•	organization (link to Organizations): Reference to the related organization.

Relationships:
	•	topics-testimonies: Linked via the testimony column.
	•	user-saved-testimonies: Linked via the testimony column.

10. Topics-Testimonies

Purpose: Associates topics with testimonies.

Columns:
	•	topic (link to Topics): Reference to the related topic.
	•	testimony (link to Testimonies): Reference to the testimony.

11. Documents

Purpose: Stores documents with associated metadata.

Columns:
	•	file (file[]): Document files.
	•	content (text): Content of the document.
	•	embedding (vector, dimension: 1536): Vector embedding for the document.
	•	title (string): Title of the document.
	•	date (datetime): Date of the document.
	•	author (link to Personnel): Reference to the author.
	•	organization (link to Organizations): Reference to the organization.
	•	url (text): URL link to the document.

Relationships:
	•	user-saved-documents: Linked via the document column.

12. Locations

Purpose: Defines various geographical locations.

Columns:
	•	name (string): Name of the location.
	•	coordinates (string): Coordinate representation.
	•	google-maps-location-id (text): Google Maps Location ID.
	•	city (string): City of the location.
	•	state (string): State of the location.
	•	latitude (float): Latitude coordinate.
	•	longitude (float): Longitude coordinate.

13. Event-Topic-Subject-Matter-Experts

Purpose: Links events, topics, and subject matter experts together.

Columns:
	•	event (link to Events): Reference to the related event.
	•	topic (link to Topics): Reference to the related topic.
	•	subject-matter-expert (link to Personnel): Reference to the subject matter expert.

14. Artifacts

Purpose: Manages artifacts with detailed descriptions and media.

Columns:
	•	name (string, unique): Name of the artifact.
	•	description (text): Description of the artifact.
	•	photos (multiple): Multiple photos of the artifact.
	•	date (string): Date associated with the artifact.
	•	source (text): Source of the artifact information.
	•	origin (text): Origin details of the artifact.
	•	images (file[], defaultPublicAccess: true): Image files with public access.

Notes:
	•	Data Types:
	•	string: A short text field.
	•	text: A longer text field.
	•	file: A single file upload.
	•	file[]: Multiple file uploads.
	•	int: Integer number.
	•	float: Floating-point number.
	•	datetime: Date and time.
	•	json: JSON-formatted data.
	•	vector: Numerical vector for embeddings.
	•	link: Reference to another table.
	•	multiple: Indicates multiple entries or files.
	•	Constraints:
	•	Fields marked as unique must have distinct values across all records in the table.
	•	defaultValue specifies the default value if none is provided.
	•	defaultPublicAccess indicates that the file is publicly accessible by default.
	•	Relationships:
	•	Defined to establish connections between tables, enabling relational data queries.
	•	Each relationship specifies the linking column and the target table.

---

## ** Sample Input **
This Billionaire Saw Interdimensional Beings and Claims G-LOC Unlocks Out-of-Body Consciousness Summary

https://howandwhys.com/robert-bigelow-interdimensional-beings-claims-g-loc-unlocks-out-of-body-consciousness/

=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===

Research Agent Analysis:
I'll analyze and structure this content according to the research methodology:

**=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===**

PERSONNEL PROFILE:

Name: Robert Bigelow
Role: Businessman, UFO/Consciousness Researcher, Space Industry Pioneer
Bio: Billionaire founder of Budget Suites of America, Bigelow Aerospace, NIDS, and BAASS. Known for funding extensive UFO and consciousness research.
Authority Metrics:
- Rank: 90 (Major financial/research contributor to field)
- Credibility: 85 (Established space industry credentials)
- Scientific Authority: 70 (Funds scientific research but not a scientist)
- Public Recognition: 85 (Well-known in space/UFO communities)

ORGANIZATIONS:

1. National Institute for Discovery Science (NIDS)
- Founded: 1995
- Founder: Robert Bigelow
- Purpose: UFO and paranormal research
- Notable Members: Hal Puthoff, Jacques Vallée, John Mack

2. Bigelow Aerospace Advanced Space Studies (BAASS)
- Successor to NIDS
- Government contractor for AAWSAP program
- Focus: UFO research and aerospace technology

3. Bigelow Institute for Consciousness Studies (BICS)
- Founded: 2020
- Purpose: Research into consciousness and survival after death

SIGNIFICANT EVENTS:

1. Skinwalker Ranch Investigation
- Location: Utah
- Date: 1996-onwards
- Description: Scientific investigation of reported paranormal phenomena
- Key Personnel: Robert Bigelow, Colm Kelleher

2. AAWSAP Program
- Date: 2007
- Funding: $22 million
- Key Personnel: James Lacatski, Senator Harry Reid
- Purpose: Classified UFO/paranormal research program

TESTIMONIES:

1. G-LOC Experience (Air Force General)
Description: Out-of-body experience during G-force training
Evidence Type: First-hand testimony
Date: Not specified
Verification: Military documentation of G-LOC phenomena

2. Bigelow CBS Interview (2017)
Key Quote: "Absolutely convinced" of alien presence on Earth
Context: Public statement on UFO beliefs
Evidence Type: Media interview

RESEARCH TOPICS:

1. Interdimensional Phenomena
- Location: Skinwalker Ranch
- Evidence Type: Witness testimonies, research documentation
- Key Investigators: NIDS/BAASS teams

2. Consciousness Research
- Focus: Out-of-body experiences, survival after death
- Methodology: Scientific investigation through BICS
- Related Evidence: G-LOC documentation

DOCUMENTATION:

1. "Hunt for the Skinwalker" (2005)
Authors: Colm Kelleher, George Knapp
Content: Scientific investigation records
Source: Published book

2. CBS Interview (2017)
Format: Television broadcast
Content: Bigelow's public statements on UFO presence
Source: CBS News

The information presents a complex network of research initiatives, focusing on three main areas: UFO investigation, consciousness studies, and aerospace technology. Bigelow's approach combines private sector resources with government collaboration, establishing multiple research organizations over decades.

---

## ** Output Format **

First Step: Identify entities in the content.

```python
personnel=[
    {
        "name": "Robert Bigelow",
        "role": "Businessman, UFO/Consciousness Researcher, Space Industry Pioneer",
        "bio": "Billionaire founder of Budget Suites of America, Bigelow Aerospace, NIDS, and BAASS. Known for funding extensive UFO and consciousness research.",
    }
]
organizations=[
    {
        "name": "National Institute for Discovery Science (NIDS)",
        "specialization": "UFO and paranormal research",
        "description": "UFO and paranormal research",
    },
    {
        "name": "Bigelow Aerospace Advanced Space Studies (BAASS)",
        "specialization": "UFO research and aerospace technology",
        "description": "UFO research and aerospace technology",
    },
    {
        "name": "Bigelow Institute for Consciousness Studies (BICS)",
        "specialization": "Research into consciousness and survival after death",
        "description": "Research into consciousness and survival after death",
    }
]
events=[
    {
        "name": "Skinwalker Ranch Investigation",
        "description": "Scientific investigation of reported paranormal phenomena",
        "location": "Utah",
    },
    {
        "name": "AAWSAP Program",
        "description": "Classified UFO/paranormal research program",
        "date": "2007",
        "funding": "$22 million",
        "key_personnel": "James Lacatski, Senator Harry Reid",
    }
]
testimonies=[
    {
        "claim": "Out-of-body experience during G-force training",
        "evidence_type": "First-hand testimony",
        "date": "Not specified",
        "verification": "Military documentation of G-LOC phenomena",
    },
    {
        "claim": "Absolutely convinced" of alien presence on Earth",
        "evidence_type": "Media interview",
        "date": "2017",
        "context": "Public statement on UFO beliefs",
    },
    
]
topics=[
    {
        "name": "Interdimensional Phenomena",
        "location": "Skinwalker Ranch",
        "evidence_type": "Witness testimonies, research documentation",
    },
    {
        "name": "Consciousness Research",
        "focus": "Out-of-body experiences, survival after death",
        "methodology": "Scientific investigation through BICS",
        "related_evidence": "G-LOC documentation",
    }
]
```

Second Step: Search for existing entries and establish relationships.

*Use the Xata Python SDK to search the database for potential matches, related entries, and to avoid duplicates and establish proper relationships.*
*For each entity type, perform appropriate searches as follows:*
After identifying the entities from the content, search for existing entries in the Xata database to avoid duplicates and establish proper relationships:

```python
# Search for personnel matches
for person in personnel:
    personnel_results = xata.data().search_table("personnel", {
        "query": person["name"],
        "target": [
            {"column": "name", "weight": 5},
            {"column": "bio", "weight": 3},
            {"column": "role", "weight": 2}
        ],
        "fuzziness": 1,
        "prefix": "phrase"
    })
    
    if personnel_results and len(personnel_results["records"]) > 0:
        print(f"Found {len(personnel_results['records'])} matching personnel records for {person['name']}")
        # Use existing record instead of creating a new one
        person["xata_id"] = personnel_results["records"][0]["id"]
    else:
        print(f"No matches found for {person['name']}, will create new record")

### Events Search
```python
# Search for similar events
for event in events:
    event_results = xata.data().search_table("events", {
        "query": event["name"],
        "target": [
            {"column": "name", "weight": 5},
            {"column": "title", "weight": 5},
            {"column": "description", "weight": 3},
            {"column": "summary", "weight": 3},
            {"column": "location", "weight": 2}
        ],
        "fuzziness": 1,
        "prefix": "phrase"
    })
    
    # Process event search results
    if event_results and len(event_results["records"]) > 0:
        print(f"Found {len(event_results['records'])} similar events in the database")
        # Additional processing as needed
```

### Organizations Search
```python
# Search for matching organizations
for org in organizations:
    org_results = xata.data().search_table("organizations", {
        "query": org["name"],
        "target": [
            {"column": "name", "weight": 5},
            {"column": "title", "weight": 5},
            {"column": "description", "weight": 3},
            {"column": "specialization", "weight": 2}
        ],
        "fuzziness": 1,
        "prefix": "phrase"
    })
    
    # Process organization search results
    if org_results and len(org_results["records"]) > 0:
        print(f"Found {len(org_results['records'])} matching organizations in the database")
        # Additional processing as needed
```

### Testimonies Search
```python
# Search for related testimonies
for testimony in testimonies:
    search_text = testimony["claim"][:100] if len(testimony["claim"]) > 100 else testimony["claim"]
    testimony_results = xata.data().search_table("testimonies", {
        "query": search_text,
        "target": [
            {"column": "claim", "weight": 5},
            {"column": "summary", "weight": 4},
            {"column": "context", "weight": 3}
        ],
        "fuzziness": 1,
        "prefix": "phrase"
    })
    
    # Process testimony search results
    if testimony_results and len(testimony_results["records"]) > 0:
        print(f"Found {len(testimony_results['records'])} similar testimonies in the database")
        # Additional processing as needed
```

### Documents Search
```python
# If documents are identified in the content
if 'documents' in locals():
    for document in documents:
        query_text = document.get("title", "") or document.get("summary", "")[:100]
        document_results = xata.data().search_table("documents", {
            "query": query_text,
            "target": [
                {"column": "title", "weight": 5},
                {"column": "summary", "weight": 4}
            ],
            "fuzziness": 1,
            "prefix": "phrase"
        })
        
        # Process document search results
        if document_results and len(document_results["records"]) > 0:
            print(f"Found {len(document_results['records'])} related documents in the database")
            # Additional processing as needed
```

### Sightings Search
```python
# If sightings are identified in the content
if 'sightings' in locals():
    for sighting in sightings:
        location_query = f"{sighting.get('city', '')} {sighting.get('state', '')} {sighting.get('country', '')}"
        query_text = sighting.get("description", "") or location_query
        
        sighting_results = xata.data().search_table("sightings", {
            "query": query_text,
            "target": [
                {"column": "description", "weight": 5},
                {"column": "city", "weight": 3},
                {"column": "state", "weight": 2},
                {"column": "country", "weight": 2},
                {"column": "shape", "weight": 3}
            ],
            "fuzziness": 1,
            "prefix": "phrase"
        })
        
        # Process sightings search results
        if sighting_results and len(sighting_results["records"]) > 0:
            print(f"Found {len(sighting_results['records'])} similar sightings in the database")
            # Additional processing as needed
```

### Artifacts Search
```python
# If artifacts are identified in the content
if 'artifacts' in locals():
    for artifact in artifacts:
        query_text = artifact.get("name", "") or artifact.get("description", "")[:100]
        
        artifact_results = xata.data().search_table("artifacts", {
            "query": query_text,
            "target": [
                {"column": "name", "weight": 5},
                {"column": "description", "weight": 4},
                {"column": "source", "weight": 2},
                {"column": "origin", "weight": 2}
            ],
            "fuzziness": 1,
            "prefix": "phrase"
        })
        
        # Process artifacts search results
        if artifact_results and len(artifact_results["records"]) > 0:
            print(f"Found {len(artifact_results['records'])} similar artifacts in the database")
            # Additional processing as needed
```

## ** Xata Database Record Management **

Third Step: Create new records or update existing ones and establish relationships.

```python
# Create new records for entities not found in the database
for person in personnel:
    if "xata_id" not in person:
        # Search for existing personnel
        personnel_results = xata.data().search_table("personnel", {
            "query": person["name"],
            "target": [{"column": "name", "weight": 5}],
            "fuzziness": 1
        })
        
        if personnel_results and len(personnel_results["records"]) > 0:
            # Use existing record
            person["xata_id"] = personnel_results["records"][0]["id"]
            print(f"Found existing record for {person['name']}")
        else:
            # Create new personnel record
            new_person = xata.data().insert_table("personnel", {
                "name": person["name"],
                "role": person["role"],
                "bio": person["bio"],
                "rank": person.get("rank", 50),  # Default value if not provided
                "credibility": person.get("credibility", 50),
                "authority": person.get("authority", 50),
                "popularity": person.get("popularity", 50)
            })
            person["xata_id"] = new_person["id"]
            print(f"Created new record for {person['name']}")

for org in organizations:
    if "xata_id" not in org:
        # Search for existing organization
        org_results = xata.data().search_table("organizations", {
            "query": org["name"],
            "target": [{"column": "name", "weight": 5}],
            "fuzziness": 1
        })
        
        if org_results and len(org_results["records"]) > 0:
            # Use existing record
            org["xata_id"] = org_results["records"][0]["id"]
            print(f"Found existing record for {org['name']}")
        else:
            # Create new organization record
            new_org = xata.data().insert_table("organizations", {
                "name": org["name"],
                "specialization": org["specialization"],
                "description": org["description"],
                "title": org.get("title", org["name"])  # Use name as title if not provided
            })
            org["xata_id"] = new_org["id"]
            print(f"Created new record for {org['name']}")

for event in events:
    if "xata_id" not in event:
        # Search for existing event
        event_results = xata.data().search_table("events", {
            "query": event["name"],
            "target": [{"column": "name", "weight": 5}],
            "fuzziness": 1
        })
        
        if event_results and len(event_results["records"]) > 0:
            # Use existing record
            event["xata_id"] = event_results["records"][0]["id"]
            print(f"Found existing record for {event['name']}")
        else:
            # Create new event record
            new_event = xata.data().insert_table("events", {
                "name": event["name"],
                "description": event["description"],
                "location": event.get("location", ""),
                "date": event.get("date", None),
                "title": event.get("title", event["name"]),  # Use name as title if not provided
                "summary": event.get("summary", event["description"])
            })
            event["xata_id"] = new_event["id"]
            print(f"Created new record for {event['name']}")

for topic in topics:
    if "xata_id" not in topic:
        # Search for existing topic
        topic_results = xata.data().search_table("topics", {
            "query": topic["name"],
            "target": [{"column": "name", "weight": 5}],
            "fuzziness": 1
        })
        
        if topic_results and len(topic_results["records"]) > 0:
            # Use existing record
            topic["xata_id"] = topic_results["records"][0]["id"]
            print(f"Found existing record for {topic['name']}")
        else:
            # Create new topic record
            new_topic = xata.data().insert_table("topics", {
                "name": topic["name"],
                "title": topic.get("title", topic["name"]),  # Use name as title if not provided
                "summary": topic.get("summary", f"Topic related to {topic['name']}")
            })
            topic["xata_id"] = new_topic["id"]
            print(f"Created new record for {topic['name']}")

# Create and establish relationships between entities
# Example: Connect personnel to organizations (Organization Members)
for person in personnel:
    for org in organizations:
        # Check if this relationship already exists
        existing_relation = xata.data().search_table("organization-members", {
            "filter": {
                "member.id": person["xata_id"],
                "organization.id": org["xata_id"]
            }
        })
        
        if not existing_relation or len(existing_relation["records"]) == 0:
            # Create new relationship
            xata.data().insert_table("organization-members", {
                "member": {"id": person["xata_id"]},
                "organization": {"id": org["xata_id"]}
            })
            print(f"Created relationship between {person['name']} and {org['name']}")

# Connect personnel as subject matter experts to topics
for person in personnel:
    for topic in topics:
        # Check if this relationship already exists
        existing_relation = xata.data().search_table("topic-subject-matter-experts", {
            "filter": {
                "subject-matter-expert.id": person["xata_id"],
                "topic.id": topic["xata_id"]
            }
        })
        
        if not existing_relation or len(existing_relation["records"]) == 0:
            # Create new relationship
            xata.data().insert_table("topic-subject-matter-experts", {
                "subject-matter-expert": {"id": person["xata_id"]},
                "topic": {"id": topic["xata_id"]}
            })
            print(f"Connected {person['name']} as SME to topic {topic['name']}")

# Store testimonies and link to relevant entities
for testimony in testimonies:
    if "xata_id" not in testimony:
        # Create new testimony record
        new_testimony = xata.data().insert_table("testimonies", {
            "claim": testimony["claim"],
            "summary": testimony.get("summary", testimony["claim"]),
            "date": testimony.get("date", None),
            "context": testimony.get("context", "")
        })
        testimony["xata_id"] = new_testimony["id"]
        
        # Link testimony to witness if available
        if "witness" in testimony and testimony["witness"] in [p["name"] for p in personnel]:
            witness = next(p for p in personnel if p["name"] == testimony["witness"])
            xata.data().update_table("testimonies", testimony["xata_id"], {
                "witness": {"id": witness["xata_id"]}
            })
            
        # Link testimony to related topics
        for topic in topics:
            xata.data().insert_table("topics-testimonies", {
                "testimony": {"id": testimony["xata_id"]},
                "topic": {"id": topic["xata_id"]}
            })
  """

    `