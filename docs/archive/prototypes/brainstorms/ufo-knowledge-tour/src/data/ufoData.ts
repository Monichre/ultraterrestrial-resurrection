// UFO Knowledge Graph Sample Data
import { KGNode, KGEdge } from '../types/graph';

export const ufoNodes: KGNode[] = [
  // Events
  {
    id: 'roswell-1947',
    type: 'event',
    name: 'Roswell Incident (1947)',
    description: 'One of the most famous UFO incidents where an object crashed near Roswell, New Mexico. The military initially stated they recovered a "flying disc," then retracted and claimed it was a weather balloon.',
    properties: {
      date: 'July 4, 1947',
      location: 'Roswell, New Mexico',
      witnesses: 1,
      duration: 'Unknown',
      classification: 'Unknown',
      evidence: ['Debris field', 'Witness testimony', 'Military documents'],
      significance: 9,
      tags: ['classic', 'military', 'crash', 'cover-up']
    },
    connections: ['area-51', 'proj-blue-book', 'majestic-12', 'ufo-research-org'],
    visual: { x: 200, y: 100 }
  },
  {
    id: 'phoenix-lights-1997',
    type: 'event',
    name: 'Phoenix Lights (1997)',
    description: 'A massive V-shaped formation of lights was seen by thousands over Phoenix, Arizona. The lights hovered for hours and were silent. Military confirmed they had flares, but many witness accounts differ.',
    properties: {
      date: 'March 13, 1997',
      location: 'Phoenix, Arizona',
      witnesses: 700,
      duration: '4 hours',
      classification: 'Unknown',
      evidence: ['Video recordings', 'Witness testimony', 'Radar data'],
      significance: 8,
      tags: ['mass-sighting', 'military', 'formation']
    },
    connections: ['area-51', 'proj-blue-book'],
    visual: { x: 350, y: 150 }
  },
  {
    id: 'belgian-wave-1989',
    type: 'event',
    name: 'Belgian UFO Wave (1989-1990)',
    description: 'A series of sightings of large, silent, triangular UFOs with red lights. Belgian Air Force attempted to intercept with F-16s. Multiple radar confirmations of unknown objects.',
    properties: {
      date: 'November 1989 - April 1990',
      location: 'Belgium',
      witnesses: 1200,
      duration: 'Varies',
      classification: 'Unknown',
      evidence: ['Radar data', 'F-16 chase', 'Video footage'],
      significance: 7,
      tags: ['triangular', 'military-intercept', 'radar']
    },
    connections: ['military-ufo-programs', 'triangular-crafts'],
    visual: { x: 500, y: 200 }
  },
  {
    id: 'chicago-1947',
    type: 'event',
    name: 'Kenneth Arnold Sighting (1947)',
    description: 'Pilot Kenneth Arnold spotted 9闪亮的, crescent-shaped objects flying at incredible speeds near Mount Rainier. His description led to the term "flying saucer" being coined by media.',
    properties: {
      date: 'June 24, 1947',
      location: 'Mount Rainier, Washington',
      witnesses: 1,
      duration: '3 minutes',
      classification: 'Unknown',
      evidence: ['Witness testimony'],
      significance: 10,
      tags: ['classic', 'pilot', 'flying-saucer-term']
    },
    connections: ['flying-saucer-concept', 'media-coverage', 'early-ufo-wave'],
    visual: { x: 150, y: 250 }
  },
  {
    id: 'rendlesham-forest-1980',
    type: 'event',
    name: 'Rendlesham Forest Incident (1980)',
    description: 'Known as "Britain\'s Roswell," USAF personnel at RAF Woodbridge witnessed strange lights in nearby forest. A craft was reportedly seen on multiple nights, leaving landing marks.',
    properties: {
      date: 'December 26-27, 1980',
      location: 'Suffolk, England',
      witnesses: 10,
      duration: 'Multiple nights',
      classification: 'Category I',
      evidence: ['Landing traces', 'Radiation readings', 'Witness testimony'],
      significance: 9,
      tags: ['military', 'craft-landing', 'british-ufo']
    },
    connections: ['military-ufo-programs', 'craft-specifications', 'ufo-research-org'],
    visual: { x: 550, y: 100 }
  },

  // Locations
  {
    id: 'area-51',
    type: 'location',
    name: 'Area 51 / Groom Lake',
    description: 'A highly classified US Air Force facility in Nevada. Rumored to house crashed UFOs and reverse-engineering programs. Site of many UFO sightings and whistleblower claims.',
    properties: {
      location: 'Nevada, USA',
      classification: 'Classified',
      evidence: ['Satellite imagery', 'Witness accounts', 'PAVE-PAWS radar'],
      significance: 10,
      tags: ['classified', 'military', 'reverse-engineering', 'conspiracy']
    },
    connections: ['roswell-1947', 'phoenix-lights-1997', 'majestic-12', 'bob-lazar'],
    visual: { x: 300, y: 300 }
  },
  {
    id: 'ufo-research-org',
    type: 'location',
    name: 'MUFON Headquarters',
    description: 'Mutual UFO Network - largest UFO investigation organization in the world with thousands of investigators worldwide.',
    properties: {
      location: 'Colorado, USA',
      classification: 'Research Organization',
      evidence: ['Annual reports', 'Case database', 'Investigator network'],
      significance: 7,
      tags: ['research', 'investigation', 'database']
    },
    connections: ['roswell-1947', 'rendlesham-forest-1980'],
    visual: { x: 450, y: 280 }
  },

  // Entities
  {
    id: 'majestic-12',
    type: 'entity',
    name: 'Majestic-12 (MJ-12)',
    description: 'Alleged secret government group formed after the Roswell incident to handle recovered alien technology and bodies. Documents claiming to be MJ-12 have surfaced but authenticity is disputed.',
    properties: {
      classification: 'Alleged',
      evidence: ['MJ-12 documents', 'Whistleblower testimony'],
      significance: 9,
      tags: ['cover-up', 'secret-program', 'alien-bodies']
    },
    connections: ['roswell-1947', 'area-51', 'government-coverup'],
    visual: { x: 400, y: 50 }
  },
  {
    id: 'bob-lazar',
    type: 'entity',
    name: 'Bob Lazar',
    description: 'Whistleblower who claimed to have worked at S-4 (near Area 51) reverse-engineering alien spacecraft. His claims include Element 115 and saucer propulsion systems.',
    properties: {
      date: '1989-present',
      classification: 'Whistleblower',
      evidence: ['Media appearances', 'Documentation', 'Element 115 claims'],
      significance: 8,
      tags: ['whistleblower', 's-4', 'element-115', 'alien-tech']
    },
    connections: ['area-51', 'alien-physics', 'government-coverup'],
    visual: { x: 250, y: 400 }
  },
  {
    id: 'proj-blue-book',
    type: 'entity',
    name: 'Project Blue Book',
    description: 'US Air Force study of UFO reports from 1952-1969. Investigated over 12,000 sightings. Officially concluded that UFOs posed no threat and had conventional explanations.',
    properties: {
      date: '1952-1969',
      location: 'Wright-Patterson AFB, Ohio',
      classification: 'Military Program',
      evidence: ['Case files', 'Statistical analysis', 'Final report'],
      significance: 7,
      tags: ['military', 'research', 'official-study']
    },
    connections: ['roswell-1947', 'phoenix-lights-1997', 'airforce-involvement'],
    visual: { x: 500, y: 350 }
  },

  // Concepts
  {
    id: 'flying-saucer-concept',
    type: 'concept',
    name: 'Flying Saucer Theory',
    description: 'The popular concept of disc-shaped spacecraft popularized after Kenneth Arnold\'s sighting. Became the iconic image of UFOs in popular culture.',
    properties: {
      origin: '1947',
      significance: 10,
      tags: ['iconic', 'popular-culture', 'disc-shape']
    },
    connections: ['chicago-1947', 'early-ufo-wave', 'media-coverage'],
    visual: { x: 100, y: 350 }
  },
  {
    id: 'government-coverup',
    type: 'concept',
    name: 'Government Cover-up Theory',
    description: 'The belief that governments, especially the US, have concealed evidence of extraterrestrial contact. Supported by testimony from whistleblowers and document leaks.',
    properties: {
      significance: 9,
      tags: ['conspiracy', 'classification', 'transparency']
    },
    connections: ['majestic-12', 'bob-lazar', 'area-51', 'classification-system'],
    visual: { x: 350, y: 400 }
  },
  {
    id: 'military-ufo-programs',
    type: 'concept',
    name: 'Military UFO Programs',
    description: 'Various government programs investigating UFO phenomena including Project Blue Book, AATIP (Advanced Aerospace Threat Identification Program), and others.',
    properties: {
      significance: 8,
      tags: ['military', 'research', 'classified', 'aatip']
    },
    connections: ['belgian-wave-1989', 'rendlesham-forest-1980', 'proj-blue-book', 'aatip'],
    visual: { x: 600, y: 300 }
  },
  {
    id: 'triangular-crafts',
    type: 'concept',
    name: 'Triangular UFOs',
    description: 'Large, silent, triangular craft with lights at vertices observed worldwide. Often associated with military activity. First widely documented in Belgium wave.',
    properties: {
      significance: 7,
      tags: ['triangle', 'black-project', 'modern-ufo']
    },
    connections: ['belgian-wave-1989', 'craft-specifications'],
    visual: { x: 650, y: 150 }
  },
  {
    id: 'early-ufo-wave',
    type: 'concept',
    name: '1947 UFO Wave',
    description: 'Surge in UFO sightings following the Kenneth Arnold sighting and Roswell incident. Many classic cases from this period defined the field of UFOlogy.',
    properties: {
      date: '1947',
      significance: 8,
      tags: ['classic', 'wave', 'founding-period']
    },
    connections: ['chicago-1947', 'roswell-1947', 'flying-saucer-concept'],
    visual: { x: 200, y: 200 }
  },
  {
    id: 'media-coverage',
    type: 'concept',
    name: 'Media Coverage Impact',
    description: 'The role of media in shaping UFO narratives, from newspapers to TV to internet. Includes responsible journalism and sensationalism.',
    properties: {
      significance: 6,
      tags: ['media', 'culture', 'communication']
    },
    connections: ['chicago-1947', 'flying-saucer-concept'],
    visual: { x: 50, y: 300 }
  },
  {
    id: 'alien-physics',
    type: 'concept',
    name: 'Alien Physics & Technology',
    description: 'Theoretical physics related to alien propulsion, Element 115, gravitational manipulation, and other advanced concepts from whistleblower accounts.',
    properties: {
      significance: 7,
      tags: ['physics', 'technology', 'element-115', 'propulsion']
    },
    connections: ['bob-lazar', 'craft-specifications'],
    visual: { x: 150, y: 450 }
  },
  {
    id: 'craft-specifications',
    type: 'concept',
    name: 'Craft Specifications',
    description: 'Documented descriptions and alleged schematics of UFO craft, including propulsion systems, materials, and performance characteristics.',
    properties: {
      significance: 7,
      tags: ['technology', 'engineering', 'reverse-engineering']
    },
    connections: ['rendlesham-forest-1980', 'bob-lazar', 'triangular-crafts', 'alien-physics'],
    visual: { x: 300, y: 450 }
  },
  {
    id: 'classification-system',
    type: 'concept',
    name: 'UFO Classification Systems',
    description: 'Various systems used to categorize UFO sightings, from Project Blue Book\'s classification to Hynek\'s classification to modern classification schemes.',
    properties: {
      significance: 5,
      tags: ['classification', 'standards', 'research']
    },
    connections: ['proj-blue-book', 'ufo-research-org'],
    visual: { x: 550, y: 400 }
  },
  {
    id: 'aatip',
    type: 'concept',
    name: 'AATIP (Advanced Aerospace Threat Identification Program)',
    description: 'Secret US government program that studied UFOs from 2007-2012. Released videos of UAP (Unidentified Aerial Phenomena) encounters.',
    properties: {
      date: '2007-2012',
      significance: 8,
      tags: ['military', 'modern', 'uap', 'government-confirmation']
    },
    connections: ['military-ufo-programs', 'gov-uap-confirmation'],
    visual: { x: 700, y: 250 }
  },
  {
    id: 'gov-uap-confirmation',
    type: 'concept',
    name: 'Government UAP Confirmation',
    description: 'Recent official acknowledgment by US government of UFO/UAP phenomena as genuine unknowns requiring investigation.',
    properties: {
      date: '2017-present',
      significance: 9,
      tags: ['government', 'confirmation', 'transparency', 'modern']
    },
    connections: ['aatip', 'military-ufo-programs', 'classification-system'],
    visual: { x: 750, y: 350 }
  },
  {
    id: 'airforce-involvement',
    type: 'concept',
    name: 'Air Force Involvement in UFO Investigation',
    description: 'The primary role of the US Air Force in investigating UFO reports, operating Project Sign, Project Grudge, and Project Blue Book.',
    properties: {
      significance: 6,
      tags: ['military', 'investigation', 'historical']
    },
    connections: ['proj-blue-book'],
    visual: { x: 600, y: 450 }
  }
];

