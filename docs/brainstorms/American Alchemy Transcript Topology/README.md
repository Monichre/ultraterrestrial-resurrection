# Transcript Topology — American Alchemy

A research-grade, dark-mode 3D knowledge graph for the **American Alchemy** YouTube
transcript corpus (115 episodes). Episodes, recurring topics, and named people are
modeled as a heterogeneous node set with co-occurrence-weighted edges, three
alternative spatial layouts, kind filters, full-text search, and timestamped
excerpts that deep-link back to YouTube at the right second.

Built as a single static HTML app over a precomputed `data/topology.json`
payload — **no server, no API key, no LLM required at runtime.**

---

## What you get

- **252 nodes** — 115 episodes + 91 curated topics (UAP/disclosure, abduction,
  consciousness, antigravity, occult/freemasonry, ancient Egypt, JFK, MK-ULTRA,
  Skinwalker Ranch, etc.) + 46 named people (Bob Lazar, Hal Puthoff, Jacques
  Vallée, Diana Pasulka, Garry Nolan, David Grusch, Lue Elizondo, Travis Walton,
  Aleister Crowley, John Mack, Avi Loeb, …).
- **3 topologies** — central (medoid radiates), decentral (cluster hubs on a
  Fibonacci sphere with episodes/topics/people orbiting), distrib (SVD
  projection of TF·IDF over topic + person bag).
- **6 clusters** auto-named by their most distinguishing topic: *Uap Ufo,
  Longevity, Ancient Egypt, Covid, Psi Psychic, Psychedelics.*
- **Excerpts with timestamps** that deep-link to `youtube.com/watch?v=...&t=N`s.
- **Kind filter pills** (Episodes / Topics / People) toggle whole node classes.
- **Search** over names + summary snippets, respects the kind filter.
- **12 unavailable episodes** are surfaced via a dedicated modal with reasons.
- **Export JSON** dumps the live topology as a downloadable file.

---

## How to run

```bash
cd transcript_topology
python3 -m http.server 8765
# then open http://localhost:8765/app.html
# or http://localhost:8765/app.html#auto  (skip the setup screen)
```

Any static webserver works — the app fetches `./data/topology.json` relatively.

---

## Regenerating the topology

The generator is fully deterministic. No LLM, no API key.

```bash
cd transcript_topology
python3 scripts/build_topology.py
```

Inputs (read by the script):

- `../youtube_transcripts/manifest.json` — playlist index, titles, video IDs,
  URLs, durations, channel, paragraph counts.
- `../youtube_transcripts/transcripts/*.md` — one markdown file per episode
  with `[HH:MM:SS.mmm] text` paragraphs.

Output: `data/topology.json` (~1.3 MB).

Tweak the corpus + vocabulary by editing the top of
`scripts/build_topology.py`:

- `TRANSCRIPT_DIR`, `MANIFEST_PATH` — pointers to the source data.
- `TOPICS` — dict of `topic_key → list of regex patterns`. Adding a new
  pattern grows that topic's match count across the corpus. Patterns are
  case-insensitive and matched as Python regexes against each paragraph.
- `KNOWN_PEOPLE` — allow-list of names. Names are matched only as
  word-bounded full-name strings (no NER, no inference) to keep precision
  high.
- `K_CLUSTERS` — number of K-means clusters (default 6).
- `K_NN` — k-nearest-neighbors per episode in the *distributed* topology
  (default 5).
- `N_TOP_TOPICS`, `N_TOP_PEOPLE`, `N_EXCERPTS_PER_EPISODE`,
  `N_EXCERPTS_PER_TOPIC`, `N_EXCERPTS_PER_PERSON` — caps that control
  payload size.

---

## Data shape (`data/topology.json`)

