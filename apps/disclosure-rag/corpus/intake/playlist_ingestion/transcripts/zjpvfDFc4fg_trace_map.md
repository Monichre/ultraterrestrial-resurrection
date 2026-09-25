# Trace Map — Zjpvfdfc4Fg

- **Source ID:** `src:41d82cb86aad2056`
- **Source:** corpus/intake/playlist_ingestion/transcripts/zjpvfDFc4fg.txt
- **Source type:** document · content type: mixed
- **Source hash:** `sha256:6d60fd3ba4d3a55191de1656ab7b52379e24ba12afa487281cdabbff7acd4173`
- **Schema:** `trace-map.v1` · content version 1 · review state **unreviewed**
- **Generated:** 2026-08-15T11:13:16.761300+00:00 · methodology `rag-prompt-pipeline/ADR-0001`

## Legend

| Marker | Meaning |
| --- | --- |
| **Source material** | `segment`, `claim`, `evidence`, `entity` — every one carries an exact character span and, where timing exists, a timestamp |
| **[Inferred]** | `inference` — produced by a model, never by the source. Never Evidence, never a Claim |
| **Frontier** | `open_question` — what this source cannot resolve |
| Solid arrow | source-derived relationship |
| Dotted arrow | agent-produced relationship |

## Coverage

**No timed segment sidecar.** Nothing in this map carries a timestamp, and anchors are character offsets into the transcript only. Re-fetch the source to recover timing.

## Source spine

_No segments — the ingestion stage produced no chunks._

## Topics

_The chunker emitted no heading paths, so no topic tree exists._

## Claims and evidence

_No claims were extracted from this source._
## Open questions

_None recorded. That is a gap, not closure — see limitations._

### Next traces

_None. No stage in this pipeline proposes concrete next sources, so the frontier stops at the questions above rather than naming records to pull._

## Agent-produced readings [Inferred]

Nothing below is Evidence or a Claim. Each is a model's restatement or interpretation, kept because it is useful and labelled because it is not source material.

- **[Inferred]** {"finding": "Apollo 11 landed July 16, 1969; Aldrin held 33rd degree Scottish Rite Freemasonry rank", "date": "1969-07-1 — basis `analysis.key_findings`
- **[Inferred]** {"finding": "Edgar Mitchell founded Institute of Noetic Sciences post-Apollo 14 mission (1971)", "date": "1971"} — basis `analysis.key_findings`
- **[Inferred]** {"finding": "Jack Parsons born 1914 in Pasadena; co-founded rocketry group at Caltech's Arroyo Seco site that became JPL — basis `analysis.key_findings`
- **[Inferred]** {"finding": "First successful JATO flight in 1941; by 1942 US military ordering 20,000 units/month", "date": "1941-1942" — basis `analysis.key_findings`
- **[Inferred]** {"finding": "Parsons died in home laboratory explosion in 1952; officially ruled accident", "date": "1952"} — basis `analysis.key_findings`
- **[Inferred]** {"finding": "Babylon Working conducted approximately 1946 with L. Ron Hubbard as ritual partner", "date": "1946"} — basis `analysis.key_findings`
- **[Inferred]** {"finding": "Hermann Oberth published 'The Rocket into Planetary Space' in 1923", "date": "1923"} — basis `analysis.key_findings`
- **[Inferred]** {"finding": "American forces uncovered Nazi occult documents in a cave in southern Germany in 1945", "date": "1945"} — basis `analysis.key_findings`
- **[Inferred]** {"finding": "Edwin Hubble resolved individual stars in Andromeda using 100-inch Hooker telescope at Mount Wilson in 1923 — basis `analysis.key_findings`
- **[Inferred]** {"finding": "New York Times mocked rocketry in space in a 1920 editorial", "date": "1920"} — basis `analysis.key_findings`

## Trace index

Every diagram ID above resolves here. This table is the contract that makes the Mermaid views inspectable rather than decorative.

| Diagram ID | Node ID | Type | Segments | Time | Label |
| --- | --- | --- | --- | --- | --- |
| `n0` | `src:41d82cb86aad2056` | source | — | — | Zjpvfdfc4Fg |
| `n1` | `inf:41d82cb86aad2056:bd4ed519984f` | inference | — | — | {'finding': 'Apollo 11 landed July 16, 1969; Aldrin held 33rd degree Scottish Rite Freema… |
| `n2` | `inf:41d82cb86aad2056:aef5616a6540` | inference | — | — | {'finding': 'Edgar Mitchell founded Institute of Noetic Sciences post-Apollo 14 mission (… |
| `n3` | `inf:41d82cb86aad2056:5127d41fa0cb` | inference | — | — | {'finding': 'Jack Parsons born 1914 in Pasadena; co-founded rocketry group at Caltech's A… |
| `n4` | `inf:41d82cb86aad2056:82389a17040a` | inference | — | — | {'finding': 'First successful JATO flight in 1941; by 1942 US military ordering 20,000 un… |
| `n5` | `inf:41d82cb86aad2056:01bab2d245f0` | inference | — | — | {'finding': 'Parsons died in home laboratory explosion in 1952; officially ruled accident… |
| `n6` | `inf:41d82cb86aad2056:64c92d95da0f` | inference | — | — | {'finding': 'Babylon Working conducted approximately 1946 with L. Ron Hubbard as ritual p… |
| `n7` | `inf:41d82cb86aad2056:a4ce032a22ed` | inference | — | — | {'finding': 'Hermann Oberth published 'The Rocket into Planetary Space' in 1923', 'date':… |
| `n8` | `inf:41d82cb86aad2056:2a952460e695` | inference | — | — | {'finding': 'American forces uncovered Nazi occult documents in a cave in southern German… |
| `n9` | `inf:41d82cb86aad2056:2ff16b716727` | inference | — | — | {'finding': 'Edwin Hubble resolved individual stars in Andromeda using 100-inch Hooker te… |
| `n10` | `inf:41d82cb86aad2056:aca3002538e3` | inference | — | — | {'finding': 'New York Times mocked rocketry in space in a 1920 editorial', 'date': '1920'} |

**Edges:** 10 across 1 types — `based_on`

## Limitations

- ⚠️ no next_trace nodes — no pipeline stage proposes concrete next sources
- ⚠️ no reading nodes — no interpretive stage exists; readings are never inferred here
- ⚠️ no counter_reading nodes — paired with reading; unproduced for the same reason
- ⚠️ no speaker nodes — diarisation is unavailable — the transcript carries '>>' turn markers but no speaker identities
- ⚠️ no segments — the ingestion stage produced no chunks, so this map has no source spine and nothing in it is anchored to the source
- ⚠️ no claims anchored to source material
- ⚠️ no open questions — the map manufactures closure it has no basis for
- ⚠️ no evidence→claim edges — the analysis prompt emits supporting and contradictory evidence as flat lists with no target claim, so evidence carries a stance but names no claim it bears on
- ⚠️ no timed segment sidecar — nothing in this map carries a timestamp