export const ufoEdges: KGEdge[] = [
  // Event connections
  { source: 'roswell-1947', target: 'area-51', relationship: 'connected to', weight: 0.9 },
  { source: 'roswell-1947', target: 'proj-blue-book', relationship: 'investigated by', weight: 0.8 },
  { source: 'roswell-1947', target: 'majestic-12', relationship: 'involved', weight: 0.95 },
  { source: 'phoenix-lights-1997', target: 'area-51', relationship: 'near', weight: 0.7 },
  { source: 'phoenix-lights-1997', target: 'proj-blue-book', relationship: 'investigated', weight: 0.6 },
  { source: 'belgian-wave-1989', target: 'military-ufo-programs', relationship: 'observed by', weight: 0.8 },
  { source: 'belgian-wave-1989', target: 'triangular-crafts', relationship: 'featured', weight: 0.9 },
  { source: 'chicago-1947', target: 'flying-saucer-concept', relationship: 'spawned', weight: 1.0 },
  { source: 'chicago-1947', target: 'media-coverage', relationship: 'reported by', weight: 0.9 },
  { source: 'chicago-1947', target: 'early-ufo-wave', relationship: 'start of', weight: 0.9 },
  { source: 'rendlesham-forest-1980', target: 'military-ufo-programs', relationship: 'involved', weight: 0.8 },
  { source: 'rendlesham-forest-1980', target: 'craft-specifications', relationship: 'observed', weight: 0.7 },

  // Entity connections
  { source: 'majestic-12', target: 'roswell-1947', relationship: 'responded to', weight: 0.9 },
  { source: 'majestic-12', target: 'area-51', relationship: 'operates', weight: 0.85 },
  { source: 'majestic-12', target: 'government-coverup', relationship: 'part of', weight: 1.0 },
  { source: 'bob-lazar', target: 'area-51', relationship: 'worked at', weight: 0.9 },
  { source: 'bob-lazar', target: 'alien-physics', relationship: 'revealed', weight: 0.8 },
  { source: 'bob-lazar', target: 'government-coverup', relationship: 'exposed', weight: 0.85 },
  { source: 'proj-blue-book', target: 'roswell-1947', relationship: 'investigated', weight: 0.7 },
  { source: 'proj-blue-book', target: 'classification-system', relationship: 'created', weight: 0.8 },
  { source: 'proj-blue-book', target: 'airforce-involvement', relationship: 'part of', weight: 0.9 },

  // Concept connections
  { source: 'flying-saucer-concept', target: 'chicago-1947', relationship: 'originated from', weight: 0.95 },
  { source: 'flying-saucer-concept', target: 'media-coverage', relationship: 'spread by', weight: 0.85 },
  { source: 'flying-saucer-concept', target: 'early-ufo-wave', relationship: 'part of', weight: 0.8 },
  { source: 'government-coverup', target: 'majestic-12', relationship: 'involves', weight: 0.9 },
  { source: 'government-coverup', target: 'bob-lazar', relationship: 'evidenced by', weight: 0.8 },
  { source: 'government-coverup', target: 'classification-system', relationship: 'uses', weight: 0.7 },
  { source: 'military-ufo-programs', target: 'proj-blue-book', relationship: 'preceded', weight: 0.7 },
  { source: 'military-ufo-programs', target: 'aatip', relationship: 'includes', weight: 0.8 },
  { source: 'triangular-crafts', target: 'belgian-wave-1989', relationship: 'documented in', weight: 0.9 },
  { source: 'triangular-crafts', target: 'craft-specifications', relationship: 'described in', weight: 0.75 },
  { source: 'early-ufo-wave', target: 'chicago-1947', relationship: 'started with', weight: 0.9 },
  { source: 'early-ufo-wave', target: 'roswell-1947', relationship: 'includes', weight: 0.8 },
  { source: 'alien-physics', target: 'bob-lazar', relationship: 'described by', weight: 0.9 },
  { source: 'alien-physics', target: 'craft-specifications', relationship: 'part of', weight: 0.7 },
  { source: 'craft-specifications', target: 'rendlesham-forest-1980', relationship: 'based on', weight: 0.7 },
  { source: 'craft-specifications', target: 'triangular-crafts', relationship: 'includes', weight: 0.65 },
  { source: 'classification-system', target: 'proj-blue-book', relationship: 'developed by', weight: 0.8 },
  { source: 'classification-system', target: 'ufo-research-org', relationship: 'used by', weight: 0.7 },
  { source: 'aatip', target: 'military-ufo-programs', relationship: 'part of', weight: 0.9 },
  { source: 'gov-uap-confirmation', target: 'aatip', relationship: 'revealed', weight: 0.85 },
  { source: 'gov-uap-confirmation', target: 'military-ufo-programs', relationship: 'confirms', weight: 0.8 },
  { source: 'gov-uap-confirmation', target: 'classification-system', relationship: 'requires', weight: 0.6 },
  { source: 'airforce-involvement', target: 'proj-blue-book', relationship: 'operated', weight: 0.9 }
];

