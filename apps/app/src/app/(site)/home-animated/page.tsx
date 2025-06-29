import {HomeGSAP} from '@/layouts/home/home-gsap'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Ultraterrestrial Resurrection - Animated',
  description: 'Experience the cosmos with stunning GSAP animations',
}

export default function AnimatedHomePage() {
  return <HomeGSAP />
}
