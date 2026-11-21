import type {Meta, StoryObj} from '@storybook/react'
import {useState} from 'react'
import {NodeDropdown} from './NodeDropdown'

function Wrapper() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{position: 'relative', width: 420, height: 360, padding: 24}}>
      <button onClick={() => setOpen((v) => !v)}>Toggle</button>
      <NodeDropdown isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}

const meta: Meta<typeof Wrapper> = {
  title: 'Documents/Toolbar/NodeDropdown',
  component: Wrapper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {}
