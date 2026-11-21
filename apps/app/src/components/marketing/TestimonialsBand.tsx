import './marketing.css'

export type Testimonial = {
  name?: string
  role?: string
  quote?: string
}

export type TestimonialsBandProps = {
  heading?: string
  sub?: string
  left: Testimonial
  center: Testimonial
  right: Testimonial
}

export function TestimonialsBand(props: TestimonialsBandProps) {
  const {
    heading = 'Built for professionals like you.',
    sub = 'Used by seriously productive people.',
    left,
    center,
    right,
  } = props
  return (
    <section className='section-testimonials'>
      <div className='container'>
        <header className='testi-head'>
          <h3 className='text-[24px] leading-[32px] font-semibold'>{heading}</h3>
          <p className='testi-sub'>{sub}</p>
        </header>
        <div className='cards'>
          <article className='card'>
            <div className='avatar' />
            <div>
              <div className='text-[15px] text-[var(--text-0)] font-medium'>{left.name}</div>
              {left.role && <div className='text-[14px] text-[var(--text-2)]'>{left.role}</div>}
            </div>
          </article>
          <article className='card center'>
            <div className='avatar' />
            <div className='quote'>
              {center.quote ??
                'Raycast is incrementally turning my Mac into an AI‑native operating system.'}
            </div>
          </article>
          <article className='card'>
            <div className='avatar' />
            <div>
              <div className='text-[15px] text-[var(--text-0)] font-medium'>{right.name}</div>
              {right.role && <div className='text-[14px] text-[var(--text-2)]'>{right.role}</div>}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
