# Guided Tour Spec — "The Improbable Moon" (Hollow / Artificial Moon Hypothesis)

**Date:** 2026-07-08
**Status:** IMPLEMENTED 2026-07-08 — `IMPROBABLE_MOON_TOUR` live in `tour-definitions.ts` + registry; narratives below are the shipped text
**North star (project identity, 2026-07-08):** *"Ultraterrestrial is an integrated research narrative engine for anomalous knowledge."* The tour's Section 1 voice contract is that identity operationalized: rigor and reverence, ambiguity preserved, no collapse into gullibility or dismissal.
**Target file:** `apps/app/src/features/mindmap/tours/configs/tour-definitions.ts` (add `IMPROBABLE_MOON_TOUR` + registry entry)
**Source brief:** Instagram reel `DaTGPr-CSDh` (login-walled at fetch time — spec grounded directly in the primary literature the reel derives from; reconcile against transcript if provided)

---

## 1. Voice & Epistemic Stance (the "identity" contract)

This is the tour where the app's researcher identity is most at risk — hollow-moon content on social media is credulity-maximized. We do the opposite, in the Vallée/Pasulka register the platform is built on:

1. **Catalog anomalies honestly, then show the mainstream account next to them.** The Moon *did* reverberate for ~55 minutes when Apollo 12's ascent stage hit it — and modern seismology attributes that to bone-dry, fractured regolith with no water to damp the signal. Both sentences appear in the same waypoint. The anomaly survives or dies on its own strength.
2. **Tier the evidence.** Documented instrument data (Apollo Passive Seismic Experiment, GRAIL gravity maps) > peer-adjacent published hypothesis (Vasin & Shcherbakov in *Sputnik*) > testimony (Disclosure Project) > folklore (Proselenes). The tour walks *up* the strangeness ladder but labels each rung.
3. **End on falsifiability, not conviction.** The closer asks what Artemis-era data would actually settle — the same move the Zeta Reticuli tour makes with exoplanets.
4. **Never say "proves." Say "is consistent with," "remains unexplained," "was claimed."**

Tone reference: the existing tours' narrative voice — declarative, dated, named sources, ~60–90 words per waypoint.

## 2. The Arc (7 waypoints, strangeness ascending)

**Origin problem → older whispers → the hypothesis → the instrument record → the anomaly ledger → the witnesses → the modern test.**

| # | Waypoint | Table | DB anchor status (probed 2026-07-08) |
|---|----------|-------|--------------------------------------|
| 1 | The Moon That Shouldn't Be There | topics | ⚠️ resolves to "Moon Landing" topic (weak but works) |
| 2 | A Sky Without a Moon | topics | ⚠️ nearest hits are ancient-mythology topics |
| 3 | The Spaceship Moon Hypothesis (1970) | topics | ✅ "Extraterrestrial Bases on the Moon and Mars" (`rec_cobdesq5ojbselbdqr70`) |
| 4 | The Bell That Rang for an Hour (1969–70) | events | ✅ Apollo 11 / Apollo 14 events exist; no Apollo 12 record (gap) |
| 5 | The Anomaly Ledger | topics | ✅ "Moon Landing" (`rec_cobdet25ojbselbdqrv0`) |
| 6 | Testimony at the Edge of the Visible | testimonies | ✅ 3 far-side/moon testimonies FTS-resolve; Carol Rosin/von Braun docs in KB |
| 7 | Probe, Artifact, or Rock: The Modern Test | topics | ✅ "Von Neumann Probe" (`rec_cor05u8oepqha1jsmgo0`) — perfect closer |

## 3. Draft TourDefinition (ready to paste, pending approval)

