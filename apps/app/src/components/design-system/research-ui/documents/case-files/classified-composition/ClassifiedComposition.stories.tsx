import type {Meta, StoryObj} from '@storybook/react'
import {ClassifiedComposition} from './ClassifiedComposition'
import {Experimental} from '../../Experimental'
import {Recon} from '../../Recon'

const meta: Meta<typeof ClassifiedComposition> = {
  title: 'Documents/Case Files/ClassifiedComposition',
  component: ClassifiedComposition,
  parameters: {layout: 'fullscreen'},
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ClassifiedComposition>

export const ReconVariant: Story = {
  args: {variant: 'recon'},
}

export const ImpactVariant: Story = {
  args: {variant: 'impact'},
}

export const BlackoutVariant: Story = {
  args: {variant: 'blackout'},
}

export const DossierDemo: Story = {
  render: () => (
    <main className='min-h-screen w-full bg-[#0a0a0a] py-8 text-white'>
      <div className='mx-auto w-full max-w-6xl px-4 pb-6'>
        <h1 className='text-xs tracking-[0.35em] uppercase text-zinc-300'>
          Classified Dossier — Two Documents
        </h1>
      </div>

      {/* Document 1: Experimental (Impact preset) */}
      <Experimental />

      {/* Spacer between documents */}
      <div className='h-20' />

      {/* Document 2: Recon */}
      <Recon />

      <div className='h-20' />
    </main>
  ),
  parameters: {layout: 'fullscreen'},
}
