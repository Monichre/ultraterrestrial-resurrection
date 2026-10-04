import {useRef} from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import {DragCard, DragCards, DragCardsTitle} from './DraggableStack'

// Define the demo component
const DragStackDemo = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<any>(null)

  return (
    <div className='relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950'>
      <DragCardsTitle>CARDS</DragCardsTitle>
      <DragCards ref={containerRef}>
        {CARDS_DEMO.map((card) => (
          <DragCard
            key={`card-${card.src}`}
            containerRef={containerRef}
            src={card.src}
            alt={card.alt}
            rotate={card.rotate}
            top={card.top}
            left={card.left}
            className={card.className}
          />
        ))}
      </DragCards>
    </div>
  )
}

const meta: Meta<typeof DragStackDemo> = {
  title: 'Components/DraggableStack',
  component: DragStackDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DragStackDemo>

export const Demo: Story = {
  args: {},
}

const CARDS_DEMO = [
  {
    src: 'https://images.unsplash.com/photo-1635373670332-43ea883bb081?q=80&w=2781&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Example image',
    rotate: '6deg',
    top: '20%',
    left: '25%',
    className: 'w-36 md:w-56',
  },
  {
    src: 'https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Example image',
    rotate: '12deg',
    top: '45%',
    left: '60%',
    className: 'w-24 md:w-48',
  },
  {
    src: 'https://images.unsplash.com/photo-1503751071777-d2918b21bbd9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Example image',
    rotate: '-6deg',
    top: '20%',
    left: '40%',
    className: 'w-52 md:w-80',
  },
  {
    src: 'https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=2609&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Example image',
    rotate: '8deg',
    top: '50%',
    left: '40%',
    className: 'w-48 md:w-72',
  },
  {
    src: 'https://images.unsplash.com/photo-1602212096437-d0af1ce0553e?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Example image',
    rotate: '18deg',
    top: '20%',
    left: '65%',
    className: 'w-40 md:w-64',
  },
  {
    src: 'https://images.unsplash.com/photo-1622313762347-3c09fe5f2719?q=80&w=2640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Example image',
    rotate: '-3deg',
    top: '35%',
    left: '55%',
    className: 'w-24 md:w-48',
  },
]
