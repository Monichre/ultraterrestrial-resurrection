import { SpatialGallery } from '@/components/visualizations/spatial-gallery'

import { getXataClient } from '@/db/xata'
import { transformImage } from '@xata.io/client'
const xata = getXataClient()

function generatePositions( totalItems: [any] ) {
  const layers = [1, 8, 16, 24, 32, 29] // Items per layer
  const radiusIncrement = 1.5 // Increase in radius per layer
  let currentRadius = 0
  const spatialData = []

  let itemIndex: any = 0
  for ( let layerIndex = 0; layerIndex < layers.length; layerIndex++ ) {
    const numItemsInLayer = layers[layerIndex]
    currentRadius += radiusIncrement

    for ( let i = 0; i < numItemsInLayer; i++ ) {
      const angle = ( i / numItemsInLayer ) * 2 * Math.PI
      const x = currentRadius * Math.cos( angle )
      const z = currentRadius * Math.sin( angle )
      const rotationY = -angle // Faces towards the center

      spatialData.push( {
        position: [x, 0, z],
        rotation: [0, rotationY, 0],
      } )

      itemIndex++
      if ( itemIndex >= totalItems ) break
    }
    if ( itemIndex >= totalItems ) break
  }

  return spatialData
}

// const spatialData = generatePositions(110)
// console.log(spatialData)

const EventsGalleryPage = async () => {
  const records = await xata.db.events
    .filter( {
      $none: {
        photos: [],
      },
    } )
    .select( [
      'name',
      'description',
      'location',
      'latitude',
      'longitude',
      'date',
      'photos',
      'photos.signedUrl',
      'photos.enablePublicUrl',
      // 'photos.base64Content',
    ] )
    .getAll()

  const spatialData = [
    { position: [0, 0, 1.5], rotation: [0, 0, 0] },
    { position: [-0.8, 0, -0.6], rotation: [0, 0, 0] },
    { position: [0.8, 0, -0.6], rotation: [0, 0, 0] },
    { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0] },
    { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0] },
    { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0] },
    { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0] },
    { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0] },
    { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0] },
  ]

  const events = records
    .toSerializable()
    .filter( ( event ) => event?.photos?.length )
    .slice( 0, 9 )
    .map( ( { id, photos, xata, ...rest }: any, i ) => {
      const { position, rotation } = spatialData[i]

      const [photo] = photos

      // Apply transformations to a Xata image URL
      const url = transformImage( photo.url, {
        height: 750,
        width: 1260,
        dpr: 2,
        format: 'jpeg',
      } )

      return {
        id,
        photo: {
          ...photo,
          url,
        },
        position,
        rotation,
        ...rest,
      }
    } )

  return (
    <div
      className='h-[100vh] overflow-scroll'
      style={{ height: '100vh', width: '100vw' }}
    >
      <SpatialGallery items={events} />
    </div>
  )
}

export default EventsGalleryPage
