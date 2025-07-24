'use client'

import {useRef} from 'react'
import {
  TriggeredMeteor,
  MeteorAnimationRef,
  useTriggeredMeteor,
} from '@/components/animations/TriggeredMeteor'
import {Button} from '@/components/ui/button'
import {CosmicNavigation} from '@/components/demo-landing/cosmic-navigation'

export default function TriggeredMeteorDemo() {
  // Method 1: Using ref directly
  const meteorRef1 = useRef<MeteorAnimationRef>(null)
  const meteorRef2 = useRef<MeteorAnimationRef>(null)
  const meteorRef3 = useRef<MeteorAnimationRef>(null)

  // Method 2: Using hook
  const {
    trigger: triggerHook,
    pause: pauseHook,
    resume: resumeHook,
    reset: resetHook,
    MeteorComponent,
  } = useTriggeredMeteor({
    duration: 6,
    path: 'arc',
    onComplete: () => console.log('Hook meteor completed!'),
  })

  const eclipseImages = [
    '/assets/cosmic-portals/eclipse-1.jpg',
    '/assets/cosmic-portals/eclipse-2.jpg',
    '/assets/cosmic-portals/eclipse-3.jpg',
    '/assets/cosmic-portals/eclipse-4.jpg',
    '/assets/cosmic-portals/eclipse-5.jpg',
    '/assets/cosmic-portals/eclipse-6.jpg',
    '/assets/cosmic-portals/eclipse-7.jpg',
  ]

  return (
    <>
      <CosmicNavigation />
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 p-8'>
        <div className='max-w-4xl mx-auto space-y-8'>
          <h1 className='text-5xl font-bold text-center bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b] bg-clip-text text-transparent'>
            Triggered Meteor Animations
          </h1>

          <p className='text-xl text-white/70 text-center'>
            Click buttons to trigger meteors at specific moments
          </p>

          {/* Scenario 1: Page Transition */}
          <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10'>
            <h2 className='text-2xl font-bold text-white mb-4'>Page Transition Effect</h2>
            <p className='text-white/60 mb-4'>
              Diagonal path meteor for transitioning between pages
            </p>
            <Button
              onClick={() => meteorRef1.current?.trigger()}
              className='bg-gradient-to-r from-[#adf0dd] to-[#ff6b6b]'>
              Trigger Page Transition
            </Button>
          </div>

          {/* Scenario 2: Achievement Unlock */}
          <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10'>
            <h2 className='text-2xl font-bold text-white mb-4'>Achievement Unlock</h2>
            <p className='text-white/60 mb-4'>
              Horizontal sweep meteor for achievements or milestones
            </p>
            <Button
              onClick={() => meteorRef2.current?.trigger()}
              className='bg-gradient-to-r from-[#ff6b6b] to-[#adf0dd]'>
              Unlock Achievement
            </Button>
          </div>

          {/* Scenario 3: Data Discovery */}
          <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10'>
            <h2 className='text-2xl font-bold text-white mb-4'>Data Discovery</h2>
            <p className='text-white/60 mb-4'>
              Arc path meteor for revealing important information
            </p>
            <Button
              onClick={() => meteorRef3.current?.trigger()}
              className='bg-gradient-to-r from-purple-500 to-pink-500'>
              Discover Data
            </Button>
          </div>

          {/* Scenario 4: Using Hook */}
          <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10'>
            <h2 className='text-2xl font-bold text-white mb-4'>Hook Control</h2>
            <p className='text-white/60 mb-4'>Full control using the useTriggeredMeteor hook</p>
            <div className='flex gap-4 flex-wrap'>
              <Button onClick={triggerHook} variant='outline'>
                Trigger
              </Button>
              <Button onClick={pauseHook} variant='outline'>
                Pause
              </Button>
              <Button onClick={resumeHook} variant='outline'>
                Resume
              </Button>
              <Button onClick={resetHook} variant='outline'>
                Reset
              </Button>
            </div>
          </div>

          {/* Usage Examples */}
          <div className='bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10'>
            <h2 className='text-2xl font-bold text-white mb-4'>Integration Examples</h2>
            <pre className='text-sm text-white/60 overflow-x-auto'>
              {`// Method 1: Using ref
const meteorRef = useRef<MeteorAnimationRef>(null)

<TriggeredMeteor 
  ref={meteorRef}
  duration={8}
  path="diagonal"
  onComplete={() => router.push('/next-page')}
/>

<button onClick={() => meteorRef.current?.trigger()}>
  Trigger Animation
</button>

// Method 2: Using hook
const { trigger, MeteorComponent } = useTriggeredMeteor({
  duration: 6,
  path: 'arc',
  onComplete: () => console.log('Done!')
})

<MeteorComponent />
<button onClick={trigger}>Trigger</button>`}
            </pre>
          </div>
        </div>

        {/* Meteor Components */}
        <TriggeredMeteor
          ref={meteorRef1}
          images={eclipseImages}
          duration={8}
          path='diagonal'
          onComplete={() => console.log('Page transition complete!')}
        />

        <TriggeredMeteor
          ref={meteorRef2}
          images={eclipseImages}
          duration={6}
          path='horizontal'
          startPosition={{x: -10, y: 50}}
          endPosition={{x: 110, y: 50}}
          onComplete={() => console.log('Achievement unlocked!')}
        />

        <TriggeredMeteor
          ref={meteorRef3}
          images={eclipseImages}
          duration={7}
          path='arc'
          startPosition={{x: 10, y: 80}}
          endPosition={{x: 90, y: 20}}
          onComplete={() => console.log('Data discovered!')}
        />

        <MeteorComponent />
      </div>
    </>
  )
}
