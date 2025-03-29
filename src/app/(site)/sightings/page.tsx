import {SightingsClient} from '@/features/data-viz/sightings/sightings'
import path from 'node:path'
import fs from 'node:fs'

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

  return (
    <div className='h-screen w-screen'>
      <SightingsClient
        geoJSONSightings={{
          sightings: sightingsFileContents,
          ufoPosts: ufoPostsFileContents,
          militaryBases: militaryBasesFileContents,
        }}
      />
    </div>
  )
}
