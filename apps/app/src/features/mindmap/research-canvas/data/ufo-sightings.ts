export interface UFOSighting {
  id: string
  name: string
  date: string
  location: string
  description: string
  classification: string
  credibility: string
  witnesses: number
  image: string
  tags: string[]
  sources: string[]
  relatedIncidents: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

export const UFO_SIGHTINGS: UFOSighting[] = [
  {
    id: 'roswell-1947',
    name: 'Roswell Incident',
    date: '1947-07-08',
    location: 'Roswell, New Mexico, USA',
    description:
      'A United States Army Air Forces balloon crashed at a ranch near Roswell. The initial military press release stated a "flying disc" had been recovered, later retracted and attributed to a weather balloon.',
    classification: 'Military',
    credibility: 'High',
    witnesses: 30,
    image: '/images/sightings/roswell.jpg',
    tags: ['military', 'crash-retrieval', 'government-coverup', 'cold-war', 'debris-field'],
    sources: [
      'USAF Report on Roswell (1994)',
      'Witness testimony from Jesse Marcel Sr.',
      'GAO Report on Roswell Records (1995)',
    ],
    relatedIncidents: ['rendlesham-1980', 'tic-tac-2004'],
    coordinates: {lat: 33.3943, lng: -104.523},
  },
  {
    id: 'phoenix-lights-1997',
    name: 'Phoenix Lights',
    date: '1997-03-13',
    location: 'Phoenix, Arizona, USA',
    description:
      'A mass sighting event witnessed by thousands across Arizona. A V-shaped formation of lights traversed the state from north to south, followed by stationary lights over Phoenix.',
    classification: 'Mass',
    credibility: 'High',
    witnesses: 10000,
    image: '/images/sightings/phoenix-lights.jpg',
    tags: ['mass-sighting', 'v-formation', 'military-flares', 'governor-testimony'],
    sources: [
      'USA Today coverage (1997)',
      'Governor Fife Symington testimony',
      'National UFO Reporting Center archives',
    ],
    relatedIncidents: ['belgian-wave-1989', 'colares-1977'],
    coordinates: {lat: 33.4484, lng: -112.074},
  },
  {
    id: 'rendlesham-1980',
    name: 'Rendlesham Forest Incident',
    date: '1980-12-26',
    location: 'Rendlesham Forest, Suffolk, England',
    description:
      'A series of reported sightings of unexplained lights and the alleged landing of a craft near RAF Woodbridge. USAF personnel investigated and documented elevated radiation readings and ground impressions.',
    classification: 'CE2',
    credibility: 'High',
    witnesses: 12,
    image: '/images/sightings/rendlesham.jpg',
    tags: ['military-base', 'physical-trace', 'radiation', 'audio-recording', 'nato'],
    sources: [
      'Lt. Col. Charles Halt memo to MoD (1981)',
      'Nick Pope MoD investigation files',
      'Halt audio recording transcript',
    ],
    relatedIncidents: ['roswell-1947', 'belgian-wave-1989'],
    coordinates: {lat: 52.0953, lng: 1.4384},
  },
  {
    id: 'tic-tac-2004',
    name: 'USS Nimitz Tic Tac Encounter',
    date: '2004-11-14',
    location: 'Pacific Ocean, off San Diego, California, USA',
    description:
      'Fighter pilots from the USS Nimitz carrier strike group encountered an unidentified aerial phenomenon described as a white, oblong "Tic Tac" shaped object performing maneuvers beyond known aerodynamic capabilities.',
    classification: 'Radar',
    credibility: 'High',
    witnesses: 6,
    image: '/images/sightings/tic-tac.jpg',
    tags: ['navy', 'flir-footage', 'transmedium', 'declassified', 'aatip', 'pentagon'],
    sources: [
      'Pentagon declassified FLIR video (2017)',
      'Commander David Fravor testimony',
      'USS Princeton radar operator Kevin Day testimony',
    ],
    relatedIncidents: ['roswell-1947', 'belgian-wave-1989'],
    coordinates: {lat: 31.0, lng: -118.0},
  },
  {
    id: 'colares-1977',
    name: 'Colares UFO Flap',
    date: '1977-10-01',
    location: 'Colares, Pará, Brazil',
    description:
      'Residents of the island of Colares reported being attacked by beams of light from unidentified aerial objects. The Brazilian Air Force launched Operation Saucer to investigate, producing hundreds of photographs.',
    classification: 'CE3',
    credibility: 'Medium',
    witnesses: 300,
    image: '/images/sightings/colares.jpg',
    tags: ['beam-attacks', 'physical-injuries', 'military-investigation', 'operation-saucer'],
    sources: [
      'Operation Saucer declassified files (2004)',
      'Captain Uyrangê Hollanda interviews',
      'Jacques Vallée field research notes',
    ],
    relatedIncidents: ['phoenix-lights-1997', 'belgian-wave-1989'],
    coordinates: {lat: -0.9337, lng: -48.2353},
  },
  {
    id: 'belgian-wave-1989',
    name: 'Belgian UFO Wave',
    date: '1989-11-29',
    location: 'Eupen, Liège, Belgium',
    description:
      'A wave of sightings of large, silent, triangular craft reported across Belgium. The Belgian Air Force scrambled F-16 fighters that obtained radar locks on objects demonstrating extraordinary acceleration.',
    classification: 'Radar',
    credibility: 'High',
    witnesses: 13500,
    image: '/images/sightings/belgian-wave.jpg',
    tags: ['triangular-craft', 'f-16-radar-lock', 'air-force-confirmation', 'mass-sighting'],
    sources: [
      'Belgian Air Force official report (1991)',
      'Major General Wilfried De Brouwer press conference',
      'SOBEPS investigation records',
    ],
    relatedIncidents: ['phoenix-lights-1997', 'rendlesham-1980', 'tic-tac-2004'],
    coordinates: {lat: 50.6326, lng: 6.0369},
  },
]

export function getIncidentById(id: string): UFOSighting | undefined {
  return UFO_SIGHTINGS.find((s) => s.id === id)
}

export function getRelatedIncidents(id: string): UFOSighting[] {
  const incident = getIncidentById(id)
  if (!incident) return []
  return UFO_SIGHTINGS.filter((s) => incident.relatedIncidents.includes(s.id))
}
