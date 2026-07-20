---
status: live
role: research
spine: how
updated: 2026-07-19
---

# UAP/UFO Research Methodology Framework

**Created**: 2026-06-20  
**Purpose**: Systematic methodology for how this platform approaches UAP/UFO data analysis, investigation, and content ingestion — grounded in approaches developed by established researchers in the field.  
**Status**: Living document — intended to inform ingestion pipelines, entity classification, and search/analysis tooling.

---

## Researcher Lineage

This framework draws on three distinct but complementary methodological traditions:

**J. Allen Hynek** (astronomer, USAF Project Blue Book consultant, founder of CUFOS) established the first rigorous classification taxonomy for close encounters and introduced the paired strangeness-credibility rating to bring scientific structuring to field reports. His work demonstrated that anomalous phenomena warranted the same empirical seriousness applied to any observational science.

**Jacques Vallée** (computer scientist, astronomer) extended Hynek's taxonomy morphologically and added a "valence" dimension (hostility/benefit spectrum). His control-system hypothesis and inter-dimensional framework pushed methodology toward cross-cultural pattern comparison and away from single-hypothesis commitment. He argued for tracking correlations across seemingly unrelated phenomena — folklore, religious experience, psychological effects — as data rather than noise.

**Diana Pasulka Walsh** (historian of religion, UNC-Chapel Hill) brings a material-culture and archival lens: tracing how belief, document provenance, and institutional memory shape what counts as evidence. Her approach foregrounds source genealogy — who produced a document, under what institutional pressure, and how it traveled — as a first-class methodological concern, distinct from evaluating the event itself.

The framework below synthesizes these traditions into operational guidelines for the platform.

---

## 1. Classification Taxonomy

### 1.1 Event Type Hierarchy

| Level | Label | Definition |
|-------|-------|------------|
| L0 | Report | Raw unverified account — a witness claim, document, or media item |
| L1 | Sighting | Observable aerial/physical phenomenon, no direct interaction |
| L2 | Encounter | Physical proximity with effects (EM, physiological, trace evidence) |
| L3 | Contact | Claimed communication or interaction with non-human intelligence |
| L4 | Disclosure | Government, military, or institutional acknowledgment of events |
| L5 | Artifact | Physical material claimed to be of anomalous origin |

### 1.2 Close Encounter Classification (Hynek + Extensions)

| Class | Code | Criteria | Platform Entity Mapping |
|-------|------|----------|------------------------|
| Nocturnal Light | NL | Light in night sky, no structure visible | `sightings` |
| Daylight Disc | DD | Distinct aerial object, daylight, no close approach | `sightings` |
| Radar Visual | RV | Simultaneous radar + visual confirmation | `sightings` + `events` |
| Close Encounter 1 | CE1 | Object within ~150m, no physical effects | `sightings` |
| Close Encounter 2 | CE2 | CE1 + physical effects (burn marks, EM interference, physiological) | `sightings` + `artifacts` |
| Close Encounter 3 | CE3 | Occupants or entities visible | `sightings` + `key_figures` |
| Close Encounter 4 | CE4 | Abduction or direct contact claimed | `testimonies` + `key_figures` |
| Close Encounter 5 | CE5 | Human-initiated contact | `testimonies` + `events` |
| Close Encounter 6 | CE6 | Death or serious injury attributed to encounter | `testimonies` + `events` |
| Close Encounter 7 | CE7 | Hybrid or offspring claims | `testimonies` |

### 1.3 Strangeness × Credibility Rating

Hynek's paired ratings remain the most operationally useful field-triage tool. Apply both independently.

**Strangeness (S1–S5)**: How far does the reported observation deviate from known phenomena?

| Score | Description |
|-------|-------------|
| S1 | Consistent with misidentification (aircraft, weather, satellite) |
| S2 | Unusual but explainable with stretch (rare atmospheric, classified test) |
| S3 | Features that resist conventional explanation |
| S4 | Multiple anomalous features simultaneously; no plausible mundane fit |
| S5 | Phenomenon reported as physically impossible by current models |

