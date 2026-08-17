---
status: live
role: eng
spine: what
updated: 2026-08-17
---

# Intake OCR census — all 14,367 PDFs in corpus/intake/

**Ticket:** T-061 ([`docs/plans/TODO.md`](docs/plans/TODO.md)) · **Lane:** A — Corpus & Ingestion
**Row data:** [`packages/knowledge-base/metadata/intake-ocr-census.jsonl`](packages/knowledge-base/metadata/intake-ocr-census.jsonl) — one row per PDF
**Parent:** [`docs/plans/2026-08-17-t061-files-taxonomy-and-corpus-storage.md`](docs/plans/2026-08-17-t061-files-taxonomy-and-corpus-storage.md)

**Method:** `pdftotext -l 15`, then the ratio of extracted tokens that are common English words. Deliberately **not** chars-per-page: that metric rated a scan-noise file "healthy" at 3,592 chars/page earlier in T-061 and produced a false negative. Volume is not validity.

## Verdicts

| verdict | count | meaning |
| --- | --- | --- |
| `healthy` | 10,349 | >15% valid words — real text layer |
| `weak` | 3,241 | 8–15% — text present but noisy |
| `poor` | 424 | <8% — mostly garbage |
| `scan_no_text` | 353 | zero words extracted — pure image |
| `zero_byte` / `unreadable` | 0 / 0 | |

## The OCR job is smaller than I estimated

**777 files** (`scan_no_text` + `poor`) · **1.05 GiB** · **3,712 pages**

At the rate measured on the CREST scans (~1.2 s/page, `--jobs 4`): **~1.2 hours**.

That corrects the 6–10 h figure I gave earlier, which wrongly extrapolated per-*file* timing from large multi-hundred-page CREST documents. These candidates average 4.8 pages. The file *count* (777) landed near the 60-file sample estimate (~718); the duration did not.

## Where the candidates are

| files | MiB | directory |
| --- | --- | --- |
| 116 | 0 | `war_gov_ufo_files/release_01/documents/__MACOSX/Release_1` |
| 59 | 14 | `UFO Files/sf_chronicle` |
| 48 | 17 | `UFO Files/CIA Docs/stargate/STARGATE #5 177/Part0013` |
| 38 | 39 | `greer-document-library` |
| 31 | 47 | `war_gov_ufo_files/release_01/documents/Release_1` |
| 30 | 108 | `UFO Files` |
| 30 | 67 | `UFO Files/riley_crabb_bsra_official_docs` |
| 27 | 17 | `UFO Files/CIA Docs/stargate/STARGATE #7 179/Part0006` |
| 25 | 11 | `UFO Files/CIA Docs/UFO Documents - Complete Collection - CIA Declassif` |
| 24 | 10 | `UFO Files/CIA Docs/Ufology/Deprecated - CIA Declassified Documents` |

## Largest by page count

| pages | MiB | file |
| --- | --- | --- |
| 154 | 7.8 | `UFO Files/Marjorie Cameron Part 01 of 01.PDF` |
| 99 | 5.5 | `UFO Files/CIA-RDP96-00792R000300330001-8.pdf` |
| 80 | 1.8 | `UFO Files/CIA-RDP96-00789R002200070001-0.pdf` |
| 43 | 3.4 | `UFO Files/CIA Docs/stargate/STARGATE #6 178/Part0007/CIA-RDP96-0` |
| 41 | 1.7 | `UFO Files/CIA-RDP96-00788R001800230001-8 (1).pdf` |
| 41 | 1.7 | `UFO Files/CIA-RDP96-00788R001800230001-8.pdf` |
| 39 | 1.0 | `UFO Files/CIA Docs/stargate/STARGATE #8 237/Part0002/CIA-RDP96-0` |
| 38 | 7.6 | `UFO Files/CIA-RDP96-00789R002100220001-4.pdf` |
| 37 | 9.8 | `UFO Files/BlockedEpistemoloy_MJ12.pdf` |
| 33 | 2.6 | `UFO Files/CIA Docs/stargate/STARGATE #2 174/Part0001/CIA-RDP96-0` |
| 31 | 44.1 | `UFO Files/Sedge-Masters.pdf` |
| 31 | 40.3 | `UFO Files/gerald_light_bsra/Gerald Light, Signs in the Skies.pdf` |

## The judgment call this exposes

**3,241 files rate `weak`** (8–15% valid words) — a text layer exists but is noisy. They are excluded from the 777 count, and they are the real decision: re-OCR could improve them or degrade them. T-061 measured exactly this on three files and the result split — `fbi-roswell` improved 8.6% → 25.4%, `eisenhower-briefing` 31.4% → 35.4%, but `fbi-ufo-part-05` **degraded** 35.1% → 29.8% while extracting 75% *more* words. A blanket re-OCR of the weak tier would damage part of it. Any pass must compare per file and keep the better text, the way [`packages/knowledge-base/metadata/ocr-manifest.json`](packages/knowledge-base/metadata/ocr-manifest.json) records `preferred_text`.

## Priority order

1. **The 25 files in [`packages/knowledge-base/metadata/vector-store-gap-report.json`](packages/knowledge-base/metadata/vector-store-gap-report.json)** — documents the app demonstrably cannot retrieve today. Defect repair.
2. The remaining ~750 candidates — corpus-quality improvement, not a known failure.
3. The 3,241 weak-tier files — only with per-file comparison.
