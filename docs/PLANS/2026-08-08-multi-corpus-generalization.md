# Multi-Corpus Generalization — Spec & Implementation Plan

**Date:** 2026-08-08
**Status:** Proposed — not started
**Scope:** Generalize the platform from a single implicit UFO/UAP subject to N named corpora. First two additions: Epstein Files, Charlie Kirk Assassination.
**Lane:** A (Corpus & Ingestion), with a deferred Lane B tail.

---

## 1. Intent

Incrementally widen the platform's aperture from "UFO/UAP disclosure" to "any anomalous or unresolved subject," **without** forking the methodology and **without** a re-architecture.

The near-term concrete goal, which sets the scope of Phase 0–2:

> Run the disclosure-rag CLI against YouTube videos about the Charlie Kirk assassination and get a high-fidelity text extraction, summary, and investigative analysis.

Everything beyond that (app-surface corpus switching, cross-corpus comparison) is specced here but explicitly deferred.

### Guiding principle

One methodology, many subjects. The Research Schema — entity types, epistemic statuses, Claim-vs-Inference separation, promotion rules, voice contract — is **singular and shared**. The material it is applied to is **plural and scoped**.

---

## 2. Language (decided)

### The scoping unit is a **Corpus**

A Corpus is a named, scoped body of research material on one subject, plus everything derived from it: Raw Sources, Evidence Ledger entries, Domain Graph records, and Compiled Pages.

| Corpus | Slug | Status |
| ------ | ---- | ------ |
| Disclosure (UFO/UAP) | `disclosure` | Exists; becomes explicit rather than implicit |
| Epstein Files | `epstein-files` | New |
| Charlie Kirk Assassination | `charlie-kirk-assassination` | New |

### Answering "one KB with three archives, or one archive with three KBs?"

Neither. `UBIQUITOUS_LANGUAGE.md` already flags "knowledge base" as an ambiguity to retire, preferring **Raw Source archive** for `packages/knowledge-base` and **research model** for the ledger+graph+compiled layers. Splitting on that seam resolves the question:

- **One** platform, **one** database, **one** Research Schema.
- **Three** Corpora, each scoping its own sources and derived records.

Three separate knowledge bases would fork the methodology and triple maintenance. One undifferentiated pool destroys provenance integrity and leaks retrieval across unrelated subjects (see §3).

### Naming collision to resolve

`packages/knowledge-base/CORPUS.md` currently uses "corpus" to mean *the whole architecture*. It is in fact the **Research Schema + architecture canon**, not a description of one body of material. Once `Corpus` means "one scoped subject," that filename misleads.

**Action:** rename `CORPUS.md` → `RESEARCH_SCHEMA.md`, update the ~6 inbound references (`CLAUDE.md`, `AGENTS.md`, `UBIQUITOUS_LANGUAGE.md` canon-source line, `docs/README.md`). Low risk, do it in the same commit as the vocabulary addition so the two never disagree.

### Vocabulary additions for `UBIQUITOUS_LANGUAGE.md`

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Corpus** | A named, scoped body of research material on one subject, plus its derived ledger, graph, and compiled layers. Governed by the single shared Research Schema. | Archive (means the whole), knowledge base, dataset, project, tenant |
| **Corpus Charter** | A versioned, human-authored statement per Corpus of what is established, what is genuinely open, and what is out of scope. Read by ingest and agent prompts. | Scope doc, README |
| **Prompt Set** | The per-Corpus family of registry prompts (`<corpus>.ner`, `<corpus>.content_analysis`) that adapt the shared pipeline to a subject. | Domain prompts, custom prompts |

---

## 3. Current state (verified 2026-08-08)

### The blocking finding: no scoping exists anywhere

```
rg -i "corpus_id|archive_id|domain_id|collection_id|tenant" packages/db/src apps/app/src
  → zero hits
```

30 Postgres tables, 8 carrying `vector(1536)` embeddings, and `searchDatabase()` in
`packages/db/src/postgres/search.ts` accepts an optional `table` but **no scope filter**. It
fans out across every FTS and vector table and fuses with Reciprocal Rank Fusion. Both live AI
routes (`api/disclosure/mindmap`, `api/prometheus/chat`) call it via `executeDatabaseSearch`
with no filter.

