---
status: proposed
role: eng
spine: how
updated: 2026-10-01 15:42 CDT
---

# Cloud ingestion workflow for long-running jobs — pilot: war.gov PURSUE releases 1–6

**Written:** 2026-10-01 15:42 CDT · **Owner:** ingestion work (Claude) · **Ticket:** T-083 in [`docs/PLANS/TODO.md`](docs/PLANS/TODO.md)
**Goal:** run full ingestion on all six war.gov UFO releases without the files ever landing on the laptop, and reuse the same machinery for any future long job (a seventh release, a playlist, a CREST dump).

## 1. What was measured (2026-10-01, HEAD requests only, nothing downloaded)

| Fact | Value | How |
| --- | --- | --- |
| Official manifest | `https://www.war.gov/Portals/1/Interactive/2026/UFO/uap-data.csv`, **450 rows** across 6 release dates (5/8, 5/22, 6/12, 7/10, 8/7, 9/18) | fetched with `curl_cffi` Chrome impersonation |
| Row types | 312 document/image links (PDF, IMG), 160 DVIDS video IDs, 16 audio rows | same CSV |
| Already on disk | Releases 1–2 only: [`apps/disclosure-rag/corpus/intake/war_gov_ufo_files/`](apps/disclosure-rag/corpus/intake/war_gov_ufo_files/README.md) — 8.3 GB of bundle zips (sha256 recorded) + ~7.7 GB extracted | README there |
| Releases 3–6 documents | ≥ 1.1 GB by content-length (partial; see the block below) | HEAD |
| Videos | dominate size: releases 1–2 alone were 7 GB for 85 clips (~80 MB each); 160 video rows total → **~13 GB est.** | extrapolated, not measured |
| Realistic total | **~16–20 GB**, not 30 GB | sum of the above |
| war.gov documents | Akamai-protected: plain curl → **403**; `curl_cffi` Chrome impersonation → **200** | tested |
| **Akamai rate block** | A burst of 12 parallel HEADs got ~55% 403s; a slow serial pass right after got **403 on all 312** — this laptop's IP was blocked for at least several minutes | tested; the probe itself tripped it |
| Videos | DVIDS CloudFront (`d34w7g4gy10iej.cloudfront.net/video/…/DOD_*.mp4`): **200, Range supported**, no WAF | tested |
| Fallback mirror | Wayback has many but not all document URLs (e.g. release 6: 4 of 59 at time of check) | `archive.org/wayback/available` |
| Existing fetcher | [`apps/disclosure-rag/scripts/download_pursue_ufo_releases.py`](apps/disclosure-rag/scripts/download_pursue_ufo_releases.py) — bundles + manifest for releases 1–2 only, `chrome124` impersonation | read |

Consequence: the fetcher must be gentle (1 request in flight to war.gov, jittered delay, stop and back off for a long period on the first 403), and should prefer whole-release bundle zips (one request per release) over 312 individual file requests.

## 2. Shape: two layers

```
Supervision (Claude Code Workflow, on demand)      Compute (Modal, in the cloud)
  launch ─────────────────────────────────────────▶ fetch → hash → inventory → text/OCR → [understand] → [reconcile]
  watch ledger counts ◀──────────────────────────── per-file ledger (JSONL on a Modal Volume)
  sample-review outputs, gate next stage           raw bytes stay on the Volume
  push notification to phone                       only small derived files (text, JSON) sync back to the repo
```

- **Compute = Modal.** Already set up here: `modal` CLI 1.5.4, active profile, `MODAL_API_TOKEN` in `.env`. Python, per-second billing, fan-out with `.map`, functions up to **24 h** each (modal.com/docs/guide/timeouts), Volumes need explicit `.commit()` (modal.com/docs/guide/volumes), `modal run --detach` keeps a job running after the laptop disconnects (modal.com/docs/guide/apps). Retry semantics not confirmed (that docs page did not load); verify in the spike.
- **Supervision = a Claude Code Workflow** (small: ≤4 agents). Agents never move bytes; they read the ledger, open samples, and decide whether the next stage may start.
- **Not chosen:** Vercel Workflow/Sandbox (4.5 MB request/response body limit, JS-first; wrong fit for 80 MB videos and Python OCR); GitHub Actions (6 h job cap, small runner disk); a VM (needs babysitting).

## 3. Storage

| What | Where | Why |
| --- | --- | --- |
| Raw files (PDF, MP4, audio) | Modal Volume `pursue-raw` | no new credentials; Modal containers mount it directly |
| Ledger + derived text/JSON | Modal Volume `pursue-derived`, synced down with `modal volume get` into [`packages/knowledge-base/sources/`](packages/knowledge-base/sources/) | small (MBs) |
| Alternative | Neon object storage (`AWS_ENDPOINT_URL_S3` in `.env` points at `*.storage…neon.tech`) via `modal.CloudBucketMount` | **UNVERIFIED** that those keys work; test in the spike before relying on it |

Laptop bytes: only derived text/JSON (est. < 200 MB for 450 files).

## 4. The per-file ledger (resume + idempotency)

One JSONL row per manifest row, keyed on `manifest_id` (CSV `Title` code) and `sha256`. Synthetic example:

```json
{"manifest_id": "DOW-UAP-D000", "release": "2026-09-18", "type": "PDF",
 "url": "https://www.war.gov/medialink/ufo/…/example.pdf",
 "fetched_via": "bundle|war.gov|wayback|dvids", "bytes": 12345, "sha256": "…",
 "pages": 12, "text_layer": "healthy|weak|poor|scan_no_text",
 "stages": {"fetch": "ok", "inventory": "ok", "text": "ok", "understand": "blocked", "reconcile": "pending"},
 "pairs": {"video": "DOW-UAP-PR000", "pdf": null}, "error": null}
```