// Tour configuration
export const defaultTourConfig = {
  title: "Journey Through UFO History",
  description: "Explore the most significant events, locations, and concepts that shaped our understanding of UFO phenomena.",
  estimatedDuration: "15-20 minutes",
  startNodeId: 'chicago-1947'
};

// Pre-defined tour paths
export const tourPaths = {
  introduction: ['chicago-1947', 'early-ufo-wave', 'flying-saucer-concept'],
  classicCases: ['roswell-1947', 'rendlesham-forest-1980', 'phoenix-lights-1997'],
  modernEra: ['belgian-wave-1989', 'aatip', 'gov-uap-confirmation'],
  conspiracy: ['majestic-12', 'bob-lazar', 'area-51', 'government-coverup'],
  research: ['proj-blue-book', 'ufo-research-org', 'classification-system']
};

// Get connected nodes
export function getConnectedNodes(nodeId: string): KGNode[] {
  const node = ufoNodes.find(n => n.id === nodeId);
  if (!node) return [];
  return node.connections
    .map(id => ufoNodes.find(n => n.id === id))
    .filter((n): n is KGNode => n !== undefined);
}

// Get node by ID
export function getNodeById(nodeId: string): KGNode | undefined {
  return ufoNodes.find(n => n.id === nodeId);
}

// Get edges for node
export function getEdgesForNode(nodeId: string): KGEdge[] {
  return ufoEdges.filter(e => e.source === nodeId || e.target === nodeId);
}

// Create tour path
export function createTourPath(startNodeId: string, maxNodes: number = 8): string[] {
  const path: string[] = [];
  const visited = new Set<string>();

  let currentId: string | undefined = startNodeId;

  while (currentId && path.length < maxNodes) {
    if (visited.has(currentId)) break;

    path.push(currentId);
    visited.add(currentId);

    const node = getNodeById(currentId);
    if (!node || node.connections.length === 0) break;

    // Find next unvisited connection
    const nextConnection = node.connections.find(id => !visited.has(id));
    currentId = nextConnection;
  }

  return path;
}