```jsonc
{
  "schema_version": 1,
  "stats": { "episodes": 115, "topics": 91, "people": 46,
             "k_clusters": 6, "k_nn": 5 },
  "cluster_names": { "0": "Uap Ufo", "1": "Longevity", ... },
  "topic_vocabulary": { "uap-ufo": ["uap", "ufo", ...], ... },
  "person_vocabulary": { "Bob Lazar": ["Bob Lazar"], ... },
  "missing": [
    { "playlist_index": 31, "title": "[Private video]",
      "reason": "No English subtitle file downloaded; ...", "url": "..." },
    ...
  ],

  "nodes": [
    // Episode node
    {
      "id": "ep-001", "kind": "episode",
      "name": "Bob Lazar Reveals UFO Secrets",
      "playlist_index": 1, "video_id": "abc123",
      "url": "https://www.youtube.com/watch?v=abc123",
      "duration": "1:42:13", "channel": "American Alchemy",
      "paragraph_count": 412,
      "cluster_id": 0, "cluster_name": "Uap Ufo",
      "is_medoid": false,
      "top_topics":  [{ "id": "uap-ufo", "count": 47 }, ...],
      "top_people":  [{ "name": "Bob Lazar", "count": 19 }, ...],
      "excerpts":    [{ "topic": "uap-ufo", "t": 932.4,
                        "text": "...he saw the craft..." }, ...],
      "first_paras": [{ "t": 0.0, "text": "Welcome back ..." }, ...],
      "x_central": -184.2, "y_central": 92.6, "z_central": 14.0,
      "x_decentral": ..., "y_decentral": ..., "z_decentral": ...,
      "x_distrib":   ..., "y_distrib":   ..., "z_distrib":   ...
    },
    // Topic node
    { "id": "topic-uap-ufo", "kind": "topic", "name": "Uap Ufo",
      "topic_key": "uap-ufo", "episode_count": 88,
      "cluster_id": 0, "cluster_name": "Uap Ufo",
      "x_central": ..., ... },
    // Person node
    { "id": "person-bob-lazar", "kind": "person", "name": "Bob Lazar",
      "episode_count": 12,
      "cluster_id": 0, "cluster_name": "Uap Ufo",
      "x_central": ..., ... }
  ],

  "edges": {
    // Central: episodes connected to the medoid; topics/people connect
    // to their dominant cluster's centroid episode.
    "central":   [{ "source": "ep-001", "target": "ep-medoid",
                    "label_forward": "RADIATES FROM",
                    "label_backward": "GATHERS" }, ...],
    // Decentral: cluster hub edges + topic/person → episode bipartite edges.
    "decentral": [...],
    // Distrib: k-NN edges (episode↔episode by TF·IDF cosine) +
    // topic/person → episode bipartite edges.
    "distrib":   [...]
  },

  // Cross-episode excerpts, indexed by topic_key and person name.
  "topic_excerpts":  { "uap-ufo": [{ "episode_id": "ep-001",
                                      "episode_title": "...",
                                      "video_id": "abc123",
                                      "t": 932.4,
                                      "text": "..." }, ...] },
  "person_excerpts": { "Bob Lazar": [...] },

  "medoid_id": "ep-042"
}
```

### Coordinate convention

All `x_*`, `y_*`, `z_*` values live in a roughly **±300** range. The app's
`createPositionForce` expects ±1, so `hydrateAndRender()` divides every coord
by `COORD_DIV = 300` before handing nodes to `3d-force-graph`. Anyone
regenerating the data shouldn't change the range without also adjusting
`COORD_DIV` in `app.html`.

---

## How it's extracted (high-level)

1. **Parse manifest** — list 115 expected episodes; mark 12 missing with reason.
2. **Parse transcripts** — each `.md` file becomes a list of timestamped
   paragraphs `[(seconds, text), ...]`.
3. **Topic counts** — for each paragraph, run every regex in `TOPICS`; record
   `(topic_key, t, snippet)` triples per episode.
4. **Person counts** — same idea, but with full-name word-boundary regexes
   from `KNOWN_PEOPLE`.
5. **Episode features** — for each episode build a TF·IDF–weighted vector over
   topics + people (`features = [topic_counts ⊕ person_counts]`,
   IDF normalized).
6. **Cluster** — K-means on episode features, K=6. Auto-name each cluster by
   the topic whose mean weight is highest *inside* the cluster *relative* to
   outside (max `μ_in − μ_out`).
7. **Three layouts:**
   - *Central* — pick the medoid episode (smallest sum of distances), place
     it at origin. All other episodes radiate by feature distance.
     Topics/people attach near the medoid.
   - *Decentral* — Fibonacci sphere with K cluster hubs; each hub's
     episodes/topics/people orbit at radii proportional to their
     cluster-relative weight.
   - *Distrib* — truncated SVD of the episode×feature matrix → 3D. Topics
     and people are placed at the centroid of their associated episodes.