**Credibility (C1–C5)**: How reliable is the source chain for this report?

| Score | Description |
|-------|-------------|
| C1 | Single anonymous/unverifiable witness; no corroboration |
| C2 | Named witness, no corroboration; or anonymous with minor corroboration |
| C3 | Multiple independent witnesses or physical trace evidence |
| C4 | Official documentation, trained observers, or multiple evidence types |
| C5 | Verified official record + independent corroboration + physical evidence |

High-value research targets: **S3–S5 × C3–C5**. These drive the platform's entity graph toward nodes worth deep investigation.

### 1.4 Platform Entity Mapping

| Platform Entity | Primary Classification Domain |
|----------------|------------------------------|
| `sightings` | NL, DD, RV, CE1, CE2 — the event itself |
| `events` | Institutional/historical events around disclosure or incidents |
| `key_figures` | Witnesses, researchers, officials, whistleblowers |
| `testimonies` | CE3–CE7 accounts; whistleblower statements; deathbed disclosures |
| `topics` | Thematic clusters (crash retrieval, UAP legislation, propulsion anomalies) |
| `organizations` | AATIP, UAPTF, MUFON, NICAP, civilian research groups, contractors |
| `artifacts` | Physical material, leaked documents, alleged retrieved craft materials |

---

## 2. Evidence Evaluation Rubric

### 2.1 Source Tier Hierarchy

| Tier | Source Type | Examples |
|------|-------------|---------|
| T1 | Primary official | Declassified government documents (FOIA), congressional testimony, official investigation records |
| T2 | Primary civilian | Direct witness accounts (contemporaneous, signed), physical trace evidence with chain of custody |
| T3 | Secondary official | Journalist investigations citing named sources, official acknowledgments of T1 documents |
| T4 | Secondary civilian | Researcher syntheses citing T1/T2; academic papers; credentialed expert analysis |
| T5 | Tertiary | Books, documentaries, community databases citing T3/T4 |
| T6 | Unverified | Anonymous claims, undated documents, single-source assertions with no corroboration path |

**Ingest rule**: T1–T3 sources feed `documents` and `chunks` tables with full provenance metadata. T4–T5 inform `topics` and `organizations` entity tags. T6 is flagged for manual review — not discarded, but not promoted automatically.

### 2.2 Corroboration Matrix

A report's evidential weight increases multiplicatively when independent corroboration lines converge:

| Corroboration Type | Weight Boost |
|-------------------|-------------|
| Multiple independent witnesses (unconnected prior to event) | +2 |
| Physical trace evidence (laboratory analyzed) | +2 |
| Radar or sensor confirmation | +2 |
| Official documentation of the event | +2 |
| Photographic/video with chain of custody | +1 |
| Media contemporaneous coverage | +1 |
| Cross-referenced in independent research (2+ sources) | +1 |

Score 0–3: Low corroboration. Score 4–6: Moderate. Score 7+: High — prioritize for graph connection and semantic search indexing.

### 2.3 Chain of Custody for Documents and Testimony

Following Pasulka's archival lens, every ingested document should carry:

1. **Origin**: Who produced it, in what institutional role, on what date
2. **Chain**: How it moved from producer to current repository (FOIA release, leak, archive donation)
3. **Integrity signals**: Whether metadata matches claimed date, redactions are consistent with known classification practices, document style matches era
4. **Counter-indicators**: Any signs of fabrication, anachronistic language, inconsistent classification markings

These fields map to the `documents` table metadata and should be captured during the `ingest.py` pipeline run (`packages/db/scripts/rebuild/ingest.py`).

---

## 3. Source Verification Protocol

### 3.1 Primary vs Secondary Distinction

