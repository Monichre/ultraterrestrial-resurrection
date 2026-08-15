# Guided Tour Canvas Design Lab — 2026-07-19

**Status:** Paused after Variant F synthesis (not finalized)  
**Target:** `GuidedTourCanvasSurface` — research-canvas tour chrome  
**Live lab:** `apps/app/src/app/design-lab/` → <http://localhost:3000/design-lab>  
**Canon skin:** Microfilm Dark (`DESIGN.md`) · dual registers (`docs/vision/DESIGN_REGISTERS.md`)  
**Narrative package:** Nuclear Shadow Act I — *The Architecture of Secrecy* (§6)

---

## Summary

Design exploration for making the guided tour feel **on-canvas and dynamic** (not a modal click-card), while keeping the graph primary. External references: **Polyphonic** screenshots and **apossible.com**. Current winner candidate is **Variant F**.

**Narrative alignment:** The tour is a **traversable evidence graph**, not a scrolling article with decorative timeline dots. For *The Nuclear Shadow*, Act I opens on Manhattan Project secrecy machinery — Roswell is the handoff, not the beginning. Full Act I waypoint contract, schema, route language, and waypoints 01–08 are in [§6](#6-nuclear-shadow--act-i-the-architecture-of-secrecy).

---

## 1. Polyphonic → research-canvas mapping

Reviewed screens: Substrate/Memory, Observer, Deep Well research, home + orb, Import companion.

| Polyphonic surface | Closest UT surface | Steal | Don’t steal |
|---|---|---|---|
| Home + orb + “still here…” | `EmptyCanvas` + `ResearchCanvasConsole` | One focal void, bottom composer, Modes / Observer as secondary chrome | Golden particle brand mark (home hero owns cinema; canvas empty stays archival) |
| Observer | Chat / agent overlay on populated graph | Collapsible meta-agent; observes tour+graph without owning the canvas | Competing primary persona crowding tour narrative |
| Deep Well | Search → detail → synthesis | Query → ranked matches → Truth Card; query seeds; pointer/lazy fetch | Cold pure-black lab skin; generic “MEASURED” without UT evidentiary stamps |
| Substrate / Memory | Graph stats, AssetPanel, `agent_inferences` | Browse vs Digest; composition breakdown; durable candidates | Four hero KPI cards (`DESIGN.md` bans hero-metric blocks) — use mono stamps / file-ref headers |
| Import companion | Case-file ingest / attach / Bridge | Three intake paths: guided · attach · local bridge | “Luca / companion” framing — keep liturgy + epistemic tiers |

### What Polyphonic gets right for UT

1. **Progressive disclosure** — metadata first, heavy payloads on demand (same job as graph + dossier).
2. **Secondary observer** — under the main conversation; tour/graph stay primary.
3. **Truth Card ≈ liturgy** — boundary + evidence loop → what we know / think / counter-reading / next trace; rename into UT stamps + dashed inference borders.
4. **Icon rail as mode switcher** — cleaner than stuffing chrome into floating toolbars.
5. **Empty state as invitation** — protect `EmptyCanvas`; don’t upgrade empty into KPIs.

### Friction with UT canon

- Polyphonic is almost pure techno-analytical; UT needs **both** registers on one surface.
- Substrate-style metric theater violates Microfilm Dark.
- Existing lab scope was tour-chrome; Polyphonic also argues for Investigate / Empty+Observer / Truth Card as later targets.

### Port priority (deferred)

1. Deep Well → Investigate mode (query seeds + ranked hits + right-rail Truth Card / liturgy).
2. Observer → ⌘J canvas meta-agent over live graph+tour.
3. Import triad → “Bring sources in.”
4. Substrate → Digest of graph composition + pending inference commits.

---

## 2. Design Lab feedback (GuidedTourCanvasSurface)

**Target:** GuidedTourCanvasSurface  
**Comments:** 3

### Variant A

- Liked hierarchy HUD (graph stays primary).
- **Disliked** intelligence as a separate card / sidebar / drawer.
- Intelligence should be **baked into the record itself** or the **visual connection between records / waypoints**.

### Variant D

- Liked dynamic path tour (tour IS the path; narrative rides the chronological edge).
- Side menu (`G` rail): should **hide/show when not in use**.

### Overall direction

- Review **apossible.com** (local UX dump: `~/Downloads/apossible-ui-ux.html`).

---

## 3. apossible.com — steal notes

**Source:** <https://apossible.com> · UI/UX notes dated 19 Jul 2026  
**Product shape:** Dark draggable constellation of reference cards + fixed light reading panel (two-world interface).

### Steal for research-canvas

| Pattern | Application |
|---|---|
| Chrome-minimal / logo-as-menu | Auto-hide side nav; peek from left edge; pin optional |
| Constellation edges carry meaning | Mid-edge labels = affinity / evidentiary / tour path |
| Persistent map during detail | Graph never replaced by an intelligence panel |
| Taxonomy glyphs on cards | Evidentiary stamps on the **active record** |
| Archive as explorable mood board | Tour waypoints as on-canvas path, not modal stack |

### Don’t steal

- Cream / sepia reading-panel brand (conflicts with Microfilm Dark forced night scene).
- Polaroid photo-card aesthetic as default node chrome.
- Constant ornamental panning density on small screens without a reduced-motion path.

### One-line

APOSSIBLE dresses a research archive as an explorable constellation with minimal chrome — map stays primary; UT ports that **IA**, not the cream editorial skin.

---

## 4. Variant F — synthesis (current candidate)

**Composition:** A hierarchy HUD + D live path + apossible chrome-minimal.

### Rules locked in feedback

1. No intelligence card / sidebar / drawer.
2. Field reading + evidentiary stamps + affinity live **on the active record**.
3. Waypoint / affinity labels live **on edges**.
4. Side nav **auto-hides** (left hotzone + peek tab; pin to keep).
5. Slim top tour HUD; path narrator with Back / Continue only.

### Lab implementation

| File | Role |
|---|---|
| `apps/app/src/app/design-lab/CanvasChrome.tsx` | Shared floor: `navMode`, `showEdgeLabels`, `bakeIntelIntoRecord` |
| `apps/app/src/app/design-lab/VariantF.tsx` | Synthesized candidate |
| `apps/app/src/app/design-lab/page.tsx` | F primary; A + D comparison |
| `apps/app/src/app/design-lab/GuidedTourCanvasSurface_PSUEDOCODE.md` | Algorithm notes |
| `.claude-design/run-log.md` | Session log |

### Variants B / C / E

Demoted off the lab page after feedback; source files may still exist under `design-lab/`.

---

## 5. Pause state & next steps

**Paused:** 2026-07-19 — Variant F design lab not finalized.  
**Built:** 2026-07-31 — Nuclear Shadow Act I ported into the live app.

### Shipped (2026-07-31)

- Feature: `apps/app/src/features/guided-tours/`
- Route: `/tours/nuclear-shadow`
- Launch from research-canvas ActionChip + typer card + submit regex
- Docs: `apps/app/src/features/guided-tours/NuclearShadowTour.md`

### Still open (design lab)

1. Confirm F (or iterate: node height, edge-label noise, edges-only vs record+edges).
2. Final preview / cleanup temp `/design-lab` when ready.
3. Promote Polyphonic + apossible into `docs/vision/UI_INSPIRATION.md` on finalize.

---

## Related

- `DESIGN.md` — Microfilm Dark contract  
- `docs/vision/DESIGN_REGISTERS.md` — techno-analytical × archival-material  
- `docs/vision/UI_INSPIRATION.md` — external reference index (promote Polyphonic / apossible here on finalize)  
- `apps/app/src/features/mindmap/research-canvas/` — live canvas  
- `apps/app/src/features/guided-tours/` — live Nuclear Shadow Act I runtime  
- `docs/archive/prototypes/nuclear-shadow-xyflow/` — original reference prototype

---

## 6. Nuclear Shadow — Act I: The Architecture of Secrecy

Yes. The tour should **not** behave like a scrolling article with decorative timeline dots.

It should function as a **traversable evidence graph**:

> Each waypoint is a hard historical anchor, a bundle of claims and sources, a distinct interface state, and a directed transition to the next marker.

The user should always understand:

- where they are in time and geography;
- what factual claim brought them there;
- which evidence supports it;
- what challenges it;
- why the next waypoint logically follows;
- what remains unresolved.

For **The Nuclear Shadow**, Roswell should not be the beginning. The opening act should show how the Manhattan Project created the machinery capable of concealing, compartmentalizing, exploiting, and selectively revealing revolutionary physics.

That machinery is itself the first subject of investigation.

---

### 6.1 The Waypoint Contract

Every waypoint should have four synchronized layers:

#### Historical anchor

A date, location, institution, document, event, or policy change.

#### Evidence anchor

The primary records, later testimony, interpretations, contradictions, and confidence level attached to that historical point.

#### Narrative function

Why this waypoint must exist in the tour and what question it hands to the next one.

#### Interface state

The map position, timeline state, evidence layout, ambient sound, animation behavior, and departure path.

A waypoint is complete only when the user has encountered:

```text
CLAIM
  ↓
PRIMARY BASIS
  ↓
LIMITATION OR COUNTERPOINT
  ↓
UNRESOLVED QUESTION
  ↓
NEXT MARKER
```

That is the minimum viable epistemic unit.

---

### 6.2 Canonical Waypoint Schema

```yaml
waypoint:
  id: ut.tour.nuclear-shadow.wp-01
  tour_id: ut.tour.nuclear-shadow
  act_id: architecture-of-secrecy
  ordinal: 1

  title: The Secret Machine
  subtitle: The Manhattan Engineer District
  date_range:
    start: "1942-08-13"
    end: "1945-08-14"

  anchors:
    temporal:
      - "1942"
      - "1945-07-16"
    geographic:
      - id: los-alamos
        coordinates: [35.8800, -106.3031]
      - id: oak-ridge
        coordinates: [36.0104, -84.2696]
      - id: hanford
        coordinates: [46.5507, -119.4880]
    institutional:
      - Manhattan Engineer District
      - United States Army Corps of Engineers

  narrative:
    entry_claim: >-
      The Manhattan Project did more than create an atomic weapon.
      It created a durable operating model for compartmentalized,
      contractor-driven, geographically distributed secret science.
    question: >-
      What happens when revolutionary physics becomes inseparable
      from military secrecy?
    handoff_question: >-
      Once the weapon existed, who would decide which knowledge
      could ever become public?

  evidence:
    required:
      - evidence_id: nps-manhattan-secrecy
        type: official_history
        role: primary_context
      - evidence_id: doe-manhattan-history
        type: official_history
        role: institutional_context
    counterpoints:
      - evidence_id: soviet-penetration
        role: secrecy_limit
    minimum_confidence: documentary

  epistemic:
    established:
      - compartmentalized access
      - distributed secret facilities
      - contractor and military integration
    not_established:
      - connection to anomalous craft
      - development of non-nuclear exotic propulsion
      - continuity of every Manhattan-era compartment
    open_questions:
      - Which organizational patterns survived into postwar programs?
      - How much knowledge can disappear across compartments?

  ui:
    scene: continental-secret-network
    primary_visual: map
    evidence_layout: layered-dossier
    next_marker_visibility: ghosted
    completion_indicator:
      states:
        - claim
        - source
        - challenge
        - residue

  transition:
    edge_type: institutional_inheritance
    target_waypoint: ut.tour.nuclear-shadow.wp-02
    animation: archive-line-trace
    duration_ms: 1100
```

---

### 6.3 Route Language

The route between markers should encode **why** the narrative moves.

#### Edge types

```text
────────  Chronological continuation

- - - -   Evidentiary association

········  Hypothesis or disputed relationship

═══════   Institutional inheritance

↯↯↯↯↯↯   Contradiction or rupture
```

A line from Manhattan to the Atomic Energy Act is not merely chronological. It is **institutional inheritance**.

A line from nuclear secrecy to hypothetical exotic propulsion is not established history. It is a **jurisdictional and hypothesis edge**, and the interface should visibly say so.

That distinction protects the tour from turning visual proximity into implied causality.

---

### 6.4 Act I Structure

#### Title

**The Architecture of Secrecy**

#### Date range

```text
1939–1947
```

#### Governing question

> Did the atomic age merely create the bureaucratic machinery later associated with hidden aerospace programs, or did it also create a legal sanctuary in which radical physics could disappear from public science?

#### Act I route

```text
THE MANHATTAN PROJECT
        ↓
COMPARTMENTALIZATION
        ↓
TRINITY
        ↓
CONTROLLED PUBLIC DISCLOSURE
        ↓
RESTRICTED DATA
        ↓
THE DUAL CLASSIFICATION SYSTEM
        ↓
SPECIAL ACCESS PROGRAMS
        ↓
THE PROPULSION FORK
        ↓
ROSWELL
```

---

### 6.5 Waypoint 01 — The Secret Machine

#### Historical anchor

**The Manhattan Engineer District, 1942–1945**

The Manhattan Project operated through extreme compartmentalization, controlled physical access, background investigations, specialized badges, and distributed facilities. Few participants knew the entire purpose of the system; many workers understood only their immediate task. Its principal centers at Oak Ridge, Hanford, and Los Alamos formed a geographically distributed scientific-industrial network under military control. ([National Park Service](https://home.nps.gov/mapr/faqs.htm "Frequently Asked Questions - Manhattan Project National Historical Park (U.S. National Park Service)"))

#### Narrative function

The waypoint establishes that secrecy was not simply a curtain placed around a finished invention.

It was part of the production method.

The system could:

- divide a problem into isolated components;
- distribute those components among laboratories and contractors;
- restrict horizontal communication;
- reveal only the information needed for a specific task;
- preserve central control over the resulting synthesis.

This becomes the conceptual template through which users later examine classified aerospace development.

#### Interface composition

The screen begins almost empty:

```text
1942
UNITED STATES
```

Three faint markers appear:

- Oak Ridge
- Hanford
- Los Alamos

Lines begin connecting them, but the complete network remains obscured.

The user drags a **need-to-know aperture** across the map. Inside the aperture, they can see one compartment. Outside it, the remaining project disappears.

##### Interactive question

```text
HOW MUCH OF THE PROJECT COULD ONE PERSON SEE?
```

The user selects worker roles:

- construction worker;
- chemical engineer;
- physicist;
- military security officer;
- General Groves.

Each role produces a different visible network.

#### Arrival animation

1. Camera begins at continental altitude.
2. Three site markers pulse independently.
3. Their connecting lines attempt to form.
4. Black compartment shutters interrupt the lines.
5. The title types in:

```text
THE SECRET MACHINE
```

##### Timing

```yaml
arrival:
  map_zoom_ms: 900
  marker_stagger_ms: 140
  network_trace_ms: 1000
  compartment_close_ms: 450
  easing: power2.inOut
```

#### Completion gate

The user must encounter:

- one official history source;
- the compartmentalization model;
- one failure of secrecy, such as espionage or unauthorized transfer;
- the unresolved question.

The next marker then appears over southern New Mexico.

#### Departure animation

The three facilities collapse into a single glowing point. A route line moves southwest and resolves into the coordinates for Trinity.

---

### 6.6 Waypoint 02 — Trinity: The Threshold Event

#### Historical anchor

**July 16, 1945**

Trinity was the first detonation of a nuclear device and the culmination of the Manhattan Project’s secret research and development effort. ([The Department of Energy's Energy.gov](https://www.energy.gov/em/articles/manhattan-project-ems-origin-story "The Manhattan Project: EM's Origin Story | Department of Energy"))

#### Narrative function

Trinity is not yet presented as a UAP event.

It is presented as a **civilizational threshold**:

- theoretical physics becomes a deployable weapon;
- scientific discovery becomes strategic state property;
- a hidden technological reality becomes globally consequential before the public knows it exists.

The tour asks:

> How long can a technological revolution exist before the public becomes aware of it?

That question is much more useful than immediately suggesting that Trinity attracted nonhuman attention.

#### Interface composition

The timeline pauses at:

```text
05:29:45
JULY 16, 1945
```

A white pulse washes out the interface.

When the image returns, the map is permanently altered:

- the pre-Trinity world appears in archival beige;
- the post-Trinity world acquires a black classification layer;
- every future waypoint sits beneath that layer.

#### Evidence object

The user opens a Trinity evidence plate containing:

- date and location;
- official historical record;
- photographs;
- project lineage;
- scientific significance;
- later anomalous interpretations, hidden by default.

The anomalous material appears only under:

```text
LATER ASSOCIATIONS
NOT CONTEMPORANEOUS EVIDENCE
```

That label is non-negotiable.

#### Departure animation

The blast image contracts into a circular government seal.

The seal becomes the cover of the Smyth Report.

---

### 6.7 Waypoint 03 — Controlled Revelation

#### Historical anchor

**The Smyth Report, August 1945**

The basic account of the Manhattan Project was deliberately prepared for release when the atomic bomb became public. The report was reviewed by senior project figures to ensure it did not disclose information considered useful for constructing a nuclear weapon. ([OSTI](https://www.osti.gov/opennet/manhattan-project-history/Resources/openness.htm "Manhattan Project: Nuclear Energy and the Public's Right to Know"))

#### Narrative function

This waypoint introduces a crucial Ultraterrestrial concept:

> Disclosure is rarely the opposite of secrecy. It is often an instrument of secrecy.

The state disclosed enough to:

- explain the existence of the weapon;
- establish an authorized history;
- satisfy public curiosity;
- protect technical details;
- define the initial boundary of legitimate knowledge.

#### Signature interaction — The Disclosure Mask

The user moves a slider:

```text
WHAT HAPPENED  ←────────→  WHAT COULD BE SAID
```

On the left:

- full project graph;
- technical processes;
- internal decisions;
- unresolved classified details.

On the right:

- authorized public narrative;
- approved language;
- selected photographs;
- withheld mechanisms.

The goal is not to insinuate dishonesty. It is to teach **controlled disclosure as a real administrative process**.

#### Departure animation

The report pages separate into individual sheets.

The sheets rearrange into statutory language:

```text
ATOMIC ENERGY ACT
```

---

### 6.8 Waypoint 04 — Born Secret

#### Historical anchor

**Atomic Energy Acts of 1946 and 1954**

The Atomic Energy Act defines Restricted Data as all data concerning the design, manufacture, or utilization of atomic weapons; production of special nuclear material; or use of special nuclear material in producing energy—unless that information has been declassified or removed from the category. DOE historical material explicitly describes large classes of nuclear records as “born classified.”

#### The key insight

Restricted Data is not simply an ordinary secret stamped by an official after creation.

It is a **statutory subject-matter category**.

That distinction is the heart of this section.

The user should understand three separate axes:

```text
WHAT KIND OF INFORMATION IS IT?
RD / FRD / TFNI / NSI

HOW DAMAGING WOULD RELEASE BE?
CONFIDENTIAL / SECRET / TOP SECRET

WHO MAY ACCESS IT?
COLLATERAL / COMPARTMENTED / SPECIAL ACCESS
```

These are not one ladder.

They are intersecting systems.

#### Important devil-in-the-details fact

The Atomic Energy Act’s definition of an “atomic weapon” expressly excludes the means of transporting or propelling the device when those means are separable and divisible from the weapon. At the same time, data concerning the use of special nuclear material in producing energy falls within the Restricted Data definition.

This produces the tour’s first **propulsion jurisdiction problem**:

- a separable missile or aircraft propulsion system is not automatically atomic-weapons design information;
- a nuclear reactor or propulsion concept using special nuclear material may implicate Restricted Data;
- an advanced non-nuclear propulsion technology could instead fall under National Security Information;
- a program integrating multiple technologies could contain commingled RD and NSI.

That is the actual policy architecture. It is stranger—and more useful—than simply saying “everything nuclear is classified.”

#### Signature interaction — Classification Reactor

The user drags hypothetical information into a classification field.

##### Example objects

```text
Nuclear warhead geometry
→ RESTRICTED DATA

Deployment location and military use
→ FORMERLY RESTRICTED DATA / NSI CONTEXT

Nuclear reactor propulsion design
→ POTENTIAL RESTRICTED DATA

Separable aircraft propulsion system
→ NOT AUTOMATICALLY RESTRICTED DATA

Advanced non-nuclear field propulsion
→ POSSIBLE NSI / SAP IF CLASSIFICATION STANDARDS ARE MET

Basic physics unrelated to national security
→ NOT CLASSIFIABLE UNDER E.O. 13526
```

The interface must say **potential**, not definitive, whenever actual classification would depend on a classification guide or authorized determination.

#### Counterweight panel

Executive Order 13526 prohibits classifying information merely to hide legal violations, inefficiency, administrative error, embarrassment, or competition, and says basic scientific research not clearly related to national security may not be classified. ([National Archives](https://www.archives.gov/about/laws/appendix/13526.html "Basic Laws and Authorities | National Archives"))

This panel keeps the tour from treating classification power as legally unlimited.

#### Departure animation

The words `RESTRICTED DATA` divide into two channels.

One moves toward DOE.

The other moves toward DoD.

They form the next interface.

---

### 6.9 Waypoint 05 — Two Secrecy Universes

#### Historical anchor

**Restricted Data / Formerly Restricted Data versus National Security Information**

Formerly Restricted Data is not declassified information. It is material removed from the RD category after DOE and DoD jointly determine that it primarily concerns the military utilization of atomic weapons and can be protected like other defense information.

National Security Information, by contrast, is classified under executive authority. Its permitted categories include military plans and weapons systems, intelligence activities and covert action, scientific or technological matters relating to national security, nuclear safeguards, system capabilities and vulnerabilities, and weapons of mass destruction. ([National Archives](https://www.archives.gov/about/laws/appendix/13526.html "Basic Laws and Authorities | National Archives"))

#### Interface composition

The screen becomes a split architecture:

```text
ATOMIC ENERGY ACT                 EXECUTIVE ORDER
STATUTORY CONTROL                 NATIONAL SECURITY CONTROL

RESTRICTED DATA                   NATIONAL SECURITY INFORMATION
FORMERLY RESTRICTED DATA          SCIENTIFIC / TECHNICAL
TFNI                              WEAPON SYSTEMS
                                  INTELLIGENCE METHODS
                                  COVERT ACTION
                                  SYSTEM CAPABILITIES
```

The user can move a hypothetical advanced propulsion program across the split.

As it crosses, its classification markings change based on the content being examined.

#### Core lesson

A single program may contain:

- nuclear-energy data;
- weapons-system information;
- foreign intelligence;
- materials science;
- propulsion engineering;
- operational concepts;
- contractor records.

It may therefore exist across more than one secrecy regime.

The visual metaphor should be **overlapping translucent compartments**, not filing cabinets.

#### Departure animation

The two channels overlap.

A new ring appears around both:

```text
SPECIAL ACCESS
```

---

### 6.10 Waypoint 06 — The Black Architecture

#### Historical anchor

**Special Access Programs and classified funding**

A Special Access Program is not a classification level. It is a program that imposes access and safeguarding requirements beyond those normally required for information at the same classification level. Executive Order 13526 permits SAPs when a threat or vulnerability is exceptional and ordinary access standards are insufficient, while requiring constrained membership, accounting, oversight, and annual review. ([National Archives](https://www.archives.gov/about/laws/appendix/13526.html "Basic Laws and Authorities | National Archives"))

Current DoD policy says SAP protections may be used for the department’s most sensitive classified information involving advanced systems, capabilities, technologies, and operations. It assigns oversight of DoD SAP science and technology to the Under Secretary of Defense for Research and Engineering. ([ESD](https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodd/520507p.PDF?ver=fw5iN8u0ltbxN6gZNM81Ew%3D%3D "DoDD 5205.07, Special Access Program Policy, September 12, 2024"))

#### Critical narrative rule

This proves that a lawful mechanism exists for deeply compartmented advanced technology.

It does **not** prove that any particular exotic propulsion system, recovered craft, antigravity platform, or nonhuman technology exists inside it.

The architecture is documented.

The alleged contents remain an evidence question.

#### What “black budget” should mean in the tour

“Black budget” is a colloquial description of classified appropriations and program details—not a legal classification category and not necessarily money outside congressional appropriation.

For fiscal year 2025, the publicly disclosed aggregate appropriations for the National Intelligence Program and Military Intelligence Program totaled $101.1 billion, while detailed classified program information remained undisclosed. ([Director of National Intelligence](https://www.dni.gov/index.php/who-we-are/organizations/ic-cio/ic-technical-specifications/us-agency-acronyms/192-dni/resources "Resources | Office of the Director of National Intelligence"))

DoD SAPs are subject to congressional reporting. Certain report details may be withheld from the full defense committees on national-security grounds, but the statute requires the withheld information and justification to be provided to the chair and ranking minority member of each relevant defense committee.

So the honest visualization is not:

```text
NO OVERSIGHT
```

It is:

```text
NARROWED OVERSIGHT
COMPARTMENTED OVERSIGHT
UNEQUAL INFORMATION ACCESS
LIMITED PUBLIC VISIBILITY
```

#### “Black ops” correction

A covert action is a distinct legal concept: an activity intended to influence political, economic, or military conditions abroad when the U.S. role is not intended to be publicly apparent or acknowledged. That is not the same thing as a classified research-and-development program.

The tour vocabulary should therefore distinguish:

```text
BLACK PROGRAM
Classified research, acquisition, technology, or capability

SPECIAL ACCESS PROGRAM
Additional access and protection controls

BLACK BUDGET
Classified program-level spending opacity

COVERT ACTION
Unacknowledged foreign influence activity

CLANDESTINE ACTIVITY
Secret method of execution

RESTRICTED DATA
Statutory nuclear-information category
```

Calling experimental propulsion research “black ops” muddies the exact architecture we are trying to expose.

#### Signature interaction — The Compartment Stack

The user sees a program represented as an object at the center.

Protection layers wrap around it:

```text
PROGRAM
  + CLASSIFICATION CATEGORY
  + CLASSIFICATION LEVEL
  + EXCEPTION CLASSIFICATION GUIDE
  + NEED TO KNOW
  + SAP COMPARTMENT
  + CONTRACTOR ACCESS
  + BUDGET LINE OPACITY
  + OPERATIONAL COMPARTMENT
```

Clicking a layer reveals:

- who may authorize it;
- who exercises oversight;
- what the layer protects;
- what the layer does not imply.

#### Departure animation

The compartment stack rotates ninety degrees.

It becomes the cross-section of an experimental vehicle.

The route splits into two propulsion pathways.

---

### 6.11 Waypoint 07 — The Propulsion Fork

#### Narrative purpose

This is where the tour carefully approaches “black physics” without pretending the term itself is an official category.

The question is:

> If the state developed—or encountered—a revolutionary propulsion principle, where could it legally and institutionally go?

#### Path A — Nuclear propulsion

Potentially relevant categories include:

- reactor design;
- special nuclear material;
- use of special nuclear material to produce energy;
- shielding;
- military utilization;
- delivery-system integration;
- operational vulnerabilities.

Some of this could fall within RD, some within FRD, some within NSI, and some within multiple commingled categories.

#### Path B — Non-nuclear advanced propulsion

A non-nuclear system would not become Restricted Data merely because it is revolutionary. It could be classified as NSI if it concerned a weapons system, intelligence capability, military operation, national-security technology, or sensitive system capability whose disclosure could cause identifiable national-security damage. SAP protections could then be added if ordinary controls were insufficient. ([National Archives](https://www.archives.gov/about/laws/appendix/13526.html "Basic Laws and Authorities | National Archives"))

#### Path C — Fundamental physics

Basic scientific research not clearly related to national security may not be classified under Executive Order 13526. Once the work becomes a government-controlled weapon, sensor, intelligence capability, or strategically applicable technology, the classification analysis changes. ([National Archives](https://www.archives.gov/about/laws/appendix/13526.html "Basic Laws and Authorities | National Archives"))

#### The central inference

The policy structure allows a revolutionary aerospace capability to be hidden through conventional legal mechanisms **without requiring a special “UFO classification.”**

But the existence of that policy structure is not evidence that such a capability was achieved.

That distinction should appear directly on screen:

```text
CAPABLE OF CONCEALING
≠
EVIDENCE OF EXISTENCE
```

#### Signature interaction — Jurisdiction Fork

The user chooses a hypothetical technical description:

```text
A compact fission propulsion reactor

A separable high-performance missile engine

A field-effect propulsion experiment

A foreign recovered aerospace platform

An unidentified material with unusual isotopic properties
```

The system does not pronounce an exact classification.

Instead, it shows the probable review path:

```text
SUBJECT MATTER REVIEW
        ↓
DOE / DOD / INTELLIGENCE EQUITY
        ↓
CLASSIFICATION AUTHORITY
        ↓
SECURITY CLASSIFICATION GUIDE
        ↓
ACCESS CONTROL DECISION
        ↓
PROGRAM / SAP / CONTRACT VEHICLE
```

That is both dramatically compelling and legally literate.

---

### 6.12 Waypoint 08 — Roswell: The Secrecy Machine Meets the Anomaly

The screen should not simply jump to a flying saucer.

The route should carry forward everything the user has learned:

- military compartmentalization;
- controlled disclosure;
- nuclear geography;
- statutory secrecy;
- executive classification;
- contractor and military structures;
- restricted access;
- alternative explanations;
- the limits of public records.

#### Transition choreography

1. The propulsion paths remain suspended on screen.
2. Neither resolves into a proven technology.
3. A date counter advances:

```text
1945
1946
1947
```

1. A newspaper wire begins typing.
2. The classification layers contract into the insignia of Roswell Army Air Field.
3. The first press statement appears.
4. It is immediately crossed by the second statement.
5. The next marker opens:

```text
ROSWELL
WHAT HAPPENS WHEN AN ANOMALOUS CLAIM ENTERS
A SYSTEM BUILT TO CONTROL REVOLUTIONARY KNOWLEDGE?
```

This makes Roswell narratively inevitable without presenting it as the predetermined answer.

---

### 6.13 Waypoint Motion System

Each waypoint has three motion states.

#### Arrival

The interface moves the user into a precise historical coordinate.

```yaml
arrival:
  camera:
    duration_ms: 900
    easing: power3.inOut
  marker:
    scale_from: 0.65
    opacity_from: 0
    duration_ms: 420
  title:
    mode: typewriter
    delay_ms: 300
  ambient:
    crossfade_ms: 800
```

#### Investigation

Movement slows. Evidence becomes tactile.

- documents slide from an archive stack;
- maps remain stable;
- provenance lines draw only on interaction;
- contested claims flicker slightly rather than glowing;
- primary sources receive visual mass;
- later interpretations sit on separate planes.

#### Departure

The answer to the waypoint’s question becomes the transition vector.

```yaml
departure:
  completion_lock_ms: 250
  current_marker:
    archive: true
    scale_to: 0.72
    opacity_to: 0.42
  route:
    draw_duration_ms: 850
    edge_style: institutional_inheritance
  next_marker:
    preload: true
    ghost_opacity: 0.18
    pulse_on_unlock: true
```

The user should see the next marker before activating it. That produces direction without destroying discovery.

---

### 6.14 Narrative Integrity Rules

Every consequential sentence in the tour should resolve to:

```text
narrative_sentence
  → claim_id
  → supporting_evidence_ids
  → source_type
  → source_date
  → confidence
  → counterclaim_ids
  → unresolved_status
```

#### Example

```yaml
claim:
  id: claim.manhattan.compartmentalization
  text: >-
    Manhattan Project personnel were generally restricted to information
    required for their assigned work.
  status: established
  confidence: high

  evidence:
    - nps.manhattan.secrecy
    - doe.manhattan.official-history

  limitations:
    - senior figures had broader visibility
    - compartmentalization was not perfectly secure

  narrative_uses:
    - ut.tour.nuclear-shadow.wp-01
    - ut.thread.classified-science
```

This allows the narrative to remain cohesive without hard-coding unsupported transitions into prose.

---

### 6.15 Completion Indicator

Every waypoint marker should have a four-segment ring:

```text
◔ CLAIM
◑ EVIDENCE
◕ CHALLENGE
● RESIDUE
```

The user does not need to open every archival object. They must encounter:

1. the core claim;
2. its strongest basis;
3. its strongest limitation;
4. the open question.

Once all four states are satisfied, the route to the next marker activates.

For reduced-motion users, the same progression becomes a clean state transition rather than an animated traversal.

---

### 6.16 Canonical Definition of Act I

> **The Architecture of Secrecy traces how the Manhattan Project transformed secrecy from a protective measure into a durable operating system for advanced science—and then asks exactly where nuclear, aerospace, intelligence, and hypothetical propulsion breakthroughs would fall inside that system.**

The most important intellectual line in the entire act is:

> **A system capable of concealing radical technology is not evidence that the alleged technology exists. It is evidence that absence from the public record cannot, by itself, settle the question.**

That is the precise epistemic territory Ultraterrestrial should own.

---

*Design Lab session 2026-07-19 · Nuclear Shadow Act I narrative appended same day. Temporary lab artifacts remain until explicit finalize or abort.*
