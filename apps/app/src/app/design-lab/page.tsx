'use client'

import '@/features/mindmap/research-canvas/canvas-animations.css'

import {FeedbackOverlay} from './FeedbackOverlay'
import {VariantA} from './VariantA'
import {VariantD} from './VariantD'
import {VariantF} from './VariantF'

const PRIMARY = {
  id: 'F',
  title: 'Path + baked intelligence',
  why: 'A hierarchy HUD + D live path. Intelligence is on the active record and waypoint edges — never a card/drawer. Side nav auto-hides (apossible chrome-minimal).',
  Component: VariantF,
} as const

const COMPARISON = [
  {
    id: 'A',
    title: 'Hierarchy HUD (prior)',
    why: 'Kept for comparison — you liked the graph-primary strip; intel stamp removed in F.',
    Component: VariantA,
  },
  {
    id: 'D',
    title: 'Dynamic path tour (prior)',
    why: 'Kept for comparison — path-riding Continue; floating AI affinity moved onto edges in F.',
    Component: VariantD,
  },
] as const

export default function DesignLabPage() {
  return (
    <div className='dark min-h-screen bg-[var(--ut-void)] text-[var(--ut-paper)]'>
      <header className='border-b border-[var(--ut-line)] px-6 py-5'>
        <p className='ut-mono text-[9px] text-[var(--ut-ink-faint)]'>
          Design lab · synthesis pass · apossible.com
        </p>
        <h1 className='ut-typewriter mt-1 text-xl text-[var(--ut-paper)]'>
          GuidedTourCanvasSurface
        </h1>
        <p className='mt-2 max-w-3xl text-[13px] leading-relaxed text-[var(--ut-ink-dim)]'>
          Feedback: keep A/D, kill separate intelligence chrome, bake reading into records +
          waypoint edges, auto-hide the side menu. apossible steal:{' '}
          <strong className='text-[var(--ut-paper)]'>chrome-minimal constellation</strong> — map
          stays primary; nav peeks only when needed.
        </p>
        <ul className='mt-3 flex flex-wrap gap-2 text-[11px] text-[var(--ut-ink-faint)]'>
          <li className='rounded border border-emerald-400/35 px-2 py-0.5 text-emerald-300/90'>
            winner candidate: F
          </li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>
            intel on node + edges
          </li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>nav auto-hide</li>
          <li className='rounded border border-[var(--ut-line)] px-2 py-0.5'>
            Microfilm Dark skin
          </li>
        </ul>
      </header>

      <main className='space-y-12 px-6 py-8'>
        <section data-variant={PRIMARY.id} className='space-y-3'>
          <div className='flex items-baseline gap-3'>
            <span className='ut-mono text-[11px] text-emerald-300/90'>Variant {PRIMARY.id}</span>
            <h2 className='text-[15px] font-medium text-[var(--ut-paper)]'>{PRIMARY.title}</h2>
            <span className='ut-mono text-[8px] text-emerald-300/70'>synthesized</span>
          </div>
          <p className='max-w-3xl text-[12px] leading-relaxed text-[var(--ut-ink-dim)]'>
            <span className='ut-mono text-[8px] text-[var(--ut-ink-faint)]'>Why · </span>
            {PRIMARY.why}
          </p>
          <PRIMARY.Component />
        </section>

        <div>
          <p className='ut-mono mb-4 text-[9px] text-[var(--ut-ink-faint)]'>
            Comparison · prior picks
          </p>
          <div className='grid grid-cols-1 gap-10 lg:grid-cols-2'>
            {COMPARISON.map(({id, title, why, Component}) => (
              <section key={id} data-variant={id} className='space-y-3'>
                <div className='flex items-baseline gap-3'>
                  <span className='ut-mono text-[11px] text-[var(--ut-ink-faint)]'>
                    Variant {id}
                  </span>
                  <h2 className='text-[15px] font-medium text-[var(--ut-paper)]'>{title}</h2>
                </div>
                <p className='text-[12px] leading-relaxed text-[var(--ut-ink-dim)]'>
                  <span className='ut-mono text-[8px] text-[var(--ut-ink-faint)]'>Why · </span>
                  {why}
                </p>
                <Component />
              </section>
            ))}
          </div>
        </div>
      </main>

      <FeedbackOverlay targetName='GuidedTourCanvasSurface' />
    </div>
  )
}
