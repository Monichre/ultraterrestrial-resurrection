# Playlist Ingestion Reference

Deep-dive on the YouTube podcast playlist pipeline (`scripts/playlist_ingestion.py`).

## Stage-by-Stage Flow

```
playlist URL(s)
  |-> Episode Enumeration
  |     yt-dlp flat extraction (no downloads; returns id, title, duration per entry)
  |     pytube fallback if yt-dlp fails
  |     Plain video URLs are treated as single-episode playlists
  |
  |-> Transcript Fetch (per episode)
  |     lib/youtube_transcript_enhanced.get_metadata_and_transcript_api_first()
  |     Cookie-free youtube-transcript-api + oEmbed metadata
  |     No transcript available -> status `no_transcript`, move on
  |
  |-> Parse + Clean
  |     lib/transcript_fidelity.clean_transcript()
  |     Strips [Music]/[Applause]/[inaudible] cues, dedupes stuck caption
  |     lines, normalizes whitespace
  |     Cleaned copy saved to data/playlist_ingestion/transcripts/<video_id>.txt
  |
  |-> Fidelity Review
  |     lib/transcript_fidelity.review_transcript() -> FidelityReport
  |     Heuristic subscores (weights):
  |       coverage   .30  captions cover the episode's yt-dlp duration
  |       density    .20  words-per-minute in the 90-220 speech band
  |       gaps       .15  largest silence between caption segments
  |       artifacts  .15  non-speech cue ratio in raw text
  |       repetition .20  duplicate 6-gram windows (stuck captions)
  |     Optional --llm-review: samples 3 chunks, asks FIDELITY_REVIEW_MODEL
  |     (default gpt-5.5) for a coherence rating that becomes 1/3 of the score
  |     Verdicts: pass >= 0.7 | review 0.45-0.7 | fail < 0.45
  |     Report saved to data/playlist_ingestion/reports/<video_id>.fidelity.json
  |
  |-> Quality Gate
  |     verdict `fail` OR score < --min-fidelity -> status `quarantined`
  |     (transcript + report kept on disk for human review; NOT ingested)
  |
  |-> Full Pipeline (main.process_url)
        KB storage -> Upstash sync -> NER entity extraction ->
        vectorization (--upload -> OpenAI vector store) ->
        CocoIndex knowledge graph -> Mem0 memory
```

## Checkpointing & Resume

State lives in `data/playlist_ingestion/state.json`, keyed by video ID:

```json
{
  "videos": {
    "dQw4w9WgXcQ": {
      "title": "...", "url": "...", "playlist_id": "PL...",
      "status": "ingested", "fidelity": 0.87, "doc_id": "abc123",
      "updated": "2026-07-23T18:00:00+00:00"
    }
  }
}
```

- State is written after **every** episode (atomic tmp-file swap), so a crash
  or Ctrl-C loses at most the in-flight episode.
- Re-running the same playlist skips episodes whose status is `ingested` or
  `quarantined`. `no_transcript` and `failed` episodes are retried
  automatically. Use `--force` to reprocess everything.
- Statuses: `ingested`, `quarantined`, `no_transcript`, `failed`, `dry_run`,
  `skipped` (counted per run, not stored).

## Output Artifacts

| Path | Contents |
|------|----------|
| `data/playlist_ingestion/state.json` | Resume checkpoint (all episodes ever seen) |
| `data/playlist_ingestion/transcripts/<id>.txt` | Cleaned transcript (title + URL header) |
| `data/playlist_ingestion/reports/<id>.fidelity.json` | Full FidelityReport with subscores + issues |
| `data/playlist_ingestion/reports/run-<ts>.md` | Per-run markdown summary table |

## Duplicate Fetch Note

The fidelity stage fetches the transcript once for scoring, then
`main.process_url()` re-fetches it internally during ingestion. This is
deliberate: it keeps `main.py` untouched and the gate fully decoupled. The
transcript API is fast and the `--delay` flag (default 2s) keeps request
pacing polite. If YouTube rate-limits a long run, raise `--delay`.

## Reviewing Quarantined Episodes

```bash
# List quarantined episodes with their issues
python -c "
import json
s = json.load(open('data/playlist_ingestion/state.json'))
for vid, e in s['videos'].items():
    if e.get('status') == 'quarantined':
        print(f\"{vid}  {e.get('fidelity')}  {e['title'][:60]}\")
        for i in e.get('issues', []): print(f'   - {i}')
"
```

To ingest one anyway after manual review, run the standard single-URL path:

```bash
python main.py "https://www.youtube.com/watch?v=<id>" --upload
```

then update its state entry (or just leave it — `--force` is per-run, and the
single-URL path doesn't consult the playlist state file).

## Tuning

- `--min-fidelity 0.6` — stricter gate for noisy auto-captioned channels
- `--llm-review` — worth it for channels with heavy crosstalk; costs one
  chat completion per episode (`FIDELITY_REVIEW_MODEL`, default `gpt-5.5`)
- `--limit 5 --dry-run` — cheap preview of a new playlist's caption quality
  before committing to a full ingest
- Fidelity weights/thresholds live at the top of `lib/transcript_fidelity.py`
