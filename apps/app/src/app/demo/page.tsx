import {CosmicLanding} from '@/components/demo-landing/cosmic-landing'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Cosmic Demo Landing | Ultraterrestrial',
  description: 'A cosmic-inspired demo landing page with glowing celestial effects',
}

export default function DemoPage() {
  return <CosmicLanding />
}
