# Ultraterrestrial Living Research Archive

Karpathy’s pattern is almost uncannily aligned with Ultraterrestrial: immutable
raw sources, an LLM-maintained intermediate knowledge layer, and a schema that
governs ingestion and maintenance. The important upgrade is to replace the
generic “wiki” with an epistemically explicit research system built around
provenance, claims, contradictions, hypotheses, and the
**Pin → Thread → Hunch → Canvas → Quilt** progression.

Below is the tuned, copy-pasteable architecture file.

A pattern for building a persistent, compounding research environment for UAP
history, anomalous phenomena, government disclosure, witness testimony,
scientific evidence, cultural interpretation, and competing explanations.

This is an idea and architecture file. It is designed to be copied into an LLM
coding or research agent such as OpenAI Codex, Claude Code, or another agentic
development environment.

Its purpose is to communicate the canonical Ultraterrestrial research model.
The implementation details should be developed collaboratively between the
researcher and the agent.

---

## The Core Idea

Most document-based LLM systems operate like conventional RAG:

1. Store a collection of files.
2. Retrieve relevant chunks when a question is asked.
3. Generate a temporary answer.
4. Forget most of the synthesis after the conversation ends.

This is useful, but insufficient for Ultraterrestrial.

The domain contains:

- Thousands of documents
- Repeatedly cited incidents
- Conflicting witness accounts
- Government records
- Secondary reporting
- Anonymous allegations
- Scientific analysis
- Cultural narratives
- Claims repeated through circular sourcing
- Competing interpretations
- Relationships spanning decades

A conventional RAG system repeatedly reconstructs the same context from raw
fragments. It does not inherently preserve the analytical work performed during
previous investigations.

Ultraterrestrial should work differently.

Instead of retrieving only from raw documents, the system incrementally builds
and maintains a persistent research model that sits between the researcher and
the source archive.

When a new source is added, the system does not merely index it. It:

- Preserves the original source
- Extracts entities
- Extracts claims
- Identifies events and dates
- Identifies locations
- Resolves canonical records
- Updates relevant entity pages
- Adds or revises relationships
- Detects contradictions
- Detects corroboration
- Updates source provenance
- Updates hypothesis support
- Identifies unresolved questions
- Suggests new research paths
- Records every material change

The research model becomes a persistent, compounding artifact.

- Cross-references are already present.
- Contradictions are already indexed.
- Source dependencies have already been traced.
- Hypotheses already reflect the available evidence.

The knowledge environment becomes richer with every:

- Source
- Question
- Comparison
- Correction
- Hypothesis
- Rejected interpretation
- Guided investigation

The user curates sources, directs inquiry, evaluates interpretations, and asks
meaningful questions.

The agent performs the maintenance work:

- Summarization
- Extraction
- Canonicalization
- Cross-referencing
- Citation management
- Provenance tracking
- Contradiction detection
- Index maintenance
- Hypothesis bookkeeping
- Research-history logging

The research application is the IDE.  
The agent is the knowledge engineer.  
The domain model is the codebase.

---

## The Ultraterrestrial Research Hierarchy

Ultraterrestrial organizes inquiry through five progressively richer objects.

### Pin

A Pin is the smallest meaningful research object.

Examples:

- Person
- Event
- Organization
- Document
- Location
- Sighting
- Testimony
- Artifact
- Claim
- Quotation
- Date
- Source excerpt
- Topic
- Research question

Pins should resolve to canonical records whenever possible.

A Pin is not merely a visual card. It is a projection of a structured domain
entity.

### Thread

A Thread is a typed relationship between Pins.

Examples:

- A witness observed an event
- A document references a program
- A person belonged to an organization
- An incident occurred near a nuclear facility
- A testimony corroborates another testimony
- A source contradicts an official statement
- A document is derived from another source
- A claim supports a hypothesis
- Two records may describe the same event
- An organization allegedly administered a program

Threads must carry:

- Relationship type
- Direction
- Confidence
- Epistemic status
- Supporting sources
- Contradicting sources
- Rationale
- Authorship
- Creation mode
- Revision history

Threads are analytical objects, not decorative lines.

### Hunch

A Hunch is a provisional interpretation or possible pattern.

Examples:

- UAP activity may correlate with nuclear infrastructure.
- Several witnesses may be describing the same phenomenon.
- Multiple disclosure events follow a recurring media pattern.
- A historical religious motif may resemble a modern encounter narrative.
- Two programs may share personnel or administrative lineage.
- A source may be participating in an influence operation.
- A reported propulsion characteristic resembles another case cluster.

A Hunch must expose:

- Supporting Pins
- Contradicting Pins
- Confidence
- Assumptions
- Author
- AI contribution
- Open questions
- Falsification criteria
- Revision history

A Hunch must never be rendered as established fact.

### Canvas

A Canvas is a bounded investigation workspace organized around a research
question, incident, theme, person, institution, or hypothesis.

Examples:

- Roswell to the Present: The Nuclear Thread
- The Nimitz Encounter
- The Invisible College
- The Hill Star Map
- European Drone Incursions
- Element 115 and Advanced Propulsion
- Knowledge Bringers Across Mythic Traditions
- Government Disclosure Phases
- Transient Lunar Phenomena
- Remote Viewing and Mars Narratives

A Canvas contains:

- Pins
- Threads
- Hunches
- Notes
- Source excerpts
- Contradictions
- Timelines
- Maps
- Saved views
- AI analyses
- Research questions

A Canvas is the primary spatial unit of investigation.

### Quilt

A Quilt is a higher-order synthesis connecting multiple Canvases.

A Quilt may represent:

- A long-form investigation
- A guided tour
- A disclosure chronology
- A documentary research structure
- A comparative mythology study
- A network of government programs
- A theory evaluated across cases
- A public-facing research narrative

A Quilt must preserve distinctions between:

- Verified fact
- Corroborated evidence
- Plausible inference
- Contested interpretation
- Unverified allegation
- Discredited claim
- Unknown information

The purpose of the Quilt is not to flatten uncertainty into a single story.

Its purpose is to show how the story was constructed.

---

## Architecture

The Ultraterrestrial knowledge environment contains five primary layers.

### 1. Raw Sources

The raw-source archive contains the original research material.

Examples:

- PDFs
- FOIA releases
- Government memoranda
- Scientific papers
- Newspaper articles
- Books
- Interview transcripts
- Audio
- Video
- Photographs
- Radar records
- Sensor data
- Maps
- Web captures
- Archival correspondence
- User-uploaded research files

Raw sources are immutable.

The agent may:

- Read them
- OCR them
- Transcribe them
- Hash them
- Generate previews
- Extract information from them
- Link to page or timestamp anchors

The agent must never silently modify the original source.

The raw archive is the primary evidentiary record.

### 2. Evidence Ledger

The Evidence Ledger tracks where every source-derived statement came from.

Each source should record:

- Original file
- Original URL
- Archive URL
- File hash
- Publication date
- Retrieval date
- Author
- Publisher
- Originating agency
- Page anchors
- Paragraph anchors
- Video timestamps
- Audio timestamps
- OCR confidence
- Extraction method
- Transformations
- Duplicate status
- Citation lineage
- Chain of custody
- User annotations
- AI annotations

The Evidence Ledger must allow the user to answer:

- Where did this information come from?
- Is this the original source?
- Is this a copy, excerpt, or interpretation?
- Has this document changed?
- Is the source independent?
- Is this citation circular?
- Who extracted or interpreted this claim?
- What page or timestamp supports it?

No synthesis should become canonical without traceable evidence.

### 3. Domain Graph

The Domain Graph contains canonical entities, claims, and relationships.

Core entity types include:

- Topic
- Personnel
- Event
- Organization
- Sighting
- Testimony
- Document
- Location
- Artifact
- Claim
- Hypothesis

