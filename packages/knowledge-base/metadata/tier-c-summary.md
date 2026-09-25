# Tier C — legacy flat transcript resolution (T-061 Phase 0)

Companion to [`metadata/tier-c-proposals.jsonl`](packages/knowledge-base/metadata/tier-c-proposals.jsonl)
(156 lines, one per flat `.txt`). Read this first, then eyeball §5 and §6.

**Scope.** Flat `.txt` files sitting directly in `sources/transcripts/<YYYY-MM-DD>/`.
Files inside an 11-char videoId subdirectory (Tier A) are excluded. `*Summary.txt`
files are excluded from the count and recorded as `has_summary_sibling` on their parent.

**Nothing under `sources/` was moved, renamed, edited or deleted.** Only the two
files in `metadata/` were created.

---

## 1. The plan's Tier C premise is wrong — read this before anything else

[`docs/plans/2026-08-16-source-canonical-reorg.md`](docs/plans/2026-08-16-source-canonical-reorg.md)
§1 records legacy provenance as **"none — slug only"** and §3.3 sets Tier C
confidence to **"needs review"** on the strength of slug fingerprinting.

That is not what is in the files. **Every one of the 156 legacy files carries its
own provenance header:**

```
Astronaut Edgar Mitchell (ET Testimony)          <- line 1: original title
                                                 <- line 2: blank
https://www.youtube.com/watch?v=LOHv1twCOqQ&…    <- line 3: source URL
                                                 <- line 4: blank
and you what what type of experiences did they…  <- line 5+: transcript body
```

**Header shape was asserted, not assumed.** A naive "first URL in the file" parse
would silently pick up a link from the transcript body and resolve it to the wrong
channel at `high` confidence — the one failure mode that produces a confidently
wrong answer. So every row was checked against the header position directly:
**154 / 156** have the URL at exactly line 3; the remaining **2** carry one extra
blank line and have it at line 4
(`2024-09-17/aerospaceSSecretSearchForAntigravity.txt`,
`2024-11-15/unidentifiedAnomalousPhenomenaExposingTheTruth.txt`), both manually
confirmed. Only 4 of the 156 files contain more than one URL anywhere, and in every
one of the 156 the URL used for resolution is the file's own header.

| | count |
| --- | --- |
| Flat files total | 156 |
| Carrying a source URL | **156 / 156** |
| Carrying a parseable YouTube videoId | **151** |
| Carrying a non-YouTube article URL | **5** (see §6.1) |
| Carrying a playlist ID as well | 51 |

Tier C was never a fingerprinting problem. It is a Tier A problem that had not
been looked at. 154 of 156 are now resolved from authoritative endpoints, not
from slugs.

**Consequence for your Tier A pass:** the ID set grows from 197 to ~348. §3.4's
perishability warning now applies to these 151 too — two of them have *already*
gone private (§5). Fold them into the API batch now, not after this file is
approved.

## 2. Method

Per file: parse the URL from line 3, extract `v=<11 char id>`, then resolve the
channel through **two independent endpoints** and require them to agree.

1. `youtube.com/oembed?url=…` → `author_name`, `author_url` (handle), canonical title.
   No API key required. 142 / 144 unique IDs returned 200.
2. The watch page → `externalChannelId` (the `UC…` the registry keys on) and
   `ownerChannelName`.

Cross-check results: **0 owner-name mismatches across all 142**, no author mapping
to more than one `channel_id`, no `channel_id` shared by two authors. 43 distinct
channels, clean 1:1.

Confidence is assigned by evidence class, not by feel:

| confidence | meaning | count |
| --- | --- | --- |
| `high` | resolved from the file's own URL via YouTube (or a non-YouTube registrable domain). Not inference. | 154 |
| `medium` | video is gone; assignment rests on a naming-convention cluster. Needs your eye. | 1 |
| `unresolved` | no evidence of any kind. | 1 |

> **Caveat on `channel_id`.** An earlier pass derived channel IDs by scraping
> `/@handle` pages and produced **wrong, cross-contaminated IDs** (the first `UC…`
> on a channel page is often a *recommended* channel). Those were discarded. Every
> `channel_id` in the JSONL comes from the watch page's `externalChannelId`, which
> round-trips correctly. If you re-derive IDs yourself, do not scrape handle pages.

