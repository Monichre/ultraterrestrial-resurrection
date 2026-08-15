/**
 * useScrambleText Hook Stories
 *
 * Demonstrates scramble text effects and glitches
 */

import type {Meta, StoryObj} from '@storybook/react'
import {useScrambleText} from './use-scramble-text'

// ============================================================================
// Component Wrapper
// ============================================================================

function ScrambleTextDemo() {
  const {textRef, scramble, glitch, reveal} = useScrambleText({
    autoStore: true,
  })

  return (
    <div className='space-y-8 text-center'>
      <h1 ref={textRef} className='text-6xl font-bold text-green-400 font-mono'>
        MATRIX CODE
      </h1>

      <div className='flex gap-4 justify-center flex-wrap'>
        <button
          onClick={() => scramble('ULTRATERRESTRIAL')}
          className='px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700'>
          Scramble to "ULTRATERRESTRIAL"
        </button>
        <button
          onClick={() => scramble('DISCLOSURE PROJECT')}
          className='px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700'>
          Scramble to "DISCLOSURE PROJECT"
        </button>
        <button
          onClick={() => glitch(0.3)}
          className='px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700'>
          Glitch Effect
        </button>
        <button
          onClick={() => reveal()}
          className='px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700'>
          Reveal Original
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof ScrambleTextDemo> = {
  title: 'Animations/Hooks/useScrambleText',
  component: ScrambleTextDemo,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: `
\`useScrambleText\` creates matrix-style text scramble animations using GSAP ScrambleTextPlugin.

## Features
- Auto-store original text
- Scramble to any text
- Quick glitch effects
- Reveal original text
- Configurable scramble characters

## Usage
\`\`\`tsx
const { textRef, scramble, glitch } = useScrambleText({
  autoStore: true,
  scrambleChars: '▪'
});

<span ref={textRef} onClick={() => glitch()}>
  Text
</span>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ScrambleTextDemo>

// ============================================================================
// Stories
// ============================================================================

export const Interactive: Story = {}

export const OnHoverGlitch: Story = {
  render: () => {
    const {textRef, glitch} = useScrambleText({autoStore: true})

    return (
      <div className='text-center'>
        <h2
          ref={textRef}
          onMouseEnter={() => glitch(0.2)}
          className='text-4xl font-bold text-green-400 font-mono cursor-pointer'>
          HOVER OVER ME
        </h2>
        <p className='mt-4 text-gray-400'>Hover to trigger glitch effect</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Text that glitches when you hover over it.',
      },
    },
  },
}

export const ContinuousScramble: Story = {
  render: () => {
    const {textRef, scramble} = useScrambleText({autoStore: true})
    const messages = [
      'SYSTEM INITIALIZING...',
      'LOADING DATABASE...',
      'ANALYZING PATTERNS...',
      'DECRYPTING DATA...',
      'ACCESS GRANTED',
    ]
    let index = 0

    const cycleMessages = () => {
      scramble(messages[index])
      index = (index + 1) % messages.length
      setTimeout(cycleMessages, 2000)
    }

    // Start after mount
    setTimeout(cycleMessages, 500)

    return (
      <div className='text-center'>
        <h2 ref={textRef} className='text-3xl font-bold text-green-400 font-mono'>
          READY
        </h2>
        <p className='mt-4 text-gray-400'>Messages cycle automatically</p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Text that continuously scrambles through different messages.',
      },
    },
  },
}

export const CustomCharacters: Story = {
  render: () => {
    const {textRef, scramble} = useScrambleText({
      autoStore: true,
      scrambleChars: '█▓▒░!@#$%^&*',
    })

    return (
      <div className='space-y-8 text-center'>
        <h2 ref={textRef} className='text-5xl font-bold text-cyan-400 font-mono'>
          CUSTOM GLITCH
        </h2>

        <div className='flex gap-4 justify-center'>
          <button
            onClick={() => scramble('BINARY CODE', {chars: '01'})}
            className='px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700'>
            Binary (01)
          </button>
          <button
            onClick={() => scramble('BLOCK GLITCH', {chars: '█▓▒░'})}
            className='px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700'>
            Blocks (█▓▒░)
          </button>
          <button
            onClick={() => scramble('SPECIAL CHARS', {chars: '!@#$%^&*'})}
            className='px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700'>
            Symbols (!@#$)
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Scramble text with different character sets.',
      },
    },
  },
}

export const TerminalStyle: Story = {
  render: () => {
    const line1 = useScrambleText({autoStore: true})
    const line2 = useScrambleText({autoStore: true})
    const line3 = useScrambleText({autoStore: true})

    const bootSequence = () => {
      setTimeout(() => line1.scramble('[SYSTEM] Boot sequence initiated...'), 100)
      setTimeout(() => line2.scramble('[STATUS] All systems operational'), 1000)
      setTimeout(() => line3.scramble('[READY] Awaiting input...'), 2000)
    }

    return (
      <div className='bg-black p-8 rounded-lg font-mono'>
        <div className='space-y-4'>
          <div ref={line1.textRef} className='text-green-400'>
            [SYSTEM] Ready
          </div>
          <div ref={line2.textRef} className='text-green-400'>
            [STATUS] Standby
          </div>
          <div ref={line3.textRef} className='text-green-400'>
            [READY] Idle
          </div>
        </div>

        <button
          onClick={bootSequence}
          className='mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700'>
          Run Boot Sequence
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Terminal-style boot sequence with multiple scramble lines.',
      },
    },
  },
}

export const DifferentSpeeds: Story = {
  render: () => {
    const {textRef, scramble} = useScrambleText({autoStore: true})

    return (
      <div className='space-y-8 text-center'>
        <h2 ref={textRef} className='text-4xl font-bold text-green-400 font-mono'>
          SPEED TEST
        </h2>

        <div className='flex gap-4 justify-center flex-wrap'>
          <button
            onClick={() => scramble('SLOW REVEAL', {speed: 0.8})}
            className='px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700'>
            Slow (0.8)
          </button>
          <button
            onClick={() => scramble('MEDIUM REVEAL', {speed: 0.3})}
            className='px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700'>
            Medium (0.3)
          </button>
          <button
            onClick={() => scramble('FAST REVEAL', {speed: 0.1})}
            className='px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700'>
            Fast (0.1)
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Compare different scramble speeds.',
      },
    },
  },
}