| Question | Primary | Secondary |
|----------|---------|-----------|
| Who produced it? | The entity with direct knowledge or authority | Someone reporting what a primary source said |
| Can you trace back to the origin event? | Yes — it is the origin record | Partially — requires following citations |
| Appropriate use | Ground truth for entity facts | Contextualizing, cross-referencing, building topic clusters |

### 3.2 Witness Reliability Factors

Drawn from Hynek's field methodology and expanded for the platform context:

| Factor | High Reliability Signal | Low Reliability Signal |
|--------|------------------------|----------------------|
| Occupation/training | Military, aviation, law enforcement, scientific | No stated profession |
| Observation conditions | Daylight, clear sky, extended duration | Night, brief, obscured |
| Time to report | Immediate or within hours | Years post-event |
| Contemporaneous notes | Written log, official report filed | Recalled from memory only |
| Corroboration | Other witnesses present, independent confirmation | Sole witness |
| Consistency | Account stable across multiple retellings | Significant embellishment over time |
| Motive assessment | No discernible gain; professional risk | Financial, fame, or legal incentive |

### 3.3 Document Provenance Checklist

Before promoting a document to T1/T2 status in the ingestion pipeline:

- [ ] FOIA request number or archive accession number recorded
- [ ] Release date and releasing agency recorded
- [ ] Redaction pattern consistent with known classification standards (EO 13526)
- [ ] Document date consistent with metadata and referenced events
- [ ] Original scan or certified copy available (not OCR-only reconstruction)
- [ ] No anachronistic terminology or formatting for claimed era
- [ ] Cross-referenced against at least one other T1/T2 source touching the same event

---

## 4. Pattern Analysis Methodology

### 4.1 Temporal Clustering

Vallée's morphological approach demonstrated that incident waves cluster in time in ways that do not map to media cycles alone. Analysis targets:

- **Wave detection**: Identify periods with statistically anomalous incident density (baseline: global average incidents/month across the `sightings` table)
- **Lag analysis**: Measure time between classified event and public disclosure (event date → `events.date` vs first `documents` FOIA release date)
- **Disclosure correlation**: Track whether legislative events (UAP hearings, NDAA amendments) correlate with whistleblower testimony clusters in `testimonies`

The platform's existing timeline view and `NetworkTimelineExplorer` (SP4 cherry-pick) provides the UI layer; the analysis queries should run against `packages/db` using `getSql()` tagged-template queries.

### 4.2 Geographic Clustering

The `useSpatialGrouping` hook already implements R-Tree proximity queries. Research methodology extends this with:

- **Hot-zone identification**: Recurring incident areas (Hessdalen, Skinwalker Ranch, Gulf coast UAP corridors, nuclear facility perimeters)
- **Infrastructure correlation**: Proximity to military installations, nuclear sites, underwater features
- **Cross-incident linking**: When two incidents share a geographic cluster, auto-suggest relationship edges in the mindmap graph

Strangeness × geographic density is a high-signal combination (S3+ events in known hot zones).

### 4.3 Morphological Clustering (Vallée)

Group incidents by reported object characteristics independent of time or location:

| Morphological Dimension | Values |
|------------------------|--------|
| Shape | Disc, triangle, sphere, cigar, irregular |
| Size | Small (<3m), medium (3–30m), large (>30m) |
| Luminosity | Self-luminous, reflective, dark |
| Motion | Hovering, linear, erratic, orbital |
| Effects | EM, thermal, acoustic, physiological, trace |
| Duration | <1min, 1–10min, >10min |

These dimensions should be captured as structured fields on `sightings` records. The pgvector semantic search already enables similarity queries across unstructured testimony — morphological tagging adds a structured filter layer.

### 4.4 Cross-Entity Pattern Detection