The graph should distinguish:

- A person from what the person claimed
- An event from later descriptions of the event
- A document from the claims contained in it
- A testimony from corroborating physical evidence
- A hypothesis from the evidence used to evaluate it

This distinction is essential.

A statement repeated in fifty articles may still originate from one unsupported
source. The graph should make that visible.

### 4. Compiled Research Pages

The compiled research layer contains agent-maintained, human-readable pages.

These pages may be implemented as:

- Markdown
- Database records
- Generated views
- Materialized summaries
- Hybrid structured documents

Examples:

- Entity profiles
- Incident summaries
- Program histories
- Witness chronologies
- Source comparisons
- Contradiction reports
- Topic overviews
- Evidence matrices
- Timeline summaries
- Location dossiers
- Hypothesis evaluations
- Canvas summaries
- Quilt narratives

The agent owns maintenance of this layer.

The researcher reads, reviews, corrects, and directs it.

Compiled pages should be treated as derived research artifacts, not original
sources.

### 5. Research Schema

The schema is the operating constitution of Ultraterrestrial.

It may live in:

- `AGENTS.md`
- `CLAUDE.md`
- `/schema/`
- A database-backed configuration system
- Agent definitions
- Validation rules

The schema defines:

- Entity types
- Relationship types
- Epistemic statuses
- Credibility factors
- Page templates
- Naming conventions
- Canonicalization rules
- Ingestion workflows
- Citation requirements
- Hypothesis requirements
- Audit rules
- Agent permissions
- Human-review requirements

The schema is what turns the agent from a generic summarizer into a disciplined
research maintainer.

The researcher and agent should evolve it carefully over time.

Schema changes should be incremental. Map new material to existing structures
before introducing new entity types or relationship types. Do not perform schema
migrations without explicit approval.

---

## Canonical Entity Types

### Topic

A conceptual subject or research theme.

Examples:

- Nuclear interference
- Advanced propulsion
- Disclosure
- Abduction
- Religious experience
- Exotic materials
- Time distortion
- High strangeness
- Government secrecy

### Personnel

A person relevant to the domain.

Possible roles:

- Witness
- Researcher
- Scientist
- Journalist
- Military personnel
- Government official
- Intelligence personnel
- Experiencer
- Whistleblower
- Historian
- Skeptic
- Anthropologist
- Religious scholar

Personnel records should support:

- Names
- Aliases
- Roles
- Affiliations
- Credentials
- Biography
- Chronology
- Statements
- Relationships
- Conflicts of interest
- Reliability assessments
- Associated events
- Associated documents

### Event

A temporally bounded occurrence.

Examples:

- Sighting
- Alleged recovery
- Congressional hearing
- Radar encounter
- Document release
- Military operation
- Scientific analysis
- Contact experience
- Policy change
- Media disclosure

Events should support:

- Start date
- End date
- Date precision
- Location
- Participants
- Sources
- Evidence types
- Related sightings
- Related testimony
- Confidence
- Preceding events
- Subsequent events

### Organization

An institution, agency, company, research group, military unit, media
organization, religious body, or informal network.

Organizations should support:

- Historical names
- Parent organizations
- Child organizations
- Personnel
- Programs
- Locations
- Documents
- Public positions
- Alleged activities
- Provenance for every allegation

### Sighting

A structured observation report.

Sightings should support:

- Date and time
- Duration
- Geographic location
- Number of witnesses
- Observation conditions
- Visual characteristics
- Motion
- Sound
- Electromagnetic effects
- Physiological effects
- Radar involvement
- Sensor involvement
- Photographic evidence
- Video evidence
- Five Observables classification
- Conventional explanations considered
- Investigation status

### Testimony

A first-person or attributed account.

Testimony should record:

- Speaker
- Interviewer
- Date
- Context
- Original source
- Transcript
- Exact quotations
- Later revisions
- Internal consistency
- Corroborating witnesses
- Conflicting accounts
- Reliability assessment
- Situational context