**Consequence:** the moment non-UFO documents land in `documents` / `document_chunks`, they
surface inside UFO investigations. Corpus scoping is a precondition for writing a single new
row to Postgres — not a follow-up task.

**Mitigation that unblocks Phase 0–2:** the disclosure-rag KB write path is
filesystem-only. `lib/knowledge_base_service.py` contains no Postgres references. So
transcript extraction + analysis + archive write can all happen with **zero** database
exposure, deferring the scoping problem entirely until we actually want a Corpus visible in
the app.

### What is already generic (the good news)

| Layer | Verdict |
| ----- | ------- |
| **Research Schema** (`CORPUS.md`) | Already subject-neutral. Pin→Thread→Hunch→Canvas→Quilt, 7-value Epistemic Status, Claim-vs-Inference. Needs no change. |
| **Entity model** (Postgres) | `topics`, `key_figures`, `events`, `organizations`, `testimonies`, `documents`, `artifacts`, `locations` are all subject-neutral and cover Epstein/Kirk needs as-is. |
| **Prompt registry** (`packages/ai/prompts/registry.yaml`) | Already split into a subject set (`sets/disclosure/`, `tags: [ufo, ...]`) and general-purpose `templates/` (`document_classification`, `rag_ingestion`, `validation`, `synthesis`). The per-subject seam is designed in. |
| **KB document model** | `add_document()` already accepts `tags: List[str]` and maintains a `tags → doc_ids` inverted index. A corpus tag needs **no schema change**. |
| **Transcript extraction** | Fully generic — `youtube-transcript-api`, `lib/transcript_fidelity.py`. Subject-agnostic. |

### What is genuinely UFO-coupled

| Thing | Location | Severity |
| ----- | -------- | -------- |
| `UFOEntityTaxonomy` — Hynek CE1–CE5, Vallée control-system regexes, `area_51`/`skinwalker_ranch` lists | `agents/ultraterrestrial_domain_ner_agent.py:62-200` | High — would force-fit garbage onto non-UFO material |
| Every agent prompt names UAP explicitly | `agents/prompts.py` (369 lines) | High |
| Hard-coded `disclosure.*` prompt IDs | `processing/rag_prompt_pipeline.py:203,205,252,254,356,358`; `processing/content_analysis.py:29-30`; `agents/content_analysis_agent.py:18`; `lib/cocoindex_flows.py:259` | **Low — this is the seam.** ~9 call sites, mechanical to parameterize |
| `sightings` table + `shape` column | `packages/db/migrations/rebuild/0001_init.sql:129-148` | Low — leave it; simply unused by non-UFO corpora |

### Latest disclosure-rag state (matters for sequencing)

Last commits `afd425e2` / `64edf9b5` (2026-08-01, H0 hardening: truthful stage reporting,
dry-run, dedup guard). **There is uncommitted WIP right now** in `main.py`, `main.sh`,
`lib/knowledge_base_crud.py`, `lib/knowledge_base_service.py`,
`processing/rag_prompt_pipeline.py`, `lib/transcript_fidelity.py`, `scripts/playlist_ingestion.py`,
and `requirements.txt`.

**Do not start Phase 1 on top of a dirty tree.** Land or shelve that WIP first. Note the
standing repo rule: never `git stash` on the shared working tree (see `AGENTS.md`).

---

## 4. Phased plan

### Phase 0 — Empirical baseline (no code)

Answer a question neither of us can answer from reading: **how bad is UFO-tuned analysis on
Kirk material, actually?** This determines how much of Phase 2 is needed.

```bash
cd apps/disclosure-rag
./main.sh "<kirk-youtube-url>" --dry-run          # confirm routing, no writes
./main.sh "<kirk-youtube-url>" --no-kb            # real extraction, no archive write
```

Capture and read the output. Grade three things separately:

1. **Transcript fidelity** — expected to be fine (generic path).
2. **Summary quality** — expected usable; `document_classification` and `rag_ingestion` are
   already generic templates.
3. **Entity extraction / NER** — expected to be the failure point. Look specifically for
   force-fitting: `sightings` records invented, Hynek classifications applied, `craft`/`shape`
   attributes hallucinated onto a shooting.

**Exit criteria:** a written verdict on whether Phase 2 needs a full new prompt set, or only
a neutralized NER prompt. Record it in this doc.

