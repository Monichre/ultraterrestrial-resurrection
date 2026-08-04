# Research Canvas — Context

The core power-user surface: a researcher assembles primary records into an Investigation on a ReactFlow canvas, draws connections, and asks the agent to amplify. This context owns the canvas's node/edge/panel vocabulary, the visual grammar that keeps Inference delineated from Evidence, and the synthesis field names.

Reserved words (`Claim`, `Inference`, `Evidence`, `Proves`) and the eight evidentiary states are defined in the root [`CONTEXT.md`](../../CONTEXT.md) and may not be redefined here. What follows is this context's **local encoding** of them.

---

## The surface

**Canvas**:
The ReactFlow viewport. `activeView: 'canvas'` in the Zustand navigation slice. Rendered by `graph.tsx` and passed into `ViewSwitcher` as `canvasContent`.
_Avoid_: "canvas" as a synonym for Investigation (the data object)

**View**:
One of exactly five values on `ActiveView` (`store/mindmap-ui-store.ts`): `canvas | timeline | globe | search | detail`. `ViewSwitcher` switches on `navigation.activeView`; the non-canvas four lazy-load from `research-canvas/views/`.
_Avoid_: routing between views with `router.push()` — navigation goes through Zustand `setActiveView()`; the `path` fields in `FullScreenMenu.VIEWS` are decorative

**Globe** (view name):
The `activeView` value that renders the sightings view (`research-canvas/views/ufo-sightings/page`). The value and the directory disagree; the union value is authoritative.
_Avoid_: adding a `'sightings'` view value — `globe` is the name

---

## Node vocabulary

The `nodeTypes` registry (`config/node-types.tsx`) is the authority on which string keys ReactFlow will render. Keys group by role:

**Record nodes** — `entityNode`, `eventsNode`, `personnelNode`, `topicsNode`, `organizationsNode`, `testimoniesNode`, `documentNode`. One key per primary record type. Source-derived material; solid borders.

**Enhanced record nodes** — `enhancedEntityNode` (production) and `enhancedEntityNodePOC` (proof of concept). The consistency layer other features build on.

**Group nodes** — `entityGroupNode`, `personnelGroupNode`, `groupResultsNode`, plus their `…Child…` variants. Containers for a set of records returned together, not a domain concept.

**`annotationNode`**:
A researcher-authored annotation on the canvas — the node-level form of a **Field Note**. Source of truth is the human.
_Avoid_: rendering agent output through this type

**`aiAnnotationNode`**:
The agent-authored annotation — the node-level form of an **Inference**. Must carry the dashed-border / `[ INFERRED ]`-family delineation.
_Avoid_: "AI note", "insight node"; presenting this undelineated beside record nodes

**`userInputNode`**:
The researcher's query as a node on the canvas — the seed of a research move, not a record.

---

## Edge vocabulary

The `edgeTypes` registry (`config/edge-types.tsx`) holds four ReactFlow primitives (`default`, `straight`, `smoothstep`, `bezier`) plus four domain types:

**`dataEdge`**:
A connection carrying record-derived data. The default for asserted structure.

**`siblingEdge`**:
A connection between records that share a documented link, drawn from the deterministic suggestion engine's `connected` signal.

**`aiAnimatedEdge`**:
An agent-drawn connection. Its `reasoning` string is an Inference and is persisted via `insertAgentInference`. Animation marks it as the analytical layer, not as importance.
_Avoid_: using this type for researcher-drawn connections; treating the animation as emphasis

**`animatedSvgEdge`**:
Presentational motion along a path. Carries no epistemic meaning.
_Avoid_: reading state into it

**Edge `reasoning`**:
The string on an edge that explains why it exists. Wire format is `[State] rest of text`; every agent-written one is persisted to `agent_inferences`.
_Avoid_: writing an unprefixed reasoning string and letting a renderer default-fill a state

---

## Panels and docks

**Dossier**:
The clipped-corner "secret-file" treatment for a major single-record panel. A visual/naming convention, not one component.
_Avoid_: "detail panel", "card", "inspector" in copy for this treatment

**`SynthesisPanel`** (`components/synthesis-panel.tsx`):
Renders the output of the `synthesizeInvestigation` server action over what is already on the canvas.

**Research Suggestions Dock** (`components/research-suggestions-dock.tsx`):
Surfaces `RelatedSuggestion` records from `@db/postgres`, each with a signal-honest reason (documented link / semantic affinity / temporal cluster) and a **next trace**. Replaced the former ConnectedRecordsPanel.
_Avoid_: "Recommended for you", "You might like"