## 3. Counts per proposed source

**YouTube channels** (`source_kind: youtube_channel`, `channel_id` on every row):

| count | proposed_source | channel_id |
| ---: | --- | --- |
| 49 | `dr-steven-greer` | `UCC6B4Y0oFACv9QBlf0ebBcg` |
| 36 | `jesse-michels` | `UCuG2KzrIMe3qoNcuDVpwnXw` |
| 16 | `newsnation` | `UCCjG8NtOig0USdrT5D1FpxQ` |
| 4 | `joe-rogan-experience` | `UCzQUP1qoWDoEbmsQxvdjxgQ` |
| 3 | `cbs-news` | `UC8p1vwvWtl6T73JiExfWs1g` |
| 2 | `julian-dorey` | `UC0A-v_DL-h76F75xik8h03Q` |
| 2 | `shawn-ryan-show` | `UCkoujZQZatbqy4KGcgjpVxQ` |
| 2 | `podcast-ufo-live-shows` | `UCSTVGU0oHJp-gvlYPfWUvWQ` |
| 2 | `8-news-now-las-vegas` | `UCFuzExfO2fUVmNK5_COvsNg` |

Singletons (1 file each): `abc7`, `abc-7-chicago`, `ap-archive`, `cnn-news18`,
`danny-jones`, `denver7`, `disclosure-team`, `dr-brian-keating`, `face-the-nation`,
`gop-oversight`, `jre-clips`, `julian-dorey-daily`, `kinocheck`, `lex-fridman`,
`livenow-from-fox`, `motion`, `nbc-news`, `psicoactivo-podcast`, `red-panda-koala`,
`salt`, `searchlightpictures`, `startalk`, `stelios-kyre`, `the-hannibal-tv`,
`the-press-democrat`, `third-eye-drops`, `tool-use-podcast`, `ufo-archives`,
`ufo-hub`, `usman-abdur-rehman`, `vetted`, `wfmy-news-2`, `wfxr-news`,
`world-president-goes-viral`.

**Web domains** (misfiled into the transcript tree — see §6.1):
`disclosurediaries-com` ×2, `sundayworld-com` ×1, `howandwhys-com` ×1, `twz-com` ×1.

**Unresolved:** 1. **Total distinct sources:** 47.

### The 49-file Greer cluster

All 49 share playlist `PLy69_Zq2Cz86cFSpQAiLbaE02-xxLEFX5` **and** resolve to the
same channel — "Dr. Steven Greer" (`@DrStevenGreer55`). This is the Disclosure
Project witness-testimony archive (Wolfe, Salas, Stone, Hare, McDow, Lovekin,
Bethune, Callahan, Corso, Mitchell …). Canonical titles carry the
`… l Disclosure Project` suffix.

Naming judgment for you: the **channel** is `dr-steven-greer`; "Disclosure Project"
is a *program/playlist within it*, not a separate channel. I keyed on the channel,
per §3.1's "key on `channel_id`, never `channelTitle`". If you would rather the
directory read `disclosure-project`, that is a display-name choice over the same
`channel_id` — the playlist ID is on every row so the grouping survives either way.

## 4. Your six fingerprints, checked against ground truth

This is the part worth your attention: I could verify the plan's fingerprints
rather than trust them.

| Pattern | Files | Predicted | Actual | Verdict |
| --- | ---: | --- | --- | --- |
| `*RealityCheck` | 12 | Reality Check / NewsNation | NewsNation ×12 | ✅ correct |
| `joeRoganExperience####` | 4 | JRE | PowerfulJRE ×4 | ✅ correct |
| `*Srs###` | 1 | Shawn Ryan Show | Shawn Ryan Show | ✅ correct |
| `*WeaponizedEpisode##` | **0** | Weaponized | — | ⚠️ matches nothing in Tier C |
| `*DebriefedEp##` | **0** | Debriefed | — | ⚠️ matches nothing in Tier C |
| `*JesseMichels###` | 1 | American Alchemy | **Julian Dorey** | ❌ **would have misfiled** |

