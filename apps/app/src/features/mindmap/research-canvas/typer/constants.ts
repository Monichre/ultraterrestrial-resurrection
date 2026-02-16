import { Radiation, MapPin, Rocket, Landmark } from 'lucide-react'

export const TYPER_ITEMS = [
  { id: 1, icon: Radiation, name: 'UFO & Nukes', command: 'Start guided tour: UFO & Nuclear Connection', description: 'Military encounters near nuclear sites' },
  { id: 2, icon: MapPin, name: 'Roswell', command: 'Start guided tour: Roswell - Where It All Began', description: 'The 1947 incident that started it all' },
  { id: 3, icon: Rocket, name: 'Mars Origins', command: 'Start guided tour: Mars Origins Theory', description: 'Extraterrestrial life hypothesis' },
  { id: 4, icon: Landmark, name: 'Ancient Archaeology', command: 'Start guided tour: Ancient Archaeology', description: 'Evidence from ancient civilizations' },
] as const

export const CARD_VARIANTS = {
  initial: (index: number) => ({
    y: index * 8,
    scale: 1 - (3 - index) * 0.03,
    x: 0,
    rotate: 0,
    zIndex: index,
  }),
  hover: (index: number) => ({
    x: index === 0 ? -200 : index === 1 ? -70 : index === 2 ? 70 : 200,
    y: -12,
    rotate: index === 0 ? -6 : index === 1 ? -2 : index === 2 ? 2 : 6,
    scale: 1.05,
    zIndex: 4,
  }),
  active: (index: number) => ({
    x: index === 0 ? 120 : index === 1 ? 40 : index === 2 ? -40 : -120,
    y: index === 3 ? 0 : -20,
    rotate: index === 0 ? 6 : index === 1 ? 2 : index === 2 ? -2 : -6,
    scale: 0.85,
    zIndex: index,
  }),
  pinned: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 0.8,
    zIndex: 10,
  },
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
}

export const ENHANCED_MESSAGES = [
  {
    id: 'guided-tour',
    title: 'Guided Tour',
    description: 'Follow curated pathways through UFO history and key events',
  },
  {
    id: 'deep-research',
    title: 'Deep Research',
    description: 'Dive deep into specific cases, witness accounts, and documentation',
  },
  {
    id: 'explore-network',
    title: 'Explore Network',
    description: 'Navigate the interconnected web of UFO phenomena and research',
  },
] as const

export const ANIMATION_CONFIG = {
  initialDelay: 100,
  stateDelays: [500, 1500, 1000, 1500],
  typeSpeed: 60,
  initialWidth: 600,
  expandedWidth: 600,
} as const
