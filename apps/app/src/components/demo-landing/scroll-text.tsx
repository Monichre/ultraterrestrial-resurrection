'use client'

import {useEffect, useState} from 'react'

interface ScrollTextProps {
  scrollProgress: number
}

export function ScrollText({scrollProgress}: ScrollTextProps) {
  const [awarenessState, setAwarenessState] = useState('')
  const [becomingState, setBecomingState] = useState('')
  const [energyState, setEnergyState] = useState('')
  const [presenceState, setPresenceState] = useState('')

  useEffect(() => {
    const freq1 = (432 + scrollProgress * 108).toFixed(1)
    const freq2 = (528 - scrollProgress * 156).toFixed(1)
    const energy = (scrollProgress * 99.9).toFixed(1)
    const presence = ((1 - scrollProgress) * 100).toFixed(1)

    let awareness, becoming, energyText, presenceText

    if (scrollProgress <= 0.1) {
      awareness = `[${freq1}] AWARENESS: SILENCE`
      becoming = `.${freq2} STATE: VOID`
      energyText = `{${energy}} ENERGY: DORMANT`
    } else if (scrollProgress <= 0.25) {
      awareness = `[${freq1}] AWARENESS: STIRRING`
      becoming = `.${freq2} STATE: EMERGING`
      energyText = `{${energy}} ENERGY: AWAKENING`
    } else if (scrollProgress <= 0.5) {
      awareness = `[${freq1}] AWARENESS: FLOWING`
      becoming = `.${freq2} STATE: EXPANDING`
      energyText = `{${energy}} ENERGY: BUILDING`
    } else if (scrollProgress <= 0.75) {
      awareness = `[${freq1}] AWARENESS: ASCENDING`
      becoming = `.${freq2} STATE: DISSOLVING`
      energyText = `{${energy}} ENERGY: RADIATING`
    } else if (scrollProgress <= 0.9) {
      awareness = `[${freq1}] AWARENESS: TRANSCENDING`
      becoming = `.${freq2} STATE: INFINITE`
      energyText = `{${energy}} ENERGY: OVERFLOWING`
    } else {
      awareness = `[${freq1}] AWARENESS: UNITY`
      becoming = `.${freq2} STATE: ETERNAL`
      energyText = `{${energy}} ENERGY: PURE`
    }

    const presenceIntensity = Math.max(0, 1 - scrollProgress)
    if (presenceIntensity > 0.8) {
      presenceText = `.${presence} PRESENCE: SOLID`
    } else if (presenceIntensity > 0.6) {
      presenceText = `.${presence} PRESENCE: SOFTENING`
    } else if (presenceIntensity > 0.4) {
      presenceText = `.${presence} PRESENCE: TRANSLUCENT`
    } else if (presenceIntensity > 0.2) {
      presenceText = `.${presence} PRESENCE: ETHEREAL`
    } else {
      presenceText = `.${presence} PRESENCE: VOID`
    }

    setAwarenessState(awareness)
    setBecomingState(becoming)
    setEnergyState(energyText)
    setPresenceState(presenceText)
  }, [scrollProgress])

  const textOpacity = Math.max(0, 1 - scrollProgress * 2)

  return (
    <>
      {/* Corner Debug Text */}
      <div
        className='fixed top-8 left-8 z-40 font-mono text-xs tracking-wider text-white/60 space-y-1 transition-opacity duration-300'
        style={{opacity: textOpacity}}>
        <div className='geometric-text'>{awarenessState}</div>
        <div className='geometric-text'>{becomingState}</div>
        <div className='geometric-text'>{energyState}</div>
        <div className='geometric-text'>{presenceState}</div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className='fixed top-8 right-8 z-40 font-mono text-xs tracking-wider text-white/60'>
        <div className='geometric-text'>PROGRESS: {(scrollProgress * 100).toFixed(1)}%</div>
      </div>

      {/* Bottom Status Bar */}
      <div
        className='fixed bottom-8 left-8 right-8 z-40 font-mono text-xs tracking-wider text-white/40 transition-opacity duration-300'
        style={{opacity: textOpacity}}>
        <div className='flex justify-between items-center'>
          <div className='geometric-text'>
            FREQUENCY MODULATION: {scrollProgress > 0.5 ? 'ACTIVE' : 'STANDBY'}
          </div>
          <div className='geometric-text'>
            DIMENSIONAL SHIFT: {scrollProgress > 0.75 ? 'COMPLETE' : 'IN PROGRESS'}
          </div>
        </div>
      </div>

      {/* Center Status Messages */}
      <div className='fixed inset-0 z-30 pointer-events-none flex items-center justify-center'>
        {scrollProgress > 0.95 && (
          <div className='text-center text-white animate-pulse'>
            <div className='text-2xl md:text-4xl font-light tracking-wider mb-2 opacity-80'>
              TRANSCENDENCE ACHIEVED
            </div>
            <div className='text-sm md:text-lg tracking-wider opacity-60'>
              CONSCIOUSNESS EXPANDED
            </div>
          </div>
        )}
      </div>
    </>
  )
}
