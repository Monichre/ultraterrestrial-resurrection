import {Home} from '@/layouts/home'
import {Suspense} from 'react'

export default async function Index() {
  return (
    <div className='h-[100vh] overflow-hidden'>
      <Suspense>
        <Home />
        {/* </Suspense> */}
      </Suspense>
    </div>
  )
}

// Behavior Patterns	Classifying observed behaviors
// Physical Characteristics	Analyzing different physical traits
// Impact + Human Interaction	Examining the effects on humans
// Historical Perspectives	Interactions across historical periods
// Scientific Theories	Exploring various scientific explanations
// Legal + Policy	Laws, regulations, and policies
// Ethical Considerations	Communication and  intervention
// Public Perception	Media, public opinion, and pop culture
// Origins and Intent	Comprehensive view of current theories
