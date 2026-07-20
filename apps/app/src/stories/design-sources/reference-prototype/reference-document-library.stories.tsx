import type {Meta, StoryObj} from '@storybook/nextjs'
import {DocumentA as ReferenceDocumentA} from '@reference/components/DocumentA'
import {DocumentB as ReferenceDocumentB} from '@reference/components/DocumentB'
import {DocumentFrame as ReferenceDocumentFrame} from '@reference/components/DocumentFrame'
import {DocumentOne as ReferenceDocumentOne} from '@reference/components/DocumentOne'
import {ClassifiedDocument as ReferenceClassifiedDocument} from '@reference/components/classified-documents/ClassifiedDocument'
import ReferenceUfoDispatchDocument from '@reference/components/classified-documents/UFODispatchDocument'
import {UFODocument as ReferenceUfoDocument} from '@reference/components/classified-documents/UFODocument'
import {WeatheredClassifiedDocument as ReferenceWeatheredClassifiedDocument} from '@reference/components/classified-documents/WeatheredClassifiedDocument'
import {DocumentShowcase as ReferenceDocumentShowcase} from '@reference/components/layouts/DocumentShowcase'
import {MixedDocumentLayout as ReferenceMixedDocumentLayout} from '@reference/components/layouts/MixedDocumentLayout'
import {ResponsiveDocumentGrid as ReferenceResponsiveDocumentGrid} from '@reference/components/layouts/ResponsiveDocumentGrid'
import {PhotoCaption as ReferencePhotoCaption} from '@reference/components/ui/PhotoCaption'
import {VintagePosterA as ReferenceVintagePosterA} from '@reference/components/vintage-posters/VintagePosterA'
import {VintagePosterB as ReferenceVintagePosterB} from '@reference/components/vintage-posters/VintagePosterB'
import {VintagePosterC as ReferenceVintagePosterC} from '@reference/components/vintage-posters/VintagePosterC'
import {VintagePosterD as ReferenceVintagePosterD} from '@reference/components/vintage-posters/VintagePosterD'
import '../../../../.storybook/reference-prototype.css'

function ReferenceCanvas({children}: {children: React.ReactNode}) {
  return (
    <div className='reference-prototype-catalog' data-reference-prototype='true'>
      <div className='mx-auto w-full max-w-[1600px]'>{children}</div>
    </div>
  )
}

const meta = {
  title: 'Design Sources/Reference Prototype/Document Library',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'black'},
    docs: {
      description: {
        component:
          'Quarantined Figma Make reference components for visual comparison. These stories render the donor source without promoting it into the production design system.',
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const mixedDocuments = [
  {
    type: 'document-one' as const,
    props: {
      header: {
        title: 'ARCHIVE REPORT . 047 ...........',
        subtitle: 'Reference composition study',
        classification: 'DESIGN SOURCE . . 4.7',
      },
    },
  },
  {
    type: 'poster-b' as const,
    props: {
      titleISTA: 'REFERENCE',
      subtitleISTA: 'Document library donor',
      verticalTitle: 'Study 047',
      bottomNumber: '047',
    },
  },
  {
    type: 'document-a' as const,
    props: {
      header: {
        title: 'MATERIAL STUDY',
        subtitle: 'Paper, image, and annotation layers',
        pageNumber: 'Page: 03',
      },
    },
  },
]

export const DocumentFrame: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceDocumentFrame>
        <div className='min-h-[32rem] p-12 font-mono text-black'>
          <p className='text-xs uppercase tracking-[0.2em]'>Document materiality primitive</p>
          <h2 className='mt-4 text-4xl font-bold'>Reference frame</h2>
          <p className='mt-8 max-w-xl leading-7'>
            Grain, aged tint, folds, and shadow are isolated here so the wrapper can be audited
            without document content.
          </p>
        </div>
      </ReferenceDocumentFrame>
    </ReferenceCanvas>
  ),
}

export const DocumentOne: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceDocumentOne />
    </ReferenceCanvas>
  ),
}

export const DocumentA: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceDocumentA />
    </ReferenceCanvas>
  ),
}

export const DocumentB: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceDocumentB />
    </ReferenceCanvas>
  ),
}

export const ClassifiedDocument: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceClassifiedDocument
        documents={[
          {
            title: 'VISUAL REFERENCE · 047',
            rotation: 0,
            content: [
              {
                type: 'text',
                data: {
                  sections: [
                    {
                      text: 'Quarantined donor composition for material, spacing, and typography review.',
                    },
                  ],
                },
              },
            ],
          },
        ]}
      />
    </ReferenceCanvas>
  ),
}

export const UfoDocument: Story = {
  name: 'UFO Document',
  render: () => (
    <ReferenceCanvas>
      <ReferenceUfoDocument
        idPhoto='/images/doc-a-main.png'
        creatureSketch='/images/doc-b-abstract.png'
      />
    </ReferenceCanvas>
  ),
}

export const UfoDispatchDocument: Story = {
  name: 'UFO Dispatch Document',
  render: () => (
    <ReferenceCanvas>
      <ReferenceUfoDispatchDocument
        photo={{src: '/images/doc-a-main.png', alt: 'Reference aerial evidence plate'}}
      />
    </ReferenceCanvas>
  ),
}

export const WeatheredClassifiedDocument: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceWeatheredClassifiedDocument
        showNavigation={false}
        photo={{src: '/images/doc-b-textstorm.png', alt: 'Reference archival scan'}}
      />
    </ReferenceCanvas>
  ),
}

export const PhotoCaption: Story = {
  render: () => (
    <ReferenceCanvas>
      <div className='relative mx-auto h-[34rem] max-w-4xl overflow-hidden bg-[#d8d2c6] p-12'>
        <img
          className='h-full w-full object-cover grayscale'
          src='/images/doc-a-main.png'
          alt='Reference aerial evidence plate'
        />
        <ReferencePhotoCaption
          className='bottom-8 left-8 max-w-xs'
          labelTop='PLATE 047 · SOURCE STUDY'
          captionNote='Caption anatomy shown as reference material; provenance requirements apply before production use.'
        />
      </div>
    </ReferenceCanvas>
  ),
}

export const VintagePosterA: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceVintagePosterA />
    </ReferenceCanvas>
  ),
}

export const VintagePosterB: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceVintagePosterB />
    </ReferenceCanvas>
  ),
}

export const VintagePosterC: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceVintagePosterC />
    </ReferenceCanvas>
  ),
}

export const VintagePosterD: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceVintagePosterD />
    </ReferenceCanvas>
  ),
}

export const MixedDocumentLayout: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceMixedDocumentLayout variant='grid' documents={mixedDocuments} />
    </ReferenceCanvas>
  ),
}

export const ResponsiveDocumentGrid: Story = {
  parameters: {viewport: {defaultViewport: 'wide'}},
  render: () => (
    <ReferenceCanvas>
      <ReferenceResponsiveDocumentGrid />
    </ReferenceCanvas>
  ),
}

export const DocumentShowcase: Story = {
  render: () => (
    <ReferenceCanvas>
      <ReferenceDocumentShowcase />
    </ReferenceCanvas>
  ),
}
