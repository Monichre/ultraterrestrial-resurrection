'use client'

import {cn} from '@/lib/utils'
import {BottomAxis} from './BottomAxis'
import {CanvasFrame} from './CanvasFrame'
import {CoolingBars} from './CoolingBars'
import {EngineTemperatureChart} from './EngineTemperatureChart'
import {IdentityRow} from './IdentityRow'
import {Panel} from './Panel'
import {PlanetRail} from './PlanetRail'
import {PositionLogTable} from './PositionLogTable'
import {SaturnFocus} from './SaturnFocus'
import {SolarMap} from './SolarMap'
import {ThrustersTable} from './ThrustersTable'
import type {RocketHudProps} from './types'
import './rocket-telemetry-hud.css'

export const RocketHud = ({
  className,
  center,
  identityLabel,
  metrics,
  hotspots,
  positionLog,
  onHotspotFocus,
  activeHotspotName,
  centerOverlay,
  showSaturnFocus = true,
  showBottomAxis = true,
  fill = 'screen',
}: RocketHudProps) => (
  <div
    className={cn(
      'rocket-telemetry-hud relative w-full overflow-hidden bg-hud-bg font-mono text-hud-text-primary',
      fill === 'screen' ? 'h-screen' : 'h-full min-h-0',
      className
    )}>
    <div className='hud-grid-bg pointer-events-none absolute inset-0' aria-hidden />
    <CanvasFrame />

    <div className='rocket-telemetry-hud__grid relative grid h-full min-h-0'>
      <div className='rocket-telemetry-hud__left flex min-h-0 flex-col gap-3 overflow-y-auto'>
        <section
          aria-label='Identity and primary metrics'
          className='relative border border-hud-border-faint p-3'>
          <IdentityRow identityLabel={identityLabel} metrics={metrics} />
        </section>

        <section
          aria-label='Thrusters and cooling system'
          className='relative border border-hud-border-faint p-3'>
          <div className='grid grid-cols-2 gap-x-5'>
            <ThrustersTable />
            <CoolingBars />
          </div>
        </section>

        <Panel
          title='ENGINE TEMPERATURE'
          subtitle='SERIAL:23890237983467834789'
          ariaLabel='Engine temperature chart'>
          <EngineTemperatureChart />
        </Panel>

        <div className='min-h-0 flex-1'>
          <Panel title='ROCKET POSITION LOG' ariaLabel='Rocket position log'>
            <PositionLogTable rows={positionLog} />
          </Panel>
        </div>
      </div>

      {center ? (
        <main aria-label='Sightings globe stage' className='relative h-full min-h-0'>
          {center}
          {centerOverlay ? (
            <div className='pointer-events-none absolute inset-0 z-20'>
              <div className='pointer-events-auto'>{centerOverlay}</div>
            </div>
          ) : null}
        </main>
      ) : (
        <SolarMap />
      )}

      <PlanetRail
        hotspots={hotspots}
        onHotspotFocus={onHotspotFocus}
        activeHotspotName={activeHotspotName}
      />
    </div>

    {showSaturnFocus ? <SaturnFocus /> : null}
    {showBottomAxis ? <BottomAxis /> : null}
  </div>
)