Testimony must not be treated as equivalent to physical or sensor evidence.

### Document

A primary or secondary textual source.

Documents should support:

- Original file
- OCR text
- Page anchors
- Extracted quotations
- Publication metadata
- Authors
- Provenance
- File hash
- Related entities
- Reliability
- Classification status
- Redactions
- Citation lineage

### Location

A geographic place associated with the research.

Locations should support:

- Coordinates
- Geographic hierarchy
- Historical names
- Time zone
- Nearby events
- Nearby infrastructure
- Map layers
- Uncertainty radius
- Sensitive-location controls

### Artifact

A physical, visual, technical, or digital object offered as evidence.

Examples:

- Material sample
- Photograph
- Film
- Radar capture
- Sensor data
- Audio recording
- Soil sample
- Medical record
- Drawing
- Star map
- Recovered fragment
- Instrument reading

Artifacts should support:

- Origin
- Chain of custody
- Current custodian
- Analysis history
- Laboratory results
- File hashes
- Transformations
- Authenticity concerns
- Related claims
- Competing interpretations

### Claim

A discrete proposition asserted by a source.

Examples:

- “A craft was recovered near Roswell.”
- “The object descended from 80,000 feet.”
- “A government program studied anomalous materials.”
- “The witnesses independently described the same symbols.”
- “The incident occurred near a nuclear installation.”

Every Claim should support:

- Exact statement
- Normalized proposition
- Claimant
- Original source
- Supporting evidence
- Contradicting evidence
- Related entities
- Confidence
- Epistemic status
- Alternative interpretations

Claims should be first-class objects where practical.

This prevents the system from confusing a source with the truth of what that
source asserts.

### Hypothesis

A structured explanatory model.

A Hypothesis should contain:

- Statement
- Scope
- Supporting evidence
- Contradicting evidence
- Assumptions
- Predictions
- Falsification criteria
- Competing hypotheses
- Confidence
- Status
- Version history

Possible hypothesis classes include:

- Extraterrestrial
- Cryptoterrestrial
- Ultraterrestrial
- Interdimensional
- Secret terrestrial technology
- Intelligence operation
- Sensor error
- Misidentification
- Psychological experience
- Social contagion
- Folkloric or cultural process
- Mixed-origin explanation

The system must not privilege any hypothesis by default.

---

## Epistemic Status

Every meaningful research object should expose one of the following statuses:

### Verified

Directly established by strong primary evidence.

### Corroborated

Supported independently by multiple credible sources.

### Plausible

Consistent with available evidence but not established.

### Contested

Credible sources materially disagree.

### Unverified

Asserted without sufficient confirmation.

### Discredited

Substantially undermined or demonstrated false.

### Unknown

Evidence is insufficient for classification.

Confidence is not the same as truth.

A confidence score should include:

- Component scores
- Supporting evidence
- Rationale
- Evaluating agent or researcher
- Evaluation date
- Known limitations

Never present a naked percentage as objective certainty.

---

## Relationship Model

Core relationship types may include:

- `occurred_at`
- `occurred_during`
- `witnessed_by`
- `reported_by`
- `documented_by`
- `authored_by`
- `references`
- `quotes`
- `affiliated_with`
- `employed_by`
- `participated_in`
- `located_near`
- `same_as`
- `possibly_same_as`
- `precedes`
- `follows`
- `corroborates`
- `partially_corroborates`
- `contradicts`
- `challenges`
- `contextualizes`
- `derived_from`
- `analyzed_by`
- `possessed_by`
- `supports_hypothesis`
- `challenges_hypothesis`
- `explained_by`
- `allegedly_connected_to`
- `shares_pattern_with`
- `requires_verification`

Each relationship should support:

