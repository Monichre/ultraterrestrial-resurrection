---
status: live
role: eng
spine: do
updated: 2026-08-16
---

# Source-Canonical Reorganization (T-061)

**Created:** 2026-08-16
**Ticket:** T-061 ([`docs/plans/TODO.md`](docs/plans/TODO.md))
**Lane:** A — Corpus & Ingestion
**Status:** proposed — nothing executed
**Scope:** re-key [`packages/knowledge-base/sources/`](packages/knowledge-base/sources) from ingest-date folders to canonical source folders
**Trees in scope:** [`sources/transcripts/`](packages/knowledge-base/sources/transcripts), [`sources/web/`](packages/knowledge-base/sources/web), [`sources/files/`](packages/knowledge-base/sources/files)
**Aligns with:** [`packages/knowledge-base/PLAN.md`](packages/knowledge-base/PLAN.md) (target structure)
**Phase 2 is delegated:** [`docs/plans/2026-08-16-t061-path-callsite-remediation.md`](docs/plans/2026-08-16-t061-path-callsite-remediation.md)

---

## 1. What the corpus actually looks like

Measured on 2026-08-16, not assumed.

| Tree | Files | Date dirs | Entry shape |
| --- | --- | --- | --- |
| `sources/transcripts/` | 887 | 57 | mixed — see below |
| `sources/web/` | 68 | 8 | `<date>/<slug>-<hash8>/` |
| `sources/files/` | 58 | 3 | 33 loose PDFs + 3 dirs |

### Transcripts are two eras, not one

| Era | Count | Shape | Provenance available |
| --- | --- | --- | --- |
| Legacy (2024 → early 2025) | 156 flat `.txt` | `<date>/<slug>.txt` + `<slug>Summary.txt` | **none** — slug only |
| Modern (mid-2025 →) | 197 videoId dirs | `<date>/<videoId>/<slug>_*.{txt,json,md}` | YouTube ID in dir name |
| Anomaly | 4 | `<date>/unknown/` | none |

Only **83 of the 197** videoId dirs carry a `_metadata.json` at all. The other
114 are bare — the dir name is the only identifier they have.

### The finding that determines this whole plan

**No artifact anywhere in the corpus records the channel, show, or publisher.**

Every one of the 83 transcript metadata files has exactly these keys:
`title`, `url`, `id`, `categories`, `tags`, `description`, `chapters`
(+ `rag_pipeline`). No `uploader`, no `channel`, no `channel_id`, no
`upload_date`. And `categories`/`tags`/`description`/`chapters` are empty in
every sample inspected.

