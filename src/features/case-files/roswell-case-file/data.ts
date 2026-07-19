export type CaseFileLayerType =
  | 'summary'
  | 'photo'
  | 'clipping'
  | 'video'
  | 'personnel'
  | 'source'
  | 'organization'

export interface CaseFileLayerMeta {
  label: string
  value: string
}

export interface CaseFileLayer {
  id: string
  type: CaseFileLayerType
  title: string
  subtitle?: string
  body: string
  tag?: string
  meta?: CaseFileLayerMeta[]
}

export interface CaseFileRecord {
  id: string
  name: string
  date: string
  location: string
  classification: 'top-secret' | 'classified' | 'confidential'
}

// Seeded from the real `events` record (id: rec_cobdg3tbjt595h637700) exported
// from Xata, plus publicly documented supporting figures/sources for the demo.
export const roswellCaseFile: CaseFileRecord = {
  id: 'rec_cobdg3tbjt595h637700',
  name: 'The Roswell Incident',
  date: '1947-07-08',
  location: 'About 30 mi. north of Roswell, New Mexico, United States',
  classification: 'top-secret',
}

export const roswellLayers: CaseFileLayer[] = [
  {
    id: 'summary',
    type: 'summary',
    title: 'The Roswell Incident',
    subtitle: 'Case Summary · July 8, 1947',
    body: 'Walter Haut, a United States Army Air Forces spokesperson, issued a press release announcing the "capture" of a flying saucer. Hours later, the Army announced the find was a crashed weather balloon. In 1978 the case regained attention after Jesse Marcel, the officer who recovered the wreckage, told researchers the weather-balloon explanation was a cover story. In 1994 the Air Force attributed the incident to the previously classified Project Mogul.',
    meta: [
      {label: 'Location', value: 'Roswell, New Mexico'},
      {label: 'Status', value: 'Unresolved / Disputed'},
      {label: 'Case ID', value: 'rec_...637700'},
    ],
  },
  {
    id: 'photo-debris-field',
    type: 'photo',
    title: 'Debris Field, Foster Ranch',
    subtitle: 'Archival Photograph',
    body: 'Wreckage recovered from the Foster homestead, roughly 75 miles northwest of Roswell, was photographed before being transported to RAAF for examination.',
    tag: 'Photo scan · unavailable in demo',
  },
  {
    id: 'photo-ramey-office',
    type: 'photo',
    title: "Gen. Ramey's Office",
    subtitle: 'Press Photograph · July 8, 1947',
    body: 'Debris laid out on the floor of Gen. Roger Ramey\'s office at Fort Worth Army Air Field, photographed for the assembled press corps alongside Jesse Marcel.',
    tag: 'Photo scan · unavailable in demo',
  },
  {
    id: 'clipping-raaf',
    type: 'clipping',
    title: 'RAAF Captures Flying Saucer',
    subtitle: 'Roswell Daily Record · July 8, 1947',
    body: '"The intelligence office of the 509th Bombardment group at Roswell Army Air Field announced at noon today that the field has come into possession of a flying saucer, recovered on a ranch in the Roswell vicinity..."',
    tag: 'Front page, evening edition',
  },
  {
    id: 'clipping-retraction',
    type: 'clipping',
    title: 'Ramey Empties Roswell Saucer',
    subtitle: 'Fort Worth Star-Telegram · July 9, 1947',
    body: 'Hours after the initial announcement, Eighth Air Force commander Gen. Roger Ramey told reporters the recovered debris was consistent with a weather balloon and its radar target, not a "flying disk."',
    tag: 'Retraction coverage',
  },
  {
    id: 'person-haut',
    type: 'personnel',
    title: 'Walter Haut',
    subtitle: 'Public Information Officer, RAAF',
    body: 'Authored the July 8, 1947 press release announcing recovery of a "flying disc." Decades later signed a sworn affidavit describing a cover-up of a crash retrieval and recovered bodies.',
    meta: [{label: 'Role', value: 'Press release author'}],
  },
  {
    id: 'person-marcel',
    type: 'personnel',
    title: 'Maj. Jesse Marcel',
    subtitle: 'Intelligence Officer, 509th Bomb Group',
    body: 'Recovered debris from the Foster ranch site. In 1978, told researcher Stanton Friedman the weather-balloon explanation did not match the material he personally handled.',
    meta: [{label: 'Role', value: 'First recovery officer'}],
  },
  {
    id: 'person-ramey',
    type: 'personnel',
    title: 'Gen. Roger Ramey',
    subtitle: 'Commander, Eighth Air Force',
    body: 'Presented the weather-balloon explanation to press at Fort Worth Army Air Field on July 9, 1947, alongside debris photographed for the press corps.',
    meta: [{label: 'Role', value: 'Public retraction'}],
  },
  {
    id: 'org-raaf',
    type: 'organization',
    title: '509th Bomb Group, RAAF',
    subtitle: 'Roswell Army Air Field',
    body: 'The only nuclear-capable bomb group in the world in 1947. Its intelligence office issued, then retracted within hours, the "flying disc" announcement.',
  },
  {
    id: 'org-mogul',
    type: 'organization',
    title: 'Project Mogul',
    subtitle: 'Classified acoustic surveillance program',
    body: 'A then-classified program using high-altitude balloon trains to detect Soviet nuclear tests. Declassified Air Force analysis in 1994 attributed the Roswell debris to a Mogul balloon train.',
  },
  {
    id: 'source-press-release',
    type: 'source',
    title: 'Original Press Release',
    subtitle: 'Primary source · July 8, 1947',
    body: '"The many rumors regarding the flying disc became a reality yesterday when the intelligence office of the 509th Bombardment group... was fortunate enough to gain possession of a disc through the cooperation of one of the local ranchers."',
  },
  {
    id: 'source-marcel-testimony',
    type: 'source',
    title: 'Marcel 1978 Testimony',
    subtitle: 'Witness account · recorded interview',
    body: '"I was pretty well acquainted with all types of aircraft... this was not any of these." Marcel described material that would not bend, burn, or dent the way balloon debris was expected to.',
  },
  {
    id: 'video-archive',
    type: 'video',
    title: 'No Contemporary Footage Catalogued',
    subtitle: 'Video archive · 1947',
    body: 'No motion-picture footage of the 1947 recovery is known to exist. This layer is reserved for newsreel, documentary, or testimony video as it is catalogued.',
    tag: 'Placeholder layer',
  },
]
