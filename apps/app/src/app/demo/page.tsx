import {Metadata} from 'next'
import Link from 'next/link'
import {CosmicNavigation} from '@/components/demo-landing/cosmic-navigation'

export const metadata: Metadata = {
  title: 'Animation Demos | Ultraterrestrial',
  description: 'Explore cosmic animations and 3D visualizations',
}

const demos = [
  {
    title: 'Cosmic Portal',
    description: 'Epic dimensional portal sequence with eclipse morphing',
    path: '/demo/cosmic-portal',
    category: 'Portal Effects',
    difficulty: 'Advanced',
    features: ['Full-screen overlay', 'Eclipse morphing', 'Galactic sequence'],
  },
  {
    title: 'Meteor Showcase',
    description: 'Dual 2D/3D meteor animations with particle effects',
    path: '/demo/meteor-showcase',
    category: 'Meteor Effects',
    difficulty: 'Intermediate',
    features: ['2D GSAP animation', '3D React Three Fiber', 'Particle trails'],
  },
  {
    title: 'Morphing Meteor',
    description: 'Single meteor morphing through eclipse forms',
    path: '/demo/morphing-meteor',
    category: 'Meteor Effects',
    difficulty: 'Beginner',
    features: ['GSAP animation', 'Texture morphing', 'Space travel'],
  },
  {
    title: 'Triggered 3D Meteor',
    description: 'Interactive 3D meteors with multiple path options',
    path: '/demo/triggered-3d-meteor',
    category: 'Interactive 3D',
    difficulty: 'Advanced',
    features: ['Multiple paths', 'Real-time controls', 'Orbital mechanics'],
  },
  {
    title: 'Triggered Meteor',
    description: '2D triggered meteors for UI interactions',
    path: '/demo/triggered-meteor',
    category: 'UI Effects',
    difficulty: 'Intermediate',
    features: ['Event-driven', 'Multiple scenarios', 'Hook-based control'],
  },
]

export default function DemoPage() {
  return (
    <>
      <CosmicNavigation />
      <div className='min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900'>
        <div className='container mx-auto px-4 py-12'>
          {/* Header */}
          <div className='text-center mb-16'>
            <h1 className='text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[#adf0dd] via-white to-[#ff6b6b] bg-clip-text text-transparent'>
              Animation Demos
            </h1>
            <p className='text-xl md:text-2xl text-white/70 max-w-3xl mx-auto'>
              Explore cosmic animations powered by Three.js, React Three Fiber, and GSAP
            </p>
          </div>

          {/* Demo Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
            {demos.map((demo, index) => (
              <Link key={demo.path} href={demo.path} className='group block'>
                <div className='bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10'>
                  {/* Header */}
                  <div className='mb-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm text-[#adf0dd] font-medium'>{demo.category}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          demo.difficulty === 'Beginner'
                            ? 'bg-green-500/20 text-green-400'
                            : demo.difficulty === 'Intermediate'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                        {demo.difficulty}
                      </span>
                    </div>
                    <h3 className='text-2xl font-bold text-white group-hover:text-[#adf0dd] transition-colors'>
                      {demo.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className='text-white/60 mb-6 leading-relaxed'>{demo.description}</p>

                  {/* Features */}
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-white/80'>Features:</h4>
                    <ul className='space-y-1'>
                      {demo.features.map((feature, idx) => (
                        <li key={idx} className='text-sm text-white/50 flex items-center'>
                          <span className='w-1.5 h-1.5 bg-[#adf0dd] rounded-full mr-2'></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className='mt-6 pt-4 border-t border-white/10'>
                    <div className='text-[#adf0dd] font-medium group-hover:text-white transition-colors'>
                      Launch Demo →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer Info */}
          <div className='mt-16 text-center'>
            <div className='bg-black/30 backdrop-blur-md rounded-xl p-8 border border-white/10 max-w-4xl mx-auto'>
              <h3 className='text-xl font-bold text-white mb-4'>Technical Stack</h3>
              <div className='grid md:grid-cols-3 gap-6 text-sm'>
                <div>
                  <h4 className='font-medium text-[#adf0dd] mb-2'>3D Graphics</h4>
                  <p className='text-white/60'>Three.js, React Three Fiber, @react-three/drei</p>
                </div>
                <div>
                  <h4 className='font-medium text-[#adf0dd] mb-2'>Animations</h4>
                  <p className='text-white/60'>GSAP, Framer Motion, CSS Transitions</p>
                </div>
                <div>
                  <h4 className='font-medium text-[#adf0dd] mb-2'>Framework</h4>
                  <p className='text-white/60'>Next.js 15, React 19, TypeScript</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
