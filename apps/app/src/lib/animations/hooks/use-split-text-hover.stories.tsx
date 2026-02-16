/**
 * useSplitTextHover Hook Stories
 *
 * Demonstrates split text hover animations
 */

import type {Meta, StoryObj} from '@storybook/react'
import {useSplitTextHover} from './use-split-text-hover'

// ============================================================================
// Component Wrapper
// ============================================================================

function SplitTextHoverDemo() {
  const {textRef} = useSplitTextHover({
    xOffset: 0.5,
    duration: 0.64,
    stagger: 0.015,
  })

  return (
    <div className='text-center'>
      <a
        ref={textRef as React.RefObject<HTMLAnchorElement>}
        href='#'
        className='text-6xl font-bold text-white hover:text-blue-400 transition-colors inline-block'
        onClick={(e) => e.preventDefault()}>
        HOVER OVER ME
      </a>
      <p className='mt-8 text-gray-400'>Hover to see character animation</p>
    </div>
  )
}

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof SplitTextHoverDemo> = {
  title: 'Animations/Hooks/useSplitTextHover',
  component: SplitTextHoverDemo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: `
\`useSplitTextHover\` splits text into characters and animates them on hover using GSAP SplitText.

## Features
- Split by chars, words, or lines
- Configurable X offset
- Stagger animation
- Custom duration
- Enable/disable toggle

## Usage
\`\`\`tsx
const { textRef } = useSplitTextHover({
  xOffset: 0.5,
  stagger: 0.015
});

<a ref={textRef} href="#">Hover Me</a>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SplitTextHoverDemo>

// ============================================================================
// Stories
// ============================================================================

export const Basic: Story = {}

export const NavigationMenu: Story = {
  render: () => {
    const NavLink = ({children}: {children: string}) => {
      const {textRef} = useSplitTextHover({
        xOffset: 0.5,
        stagger: 0.015,
      })

      return (
        <a
          ref={textRef as React.RefObject<HTMLAnchorElement>}
          href='#'
          className='text-2xl font-bold text-white hover:text-blue-400 transition-colors'
          onClick={(e) => e.preventDefault()}>
          {children}
        </a>
      )
    }

    return (
      <nav className='flex flex-col gap-6'>
        <NavLink>Home</NavLink>
        <NavLink>About</NavLink>
        <NavLink>Projects</NavLink>
        <NavLink>Contact</NavLink>
      </nav>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu with animated links.',
      },
    },
  },
}

export const LargeXOffset: Story = {
  render: () => {
    const {textRef} = useSplitTextHover({
      xOffset: 2,
      stagger: 0.02,
    })

    return (
      <div className='text-center'>
        <h1 ref={textRef} className='text-5xl font-bold text-purple-400 cursor-pointer'>
          DRAMATIC EFFECT
        </h1>
        <p className='mt-8 text-gray-400'>Large offset (2em) for dramatic effect</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover effect with large X offset for dramatic movement.',
      },
    },
  },
}

export const FastStagger: Story = {
  render: () => {
    const {textRef} = useSplitTextHover({
      xOffset: 0.5,
      stagger: 0.005,
      duration: 0.3,
    })

    return (
      <div className='text-center'>
        <h1 ref={textRef} className='text-5xl font-bold text-green-400 cursor-pointer'>
          QUICK WAVE
        </h1>
        <p className='mt-8 text-gray-400'>Fast stagger (0.005s) and short duration</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick wave effect with fast stagger and short duration.',
      },
    },
  },
}

export const SlowStagger: Story = {
  render: () => {
    const {textRef} = useSplitTextHover({
      xOffset: 0.8,
      stagger: 0.05,
      duration: 1,
    })

    return (
      <div className='text-center'>
        <h1 ref={textRef} className='text-5xl font-bold text-yellow-400 cursor-pointer'>
          SLOW MOTION
        </h1>
        <p className='mt-8 text-gray-400'>Slow stagger (0.05s) and long duration</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Slow motion effect with delayed stagger and long duration.',
      },
    },
  },
}

export const SplitByWords: Story = {
  render: () => {
    const {textRef} = useSplitTextHover({
      splitType: 'words',
      xOffset: 1,
      stagger: 0.05,
    })

    return (
      <div className='text-center max-w-2xl'>
        <h1 ref={textRef} className='text-4xl font-bold text-cyan-400 cursor-pointer'>
          This Text Splits By Words Instead Of Characters
        </h1>
        <p className='mt-8 text-gray-400'>Using splitType: 'words'</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Split and animate by words instead of characters.',
      },
    },
  },
}

export const CardGrid: Story = {
  render: () => {
    const Card = ({title}: {title: string}) => {
      const {textRef} = useSplitTextHover({
        xOffset: 0.3,
        stagger: 0.01,
      })

      return (
        <div className='bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors'>
          <h3 ref={textRef} className='text-2xl font-bold text-white cursor-pointer'>
            {title}
          </h3>
          <p className='mt-2 text-gray-400'>Hover to see the effect</p>
        </div>
      )
    }

    return (
      <div className='grid grid-cols-2 gap-4 max-w-4xl'>
        <Card title='Feature One' />
        <Card title='Feature Two' />
        <Card title='Feature Three' />
        <Card title='Feature Four' />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple cards with hover animations.',
      },
    },
  },
}

export const HeroHeading: Story = {
  render: () => {
    const {textRef} = useSplitTextHover({
      xOffset: 1.5,
      stagger: 0.02,
      duration: 0.8,
    })

    return (
      <div className='text-center space-y-8 max-w-4xl'>
        <h1
          ref={textRef}
          className='text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer'>
          ULTRATERRESTRIAL
        </h1>
        <p className='text-xl text-gray-400'>The truth is out there...</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero heading with gradient text and hover animation.',
      },
    },
  },
}

export const ManualTrigger: Story = {
  render: () => {
    const {textRef, triggerEnter, triggerLeave} = useSplitTextHover({
      xOffset: 0.8,
      stagger: 0.02,
      enabled: true,
    })

    return (
      <div className='text-center space-y-8'>
        <h1 ref={textRef} className='text-5xl font-bold text-white'>
          MANUAL CONTROL
        </h1>

        <div className='flex gap-4 justify-center'>
          <button
            onClick={() => triggerEnter()}
            className='px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700'>
            Trigger Enter
          </button>
          <button
            onClick={() => triggerLeave()}
            className='px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700'>
            Trigger Leave
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Manually trigger enter/leave animations with buttons.',
      },
    },
  },
}
