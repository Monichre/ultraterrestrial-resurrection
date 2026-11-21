# UFO Database Merge — Pseudocode

**Created:** 2026-08-08

```
INPUTS:
  timeline_tsv   // date, name, photo src, claim, description, article link
  incidents_tsv  // name, date, photo href, photo src, description

NORMALIZE(row):
  slug  ← last path segment of URL (timeline article link OR incident photo href)
  norm  ← lowercase name, strip accents/quotes/punctuation, drop stopwords
  years ← extract 18xx–20xx from date + name

MATCH:
  1. Apply MANUAL_PAIRS (known dual-catalog aliases by slug fragment)
  2. Exact slug equality between timeline ↔ incident
  3. Fuzzy: SequenceMatcher + token Jaccard on norm names
       + year overlap / ±4yr nearness gate
       + bonus for shared distinctive tokens (len ≥ 5)
       accept if score ≥ 0.55

MERGE each matched pair into one record:
  canonical_name ← timeline name (editorial)
  aliases        ← {timeline name, incident name}
  date           ← timeline date (chronology spine)
  date_incident  ← incident date (often more precise)
  claim          ← timeline claim (empty for incident-only)
  description    ← longer of timeline vs incident blurb
  photo_src      ← prefer incident gallery; skip not-found placeholders
  timeline_url / incident_url / primary_url (prefer incident page)
  sources        ← ["timeline"], ["incident"], or both
  match_method / match_score

APPEND unmatched timeline rows and unmatched incident rows

SORT by earliest year, then name

OUTPUT:
  merged-catalog.json
  merged-catalog.tsv
```
