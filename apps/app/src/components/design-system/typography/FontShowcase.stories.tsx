import type {Meta, StoryObj} from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Typography/Font Showcase',
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj

const sample = 'The quick brown fox jumps over the lazy dog — 1234567890'

export const AllFonts: Story = {
  render: () => (
    <div className='space-y-6 p-8 max-w-3xl'>
      <section>
        <h3 className='text-xl font-semibold mb-2'>Primary Families</h3>
        <div className='space-y-2'>
          <div className='font-monument text-2xl'>Monument Grotesk — {sample}</div>
          <div className='font-monument-mono'>Monument Grotesk Mono — {sample}</div>
          <div className='font-neue-haas'>Neue Haas Grotesk — {sample}</div>
          <div className='font-lukas'>Lukas Sans — {sample}</div>
        </div>
      </section>

      <section>
        <h3 className='text-xl font-semibold mb-2'>Alternates & Fallbacks</h3>
        <div className='space-y-2'>
          <div className='font-pp-neue-montreal'>PP Neue Montreal — {sample}</div>
          <div className='font-noto-sans'>Noto Sans — {sample}</div>
          <div className='font-jetbrains-mono'>JetBrains Mono — {sample}</div>
          <div className='font-martian-mono'>Martian Mono — {sample}</div>
        </div>
      </section>

      <section>
        <h3 className='text-xl font-semibold mb-2'>Display / Handwriting</h3>
        <div className='space-y-2'>
          <div className='font-anton uppercase tracking-widest'>Anton — {sample}</div>
          <div className='font-just-another-hand text-2xl'>Just Another Hand — {sample}</div>
          <div className='font-special-elite'>Special Elite — {sample}</div>
        </div>
      </section>
    </div>
  ),
}