```ts
interface ResearchRelationship {
  id: string
  sourceEntityId: string
  targetEntityId: string

  type: RelationshipType
  direction: 'directed' | 'bidirectional' | 'undirected'

  label?: string
  description?: string
  rationale?: string

  confidence?: number

  epistemicStatus:
    | 'verified'
    | 'corroborated'
    | 'plausible'
    | 'contested'
    | 'unverified'
    | 'discredited'
    | 'unknown'

  supportingSourceIds: string[]
  contradictingSourceIds: string[]

  createdBy: string
  creationMode: 'human' | 'ai_suggested' | 'ai_confirmed' | 'imported'

  createdAt: string
  updatedAt: string

  validFrom?: string
  validTo?: string

  notes?: string
  tags?: string[]
}
```

---

## Core Operations

### Ingest

A source is added to the raw archive and submitted for processing.

A complete ingest should:

- Preserve the original file
- Generate a cryptographic hash
- Extract text or create a transcript
- Preserve page or timestamp anchors
- Identify source metadata
- Identify people
- Identify organizations
- Identify events
- Identify locations
- Extract quotations
- Extract claims
- Identify artifacts
- Detect references to known entities
- Suggest canonical matches
- Detect duplicate or near-duplicate sources
- Detect likely circular sourcing
- Create or update source summaries
- Update relevant entity pages
- Update relevant event pages
- Update relevant topic pages
- Add or revise relationships
- Update contradiction records
- Update hypothesis evidence
- Suggest new questions
- Update indexes
- Append an audit-log entry
- Present uncertain changes for human review

A single source may update many pages and graph records.

The system should support both:

- Supervised single-source ingestion
- Batch ingestion with review queues

For important or controversial sources, prefer supervised ingestion.

### Query

A researcher asks a question against the compiled research model.

The agent should:

- Read the relevant indexes
- Identify canonical entities and claims
- Retrieve relevant compiled pages
- Inspect supporting raw sources where necessary
- Distinguish evidence from interpretation
- Identify contradictions
- Identify source dependencies
- Compare competing explanations
- Produce a provenance-aware response
- Cite the supporting sources
- State limitations
- Offer the result for promotion into the research model

Possible outputs include:

- Direct answer
- Incident summary
- Comparison matrix
- Timeline
- Map
- Canvas
- Hunch
- Hypothesis evaluation
- Contradiction report
- Source lineage
- Research memo
- Guided tour
- Quilt section

Valuable answers should not disappear into chat history.

They may be promoted into:

- New compiled pages
- New Hunches
- New Canvases
- New relationships
- New research questions
- New hypothesis versions

### Compare

The Compare operation evaluates multiple sources, claims, witnesses, incidents,
or hypotheses together.

Examples:

- Compare two witness accounts
- Compare official and unofficial Roswell narratives
- Compare nuclear-site incidents
- Compare the Nimitz, Gimbal, and GoFast cases
- Compare extraterrestrial and secret-technology explanations
- Compare the public and internal histories of a government program

A comparison should identify:

- Agreements
- Contradictions
- Shared source lineage
- Independent corroboration
- Temporal inconsistencies
- Geographic relationships
- Terminology differences
- Missing evidence
- Possible reconciliation
- Remaining uncertainty

### Synthesize

Synthesis converts accumulated research into a higher-order interpretation.

Synthesis may produce:

- Hunch
- Canvas
- Quilt
- Hypothesis
- Narrative chronology
- Comparative model
- Research briefing

Every synthesis must preserve:

- Evidence boundaries
- Source citations
- Competing interpretations
- Unresolved contradictions
- Confidence
- Assumptions
- Falsification criteria

A compelling narrative is not necessarily a well-supported narrative.

The system must resist collapsing ambiguity merely to produce coherence.

### Promote

Promotion moves an ephemeral result into the persistent research model.

Examples:

- Promote a query answer into a topic page
- Promote a proposed relationship into a confirmed Thread
- Promote a pattern into a Hunch
- Promote a Hunch into a Hypothesis
- Promote a Canvas into a Quilt chapter
- Promote an AI-generated summary after human review

Promotion should record:

- Original generation
- Reviewing user
- Changes made
- Evidence used
- Promotion date
- Previous status
- New status

### Revise

New evidence may alter existing conclusions.

Revision should:

- Preserve previous versions
- Explain what changed
- Identify the triggering source
- Update affected pages
- Update relationships
- Update hypothesis support
- Mark superseded claims
- Preserve rejected interpretations for audit purposes

Research history should not be silently overwritten.

### Lint

Periodically run a health check over the entire research environment.

Look for:

- Contradictions between pages
- Claims with no source
- Relationships with no rationale
- Broken source links
- Missing page anchors
- Circular citation chains
- Duplicate entities
- Duplicate incidents
- Stale summaries
- Superseded claims
- Orphan pages
- Orphan Pins
- Hunches without falsification criteria
- Hypotheses without contradicting evidence
- High-confidence claims supported only by secondary sources
- Unverified claims rendered as fact
- Important concepts lacking pages
- Missing cross-references
- Sources not yet fully ingested
- AI suggestions awaiting review
- Research gaps that could be filled by new sources

A lint pass should generate:

- Findings
- Severity
- Affected records
- Recommended actions
- Optional repair plan

Never auto-correct high-impact epistemic issues without review.

---

## Specialized Agents

### Master Controller

Responsibilities:

- Analyze query complexity
- Select workflows
- Route subtasks
- Coordinate agents
- Enforce schema
- Perform final quality assurance

Query complexity may be classified as:

- Simple
- Moderate
- Complex
- Critical

### Pattern Recognition Agent

Responsibilities:

- Identify repeated structures
- Detect event clusters
- Detect geographic patterns
- Detect recurring motifs
- Detect terminology changes
- Identify possible flap behavior
- Compare phenomenology across cases
- Suggest candidate Hunches

The Pattern Recognition Agent must not equate correlation with causation.

### Evidence Evaluation Agent

Responsibilities:

- Assess source authority
- Assess evidence quality
- Evaluate provenance
- Detect circular sourcing
- Evaluate corroboration
- Identify contradictions
- Evaluate chain of custody
- Suggest epistemic status

### Scientific Anomaly Agent

Responsibilities:

- Evaluate physical claims
- Evaluate sensor data
- Evaluate materials analysis
- Evaluate aviation behavior
- Evaluate astronomy
- Evaluate technical feasibility
- Compare conventional explanations
- Identify required expertise

### Government Disclosure Agent

Responsibilities:

- Track agencies
- Track programs
- Track hearings
- Track legislation
- Track official statements
- Track declassification
- Compare public and internal positions
- Map personnel and institutional lineage

### Media Analysis Agent

Responsibilities:

- Track framing
- Detect narrative shifts
- Detect source recycling
- Analyze amplification
- Analyze suppression claims
- Detect likely information operations
- Compare media treatment across periods

### Witness Psychology Agent

Responsibilities:

- Analyze testimony structure
- Compare revisions
- Assess situational context
- Identify memory contamination risks
- Identify social influence
- Avoid reducing testimony to either literal fact or pathology

### Real-Time Monitor

Responsibilities:

- Track new reports
- Track official releases
- Track hearings
- Track geographic clusters
- Track media activity
- Detect potentially significant changes
- Create reviewable candidate events

### Strategic Synthesis Agent

Responsibilities:

- Integrate agent findings
- Construct competing explanations
- Identify unresolved questions
- Generate bounded conclusions
- Produce Canvas and Quilt drafts
- Identify falsification criteria
- Recommend next research actions

---

## Human Governance

AI contributions must use explicit workflow states:

- Suggested
- Under review
- Accepted
- Modified
- Rejected
- Superseded
- Archived

The agent may propose:

- Entities
- Claims
- Relationships
- Hunches
- Hypotheses
- Contradictions
- Summaries
- Canonical merges

Humans establish the canonical research model.

Accepted AI contributions should retain:

- Agent identity
- Generation timestamp
- Original proposal
- Human reviewer
- Changes made
- Approval state

