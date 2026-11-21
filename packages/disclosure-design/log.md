# Log

Change history for this knowledge base, newest entry first. Add a dated entry (`## YYYY-MM-DD: <summary>`) whenever you create, edit, or restructure content — one entry per working session, not per file.

## 2026-08-16: Visual Language System

Reframed the vault around its actual purpose: a visual laboratory that turns research into repeatable prompts, tokens, components, and interfaces. Added `language/visual-language.json`, generated `VISUAL_LANGUAGE.md`, canonical palette/type roles, texture and narrative budgets, source-backed Gold references, the Visual DNA Checksum, `skills/visual-language/`, a surface-aware agent context compiler, binding audits, and regression tests. Formalized the Three Visual Lanes—Core Interface, Evidence Archive, and Tactical Spatial—and narrowed app-facing work to four verified priority surfaces: Home / Entry, Research Canvas, the honestly fragmented Archive / Record family, and Spacetime Observatory. Demoted the eight original modes plus AI War Room into deeper retrieval references rather than equal app styles. Demoted the earlier language-ownership framing to supporting vocabulary/provenance discipline while preserving Direct Vision vs Cluster-Inherited Analysis and manifest compatibility. Corrected the stale five-versus-six analysis-layer heading and element-copy prompt path. Validation: `python3 scripts/visual_language.py all` + the combined 15-test visual/language suite + language-registry checks.

## 2026-08-14: Review of folderize work (no code changes)

Audited on-disk state against the folderize contract. **390** extraction folders (66 gold vision-self, 324 cluster-inherited batch, 11 `component.tsx`). Scaffold matches the contract; deep per-image vision does not — that was the original product bar. Catalog still titled 471 with duplicate slug rows; manifest “missing” includes 2 files that exist; 39 root MP4s unfolderized; **git has zero commits**. Review canvas: `folderize-work-review.canvas.tsx`.

## 2026-08-13: Folderize — every still into `extractions/<slug>/`

Re-based the pixel dataset onto post-move paths (`notes/rebase-stills.py` → `notes/stills-rebase-report.json`: 453 on disk, 55 moved, 4 renamed, 2 re-sampled, 18 truly missing — cosmic-portals ×10, IMG_3458/59/60, monochrome-umbrella PNG, case-file 988b5f6f ×4). Scaffolded **390 folders** (`notes/folderize-stills.py`): image moved in as `<slug>.<ext>`, per-file `design-tokens.md` from real pixels, `source.md` everywhere, homogeneous-cluster inherited `design.md`/`image-to-prompt.md`. **66 gold reps** (3 old clusters vanished with the missing files). 63 byte-identical dupe copies left in place, listed in `notes/folderize-manifest.json` (incl. the 4 `Liam_Ellis_2026_dystopian_*` — canonical = root copies under `le:` clusters; `design/mock-ups/` copies untouched). Contract written: root `AGENTS.md` + `.cursor/rules/folderize-images.mdc` + `README.md` — **prompts/ is mandatory before every extraction; references/ are tools; flat catalogs are intermediate.** Gold vision pass + catalog repoint follow in the same session.

## 2026-08-13: All 471 stills pixel-sampled

Pillow-sampled **471/471** stills (0 corrupt). Vision-read **92** unread-cluster frames this pass (prior 20). **72/72** clusters have a vision sample. Per-file palettes: `notes/stills-pixel-sample.json` + `.csv` + `notes/stills-full-catalog.md`. Hub rewritten. Desk SoT (`#0f181c` / `#b49c60`) **not** retokenized. Competing illustration/mood systems documented only. Docs: `AssemblingComponentsAllStills_PSUEDOCODE.md`, `AssemblingComponentsAllStills.md`.

## 2026-08-13: Image catalog + pixel-sampled tokens

Root `.ok/frontmatter.yml` updated (was stale `item_count: 325`). Catalogued 471 stills + 39 mp4. Vision-read 19 design-critical frames. Sampled palette written into the catalog and applied to `ultraterrestrial-resurrection` `tokens.css` + `globals.css` `@theme`. Hub now embeds Prometheus + desk + plate 047.

## 2026-08-13: Apply phase lives in the app repo

Assembling-components **application** (tokens, providers, barrels, reduced motion) was wired into `ultraterrestrial-resurrection`, not this vault. Docs: `docs/plans/AssemblingComponentsApply_PSUEDOCODE.md` and `docs/plans/AssemblingComponentsApply.md` in that repo. Vault notes were checked for ENOSPC truncation — no repair needed; GitHub clones were not re-ingested.

## 2026-08-13: Customized vault for assembling-components

Retargeted `concepts/`, `references/`, and `notes/` collections and templates for assembling-components (skill-chain stage, tokens, framework, motion, source repo). Added concept graph (token-first assembly, skill chain, barrels, providers, framework chooser, reduced motion, validation gates, AnyDesign/MotionViz bridges, hub), sourced references (skill, token rules, AnyDesign repo + uploaded artifact + rename map, MotionWiki-Playbook, production checklist), and an agent runbook. Ingested [uxKero/anydesign](https://github.com/uxKero/anydesign) and [adi0900/MotionWiki-Playbook](https://github.com/adi0900/MotionWiki-Playbook) as curated notes (clones not vendored). Planning doc: `AssemblingComponentsResearch_PSUEDOCODE.md`. Architecture doc: `AssemblingComponentsResearch.md`.
