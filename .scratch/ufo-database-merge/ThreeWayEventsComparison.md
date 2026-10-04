# Three-Way Events Comparison

**Compared:** 2026-08-09T10:22:08

## Verdict

Xata CSV and Neon events are the same spine (141 shared IDs). The CSV is an exact 2× export duplicate plus a header-echo row. Neon adds one MJ-12 briefing record not in the CSV. The UFO DB catalog is a different product: only ~31 famous-case overlaps; 69 rows (esp. institutional/modern disclosure) are absent from both databases.

## Counts at a glance

| Dataset | Rows | Notes |
|---|---:|---|
| Xata `events.csv` | 283 raw → **141 clean** | 141 exact ID-dup extras + 1 header-echo junk row |
| Neon `events` | **142** | Live DB |
| UFO DB merged catalog | **100** | Timeline + incidents listing |

## Gaps

### 1. Xata CSV ↔ Neon (identity)

- Shared IDs: **141** (content-identical spine)
- Real Xata-only IDs: **0**
- Neon-only IDs: **1** — MJ-12 Eisenhower briefing (`rec_ct37o77rkv8v7ahcv2gg`)

**Conclusion:** Neon is not a half-migration. After cleaning the CSV, Neon ⊇ Xata export, plus one extra record.

### 2. UFO DB catalog ↔ Neon/Xata

- Matched to Neon (fuzzy name/date): **31 / 100** (31%)
- Catalog-only: **69**
  - Institutional / modern disclosure spine: **27**
  - Cases / other not in DB: **42**

These catalog-only rows are the real coverage gap — AATIP, ODNI assessments, NASA UAP study, NDAA/AARO, hearings, Project Blue Book establishment, Majestic 12 *as timeline claim*, Sputnik, Area 51 initiation, etc.

### 3. Suspicious auto-match (review, not trust)

- Catalog **Trinity: The First Atomic Test** ↔ Neon **Trinity UFO
Case** — atomic test vs Trinity UFO crash case

## Redundancies

### A. Export redundancy (Xata CSV)

- **Exact duplicates:** almost every real event appears **twice** (141 extra rows). Field-for-field identical within each ID pair — pure export duplication, not alternate versions.
- **Header echo:** 1 junk row where column names were written as a data row (`id='id'`).

### B. Semantic duplicates inside Neon/Xata (distinct IDs, same real-world event)

5 clusters · 12 IDs involved · Neon effective unique if collapsed: **~135**

**Chicago O'Hare 2006** (3 IDs) — Three distinct Xata/Neon IDs for one airport event
- `rec_cobdg3tbjt595h6375ng` · 2006-11-07 · O'Hare Airport UFO Sighting
- `rec_cobdg3tbjt595h6375o0` · 2006-11-01 · 2006 O'Hare International Airport UFO sighting
- `rec_cp1vddb4f9p514bqa5h0` · 2006-11-01 · Chicago O’Hare International Airport, Illinois, November, 2006

**Washington D.C. July 1952** (3 IDs) — Three IDs for the Merry-Go-Round / DC flap
- `rec_cobdg3tbjt595h6376pg` · 1952-07-19 · Washington, D.C. UFO Incident
- `rec_cobdg3tbjt595h6376qg` · 1952-07-12 · 1952 Washington, D.C. UFO incident
- `rec_cp1vddb4f9p514bqa5kg` · 1952-07-01 · Washington, D.C., July, 1952

**Belgian UFO Wave 1989–91** (2 IDs) — Two IDs, overlapping date windows
- `rec_cobdg3tbjt595h6375ug` · 1989-11-01 · Belgian UFO Wave
- `rec_cp1vddf6gfslia6urd00` · 1989-01-01 · The Belgian UAP Wave, 1989-1991

**Trans-en-Provence 1981** (2 IDs) — Case page vs place/date naming
- `rec_cobdg3tbjt595h637610` · 1981-01-08 · Trans-en- Provence case
- `rec_cp1vddf6gfslia6urd30` · 1981-01-01 · Trans-en-Provence, France, January 8, 1981

**Tehran 1976** (2 IDs) — Incident title vs city/date title
- `rec_cobdg3tbjt595h63766g` · 1976-09-17 · 1976 Tehran UFO incident
- `rec_cp1vddb4f9p514bqa5g0` · 1976-09-01 · Tehran, Iran, September, 1976

### C. Related-but-not-duplicate (do not collapse)

- Disclosure Press Conference **2001** vs Disclosure Project Witness Panel **2021** — same program lineage, different events
- Apollo 11 vs Apollo 14 — fuzzy false positive

## What each dataset is good for

| | Strength | Weakness |
|---|---|---|
| **Xata CSV** | Full classic-case dump with lat/lon on ~73% | 2× duplicated; almost no photos/embeddings/title/summary populated |
| **Neon events** | Same spine + 1 MJ-12 briefing; live queryable; embeddings column exists in schema | Same semantic dup clusters; thin on modern disclosure chronology; photos nearly empty |
| **UFO DB catalog** | Claims, dual URLs (timeline+incident), photos, modern institutional nodes | Truncated blurbs; no lat/lon; not a DB; title collisions with Neon cases need join keys |

## Recommended actions