8. **Edges:**
   - *Central* — `{episode → medoid}` for episodes, `{topic → dominant
     cluster episode}` for topics/people.
   - *Decentral* — same shape but rooted on each cluster's hub-anchor
     episode; cross-hub edges link hubs to the global medoid.
   - *Distrib* — episode↔episode k-NN by TF·IDF cosine, plus bipartite
     topic→episode and person→episode edges for the top N associations.
9. **Excerpts** — for each topic and person, snapshot up to N
   timestamped one-sentence excerpts across distinct episodes, deduplicated
   by short text prefix.

Edge labels live in `label_forward` / `label_backward` (e.g. *RADIATES FROM /
GATHERS*, *MENTIONED IN / MENTIONS*) so each direction reads naturally in the
detail panel.

---

## UI conventions

- **Top-left** — Title, layout description, search bar (and dropdown).
- **Top-center** — Layout switcher (Centralized / Decentralized /
  Distributed). Each switch reheats the position force for a smooth
  ~2-second drift.
- **Top-right** — Kind-filter pills (Episodes / Topics / People). Turning a
  pill off hides those nodes *and* any edge that touches them, in
  addition to running search dropdown logic. *12 MISSING* opens the
  unavailable-episodes modal; *EXPORT JSON* downloads the live payload.
- **Left rail** — node/edge readouts, K-NN setting, cluster legend with
  auto-derived names and the medoid / LLM-nominated-center markers.
- **Right pane** — kind-aware detail card:
  - *Episode*: playlist index, duration, channel, paragraph count,
    YouTube deep-link, top topics (chip), people (chip), excerpts with
    timestamped YouTube links (`t=` parameter).
  - *Topic*: match-regex patterns + episode count + cross-episode
    excerpts (click the title chip on any excerpt to jump to that episode).
  - *Person*: episode count + cross-episode mentions (each linked to the
    moment in the source video).
- **Hidden affordances:**
  - `H` — recenter camera.
  - `Esc` — close detail card / modal.
  - `Shift-R` — reveal the *RE-ANALYZE* button (re-fetches `topology.json`
    with cache bust; useful while iterating on the generator).

---

## Known limitations

- **Deterministic, not semantic.** Topics are matched by curated regexes;
  people by curated full-name allow-list. The system does not perform NER
  or embedding-based similarity; the topology reflects vocabulary
  overlap, not free-form semantic similarity. This was an intentional
  trade-off — no transcripts/facts are invented.
- **Per-episode features are sparse.** Some episodes light up few topics
  (especially shorter Q&As); their layout coords are driven mostly by the
  dominant 1–2 topics they share with others.
- **12 missing episodes** in the playlist (private, region-locked, or
  caption-less). They're listed in `missing` and surfaced in the modal,
  not faked as nodes.
- **Cluster naming is best-effort.** It picks the topic with the largest
  *mean-in − mean-out* gap. If two clusters have similar dominant topics,
  the second-most distinctive topic may be a better label.
- **Search is substring-only.** It walks `name + snippet` blob (top
  topics & people for episodes). No fuzzy match, no relevance score
  beyond "match-position-in-name."
- **WebGL & cluster-label DOM** — a few hundred CSS2D labels for nodes are
  rendered each frame on top of the 3D graph; on low-end devices this
  may run at <30 fps when the *Distributed* topology is selected
  (3382 edges).

---

## Files

```
transcript_topology/
├── app.html                       single-file static app (modified from
│                                  the upstream Obsidian-notes graph)
├── data/
│   └── topology.json              precomputed payload (~1.3 MB)
├── scripts/
│   └── build_topology.py          deterministic generator
├── LICENSE
└── README.md                      this file
```

---

## Provenance & licensing

The upstream visual shell is the Obsidian-notes 3D force graph originally
written for a different corpus. The transcript loader, deterministic
extraction pipeline, kind-aware data model, search, kind filters, missing
modal, export, and theme adjustments are new for this project.

Episode metadata and transcripts come from the **American Alchemy**
YouTube channel; no transcript text was synthesized. All excerpts are
copied verbatim from the auto-generated English captions associated with
each video, and link back to the source frame.
