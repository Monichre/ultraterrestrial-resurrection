import Image from 'next/image'
import {cn} from '@/lib/utils'
import {FONT_ANTON, FONT_SPECIAL_ELITE, FONT_CAVEAT} from '@/app/fonts'
import {PhotoCaption} from '../PhotoCaption'
import type {UFODispatchDocumentProps} from '../types/documents'

const defaultProps: UFODispatchDocumentProps = {
  incident: {
    title: 'SOCORRO INCIDENT',
    subtitle: '— APRIL 1964',
    date: 'April 24, 1964',
  },
  dispatch: {
    reference: '18410-144',
    calls: [
      {time: '19 55', message: '→ Unknown fire'},
      {time: 'ann,', message: 'at tantown'},
      {time: 'south af', message: 'dynamite shack.'},
      {time: '19-4', message: '→ A large flame, possible crash'},
    ],
  },
  photo: {
    src: '/weathered-ufo-photograph-socorro-incident-1964.jpg',
    alt: 'Weathered photograph of the unidentified object',
  },
  handwrittenNotes: [
    {
      text: 'flaming disc',
      position: 'bottom-left',
      rotation: -6,
      color: 'text-blue-900/50',
    },
    {
      text: 'Sheriff Chavez',
      position: 'bottom-right',
      rotation: 2,
      color: 'text-black/60',
    },
  ],
  classification: {
    text: 'CLASSIFIED',
    rotation: 18,
  },
}