1. **Ignore raw CSV row count (283)** — always ID-dedupe and drop the header-echo row before analytics.
2. **Collapse semantic clusters in Neon** (O'Hare×3, DC×3, Belgian×2, Trans-en-Provence×2, Tehran×2) into canonical events + aliases.
3. **Do not re-ingest Xata into Neon expecting new cases** — you will only reintroduce exact dups.
4. **Ingest catalog-only institutional/modern rows** as a new category (e.g. `disclosure-timeline`), joining the 31 overlaps by alias rather than inserting duplicates.
5. **Backfill photos/URLs** from catalog onto matched Neon rows (31 joins already scored).

## Catalog-only institutional gaps

- October 30, 1938 — **War of the Worlds Broadcast Stokes Panic** [timeline]
- August 6, 1945 — **First Atomic Bombs Dropped on Japan** [timeline]
- July 1947 — **Did Truman Establish Majestic 12?** [timeline]
- July 26, 1947 — **The National Security Act is Adopted** [timeline]
- February-December, 1949 — **Project Grudge Expanded Upon Project Sign** [timeline]
- 1950 — **The Flying Saucers are Real Book Released** [timeline]
- March 1952 — **Project Blue Book Established** [timeline]
- January 20, 1953 — **Dwight Eisenhower Sworn In As 34th President** [timeline]
- January 1953 — **Robertson Panel Commences** [timeline]
- 1955 — **Area 51 Begins Use** [timeline]
- October 4, 1957 — **Sputnik 1 Launched** [timeline]
- November 12, 1959 — **Avro Canada VZ-9 Avrocar** [timeline]
- 1966-1968 — **Condon Committee** [timeline]
- 1966 — **Congressional Hearings on UFOs** [timeline]
- July 20, 1969 — **The First Moon Landing** [timeline]
- May 31, 1969 — **The Mutual UFO Network (MUFON) Founded** [timeline]
- November 27, 1978 — **United Nation UFO Panel** [timeline]
- 2005 — **Aaron Rodgers UFO Sighting** [incident]
- 2007 — **AATIP Established in Secret** [timeline]
- December 16, 2017 — **Pentagon Videos Released** [timeline]
- June 25, 2021 — **Unclassified Preliminary Assessment of UAP** [timeline]
- December 17, 2022 — **2023 US Defense Budget UAP Provisions** [timeline]
- May 17, 2022 — **First Modern Congressional UFO Hearings** [timeline]
- October 24, 2022 — **NASA Announced UAP Study** [timeline]
- November 2022 — **Sky Canada UAP Study** [timeline]
- May 31, 2023 — **NASA Public Meeting on Unidentified Anomalous Phenomena** [timeline]
- January 19, 2023 — **Proposal for UN UFO Office** [timeline]

## Catalog-only other gaps (sample)

- September 1865 — **James Lumley Cadotte Pass UFO** [incident]
- Summer 1943 — **First Rocket Reaches Space** [timeline]
- August 5, 1945 — **Alleged UFO Crash 20 Days Later** [timeline]
- 1948 — **US Air Force Tasked to Investigate Objects** [timeline]
- August 29, 1949 — **Nuclear Testing Starts in Russia** [timeline]
- May 1952 — **Barra da Tijuca Photos** [incident]
- August 1952 — **Haneda Air Base UFO Incident** [incident]
- September 1952 — **NATO Exercise Mainbrace UFO Sightings** [timeline+incident]
- July 1952 — **Newhouse UFO Tremonton Utah** [incident]
- December 1953 — **1953 Lockheed Sightings** [incident]
- May 1964 — **Kubrick and Clarke Sighting** [incident]
- June 1966 — **Oldfield Film** [incident]
- October 1967 — **1967 Devon UFO Sighting** [incident]
- November 1973 — **1973 Coast Guard UFO** [incident]
- September 19, 1974 — **Ronald Reagan UFO Sighting** [timeline+incident]
- February 1975 — **Kofu UFO Incident** [incident]
- June 1978 — **French Government UFO Studies** [timeline]
- 1987 — **Ronald Reagan Delivers Speech to UN** [timeline]
- September 1991 — **STS-48 UFO with "Abrupt Turn"** [incident]
- January 1996 — **Brazil UFO Crash** [timeline]
- June 1996 — **White Sands, NM UFO Crash** [incident]
- August 1997 — **1997 Mexico City UFO Video** [incident]
- June, 25, 1997 — **Roswell Case Officially Closed** [timeline]
- 2003 — **Urzi UFO Videos** [incident]
- 2004 — **USS Ronald Reagan UFO Sighting** [incident]
- 2007-2009 — **Kumburgaz, Turkey UFO Sightings** [incident]
- November 2014 — **Chilean Navy UFO Video** [incident]
- April 2016 — **2016 Mosul Orb** [incident]
- October 19, 2017 — **Is Oumuamua an Extraterrestrial Object?** [timeline+incident]
- March 2018 — **Aegean Sea UFO** [incident]
- July 2019 — **USS Kidd 2019 Drone Incident** [incident]
- July 2019 — **USS Omaha Navy Video** [incident]
- 2021 — **Camila Cabello UFO Video** [incident]
- November 23, 2021 — **US DoD Formed New UAP Group** [timeline]
- October 2021 — **USS Kearsarge Sighting** [incident]
- April 2021 — **USS Russell UAP Video** [incident]
- October 2022 — **Pacific Ocean UFO Sightings** [timeline+incident]
- January 12, 2023 — **2022 Annual Report on UAP** [timeline]
- February 2023 — **2023 Chinese Spy Balloon** [incident]
- April 2023 — **Las Vegas UFO** [incident]
- … +2 more (see `three-way-catalog-only.tsv`)
