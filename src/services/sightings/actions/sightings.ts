'use server'
// import { UAPMonitorService } from '@/services/sightings/uap-monitor'
import { getSightingsGeoJSON } from '@/services/sightings/uap-sighting'


export const getFullSightingsPayload = async () => {
  // const monitor = new UAPMonitorService()

  // console.log( "🚀 ~ file: route.ts:12 ~ GET ~ monitor:", monitor )

  // const realtimeSightings = await monitor.getAllSightings()

  // console.log( "🚀 ~ file: route.ts:16 ~ GET ~ sightings:", realtimeSightings )

  const geoJSONSightings = await getSightingsGeoJSON()

  console.log( "🚀 ~ file: sightings.ts:17 ~ getSightings ~ geoJSONSightings:", geoJSONSightings )

  return { realtimeSightings: {}, geoJSONSightings }
}
