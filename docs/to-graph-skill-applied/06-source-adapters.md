# Source adapters — Ultraterrestrial

Kernel rule (unchanged): each source type has an adapter that emits one
`NormalizedDocument`. Downstream never cares about YouTube vs PDF.

## Adapters that actually exist in this app

| Source | Adapter path | IR notes |
|--------|--------------|----------|
| YouTube URL / playlist | [`apps/disclosure-rag/lib/youtube.py`](apps/disclosure-rag/lib/youtube.py), [`apps/disclosure-rag/scripts/playlist_ingestion.py`](apps/disclosure-rag/scripts/playlist_ingestion.py) | transcript blocks; timestamp locators; **fidelity gate** before extract |
| Web article | [`apps/disclosure-rag/processing/web_content_processor.py`](apps/disclosure-rag/processing/web_content_processor.py) | readability body; canonical URL |
| Local file `.md .txt .pdf` | [`apps/disclosure-rag/main.py`](apps/disclosure-rag/main.py) `process_file` | filename as title hint |
| Bulk folder | [`apps/disclosure-rag/scripts/bulk_folder_ingestion.py`](apps/disclosure-rag/scripts/bulk_folder_ingestion.py) | MIME route into file adapter |

Playlist extras (overlay on kernel hydrate): caption coverage, density, gaps,
artifacts, repetition → quarantine if below threshold. Quarantine keeps Layer A
on disk and **does not** run extract/index.

## Locator conventions here

| Source | `Chunk.locator` |
|--------|-----------------|
| YouTube | `t=<seconds>` |
| PDF | `p=<page>` |
| Article | heading path + char span |
| File | heading path |

## Out of scope for this overlay

Social-thread stitching, design screenshots, Obsidian vaults — other domains.