**Hover panels** (`components/menus/mindmap-side-menu/hover-panels/`):
Side-menu tool surfaces (Filter, Layers, Layout, Network, Timeline, SavedViews, History, Collaboration, Templates, QuickActions, AssetLibrary, Settings). Chrome, not domain objects — they take generic names on purpose.

**`FloatingToolbar`** (`research-canvas/FloatingToolbar.tsx`):
Where the "Synthesize Investigation" action lives.

---

## The inference overlay

**Inference (on canvas)**:
Any agent-produced content rendered on the surface — an `aiAnnotationNode`, an `aiAnimatedEdge` reasoning string, or a synthesis section. Always visually delineated (dashed border + bracketed state badge) and always attributed to a provider ("Served by Claude Opus 4.8").
_Avoid_: presenting inference inline with sourced content without delineation

**Write path**:
Agent output reaches the database only through `insertAgentInference` (`@db/postgres`). The canvas never writes to entity tables.

---

## Synthesis vocabulary

Field names on `SYNTHESIS_SCHEMA` (`actions/synthesize-investigation.ts`) — these are the canonical spellings, in order:

`signal` · `evidentiaryGround` (`{strongest, weakest}`) · `sequence` · `fieldMap` · `contradictions` · `readings` · `evidentiaryWeight` · `openQuestions` · `nextTraces`

**`readings`** carries exactly five competing frames (`READINGS_SCHEMA`): `prosaic`, `institutional`, `psychologicalSocial`, `anomalous`, `mythopoetic`. All five are required — the required non-anomalous three are the anti-echo-chamber mechanism.
_Avoid_: shipping a synthesis missing the prosaic or institutional reading; labeling `mythopoetic` as evidence rather than resonance

**Hypothesis** (canvas-local):
Reserved in this context for the *deterministic* pre-enrichment floor produced without an LLM. `enrich-hypothesis.ts` turns it into a Reading/Counter-reading pair; the floor itself stays a hypothesis.
_Avoid_: "hypothesis" for LLM-produced synthesis output — that is a Reading

---

## Evidentiary badge grammar (local encoding)

The eight states live in `features/mindmap/utils/evidentiary-state.ts` as `EVIDENTIARY_STATES`.

- **Casing here is TitleCase** — `'Corroborated'` in code and on the wire. (`@db/postgres` persists the same states lowercase; see the Database context.)
- **Wire format**: `[State] rest of text`, produced by `withEvidentiaryState`, parsed and stripped by `parseEvidentiaryState`. No prefix → no badge.
- **Rendered format**: `[ CORROBORATED ]` — bracketed mono, uppercase. `EvidentiaryStateBadge` (`components/evidentiary-state-badge.tsx`).
- **Colors are locked** in `EVIDENTIARY_STATE_COLORS`: emerald = Observed/Corroborated · amber = Contested · sky = Inferred · orange = Speculative · violet = Resonant · zinc = Unverified · red = Disconfirmed.

_Avoid_: default-filling a state when the prefix is absent; introducing a ninth state without a terminology ruling; re-deriving badge colors locally

---

## Interaction vocabulary

**Trace / Next trace**:
The recommended next research action, surfaced in the dock and in synthesis `nextTraces`. As a verb: to follow a connection or provenance chain.
_Avoid_: "follow-up", "suggestion", "action item", "task"

**Draw connection**:
The researcher-initiated act of creating an edge.
_Avoid_: "link", "connect nodes" in copy

**Add to investigation**:
Moving a record onto the canvas.
_Avoid_: "add to canvas", "pin", "save"

**Synthesize Investigation**:
The toolbar action that narrates what is already assembled. Distinct from the dock's hypothesis, which proposes what to add next.

**Empty canvas copy**: an invitation ("Assemble records to begin an investigation").
_Avoid_: "No data", "Nothing here yet!"

Full register, casing, and tone rules: [`docs/vision/UX_LANGUAGE_GUIDE.md`](../../docs/vision/UX_LANGUAGE_GUIDE.md).

---

## Naming debt in this context

**`personnel` → Key Figure**:
The domain term is **Key Figure**; the Postgres table is `key_figures`. The canvas still registers `personnelNode`, `personnelGroupNode`, and `personnelGroupNodeChild`, and imports `getAllPersonnel`.
_Avoid_: "personnel" in any user-facing string; adding new `personnel*` identifiers

**`xata` residue**:
`actions/xata-to-xyflow.ts` and the `record.xata.score` shape returned by `searchTable` are compatibility leftovers. The Xata SDK is retired.
_Avoid_: importing from `@db/xata`; naming anything new `xata*`