export default function UFODispatchDocument(props: UFODispatchDocumentProps = {}) {
  const config = {
    incident: {...defaultProps.incident, ...props.incident},
    dispatch: {...defaultProps.dispatch, ...props.dispatch},
    photo: {...defaultProps.photo, ...props.photo},
    handwrittenNotes: props.handwrittenNotes || defaultProps.handwrittenNotes,
    classification: {...defaultProps.classification, ...props.classification},
  }

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-12'
      case 'bottom-right':
        return '-bottom-4 right-8'
      case 'top-left':
        return 'top-4 left-12'
      case 'top-right':
        return 'top-4 right-8'
      default:
        return 'bottom-4 left-12'
    }
  }

  return (
    <main
      className={cn(
        'flex items-center justify-center min-h-screen bg-neutral-900 p-4 sm:p-8',
        FONT_ANTON.variable,
        FONT_SPECIAL_ELITE.variable,
        FONT_CAVEAT.variable
      )}>
      <div className='relative w-full max-w-2xl font-special-elite bg-[#f4f1e8] shadow-2xl shadow-black/60 p-8 md:p-12 text-black/70 rounded-sm weathered-document'>
        {/* Multiple Background Textures and Stains */}
        <div className='absolute inset-0 bg-gradient-to-br from-amber-50/80 via-yellow-100/60 to-amber-200/40 rounded-sm' />
        <div className='absolute inset-0 bg-gradient-to-tl from-amber-800/10 via-transparent to-yellow-900/5 rounded-sm' />

        {/* Paper textures and effects */}
        <div className='absolute inset-0 pointer-events-none mix-blend-multiply opacity-70 bg-[repeating-linear-gradient(0deg,_rgba(0,0,0,0.08)_0px,_rgba(0,0,0,0.08)_1px,_transparent_1px,_transparent_3px)] bg-[length:100%_3px] animate-[shimmer_8000ms_linear_infinite]'></div>
        <div className='absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-br from-transparent via-black/5 to-transparent bg-[size:32px_32px]'></div>
        <div className='absolute inset-0 pointer-events-none bg-[radial-gradient(120%_100%_at_50%_0%,_rgba(0,0,0,0.15),_transparent_60%)]'></div>

        {/* Coffee Stains */}
        <div className='absolute top-16 right-20 w-24 h-24 bg-amber-800/20 rounded-full blur-sm' />
        <div className='absolute top-32 right-16 w-12 h-12 bg-amber-900/15 rounded-full blur-sm' />
        <div className='absolute bottom-40 left-12 w-20 h-20 bg-yellow-800/10 rounded-full blur-md' />
        <div className='absolute bottom-20 right-32 w-16 h-16 bg-amber-700/15 rounded-full blur-sm' />

        {/* Fold Lines and Creases */}
        <div className='absolute top-1/3 left-0 w-full h-px bg-amber-800/30 shadow-sm' />
        <div className='absolute top-2/3 left-0 w-full h-px bg-amber-700/25 shadow-sm' />
        <div className='absolute top-0 left-1/2 h-full w-px bg-amber-800/20 shadow-sm' />

        {/* Torn Edges Effect */}
        <div className='absolute -top-1 -left-1 w-8 h-8 bg-amber-100 transform rotate-45 opacity-60' />
        <div className='absolute -top-2 right-20 w-6 h-6 bg-yellow-200 transform -rotate-12 opacity-50' />
        <div className='absolute -bottom-1 -right-1 w-10 h-10 bg-amber-200 transform rotate-12 opacity-40' />

        {/* Header */}
        <header className='relative z-10'>
          <h1
            className={cn(
              'text-4xl md:text-6xl font-anton tracking-wider text-neutral-800/80 drop-shadow-sm'
            )}>
            {config.incident.title}
          </h1>
          <h2
            className={cn(
              'text-3xl md:text-5xl font-anton tracking-wider text-neutral-800/70 drop-shadow-sm'
            )}>
            {config.incident.subtitle}
          </h2>
          <div
            className='absolute top-8 right-0 md:right-4 border-4 border-red-800/60 px-4 py-1 bg-red-50/30 shadow-md'
            style={{transform: `rotate(${config.classification.rotation}deg)`}}>
            <span
              className={cn('text-2xl font-anton text-red-800/70 tracking-widest drop-shadow-sm')}>
              {config.classification.text}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className='relative z-10 mt-8 border-t-2 border-black/40 pt-4'>
          <h3 className='text-lg font-bold tracking-widest text-neutral-800/80 drop-shadow-sm'>
            POLICE DISPATCH SCRIPT
          </h3>
          <p className='text-sm text-neutral-700/70'>{config.dispatch.reference}</p>

          <div className='mt-4 space-y-4 text-lg text-neutral-900/80'>
            <p className='font-bold drop-shadow-sm'>UNIT CALL:</p>
            <div className='grid grid-cols-[auto_1fr] gap-x-4 items-start'>
              {config.dispatch.calls.map((call, index) => (
                <div key={index} className='contents'>
                  <p className='drop-shadow-sm'>{call.time}</p>
                  <p className='drop-shadow-sm'>{call.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Handwritten Notes with Faded Ink */}
          {config.handwrittenNotes.map((note, index) => (
            <p
              key={index}
              className={cn(
                'absolute text-4xl transform drop-shadow-sm',
                getPositionClasses(note.position),
                note.color,
                FONT_CAVEAT.className
              )}
              style={{transform: `rotate(${note.rotation || 0}deg)`}}>
              {note.text}
            </p>
          ))}
        </div>

        {/* Weathered Polaroid Photo */}
        <div className='absolute top-[45%] right-4 md:right-8 w-48 h-56 md:w-56 md:h-64 bg-yellow-50 p-3 shadow-xl transform rotate-6 weathered-photo'>
          <div className='relative w-full h-full bg-black'>
            <Image
              src={config.photo.src || '/placeholder.svg'}
              alt={config.photo.alt}
              fill
              className='object-cover sepia-[0.3] contrast-[0.9] brightness-[0.95]'
            />
            {/* Photo Caption */}
            <PhotoCaption
              labelTop='Evidence Photo'
              captionNote="Officer Zamora's testimony - object departed at high velocity"
              className='bottom-0 left-0 text-xs'
            />
            {/* Photo Aging Effects */}
            <div className='absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-transparent to-amber-300/30' />
            <div className='absolute -top-2 -right-3 w-20 h-20 bg-amber-900/40 rounded-full blur-lg transform scale-y-50' />
            <div className='absolute -bottom-2 -left-2 w-16 h-16 bg-yellow-800/30 rounded-full blur-md' />
            <div className='absolute top-2 left-2 w-8 h-8 bg-amber-700/20 rounded-full blur-sm' />
          </div>

          {/* Photo Corner Damage */}
          <div className='absolute -top-1 -right-1 w-4 h-4 bg-amber-200 transform rotate-45' />
          <div className='absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-300 transform -rotate-12' />
        </div>

        {/* Additional Weathering Effects */}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/10 to-transparent transform skew-y-1 opacity-60' />
        <div className='absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-yellow-100/30 opacity-40' />
      </div>
    </main>
  )
}
