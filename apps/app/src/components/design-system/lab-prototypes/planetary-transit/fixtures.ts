export const PLANETARY_HOUSES = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const

export const PLANETARY_META = {
  orbitalId: 'TRANSIT.09',
  constellation: 'ASCENDANT',
  title: 'Planetary Alignment',
  subtitle: 'Spatial Mapping // Sector 12',
  activeHouse: 'VIII. Scorpio',
  degree: "24° 12' 05\"",
  aspect: 'Trine / Neptune',
  dataStream: [
    'OBSERVATORY: PALOMAR_RECURSIVE',
    'Z-AXIS: -1.244.02',
    'VELOCITY: 29.78 KM/S',
    'SIGNAL: CRYPTIC_STEADY',
  ],
} as const

export const PLANETARY_FRAME = {
  width: 400,
  height: 867,
} as const