---

## Indexing

Several indexes should help researchers and agents navigate the system.

### `index.md`

A human-readable catalogue of compiled research pages.

Possible sections:

- People
- Events
- Organizations
- Sightings
- Testimonies
- Documents
- Locations
- Artifacts
- Topics
- Claims
- Hypotheses
- Canvases
- Quilts

Each entry should include:

- Link
- One-line summary
- Epistemic status
- Source count
- Last updated
- Open questions

### `sources-index.md`

A catalogue of raw and processed sources.

Each entry may include:

- Source title
- Type
- Author
- Date
- Provenance
- Ingestion status
- Entity count
- Claim count
- Reliability assessment
- Hash
- Local path

### `claims-index.md`

A catalogue of discrete claims.

Each entry may include:

- Normalized claim
- Claimant
- Earliest known source
- Supporting sources
- Contradicting sources
- Epistemic status
- Confidence
- Related hypotheses

### `hypotheses-index.md`

A catalogue of active and archived hypotheses.

Each entry may include:

- Hypothesis statement
- Status
- Confidence
- Supporting evidence count
- Contradicting evidence count
- Predictions
- Falsification criteria
- Last evaluated

### `questions-index.md`

A catalogue of unresolved research questions.

Each question may include:

- Question
- Originating Canvas
- Relevant entities
- Relevant sources
- Priority
- Research status
- Suggested next action

---

## Logging

Maintain an append-only log of material research operations.

Suggested format:

```md
## [2026-07-25] ingest | RAAF Press Release
## [2026-07-25] query | Nuclear-site event correlation
## [2026-07-25] compare | Salas and Figel testimony
## [2026-07-25] promote | Nuclear relationship Hunch
## [2026-07-25] revise | Roswell event chronology
## [2026-07-25] lint | Global evidence audit
```

Each entry should record:

- Operation
- User
- Agent
- Sources touched
- Records created
- Records updated
- Relationships added
- Relationships removed
- Human-review status
- Brief rationale

The log provides:

- Research history
- Auditability
- Debugging
- Recent-context awareness
- Reproducibility

---

## Recommended Repository Structure

```text
ultraterrestrial/
├── AGENTS.md
├── README.md
├── raw/
│   ├── documents/
│   ├── images/
│   ├── audio/
│   ├── video/
│   ├── datasets/
│   ├── web-captures/
│   └── manifests/
├── ledger/
│   ├── sources/
│   ├── hashes/
│   ├── citation-lineage/
│   └── chain-of-custody/
├── entities/
│   ├── personnel/
│   ├── events/
│   ├── organizations/
│   ├── sightings/
│   ├── testimonies/
│   ├── documents/
│   ├── locations/
│   ├── artifacts/
│   └── topics/
├── claims/
│   ├── active/
│   ├── contested/
│   ├── discredited/
│   └── superseded/
├── hypotheses/
│   ├── active/
│   ├── archived/
│   └── comparisons/
├── canvases/
├── quilts/
├── questions/
├── contradictions/
├── reports/
├── indexes/
├── logs/
├── schema/
└── tools/
```

This structure is illustrative rather than mandatory.

The implementation may instead use PostgreSQL, a graph database, object storage,
and generated views.

The conceptual separation is more important than the physical directories.

---

## Page Frontmatter

Compiled pages should use consistent metadata.

Example:

```yaml
---
id: event-roswell-1947
type: event
title: Roswell Incident
aliases:
  - Roswell UFO Incident
  - Roswell Army Air Field Incident
epistemic_status: contested
confidence: 0.62
date_start: 1947-07-07
date_end: 1947-07-10
date_precision: range
location_ids:
  - location-roswell-new-mexico
  - location-foster-ranch
source_ids:
  - source-raaf-press-release-1947
  - source-roswell-daily-record-1947
supporting_claim_ids:
  - claim-debris-recovered
  - claim-flying-disc-announced
contradicting_claim_ids:
  - claim-weather-balloon-explanation
  - claim-project-mogul-explanation
tags:
  - roswell
  - recovery
  - military
  - disclosure
created_at: 2026-07-25
updated_at: 2026-07-25
review_status: reviewed
---
```

