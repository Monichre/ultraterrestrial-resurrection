import type {Meta, StoryObj} from '@storybook/react'
import AnimatedFolder from './animated-folder'

const meta: Meta<typeof AnimatedFolder> = {
  title: 'Case Files/Evidence/AnimatedFolder',
  component: AnimatedFolder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AnimatedFolder>

export const Default: Story = {
  args: {
    folder: {
      id: '1',
      name: 'Case Evidence',
      files: [
        {id: '1-1', name: 'witness-statement.txt', type: 'file', size: '32KB'},
        {id: '1-2', name: 'crime-scene.jpg', type: 'image', size: '1.2MB'},
        {id: '1-3', name: 'forensic-report.txt', type: 'file', size: '145KB'},
      ],
    },
  },
}

export const ClassifiedFolder: Story = {
  args: {
    folder: {
      id: '2',
      name: 'Classified Documents',
      isSecret: true,
      files: [
        {id: '2-1', name: 'top-secret.txt', type: 'file', size: '16KB'},
        {id: '2-2', name: 'operation-details.txt', type: 'file', size: '87KB'},
        {id: '2-3', name: 'agents-list.txt', type: 'file', size: '54KB'},
      ],
    },
  },
}

export const EmptyFolder: Story = {
  args: {
    folder: {
      id: '3',
      name: 'Empty Folder',
      files: [],
    },
  },
}
