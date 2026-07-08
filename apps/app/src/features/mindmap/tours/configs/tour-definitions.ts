import type {TourDefinition} from '../types/tour'

export const ROSWELL_ADVANCED_PROPULSION_TOUR: TourDefinition = {
  id: 'roswell-advanced-propulsion',
  title: 'Roswell & Advanced Propulsion',
  description:
    'Explore the connection between the Roswell crash and theories about recovered exotic propulsion technology, from 1947 to modern reverse-engineering claims.',
  difficulty: 'intermediate',
  estimatedDuration: 50,
  tags: ['roswell', 'propulsion', 'technology', 'reverse-engineering', 'crash-retrieval'],
  waypoints: [
    {
      id: 'roswell-crash-1947',
      title: 'The Roswell Crash (July 1947)',
      dbRef: {
        type: 'events',
        id: 'roswell-crash-1947',
        fallbackQuery: 'Roswell crash debris recovery July 1947 Mac Brazel',
      },
      narrative: `In early July 1947, something crashed on the Foster Ranch near Corona, New Mexico. Ranch foreman Mac Brazel discovered unusual debris that the Army Air Force initially announced was a "flying disc" before quickly retracting the statement. This event would become the cornerstone of crash retrieval and reverse-engineering allegations.`,
      contextRules: {
        temporalWindow: {startYear: 1945, endYear: 1950},
        entityFilters: {types: ['personnel', 'organizations', 'documents']},
        contentRules: [
          'Include military personnel involved in debris recovery',
          'Show initial press releases and retractions',
          'Connect to witnesses like Jesse Marcel and Mac Brazel',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        animationDuration: 1200,
        highlightNodes: ['roswell-crash-1947'],
      },
    },
    {
      id: 'materials-analysis',
      title: 'Exotic Materials Claims',
      dbRef: {
        type: 'testimonies',
        id: 'marcel-debris-testimony',
        fallbackQuery: 'Roswell debris materials memory metal witnesses testimony',
      },
      narrative: `Witnesses described materials with extraordinary properties: metal that would return to its original shape after being crumpled, extremely lightweight structural materials, and fragments with unusual symbols. These descriptions have fueled decades of speculation about exotic alloys and metamaterials.`,
      contextRules: {
        temporalWindow: {startYear: 1947, endYear: 1990},
        entityFilters: {types: ['testimonies', 'personnel', 'artifacts']},
        contentRules: [
          'Include witness descriptions of unusual material properties',
          'Connect to modern metamaterial research',
          'Show chain of custody claims for debris samples',
        ],
      },
      visualSettings: {
        layoutPreference: 'horizontal',
        dimOtherNodes: true,
      },
    },
    {
      id: 'battelle-nitinol',
      title: 'Battelle & Nitinol Connection',
      dbRef: {
        type: 'organizations',
        id: 'battelle-memorial-institute',
        fallbackQuery: 'Battelle Memorial Institute Nitinol shape memory alloy Wright Patterson',
      },
      narrative: `Battelle Memorial Institute developed Nitinol, a shape-memory alloy, in the late 1950s. Researchers have noted parallels between Nitinol's properties and witness descriptions of Roswell debris. The connection between Battelle, Wright-Patterson AFB, and materials analysis has been a subject of ongoing investigation.`,
      contextRules: {
        temporalWindow: {startYear: 1950, endYear: 1970},
        entityFilters: {types: ['organizations', 'personnel', 'documents']},
        contentRules: [
          'Show Battelle contract with Wright-Patterson',
          'Include Nitinol development timeline',
          'Connect to materials science advances post-1947',
        ],
      },
      visualSettings: {
        layoutPreference: 'grid',
      },
    },
    {
      id: 'corso-claims',
      title: "Colonel Corso's Revelations",
      dbRef: {
        type: 'personnel',
        id: 'philip-corso',
        fallbackQuery: 'Philip Corso Day After Roswell reverse engineering technology transfer',
      },
      narrative: `In 1997, Lt. Colonel Philip Corso published "The Day After Roswell," claiming he personally facilitated the transfer of recovered technology to American defense contractors. His allegations include fiber optics, integrated circuits, and night vision technology as derived from Roswell materials.`,
      contextRules: {
        temporalWindow: {startYear: 1990, endYear: 2000},
        entityFilters: {types: ['personnel', 'testimonies', 'organizations']},
        contentRules: [
          'Include Corso biography and military career',
          'Show specific technology transfer claims',
          'Connect to defense contractors mentioned',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        highlightNodes: ['philip-corso'],
      },
    },
    {
      id: 'modern-propulsion-research',
      title: 'Modern Propulsion Mysteries',
      dbRef: {
        type: 'events',
        id: 'uap-propulsion-analysis',
        fallbackQuery: 'UAP propulsion analysis SCU scientific coalition instantaneous acceleration',
      },
      narrative: `Modern UAP investigations focus heavily on observed propulsion characteristics: instantaneous acceleration, trans-medium travel, and apparent anti-gravity effects. Scientists like Dr. Hal Puthoff have proposed theoretical frameworks connecting exotic propulsion to zero-point energy and spacetime metric engineering.`,
      contextRules: {
        temporalWindow: {startYear: 2015, endYear: 2025},
        entityFilters: {types: ['personnel', 'organizations', 'testimonies']},
        contentRules: [
          'Include scientific analysis of UAP propulsion',
          'Show theoretical physics connections',
          'Connect to AATIP/AAWSAP research programs',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        dimOtherNodes: false,
      },
    },
  ],
  metadata: {
    author: 'Ultraterrestrial Research Team',
    createdAt: '2025-01-21',
    version: '1.0',
  },
}

export const UFOS_AND_NUKES_TOUR: TourDefinition = {
  id: 'ufos-and-nukes',
  title: 'UFOs & Nuclear Facilities',
  description:
    'Investigate the documented pattern of UFO activity around nuclear weapons facilities, power plants, and testing sites from the Manhattan Project to modern incidents.',
  difficulty: 'intermediate',
  estimatedDuration: 55,
  tags: ['nuclear', 'military', 'weapons', 'malmstrom', 'testimony'],
  waypoints: [
    {
      id: 'trinity-foo-fighters',
      title: 'The Nuclear Age Begins (1945)',
      dbRef: {
        type: 'events',
        id: 'trinity-test-1945',
        fallbackQuery: 'Trinity test 1945 foo fighters nuclear Manhattan Project UFO',
      },
      narrative: `The atomic age began on July 16, 1945, at Trinity Site in New Mexico. From that moment, numerous accounts describe unusual aerial phenomena near nuclear facilities. The timing of the modern UFO era coinciding with humanity's entry into the nuclear age has been noted by researchers for decades.`,
      contextRules: {
        temporalWindow: {startYear: 1942, endYear: 1947},
        entityFilters: {types: ['events', 'personnel', 'organizations']},
        contentRules: [
          'Include Manhattan Project timeline',
          'Show early nuclear test sites',
          'Connect to early UFO reports near facilities',
        ],
      },
      visualSettings: {
        layoutPreference: 'horizontal',
        animationDuration: 1000,
      },
    },
    {
      id: 'oak-ridge-incidents',
      title: 'Oak Ridge Intrusions (1947-1952)',
      dbRef: {
        type: 'events',
        id: 'oak-ridge-ufo-incidents',
        fallbackQuery: 'Oak Ridge UFO green fireballs security intrusion nuclear facility 1950s',
      },
      narrative: `Oak Ridge, Tennessee, home to uranium enrichment facilities, experienced repeated UFO incursions in the late 1940s and early 1950s. Official documents reveal that security protocols were repeatedly activated due to unidentified aerial objects penetrating restricted airspace.`,
      contextRules: {
        temporalWindow: {startYear: 1947, endYear: 1955},
        entityFilters: {types: ['events', 'documents', 'organizations']},
        contentRules: [
          'Include declassified security reports',
          'Show green fireball connection',
          'Connect to FBI involvement in investigations',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
      },
    },
    {
      id: 'malmstrom-1967',
      title: 'Malmstrom Missile Shutdown (1967)',
      dbRef: {
        type: 'events',
        id: 'malmstrom-afb-1967',
        fallbackQuery: 'Malmstrom AFB 1967 missile shutdown UFO Echo Flight Oscar Flight',
      },
      narrative: `On March 16, 1967, at Malmstrom Air Force Base in Montana, multiple Minuteman ICBMs went offline while security personnel reported a glowing red UFO hovering over the launch facility. Captain Robert Salas and other military personnel have testified publicly about this incident.`,
      contextRules: {
        temporalWindow: {startYear: 1965, endYear: 1970},
        entityFilters: {types: ['personnel', 'testimonies', 'events']},
        contentRules: [
          'Include Robert Salas testimony',
          'Show technical details of missile failures',
          'Connect to other ICBM base incidents',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        highlightNodes: ['malmstrom-afb-1967'],
      },
    },
    {
      id: 'rendlesham-weapons',
      title: 'Rendlesham & Nuclear Storage (1980)',
      dbRef: {
        type: 'events',
        id: 'rendlesham-forest-1980',
        fallbackQuery: 'Rendlesham Forest 1980 RAF Bentwaters nuclear weapons storage binary code',
      },
      narrative: `The Rendlesham Forest incident near RAF Bentwaters/Woodbridge involved multiple witnesses over three nights in December 1980. The base was a nuclear weapons storage facility. Witnesses reported objects directing beams of light at the weapons storage area.`,
      contextRules: {
        temporalWindow: {startYear: 1978, endYear: 1985},
        entityFilters: {types: ['personnel', 'testimonies', 'documents']},
        contentRules: [
          'Include Jim Penniston and John Burroughs testimonies',
          'Show nuclear storage facility connection',
          'Connect to official USAF investigation',
        ],
      },
      visualSettings: {
        layoutPreference: 'grid',
        dimOtherNodes: true,
      },
    },
    {
      id: 'modern-nuclear-incidents',
      title: 'Contemporary Nuclear Site Activity',
      dbRef: {
        type: 'events',
        id: 'modern-nuclear-uap',
        fallbackQuery: 'UAP nuclear power plant drone incursion 2019 2020 Navy reactor',
      },
      narrative: `UFO/UAP activity around nuclear facilities continues to the present day. Recent incidents include the 2019-2020 "drone swarms" over nuclear power plants and the ongoing reports of UAP encountering Navy vessels with nuclear reactors. Congressional hearings have addressed this pattern directly.`,
      contextRules: {
        temporalWindow: {startYear: 2015, endYear: 2025},
        entityFilters: {types: ['events', 'testimonies', 'organizations']},
        contentRules: [
          'Include recent congressional testimony',
          'Show drone swarm incidents at nuclear sites',
          'Connect to Navy nuclear vessel encounters',
        ],
      },
      visualSettings: {
        layoutPreference: 'horizontal',
      },
    },
  ],
  metadata: {
    author: 'Ultraterrestrial Research Team',
    createdAt: '2025-01-21',
    version: '1.0',
  },
}

export const ZETA_RETICULI_TOUR: TourDefinition = {
  id: 'zeta-reticuli',
  title: 'The Zeta Reticuli Connection',
  description:
    'Trace the origin and evolution of the Zeta Reticuli star system connection to UFO phenomena, from Betty Hill\'s star map to modern exoplanet discoveries.',
  difficulty: 'expert',
  estimatedDuration: 45,
  tags: ['extraterrestrial', 'abduction', 'star-map', 'grey-aliens', 'exoplanets'],
  waypoints: [
    {
      id: 'betty-barney-hill',
      title: 'The Hill Abduction (1961)',
      dbRef: {
        type: 'events',
        id: 'hill-abduction-1961',
        fallbackQuery: 'Betty Barney Hill abduction 1961 New Hampshire hypnosis star map',
      },
      narrative: `On September 19, 1961, Betty and Barney Hill reported being abducted by non-human beings while driving through New Hampshire. Under hypnosis, Betty later recalled being shown a star map by her captors. This case would become the prototype for the modern abduction phenomenon.`,
      contextRules: {
        temporalWindow: {startYear: 1959, endYear: 1966},
        entityFilters: {types: ['personnel', 'events', 'testimonies']},
        contentRules: [
          'Include details of the encounter',
          'Show hypnosis session transcripts',
          'Connect to Dr. Benjamin Simon research',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        animationDuration: 1200,
        highlightNodes: ['hill-abduction-1961'],
      },
    },
    {
      id: 'fish-star-map',
      title: "Marjorie Fish's Analysis (1968-1972)",
      dbRef: {
        type: 'personnel',
        id: 'marjorie-fish',
        fallbackQuery: 'Marjorie Fish star map Betty Hill Zeta Reticuli analysis amateur astronomer',
      },
      narrative: `Amateur astronomer Marjorie Fish spent years creating three-dimensional models of nearby stars, eventually identifying Betty Hill's recalled map as potentially depicting a view from Zeta Reticuli, a binary star system 39 light-years from Earth. Her work was published in Astronomy magazine in 1974.`,
      contextRules: {
        temporalWindow: {startYear: 1968, endYear: 1976},
        entityFilters: {types: ['personnel', 'documents']},
        contentRules: [
          'Include Fish methodology and 3D modeling',
          'Show statistical analysis of map correlation',
          'Connect to astronomical community response',
        ],
      },
      visualSettings: {
        layoutPreference: 'horizontal',
      },
    },
    {
      id: 'grey-archetype',
      title: 'The Grey Alien Archetype',
      dbRef: {
        type: 'topics',
        id: 'grey-aliens',
        fallbackQuery: 'Grey aliens Zeta Reticulans appearance description abduction reports EBE',
      },
      narrative: `The beings described in the Hill case established the archetype of the "Grey" alien: small stature, large heads, oversized dark eyes. This description would be echoed in thousands of subsequent reports, becoming the dominant image of extraterrestrial beings in popular culture.`,
      contextRules: {
        temporalWindow: {startYear: 1961, endYear: 2000},
        entityFilters: {types: ['testimonies', 'events', 'personnel']},
        contentRules: [
          'Include consistent physical descriptions across cases',
          'Show evolution of Grey imagery in reports',
          'Connect to other prominent abduction cases',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        dimOtherNodes: true,
      },
    },
    {
      id: 'serpo-claims',
      title: 'Project Serpo Allegations',
      dbRef: {
        type: 'events',
        id: 'project-serpo',
        fallbackQuery: 'Project Serpo Zeta Reticuli exchange program anonymous disclosure EBE',
      },
      narrative: `In 2005, claims emerged about "Project Serpo," an alleged exchange program between the US government and beings from Zeta Reticuli. While highly controversial and unverified, these claims built upon the Hill case mythology and alleged government-ET contact scenarios.`,
      contextRules: {
        temporalWindow: {startYear: 2005, endYear: 2010},
        entityFilters: {types: ['events', 'testimonies', 'documents']},
        contentRules: [
          'Include Serpo disclosure timeline',
          'Show connection to earlier rumors',
          'Present skeptical analysis alongside claims',
        ],
      },
      visualSettings: {
        layoutPreference: 'grid',
      },
    },
    {
      id: 'exoplanet-discoveries',
      title: 'Modern Exoplanet Context',
      dbRef: {
        type: 'events',
        id: 'zeta-reticuli-exoplanets',
        fallbackQuery: 'Zeta Reticuli exoplanets habitable zone TESS Kepler observations',
      },
      narrative: `Modern astronomical observations have revealed fascinating facts about the Zeta Reticuli system. While no confirmed exoplanets have been detected as of 2024, the system remains of interest to researchers. The convergence of UFO lore and legitimate astronomical research creates a unique intersection of speculation and science.`,
      contextRules: {
        temporalWindow: {startYear: 2010, endYear: 2025},
        entityFilters: {types: ['events', 'organizations', 'documents']},
        contentRules: [
          'Include current astronomical data on Zeta Reticuli',
          'Show exoplanet detection methodology',
          'Connect to broader search for extraterrestrial intelligence',
        ],
      },
      visualSettings: {
        layoutPreference: 'horizontal',
      },
    },
  ],
  metadata: {
    author: 'Ultraterrestrial Research Team',
    createdAt: '2025-01-21',
    version: '1.0',
  },
}

export const OLD_GODS_RETURNING_TOUR: TourDefinition = {
  id: 'old-gods-returning',
  title: 'The Old Gods Are Returning',
  description:
    'Explore the ancient astronaut hypothesis and connections between modern UFO phenomena and mythological beings from human history across cultures.',
  difficulty: 'expert',
  estimatedDuration: 60,
  tags: ['ancient-astronauts', 'mythology', 'religion', 'interdimensional', 'consciousness'],
  waypoints: [
    {
      id: 'vimanas-vedas',
      title: 'Vimanas of Ancient India',
      dbRef: {
        type: 'topics',
        id: 'vimanas',
        fallbackQuery: 'Vimanas ancient India Vedas flying machines Sanskrit texts aerial vehicles',
      },
      narrative: `Ancient Sanskrit texts, including the Vedas and Mahabharata, describe "vimanas" - flying vehicles of the gods. These accounts include detailed descriptions of aerial warfare, celestial beings, and technology that mirror modern UFO reports. The parallels have inspired researchers to reconsider ancient mythology through a technological lens.`,
      contextRules: {
        temporalWindow: {startYear: -3000, endYear: 500},
        entityFilters: {types: ['topics', 'documents', 'artifacts']},
        contentRules: [
          'Include Sanskrit text references',
          'Show descriptions of vimana capabilities',
          'Connect to modern UAP characteristics',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        animationDuration: 1500,
      },
    },
    {
      id: 'nephilim-watchers',
      title: 'The Watchers & Nephilim',
      dbRef: {
        type: 'topics',
        id: 'nephilim-watchers',
        fallbackQuery: 'Nephilim Watchers Book of Enoch fallen angels hybrid offspring giants',
      },
      narrative: `The Book of Enoch describes the Watchers, celestial beings who descended to Earth, took human wives, and produced hybrid offspring called the Nephilim. These accounts of non-human beings interbreeding with humanity echo modern abduction reports involving genetic manipulation and hybrid programs.`,
      contextRules: {
        temporalWindow: {startYear: -500, endYear: 500},
        entityFilters: {types: ['topics', 'documents']},
        contentRules: [
          'Include Enochian text analysis',
          'Show parallel mythologies across cultures',
          'Connect to modern hybrid program claims',
        ],
      },
      visualSettings: {
        layoutPreference: 'horizontal',
      },
    },
    {
      id: 'vallee-passport',
      title: "Jacques Vallée's Interdimensional Hypothesis",
      dbRef: {
        type: 'personnel',
        id: 'jacques-vallee',
        fallbackQuery: 'Jacques Vallée Passport to Magonia interdimensional hypothesis folklore UFO',
      },
      narrative: `In "Passport to Magonia" (1969), Jacques Vallée proposed that UFO phenomena share characteristics with historical accounts of fairies, angels, demons, and other supernatural beings. He suggested these might represent contact with an interdimensional intelligence that has interacted with humanity throughout history, adapting its appearance to cultural expectations.`,
      contextRules: {
        temporalWindow: {startYear: 1965, endYear: 1980},
        entityFilters: {types: ['personnel', 'documents', 'testimonies']},
        contentRules: [
          'Include Vallée research methodology',
          'Show pattern connections between eras',
          'Connect folklore to modern encounters',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
        highlightNodes: ['jacques-vallee'],
      },
    },
    {
      id: 'skinwalker-trickster',
      title: 'Skinwalker Ranch & The Trickster',
      dbRef: {
        type: 'events',
        id: 'skinwalker-ranch',
        fallbackQuery: 'Skinwalker Ranch paranormal UFO shapeshifter Navajo trickster NIDS AAWSAP',
      },
      narrative: `Skinwalker Ranch in Utah has been the site of high-strangeness phenomena including UFOs, cryptids, poltergeist activity, and apparitions. The phenomena's apparent intelligence, unpredictability, and connection to Native American lore about the "Skinwalker" trickster spirit suggests something more complex than simple extraterrestrial visitation.`,
      contextRules: {
        temporalWindow: {startYear: 1990, endYear: 2025},
        entityFilters: {types: ['events', 'testimonies', 'organizations']},
        contentRules: [
          'Include NIDS and AAWSAP research',
          'Show variety of phenomena reported',
          'Connect to consciousness-related theories',
        ],
      },
      visualSettings: {
        layoutPreference: 'grid',
        dimOtherNodes: true,
      },
    },
    {
      id: 'pasulka-american-cosmic',
      title: 'American Cosmic & The New Religion',
      dbRef: {
        type: 'personnel',
        id: 'diana-pasulka',
        fallbackQuery: 'Diana Pasulka American Cosmic religion UFO belief scientists invisible college',
      },
      narrative: `Religious scholar Diana Pasulka's "American Cosmic" (2019) examines how belief in UFOs functions as an emerging religious phenomenon. She documents scientists and aerospace insiders who believe they are in contact with non-human intelligence, forming a modern "invisible college" reminiscent of historical secret societies and religious orders.`,
      contextRules: {
        temporalWindow: {startYear: 2015, endYear: 2025},
        entityFilters: {types: ['personnel', 'testimonies', 'events']},
        contentRules: [
          'Include Pasulka research subjects',
          'Show religious and spiritual dimensions',
          'Connect to experiencer phenomenon',
        ],
      },
      visualSettings: {
        layoutPreference: 'radial',
      },
    },
    {
      id: 'disclosure-religious-implications',
      title: 'Disclosure & Religious Paradigm Shift',
      dbRef: {
        type: 'events',
        id: 'disclosure-religious-impact',
        fallbackQuery: 'UFO disclosure religious implications Vatican extraterrestrial life theology',
      },
      narrative: `As government disclosure accelerates, religious institutions prepare for potential paradigm shifts. The Vatican has stated that belief in extraterrestrial life is compatible with Catholic faith. If the "old gods" are returning, humanity faces not just a scientific revolution, but a religious and philosophical transformation of unprecedented scope.`,
      contextRules: {
        temporalWindow: {startYear: 2020, endYear: 2025},
        entityFilters: {types: ['organizations', 'testimonies', 'events']},
        contentRules: [
          'Include religious institution statements',
          'Show philosophical implications of contact',
          'Connect to ongoing disclosure efforts',
        ],
      },
      visualSettings: {
        layoutPreference: 'horizontal',
      },
    },
  ],
  metadata: {
    author: 'Ultraterrestrial Research Team',
    createdAt: '2025-01-21',
    version: '1.0',
  },
}

/**
 * "The Improbable Moon" — hollow/artificial Moon hypothesis walked as an
 * evidence ladder, strangeness ascending, every anomaly presented beside its
 * conventional account. Spec + DB coverage probe:
 * docs/plans/2026-07-08-hollow-moon-tour-spec.md
 */
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
      visualSettings: {
        layoutPreference: 'radial',
        animationDuration: 1200,
      },
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
      visualSettings: {
        layoutPreference: 'horizontal',
      },
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
      visualSettings: {
        layoutPreference: 'radial',
        dimOtherNodes: true,
      },
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
      visualSettings: {
        layoutPreference: 'horizontal',
      },
    },
    {
      id: 'anomaly-ledger',
      title: 'The Anomaly Ledger',
      dbRef: {
        type: 'topics',
        id: 'lunar-anomalies',
        fallbackQuery: 'moon landing lunar anomalies density orbit eclipse',
      },
      narrative: `The case is cumulative, so audit the ledger: mean density of 3.34 g/cm³ against Earth's 5.51 with a proportionally tiny core; mass concentrations that perturb every low lunar orbit; a diameter exactly ~1/400th of the Sun's at ~1/400th the distance, producing the only perfect eclipses in the known solar system; a tidally locked far side we never see. Each item has a conventional account. What the artificial-Moon hypothesis really argues is that the stack of coincidences demands explanation — a probabilistic claim, and it should be weighed as one.`,
      contextRules: {
        temporalWindow: {startYear: 1959, endYear: 2015},
        entityFilters: {types: ['topics', 'events', 'documents']},
        contentRules: [
          'Include GRAIL and lunar-orbiter mapping records where present',
          'Show each anomaly beside its conventional explanation',
          'Frame the hypothesis as probabilistic, not evidentiary',
        ],
      },
      visualSettings: {
        layoutPreference: 'grid',
      },
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
      visualSettings: {
        layoutPreference: 'radial',
        dimOtherNodes: true,
      },
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
      visualSettings: {
        layoutPreference: 'horizontal',
      },
    },
  ],
  metadata: {
    author: 'Ultraterrestrial Research Team',
    createdAt: '2026-07-08',
    version: '1.0',
  },
}

export const ALL_TOURS: TourDefinition[] = [
  ROSWELL_ADVANCED_PROPULSION_TOUR,
  UFOS_AND_NUKES_TOUR,
  ZETA_RETICULI_TOUR,
  OLD_GODS_RETURNING_TOUR,
  IMPROBABLE_MOON_TOUR,
]

export const TOUR_REGISTRY: Record<string, TourDefinition> = {
  'roswell-advanced-propulsion': ROSWELL_ADVANCED_PROPULSION_TOUR,
  'ufos-and-nukes': UFOS_AND_NUKES_TOUR,
  'zeta-reticuli': ZETA_RETICULI_TOUR,
  'old-gods-returning': OLD_GODS_RETURNING_TOUR,
  'improbable-moon': IMPROBABLE_MOON_TOUR,
}
