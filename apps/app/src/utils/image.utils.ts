

export type ImageProps = {
  id: string
  url: string
  signedUrl?: string
  attributes: {
    height: number
    width: number
  }
}
export type ModelWithImage = any & {
  photo?: ImageProps[]
  photos?: ImageProps[]
}
export type ModelImage = {}
const asImageProps = (p: any): ImageProps | null => {
  if (!p) return null
  if (typeof p === 'string') return { url: p } as ImageProps
  return p
}

export const formatModelWithImage = ( model: ModelWithImage ) => {
  console.log( 'model: ', model )
  if ( model?.photo?.length ) {
    return {
      ...model,
      photo: asImageProps(model.photo[0]),
    }
  }
  if ( model?.photos?.length ) {
    return {
      ...model,
      photo: asImageProps(model.photos[0]),
    }
  }
  return {
    ...model,
    photo: {
      url: '/atro-4.png',
    },
  }
}


export function getImageUrl( item: any ): { url: string } {
  if ( !item ) return { url: '/astro-3.png' }

  const raw = Array.isArray(item.photos) && item.photos.length ? item.photos[0]
    : Array.isArray(item.photo) && item.photo.length ? item.photo[0]
    : item.photo
  const photo = asImageProps(raw)
  return photo?.url ? photo : { url: '/astro-3.png' }

}