**Cost:** minutes. Do this before anything else.

---

### Phase 1 — Corpus as a first-class tag (KB-only, no DB)

Smallest change that keeps corpora from contaminating each other, exploiting the fact that
the KB write path never touches Postgres.

1. **CLI flag** — add `--corpus <slug>` to `main.py` argparse (currently `main.py:977-990`,
   which has only `input`, `--upload`, `--no-kb`, `--status`, `--dry-run`).
   Default `disclosure`, preserving today's behavior exactly.
2. **Thread it** through `process_url` → `process_youtube_url_enhanced` → `add_document`,
   emitting `tags=["corpus:<slug>", ...]`. No KB schema change — the `tags` inverted index
   already exists (`lib/knowledge_base_crud.py:364-365`).
3. **Validate the slug** against a small registry (see Phase 1b) — reject unknown slugs
   rather than silently creating a corpus by typo.
4. **Surface it** in `--dry-run` output (`_build_dry_run_plan`, `main.py:898`) and in
   `--status`.

**Explicitly out of scope for Phase 1:** any Postgres write. If the entity-extraction path
would write to shared tables, it must be disabled for non-`disclosure` corpora until Phase 3.
Verify this before shipping — trace `agents/entity_extraction_agent.py` and
`lib/shared_entity_store.py` for write paths, since I have not confirmed whether the standard
CLI run reaches them.

**Phase 1b — Corpus registry + Charters.**

```
packages/knowledge-base/corpora/
├── registry.yaml                        # slug → title, status, prompt_set, charter path
├── disclosure/CHARTER.md
├── epstein-files/CHARTER.md
└── charlie-kirk-assassination/CHARTER.md
```

Each `CHARTER.md`: what is **established**, what is **genuinely open**, what is **out of
scope**. This is the highest-value new artifact in the plan — it is what keeps a corpus
honest and prevents scope drift into the "conspiracy board with better CSS" that `PRODUCT.md`
names as the anti-goal. For Kirk in particular, the charter must state plainly that the basic
facts (shooter identified and charged) are established, so the corpus is scoped to the
documentary record and its actual gaps rather than implying an open mystery.

**Verification:** ingest one video per corpus; confirm `metadata/index.json` shows the right
`corpus:` tags and that a tag query returns only that corpus's docs.

---

### Phase 2 — Per-corpus prompt sets

The real work, and it is small because the registry already anticipates it.

1. **Parameterize prompt IDs.** Replace the ~9 hard-coded `"disclosure.ner"` /
   `"disclosure.content_analysis"` literals with resolution through a `prompt_set` argument
   defaulting to `disclosure`. Primary site: `processing/rag_prompt_pipeline.py`.
   Fallback rule: if `<set>.<name>` is absent from the registry, fall back to the generic
   `templates/` prompt rather than silently using the UFO one — a UFO prompt applied to Kirk
   material is worse than a generic one.
2. **Add a neutral investigative set** — `packages/ai/prompts/sets/investigative/ner.v1.yaml`
   and `specialized-analysis.v1.yaml`, registered as `investigative.ner` /
   `investigative.content_analysis` with `tags: [ner, extraction, rag]` (no `ufo`). Entity
   targets: Personnel, Event, Organization, Location, Testimony, Document, Claim — all of
   which already exist in the schema. **No `Sighting`.**
3. **Map corpora to sets** in `registry.yaml`: `disclosure` → `disclosure`;
   `epstein-files` and `charlie-kirk-assassination` → `investigative` initially. Split into
   bespoke sets only if Phase 0 evidence shows the generic set underperforms.
4. **Bypass `UltraterrestrialDomainNERAgent`** for non-`disclosure` corpora. Do not try to
   generalize `UFOEntityTaxonomy` — it encodes Hynek/Vallée methodology that is meaningful
   for UAP and meaningless elsewhere. Leave it untouched and route around it.

**Verification:** re-run the Phase 0 Kirk video under `--corpus charlie-kirk-assassination`
and diff the entity output against the Phase 0 baseline. Success = no invented sightings, no
Hynek classifications, Personnel/Event/Organization populated sensibly.

Regression gate: re-run a known UFO video under default settings and confirm byte-comparable
output to pre-change. `tests/test_rag_prompt_pipeline_wiring.py` asserts on the
`disclosure.*` IDs and will need updating in lockstep.

