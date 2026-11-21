'use client'

import {CosmicNavigation} from './cosmic-navigation'
import {GlowingSun} from './glowing-sun'
import {OceanReflection} from './ocean-reflection'
import {CosmicBackground} from './cosmic-background'
import {FloatingElements} from './floating-elements'
import {ScrollSystem} from './scroll-system'

export function CosmicLanding() {
  return (
    <ScrollSystem>
      <div
        className='relative h-screen w-full overflow-hidden bg-gradient-to-b absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: 'url(/EtherealSunsetGlow.png)',
        }}>
        {/* Background Elements */}
        <CosmicBackground />

        {/* Navigation */}
        <CosmicNavigation />

        {/* Main Content */}
        <div className='relative z-10 flex h-full w-full items-center justify-center'>
          {/* Central Glowing Sun */}
          <GlowingSun />
        </div>

        {/* Ocean Reflection at Bottom */}
        <OceanReflection />

        {/* Floating UI Elements */}
        <FloatingElements />
      </div>
    </ScrollSystem>
  )
}