**The `*JesseMichels###` fingerprint is a trap.**
`ufoPhysicalEvidenceAliensTheVaticanNaziSecretExperimentsJesseMichels240` is
Julian Dorey episode **240** with Jesse Michels as the *guest* — canonical title
`… | Jesse Michels • 240`. The trailing number is the host's episode number, so
the fingerprint reads the guest as the publisher. Applied blind it would have
filed a Julian Dorey episode under American Alchemy. Exactly the "wrong canonical
source is worse than unfiled" failure the plan warns about.

By contrast `davidGruschOnJesseMichels` **is** genuinely Jesse Michels' channel —
the `On<Name>` form means the opposite of the `<Name>###` form. Two similar-looking
slugs, opposite semantics.

`*WeaponizedEpisode##` / `*DebriefedEp##` match zero flat files. If those shows are
in the corpus they are in the Tier A videoId dirs, not here.

## 5. Needs a human — the full unresolved / low-confidence list

Only two files. Both are videos that have since been made private or deleted
(oembed 403), which is §3.4's perishability arriving early.

**`unresolved` (1)**

- `sources/transcripts/2024-12-26/newJerseySkyWatch12262024DaytimeGeminidsAndOthers.txt`
  — videoId `RgxkHRJje74`, 403. **The file is also empty**: 108 bytes, title + URL
  and no transcript text at all. Slug matches no fingerprint. There is no evidence
  here of any kind. Recommend `unresolved/`, and consider deleting it — it carries
  zero content.

**`medium` (1)**

- `sources/transcripts/2024-12-26/thePurchaseOfAmericaFtMichaelPillsburyJoshRogin.txt`
  — videoId `ePdH01pphbk`, 403. Proposed `jesse-michels`, **inference only**:
  it shares the `*Ft<Guest>` convention with 13 files in the same 2024-12-26 ingest
  batch that resolve authoritatively to Jesse Michels, and no other channel in this
  corpus uses that convention except one Tool Use outlier.
  **Counter-evidence, recorded honestly:** its intro line *"most of the videos I make
  are about the nature of reality"* appears in **0 of 35** confirmed Jesse Michels
  transcripts, so it did not corroborate. Topic is also off-pattern (US–China
  influence, not UAP). Confirm or send to `unresolved/`.

## 6. New patterns and defects found

### 6.1 Five web articles are misfiled in the transcripts tree

Not YouTube at all — plain article URLs. They are transcript-tree files that belong
to Tier B, and moving the transcript tree without catching them files web articles
as transcripts. All flagged `misfiled_tree: "web"` in the JSONL.

| file (all under `sources/transcripts/…`) | URL |
| --- | --- |
| `2025-01-14/disclosureDiaries.txt` | `disclosurediaries.com/` |
| `2025-01-14/disclosureTimeline.txt` | `disclosurediaries.com/timeline` |
| `2025-01-14/nasaUfoHearing…SundayworldCom.txt` | `sundayworld.com/…` |
| `2025-01-14/exUsArmyClaimedOver100ETCivilizations….txt` | `howandwhys.com/…` |
| `2025-01-26/recentlyRetiredUsafGeneral….txt` | `twz.com/31445/…` |

`2025-01-14/` also holds a stray `disclosureTimeline.md`, and `2025-04-19/` holds a
`vector_store_query_fixed.py` — source code inside the corpus tree.

### 6.2 New fingerprint patterns beyond your six

- **`*Ft<Guest>`** — 15 files, the largest undocumented pattern. 14 Jesse Michels,
  1 Tool Use outlier. Note it is a *host's* convention, so it is a channel signal,
  unlike `*JesseMichels###`.
- **`*<PublisherTail>`** — publisher baked into the slug tail: `…LivenowFromFox`,
  `…SundayworldCom`, `…News18N18g`, `…Newsnation`. 5 files. Distinct class from
  show-name-prefix, and the only one that also covers **web** publishers.
- **`*On<Name>`** — `davidGruschOnJesseMichels`. Means guest-appears-on-channel,
  i.e. `<Name>` is the publisher. Inverse of `<Name>###`. Both forms present in
  this corpus; do not collapse them.

### 6.3 `Reality Check` is a program, not a channel

