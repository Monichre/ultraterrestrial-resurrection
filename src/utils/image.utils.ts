

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
export const formatModelWithImage = ( model: ModelWithImage ) => {
  console.log( 'model: ', model )
  if ( model?.photo?.length ) {
    return {
      ...model,
      photo: model?.photo[0],
    }
  }
  if ( model?.photos?.length ) {
    return {
      ...model,
      photo: model?.photos[0],
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

  // Handle case where item has photos array
  if ( item.photos?.length && item.photos[0]?.url ) {
    const photo = item.photos[0]
    return photo
  } else if ( item.photo && item?.photo?.url ) {
    return item?.photo
  } else {

    return { url: '/astro-3.png' }
  }

}