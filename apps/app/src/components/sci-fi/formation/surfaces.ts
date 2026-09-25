/**
 * Formation° surface presets + flow-field generators.
 * Ported from the vanilla demo (ui.html); API shaped for Formation.tsx.
 */
import { perlin3 } from './perlin'

export type SurfaceId =
  | 'cellular'
  | 'circular'
  | 'spiral'
  | 'network'
  | 'atrophy'
  | 'fundament'
  | 'monde'

/** Mutates `field` in place and returns it. Optional `randomize` re-seeds params. */
export type GenerateFlowField = (
  field: Float32Array,
  rows: number,
  columns: number,
  randomize?: boolean,
) => Float32Array

export interface SurfaceConfig {
  title: string
  rows: number
  columns: number
  particleCount: number
  pointSize: number
  palette: string[]
  randomize: boolean
  maxFlowFieldIterations: number
  maxColorIterations: number
  background: string
  generateFlowField: GenerateFlowField
}

const PARTICLE_COUNT = 1024
const POINT_SIZE = 16
const MAX_COLOR_ITERATIONS = 500
const BACKGROUND = '#000'

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min
const randomPick = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]

const NETWORK_ANGLES = [0, 90, 180, 270, 360].map((d) => (Math.PI / 180) * d)

const cellular =
  (amplitude: number): GenerateFlowField =>
  (field, rows, columns) => {
    let rowNoise = 0
    let i = 0
    for (let y = 0; y < rows; y++) {
      let colNoise = 0
      for (let x = 0; x < columns; x++) {
        field[i++] = perlin3(colNoise, rowNoise, Math.random()) * amplitude
        colNoise += 0.01
      }
      rowNoise += 0.01
    }
    return field
  }

const circular =
  (zoom: number, curve: number, curveJitter: number): GenerateFlowField =>
  (field, rows, columns, shouldRandomize = false) => {
    const z = shouldRandomize ? zoom + randomRange(-0.01, 0.01) : zoom
    const c = shouldRandomize ? curve + randomRange(-curveJitter, curveJitter) : curve
    let i = 0
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        field[i++] = Math.cos(x * z) + Math.sin(y * z) * c
      }
    }
    return field
  }

const atrophy =
  (curve: number): GenerateFlowField =>
  (field, rows, columns) => {
    const amplitude = curve + randomRange(-0.25, 0.25)
    const step = randomRange(0.005, 0.015)
    let i = 0
    for (let y = 0; y < rows; y++) {
      let a = 0
      for (let x = 0; x < columns; x++) {
        field[i++] = perlin3(a, step, x + y * step) * amplitude
        a += step
      }
    }
    return field
  }

const network: GenerateFlowField = (field, rows, columns) => {
  let i = 0
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      field[i++] = randomPick(NETWORK_ANGLES)
    }
  }
  return field
}

const base = (
  partial: Omit<
    SurfaceConfig,
    'particleCount' | 'pointSize' | 'maxColorIterations' | 'background' | 'randomize'
  > & { randomize?: boolean },
): SurfaceConfig => ({
  particleCount: PARTICLE_COUNT,
  pointSize: POINT_SIZE,
  maxColorIterations: MAX_COLOR_ITERATIONS,
  background: BACKGROUND,
  randomize: partial.randomize ?? true,
  ...partial,
})

export const SURFACES: Record<SurfaceId, SurfaceConfig> = {
  cellular: base({
    title: 'Cellular',
    rows: 256,
    columns: 256,
    maxFlowFieldIterations: 500,
    palette: ['#655643', '#80bca3', '#f6f7bd', '#e6ac27', '#bf4d28'],
    generateFlowField: cellular(10),
  }),
  circular: base({
    title: 'Circular',
    rows: 256,
    columns: 256,
    maxFlowFieldIterations: 500,
    palette: ['#dad6ca', '#1bb0ce', '#4f8699', '#6a5e72', '#563444'],
    generateFlowField: circular(0.015, 3, 1),
  }),
  spiral: base({
    title: 'Spiral',
    rows: 256,
    columns: 256,
    maxFlowFieldIterations: 500,
    palette: ['#fffbb7', '#a6f6af', '#66b6ab', '#5b7c8d', '#4f2958'],
    generateFlowField: circular(0.015, -3, 0.25),
  }),
  network: base({
    title: 'Network',
    rows: 32,
    columns: 16,
    maxFlowFieldIterations: 1000,
    palette: ['#fad089', '#ff9c5b', '#f5634a', '#ed303c', '#3b8183'],
    generateFlowField: network,
  }),
  atrophy: base({
    title: 'Atrophy',
    rows: 256,
    columns: 256,
    maxFlowFieldIterations: 750,
    palette: ['#774f38', '#e08e79', '#f1d4af', '#ece5ce', '#c5e0dc'],
    generateFlowField: atrophy(8),
  }),
  fundament: base({
    title: 'Fundament',
    rows: 256,
    columns: 256,
    maxFlowFieldIterations: 5,
    palette: ['#1b325f', '#9cc4e4', '#e9f2f9', '#3a89c9', '#f26c4f'],
    generateFlowField: circular(0.015, 8, 1),
  }),
  monde: base({
    title: 'Monde',
    rows: 256,
    columns: 256,
    maxFlowFieldIterations: 5,
    palette: ['#9cddc8', '#bfd8ad', '#ddd9ab', '#f7af63', '#633d2e'],
    generateFlowField: atrophy(8),
  }),
}
