import './marketing.css'

export type MarketingHeroProps = {
  eyebrow?: string
  title: string
}

export function MarketingHero(props: MarketingHeroProps) {
  const {eyebrow = 'AI Extensions', title} = props
  return (
    <section className='section-hero'>
      <div className='container'>
        <div className='hero-title'>
          <div className='hero-eyebrow'>{eyebrow}</div>
          <h1 className='hero-h1'>{title}</h1>
        </div>

        <div className='preview-wrap'>
          <div className='preview'>
            <div className='preview-card'>
              <div className='row' />
              <div className='row' />
              <div className='row' />
            </div>
          </div>
        </div>

        <div className='rule-labeled'>
          <span className='pill'>AI</span>
        </div>
      </div>
    </section>
  )
}
