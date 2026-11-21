import type {DocumentAProps} from './types/documents'
import {DocumentFrame} from './DocumentFrame'
import {PhotoCaption} from './PhotoCaption'

const defaultProps: DocumentAProps = {
  header: {
    title: 'UN:DE FECTAL',
    subtitle: 'Record 17330 • Steel/Exa',
    pageNumber: 'Page: 08',
  },
  mainImage: {
    src: '/images/doc-a-main.png',
    alt: 'Scanned page with UFO hovering over burning field',
  },
  sidebar: {
    figureLabel: 'Fig. 7',
    sections: [
      {
        title: 'ROCO.TD',
        subtitle: 'ufo: scanned specimen',
      },
      {
        title: 'Index',
        items: [
          {label: 'nero', value: '56'},
          {label: 'morro', value: '80'},
          {label: 'nenill', value: '95'},
        ],
      },
    ],
    notes:
      'Field notes recovered from damaged archive. Surface temperatures consistent with controlled burn across basalt plain. Witness marks indicate lift vector.',
  },
  footer: {
    transcription:
      'Transcribed fragments: authorization stamp degraded; perimeter estimate +/- 5m; thermal pockets persist despite crosswind conditions.',
    codeReference: 'ISTO: 95',
  },
}

export function DocumentA(props: DocumentAProps = {}) {
  const config = {
    header: {...defaultProps.header, ...props.header},
    mainImage: {...defaultProps.mainImage, ...props.mainImage},
    sidebar: {...defaultProps.sidebar, ...props.sidebar},
    footer: {...defaultProps.footer, ...props.footer},
  }

  return (
    <DocumentFrame className='mt-12'>
      {/* Header row */}
      <header className='px-8 pt-8 pb-3 flex items-center justify-between'>
        <div className='flex items-baseline gap-3'>
          <span className='font-black tracking-widest text-2xl'>{config.header.title}</span>
          <span className='text-[10px] tracking-[0.3em] uppercase'>{config.header.subtitle}</span>
        </div>
        <span className='text-xs'>{config.header.pageNumber}</span>
      </header>

      {/* Split grid with hero scan and margin annotations */}
      <div className='relative px-6 pb-10'>
        <div className='grid grid-cols-[1fr_18rem] gap-4'>
          {/* Large scan block */}
          <div className='relative overflow-hidden border border-black/50 bg-white'>
            <img
              src={config.mainImage.src || '/placeholder.svg'}
              alt={config.mainImage.alt}
              className='w-full h-[32rem] object-cover contrast-110'
            />
            {/* Photo Caption for main image */}
            <PhotoCaption
              labelTop='Primary Evidence'
              captionNote='Thermal signature analysis confirms anomalous heat source. Witness testimony corroborated.'
              className='bottom-2 left-2'
            />
            {/* vertical fold line overlay */}
            <div className='absolute inset-y-0 left-1/2 w-px bg-black/30' aria-hidden='true' />
            {/* surface scratches */}
            <div className='pointer-events-none absolute inset-0 mix-blend-multiply opacity-20'>
              <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10' />
            </div>
          </div>

          {/* Right sidebar annotations */}
          <aside className='relative'>
            {/* Figure label box - positioned within normal flow */}
            <div className='w-16 h-20 bg-black/80 text-white text-[9px] flex items-end justify-center pb-1 shadow-md mb-2 ml-auto'>
              <span>{config.sidebar.figureLabel}</span>
            </div>
            <div className='space-y-2 text-[10px] tracking-wider'>
              {config.sidebar.sections.map((section, index) => (
                <div key={index} className='border border-black/40 p-2'>
                  <div className='font-semibold'>{section.title}</div>
                  {section.subtitle && (
                    <div className='text-[9px] opacity-70'>{section.subtitle}</div>
                  )}
                  {section.items && (
                    <ul className='mt-1 space-y-1'>
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className='flex justify-between'>
                          <span>{item.label}</span>
                          <span>{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div className='text-[9px] opacity-70 leading-relaxed'>{config.sidebar.notes}</div>
            </div>
          </aside>
        </div>

        {/* Footer line items */}
        <div className='mt-6 grid grid-cols-6 gap-2 text-[10px] leading-4'>
          {Array.from({length: 6}).map((_, i) => (
            <p key={i} className='col-span-3 border-t pt-2 opacity-80'>
              {config.footer.transcription}
            </p>
          ))}
        </div>

        {/* bottom right code mark */}
        <div className='absolute bottom-2 right-4 text-sm font-bold tracking-widest'>
          {config.footer.codeReference}
        </div>
      </div>
    </DocumentFrame>
  )
}
