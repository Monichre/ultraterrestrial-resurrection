import {MetricCell} from './MetricCell'
import {RocketBadge} from './RocketBadge'
import type {HudMetric} from './types'

const DEFAULT_METRICS: ReadonlyArray<HudMetric> = [
  {label: 'MAIN BATTERY', value: '80%'},
  {label: 'SOLAR PANEL OUTPUT', value: '42.3 KW'},
  {label: 'BACKUP BATTERY', value: '95%'},
  {label: 'POWER CONSUMPTION', value: '38.6 KW'},
]

type IdentityRowProps = {
  identityLabel?: string
  metrics?: ReadonlyArray<HudMetric>
}

export const IdentityRow = ({
  identityLabel = 'R0CKET-001',
  metrics = DEFAULT_METRICS,
}: IdentityRowProps) => (
  <header className='flex items-start gap-6'>
    <RocketBadge />
    <div className='flex flex-1 flex-col gap-4'>
      <div className='text-[14px] font-medium tracking-[0.08em] text-hud-text-primary'>
        {identityLabel}
      </div>
      <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
        {metrics.map((m) => (
          <MetricCell key={m.label} label={m.label} value={m.value} />
        ))}
      </div>
    </div>
  </header>
)
