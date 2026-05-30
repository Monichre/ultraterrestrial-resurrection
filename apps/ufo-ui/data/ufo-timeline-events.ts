import type { YearSection } from "@/types/timeline-scroll"

const ERA_OVERLAYS = {
  ancient: "rgba(20, 10, 5, 0.5)",
  early1900s: "rgba(15, 15, 20, 0.5)",
  midCentury: "rgba(10, 20, 15, 0.5)",
  coldWar: "rgba(25, 10, 15, 0.5)",
  modern: "rgba(10, 15, 25, 0.5)",
  contemporary: "rgba(15, 10, 25, 0.5)",
}

export const ufoTimelineData: YearSection[] = [
  {
    year: 1947,
    description: "The Modern UFO Era Begins",
    baseZIndex: 200,
    backgroundImage: "/roswell-ufo-crash-site-desert.jpg",
    backgroundOverlay: ERA_OVERLAYS.midCentury,
    events: [
      {
        id: "1947-roswell",
        type: "html",
        content: null,
        date: "July 8th, 1947",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "420px" },
      },
    ],
  },
  {
    year: 1952,
    description: "Washington D.C. UFO Invasion",
    baseZIndex: 190,
    backgroundImage: "/washington-dc-capitol-ufo-1952.jpg",
    backgroundOverlay: ERA_OVERLAYS.coldWar,
    events: [
      {
        id: "1952-washington",
        type: "html",
        content: null,
        date: "July 19-27, 1952",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "400px" },
      },
    ],
  },
  {
    year: 1964,
    description: "Socorro Landing Evidence",
    baseZIndex: 180,
    backgroundImage: "/socorro-new-mexico-ufo-egg-shaped-landing.jpg",
    backgroundOverlay: ERA_OVERLAYS.coldWar,
    events: [
      {
        id: "1964-socorro",
        type: "html",
        content: null,
        date: "April 24th, 1964",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1966,
    description: "Westall School Mass Sighting",
    baseZIndex: 170,
    backgroundImage: "/westall-australia-school-ufo-saucer-field.jpg",
    backgroundOverlay: ERA_OVERLAYS.coldWar,
    events: [
      {
        id: "1966-westall",
        type: "html",
        content: null,
        date: "April 6th, 1966",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1967,
    description: "Shag Harbour Crash",
    baseZIndex: 160,
    backgroundImage: "/shag-harbour-ufo-crash-water-nova-scotia.jpg",
    backgroundOverlay: ERA_OVERLAYS.coldWar,
    events: [
      {
        id: "1967-shag-harbour",
        type: "html",
        content: null,
        date: "October 4th, 1967",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1975,
    description: "Travis Walton Abduction",
    baseZIndex: 150,
    backgroundImage: "/travis-walton-abduction-forest-ufo-beam.jpg",
    backgroundOverlay: ERA_OVERLAYS.modern,
    events: [
      {
        id: "1975-walton",
        type: "html",
        content: null,
        date: "November 5th, 1975",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1976,
    description: "Tehran Military Encounter",
    baseZIndex: 140,
    backgroundImage: "/tehran-iran-ufo-fighter-jet-intercept.jpg",
    backgroundOverlay: ERA_OVERLAYS.modern,
    events: [
      {
        id: "1976-tehran",
        type: "html",
        content: null,
        date: "September 19th, 1976",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1977,
    description: "Colares UFO Flap - Operation Saucer",
    baseZIndex: 135,
    backgroundImage: "/images/colares.png",
    backgroundOverlay: ERA_OVERLAYS.modern,
    events: [
      {
        id: "1977-colares",
        type: "html",
        content: null,
        date: "October 1977",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "400px" },
      },
    ],
  },
  {
    year: 1980,
    description: "Rendlesham Forest Mystery",
    baseZIndex: 130,
    backgroundImage: "/rendlesham-forest-ufo-landing-mysterious-lights.jpg",
    backgroundOverlay: ERA_OVERLAYS.modern,
    events: [
      {
        id: "1980-rendlesham",
        type: "html",
        content: null,
        date: "December 26th, 1980",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1984,
    description: "Harbour Mille Missile Alert",
    baseZIndex: 125,
    backgroundImage:
      "/images/digital-mischief-group-harbour-mille-incident-multiple-missil-4b541827-142d-4281-a215-b88249617eb9-0.png",
    backgroundOverlay: ERA_OVERLAYS.modern,
    events: [
      {
        id: "1984-harbour-mille",
        type: "html",
        content: null,
        date: "January 25th, 1984",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1990,
    description: "Belgian UFO Wave",
    baseZIndex: 120,
    backgroundImage: "/belgium-ufo-triangle-craft-night.jpg",
    backgroundOverlay: ERA_OVERLAYS.modern,
    events: [
      {
        id: "1990-belgium",
        type: "html",
        content: null,
        date: "March 30th, 1990",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1994,
    description: "Ariel School Contact",
    baseZIndex: 110,
    backgroundImage: "/ariel-school-zimbabwe-ufo-children-encounter.jpg",
    backgroundOverlay: ERA_OVERLAYS.contemporary,
    events: [
      {
        id: "1994-ariel",
        type: "html",
        content: null,
        date: "September 16th, 1994",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 1997,
    description: "Phoenix Lights Mass Sighting",
    baseZIndex: 100,
    backgroundImage: "/phoenix-lights-ufo-v-shape-night-sky.jpg",
    backgroundOverlay: ERA_OVERLAYS.contemporary,
    events: [
      {
        id: "1997-phoenix",
        type: "html",
        content: null,
        date: "March 13th, 1997",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 2004,
    description: "USS Nimitz Tic Tac",
    baseZIndex: 90,
    backgroundImage: "/images/0-2.jpg",
    backgroundOverlay: ERA_OVERLAYS.contemporary,
    events: [
      {
        id: "2004-nimitz",
        type: "html",
        content: null,
        date: "November 14th, 2004",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "400px" },
      },
    ],
  },
  {
    year: 2006,
    description: "O'Hare Airport Sighting",
    baseZIndex: 80,
    backgroundImage: "/ohare-airport-ufo-saucer-clouds.jpg",
    backgroundOverlay: ERA_OVERLAYS.contemporary,
    events: [
      {
        id: "2006-ohare",
        type: "html",
        content: null,
        date: "November 7th, 2006",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 2008,
    description: "Stephenville Lights",
    baseZIndex: 70,
    backgroundImage: "/stephenville-texas-ufo-lights-night-sky.jpg",
    backgroundOverlay: ERA_OVERLAYS.contemporary,
    events: [
      {
        id: "2008-stephenville",
        type: "html",
        content: null,
        date: "January 8th, 2008",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 2015,
    description: "GIMBAL Video Evidence",
    baseZIndex: 60,
    backgroundImage:
      "/images/digital-mischief-group-metallic-sphere-darting-above-atlantic-ad66a4d1-55b7-448c-acee-3e4bee70eb1c-0.png",
    backgroundOverlay: ERA_OVERLAYS.contemporary,
    events: [
      {
        id: "2015-gimbal",
        type: "html",
        content: null,
        date: "January 21st, 2015",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 2017,
    description: "USS Roosevelt Encounters",
    baseZIndex: 50,
    backgroundImage:
      "/images/digital-mischief-group-tic-tac-object-accelerating-above-whit-71a300a8-c2f8-4379-8308-405ce468d9a4-3.png",
    backgroundOverlay: ERA_OVERLAYS.contemporary,
    events: [
      {
        id: "2017-roosevelt",
        type: "html",
        content: null,
        date: "2014-2017",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "380px" },
      },
    ],
  },
  {
    year: 2023,
    description: "The Disclosure Era Begins",
    baseZIndex: 40,
    backgroundImage: "/images/abstract-disclosure.png",
    backgroundOverlay: "rgba(0, 5, 15, 0.4)",
    events: [
      {
        id: "2023-disclosure",
        type: "html",
        content: null,
        date: "July 26th, 2023",
        position: { x: "50%", y: "50%", z: 0 },
        style: { width: "420px" },
      },
    ],
  },
]

export const getEventData = (eventId: string) => {
  const eventMap: Record<
    string,
    { title: string; description: string; classification: string; witnesses: number; location: string }
  > = {
    "1947-roswell": {
      title: "Roswell Incident",
      description:
        "The most famous UFO case - debris recovered from a ranch near Roswell, New Mexico sparked decades of speculation.",
      classification: "CE2",
      witnesses: 50,
      location: "Roswell, New Mexico, USA",
    },
    "1952-washington": {
      title: "Washington D.C. UFO Flap",
      description: "Multiple UFOs tracked on radar over the White House and Capitol Building on consecutive weekends.",
      classification: "Radar",
      witnesses: 100,
      location: "Washington D.C., USA",
    },
    "1964-socorro": {
      title: "Socorro Landing",
      description:
        "Police officer Lonnie Zamora witnessed an egg-shaped craft and two small beings in white coveralls.",
      classification: "CE3",
      witnesses: 1,
      location: "Socorro, New Mexico, USA",
    },
    "1966-westall": {
      title: "Westall UFO Encounter",
      description: "Over 200 students and teachers witnessed a grey saucer descend into a nearby field.",
      classification: "Mass",
      witnesses: 200,
      location: "Melbourne, Victoria, Australia",
    },
    "1967-shag-harbour": {
      title: "Shag Harbour Incident",
      description:
        "Multiple witnesses saw a large object crash into the harbour. The Canadian government officially investigated.",
      classification: "CE2",
      witnesses: 30,
      location: "Shag Harbour, Nova Scotia, Canada",
    },
    "1975-walton": {
      title: "Travis Walton Abduction",
      description:
        "Logger Travis Walton was allegedly abducted in front of six coworkers. He reappeared five days later.",
      classification: "CE4",
      witnesses: 7,
      location: "Snowflake, Arizona, USA",
    },
    "1976-tehran": {
      title: "Tehran UFO Incident",
      description:
        "Iranian F-4 jets scrambled to intercept a UFO. Weapons systems malfunctioned when pilots tried to fire.",
      classification: "Military",
      witnesses: 15,
      location: "Tehran, Iran",
    },
    "1977-colares": {
      title: "Colares UFO Flap",
      description:
        "Bright beams of light attacked residents, leaving burn marks. Brazilian Air Force launched Operation Saucer to investigate.",
      classification: "CE2",
      witnesses: 2000,
      location: "Colares Island, Pará, Brazil",
    },
    "1980-rendlesham": {
      title: "Rendlesham Forest Incident",
      description:
        "US Air Force personnel reported strange lights and a landed triangular craft. Radiation readings were recorded.",
      classification: "CE2",
      witnesses: 40,
      location: "Rendlesham Forest, Suffolk, UK",
    },
    "1984-harbour-mille": {
      title: "Harbour Mille Incident",
      description:
        "Unidentified missile-like objects detected over remote Canadian wilderness, prompting military investigation.",
      classification: "Radar",
      witnesses: 20,
      location: "Harbour Mille, Newfoundland, Canada",
    },
    "1990-belgium": {
      title: "Belgian UFO Wave",
      description:
        "Over 13,000 people reported triangular craft. Belgian Air Force F-16s tracked objects with impossible flight characteristics.",
      classification: "Radar",
      witnesses: 13000,
      location: "Belgium",
    },
    "1994-ariel": {
      title: "Ariel School Encounter",
      description:
        "62 schoolchildren witnessed a silver craft land. Small beings communicated telepathically about environmental destruction.",
      classification: "CE3",
      witnesses: 62,
      location: "Ruwa, Zimbabwe",
    },
    "1997-phoenix": {
      title: "Phoenix Lights",
      description:
        "Thousands observed a massive V-shaped craft spanning over a mile wide, silently gliding over Phoenix.",
      classification: "Mass",
      witnesses: 10000,
      location: "Phoenix, Arizona, USA",
    },
    "2004-nimitz": {
      title: "USS Nimitz Tic Tac Encounter",
      description:
        "Navy pilots encountered a white Tic Tac-shaped object demonstrating extraordinary flight capabilities.",
      classification: "Military",
      witnesses: 20,
      location: "Pacific Ocean, off San Diego, USA",
    },
    "2006-ohare": {
      title: "O'Hare Airport Sighting",
      description:
        "Airport employees observed a disc-shaped object hover over Gate C17, then shoot upward through the clouds.",
      classification: "CE1",
      witnesses: 12,
      location: "Chicago O'Hare Airport, Illinois, USA",
    },
    "2008-stephenville": {
      title: "Stephenville Lights",
      description:
        "Dozens of residents reported seeing large silent objects with bright lights moving at incredible speeds.",
      classification: "Mass",
      witnesses: 50,
      location: "Stephenville, Texas, USA",
    },
    "2015-gimbal": {
      title: "GIMBAL Video Incident",
      description:
        "Navy pilots captured infrared footage of a rotating, saucer-shaped object that seemed to defy physics.",
      classification: "Military",
      witnesses: 6,
      location: "Atlantic Ocean, East Coast USA",
    },
    "2017-roosevelt": {
      title: "USS Roosevelt Encounters",
      description:
        "Navy pilots from the USS Roosevelt reported near-daily UAP encounters over several years during training exercises.",
      classification: "Military",
      witnesses: 100,
      location: "Atlantic Ocean, East Coast USA",
    },
    "2023-disclosure": {
      title: "Congressional UAP Hearings",
      description:
        "David Grusch testified under oath about crash retrieval programs and non-human intelligence. A new era of disclosure begins.",
      classification: "Official",
      witnesses: 3,
      location: "Washington D.C., USA",
    },
  }
  return eventMap[eventId]
}
