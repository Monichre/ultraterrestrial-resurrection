# AppliedGraphSkill_PSUEDOCODE

**Export:** three NEW folders only. Do not modify any existing file in
ultraterrestrial-resurrection, design-capture, or knowledge-interfaces.

```
ultraterrestrial-resurrection/to-graph-skill-applied/
design-capture/to-graph-skill-applied/
knowledge-interfaces/to-graph-skill-applied/
```

Leave `design-capture/to-graph-skill-template/` untouched.

---

## The confusion this pack fixes

`05-graph-schema.md` in the original template listed `MediaAsset` and `Author`
as if they were innate LPG labels. They are a **bookmark / media-library overlay**.

```
KERNEL (always)     vs     OVERLAY (this domain only)
Resource                   Sighting | NamedToken | moc
Chunk                      document_chunks | screenshot region | Evidence excerpt
Entity (typed by overlay)  KeyFigure | Component | concept/pattern/gotcha
Claim + evidence pointer   UT claims; design "uses token"; hypergraph node statements
provenance, confidence     same properties, different predicates
```

`Author` in UT is a **role of KeyFigure**, not a kernel node.
`MediaAsset` is first-class in design-capture (screenshots), optional elsewhere.
Hypergraph does not need either.

---

## File set per folder

```
README.md                 how to read: kernel vs overlay
00-kernel.md              IDENTICAL in all three — methodology + best practices
01-vocabulary.md          kernel terms + this domain's field language
02-diagrams.md            kernel pipeline + this domain's ontology
03-types.ts               kernel contracts + overlay unions
04-structured-asks.md     stage prompts with overlay lists filled in
05-graph-schema.md        Part A kernel (same idea) / Part B this domain (tables, edges)
06-source-adapters.md     this project's real sources
07-storage-decision.md    this project's actual landing zone
08-domain-overlay.yaml    machine-readable overlay
AppliedGraphSkill.md      architecture of this pack
```

`00-kernel.md` is copied verbatim so a reader can diff the three packs and see
that only overlay files change.

---

## Domain overlays (from live code, not invention)

### Ultraterrestrial
Tables in `packages/db/migrations/rebuild/0001_init.sql`:
key_figures, events, organizations, locations, testimonies, topics,
documents, artifacts, sightings, document_chunks, document_entities,
nodes, edges, junction tables (organization_members, event SMEs, topics_testimonies).
ADR-0001: Evidence chunks; agent_inferences is Layer D.

### Design-capture
CONTEXT.md + `src/evidence-types.ts` + `src/spec.ts` + `src/tokens.ts`:
Source → CapturedData (Layer A) → named tokens / components / motion (Layer C)
→ DesignSpec.cloneGuidance / overallAesthetic (Layer D).
MediaAsset belongs here. Author does not.

### Knowledge-interfaces
CONTEXT.md + `knowledge-cli/src/hypergraph/schema.js`:
Source, Evidence, GraphNode { moc, concept, pattern, gotcha }, evidenceIds, wikilinks.
Idea Garden / Topologies are visualization overlays on notes-as-Resources.

---

## Writing rules

- Every 05 opens with "Part A is kernel. Part B is this domain. Do not mix."
- Worked example: original template's MediaAsset/Author called out as overlay.
- UT markdown file refs must be repo-root links.
- No UFO copy in design-capture or knowledge-interfaces overlays.
- No DesignSpec copy in UT overlay.