```ts
export const IMPROBABLE_MOON_TOUR: TourDefinition = {
  id: 'improbable-moon',
  title: 'The Improbable Moon',
  description:
    'Walk the evidence ladder of the hollow and artificial Moon hypothesis — from the unsolved problem of lunar origin, through the Soviet "Spaceship Moon" paper and the Apollo seismic record, to what Artemis-era data could actually settle.',
  difficulty: 'expert',
  estimatedDuration: 55,
  tags: ['moon', 'hollow-moon', 'artificial-moon', 'apollo', 'vasin-shcherbakov', 'lunar-anomalies', 'seti'],
  waypoints: [
    {
      id: 'lunar-origin-problem',
      title: "The Moon That Shouldn't Be There",
      dbRef: {
        type: 'topics',
        id: 'lunar-origin',
        fallbackQuery: 'Moon landing lunar origin formation Apollo',
      },
      narrative: `NASA geochemist Robin Brett once remarked it "seems easier to explain the nonexistence of the Moon than its existence." Every formation theory — fission, capture, co-accretion, and today's giant-impact hypothesis — carries unresolved problems, most famously the near-identical oxygen isotope signatures of lunar and terrestrial rock. Before any exotic claim, the grounded starting point is this: the Moon's origin is a genuinely open scientific question.`,
      contextRules: {
        temporalWindow: {startYear: 1969, endYear: 2025},
        entityFilters: {types: ['topics', 'events', 'documents']},
        contentRules: [
          'Include Apollo program records and lunar sample analysis',
          'Show competing formation theories as documented science',
          'Frame the origin question as open, not answered',
        ],
      },
      visualSettings: {layoutPreference: 'radial', animationDuration: 1200},
    },
    {
      id: 'sky-without-a-moon',
      title: 'A Sky Without a Moon',
      dbRef: {
        type: 'topics',
        id: 'proselene-traditions',
        fallbackQuery: 'ancient mythology moon archaeology traditions gods sky',
      },
      narrative: `Greek writers preserved a strange claim: that the Arcadians were "Proselenes" — a people said to predate the Moon itself, a tradition noted by Aristotle and Plutarch. Similar "before the Moon" motifs appear in other cultures. As evidence these accounts are weak — folklore, not observation. As pattern, they belong in the file: the same method Vallée applied to fairy lore and Magonia applies to a sky remembered as different.`,
      contextRules: {
        temporalWindow: {startYear: -3000, endYear: 500},
        entityFilters: {types: ['topics', 'documents', 'artifacts']},
        contentRules: [
          'Include ancient-tradition and mythology records',
          'Label folklore explicitly as the lowest evidence tier',
          'Connect method to Vallée folklore analysis',
        ],
      },
      visualSettings: {layoutPreference: 'horizontal'},
    },
    {
      id: 'spaceship-moon-1970',
      title: 'The Spaceship Moon Hypothesis (1970)',
      dbRef: {
        type: 'topics',
        id: 'extraterrestrial-bases-moon',
        fallbackQuery: 'extraterrestrial bases moon artificial structures lunar',
      },
      narrative: `In July 1970, Soviet researchers Mikhail Vasin and Alexander Shcherbakov published "Is the Moon the Creation of Alien Intelligence?" in the state magazine Sputnik — proposing the Moon as a hollowed planetoid steered into Earth orbit by an unknown intelligence. It was a thought experiment, not a peer-reviewed finding, and its authors framed it that way. But it gave the anomaly ledger a unifying hypothesis, and every artificial-Moon argument since descends from it.`,
      contextRules: {
        temporalWindow: {startYear: 1965, endYear: 1980},
        entityFilters: {types: ['topics', 'documents', 'organizations']},
        contentRules: [
          'Include Cold War space-program context',
          'Present the paper as hypothesis, not finding',
          'Connect to later artificial-structure claims',
        ],
      },
      visualSettings: {layoutPreference: 'radial', dimOtherNodes: true},
    },
    {
      id: 'moon-rang-like-a-bell',
      title: 'The Bell That Rang for an Hour (1969–1970)',
      dbRef: {
        type: 'events',
        id: 'apollo-12-seismic',
        fallbackQuery: 'Apollo 12 Apollo 14 lunar module impact seismic experiment moon',
      },
      narrative: `On November 20, 1969, Apollo 12's crew deliberately crashed their ascent stage into the Moon. The seismometers they had left behind registered reverberations for nearly an hour — "the Moon rang like a bell," in the experimenters' own words. Apollo 13's spent booster stage later produced over three hours of ringing. The data is real and instrumental. So is the mainstream reading: a bone-dry, deeply fractured crust with no water to damp vibration rings regardless of what fills the interior. The anomaly is the starting gun, not the verdict.`,
      contextRules: {
        temporalWindow: {startYear: 1969, endYear: 1977},
        entityFilters: {types: ['events', 'personnel', 'organizations', 'documents']},
        contentRules: [
          'Include Apollo Passive Seismic Experiment records',
          'Present both the ringing data and the dry-regolith explanation',
          'Connect to NASA personnel and mission records',
        ],
      },
      visualSettings: {layoutPreference: 'horizontal', highlightNodes: []},
    },
    {
      id: 'anomaly-ledger',
      title: 'The Anomaly Ledger',
      dbRef: {
        type: 'topics',
        id: 'lunar-anomalies',
        fallbackQuery: 'moon landing lunar anomalies density orbit eclipse',
      },
      narrative: `The case is cumulative, so audit the ledger: mean density of 3.34 g/cm³ against Earth's 5.51 with a proportionally tiny core; mass concentrations that perturb every low lunar orbit; a diameter exactly ~1/400th of the Sun's at ~1/400th the distance, producing the only perfect eclipses in the known solar system; a tidally locked far side we never see. Each item has a conventional account. What the artificial-Moon hypothesis really argues is that the *stack* of coincidences demands explanation — a probabilistic claim, and it should be weighed as one.`,
      contextRules: {
        temporalWindow: {startYear: 1959, endYear: 2015},
        entityFilters: {types: ['topics', 'events', 'documents']},
        contentRules: [
          'Include GRAIL and lunar-orbiter mapping records where present',
          'Show each anomaly beside its conventional explanation',
          'Frame the hypothesis as probabilistic, not evidentiary',
        ],
      },
      visualSettings: {layoutPreference: 'grid'},
    },
    {
      id: 'witnesses-far-side',
      title: 'Testimony at the Edge of the Visible',
      dbRef: {
        type: 'testimonies',
        id: 'far-side-testimony',
        fallbackQuery: 'moon lunar structures far side base photographs testimony',
      },
      narrative: `The testimony tier: Disclosure Project witnesses claimed knowledge of structures in far-side imagery; remote viewer Ingo Swann described a monitored lunar presence in "Penetration"; archive technicians alleged airbrushed photographs. None of it is verifiable from where we sit, and this platform's method requires saying so plainly. What testimony contributes is not proof but a claims-map — names, dates, and specific allegations that new imagery can eventually check.`,
      contextRules: {
        temporalWindow: {startYear: 1994, endYear: 2010},
        entityFilters: {types: ['testimonies', 'personnel', 'organizations']},
        contentRules: [
          'Include Disclosure Project era testimony records',
          'Connect to NSA and NASA organization records',
          'Label the entire tier as unverifiable claims-mapping',
        ],
      },
      visualSettings: {layoutPreference: 'radial', dimOtherNodes: true},
    },
    {
      id: 'probe-artifact-or-rock',
      title: 'Probe, Artifact, or Rock: The Modern Test',
      dbRef: {
        type: 'topics',
        id: 'von-neumann-probe',
        fallbackQuery: 'Von Neumann probe self-replicating artifact SETI',
      },
      narrative: `Strip the mythology and the artificial-Moon idea becomes a question mainstream SETI now asks openly: could ancient artifacts — "lurkers," in the published literature — sit quietly in our own system? The Moon is the nearest place to look, and for the first time since 1972 we are actually going: Artemis, the Lunar Reconnaissance Orbiter's meter-scale imagery, Chang'e on the far side, commercial landers. The hypothesis finally faces the only judge that matters — new data. Define in advance what would count, and let the Moon answer.`,
      contextRules: {
        temporalWindow: {startYear: 2015, endYear: 2026},
        entityFilters: {types: ['topics', 'events', 'organizations']},
        contentRules: [
          'Include SETI artifact-search and Von Neumann probe records',
          'Show current lunar missions as the falsifiability path',
          'Close on method: pre-registered expectations, then data',
        ],
      },
      visualSettings: {layoutPreference: 'horizontal'},
    },
  ],
  metadata: {
    author: 'Ultraterrestrial Research Team',
    createdAt: '2026-07-08',
    version: '1.0',
  },
}
```

## 4. Database Coverage — probed 2026-07-08 (live FTS via `searchTable`)

**Resolves today:** `topics`: "Extraterrestrial Bases on the Moon and Mars", "Moon Landing", "Von Neumann Probe" · `events`: Apollo 11, Apollo 14 · `organizations`: NASA, NSA · `testimonies`: 3 far-side/moon rows · `documents`: 2× Carol Rosin / von Braun (bridges waypoint 6 to existing KB).

**Ingestion gaps (would upgrade the tour from good → great):**
1. Vasin & Shcherbakov, *Sputnik* July 1970 article → `documents` + a `topics` row for "Hollow Moon Hypothesis" (waypoint 3's true anchor)
2. Apollo 12 LM impact + Apollo 13 S-IVB impact as `events` (waypoint 4 currently resolves to Apollo 11/14)
3. Karl Wolfe + Ken Johnston `key_figures` + Disclosure Project testimony records (waypoint 6)
4. Ingo Swann "Penetration" (1998) → `documents`
5. GRAIL mission (2011–12) as `events` (waypoint 5)

Pipeline: `apps/disclosure-rag` ingestion or `packages/db/scripts/rebuild/ingest.py`; re-embed via `embed_entities.py`.

## 5. Implementation Checklist

- [ ] Approve/edit narratives above
- [ ] Add `IMPROBABLE_MOON_TOUR` to `tour-definitions.ts`, `ALL_TOURS`, `TOUR_REGISTRY`
- [ ] Verify each `fallbackQuery` resolves in-app at tour start (same FTS path as probe)
- [ ] Optional: ingest the 5 gap items, then tighten `fallbackQuery` strings to hit them
- [ ] Browser-verify: camera flight, dock lock-on per waypoint, chronological spine
- [ ] Reconcile against the Instagram reel transcript if provided (login-walled at spec time)
