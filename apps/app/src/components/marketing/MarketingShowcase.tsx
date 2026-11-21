import './marketing.css'
import {MarketingHero} from './MarketingHero'
import {SplitBuildTools} from './SplitBuildTools'
import {TestimonialsBand} from './TestimonialsBand'

export function MarketingShowcase() {
  return (
    <div className='marketing-bg'>
      <MarketingHero title='Interact Naturally' />
      <SplitBuildTools productName='Ray-1' docsUrl='#' />
      <TestimonialsBand
        left={{name: 'Casey', role: 'Engineer'}}
        center={{
          name: 'Alex',
          quote:
            "Raycast is incrementally turning my Mac into an AI‑native operating system and I'm so here for it.",
        }}
        right={{name: 'Morgan', role: 'Designer'}}
      />
    </div>
  )
}
