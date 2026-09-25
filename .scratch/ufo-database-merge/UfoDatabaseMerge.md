# UfoDatabaseMerge

**Created:** 2026-08-08  
**Source:** [theufodatabase.com](https://theufodatabase.com) timeline listing + incidents listing  
**Outputs:** `merged-catalog.json`, `merged-catalog.tsv`

## Verdict

Merged **60 timeline** + **57 incident** rows → **100 unique records** with **17 cross-catalog overlaps** collapsed into single rows (both URLs + both descriptions retained).

| Bucket | Count |
| -------- | ------: |
| Both sources (deduped) | 17 |
| Timeline-only (context / programs / culture) | 43 |
| Incident-only (case pages without timeline twin) | 40 |
| **Total** | **100** |

## Architecture

```
timeline-source.tsv  ──┐
                       ├──► match (manual → slug → fuzzy) ──► merged-catalog.{json,tsv}
incidents-source.tsv ──┘
```

### Record shape

| Field | Role |
| ------- | ------ |
| `canonical_name` | Display title (timeline editorial when present) |
| `aliases` | Timeline + incident titles when both exist |
| `date` / `date_incident` | Chronology spine vs incident-page date |
| `claim` | Timeline one-liner (incident-only rows empty) |
| `description` | Longer of the two blurbs |
| `photo_src` | Best image URL (incident preferred; drops `not-found`) |
| `timeline_url` / `incident_url` / `primary_url` | Links; primary prefers incident page |
| `sources` | `timeline`, `incident`, or both |
| `match_method` | `manual` \| `slug` \| `fuzzy` \| null |

## Key modules / process

1. **Ingest** — TSV parse of both scrapes (provenance copies kept beside outputs).
2. **Normalize** — slugs from URLs, stopword-stripped names, year extraction.
3. **Match** — 17 manual aliases for known dual pages; no fuzzy extras needed beyond those.
4. **Merge** — union fields; prefer incident photo + longer description; keep both URLs.
5. **Emit** — JSON catalog + flat TSV sorted by year.

## Matched overlaps (17)

Battle of LA · Kenneth Arnold · Roswell · McMinnville · Washington DC 1952 · Mainbrace · Florence 1954 · Westall · Jimmy Carter · Ronald Reagan · Ariel School · Phoenix Lights · Nimitz Tic-Tac · O'Hare · Theodore Roosevelt / GOFAST · ʻOumuamua · Racetrack UAPs

## Data flow (for corpus)

Existing Firecrawl dumps live at:

- `apps/disclosure-rag/corpus/intake/ufo-timeline/`
- `apps/disclosure-rag/corpus/intake/ufo-incidents/`

This merge is the **listing-layer index** over those pages — not a re-scrape. Next useful step: join `slug_timeline` / `slug_incident` to the on-disk JSON filenames for full markdown bodies.

## Next steps (suggested)

1. Wire `merged-catalog.json` → Neon `events` / waypoints seed for Spacetime or guided tours.
2. Join full page bodies from `corpus/intake/ufo-*` by slug.
3. Flag timeline-only institutional rows (`Project Sign`, NDAA, NASA study) vs incident-only case rows for separate UI lanes.
