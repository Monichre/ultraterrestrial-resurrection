import './marketing.css'

export type SplitBuildToolsProps = {
  title?: string
  body?: string
  docsUrl?: string
  productName?: string
}

export function SplitBuildTools(props: SplitBuildToolsProps) {
  const {
    title = 'Build the perfect tools.',
    body = 'Our extension API is designed to allow anyone with web development skills to unleash the power of the product.',
    docsUrl = '#',
    productName = 'Ray-1',
  } = props
  const bodyText = body.replace('{productName}', productName)
  return (
    <section className='section-split'>
      <div className='container'>
        <div className='split-grid'>
          <div>
            <h2 className='split-title'>{title}</h2>
            <p className='split-body'>{bodyText}</p>
            <a className='link-ghost' href={docsUrl}>
              Read the docs ↗
            </a>
          </div>
          <div />
          <div className='iso'>
            <div className='grid' />
            <div className='layer' />
            <div className='layer layer-2' />
            <div className='layer highlight' />
          </div>
        </div>
      </div>
    </section>
  )
}
