/**
 * TerminalPreloader Component Stories
 *
 * Terminal-style preloader with scramble effects
 */

import type {Meta, StoryObj} from '@storybook/react'
import {TerminalPreloader, type TerminalLine} from './terminal-preloader'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof TerminalPreloader> = {
  title: 'Animations/Components/TerminalPreloader',
  component: TerminalPreloader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`TerminalPreloader\` is a full-screen animated loading screen with terminal-style text and scramble effects.

## Features
- Configurable terminal lines
- Scramble text animations
- Progress bar
- Glitch effects
- Auto-complete callback
- Fully customizable styling

## Usage
\`\`\`tsx
<TerminalPreloader
  lines={[
    { id: '1', content: '[SYSTEM] Loading...', scramble: true, top: '40%' }
  ]}
  duration={5}
  showProgress
  onComplete={() => console.log('Loaded!')}
>
  <YourApp />
</TerminalPreloader>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: {type: 'range', min: 2, max: 10, step: 0.5},
      description: 'Total animation duration in seconds',
    },
    glitchCount: {
      control: {type: 'range', min: 0, max: 10, step: 1},
      description: 'Number of random glitch effects',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress bar',
    },
    autoStart: {
      control: 'boolean',
      description: 'Auto-start animation on mount',
    },
  },
}

export default meta
type Story = StoryObj<typeof TerminalPreloader>

// ============================================================================
// Stories
// ============================================================================

const defaultLines: TerminalLine[] = [
  {
    id: 'line-1',
    content: '[SYSTEM] Initializing...',
    scramble: true,
    opacity: 1,
    top: '30%',
  },
  {
    id: 'line-2',
    content: '[LOADING] Processing data...',
    scramble: true,
    opacity: 0.8,
    top: '45%',
  },
  {
    id: 'line-3',
    content: '[STATUS] Ready',
    scramble: true,
    opacity: 1,
    top: '60%',
  },
]

export const Basic: Story = {
  args: {
    lines: defaultLines,
    duration: 6,
    glitchCount: 3,
    showProgress: true,
    autoStart: true,
  },
}

export const FastPreloader: Story = {
  args: {
    lines: [
      {
        id: 'fast-1',
        content: '[QUICK] Loading...',
        scramble: true,
        top: '50%',
      },
    ],
    duration: 3,
    glitchCount: 1,
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick 3-second preloader.',
      },
    },
  },
}

export const SlowPreloader: Story = {
  args: {
    lines: defaultLines,
    duration: 10,
    glitchCount: 5,
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Slow 10-second preloader with more glitches.',
      },
    },
  },
}

export const WithoutProgress: Story = {
  args: {
    lines: defaultLines,
    duration: 6,
    glitchCount: 3,
    showProgress: false,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Preloader without progress bar.',
      },
    },
  },
}

export const NoGlitches: Story = {
  args: {
    lines: defaultLines,
    duration: 6,
    glitchCount: 0,
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Preloader without glitch effects.',
      },
    },
  },
}

export const ManyGlitches: Story = {
  args: {
    lines: defaultLines,
    duration: 8,
    glitchCount: 10,
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Preloader with many glitch effects.',
      },
    },
  },
}

export const CustomScrambleChars: Story = {
  args: {
    lines: [
      {
        id: 'binary-1',
        content: '[BINARY] 01010101',
        scramble: true,
        top: '50%',
      },
    ],
    duration: 5,
    scrambleChars: '01',
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Binary scramble characters (01).',
      },
    },
  },
}

export const SystemBootSequence: Story = {
  args: {
    lines: [
      {
        id: 'boot-1',
        content: '[BIOS] POST completed successfully',
        scramble: true,
        opacity: 0.9,
        top: '15%',
      },
      {
        id: 'boot-2',
        content: '[BOOT] Loading kernel modules...',
        scramble: true,
        opacity: 0.8,
        top: '25%',
      },
      {
        id: 'boot-3',
        content: '[INIT] Starting system services...',
        scramble: true,
        opacity: 0.85,
        top: '35%',
      },
      {
        id: 'boot-4',
        content: '[NET] Network interfaces up',
        scramble: true,
        opacity: 0.75,
        top: '45%',
      },
      {
        id: 'boot-5',
        content: '[AUTH] Authentication ready',
        scramble: true,
        opacity: 0.9,
        top: '55%',
      },
      {
        id: 'boot-6',
        content: '[DB] Database connection established',
        scramble: true,
        opacity: 0.8,
        top: '65%',
      },
      {
        id: 'boot-7',
        content: '[READY] System operational',
        scramble: true,
        opacity: 1,
        top: '75%',
      },
    ],
    duration: 8,
    glitchCount: 5,
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Full system boot sequence with multiple lines.',
      },
    },
  },
}

export const MinimalPreloader: Story = {
  args: {
    lines: [
      {
        id: 'minimal',
        content: 'LOADING...',
        scramble: true,
        top: '50%',
      },
    ],
    duration: 4,
    glitchCount: 2,
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal single-line preloader.',
      },
    },
  },
}

export const UAP_Database_Loading: Story = {
  args: {
    lines: [
      {
        id: 'uap-1',
        content: '[UAP-DB] Accessing classified files...',
        scramble: true,
        opacity: 1,
        top: '30%',
      },
      {
        id: 'uap-2',
        content: '[DECRYPT] Breaking encryption...',
        scramble: true,
        opacity: 0.9,
        top: '40%',
      },
      {
        id: 'uap-3',
        content: '[SCAN] Analyzing patterns...',
        scramble: true,
        opacity: 0.85,
        top: '50%',
      },
      {
        id: 'uap-4',
        content: '[VERIFY] Cross-referencing testimonies...',
        scramble: true,
        opacity: 0.8,
        top: '60%',
      },
      {
        id: 'uap-5',
        content: '[ACCESS] Disclosure granted',
        scramble: true,
        opacity: 1,
        top: '70%',
      },
    ],
    duration: 7,
    glitchCount: 6,
    showProgress: true,
    autoStart: true,
    style: {
      backgroundColor: '#0a0a0f',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'UFO/UAP database loading sequence.',
      },
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    lines: [
      {
        id: 'custom-1',
        content: '[CUSTOM] Styled preloader',
        scramble: true,
        top: '50%',
      },
    ],
    duration: 5,
    showProgress: true,
    autoStart: true,
    className: 'custom-preloader',
    style: {
      backgroundColor: '#1a0033',
      fontFamily: '"Courier New", monospace',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Preloader with custom background and font.',
      },
    },
  },
}

export const WithCallback: Story = {
  args: {
    lines: defaultLines,
    duration: 5,
    showProgress: true,
    autoStart: true,
    onComplete: () => {
      console.log('Preloader animation complete!')
      alert('Loading complete!')
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Preloader with onComplete callback (check console and alert).',
      },
    },
  },
}

export const CenteredSingleLine: Story = {
  args: {
    lines: [
      {
        id: 'center',
        content: 'ULTRATERRESTRIAL DATABASE',
        scramble: true,
        top: '50%',
      },
    ],
    duration: 4,
    glitchCount: 3,
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Single centered line.',
      },
    },
  },
}

export const QuantumEncryption: Story = {
  args: {
    lines: [
      {
        id: 'quantum-1',
        content: '[QUANTUM] Establishing secure channel...',
        scramble: true,
        opacity: 1,
        top: '35%',
      },
      {
        id: 'quantum-2',
        content: '[ENTANGLE] Linking qubits...',
        scramble: true,
        opacity: 0.9,
        top: '45%',
      },
      {
        id: 'quantum-3',
        content: '[ENCRYPT] Applying quantum cipher...',
        scramble: true,
        opacity: 0.85,
        top: '55%',
      },
      {
        id: 'quantum-4',
        content: '[SECURE] Connection established',
        scramble: true,
        opacity: 1,
        top: '65%',
      },
    ],
    duration: 6,
    glitchCount: 4,
    scrambleChars: '█▓▒░',
    showProgress: true,
    autoStart: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quantum encryption sequence with block characters.',
      },
    },
  },
}