The cause is in [`apps/disclosure-rag/lib/youtube.py:136`](apps/disclosure-rag/lib/youtube.py#L136):

> "A thin wrapper. The yt-dlp path is gone — this is transcript-api only"

`youtube-transcript-api` returns transcript text and nothing else. So the
channel was never captured, and **will not be captured for any future ingest
either**. This is a live writer gap, not just a backlog gap.

Consequence: "organize by canonical source" is a **derivation** task requiring
external lookup, not a re-read of existing metadata. That earns it its own
phase and its own approval gate before a single file moves.

---

## 2. Ordering is forced

Registry → writer fix → move. Not a preference:

- Five call sites still bake `datetime.now().strftime("%Y-%m-%d")` into output
  paths. Move 887 files without fixing them and new entries keep landing in
  date dirs — the migration never converges and can never be declared done.
- The registry must be **approved by you** before moves, because 156 legacy
  entries can only be resolved by slug pattern, and you are the one who knows
  the actual providers.

---

## 3. Phase 0 — Source registry (read-only, zero moves)

Produces two artifacts. Moves nothing, deletes nothing.

### 3.1 `metadata/source-registry.json` — the canonical source list

```jsonc
{
  "sources": {
    "reality-check-ross-coulthart": {
      "display_name": "Reality Check with Ross Coulthart",
      "kind": "youtube_channel",
      "channel_id": "UC...",          // stable key; channel titles get renamed
      "aliases": ["NewsNation"],
      "slug": "reality-check-ross-coulthart"
    },
    "the-black-vault": { "kind": "web_domain", "domain": "theblackvault.com" },
    "cia-crest":       { "kind": "document_collection" }
  }
}
```

**Key on `channel_id`, never `channelTitle`** — channels get renamed and the
directory name must not drift with them.

### 3.2 `metadata/source-resolution.jsonl` — one line per entry, with evidence

```jsonc
{"path":"sources/transcripts/2025-07-25/ZAxI-LDrDqA","tier":"A",
 "evidence":"youtube:ZAxI-LDrDqA -> UC...","source_key":"weaponized",
 "confidence":"certain"}
```

### 3.3 Resolution tiers

| Tier | Applies to | Method | Confidence |
| --- | --- | --- | --- |
| **A** | 197 videoId dirs (**140 unique** — 56 IDs are filed under multiple dates) | YouTube Data API `videos.list?part=snippet&id=` — 50 IDs/call | authoritative |
| **B** | all 18 web entries | registrable domain from `url` **or** `source` | authoritative |
| **C** | 156 legacy `.txt` | **source URL read from the file's own line-3 header**, then YouTube Data API | authoritative |

> **CORRECTION — 2026-08-17, executed.** Tier C was specified as slug fingerprinting
> on the belief that legacy files had "no provenance, slug only". **That was wrong.**
> All 156 legacy files carry their own header: title on line 1, source URL on line 3
> (2 files on line 4). 151 yield a YouTube videoId, 5 are web article URLs misfiled
> into the transcripts tree. Tier C was never a guessing problem — it was Tier A that
> nobody had looked at. 154/156 resolved authoritatively; the 2 failures are videos
> that have **already gone private**, which is §3.4's perishability arriving early.
> Slug fingerprinting was not needed and should not be used.

**Tier B covers all 18 web entries, not 10.** The 8 entries with no `url` key
carry a full URL under `source` instead — a second schema in the same tree.
Both must be read.

**Tier C fingerprints** visible in the existing slugs:

| Pattern | Implied source |
| --- | --- |
| `*RealityCheck`, `*RealityCheckWithRossCoulthart` | Reality Check / NewsNation |
| `joeRoganExperience####` | JRE |
| `*Srs###` | Shawn Ryan Show |
| `*WeaponizedEpisode##` | Weaponized |
| `*DebriefedEp##` | Debriefed |
| `*JesseMichels###`, `davidGruschOnJesseMichels` | American Alchemy |

Anything not matching a fingerprint goes to `unresolved/` and is listed for
your review. **No guessing.** A wrong canonical source is worse than an
unfiled one.

### 3.4 Tier A is perishable — run it first and persist it

VideoId → channel only resolves while the video is public. Deleted or
privatized videos return nothing, permanently. Run the API pass early, commit
the raw responses, and treat that snapshot as the source of truth thereafter.

The same call also returns `publishedAt` — the real publication date, which
the corpus currently does not have anywhere. Capture it while you're there.

---

## 4. Phase 1 — Approval gate (blocking)

You review and edit `source-registry.json` and the Tier C assignments. No
moves happen until you sign off. This is the phase where your domain knowledge
of the podcast providers enters the pipeline.

---

## 5. Phase 2 — Fix the writer (before moving anything)

**This phase is fully specified and delegable.** Per-call-site instructions,
the helper contract, verification commands and acceptance criteria live in
[`docs/plans/2026-08-16-t061-path-callsite-remediation.md`](docs/plans/2026-08-16-t061-path-callsite-remediation.md).

Summary: introduce `resolve_entry_dir()` in the existing
[`apps/disclosure-rag/lib/kb/kb_root.py`](apps/disclosure-rag/lib/kb/kb_root.py) and
repoint **four path-composing sites**. Two further sites merely record a
`date_folder` field in the index — those are **preserved and renamed**, not
removed, because they hold the ingest-date provenance this plan depends on.
Conflating the two classes is the main way this phase can go wrong.

Recommended, same phase: restore channel capture at ingest so Tier A stops
being a backfill problem. Either reinstate a yt-dlp metadata call alongside
the transcript fetch, or add a YouTube Data API snippet lookup.

---

## 6. Phase 3 — Move (per tree, independently)

### Target layout

```
sources/
  transcripts/<source-slug>/<videoId>/…      # was <date>/<videoId>/
  transcripts/unresolved/<slug>/…
  web/<domain-slug>/<slug>-<hash8>/…
  files/<collection-slug>/<file>.pdf
```

### 6.1 Ingest date must be preserved before it is destroyed

Flattening the date folder destroys the ingest date for any entry not already
in the index. The move script **writes `ingested_at` into each entry's
metadata before moving it**, creating the metadata file where none exists
(114 bare videoId dirs). This is the only irreversible step in the migration.

Indexed docs already carry `metadata.date_folder`, so the 449 indexed
transcript docs are safe — but the bare dirs are not.

### 6.2 Duplicates will collide — that's the point

`whistleblowerRevealsUapRetrievalProgramObjectCaughtOnVideoNewsnation.txt`
exists under both `2025-01-20/` and `2025-01-21/`. Under dates they hid; under
`<source>/<videoId>/` they collide. The script must **detect, report, and halt
on collisions — never silently overwrite.** Dedup is a review output, not an
automatic action.

### 6.3 Registry rewrite — cheap, verified

`metadata/index.json` holds **571 docs**: 449 transcripts, 37 web, 31 files,
54 with leaked `/Users/...` absolute paths. Each stores `path` and
`metadata.original_path`.

Good news: `doc_id = md5(content)[:12]`
([`knowledge_base_crud.py:183`](apps/disclosure-rag/lib/kb/knowledge_base_crud.py#L183))
— a **content** hash, not a path hash. Moving files does not change any doc
id. The index rewrite is a pure path-field edit, not an ID migration, and
nothing keyed on doc ids downstream breaks.

All 571 index paths currently resolve on disk. That must still be true after
the move.

### 6.4 Consumers are glob-based and survive

[`check-delta.py`](packages/knowledge-base/check-delta.py) and
[`delta-comparison.py`](packages/knowledge-base/delta-comparison.py) use `sources/transcripts/**/*.txt`,
which is depth-agnostic. [`index.ts`](packages/knowledge-base/index.ts) and
[`package.json`](packages/knowledge-base/package.json) export tree roots, not date paths. No
consumer changes required — only verification that counts are unchanged.

---

## 7. Phase 4 — Verification

| Check | Passing condition |
| --- | --- |
| Conservation | per-tree file count identical before/after |
| Orphans | zero files left in any `<date>/` dir |
| Index integrity | all 571 `path` / `original_path` values resolve **and are repo-relative** |
| Consumer parity | `check-delta.py` and `delta-comparison.py` return identical counts |
| Provenance | every moved entry has `ingested_at` in its metadata |
| Collisions | reported list is empty, or each item explicitly adjudicated |

---

## 8. Suggested split with DevinAI

The three trees are cleanly separable after Phase 1 — no shared state between
them, and each has its own resolution tier and target layout.

- **Transcripts** — largest (887 files), only tree needing Tier A + Tier C
- **Web** — smallest (68 files), pure Tier B, two metadata schemas to reconcile
- **Files** — 58 files, already mostly flat; collection naming is a judgment call

Phases 0, 1, 2 and 4 are shared and should not be split.

---

## 9. Defects found while surveying — flagged, not fixed

Noted for your call; none are in this plan's scope.

1. **`youtube.py` captures no video metadata.** `categories`, `tags`,
   `description`, `chapters` are empty on every entry because the yt-dlp path
   was removed. Root cause of this entire reorg being a derivation problem.
2. **54 index docs hold `/Users/...` absolute paths** instead of repo-relative.
   Note these resolve *today on this machine*, so a bare "does the path
   resolve" check passes while the value is still wrong — hence the
   "and are repo-relative" clause in §7.
3. **Writer-path bug:** two entries escaped `sources/` entirely —
   `packages/knowledge-base/2026-08-15/zjpvfdfc4fg-1ad65595` and
   `apps/disclosure-rag/zjpvfDFc4fg_summary.txt`, same video ID, different trees.
4. **`httpbin.org` appears as a web source domain** — a test artifact, not a source.
5. **`web-article-d41d8cd9`** — `d41d8cd9` is the md5 prefix of the empty
   string. Empty-content entry.
6. **`web-article-2a01090e` is filed three times** (`2025-08-11`, `-12`, `-13`),
   identical hash and URL. Exact duplicate.
7. **`derived/transcripts/` mirrors the same date layout** and is out of scope
   here — it either needs the same treatment later or an explicit decision to
   leave it date-keyed.
8. **Stale hardcoded test paths** point at
   `/Users/liamellis/Desktop/ultraterrestrial-resurrection/...` (missing
   `apps/`) in several `apps/disclosure-rag` test files — already broken today,
   independent of this work.

---

## 10. Constraints

- Scoped `git mv` on a branch; move + index rewrite in the **same commit**.
- Move script hard-bounded to `packages/knowledge-base/sources/`.
- **Never `git stash`** — concurrent agent sessions share this working tree.
