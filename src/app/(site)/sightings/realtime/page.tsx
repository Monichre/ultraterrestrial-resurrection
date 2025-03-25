import { SightingsVisualization } from '@/components/uap-dashboard/sightings-visualization'
import { SightingsGlobe } from '@/features/data-viz/sightings/sightings-globe'
import { UAPSightingSchema, type ValidatedUAPSighting } from '@/services/sightings/uap-sighting'
import { Suspense } from 'react'

function transformToGeoJSON( sightings: ValidatedUAPSighting[] ) {
  return {
    type: 'FeatureCollection',
    features: sightings.map( sighting => ( {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: sighting.location.coordinates ? [
          sighting.location.coordinates.lng,
          sighting.location.coordinates.lat
        ] : [-74.4057, 40.0583] // Default to center of NJ if no coordinates
      },
      properties: {
        id: sighting.id,
        title: sighting.title,
        content: sighting.content,
        type: sighting.type,
        confidence: sighting.confidence,
        category: sighting.category,
        city: sighting.location.city,
        timestamp: sighting.timestamp.toISOString(),
        source: sighting.source
      }
    } ) )
  } as GeoJSON.FeatureCollection
}

async function getSightings() {
  try {
    const response = await fetch( `${process.env.NEXT_PUBLIC_APP_URL}/api/internal/uap-sightings`, {
      headers: {
        'x-api-key': process.env.INTERNAL_API_KEY!
      },
      next: {
        revalidate: 300 // Revalidate every 5 minutes
      }
    } )

    if ( !response.ok ) {
      throw new Error( 'Failed to fetch sightings' )
    }

    const data = await response.json()
    const validatedSightings = data.sightings.map( ( sighting: unknown ) =>
      UAPSightingSchema.parse( sighting )
    )

    return validatedSightings
  } catch ( error ) {
    console.error( 'Error fetching sightings:', error )
    return []
  }
}

// Fetch military bases data
async function getMilitaryBases() {
  try {
    const response = await fetch( `${process.env.NEXT_PUBLIC_APP_URL}/api/internal/military-bases`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    } )

    if ( !response.ok ) return null
    const data = await response.json()
    return data as GeoJSON.FeatureCollection
  } catch {
    return null
  }
}

// Fetch UFO posts data
async function getUFOPosts() {
  try {
    const response = await fetch( `${process.env.NEXT_PUBLIC_APP_URL}/api/internal/ufo-posts`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    } )

    if ( !response.ok ) return null
    const data = await response.json()
    return data as GeoJSON.FeatureCollection
  } catch {
    return null
  }
}

export default async function RealtimeSightingsPage() {
  const [sightings, militaryBases, ufoPosts] = await Promise.all( [
    getSightings(),
    getMilitaryBases(),
    getUFOPosts()
  ] )

  const sightingsGeoJSON = transformToGeoJSON( sightings )

  return (
    <div className="flex flex-col gap-8">
      {/* Globe View */}
      <div className="h-[600px] w-full relative bg-card rounded-lg overflow-hidden">
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
          <SightingsGlobe
            sightings={sightingsGeoJSON}
            militaryBases={militaryBases || { type: 'FeatureCollection', features: [] }}
            ufoPosts={ufoPosts || { type: 'FeatureCollection', features: [] }}
          />
        </Suspense>
      </div>

      {/* Statistics and List View */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Realtime UAP Sightings in New Jersey</h1>

        <div className="grid gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Sightings by Category</h2>
            <Suspense fallback={<div>Loading visualization...</div>}>
              <SightingsVisualization sightings={sightings} />
            </Suspense>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Sightings</h2>
            <div className="grid gap-4">
              {sightings.map( ( sighting: ValidatedUAPSighting ) => (
                <div
                  key={sighting.id}
                  className="border border-border rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">
                      {sighting.title || 'Untitled Sighting'}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date( sighting.timestamp ).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {sighting.content.substring( 0, 200 )}...
                  </p>

                  <div className="flex gap-2 text-sm">
                    <span className="px-2 py-1 bg-primary/10 rounded-full">
                      {sighting.type}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 rounded-full">
                      {sighting.confidence}
                    </span>
                    {sighting.category?.map( ( cat: string ) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-primary/10 rounded-full"
                      >
                        {cat}
                      </span>
                    ) )}
                  </div>

                  {sighting.location.city && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      📍 {sighting.location.city}, NJ
                    </div>
                  )}
                </div>
              ) )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
