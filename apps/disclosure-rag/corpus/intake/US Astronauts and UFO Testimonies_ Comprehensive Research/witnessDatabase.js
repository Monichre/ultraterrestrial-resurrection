// The Witness Archive - Comprehensive UFO Testimony Database
// Merging US Astronauts, International Officials, and American Figures

export const witnessCategories = {
  astronauts: "US Astronauts",
  international: "International Officials", 
  american: "American Officials"
};

export const authorityLevels = {
  veryHigh: "Very High Authority",
  high: "High Authority",
  medium: "Medium Authority"
};

export const witnessDatabase = [
  // US ASTRONAUTS
  {
    id: "edgar-mitchell",
    category: "astronauts",
    name: "Edgar Mitchell",
    title: "Apollo 14 Lunar Module Pilot",
    authority: "veryHigh",
    photo: "/src/assets/astronaut_photos/edgar_mitchell_apollo14_nasa.jpg",
    mission: "Apollo 14",
    country: "United States",
    serviceYears: "1966-1972",
    keyStatement: "90% certainty of alien visitation to Earth",
    testimony: "Most vocal UFO advocate among astronauts, claimed direct knowledge of government cover-up",
    credibility: "High - Multiple documented sources, consistent statements over decades",
    sources: ["NASA Biography", "Press Club Conference 2001", "Multiple interviews"]
  },
  {
    id: "gordon-cooper",
    category: "astronauts", 
    name: "Gordon Cooper",
    title: "Mercury & Gemini Astronaut",
    authority: "veryHigh",
    photo: "/src/assets/astronaut_photos/gordon_cooper_mercury_nasa.jpg",
    mission: "Mercury-Atlas 9, Gemini 5",
    country: "United States",
    serviceYears: "1959-1970",
    keyStatement: "UN testimony about UFO encounters in 1978",
    testimony: "Multiple UFO sighting claims, testified before United Nations",
    credibility: "High - UN testimony documented, multiple witness accounts",
    sources: ["UN Testimony 1978", "NASA Records", "Autobiography"]
  },
  {
    id: "james-mcdivitt",
    category: "astronauts",
    name: "James McDivitt", 
    title: "Gemini 4 & Apollo 9 Commander",
    authority: "veryHigh",
    photo: "/src/assets/astronaut_photos/james_mcdivitt_gemini4_nasa.jpg",
    mission: "Gemini 4, Apollo 9",
    country: "United States", 
    serviceYears: "1962-1972",
    keyStatement: "Photographed cylindrical object during Gemini 4 mission",
    testimony: "Observed and photographed unidentified object during space mission",
    credibility: "High - Mission records, photographic evidence, NASA acknowledgment",
    sources: ["NASA Mission Transcripts", "Official Photography", "Post-mission interviews"]
  },
  {
    id: "scott-kelly",
    category: "astronauts",
    name: "Scott Kelly",
    title: "Space Shuttle & ISS Commander", 
    authority: "high",
    photo: "/src/assets/astronaut_photos/scott_kelly_nasa.jpg",
    mission: "Multiple Space Shuttle, ISS Expedition 25/26",
    country: "United States",
    serviceYears: "1996-2016",
    keyStatement: "NASA UAP study team member, reported F-14 incident",
    testimony: "Member of NASA UAP study team, reported personal UFO encounter",
    credibility: "High - NASA UAP team involvement, documented incident reports",
    sources: ["NASA UAP Study", "Business Insider Interview 2023", "Official statements"]
  },
  {
    id: "buzz-aldrin",
    category: "astronauts",
    name: "Buzz Aldrin",
    title: "Apollo 11 Lunar Module Pilot",
    authority: "veryHigh", 
    photo: "/src/assets/astronaut_photos/buzz_aldrin_apollo11_nasa.jpg",
    mission: "Apollo 11",
    country: "United States",
    serviceYears: "1963-1971",
    keyStatement: "Statements often taken out of context, saw unexplained light",
    testimony: "Reported unexplained lights during Apollo 11, statements frequently misrepresented",
    credibility: "Medium - Statements often misquoted, context important",
    sources: ["Apollo 11 Transcripts", "Various interviews", "Clarification statements"]
  },

  // INTERNATIONAL OFFICIALS
  {
    id: "paul-hellyer",
    category: "international",
    name: "Paul Hellyer",
    title: "Canadian Defense Minister",
    authority: "veryHigh",
    photo: "/src/assets/international_photos/paul_hellyer_official.jpg",
    position: "Minister of National Defence",
    country: "Canada",
    serviceYears: "1963-1967",
    keyStatement: "First NATO defense minister to publicly declare UFOs real",
    testimony: "Testified under oath at 2013 Congressional UFO hearing, maintained claims until death",
    credibility: "Very High - Cabinet-level position, consistent testimony, official hearings",
    sources: ["Congressional Testimony 2013", "Official Biography", "Multiple interviews"]
  },
  {
    id: "haim-eshed",
    category: "international", 
    name: "Haim Eshed",
    title: "Israeli Space Program Director",
    authority: "veryHigh",
    photo: "/src/assets/international_photos/haim_eshed_official.jpg",
    position: "Director of Space Programs, Israeli Ministry of Defense",
    country: "Israel",
    serviceYears: "1981-2011",
    keyStatement: "Claims of 'Galactic Federation' contact with governments",
    testimony: "Father of Israel's space program, claims government contact with extraterrestrials",
    credibility: "Very High - 30-year space program director, launched 20 satellites",
    sources: ["Yediot Aharonot Interview 2020", "Official Biography", "Space Program Records"]
  },
  {
    id: "wilfried-de-brouwer",
    category: "international",
    name: "Wilfried De Brouwer", 
    title: "Belgian Air Force General",
    authority: "veryHigh",
    photo: "/src/assets/international_photos/wilfried_de_brouwer.jpg",
    position: "Deputy Chief of Staff, Belgian Air Force",
    country: "Belgium",
    serviceYears: "1970-1995",
    keyStatement: "Official spokesperson for Belgian UFO wave investigation",
    testimony: "Led official military investigation of Belgian UFO wave 1989-1991",
    credibility: "Very High - Official military investigation, radar confirmation",
    sources: ["Belgian Military Reports", "Press Conferences", "Official Documentation"]
  },
  {
    id: "ricardo-bermudez",
    category: "international",
    name: "Ricardo Bermúdez",
    title: "Chilean Air Force General",
    authority: "high",
    photo: "/src/assets/international_photos/ricardo_bermudez.jpg", 
    position: "Director of CEFAA (UFO Investigation Agency)",
    country: "Chile",
    serviceYears: "1970-2010",
    keyStatement: "Director of official government UFO investigation agency",
    testimony: "Led Chilean government's official UFO investigation program",
    credibility: "High - Official government program, transparent investigations",
    sources: ["CEFAA Reports", "Government Documentation", "Official statements"]
  },

  // AMERICAN OFFICIALS
  {
    id: "christopher-mellon",
    category: "american",
    name: "Christopher Mellon",
    title: "Deputy Assistant Secretary of Defense",
    authority: "veryHigh",
    photo: "/src/assets/american_photos/christopher_mellon.jpg",
    position: "Deputy Assistant Secretary of Defense for Intelligence", 
    country: "United States",
    serviceYears: "1998-2002, 2009-2013",
    keyStatement: "Facilitated release of Pentagon 'Tic Tac' UFO videos",
    testimony: "Senior defense official who helped coordinate UFO disclosure efforts",
    credibility: "Very High - Cabinet-level position, Senate Intelligence Committee access",
    sources: ["Pentagon Biography", "NYT UFO Article 2017", "Congressional appearances"]
  },
  {
    id: "david-grusch",
    category: "american",
    name: "David Grusch", 
    title: "Intelligence Officer, NGA/NRO",
    authority: "medium",
    photo: "/src/assets/american_photos/david_grusch.png",
    position: "Representative to UAP Task Force",
    country: "United States", 
    serviceYears: "2009-2023",
    keyStatement: "Claims government recovered 'non-human' spacecraft and biologics",
    testimony: "Intelligence whistleblower with dramatic claims about crash retrievals",
    credibility: "Medium - Intelligence background verified, claims based on secondhand information",
    sources: ["Congressional Testimony 2023", "Whistleblower Complaint", "Intelligence records"]
  },
  {
    id: "david-fravor",
    category: "american",
    name: "David Fravor",
    title: "Navy Commander & F/A-18 Pilot", 
    authority: "high",
    photo: "/src/assets/american_photos/david_fravor.jpg",
    position: "Commanding Officer, VFA-41 Black Aces",
    country: "United States",
    serviceYears: "1986-2010", 
    keyStatement: "Famous 'Tic Tac' UFO encounter with multiple witnesses",
    testimony: "Most credible military pilot witness, multiple corroborating witnesses",
    credibility: "High - Multiple witnesses, radar confirmation, 20-year consistent testimony",
    sources: ["Congressional Testimony 2023", "USS Princeton logs", "Multiple interviews"]
  },
  {
    id: "luis-elizondo",
    category: "american",
    name: "Luis Elizondo",
    title: "Pentagon Intelligence Officer",
    authority: "high", 
    photo: "/src/assets/american_photos/luis_elizondo.jpg",
    position: "Director, Advanced Aerospace Threat Identification Program",
    country: "United States",
    serviceYears: "1997-2017",
    keyStatement: "First Pentagon official to acknowledge classified UFO program",
    testimony: "Former AATIP director who facilitated Pentagon UFO video releases",
    credibility: "High - Pentagon employment confirmed, involved in official video releases",
    sources: ["Pentagon Records", "AATIP Documentation", "Book 'Imminent' 2024"]
  },
  {
    id: "tim-gallaudet",
    category: "american", 
    name: "Timothy Gallaudet",
    title: "Rear Admiral, U.S. Navy",
    authority: "veryHigh",
    photo: "/src/assets/american_photos/tim_gallaudet.jpg",
    position: "Acting Administrator of NOAA",
    country: "United States",
    serviceYears: "1985-2017",
    keyStatement: "Testified about 'unidentified submerged objects'",
    testimony: "Highest-ranking military officer to provide detailed UFO testimony",
    credibility: "Very High - Flag officer rank, cabinet-level appointment, congressional testimony",
    sources: ["Congressional Testimony 2024", "NOAA Records", "Navy Biography"]
  }
];

export const getWitnessesByCategory = (category) => {
  return witnessDatabase.filter(witness => witness.category === category);
};

export const getWitnessesByAuthority = (authority) => {
  return witnessDatabase.filter(witness => witness.authority === authority);
};

export const getStatistics = () => {
  const total = witnessDatabase.length;
  const byCategory = {
    astronauts: getWitnessesByCategory('astronauts').length,
    international: getWitnessesByCategory('international').length, 
    american: getWitnessesByCategory('american').length
  };
  const byAuthority = {
    veryHigh: getWitnessesByAuthority('veryHigh').length,
    high: getWitnessesByAuthority('high').length,
    medium: getWitnessesByAuthority('medium').length
  };
  
  return { total, byCategory, byAuthority };
};

