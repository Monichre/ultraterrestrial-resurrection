import { KeyFiguresIcon } from '@/components/icons'
import { useEntity } from '@/hooks'
import Image from 'next/image'
import { useRef } from 'react'





export function SubjectMatterExpertCard( { card }: any ) {
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
  } = useEntity( { card } )
  console.log( 'personnel card:', card )
  console.log( 'personel entity:', entity )
  const test = false
  const { popularity, rank, photo, name, role, credibility }: any = entity

  console.log( "🚀 ~ file: SubjectMatterExpertCard.tsx:31 ~ SubjectMatterExpertCard ~ entity:", entity )


  const image: any = photo[0] || { url: '/astro-3.png' }
  const imgRef = useRef( null )
  // useEffect( () => {
  //   const vfx = new VFX()
  //   const img: any = document.querySelector( '.vfx-img' )
  //   vfx.add( img, { shader: "rgbShift" } )
  // }, [] )


  return (
    <div className="group relative mx-auto flex h-[300px] w-[300px] flex-col overflow-hidden rounded-2xl border border-white/5">
      <div className='absolute top-0 left-0 w-full px-2 flex justify-end'>
        <p className="mt-2 text-sm font-light leading-relaxed text-[#22d3ee] font-sentient">
          {rank || popularity || credibility}
        </p>

      </div>
      <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]">
        {/* <div className="absolute inset-0 flex items-center justify-center"> */}
        {/* <div className="relative w-full h-full">
            <Image
              src={bgPhoto.url}
              alt={name}
              fill
              className="object-cover opacity-20"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div> */}
        {/* </div> */}
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          ref={imgRef}
          src={image.url}
          alt={name}
          fill
          className="object-cover opacity-20 vfx-img"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      <div className="pointer-events-none mt-auto px-6 pb-6 relative z-10">
        <div className="relative transition duration-300 group-hover:-translate-y-9">
          <div className="text-lg text-white transition-all duration-300 group-hover:text-base font-bebasNeuePro font-regular tracking-wider">
            {name}
          </div>
          <p className="text-sm font-light leading-relaxed text-white/75">
            {role}
          </p>

          <div className="absolute -left-2 bottom-0 translate-y-11 opacity-0 transition duration-300 group-hover:opacity-100">
            <a
              href={`/explore/key-figures/${entity.id}`}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white transition hover:bg-white/5">
              <span>View</span>

              <KeyFiguresIcon className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>



  )
}
