import type { ValidatedUAPSighting } from '@/services/sightings/uap-sighting'
import type { HudHotspotRow, HudMetric, HudPositionLogRow } from './types'

type LocationHotspot = {
  name: string
  count: number
  lat: number
  lon: number
}

export function buildHudMetrics(
  sightings: ValidatedUAPSighting[],
  selectedYear?: number
): HudMetric[] {
  const total = sightings.length
  const geocoded = sightings.filter(
    ( s ) => s.location?.coordinates?.lat != null && s.location?.coordinates?.lng != null
  ).length
  const highConfidence = sightings.filter( ( s ) => s.confidence === 'high' ).length
  const geocodePct = total === 0 ? '0%' : `${( ( geocoded / total ) * 100 ).toFixed( 1 )}%`

  return [
    { label: 'TOTAL SIGHTINGS', value: total.toLocaleString() },
    { label: 'GEOCODED', value: geocodePct },
    { label: 'HIGH CONFIDENCE', value: highConfidence.toLocaleString() },
    {
      label: 'ACTIVE WINDOW',
      value: selectedYear ? String( selectedYear ) : 'LIVE',
    },
  ]
}

export function buildHudHotspots( locations: LocationHotspot[] ): HudHotspotRow[] {
  return locations.slice( 0, 8 ).map( ( loc ) => ( {
    name: loc.name.toUpperCase(),
    value: loc.count > 0 ? String( loc.count ) : '—',
    lat: loc.lat,
    lon: loc.lon,
  } ) )
}

export function buildHudPositionLog( sightings: ValidatedUAPSighting[] ): HudPositionLogRow[] {
  return sightings
    .filter( ( s ) => s.location?.coordinates?.lat != null && s.location?.coordinates?.lng != null )
    .slice( 0, 10 )
    .map( ( s ) => {
      const lat = s.location!.coordinates!.lat
      const lng = s.location!.coordinates!.lng
      const ts = new Date( s.timestamp )
      const pad = ( n: number ) => String( n ).padStart( 2, '0' )
      const time = `${ts.getFullYear()}-${pad( ts.getMonth() + 1 )}-${pad( ts.getDate() )} ${pad( ts.getHours() )}:${pad( ts.getMinutes() )}:${pad( ts.getSeconds() )}`
      return {
        time,
        x: lng.toFixed( 2 ),
        y: lat.toFixed( 2 ),
        z: '0.00',
      }
    } )
}
