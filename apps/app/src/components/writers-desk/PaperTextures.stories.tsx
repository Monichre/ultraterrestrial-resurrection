'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {PaperSurface} from './PaperSurface'
import {PAPER_TEXTURE_META} from './paper-textures'

const meta = {
  title: 'Writers Desk/PaperTextures',
  parameters: {layout: 'fullscreen'},
} satisfies Meta

export default meta
type Story = StoryObj

export const Swatches: Story = {
  render: () => (
    <div className='min-h-screen space-y-10 bg-neutral-950 p-8 text-neutral-200'>
      <header>
        <p className='text-[10px] uppercase tracking-[0.2em] text-neutral-500'>Writers desk</p>
        <h1 className='mt-1 text-2xl font-medium'>Paper texture registry</h1>
        <p className='mt-2 max-w-2xl text-sm text-neutral-400'>
          Tileable stocks under <code className='text-neutral-300'>/textures/paper/</code> for real
          document tooth on desk, drafting, research, and letter sheets.
        </p>
      </header>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {PAPER_TEXTURE_META.map((tex) => (
          <figure
            key={tex.id}
            className='overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900'>
            <div
              className='h-36 w-full'
              style={{
                backgroundColor: '#111',
                backgroundImage: `url(${tex.src})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '120px 120px',
              }}
            />
            <figcaption className='space-y-1 p-4'>
              <div className='text-sm font-medium text-neutral-100'>{tex.label}</div>
              <div className='text-xs text-neutral-500'>{tex.use}</div>
              <code className='block text-[10px] text-neutral-600'>{tex.src}</code>
            </figcaption>
          </figure>
        ))}
      </div>

      <section className='space-y-4'>
        <h2 className='text-sm uppercase tracking-widest text-neutral-500'>Composed surfaces</h2>
        <div className='grid gap-4 lg:grid-cols-3'>
          <PaperSurface variant='desk' className='flex h-40 items-end rounded-xl p-4'>
            <span className='text-xs uppercase tracking-widest text-neutral-300'>desk</span>
          </PaperSurface>
          <PaperSurface variant='drafting' className='flex h-40 items-end rounded-xl p-4'>
            <span className='text-xs uppercase tracking-widest text-neutral-300'>drafting</span>
          </PaperSurface>
          <PaperSurface variant='research' className='flex h-40 items-end rounded-xl p-4'>
            <span className='text-xs uppercase tracking-widest text-neutral-700'>research</span>
          </PaperSurface>
        </div>
      </section>
    </div>
  ),
}
