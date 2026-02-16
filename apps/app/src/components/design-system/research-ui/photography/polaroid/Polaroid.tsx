import Image from 'next/image'
import Link from 'next/link'
import {MaskingTape} from '@/components/design-system/masking-tape'

export const PolaroidBasic = ({person}) => {
  const {image, name, role, popularity, rank, credibility} = person
  return (
    <div className='group relative '>
      <MaskingTape position='left' />
      <MaskingTape position='right' />

      <Image
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
          href={`/key-figures/${person.id}`}
          className='pointer-events-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-white transition hover:bg-white/5'>
          <span>View</span>
        </Link>
      </div>
    </div>
  )
}

export const PolaroidAlt = ({
  person,
}: {
  person: {
    id: string
    url: string
    image: string
    name: string
    role: string
  }
}) => {
  return (
    <div key={person.id} className='group'>
      <Link href={person.url} className='block relative'>
        <div className='relative h-[400px] w-[300px] overflow-visible'>
          <div className='torn-paper h-full relative -rotate-1'>
            <div className='masking-tape masking-tape-top-left' />
            <div className='masking-tape masking-tape-top-right' />

            <div className='absolute top-2 right-10 z-10 font-mono text-xs font-semibold text-gray-800 p-1'>
              &apos;{person.rank}
            </div>

            <div
              style={{backgroundColor: '#f4f1e8'}}
              className='font-mono font-semibold uppercase text-center pt-6 pb-2 tracking-wider'>
              {person.role}
            </div>

            <div className='relative h-[280px] mx-4 mt-1 mb-3 overflow-hidden bg-black'>
              <div className='grid-bg-card' />

              <Image
                src={person.image || '/placeholder.svg'}
                alt={person.name}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-105 opacity-80'
              />
            </div>

            <div
              style={{backgroundColor: '#f4f1e8', color: '#a5221b'}}
              className='font-mono font-semibold uppercase text-center pb-5 pt-1 tracking-wider -rotate-1'>
              {person.name}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
