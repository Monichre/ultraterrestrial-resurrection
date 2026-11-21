// Comprehensive Astronaut UFO Database
export const astronauts = [
  {
    id: 1,
    name: "Edgar Mitchell",
    mission: "Apollo 14",
    role: "Lunar Module Pilot",
    year: 1971,
    photo: "/src/assets/astronaut_photos/edgar_mitchell_apollo14_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Personal Beliefs",
    keyStatement: "We all know that UFOs are real. All we need to ask is where do they come from?",
    detailedStatement: "I've talked with people of stature --- of military and government credentials and position --- and heard their stories, and their desire to tell their stories openly to the public. The evidence points to the fact that Roswell was a real incident.",
    authorityMetrics: [
      "6th person to walk on the Moon",
      "Founder of Institute of Noetic Sciences",
      "Multiple documented interviews spanning 40+ years"
    ],
    verificationStatus: "Mitchell's statements are well-documented across multiple interviews and sources. NASA has officially distanced itself from his UFO claims.",
    nasaBio: "https://www.nasa.gov/people/edgar-d-mitchell/",
    confidence: 90
  },
  {
    id: 2,
    name: "Gordon Cooper",
    mission: "Mercury-Atlas 9, Gemini 5",
    role: "Pilot/Commander",
    year: "1963, 1965",
    photo: "/src/assets/astronaut_photos/gordon_cooper_mercury_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Personal Beliefs",
    keyStatement: "I believe that these extraterrestrial vehicles and their crews are visiting this planet from other planets, which obviously are a little more technically advanced than we are here on Earth.",
    detailedStatement: "Cooper made multiple UFO claims throughout his career, including UN testimony and personal encounters. However, his space mission claims have been disputed.",
    authorityMetrics: [
      "Mercury and Gemini astronaut",
      "UN Panel testimony in 1985",
      "Multiple pre-NASA military encounters"
    ],
    verificationStatus: "Cooper's pre-NASA military encounters and personal beliefs are well-documented. However, his space mission UFO claims have been debunked.",
    nasaBio: "https://www.nasa.gov/people/l-gordon-cooper-jr/",
    confidence: 85
  },
  {
    id: 3,
    name: "James McDivitt",
    mission: "Gemini 4",
    role: "Commander",
    year: 1965,
    photo: "/src/assets/astronaut_photos/james_mcdivitt_gemini4_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Mission Sightings",
    keyStatement: "At one stage we even thought it might be necessary to take evasive action to avoid a collision.",
    detailedStatement: "McDivitt reported seeing an unidentified cylindrical object during the Gemini 4 mission, which he photographed. However, the famous 'McDivitt UFO photo' has been misrepresented.",
    authorityMetrics: [
      "Gemini 4 Commander",
      "Direct mission observation",
      "Photographed unidentified object"
    ],
    verificationStatus: "McDivitt's sighting is genuine and well-documented. However, the associated photograph has been misrepresented by UFO enthusiasts.",
    nasaBio: "https://www.nasa.gov/people/james-a-mcdivitt/",
    confidence: 80
  },
  {
    id: 4,
    name: "Scott Kelly",
    mission: "Multiple Space Shuttle flights, ISS",
    role: "Commander",
    year: "1999-2016",
    photo: "/src/assets/astronaut_photos/scott_kelly_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Mission Sightings",
    keyStatement: "Oftentimes, in space, I would see things and I was like, 'That's really not behaving like it should.' And every single time when I would look at it long enough, I would realize that it was atmospheric lensing.",
    detailedStatement: "Kelly serves on NASA's UAP study team and has shared his experiences with unidentified phenomena, both in space and as a military pilot.",
    authorityMetrics: [
      "NASA UAP study team member",
      "Year in Space mission",
      "Multiple Space Shuttle flights"
    ],
    verificationStatus: "Kelly's statements are well-documented and demonstrate a scientific approach to unexplained sightings. His role on NASA's UAP study team adds significant credibility.",
    nasaBio: "https://www.nasa.gov/people/scott-j-kelly/",
    confidence: 85
  },
  {
    id: 5,
    name: "Buzz Aldrin",
    mission: "Apollo 11",
    role: "Lunar Module Pilot",
    year: 1969,
    photo: "/src/assets/astronaut_photos/buzz_aldrin_apollo11_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Mission Sightings",
    keyStatement: "We observed a light out the window that appeared alongside the crew during Apollo 11.",
    detailedStatement: "Aldrin's UFO statements have been frequently taken out of context, leading to widespread misrepresentation of his actual experiences.",
    authorityMetrics: [
      "2nd person to walk on the Moon",
      "Apollo 11 Lunar Module Pilot",
      "Direct mission observation"
    ],
    verificationStatus: "Aldrin did report seeing unexplained lights, but the significance has been greatly exaggerated by UFO proponents. His actual statements are much more mundane than commonly portrayed.",
    nasaBio: "https://www.nasa.gov/people/buzz-aldrin/",
    confidence: 70
  },
  {
    id: 6,
    name: "Al Worden",
    mission: "Apollo 15",
    role: "Command Module Pilot",
    year: 1971,
    photo: "/src/assets/astronaut_photos/al_worden_apollo15_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Personal Beliefs",
    keyStatement: "We are the aliens, but we just think they are somebody else. But we are the ones who came from somewhere else, because somebody else had to survive.",
    detailedStatement: "Worden made controversial statements about ancient aliens and human origins during a 2017 Good Morning Britain interview.",
    authorityMetrics: [
      "Apollo 15 Command Module Pilot",
      "12 days in space",
      "Most isolated human being during lunar orbit"
    ],
    verificationStatus: "Worden's ancient alien statements are well-documented through video interview evidence. While controversial, they represent his personal beliefs rather than mission-related observations.",
    nasaBio: "https://www.nasa.gov/people/alfred-m-worden/",
    confidence: 75
  },
  {
    id: 7,
    name: "Leroy Chiao",
    mission: "Multiple Space Shuttle flights, ISS Expedition 10",
    role: "Commander",
    year: "1994-2005",
    photo: "/src/assets/astronaut_photos/leroy_chiao_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Mission Sightings",
    keyStatement: "During a spacewalk, I observed lights in a formation that looked like an upside-down check mark.",
    detailedStatement: "Chiao reported seeing unexplained lights during a 2005 spacewalk outside the International Space Station, later identified as fishing boats.",
    authorityMetrics: [
      "ISS Expedition 10 Commander",
      "Multiple Space Shuttle flights",
      "Direct spacewalk observation"
    ],
    verificationStatus: "Chiao's ISS sighting is well-documented, and his later explanation provides a rational interpretation. His willingness to report and later explain the sighting adds to his credibility.",
    nasaBio: "https://www.nasa.gov/people/leroy-chiao/",
    confidence: 80
  },
  {
    id: 8,
    name: "Jerry Linenger",
    mission: "Mir Expedition",
    role: "Flight Engineer",
    year: 1997,
    photo: "/src/assets/astronaut_photos/jerry_linenger_nasa.jpg",
    verificationLevel: "HIGH",
    category: "Mission Sightings",
    keyStatement: "I saw things in the true sense of the word, unidentified flying objects – don't take me out of context there – no aliens. But I saw stuff that made me call my crewmates over and say 'what the heck is that?'",
    detailedStatement: "Linenger reported multiple anomalous sightings during his extended stay aboard the Mir space station.",
    authorityMetrics: [
      "5 months aboard Mir space station",
      "50 million miles of travel",
      "2,000 Earth orbits"
    ],
    verificationStatus: "Linenger's statements are well-documented through live interviews and demonstrate a careful, scientific approach to unexplained observations.",
    nasaBio: "https://www.nasa.gov/people/jerry-m-linenger/",
    confidence: 85
  },
  {
    id: 9,
    name: "John Glenn",
    mission: "Mercury-Atlas 6",
    role: "Pilot",
    year: 1962,
    photo: null,
    verificationLevel: "MEDIUM",
    category: "Mission Sightings",
    keyStatement: "I observed three objects following me that overtook me at varying speeds.",
    detailedStatement: "Glenn described these as 'snowflakes' that were small and seemed to be coming from the rear end of his capsule.",
    authorityMetrics: [
      "First American to orbit Earth",
      "Mercury-Atlas 6 pilot",
      "Direct mission observation"
    ],
    verificationStatus: "The objects were determined to be ice particles or debris from the spacecraft itself, not unidentified flying objects.",
    nasaBio: "https://www.nasa.gov/people/john-h-glenn-jr/",
    confidence: 60
  },
  {
    id: 10,
    name: "Scott Carpenter",
    mission: "Mercury-Atlas 7",
    role: "Pilot",
    year: 1962,
    photo: null,
    verificationLevel: "MEDIUM",
    category: "Mission Sightings",
    keyStatement: "I observed firefly-like objects during my mission.",
    detailedStatement: "Carpenter did see 'fireflies' as well as a balloon ejected from his capsule. Claims about photographing a 'saucer' are counterfeit.",
    authorityMetrics: [
      "Mercury-Atlas 7 pilot",
      "Direct mission observation",
      "Photographed phenomena"
    ],
    verificationStatus: "The claim that he reported photographing a 'saucer' is counterfeit. His photo was actually the tracking balloon.",
    nasaBio: "https://www.nasa.gov/people/m-scott-carpenter/",
    confidence: 50
  }
];

export const verificationLevels = {
  HIGH: { color: "green", description: "Multiple independent sources, direct quotes, official documentation" },
  MEDIUM: { color: "yellow", description: "Some documentation, but limited sources or context issues" },
  LOW: { color: "red", description: "Single source, disputed claims, or known fabrications" }
};

export const categories = {
  "Mission Sightings": { color: "blue", description: "UFO observations during space missions" },
  "Personal Beliefs": { color: "purple", description: "Statements about extraterrestrial life or UFO phenomena" },
  "Government Secrecy": { color: "orange", description: "Claims about cover-ups or hidden information" },
  "Misattributed": { color: "gray", description: "Statements taken out of context or fabricated" }
};

export const stats = {
  totalAstronauts: astronauts.length,
  highConfidence: astronauts.filter(a => a.verificationLevel === "HIGH").length,
  mediumConfidence: astronauts.filter(a => a.verificationLevel === "MEDIUM").length,
  lowConfidence: astronauts.filter(a => a.verificationLevel === "LOW").length,
  missionSightings: astronauts.filter(a => a.category === "Mission Sightings").length,
  personalBeliefs: astronauts.filter(a => a.category === "Personal Beliefs").length
};

