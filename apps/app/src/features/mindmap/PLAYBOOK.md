Disclosure Explorer – Agent Playbook

Purpose  Provide one authoritative reference for how the agent should orchestrate guided tours through the Disclosure knowledge‑base and when to fall back to free‑form investigation.
This supersedes all earlier drafts.

⸻

1 Tour Modes

Mode Short ID Default? What the user sees Data order
Core Disclosure Narrative core Yes A forward‑moving walkthrough of the most important historical events in the disclosure timeline. Strict chronological order (oldest → newest) with the famous flag true.
UFOs by Decade decade No Timeline segmented into decade buckets (40s, 50s … present). Chronological inside each bucket. Buckets delivered oldest → newest.
Free Investigation free No A blank canvas & search bar. The user drives. N/A – agent only responds to explicit queries.

Switching rules
 • Default to core unless the user explicitly requests a different mode.
 • Accept aliases:
“guided tour” → core  ·  “decade view” → decade  ·  “explore on my own” → free.
 • Mode persists until the user switches or ends the session.

⸻

2 Data Sources & Tools

Layer What it holds Access method
OpenAI Vector Store ±1 000 indexed transcripts, case files, long‑form docs. file_search (native assistant tool).
Zeta (Postgres + Vector) Structured event / entity tables (e.g. events, people). searchDatabase function (wrapper around Zeta TS SDK).
Graph Stream On‑the‑fly mind‑map nodes + edges. transformXYFlow function (returns XYFlow JSON).

The agent should:
 1. Try file_search first for content retrieval (quick context, quotations, etc.).
 2. Call searchDatabase when structured results (records) are needed or when file_search results instruct it to.
 3. Pipe any returned records to transformXYFlow when the user is in a view that expects a graph (mind‑map) update.

⸻

3 Guided‑Tour Navigation Logic

if mode == "core":
    dataset = events.filter(famous == true).order_by(date)
elif mode == "decade":
    dataset = events.order_by(date).chunk_by(decade)

 • Forward / Backward:
Forward moves to the next chronological item; Back moves to the previous one.
Determined purely by the date field.
 • Narration payload per stop:
 1. Title + Date range
 2. Short summary (≤ 80 words)
 3. Key actors (people table)
 4. Primary source links (vector‑store citations)

⸻

4 UX / Streaming
 • Deliver each stop as a stream:
summary → citations → optional mind‑map update.
 • In GUI, expose three buttons: ◀︎ Back | Next ▶︎ | Switch Mode.
 • Free investigation mode shows only a search bar; agent answers conversationally.

⸻

5 Open Questions / Future Work
 • Mind‑map granularity – auto‑collapse sub‑graphs when >50 nodes.
 • Ranking inside decades – currently chronological; consider weighting by impact_score.
 • Multi‑modal – add image previews for well‑known documents if available.

⸻

6 Implementation Checklist
 • core set as start‑up mode.
 • Keep existing decade implementation.
 • Add explicit mode parameter to URL / session state.
 • Ensure searchDatabase returns typed records (event, person, …).
 • Surface mode‑switch in UI toolbar.

⸻

End of Playbook
