import type { HudHotspotRow, HudMetric, HudPositionLogRow } from './types'

export const SAMPLE_SIGHTINGS_METRICS: ReadonlyArray<HudMetric> = [
  { label: 'TOTAL SIGHTINGS', value: '1,284' },
  { label: 'GEOCODED', value: '96.2%' },
  { label: 'HIGH CONFIDENCE', value: '412' },
  { label: 'ACTIVE WINDOW', value: '24H' },
]

export const SAMPLE_HOTSPOTS: ReadonlyArray<HudHotspotRow> = [
  { name: 'Roswell, NM', value: '48', lat: 33.39, lon: -104.52 },
  { name: 'Phoenix, AZ', value: '36', lat: 33.45, lon: -112.07 },
  { name: 'Hudson Valley', value: '29', lat: 41.7, lon: -73.94 },
  { name: 'Rendlesham', value: '22', lat: 52.09, lon: 1.34 },
  { name: 'Belgium Wave', value: '18', lat: 50.85, lon: 4.35 },
  { name: 'Stephenville', value: '15', lat: 32.22, lon: -98.2 },
  { name: "Chicago O'Hare", value: '12', lat: 41.97, lon: -87.9 },
  { name: 'Tokyo Bay', value: '9', lat: 35.45, lon: 139.65 },
]

export const SAMPLE_POSITION_LOG: ReadonlyArray<HudPositionLogRow> = [
  { time: '2026-07-18 20:01:12', x: '-104.52', y: '33.39', z: '1.12' },
  { time: '2026-07-18 19:44:03', x: '-112.07', y: '33.45', z: '0.84' },
  { time: '2026-07-18 19:12:48', x: '-73.94', y: '41.70', z: '0.61' },
  { time: '2026-07-18 18:55:21', x: '1.34', y: '52.09', z: '0.42' },
  { time: '2026-07-18 18:22:09', x: '4.35', y: '50.85', z: '0.38' },
]
