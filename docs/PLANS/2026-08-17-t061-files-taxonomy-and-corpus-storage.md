---
status: live
role: eng
spine: do
updated: 2026-08-17
---

# T-061 — `sources/files/` taxonomy, OCR, and corpus-in-git strategy

**Created:** 2026-08-17
**Ticket:** T-061 ([`docs/plans/TODO.md`](docs/plans/TODO.md))
**Lane:** A — Corpus & Ingestion
**Parent plan:** [`docs/plans/2026-08-16-source-canonical-reorg.md`](docs/plans/2026-08-16-source-canonical-reorg.md)

---

## 1. Taxonomy — executed

31 PDFs, 200 MB, all previously loose in `sources/files/`. Seven collections,
derived from filename + embedded PDF title + first-page text.

| Collection | n | Contents |
| --- | --- | --- |
| `cia-crest/` | 8 | The 7 `CIA-RDP96-*` CREST scans + the FAS "CIA's Role in the Study of UFOs" report |
| `fbi-vault/` | 6 | The `ufoN.pdf` files — embedded titles reveal these are **"UFO Part N of 16"**, an FBI Vault series (parts 3, 5, 6, 9, 13), plus "Roswell UFO Part 1 of 1" |
| `research-papers/` | 6 | Blue Book Special Report 14, UAP Activity Pattern Study, Ultraterrestrial Models, Mars Exploration 1984, crop circles, origin-theories diagram |
| `congressional/` | 2 | 2023-07-26 UAP hearing, Shellenberger written testimony |
| `dod-aaro/` | 2 | AARO Historical Record Report Vol 1 (embedded title of `DOPSR-CLEARED-508-COMPLIANT.pdf`), Navy Safety Center FOIA |
| `majestic-12/` | 2 | Eisenhower briefing document, Wood 2000 "Validating the New Majestic Documents" |
| `secondary-reporting/` | 2 | LiveScience listicle, JRE #1510 Knapp transcript |

**Filenames normalized** to lowercase-kebab, dates front-loaded where known
(`2024-03-aaro-historical-record-report-vol-1.pdf`), and the generic `ufoN.pdf`
names replaced with what they actually are (`fbi-ufo-part-03-of-16.pdf`).

**3 duplicates quarantined** to `_superseded/` (not deleted):

- `CIA-RDP96-00788R001800230001-8 (1).pdf` — exact md5 dup
- `case_filesCrop Circles-….pdf` — exact md5 dup with a mangled prefix
- `eisenhower_briefing (1).pdf` — scan-only variant; the kept copy has a text layer

### Reversibility — read this before touching it

**These PDFs are gitignored, so git cannot undo any of this.**
[`packages/knowledge-base/sources/files/_RENAME-MANIFEST.json`](packages/knowledge-base/sources/files/_RENAME-MANIFEST.json)
is the **only** undo path. It records `restore_to`, `now_at`, and an md5 for
every one of the 31 moves. Do not delete it until the corpus has a durable
mirror (§3).

---

## 2. OCR — the vector store confirms why this matters

### What the store audit found

Audited `vs_meWOEnUiUxtQWf0W6NBsNpCG` ("UFO Data Store") — the same store the
app's live `file_search` reads, so this measures the real retrieval surface
([`packages/openai-vector-store-mcp/USAGE.md`](packages/openai-vector-store-mcp/USAGE.md)).

```
counts: completed=1292  failed=38  cancelled=5  total=1335
bytes : 125,348,208
```

**26 of the 38 failures give the same reason: "The file could not be parsed
because it is empty."** That is OpenAI reporting *no extractable text layer* —
the file uploaded fine and then indexed to nothing. Which confirms the operator's
read exactly: these documents are "in the store" as file records while carrying
zero searchable content.

Named failures that are in this tree: `eisenhower_briefing.pdf` (failed **three
separate times**), `rmwood_mufon2000.pdf`, `uap-origin-theories-diagram.pdf`.
Others (`WilsonMemo.pdf`, `Immaculate Constellation Report.pdf`, the Gerald
Light / BSRA set) come from outside `packages/knowledge-base` — likely
`apps/disclosure-rag/corpus/intake/`, so the same defect is broader than these 31.

Three failures are *not* empty-text and need separate handling:
`majestic_timeline_1_31_2023.pdf` (too large), `charles fort ny times 1926…pdf`
(unsupported type), `ufo_timeline_v1_03.pdf` + `SCU UAP Pattern Recognition
Study…` (internal error).

### Which files need OCR — measured, not assumed

Two passes, because the first one lied. Raw chars-per-page flagged 11 files as
scans, but rated `ufo3.pdf` (3,592 chars/page) as healthy. Its first two pages
are scan-stamp noise (`--. 1~ 92I _ &#39;`). A **common-word validity ratio**
separated real text from noise:

| Verdict | n | Evidence |
| --- | --- | --- |
| **Scan, zero text — OCR required** | 11 | 0 words extracted over 15 pages |
| Weak but real | 2 | `fbi-ufo-part-05` 14.6% valid words, `fbi-roswell` 8.6% |
| Healthy | 18 | 15–46% valid words |