Every stage reads the ledger, skips rows already `ok`, and writes its own field. A rerun resumes. A seventh release is just new CSV rows.

## 5. Stages and gates

| # | Stage | Runs on | Safe now? | Gate before the next stage |
| --- | --- | --- | --- | --- |
| 0 | **Spike**: one Modal function fetches the CSV and HEADs one war.gov PDF with `curl_cffi`, GETs one DVIDS mp4 byte range, writes + commits a Volume file, tests the Neon S3 keys | Modal CPU | yes | Is war.gov reachable from Modal's IPs? If 403, use the fallbacks below. |
| 1 | **Fetch**: manifest → ledger rows; per-release bundle zips first, then single files at 1-in-flight with backoff; videos direct from CloudFront; releases 1–2 re-fetched in the cloud and checked against the sha256s in the README (do **not** upload from the laptop) | Modal CPU | yes | every row `fetch=ok` or a named error |
| 2 | **Inventory**: sha256, `pdfinfo` page counts, `ffprobe` duration + audio-stream/silence check, drop `__MACOSX/` and `._*` junk (the OCR census counted 116 junk "PDFs" in release 1), link CSV `Video Pairing`/`PDF Pairing` columns | Modal CPU | yes | page and minute totals → cost estimate for stages 3–4 |
| 3 | **Text**: text-layer verdict with the census method from [`docs/PLANS/2026-08-17-intake-ocr-census.md`](docs/PLANS/2026-08-17-intake-ocr-census.md) (valid-word ratio, not chars/page); `ocrmypdf` only for `poor`/`scan_no_text`; transcription only for clips that actually contain speech (most are silent FLIR) | Modal CPU (+ Deepgram for speech) | OCR yes; Deepgram is paid → needs your OK | sampled OCR quality check by a supervisor agent |
| 4 | **Understand**: passage understanding + nested summaries + record decisions — a document version of [`source_understanding.py`](apps/disclosure-rag/processing/source_understanding.py) | Modal CPU calling the frontier model | **no** | blocked on document prompt contracts (T-075) and wiring (T-076); hard budget cap from stage 2 numbers (one 2.5 h transcript cost ~$4); your approval |
| 5 | **Reconcile**: document-level merge of record decisions across all 450 files ([`reconcile_decisions.py`](apps/disclosure-rag/processing/reconcile_decisions.py), being built now) | Modal CPU, no LLM | after 4 | candidate merges reviewed by you |
| 6 | **DB write** | — | **no** | your explicit approval; out of scope here |

Fetch fallbacks if Modal's IPs are blocked by Akamai, in order:
1. Per-release bundle zips (releases 1–2 known in the existing fetcher; find the 3–6 bundle links on the release pages).
2. Wayback raw snapshot (`https://web.archive.org/web/<ts>id_/<url>`), accepted only if the byte count matches the war.gov content-length.
3. Last resort: a laptop-run fetcher that **streams** each file straight to the Volume (`modal volume put`, local copy deleted after each upload). The laptop never holds more than one file at a time.

## 6. Supervision workflow (sketch, not run)

```js
export const meta = {
  name: 'cloud-ingest',
  description: 'Launch and supervise one stage of a Modal ingestion job; gate on sampled review',
  phases: [{ title: 'Launch' }, { title: 'Watch' }, { title: 'Review' }, { title: 'Report' }],
}
// args: { stage: 'fetch' | 'inventory' | 'text', sample: 10 }
phase('Launch')
const run = await agent(`Run \`modal run --detach apps/disclosure-rag/cloud/pursue.py::${args.stage}\` and return the app ID.`, { schema: RUN })
phase('Watch')
const counts = await agent(`Wait for app ${run.app_id} to finish, then read ledger.jsonl from the pursue-derived Volume. Return per-stage counts and every error row.`, { schema: COUNTS })
phase('Review')
const verdicts = await parallel(['completeness', 'quality'].map(lens => () =>
  agent(`Open ${args.sample} random ledger rows for stage ${args.stage} through the ${lens} lens. Does the output match the source? Fail if unsure.`, { schema: VERDICT })))
phase('Report')
return { run, counts, pass: verdicts.filter(Boolean).every(v => v.pass) }
```

The main session runs one stage per Workflow call, reads the result, and sends a phone push ("Fetch done: 448/450 ok, 2 errors. Start inventory?"). The next stage starts only after you approve. Waiting is one long watch, with a fallback check every 20–30 minutes, not a tight polling loop.

## 7. Steps and time

1. Spike on Modal (stage 0): **~30 min**, cents of compute.
2. `apps/disclosure-rag/cloud/pursue.py` with ledger + fetch + inventory: **~half a day**.
3. Fetch + inventory all 6 releases: **~1–3 h wall clock**, unattended (bounded by polite war.gov pacing, not compute).
4. Text/OCR stage: **~2 h to build**; run time scales with scanned pages (census rate ~1.2 s/page/core, parallel on Modal).
5. Understanding: after T-075/T-076 land; cost estimate from step 3's page and minute totals.

## 8. Decisions for you

1. Approve the spike (stage 0) on Modal.
2. Raw store: Modal Volume (recommended) or Neon object storage.
3. Videos: fetch all ~13 GB now, or inventory only (duration, audio check) and fetch on demand.