All 12 `*RealityCheck` files resolve to the **NewsNation** channel
(`UCCjG8NtOig0USdrT5D1FpxQ`), as do 4 more NewsNation files that are *not* Reality
Check (`weAreNotAloneLiveRoundtable…`, `droneMysteryIsWorldwide…RossCoulthart`,
`whistleblowerRevealsUapRetrievalProgram…` ×2).

§3.1's registry example defines `reality-check-ross-coulthart` keyed on a
`channel_id`. **Reality Check has no channel_id of its own** — it is a program on
the NewsNation channel. It cannot be both keyed on `channel_id` and separated from
NewsNation. Pick one:

- **(a)** `newsnation` as the source, `Reality Check` as a program attribute — what
  the JSONL does (`program: "Reality Check"` on the 12 rows), and what is consistent
  with "key on `channel_id`"; or
- **(b)** `reality-check-ross-coulthart` as a *program-level* source keyed on
  `channel_id + title match`, accepting that the registry now has two key kinds.

Same question will recur for any channel with multiple shows. Worth settling in
Phase 1 rather than at move time.

### 6.4 Duplicates — 7 videos ingested twice (14 of the 156 files)

Plan §6.2 expects collisions on move. These are the Tier C ones, already identified
by videoId. Three are same-slug-different-date; four are the **same video under two
different slugs**, which a slug-based dedupe would never have caught:

| videoId | copies | note |
| --- | --- | --- |
| `dfPfPB601hw` | `2024-09-27/grahamHancockAliensAtlantisTheApocalypse` + `2024-12-26/` same slug | same slug |
| `3yrKVu35uSE` | `2024-12-26/joeRoganExperience2246JamesFox` + `2025-01-13/` same slug | same slug, sizes differ (171709 / 173104) |
| `3dtA9w5ldHw` | `2025-01-20/whistleblowerRevealsUapRetrievalProgram…` + `2025-01-21/` same slug | same slug |
| `G7Ns4Aq1tVc` | `aerospaceSSecretSearchForAntigravity` + `isAntigravityBeingHiddenFromUsFtNickCook` | **different slugs** |
| `kRO5jOa06Qw` | `davidGruschOnJesseMichels` + `ufoWhistleblowerDavidGruschTellsMeEverything` | **different slugs** |
| `LpLFWdsIU7M` | `ufoPhysicsDisclosureUnderTrumpFtMatthewPines` + `howUfosWorkTrumpSDisclosurePlanFtMatthewPines` | **different slugs**, byte-identical |
| `fzvwBBSmWYA` | `breakingUfosAreMonitoringNuclearWeaponsGlobally` + `ufosNukesTheBizarreTruthBehindJerseyDrones` | **different slugs** |

Sizes differ slightly within most pairs — re-transcriptions, not file copies.
Deduping on videoId, not slug, is the only thing that catches the bottom four.

### 6.4b Tier A ∩ Tier C — 38 videos exist in *both* eras

This is the blind spot between us: you own Tier A, I own Tier C, and neither pass
alone can see the overlap. Intersecting my 144 Tier C video IDs against the videoId
directory names in the transcript tree:

- **Tier A videoId dirs: 197 total, but only 140 unique video IDs** — 57 of the 197
  dirs are the *same video re-ingested under a different date*. The plan counts 197
  as if they were 197 distinct videos; they are not.
- **38 of my Tier C video IDs also exist as a Tier A videoId directory.** These are
  the same video held twice, once in each era's layout.

Breakdown of the 38: **36 are Dr. Steven Greer** (the entire `2024-08-05/` batch,
re-ingested later in modern form), plus `LGQkkHuwm6w`
(`2024-10-08/johnLear1987.txt`, `8-news-now-las-vegas`) and `hXYdkcv5TtY`
(`2024-12-26/ufosSynchronicitiesPropheticDreams.txt`, `jesse-michels`).

**Why this matters at move time.** Both eras target the same destination —
`transcripts/<source-slug>/<videoId>/`. The Tier A copy already *is* a `<videoId>/`
dir; the Tier C copy is a flat `<slug>.txt` with no dir of its own. Land them
naively and the flat file either collides with, or gets orphaned beside, the richer
Tier A directory for the identical video. Decide the precedence rule before Phase 3:
the Tier A copy is the better artifact (it has a metadata sidecar in some cases),
so the flat legacy `.txt` is probably the one to retire or fold in as an alternate
transcript.

