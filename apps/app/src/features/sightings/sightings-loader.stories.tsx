import type {Meta, StoryObj} from '@storybook/react'
import {SightingsLoader} from './sightings-loader'
import {useState} from 'react'

const meta = {
  title: 'Pages/Sightings/SightingsLoader',
  component: SightingsLoader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#000000'}]},
    chromatic: {
      delay: 1000,
      pauseAnimationAtEnd: true,
    },
  },
  argTypes: {
    minDisplayTime: {
      control: {type: 'number', min: 1000, max: 10000, step: 500},
      description: 'Minimum time to display the loader in ms',
    },
    onLoadComplete: {
      action: 'loadComplete',
      description: 'Callback when loading completes',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000000',
        }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SightingsLoader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    minDisplayTime: 2500,
  },
}

export const QuickLoad: Story = {
  args: {
    minDisplayTime: 1000,
  },
}

export const SlowLoad: Story = {
  args: {
    minDisplayTime: 5000,
  },
}

// Interactive story with callback
export const WithCallback: Story = {
  render: function InteractiveLoader(args) {
    const [completed, setCompleted] = useState(false)

    return (
      <div>
        {!completed ? (
          <SightingsLoader
            {...args}
            onLoadComplete={() => {
              setCompleted(true)
              args.onLoadComplete?.()
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
            }}>
            Loading Complete! ✓
          </div>
        )}
      </div>
    )
  },
  args: {
    minDisplayTime: 2500,
  },
}
