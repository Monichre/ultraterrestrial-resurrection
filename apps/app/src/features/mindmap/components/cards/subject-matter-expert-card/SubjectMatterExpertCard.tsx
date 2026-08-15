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

  const image: any = photo?.[0] || {url: '/astro-3.png'}
  const imgRef = useRef(null)
  // useEffect( () => {
  //   const vfx = new VFX()
  //   const img: any = document.querySelector( '.vfx-img' )
  //   vfx.add( img, { shader: "rgbShift" } )
  // }, [] )

  return (
    <div className='group relative w-[280px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/80 backdrop-blur-md shadow-lg'>
      <div className='relative h-[220px] w-full bg-neutral-800'>
        <Image
          ref={imgRef}
          src={image.url}
          alt={name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          priority
        />
      </div>
      <div className='p-3'>
        <h3
          className='text-white font-semibold truncate'
          style={{fontSize: 'clamp(0.95rem, 0.8vw + 0.7rem, 1.15rem)'}}>
          {name}
        </h3>
        <p className='text-white/70 text-sm truncate'>{role}</p>
        <div className='mt-2 flex items-center justify-between'>
          <span className='text-xs text-emerald-300/90'>
            {popularity || rank || (credibility ? `Credibility ${credibility}` : '')}
          </span>
          <Link
            href={`/key-figures/${entity.id}`}
            className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white hover:bg-white/10'>
            View
          </Link>
        </div>
      </div>
    </div>
  )
}