---

## Search and Retrieval

At small scale, indexes and direct file search may be sufficient.

At larger scale, use hybrid retrieval across:

- Full-text search
- BM25
- Vector similarity
- Graph traversal
- Metadata filters
- Date range
- Geographic distance
- Source type
- Epistemic status
- Confidence
- Entity type

Search should prioritize compiled pages for orientation and raw sources for
verification.

The agent should not cite a compiled summary when the original primary source is
available and relevant.

---

## Visual Projections

The same underlying graph should support multiple projections.

### Research Canvas

User-arranged Pins, Threads, Hunches, and notes.

### Chronology

Events and sources distributed across time.

### Geography

Events, sightings, organizations, and infrastructure projected onto maps.

### Evidence Matrix

Claims organized against supporting and contradicting evidence.

### Institutional Graph

People, programs, organizations, and affiliations.

### Hypothesis Lab

Evidence organized around competing explanations.

### Source Lineage

Primary sources, secondary sources, citation chains, and circular sourcing.

### Narrative Mode

A guided sequence used for research communication or public presentation.

Changing projection must not alter canonical data.

---

## Credibility Framework

Credibility evaluation should remain configurable and inspectable.

Possible factors:

- Source authority
- Evidence quality
- Witness reliability
- Technical feasibility
- Independent corroboration
- Temporal consistency
- Provenance integrity
- Chain of custody
- Internal consistency
- Alternative-explanation coverage

Possible contextual modifiers:

- Government acknowledgement
- Multi-sensor confirmation
- Military or aviation witness
- Physical effects
- Anonymous-only sourcing
- Commercial incentive
- Repeated story changes
- Known hoax pattern
- Broken provenance
- Circular citation

The credibility system must not become an invisible truth machine.

Every score should explain itself.

---

## Operational Rules

### Preserve originals

Never modify raw sources.

### Cite primary material

Prefer original records over summaries.

### Separate claim from source

A source making a claim does not establish the claim.

### Preserve uncertainty

Do not convert incomplete evidence into false precision.

### Record contradictions

Do not silently reconcile conflicting evidence.

### Maintain competing hypotheses

Do not optimize the system toward one preferred explanation.

### Require provenance

No canonical claim without a traceable source.

### Preserve history

Do not erase rejected or superseded interpretations.

### Human approval

Do not promote uncertain AI-generated relationships automatically.

### Incremental schema evolution

Map new material to existing entities before changing the ontology.

### Research before narrative

A compelling Quilt should emerge from the evidence model, not dictate it.

---

## Why This Works

The difficult part of long-term research is not merely collecting documents.

It is maintaining the analytical structure around them:

- Updating summaries
- Reconciling names
- Tracking source lineage
- Maintaining cross-references
- Revising chronologies
- Flagging contradictions
- Tracking changing testimony
- Comparing hypotheses
- Preserving uncertainty
- Recording how conclusions evolved

Humans often abandon research wikis because the maintenance burden grows faster
than the perceived benefit.

An LLM agent can perform that maintenance continuously.

The human remains responsible for:

- Source selection
- Research direction
- Interpretation
- Skepticism
- Ethical judgment
- Final canonical approval

The agent is responsible for:

- Filing
- Linking
- Updating
- Comparing
- Logging
- Surfacing contradictions
- Suggesting questions
- Maintaining consistency

The result is not merely a searchable archive.

It is a persistent, evolving model of the domain.

- The archive preserves what was found.
- The graph preserves how it connects.
- The ledger preserves why it should be trusted.
- The hypotheses preserve what it might mean.
- The Canvases preserve how it was investigated.
- The Quilts preserve how it can be communicated.

That is the operating model of Ultraterrestrial.
