/**
 * TextScramble Component Stories
 *
 * Matrix-style text scramble animation component
 */

import type {Meta, StoryObj} from '@storybook/react'
import {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {TextScramble} from './text-scramble'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof TextScramble> = {
  title: 'Animations/Components/TextScramble',
  component: TextScramble,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: `
\`TextScramble\` is a declarative component for matrix-style text scramble animations.

## Features
- Configurable duration and delay
- Smooth character-by-character reveal
- OnComplete callback
- Respects spaces
- Automatic animation on text change

## Usage
\`\`\`tsx
<TextScramble 
  text="HELLO WORLD"
  duration={2000}
  delay={100}
  className="text-green-400 font-mono"
  onComplete={() => console.log('Done!')}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The text to scramble and reveal',
    },
    duration: {
      control: {type: 'range', min: 500, max: 5000, step: 100},
      description: 'Animation duration in milliseconds',
    },
    delay: {
      control: {type: 'range', min: 0, max: 2000, step: 100},
      description: 'Delay before animation starts',
    },
    className: {
      control: 'text',
      description: 'CSS classes to apply',
    },
  },
}

export default meta
type Story = StoryObj<typeof TextScramble>

// ============================================================================
// Stories
// ============================================================================

export const Basic: Story = {
  args: {
    text: 'ULTRATERRESTRIAL',
    duration: 2000,
    className: 'text-6xl font-bold text-green-400 font-mono',
  },
}

export const ShortDuration: Story = {
  args: {
    text: 'QUICK REVEAL',
    duration: 1000,
    className: 'text-4xl font-bold text-cyan-400 font-mono',
  },
  parameters: {
    docs: {
      description: {
        story: 'Fast scramble animation (1 second).',
      },
    },
  },
}

export const LongDuration: Story = {
  args: {
    text: 'SLOW DRAMATIC REVEAL',
    duration: 4000,
    className: 'text-4xl font-bold text-purple-400 font-mono',
  },
  parameters: {
    docs: {
      description: {
        story: 'Slow, dramatic scramble animation (4 seconds).',
      },
    },
  },
}

export const WithDelay: Story = {
  args: {
    text: 'DELAYED START',
    duration: 2000,
    delay: 1000,
    className: 'text-4xl font-bold text-yellow-400 font-mono',
  },
  parameters: {
    docs: {
      description: {
        story: 'Animation starts after 1 second delay.',
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    text: 'CUSTOM GRADIENT',
    duration: 2500,
    className:
      'text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono',
  },
  parameters: {
    docs: {
      description: {
        story: 'Scramble text with gradient styling.',
      },
    },
  },
}

export const SequentialReveal: Story = {
  render: () => {
    const [showSubtitle, setShowSubtitle] = useState(false)
    const [showFooter, setShowFooter] = useState(false)

    return (
      <div className='flex flex-col items-center gap-8'>
        <h1 className='text-6xl font-bold'>
          <TextScramble
            text='ULTRATERRESTRIAL'
            duration={2500}
            className='bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent font-mono'
            onComplete={() => setShowSubtitle(true)}
          />
        </h1>

        <AnimatePresence>
          {showSubtitle && (
            <motion.p
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              className='text-xl'>
              <TextScramble
                text='The truth is out there...'
                duration={3000}
                delay={200}
                className='text-gray-400 italic'
                onComplete={() => setShowFooter(true)}
              />
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFooter && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
              className='text-sm text-gray-500'>
              <TextScramble
                text='— H.P. Lovecraft'
                duration={1500}
                delay={300}
                className='text-gray-500'
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Sequential reveal of title, subtitle, and footer using onComplete callbacks.',
      },
    },
  },
}

export const HeroSection: Story = {
  render: () => {
    const [showCTA, setShowCTA] = useState(false)

    return (
      <div className='text-center space-y-8 max-w-3xl'>
        <h1 className='text-7xl font-bold'>
          <TextScramble
            text='DISCLOSURE'
            duration={2000}
            className='text-white font-mono'
            onComplete={() => setShowCTA(true)}
          />
        </h1>

        <p className='text-2xl'>
          <TextScramble
            text='Uncovering the truth about UFOs and UAPs'
            duration={3000}
            delay={500}
            className='text-gray-300'
          />
        </p>

        <AnimatePresence>
          {showCTA && (
            <motion.button
              initial={{scale: 0.8, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              transition={{delay: 0.5}}
              className='px-8 py-4 bg-green-600 text-white rounded-lg text-xl font-bold hover:bg-green-700 transition-colors'>
              Explore Now
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete hero section with scrambled text and delayed CTA.',
      },
    },
  },
}

export const TerminalOutput: Story = {
  render: () => {
    return (
      <div className='bg-black p-8 rounded-lg font-mono max-w-2xl'>
        <div className='space-y-4'>
          <div>
            <TextScramble
              text='[SYSTEM] Initializing quantum encryption...'
              duration={2000}
              className='text-green-400'
            />
          </div>
          <div>
            <TextScramble
              text='[STATUS] Loading classified documents...'
              duration={2500}
              delay={500}
              className='text-green-400'
            />
          </div>
          <div>
            <TextScramble
              text='[DATABASE] Accessing UAP records...'
              duration={2000}
              delay={1000}
              className='text-green-400'
            />
          </div>
          <div>
            <TextScramble
              text='[COMPLETE] All systems operational'
              duration={1500}
              delay={1500}
              className='text-green-400'
            />
          </div>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Terminal-style output with staggered line reveals.',
      },
    },
  },
}

export const MultipleInstances: Story = {
  render: () => {
    return (
      <div className='grid grid-cols-2 gap-8 max-w-4xl'>
        <div className='bg-gradient-to-br from-blue-900 to-blue-950 p-8 rounded-lg'>
          <TextScramble
            text='QUANTUM'
            duration={2000}
            className='text-4xl font-bold text-blue-300 font-mono'
          />
          <p className='mt-4 text-blue-200'>Advanced technology</p>
        </div>

        <div className='bg-gradient-to-br from-purple-900 to-purple-950 p-8 rounded-lg'>
          <TextScramble
            text='TEMPORAL'
            duration={2200}
            delay={200}
            className='text-4xl font-bold text-purple-300 font-mono'
          />
          <p className='mt-4 text-purple-200'>Time manipulation</p>
        </div>

        <div className='bg-gradient-to-br from-green-900 to-green-950 p-8 rounded-lg'>
          <TextScramble
            text='SPATIAL'
            duration={2400}
            delay={400}
            className='text-4xl font-bold text-green-300 font-mono'
          />
          <p className='mt-4 text-green-200'>Space bending</p>
        </div>

        <div className='bg-gradient-to-br from-red-900 to-red-950 p-8 rounded-lg'>
          <TextScramble
            text='NEURAL'
            duration={2600}
            delay={600}
            className='text-4xl font-bold text-red-300 font-mono'
          />
          <p className='mt-4 text-red-200'>Mind interface</p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple scramble instances with staggered delays.',
      },
    },
  },
}

export const LongText: Story = {
  args: {
    text: 'The most merciful thing in the world is the inability of the human mind to correlate all its contents',
    duration: 5000,
    className: 'text-2xl text-gray-300 italic max-w-3xl',
  },
  parameters: {
    docs: {
      description: {
        story: 'Scrambling longer text passages.',
      },
    },
  },
}

export const WithSpaces: Story = {
  args: {
    text: 'HELLO WORLD FROM SPACE',
    duration: 3000,
    className: 'text-5xl font-bold text-cyan-400 font-mono',
  },
  parameters: {
    docs: {
      description: {
        story: 'Text with spaces (spaces are preserved during scramble).',
      },
    },
  },
}
