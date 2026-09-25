/**
 * Drop-to-Canvas (T-060) — development fixtures.
 *
 * Agent A owns `POST /api/processing/drop` and is building it in parallel
 * (contract §7). These fixtures let the canvas half be built AND visually
 * audited against every response shape in contract §4 before that route
 * exists — including the two shapes that are hard to provoke on demand even
 * once it does (`matches: []`, and a `vision-caption` image).
 *
 * Activation is dev-only and explicit: append `?ut_drop_fixture=<scenario>`
 * to the canvas URL. In a production build `resolveDropFixture` always
 * returns null, so this cannot mask a real route failure for a user.
 */
import {
  type DropErrorCode,
  type DropResponse,
  inferDropKind,
} from './drop-contract'

export const DROP_FIXTURE_PARAM = 'ut_drop_fixture'

export type DropFixtureScenario =
  | 'success'
  | 'empty'
  | 'vision-caption'
  | 'extract-failed'
  | 'search-failed'
  | 'slow'

const FIXTURE_SCENARIOS: DropFixtureScenario[] = [
  'success',
  'empty',
  'vision-caption',
  'extract-failed',
  'search-failed',
  'slow',
]

export type DropFixtureOutcome =
  | {kind: 'response'; delayMs: number; response: DropResponse}
  | {kind: 'error'; delayMs: number; code: DropErrorCode; error: string}

/** Reads the scenario off the URL. Dev builds only. */
export function resolveDropFixture(): DropFixtureScenario | null {
  if (process.env.NODE_ENV === 'production') return null
  if (typeof window === 'undefined') return null
  const raw = new URLSearchParams(window.location.search).get(DROP_FIXTURE_PARAM)
  if (!raw) return null
  return FIXTURE_SCENARIOS.includes(raw as DropFixtureScenario)
    ? (raw as DropFixtureScenario)
    : null
}

/**
 * Titles and snippets below are shaped like real corpus rows (documents,
 * sightings, people, document_chunks — the tables contract §4 names) so the
 * layout is exercised with realistic string lengths rather than lorem.
 * `score` values are plausible RRF magnitudes: small, clustered, and NOT
 * spread across 0-1 like a similarity would be — which is exactly why they
 * must never be rendered as a percentage.
 */
const SUCCESS_MATCHES: DropResponse['matches'] = [
  {
    table: 'documents',
    id: 'doc_9f2a41',
    title: 'Project BLUE BOOK — Special Report No. 14 (1955)',
    snippet:
      'Statistical analysis of 3,201 sightings; 21.5 percent remained unidentified after evaluation by the Battelle Memorial Institute panel.',
    score: 0.03278,
    url: '/documents/doc_9f2a41',
  },
  {
    table: 'document_chunks',
    id: 'chunk_551c07',
    title: 'Condon Committee Final Report — Section III',
    snippet:
      'The witness described a metallic disc holding station above the perimeter fence for approximately four minutes before departing at high angular velocity.',
    score: 0.03145,
    url: '/documents/doc_4410ab',
  },
  {
    table: 'sightings',
    id: 'sight_7730de',
    title: 'Malmstrom AFB — Echo Flight shutdown (1967-03-16)',
    snippet:
      'Ten Minuteman I missiles transitioned to No-Go within seconds of one another while security reported a luminous object above the launch control facility.',
    score: 0.02981,
    url: null,
  },
  {
    table: 'people',
    id: 'person_2c88f1',
    title: 'Robert Salas',
    snippet:
      'Former USAF missile launch officer; has stated on the record that he was on duty during the Echo Flight incident.',
    score: 0.02740,
    url: '/people/person_2c88f1',
  },
  {
    table: 'organizations',
    id: 'org_61ba90',
    title: 'Battelle Memorial Institute',
    snippet:
      'Contracted to perform the statistical evaluation underlying Special Report No. 14.',
    score: 0.02611,
    url: null,
  },
  {
    table: 'events',
    id: 'event_33ff02',
    title: 'Washington D.C. radar-visual contacts (1952-07)',
    snippet:
      'Successive weekends of radar returns over restricted airspace, corroborated by airline and ground observers.',
    score: 0.02455,
    url: null,
  },
  {
    table: 'testimonies',
    id: 'testimony_a41d7c',
    title: 'Testimony of a former launch control officer',
    snippet:
      'Account given under oath describing the sequence of alarms and the subsequent instruction not to discuss the event.',
    score: 0.02310,
    url: null,
  },
]

function baseResponse(file: File, overrides: Partial<DropResponse>): DropResponse {
  const kind = inferDropKind(file.type, file.name)
  return {
    artifact: {
      id: `drop_fixture_${Math.random().toString(36).slice(2, 10)}`,
      filename: file.name,
      mime: file.type || 'application/octet-stream',
      bytes: file.size,
      kind,
      blobUrl: null,
      derivedVia: kind === 'image' ? 'vision-caption' : kind === 'pdf' ? 'pdf-parse' : 'utf8',
      extractedChars: 6120,
      excerpt:
        'Memorandum for the record. The undersigned reviewed the attached photographic material and the associated radar plot. Two of the four frames show an object with no visible means of propulsion; the remaining frames are inconclusive owing to emulsion damage. Recommend the file be retained pending further analysis.',
      ...overrides.artifact,
    },
    matches: overrides.matches ?? SUCCESS_MATCHES,
    meta: {
      embeddingModel: 'text-embedding-3-small',
      dims: 1536,
      tablesSearched: ['documents', 'document_chunks', 'sightings', 'people', 'organizations', 'events', 'testimonies'],
      tookMs: 4120,
      truncated: true,
      ...overrides.meta,
    },
  }
}

export function buildDropFixture(scenario: DropFixtureScenario, file: File): DropFixtureOutcome {
  switch (scenario) {
    case 'empty':
      return {
        kind: 'response',
        delayMs: 2200,
        response: baseResponse(file, {
          matches: [],
          meta: {
            embeddingModel: 'text-embedding-3-small',
            dims: 1536,
            tablesSearched: ['documents', 'document_chunks', 'sightings', 'people'],
            tookMs: 2180,
            truncated: false,
          },
        }),
      }

    case 'vision-caption':
      return {
        kind: 'response',
        delayMs: 3400,
        response: baseResponse(file, {
          artifact: {
            id: `drop_fixture_${Math.random().toString(36).slice(2, 10)}`,
            filename: file.name,
            mime: file.type || 'image/png',
            bytes: file.size,
            kind: 'image',
            blobUrl: null,
            derivedVia: 'vision-caption',
            extractedChars: 412,
            excerpt:
              'A black-and-white photograph showing a domed disc-shaped object against an overcast sky, with a utility pole and power lines occupying the lower left of the frame. The object is slightly out of focus relative to the foreground.',
          },
          matches: SUCCESS_MATCHES.slice(0, 4),
        }),
      }

    case 'extract-failed':
      return {
        kind: 'error',
        delayMs: 1500,
        code: 'EXTRACT_FAILED',
        error: 'The file was readable but produced no extractable text.',
      }

    case 'search-failed':
      return {
        kind: 'error',
        delayMs: 1800,
        code: 'SEARCH_FAILED',
        error: 'The corpus query did not complete.',
      }

    case 'slow':
      return {kind: 'response', delayMs: 9000, response: baseResponse(file, {})}

    case 'success':
    default:
      return {kind: 'response', delayMs: 3800, response: baseResponse(file, {})}
  }
}
