# NER Extraction Protocol

*Named entity recognition for UAP document processing and graph ingestion*

**Document Version**: 2.0  
**Last Updated**: 2026-07-19T00:40:00-05:00  
**Authority**: AI Platform + Research Division  
**Status**: Operational methodology (informs prompts; not a runtime prompt by itself)

---

## Purpose

Specify how Named Entity Recognition (NER) must behave on UFO/UAP/Disclosure text so extractions are:

1. Faithful to source Claims  
2. Compatible with platform record types  
3. Safe for RAG indexing and Postgres entity graphs  

**Related prompts:** `templates/enhanced_ner.yaml`, `sets/disclosure/ner.v1.yaml`, `templates/validation.yaml`.

---

## Domain Mapping

| Domain record | Wire `type` (legacy schema enum) | Notes |
|---------------|----------------------------------|--------|
| Key Figure | `PERSONNEL` | Prefer “Key Figure” in new prose; wire stays PERSONNEL |
| Event | `EVENT` | Named historical frame, not every Sighting |
| Organization | `ORGANIZATION` | Agency, unit, contractor, research group, media org |
| Location | `LOCATION` | Never fabricate coordinates |
| Document / Testimony / sensor-physical support | `EVIDENCE` | Use `attributes.subtype` |
| Topic / Sighting / Artifact | attributes / related names | Not separate wire enums yet |

---

## Epistemic Separation

| Term | NER handling |
|------|----------------|
| **Claim** | Extractable assertion from source; may appear in attributes or claims arrays |
| **Inference** | Extractor judgment (credibility tier, priority) — never becomes entity `name` |
| **Evidence** | Source-derived support; span quotes are Evidence fragments |

Eight evidentiary states (use on entities/edges when confidence warrants):  
`Observed` · `Corroborated` · `Contested` · `Inferred` · `Speculative` · `Resonant` · `Unverified` · `Disconfirmed`

Do not default-fill a state. No prefix means no badge.

---

## Extraction Rules

### Always

- Extract only entities supported by the text (or resolvable anaphora within the same document).
- Include `span_quote` (≤240 chars) when possible.
- Normalize dates toward ISO 8601; preserve partial dates (`1994-09`, `June 2023`) rather than inventing day precision.
- Capture aliases (`Cmdr. Fravor` / `David Fravor`) under one canonical `name` when clearly the same person.
- Assign `confidence` in `[0,1]` honestly; high confidence requires strong textual support.

### Never

- Invent Key Figures, Organizations, or coordinates to “complete” a schema.
- Upgrade anonymous sources to named witnesses.
- Use media virality as credibility tier inflation.
- Emit Resonant/mythic parallels as Corroborated Evidence.
- Write absolute language (“proves”, “confirmed NHI”) into attributes.

### Credibility tiers (Key Figures)

| Tier | Score | Typical support |
|------|-------|-----------------|
| 1 | 9–10 | Military aviators, astronauts, radar/sensor operators with named credentials |
| 2 | 7–8 | Commercial pilots, credentialed scientists, sworn LE |
| 3 | 5–6 | Multiple named civilians / trained observers |
| 4 | 3–4 | Single named civilian, limited corroboration |
| 5 | 1–2 | Anonymous, pseudonymous, unverified |

Tiers are Inferences about the *source role*, not proof of the *phenomenon*.

---

## Relationships

Allowed families: Temporal · Spatial · Evidential · Organizational · Attributional.

Each edge needs:

- `target` present in the same extraction set  
- `type` from an allowed family (or clear subtype)  
- `confidence`  
- Prefer evidentiary_state `Inferred` on edges that are analytical links

---

## Validation Before Persistence

1. JSON conforms to attached schema.  
2. Every entity name appears in source or documented alias chain.  
3. Coordinates only if explicit or standard gazeteer match for an unambiguous named site — otherwise omit.  
4. Hoax/contamination cues → lower confidence + Contested/Unverified.  
5. Physics-impossible performance Claims → do not normalize into capability facts; flag Speculative/Contested.  
6. `validation` prompt verdict must be `pass` or `pass_with_warnings` with `safe_for_db_write: true`.

---

## Researcher Method Lineage (calibration, not proof)

Use methodological posture from Hynek (descriptive encounter classes), Vallée (information / control patterns, multi-hypothesis), and Pasulka (belief formation / sacred-tech narratives as Resonant) to *interpret*, never to auto-create entities.

---

## Cross-Links

- `RAG_DOCUMENT_PROCESSING.md` — when NER runs in the ingestion pipeline  
- `EVIDENCE_EVALUATION_FRAMEWORK.md` — reliability scale 1–5  
- `CLASSIFICATION_QUICK_REFERENCE.md` — field triage  
- `../CONTEXT.md` — prompt corpus vocabulary  
- `../../../CONTEXT.md` — system reserved words
