import type {Meta, StoryObj} from '@storybook/react'
import {useState} from 'react'
import {ModelDropdown} from './ModelDropdown'

function Wrapper() {
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState('Model')
  return (
    <div style={{position: 'relative', width: 400, height: 320, padding: 24}}>
      <div style={{position: 'relative'}}>
        <button onClick={() => setOpen((v) => !v)}>Toggle</button>
        <ModelDropdown
          isOpen={open}
          onClose={() => setOpen(false)}
          options={[
            'Topics',
            'Events',
            'Key Figures',
            'Testimonies',
            'Organizations',
            'Case Files',
            'Artifacts',
          ]}
          selectedOption={selected}
          onSelectOption={setSelected}
        />
      </div>
    </div>
  )
}

const meta: Meta<typeof Wrapper> = {
  title: 'Documents/ModelDropdown',
  component: Wrapper,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Wrapper>

export const Default: Story = {}
