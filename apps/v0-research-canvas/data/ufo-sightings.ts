export interface UFOSighting {
  id: string
  name: string
  date: string
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  witnesses: number
  classification: "CE1" | "CE2" | "CE3" | "CE4" | "Radar" | "Military" | "Mass"
  credibility: "High" | "Medium" | "Low"
  image: string
  sources: string[]
  relatedIncidents: string[]
  tags: string[]
}

export const UFO_SIGHTINGS: UFOSighting[] = [
  {
    id: "roswell-1947",
    name: "Roswell Incident",
    date: "1947-07-08",
    location: "Roswell, New Mexico, USA",
    coordinates: { lat: 33.3943, lng: -104.523 },
    description:
      "The most famous UFO incident in history. A rancher discovered mysterious debris on his property, leading to military involvement and decades of speculation about recovered alien technology and bodies.",
    witnesses: 50,
    classification: "CE2",
    credibility: "High",
    image: "/roswell-ufo-crash-site-desert.jpg",
    sources: ["USAF Report", "Witness Testimonies", "FBI Documents"],
    relatedIncidents: ["socorro-1964"],
    tags: ["crash", "military", "cover-up", "debris"],
  },
  {
    id: "phoenix-lights-1997",
    name: "Phoenix Lights",
    date: "1997-03-13",
    location: "Phoenix, Arizona, USA",
    coordinates: { lat: 33.4484, lng: -112.074 },
    description:
      "Thousands of witnesses observed a massive V-shaped craft with lights spanning over a mile wide, silently gliding over Phoenix. Governor Fife Symington later admitted he saw the craft.",
    witnesses: 10000,
    classification: "Mass",
    credibility: "High",
    image: "/phoenix-lights-ufo-v-shape-night-sky.jpg",
    sources: ["Eyewitness Reports", "News Coverage", "Governor Statement"],
    relatedIncidents: ["stephenville-2008"],
    tags: ["mass-sighting", "v-shaped", "lights", "silent"],
  },
  {
    id: "rendlesham-1980",
    name: "Rendlesham Forest Incident",
    date: "1980-12-26",
    location: "Rendlesham Forest, Suffolk, UK",
    coordinates: { lat: 52.0833, lng: 1.45 },
    description:
      "US Air Force personnel stationed at RAF Woodbridge reported strange lights and a landed triangular craft in the forest. Physical evidence and radiation readings were recorded.",
    witnesses: 40,
    classification: "CE2",
    credibility: "High",
    image: "/rendlesham-forest-ufo-landing-mysterious-lights.jpg",
    sources: ["Military Reports", "Halt Memo", "Audio Recordings"],
    relatedIncidents: ["belgium-wave-1990"],
    tags: ["military", "landing", "radiation", "triangular"],
  },
  {
    id: "belgium-wave-1990",
    name: "Belgian UFO Wave",
    date: "1990-03-30",
    location: "Belgium",
    coordinates: { lat: 50.8503, lng: 4.3517 },
    description:
      "Over 13,000 people reported sightings of large triangular craft. Belgian Air Force F-16s were scrambled and tracked the objects on radar, which displayed impossible flight characteristics.",
    witnesses: 13000,
    classification: "Radar",
    credibility: "High",
    image: "/belgium-ufo-triangle-craft-night.jpg",
    sources: ["Belgian Air Force", "Radar Data", "F-16 Pilot Reports"],
    relatedIncidents: ["rendlesham-1980"],
    tags: ["mass-sighting", "triangular", "radar", "military-pursuit"],
  },
  {
    id: "tic-tac-2004",
    name: "USS Nimitz Tic Tac Encounter",
    date: "2004-11-14",
    location: "Pacific Ocean, off San Diego, USA",
    coordinates: { lat: 31.5, lng: -117.5 },
    description:
      "Navy pilots from the USS Nimitz encountered a white Tic Tac-shaped object that demonstrated extraordinary flight capabilities, including instantaneous acceleration and trans-medium travel.",
    witnesses: 20,
    classification: "Military",
    credibility: "High",
    image: "/tic-tac-ufo-navy-encounter-ocean.jpg",
    sources: ["Pentagon Release", "Pilot Interviews", "FLIR Footage"],
    relatedIncidents: ["gimbal-2015"],
    tags: ["navy", "tic-tac", "video-evidence", "trans-medium"],
  },
  {
    id: "travis-walton-1975",
    name: "Travis Walton Abduction",
    date: "1975-11-05",
    location: "Snowflake, Arizona, USA",
    coordinates: { lat: 34.5128, lng: -110.0784 },
    description:
      "Logger Travis Walton was allegedly abducted in front of six coworkers who witnessed a beam of light from a hovering craft. He reappeared five days later with memories of being aboard an alien craft.",
    witnesses: 7,
    classification: "CE4",
    credibility: "Medium",
    image: "/travis-walton-abduction-forest-ufo-beam.jpg",
    sources: ["Witness Testimonies", "Polygraph Tests", "Book Account"],
    relatedIncidents: ["ariel-school-1994"],
    tags: ["abduction", "beam", "multiple-witnesses", "missing-time"],
  },
  {
    id: "ariel-school-1994",
    name: "Ariel School Encounter",
    date: "1994-09-16",
    location: "Ruwa, Zimbabwe",
    coordinates: { lat: -17.9, lng: 31.1 },
    description:
      "62 schoolchildren witnessed a silver craft land near their school. Small beings emerged and communicated telepathically about environmental destruction. The children's consistent testimonies remain compelling.",
    witnesses: 62,
    classification: "CE3",
    credibility: "High",
    image: "/ariel-school-zimbabwe-ufo-children-encounter.jpg",
    sources: ["Dr. John Mack Interview", "Student Drawings", "Documentary"],
    relatedIncidents: ["westall-1966"],
    tags: ["landing", "beings", "children", "telepathy"],
  },
  {
    id: "ohare-2006",
    name: "O'Hare Airport Sighting",
    date: "2006-11-07",
    location: "Chicago O'Hare Airport, Illinois, USA",
    coordinates: { lat: 41.9742, lng: -87.9073 },
    description:
      "Airport employees and pilots observed a dark, disc-shaped object hovering over Gate C17. The object shot upward through the clouds at high speed, leaving a visible hole in the overcast.",
    witnesses: 12,
    classification: "CE1",
    credibility: "High",
    image: "/ohare-airport-ufo-saucer-clouds.jpg",
    sources: ["FAA Reports", "Pilot Testimonies", "Chicago Tribune"],
    relatedIncidents: ["stephenville-2008"],
    tags: ["airport", "disc", "cloud-punching", "aviation"],
  },
  {
    id: "shag-harbour-1967",
    name: "Shag Harbour Incident",
    date: "1967-10-04",
    location: "Shag Harbour, Nova Scotia, Canada",
    coordinates: { lat: 43.4621, lng: -65.7227 },
    description:
      "Multiple witnesses saw a large object with lights crash into the harbour. Coast Guard and divers found strange yellow foam but no wreckage. The Canadian government officially investigated.",
    witnesses: 30,
    classification: "CE2",
    credibility: "High",
    image: "/shag-harbour-ufo-crash-water-nova-scotia.jpg",
    sources: ["RCMP Report", "Coast Guard Records", "DND Documents"],
    relatedIncidents: ["roswell-1947"],
    tags: ["crash", "water", "government-investigation", "physical-evidence"],
  },
  {
    id: "gimbal-2015",
    name: "GIMBAL Video Incident",
    date: "2015-01-21",
    location: "Atlantic Ocean, East Coast USA",
    coordinates: { lat: 36.0, lng: -74.0 },
    description:
      "Navy pilots captured infrared footage of a rotating, saucer-shaped object. The pilots' excited reactions were recorded as they tracked the anomalous craft that seemed to defy physics.",
    witnesses: 6,
    classification: "Military",
    credibility: "High",
    image: "/gimbal-ufo-navy-infrared-footage.jpg",
    sources: ["Pentagon Release", "FLIR Footage", "Pilot Audio"],
    relatedIncidents: ["tic-tac-2004"],
    tags: ["navy", "video-evidence", "infrared", "rotation"],
  },
  {
    id: "washington-dc-1952",
    name: "Washington D.C. UFO Flap",
    date: "1952-07-19",
    location: "Washington D.C., USA",
    coordinates: { lat: 38.9072, lng: -77.0369 },
    description:
      "UFOs were tracked on radar over the White House and Capitol Building on consecutive weekends. Fighter jets were scrambled but couldn't intercept the fast-moving objects.",
    witnesses: 100,
    classification: "Radar",
    credibility: "High",
    image: "/washington-dc-capitol-ufo-1952.jpg",
    sources: ["Air Force Blue Book", "Radar Operators", "Newspapers"],
    relatedIncidents: ["roswell-1947"],
    tags: ["radar", "military", "capitol", "jets-scrambled"],
  },
  {
    id: "westall-1966",
    name: "Westall UFO Encounter",
    date: "1966-04-06",
    location: "Melbourne, Victoria, Australia",
    coordinates: { lat: -37.9309, lng: 145.0545 },
    description:
      "Over 200 students and teachers at Westall High School witnessed a grey saucer-shaped craft descend into a nearby field, then ascend and fly away. Witnesses were told to remain silent.",
    witnesses: 200,
    classification: "Mass",
    credibility: "High",
    image: "/westall-australia-school-ufo-saucer-field.jpg",
    sources: ["Witness Interviews", "Documentary", "School Records"],
    relatedIncidents: ["ariel-school-1994"],
    tags: ["school", "mass-sighting", "landing", "cover-up"],
  },
  {
    id: "tehran-1976",
    name: "Tehran UFO Incident",
    date: "1976-09-19",
    location: "Tehran, Iran",
    coordinates: { lat: 35.6892, lng: 51.389 },
    description:
      "Iranian Air Force F-4 jets were scrambled to intercept a brilliant UFO. When pilots attempted to fire, their weapons systems malfunctioned. The object released smaller luminous objects.",
    witnesses: 15,
    classification: "Military",
    credibility: "High",
    image: "/tehran-iran-ufo-fighter-jet-intercept.jpg",
    sources: ["DIA Report", "Pilot Testimonies", "Declassified Documents"],
    relatedIncidents: ["belgium-wave-1990"],
    tags: ["military", "jet-intercept", "weapon-malfunction", "smaller-objects"],
  },
  {
    id: "socorro-1964",
    name: "Socorro Landing",
    date: "1964-04-24",
    location: "Socorro, New Mexico, USA",
    coordinates: { lat: 34.0584, lng: -106.8914 },
    description:
      "Police officer Lonnie Zamora witnessed an egg-shaped craft and two small beings in white coveralls. Physical evidence including landing marks and burnt vegetation were documented.",
    witnesses: 1,
    classification: "CE3",
    credibility: "High",
    image: "/socorro-new-mexico-ufo-egg-shaped-landing.jpg",
    sources: ["Project Blue Book", "FBI Report", "Physical Evidence"],
    relatedIncidents: ["roswell-1947"],
    tags: ["police-witness", "landing", "beings", "physical-evidence"],
  },
  {
    id: "stephenville-2008",
    name: "Stephenville Lights",
    date: "2008-01-08",
    location: "Stephenville, Texas, USA",
    coordinates: { lat: 32.2207, lng: -98.2025 },
    description:
      "Dozens of residents reported seeing large silent objects with bright lights moving at incredible speeds. Some described a craft a mile long. Radar data later confirmed unknown objects.",
    witnesses: 50,
    classification: "Mass",
    credibility: "High",
    image: "/stephenville-texas-ufo-lights-night-sky.jpg",
    sources: ["MUFON Investigation", "Radar Analysis", "Witness Reports"],
    relatedIncidents: ["phoenix-lights-1997"],
    tags: ["mass-sighting", "lights", "radar", "large-craft"],
  },
]

export const getIncidentById = (id: string): UFOSighting | undefined => {
  return UFO_SIGHTINGS.find((incident) => incident.id === id)
}

export const getRelatedIncidents = (id: string): UFOSighting[] => {
  const incident = getIncidentById(id)
  if (!incident) return []
  return incident.relatedIncidents
    .map((relId) => getIncidentById(relId))
    .filter((inc): inc is UFOSighting => inc !== undefined)
}

export const getIncidentsByDecade = (decade: number): UFOSighting[] => {
  return UFO_SIGHTINGS.filter((incident) => {
    const year = new Date(incident.date).getFullYear()
    return Math.floor(year / 10) * 10 === decade
  })
}

export const getIncidentsByClassification = (classification: UFOSighting["classification"]): UFOSighting[] => {
  return UFO_SIGHTINGS.filter((incident) => incident.classification === classification)
}