---

### Phase 3 — `corpus_id` in Postgres (DEFERRED)

Only needed when a non-`disclosure` corpus should be visible in the Next.js app. Specced now
so Phase 1–2 don't paint us into a corner; **not** to be built until asked.

1. Migration `packages/db/migrations/rebuild/0003_corpus_scoping.sql` — add
   `corpus_id TEXT NOT NULL DEFAULT 'disclosure'` to the ~14 content-bearing tables; index
   each. The `DEFAULT` backfills existing rows correctly in one statement and keeps every
   current query valid.
   Note `0002_ann_indexes.sql` is marked **not applied** — resolve that before adding `0003`.
2. Thread an optional `corpusId` through `searchDatabase`, `searchAll`, `vectorSearchAll`,
   `getRelatedRecords`, `loadEntityGraph`. Default = all corpora, so nothing breaks; callers
   opt in.
3. Then, and only then, allow disclosure-rag to write non-`disclosure` rows.

**Open design question, unresolved:** default retrieval scope in the app — single active
corpus, or cross-corpus with corpus labels on results? Cross-corpus is more interesting
(methodological comparison across subjects) but risks incoherent answers. Decide with a real
UI in front of you, not now.

---

### Phase 4 — App surface (DEFERRED, unspecced)

Corpus switcher, per-corpus canvas scoping, charter display. Needs design work in
`docs/design/design-lab/` first. Out of scope for this document.

---

## 5. Explicitly not doing

- **Not** generalizing `UFOEntityTaxonomy`. Route around it.
- **Not** renaming the `sightings` table or `testimonies.witness`. Unused by other corpora is fine.
- **Not** rewriting `agents/prompts.py`'s 369 lines. Phase 2's registry indirection makes it
  reachable only from the `disclosure` path.
- **Not** touching the two live AI routes until Phase 3.
- **Not** building corpus-aware UI.
- **Not** renaming the product or the `disclosure` slug. "Disclosure" is accurate for the
  UFO/UAP corpus specifically; it stops needing to mean "the whole platform" once Corpus exists.

---

## 6. Risks

| Risk | Severity | Mitigation |
| ---- | -------- | ---------- |
| Non-UFO rows reach shared Postgres before Phase 3 → retrieval contamination in live routes | **High** | Phase 1 is KB-only; verify entity-extraction write paths are unreachable for non-`disclosure` corpora before shipping |
| Uncommitted disclosure-rag WIP conflicts with Phase 1 edits to the same files | Medium | Land or shelve WIP first. Never `git stash` on the shared tree |
| Generic prompt set underperforms and quality regresses vs. the UFO-tuned path | Medium | Phase 0 baseline makes this measurable rather than a guess |
| `disclosure.*` fallback silently applies UFO framing to Kirk material | Medium | Fallback goes to generic `templates/`, never to `disclosure.*` |
| Corpus proliferation by typo | Low | Validate slugs against `registry.yaml`; reject unknown |

---

## 7. Sequencing

| Phase | Depends on | Blocking? |
| ----- | ---------- | --------- |
| 0 — Empirical baseline | Clean-ish tree | No — do immediately |
| 1 — Corpus tag + charters | WIP landed; Phase 0 verdict | Yes for Phase 2 |
| 2 — Per-corpus prompt sets | Phase 1 | Yes for useful Kirk analysis |
| 3 — `corpus_id` migration | Phase 2; `0002` resolved | Yes for app visibility |
| 4 — App surface | Phase 3 + design | — |

Phases 0–2 deliver the stated goal. Tickets belong in Linear (project "Ultraterrestrial
Resurrection", team DMGD) per `docs/agents/ops/issue-tracker.md` — not in `docs/plans/TODO.md`,
which is a historical `T-*` migration ledger only.

---

## 8. Definition of Done

Per `docs/agents/ops/DEFINITION_OF_DONE.md`, green tests are not sufficient. Each phase needs:

1. **Completion report with evidence** — every claim shows its command and that command's
   actual output; numbers scoped; explicit statement of what was not done.
2. **Dogfood audit** — for Phases 0–2 this means a human reading actual generated output for
   a real Kirk video and a real UFO video side by side, and confirming the UFO path did not
   regress. Cannot run it? Report **UNVERIFIED**, not done.
