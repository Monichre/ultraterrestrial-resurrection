import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useGSAPTimeline } from './use-gsap-timeline'
import './use-gsap-timeline.stories.css'

const meta = {
  title: 'Animations/Hooks/useGSAPTimeline',
  component: () => null,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Custom hook for managing GSAP timelines with React lifecycle.
Handles cleanup and provides timeline controls.

## Features

- **Automatic cleanup** on component unmount
- **Timeline controls**: play, pause, restart, reverse, seek, progress
- **Event callbacks**: onComplete, onStart, onUpdate, onRepeat, onReverseComplete
- **TypeScript support** with full type definitions
- **React lifecycle integration**

## Basic Usage

\`\`\`tsx
const { timeline, play, pause } = useGSAPTimeline({
  paused: true,
  onComplete: () => console.log('Animation complete')
});

useEffect(() => {
  if (timeline) {
    timeline.to('.element', { x: 100 });
    play();
  }
}, [timeline]);
\`\`\`
        `,
      },
    },
  },
  tags: ['animation', 'hooks', 'gsap'],
} satisfies Meta<typeof useGSAPTimeline>

export default meta
type Story = StoryObj<typeof meta>

// Basic timeline control demo
export const Basic: Story = {
  render: () => {
    const { timeline, play, pause, restart, reverse, progress, isActive, kill } = useGSAPTimeline({
      paused: true,
      onComplete: () => console.log('Timeline complete'),
    })

    React.useEffect(() => {
      if (timeline) {
        timeline
          .to('.box', { x: 200, duration: 1, ease: 'power2.inOut' })
          .to('.box', { y: 100, duration: 1, ease: 'power2.inOut' })
          .to('.box', { rotation: 360, duration: 1, ease: 'power2.inOut' })
          .to('.box', { scale: 1.5, duration: 0.5, ease: 'back.out(1.7)' })
      }
    }, [timeline])

    return (
      <div className="demo-container">
        <div className="box" />
        <div className="controls">
          <button onClick={play}>Play</button>
          <button onClick={pause}>Pause</button>
          <button onClick={restart}>Restart</button>
          <button onClick={reverse}>Reverse</button>
          <button onClick={() => progress(0)}>Reset</button>
          <button onClick={() => progress(0.5)}>50%</button>
          <button onClick={() => progress(1)}>100%</button>
          <span>Status: {isActive() ? 'Playing' : 'Paused'}</span>
        </div>
      </div>
    )
  },
}

// Timeline with callbacks
export const WithCallbacks: Story = {
  render: () => {
    const [status, setStatus] = useState('Ready')
    const [events, setEvents] = useState<string[]>([])

    const addEvent = (event: string) => {
      setEvents(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${event}`])
    }

    const { timeline, play, pause, restart } = useGSAPTimeline({
      paused: true,
      onStart: () => {
        setStatus('Started')
        addEvent('Timeline started')
      },
      onComplete: () => {
        setStatus('Complete')
        addEvent('Timeline completed')
      },
      onUpdate: () => {
        if (timeline) {
          const progress = timeline.progress()
          if (Math.floor(progress * 10) === 5 && !events.includes('50% milestone')) {
            addEvent('50% milestone reached')
          }
        }
      },
      onReverseComplete: () => {
        setStatus('Reverse Complete')
        addEvent('Timeline reversed')
      },
    })

    React.useEffect(() => {
      if (timeline) {
        timeline
          .to('.box', { x: 150, duration: 2, ease: 'power1.inOut' })
          .to('.circle', { y: -100, duration: 1.5, ease: 'bounce.out' }, '-=1')
          .to('.box', { rotation: 180, duration: 1 }, '-=0.5')
      }
    }, [timeline])

    return (
      <div className="demo-container">
        <div className="shapes">
          <div className="box" />
          <div className="circle" />
        </div>
        <div className="controls">
          <button onClick={play}>Play</button>
          <button onClick={pause}>Pause</button>
          <button onClick={restart}>Restart</button>
          <div className="status">Status: {status}</div>
        </div>
        <div className="events">
          <h4>Events:</h4>
          {events.map((event, i) => (
            <div key={i} className="event">
              {event}
            </div>
          ))}
        </div>
      </div>
    )
  },
}

// Multiple timeline demo
export const MultipleTimelines: Story = {
  render: () => {
    const timeline1 = useGSAPTimeline({ paused: true })
    const timeline2 = useGSAPTimeline({ paused: true })
    const timeline3 = useGSAPTimeline({ paused: true })

    React.useEffect(() => {
      if (timeline1.timeline) {
        timeline1.timeline.to('.box-1', { x: 100, duration: 1 })
      }
    }, [timeline1.timeline])

    React.useEffect(() => {
      if (timeline2.timeline) {
        timeline2.timeline.to('.box-2', { y: 100, duration: 1 })
      }
    }, [timeline2.timeline])

    React.useEffect(() => {
      if (timeline3.timeline) {
        timeline3.timeline.to('.box-3', { rotation: 180, duration: 1 })
      }
    }, [timeline3.timeline])

    const playAll = () => {
      timeline1.play()
      setTimeout(() => timeline2.play(), 200)
      setTimeout(() => timeline3.play(), 400)
    }

    return (
      <div className="demo-container">
        <div className="multiple-boxes">
          <div className="box box-1" />
          <div className="box box-2" />
          <div className="box box-3" />
        </div>
        <div className="controls">
          <button onClick={playAll}>Play All (Staggered)</button>
          <button onClick={() => timeline1.restart()}>Restart 1</button>
          <button onClick={() => timeline2.restart()}>Restart 2</button>
          <button onClick={() => timeline3.restart()}>Restart 3</button>
        </div>
      </div>
    )
  },
}

// Interactive scrubbing demo
export const InteractiveScrubbing: Story = {
  render: () => {
    const { timeline } = useGSAPTimeline({ paused: true })
    const [timelineProgress, setTimelineProgress] = useState(0)

    React.useEffect(() => {
      if (timeline) {
        timeline
          .to('.box', { x: 200, duration: 2 })
          .to('.box', { y: 150, duration: 2 })
          .to('.box', { scale: 1.5, duration: 1 })
          .to('.box', { rotation: 360, duration: 2 })
      }
    }, [timeline])

    const handleProgressChange = (value: number) => {
      setTimelineProgress(value)
      if (timeline) {
        timeline.progress(value)
      }
    }

    return (
      <div className="demo-container">
        <div className="box" />
        <div className="scrubber">
          <label>Progress: {Math.round(timelineProgress * 100)}%</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={timelineProgress}
            onChange={(e) => handleProgressChange(parseFloat(e.target.value))}
            style={{ width: '300px' }}
          />
          <div className="timeline-marks">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    )
  },
}
