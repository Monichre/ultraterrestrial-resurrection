import {MaskingTape} from '@/components/masking-tape'
import {useEntity} from '@/hooks'
import Image from 'next/image'
import Link from 'next/link'
import {useRef} from 'react'

export function SubjectMatterExpertCard({card}: any) {
  const {
    handleHoverLeave,
    entity,
    showMenu,
    setShowMMenu,
    bookmarked,
    setBookmarked,
    relatedDataPoints,
    saveNote,
    updateNote,
    userNote,
    connectionListConnections,
    handleHoverEnter,
    findConnections,
  } = useEntity({card})
  console.log('personnel card:', card)
  console.log('personel entity:', entity)
  const test = false
  const {popularity, rank, photo, name, role, credibility}: any = entity

  console.log(
    '🚀 ~ file: SubjectMatterExpertCard.tsx:31 ~ SubjectMatterExpertCard ~ entity:',
    entity
  )

  const image: any = photo[0] || {url: '/astro-3.png'}
  const imgRef = useRef(null)
  // useEffect( () => {
  //   const vfx = new VFX()
  //   const img: any = document.querySelector( '.vfx-img' )
  //   vfx.add( img, { shader: "rgbShift" } )
  // }, [] )

  return (
    <div className='group relative '>
      <MaskingTape position='left' />
      <MaskingTape position='right' />

      <Image
        ref={imgRef}
        src={image.url}
        alt={name}
        height={300}
        width={350}
        className='object-cover bg-neutral-200 pt-4 px-2 pb-16 z-1 h-full w-full'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        priority
      />
      <div className='transition-all duration-300 group-hover:text-base  relative z-10'>
        <h3 className='text-2xl font-bold text-black font-justAnotherHand '>{name}</h3>
        <p className=' text-black font-justAnotherHand font-regular tracking-wider relative z-10'>
          {role}, {popularity || rank || credibility}
        </p>
        <Link
          href={`/explore/key-figures/${entity.id}`}
          className='pointer-events-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white transition hover:bg-white/5'>
          <span>View</span>
        </Link>
      </div>
    </div>
  )
}
