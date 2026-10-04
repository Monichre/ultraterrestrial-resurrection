
# Recommended structure

knowledge-base/
  sources/                 # RAW, immutable intake
    files/                 # PDFs, scans, markdown, FOIA dumps
    web/                   # HTML/PDF snapshots + metadata
    youtube/               # transcripts + video metadata
  derived/                 # machine outputs; safe to regenerate
    text/                  # OCR’d, cleaned text
    embeddings/            # your vector_storage
  cases/                   # curated dossiers (human-facing)
    1976-09-tehran/        # <slug>
      case.md              # summary, timeline, claims, stance
      links.json           # references → canonical source_ids
      exhibits/            # selected exhibits copied/linked
  metadata/
    registry.jsonl         # the global catalog (see schema below)
    redirects.json         # path changes, if you reorganize

Why this split?
 • sources/ = ground truth & provenance (never edited in place)
 • derived/ = reproducible by script (delete/rebuild anytime)
 • cases/ = human-curated narrative that cites sources
 • documents/ as a bucket is too vague; “sources” is crisp and scales across your 3 input types

Source registry (the glue)

One line per intake item in metadata/registry.jsonl. Examples:

{"source_id":"src_8f9a...","type":"file","path":"sources/files/fbi/1976/iranaf1.pdf","sha256":"...","original_url":null,"fetched_at":"2025-06-20T01:33:06Z","license":"public-domain","status":"verified","case_slugs":["1976-09-tehran"]}
{"source_id":"src_a21b...","type":"web","path":"sources/web/ntsb/tehran-incident.singlefile.html","sha256":"...","original_url":"<https://example.org/tehran-incident","fetched_at":"2025-06-20T01:33:06Z","snapshot":"wayback:20250620","status":"archived"}>
{"source_id":"src_ytd3...","type":"youtube","path":"sources/youtube/8Gs.../transcript.en.vtt","sha256":"...","original_url":"<https://www.youtube.com/watch?v=8Gs...","yt":{"id":"8Gs...","channel":"..."},"fetched_at":"2025-06-20T01:33:06Z","status":"auto-transcript","case_slugs":[]}>

Must-haves in each record
 • source_id (content-hash derived; stable across moves)
 • type ∈ {file, web, youtube}
 • path (repo-relative)
 • sha256 (dedupe + integrity)
 • original_url (null for local-only files)
 • fetched_at
 • status (ingested | processed | verified | archived)
 • optional: case_slugs for backlinks

Naming & IDs
 • Filenames: YYYYMMDD_location_short-title[.ext]
 • Append short content hash for near-duplicates: ...__h_8f9a12.pdf
 • Case slugs: YYYY-MM-city-keyword
 • Friendly IDs: UT-YYYY-#### for public-facing references; map to internal source_id in registry.

Web & YouTube specifics

Web
 • Save a snapshot you control (HTML via SingleFile-like bundle or WARC) under sources/web/…
 • Keep original URL + snapshot timestamp in the registry.
 • If the URL links to a PDF, download that into sources/files/… too; link them by a shared link_group field.

YouTube
 • Store:
 • transcript.* (original VTT + normalized JSON with segments/timecodes/lang + “auto vs human”)
 • metadata.json (title, channel, publish date, duration)
 • thumbnails
 • Chunking for embeddings happens in derived/text/, not inside sources.

Documents vs Cases (your rename)
 • documents as a name is fine for raw files, but it conflates with case docs.
 • I’d restore intent with sources/ (raw) and cases/ (curated). That keeps your mental model clean and your pipelines simpler. If you love the word “documents,” use sources/documents to be explicit.

Minimal case template

cases/1976-09-tehran/
  case.md
  links.json
  exhibits/

case.md (frontmatter + sections):

---

id: UT-1976-0001
title: Tehran F-4 Intercept
date: 1976-09-19
location: Tehran, Iran
status: active
tags: [radar, pilot, EM-effects]
sources: [src_8f9a..., src_a21b..., src_ytd3...]
---

## Summary

Concise narrative…

## Timeline

- 00:00 — Radar contact …
- 00:14 — Power loss …

## Claims & Evidence

| Claim | Evidence (source_id) | Strength | Notes |
|------|-----------------------|---------|------|

## Analyst Notes

Your judgments, alt hypotheses, confidence.

links.json (machine-friendly):

{
  "primary": ["src_8f9a..."],
  "supporting": ["src_a21b...", "src_ytd3..."],
  "related_cases": ["1976-09-..."]
}

Pipeline shape (end-to-end)

 1. Intake → drop into sources/{files|web|youtube} and append a line to registry.jsonl.
 2. Derive → normalize to plain text in derived/text/… (OCR, cleanup).
 3. Embed → push to derived/embeddings/ (and your existing vector store).
 4. Curate → update or create a cases/<slug>/ dossier that cites source_ids.
 5. Verify → mark status on registry lines (e.g., verified once reviewed).

Dedupe & provenance (non-negotiables)
 • Content hash first, then fuzzy match by title/date.
 • Keep original filenames and checksums forever; never rewrite sources/.
 • Record rights/license (public domain / FOIA / unknown) to avoid later headaches.

Migration from case_files → this model
 • Move everything under case_files/ that is a raw artifact into sources/files/.
 • Keep your curated writeups (if any) and move them under cases/<slug>/case.md.
 • Build metadata/registry.jsonl by walking the tree, hashing, and emitting one record per artifact.
 • Add a redirects.json mapping old paths to new to keep links unbroken.
 • Update your embedding scripts to read from derived/text/ and cite source_ids in metadata.

⸻

If you want, I can spit out:
 • a ready-to-use registry.jsonl schema (TS + Python types),
 • a tiny migration script that walks case_files/, hashes, and writes the registry,
 • and a create-case CLI that scaffolds a new case folder + frontmatter.

Say the word and I’ll drop them in.