Using the entity graph (mindmap agent's `loadEntityGraph` + `searchDatabase` tool):

1. **Hub detection**: `key_figures` with high edge counts across multiple `events` are high-value investigation targets
2. **Organization tracing**: When multiple whistleblowers share an `organizations` node, trace forward and backward in time
3. **Topic co-occurrence**: `topics` that consistently co-appear with high-strangeness `sightings` are candidate research threads
4. **Document-to-testimony bridging**: When a `documents` chunk semantically matches a `testimonies` record (pgvector cosine similarity > 0.85), flag for manual correlation review

---

## 5. Pipeline Integration

### 5.1 Ingestion Flow (Knowledge Base → Database)

```
packages/knowledge-base/sources/files/   (PDFs, transcripts, declassified docs)
    ↓
packages/db/scripts/rebuild/ingest.py    (chunking, metadata extraction)
    ↓
documents table + chunks table           (with provenance metadata fields)
    ↓
packages/db/scripts/rebuild/embed_entities.py   (text-embedding-3-small @ 1536 dims)
    ↓
entity tables (sightings, events, key_figures, testimonies, topics, organizations, artifacts)
    with embedding vectors populated
```

**Methodology application at ingestion**:
- Assign source tier (T1–T6) during `ingest.py` based on document provenance
- Tag close encounter class and strangeness score as structured metadata where determinable
- Flag documents lacking chain-of-custody fields for manual review queue
- Record `morphological_tags` as a JSONB field on `sightings` rows

### 5.2 Mindmap Agent Integration

The Disclosure Mindmap Agent (`/api/disclosure/mindmap`) runs three search tools on each query:

| Tool | Methodology Hook |
|------|-----------------|
| `file_search` (OpenAI vector store) | Retrieves documents by semantic proximity — apply source tier as a filter signal |
| `searchDatabase` (FTS + pgvector via `@db/postgres`) | Structured entity search — strangeness/credibility scores and morphological tags are filterable fields |
| `searchExternalResources` (Exa) | Real-time web search — treat results as T5/T6 until provenance is established |

When the agent surfaces entity nodes in the mindmap graph, strangeness (S) and credibility (C) scores should be surfaced as node metadata to inform user investigation priority.

### 5.3 Investigation Integration (Future)

When the Research Canvas panel is integrated (Feature #5 in FEATURES.md), Investigations should scaffold around this methodology:

- Investigation opening: select primary classification target (event type, CE class)
- Evidence layer: attach Documents with Source Tier labels
- Corroboration tracker: visualize the Corroboration Score as evidence is added
- Pattern flags: auto-highlight Hot Zone / Wave membership from the existing entity graph

---

## 6. Application to Specific Research Areas

### 6.1 Crash Retrieval Claims

High-strangeness category (S5 by definition). Apply maximum scrutiny on chain-of-custody for alleged material evidence. Cross-reference witness testimony against known personnel records where available. Track organizational affiliations of claimants — many credible witnesses emerge from specific contractor networks.

### 6.2 Government Disclosure Documents

Default T1 when FOIA-provenance is established. Check for authentication markers. Cross-reference with contemporaneous FOIA logs (National Security Archive, Black Vault) to confirm release history. Map document authors to `key_figures` and organizational affiliations to `organizations`.

### 6.3 Whistleblower Testimony

Apply full witness reliability rubric. Assess whether testimony is contemporaneous or retrospective. Check for institutional affiliation that provides context for what the witness could credibly have known. Cross-reference claimed events against dated `documents` — convergence increases credibility score.

### 6.4 Photographic and Video Evidence

Chain of custody is paramount. Metadata should be examined (EXIF, capture device, upload history). Morphological classification should be applied to the object. Track provenance from capture → first publication → subsequent appearances. Flag any case where provenance breaks.

---

*This framework is operational documentation for the platform's research and ingestion teams. It is not a position statement on the nature of the phenomena under investigation. The methodology's purpose is to maximize evidential rigor, minimize motivated reasoning, and surface high-signal patterns in a 230,000+ record corpus.*
