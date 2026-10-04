import type {Meta, StoryObj} from '@storybook/react'

const meta: Meta = {
  title: 'Brand/Logo Gallery',
  parameters: {layout: 'centered'},
}
export default meta

type Story = StoryObj

export const Logos: Story = {
  render: () => (
    <div className='grid grid-cols-1 gap-8 p-8'>
      <div>
        <div className='text-sm text-muted-foreground mb-2'>Dark Background</div>
        <div className='bg-black p-6 rounded-md flex items-center justify-center'>
          <img src='/ultraterrestrial-logo.svg' width={160} height={160} alt='Ultraterrestrial' />
        </div>
      </div>

      <div>
        <div className='text-sm text-muted-foreground mb-2'>Dark Background (Radar)</div>
        <div className='bg-black p-6 rounded-md flex items-center justify-center'>
          <img
            src='/ultraterrestrial-logo-radar.svg'
            width={240}
            height={72}
            alt='Ultraterrestrial Radar'
          />
        </div>
      </div>

      <div>
        <div className='text-sm text-muted-foreground mb-2'>Light Background (for contrast)</div>
        <div className='bg-white p-6 rounded-md flex items-center justify-center'>
          <img
            src='/ultraterrestrial-logo-radar.svg'
            width={240}
            height={72}
            alt='Ultraterrestrial Radar'
          />
        </div>
      </div>
    </div>
  ),
}
