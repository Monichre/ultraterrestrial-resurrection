export type DiagnosticMode = 'Topology' | 'Wireframe' | 'Metrics'

export interface ActiveNode {
  label: string
  value: string
  idle?: boolean
}

export interface LoadMeter {
  label: string
  percent: number
  tone: 'high' | 'mid' | 'low'
}

export interface TelemetryEntry {
  time: string
  message: string
  state: 'past' | 'active' | 'pending'
}

export interface LayerAnnotation {
  id: string
  title: string
  detail: string
  side: 'start' | 'end'
}

export const DIAGNOSTIC_MODES: DiagnosticMode[] = ['Topology', 'Wireframe', 'Metrics']

export const ACTIVE_NODES: ActiveNode[] = [
  { label: 'Primary', value: '0x8A' },
  { label: 'Secondary', value: '0x2F' },
  { label: 'Auxiliary', value: 'IDLE', idle: true },
]

export const LOAD_METERS: LoadMeter[] = [
  { label: 'Core', percent: 78, tone: 'high' },
  { label: 'Memory', percent: 42, tone: 'mid' },
  { label: 'Thermal', percent: 12, tone: 'low' },
]

export const TELEMETRY_STREAM: TelemetryEntry[] = [
  { time: 'T-04:12', message: 'SYNC_ESTABLISHED', state: 'past' },
  { time: 'T-04:13', message: 'MOUNTING_VOLUMES', state: 'past' },
  { time: 'T-04:13', message: 'VERIFYING_CACHE', state: 'past' },
  { time: 'T-04:14', message: 'RENDERING_MESH', state: 'active' },
  { time: 'T-04:15', message: 'AWAITING_INPUT', state: 'pending' },
]

export const LAYER_ANNOTATIONS: LayerAnnotation[] = [
  {
    id: 'capacitor',
    title: 'Capacitor Array',
    detail: '0.004 MS ALLOC',
    side: 'end',
  },
  {
    id: 'resonance',
    title: 'Resonance Ring',
    detail: 'FREQ: 44.2 THz',
    side: 'start',
  },
  {
    id: 'housing',
    title: 'Magnetic Housing',
    detail: 'TEMP: 2.4K // NOMINAL',
    side: 'end',
  },
  {
    id: 'manifold',
    title: 'Base Manifold',
    detail: 'STRUCTURAL GROUND',
    side: 'start',
  },
]

export const DEFAULT_KERNEL_LABEL = 'Kernel.Diagnostic_v4.2'
export const DEFAULT_TITLE = 'Architecture Teardown'
export const DEFAULT_STATUS = 'System Nominal'
export const DEFAULT_PLAYBACK_STEP = 'Step 04.12'
