import {SightingsClient} from '@/features/data-viz/sightings/sightings'
import path from 'node:path'
import fs from 'node:fs'
import {SightingsLoader} from '@/features/data-viz/sightings/sightings-loader'
import {Suspense} from 'react'
import SightingsAnalytics from './sightings-analytics'
import { analyzeSightingsData } from '@/services/sightings/actions/sightings'

export default async function Index() {
  const sightingsFilePath = path.join(process.cwd(), 'public', 'sightings.geojson') // Adjust path if needed

  console.log('🚀 ~ Index ~ sightingsFilePath:', sightingsFilePath)

  const sightingsFileContents = JSON.parse(await fs.promises.readFile(sightingsFilePath, 'utf8'))

  console.log('🚀 ~ Index ~ sightingsFileContents:', sightingsFileContents)

  const ufoPostsFilePath = path.join(process.cwd(), 'public', 'ufo-posts.geojson')
  const ufoPostsFileContents = JSON.parse(await fs.promises.readFile(ufoPostsFilePath, 'utf8'))
  const militaryBasesFilePath = path.join(process.cwd(), 'public', 'military-bases.geojson')
  const militaryBasesFileContents = JSON.parse(
    await fs.promises.readFile(militaryBasesFilePath, 'utf8')
  )

  // Extract features array from sightings GeoJSON
  const sightingsData = sightingsFileContents.features?.map(feature => feature.properties) || []

  return (
    <Suspense>
      <div className='h-screen w-screen'>
        <SightingsClient
          geoJSONSightings={{
            sightings: sightingsFileContents,
            ufoPosts: ufoPostsFileContents,
            militaryBases: militaryBasesFileContents,
          }}
        />
        <SightingsAnalytics 
          sightingsData={sightingsData}
          analyzeSightingsData={analyzeSightingsData}
        />
      </div>
    </Suspense>
  )
}
