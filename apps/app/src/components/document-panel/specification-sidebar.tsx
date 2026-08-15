import {
  ACCESSIBILITY_ITEMS,
  ANATOMY_ITEMS,
  BEHAVIOR_ITEMS,
  VARIANT_ITEMS,
  type VariantItem,
} from '@/components/document-panel/lib/document-panel-data'

function ComponentHeader() {
  return (
    <header>
      <p className='spec-eyebrow'>Component</p>
      <h1 className='spec-title'>Document Panel</h1>
      <p className='spec-subtitle'>Right Rail &ndash; Primary Workspace</p>
      <p className='spec-intro'>
        The Document Panel is the primary workspace for viewing, annotating, and organizing research
        content. It surfaces the active document, connected records, notes, and quick actions in a
        single, focused panel.
      </p>
      <hr className='spec-rule' />
    </header>
  )
}

function AnatomyList() {
  return (
    <section aria-labelledby='spec-anatomy'>
      <h2 id='spec-anatomy' className='spec-section-label'>
        Anatomy
      </h2>
      <ol className='spec-list' style={{listStyle: 'none', padding: 0, margin: '11px 0 0'}}>
        {ANATOMY_ITEMS.map((item) => (
          <li key={item.number} className='spec-item'>
            <span className='spec-number'>{item.number}</span>
            <span>
              <span className='spec-item-title'>{item.title}</span>
              <span className='spec-item-desc' style={{display: 'block'}}>
                {item.description}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function VariantThumb({id}: {id: VariantItem['id']}) {
  if (id === 'collapsed') {
    return (
      <span className='spec-thumb' aria-hidden='true'>
        <span className='spec-thumb-bar' />
        <span className='spec-thumb-block' style={{height: '9px'}} />
        <span className='spec-thumb-line' />
        <span className='spec-thumb-line' />
      </span>
    )
  }
  if (id === 'reader') {
    return (
      <span className='spec-thumb' aria-hidden='true'>
        <span className='spec-thumb-bar' style={{width: '60%'}} />
        <span className='spec-thumb-block' style={{flex: '1 1 auto'}} />
      </span>
    )
  }
  return (
    <span className='spec-thumb' aria-hidden='true'>
      <span className='spec-thumb-bar' />
      <span className='spec-thumb-block' style={{height: '7px'}} />
      <span className='spec-thumb-block' style={{height: '4px'}} />
      <span className='spec-thumb-line' />
    </span>
  )
}

function VariantList() {
  return (
    <section aria-labelledby='spec-variants'>
      <h2 id='spec-variants' className='spec-section-label'>
        Variants
      </h2>
      <ul
        className='spec-list'
        style={{listStyle: 'none', padding: 0, margin: '11px 0 0', gap: '12px'}}
      >
        {VARIANT_ITEMS.map((variant) => (
          <li key={variant.id} style={{display: 'flex', gap: '11px', alignItems: 'flex-start'}}>
            <VariantThumb id={variant.id} />
            <span>
              <span className='spec-item-title'>{variant.title}</span>
              <span className='spec-item-desc' style={{display: 'block'}}>
                {variant.description}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BulletSection({id, label, items}: {id: string; label: string; items: string[]}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className='spec-section-label'>
        {label}
      </h2>
      <ul className='spec-bullets'>
        {items.map((item) => (
          <li key={item} className='spec-bullet'>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function SpecificationSidebar() {
  return (
    <aside aria-label='Document Panel specification'>
      <ComponentHeader />
      <AnatomyList />
      <VariantList />
      <BulletSection id='spec-behavior' label='Behavior' items={BEHAVIOR_ITEMS} />
      <BulletSection id='spec-accessibility' label='Accessibility' items={ACCESSIBILITY_ITEMS} />
    </aside>
  )
}