Full list of the 38 IDs is derivable from the JSONL — filter rows whose `video_id`
matches a videoId directory name.

### 6.5 Non-corpus contamination

Resolution is authoritative, but **19 of the 156 files are not UAP research material**
(counted, not estimated). Filing them correctly still files junk.

**Not UFO-adjacent in any sense (5)**

| slug | resolves to | what it is |
| --- | --- | --- |
| `reactFlowTutorial` | `usman-abdur-rehman` | a React Flow coding tutorial |
| `modernizeYourBusinessWithLlmsFtFranciscoInghamEp19` | `tool-use-podcast` | an LLM business podcast |
| `2B2c22Veed` | `motion` | unidentifiable; slug is an artifact |
| `theGorgeTrailer2025AppleTv` | `kinocheck` | movie trailer |
| `aCompleteUnknownNowPlayingEverywhereSearchlightPictures` | `searchlightpictures` | movie trailer |

**General news clips with no UAP content (12)** — tsunami survivors (`nbc-news`),
NY taxi crash (`livenow-from-fox`), Panama Canal (`face-the-nation`), Santa Cruz
wharf (`abc-7-chicago`), bald-eagle bill (`denver7`), foreign students (`ap-archive`),
Phoenix airport shooting (`the-press-democrat`), kidney transplant (`wfmy-news-2`),
Syria/Assad and atmospheric river (`cbs-news` ×2), Biden/Trump Christmas messages
(`wfxr-news`), Ukraine power grid (`abc7`).

**Off-topic but legitimately on a corpus channel (2)** — `whyJonahHillMadeA
DocumentaryAboutMyFamily` and `thePurchaseOfAmericaFtMichaelPillsburyJoshRogin`,
both Jesse Michels. These are real channel content, just not UAP.

**Borderline, recommend keeping** — the NJ drone-flap clips
(`donaldTrumpHostsSurpriseNewsConference…DroneSighting`,
`joeAsksExNavyPilotAboutMysteriousDroneSightings`) are genuinely on-topic, and three
Jesse Michels episodes (`yourBrainIsAQuantumTimeMachine`, `mkUltraTheCiaSMindControl
Program`, `didOppenheimerWorkOnUfos`) are adjacent enough to keep.

Flagged, not acted on. Deciding what leaves the corpus is your call.

## 7. Field reference for the JSONL

Superset of the requested schema; the requested keys are unchanged and every row
still carries `tier: "C"`.

| field | notes |
| --- | --- |
| `path` `slug` `tier` `pattern` `proposed_source` `confidence` `evidence` `has_summary_sibling` | as requested |
| `source_kind` | `youtube_channel` \| `web_domain` |
| `channel_id` | `UC…` from watch-page `externalChannelId`. **Registry key.** 149 rows |
| `channel_title` `channel_handle` | display name + `@handle` |
| `video_id` | 151 rows — **feed these into the Tier A API batch** |
| `playlist_id` | 51 rows |
| `program` | `"Reality Check"` on 12 NewsNation rows (§6.3) |
| `canonical_title` | real YouTube title, often differs from the slug |
| `domain` `source_url` `misfiled_tree` | the 5 web articles (§6.1) |
| `oembed_status` `empty_transcript` | the 2 dead videos (§5) |

Three consumer notes:

- **`pattern` is diagnostic only.** It exists to grade the plan's six fingerprints
  in §4. No `high`-confidence row rests on it — every one of those is resolved from
  the file's own URL. Do not treat `pattern` as the basis of any resolution.
- **`proposed_source` is `null` on exactly one row** (the unresolved file, §5).
  That is the honest representation — there is no source to name — but a consumer
  expecting a string will crash on it. The lead's example schema shows a string.
- **`has_summary_sibling` is true for exactly 11 of 156.** Summary siblings are the
  rare case, not the norm.

`published_at` is **not** populated: the field is emitted only where found and the
watch-page scrape returned it for zero videos, so no row carries it. Get real
publication dates from the YouTube Data API's `snippet.publishedAt` in the Tier A
pass, as §3.4 already recommends.