`ufo3.pdf`'s apparent garbage was localized to cover pages; deeper pages score
32.4%. **Do not re-OCR the 18 healthy files** — `--force-ocr` would discard a
good text layer for a worse one.

### Run

`ocrmypdf` 16.x and `tesseract` are already installed. Output goes to
`packages/knowledge-base/derived/ocr/` — the derived zone, never overwriting an
original:

```bash
ocrmypdf --force-ocr --output-type pdfa --optimize 1 --jobs 4 \
  --sidecar derived/ocr/<name>.txt <original>.pdf derived/ocr/<name>.ocr.pdf
```

Early results — from files that previously extracted **zero** characters:

| File | text recovered |
| --- | --- |
| `cia-rdp96-00788r001700210016-5` | 93,131 chars |
| `cia-rdp96-00788r001800230001-8` | 75,833 chars |
| `cia-rdp96-00788r001900760001-9` | 12,095 chars |
| `cia-rdp96-00789r002100220001-4` | 5,173 chars |

**Next step after OCR completes:** re-upload the `.ocr.pdf` (or the `.txt`
sidecar) for the 11 scans, then re-run the store audit and confirm the
empty-parse failures drop.

---

## 3. The corpus-in-git question

### Measured facts first

| | size |
| --- | --- |
| `.git` | **2.2 GB** |
| corpus total (`sources/`) | 225 MB |
| └ `files/` (PDFs) | 200 MB |
| └ `transcripts/` | 24 MB |
| └ `web/` | 1.1 MB |

**The repo is already bloated, and the corpus is not why.** The largest blobs in
history are app assets:

```
56.4MB  public/assets/audio/interstellar-stay.mp3
52.4MB  apps/disclosure-rag/data/queue/UFO
44.4MB  apps/app/public/sightings.geojson
43.5MB  public/assets/ufo/scene.bin
41.8MB  public/assets/international_space_station/scene.bin
34.0MB  …/textures/Material_62_baseColor.png
```

Gitignoring the PDFs was the right call and it worked — they never entered
history. The 24 MB of transcripts committed this week are text, compress well,
and diff meaningfully. **The split that already exists is the correct one:**
text in git, binaries out.

### Options

**Option A — object-storage mirror + committed manifest (recommended).**
Keep binaries gitignored. Commit a manifest (path, sha256, bytes, source
collection, provenance) and mirror the bytes to R2/S3. Git holds a small,
diffable, *verifiable* record; a `hydrate` script pulls bytes on demand.

- Already the roadmap: this is **T-048 H5**, "object-storage mirror of the
  archive, verified by manifest."
- One mechanism for the whole 225 MB, not a PDF special case.
- Cheap (200 MB of R2 is cents), and the manifest makes silent corpus drift
  detectable — which nothing currently does.
- Cost: a hydrate step before anything that reads raw PDFs.

**Option B — Git LFS.** `git-lfs 3.6.1` is already installed. Pointer files in
git, blobs in LFS.

- `git clone` yields a working corpus with no extra step.
- GitHub's free LFS tier is 1 GB storage / 1 GB bandwidth per month; 200 MB of
  originals plus OCR'd copies (which are *larger* — the first one grew 1.7 MB →
  2.3 MB) will approach that, and LFS bandwidth is consumed per clone/CI run.
- Migrating *out* of LFS later requires history rewriting.

**Option C — DVC.** `apps/disclosure-rag/.dvc/` is already initialized with an
empty config and no remote — someone intended this. Purpose-built for
data-versioning, gives content-addressed storage plus pipeline stages.

- Strongest fit if corpus *versioning* (not just backup) is wanted.
- Adds a third tool to a chain that already has git + object storage, and the
  half-initialized state suggests the last attempt stalled.

### Recommendation

**Option A**, and fold it into T-048 H5 rather than inventing a parallel
mechanism. Concretely:

1. Generate `packages/knowledge-base/metadata/corpus-manifest.json` — sha256 +
   bytes + collection for all 225 MB. Commit it. This alone makes the corpus
   verifiable, which is the part that is missing today.
2. Add `scripts/corpus_mirror.py {push,pull,verify}` against R2/S3.
3. Keep `.gitignore` as-is for binaries; keep transcripts in git as text.
4. Retire `_RENAME-MANIFEST.json` only once `verify` passes against the mirror.

Do **not** run Option B and Option A together — two sources of truth for the
same bytes is worse than either.

---

## 4. Open questions for the operator

1. **Object storage target** — is there an existing R2/S3 bucket for this
   project, or does one need creating? Determines step 2 above.
2. **The 3 quarantined duplicates** — delete `_superseded/` once the mirror
   exists, or keep permanently?
3. **`sources/files/2025-07-25/` and `2025-08-14/`** — two date dirs remain in
   this tree. `2025-08-14/` holds only a `.DS_Store`. `2025-07-25/` holds
   generated timeline artifacts (`convert.js`, `run.log`, `.md`) which look
   **derived**, not source — candidates for `derived/`, not a collection.
4. **`xata-era-events/`** — 10 files from the retired Xata era. Keep, archive,
   or drop?
