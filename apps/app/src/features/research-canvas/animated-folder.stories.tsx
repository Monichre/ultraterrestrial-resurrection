import type { Meta, StoryObj } from '@storybook/react'
import AnimatedFolder from './animated-folder'

// Mock data for the stories
const sampleFolder = {
  id: '1',
  name: 'Investigation Files',
  files: [
    { id: '1-1', name: 'witness-statement.txt', type: 'file' as const, size: '32KB' },
    { id: '1-2', name: 'crime-scene.jpg', type: 'image' as const, size: '1.2MB' },
    { id: '1-3', name: 'forensic-report.pdf', type: 'file' as const, size: '145KB' },
    { id: '1-4', name: 'evidence-photo.png', type: 'image' as const, size: '2.1MB' },
  ]
}

const classifiedFolder = {
  id: '2',
  name: 'Classified Documents',
  isSecret: true,
  files: [
    { id: '2-1', name: 'top-secret.txt', type: 'file' as const, size: '16KB' },
    { id: '2-2', name: 'operation-details.enc', type: 'file' as const, size: '87KB' },
    { id: '2-3', name: 'agents-list.txt', type: 'file' as const, size: '54KB' },
  ]
}

const emptyFolder = {
  id: '3',
  name: 'Empty Archive',
  files: []
}

const meta = {
  title: 'Features/Research Canvas/AnimatedFolder',
  component: AnimatedFolder,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An animated folder component that expands to show contained files with smooth transitions and classification indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    folder: {
      control: 'object',
      description: 'Folder data containing id, name, files array, and optional isSecret flag',
    },
    onFileSelect: {
      action: 'file selected',
      description: 'Callback function when a file is selected',
    },
  },
} satisfies Meta<typeof AnimatedFolder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    folder: sampleFolder,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default animated folder with investigation files. Click to expand and see the files.',
      },
    },
  },
}

export const ClassifiedFolder: Story = {
  args: {
    folder: classifiedFolder,
  },
  parameters: {
    docs: {
      description: {
        story: 'Classified folder with security indicator and encrypted files.',
      },
    },
  },
}

export const EmptyFolder: Story = {
  args: {
    folder: emptyFolder,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty folder to show behavior when no files are present.',
      },
    },
  },
}

export const LargeFolder: Story = {
  args: {
    folder: {
      id: '4',
      name: 'Extensive Research Archive',
      files: [
        { id: '4-1', name: 'research-paper-1.pdf', type: 'file' as const, size: '2.1MB' },
        { id: '4-2', name: 'data-analysis.xlsx', type: 'file' as const, size: '856KB' },
        { id: '4-3', name: 'field-notes.txt', type: 'file' as const, size: '45KB' },
        { id: '4-4', name: 'interview-audio.mp3', type: 'file' as const, size: '12MB' },
        { id: '4-5', name: 'satellite-image.jpg', type: 'image' as const, size: '3.2MB' },
        { id: '4-6', name: 'timeline.pdf', type: 'file' as const, size: '1.8MB' },
        { id: '4-7', name: 'evidence-catalog.txt', type: 'file' as const, size: '78KB' },
        { id: '4-8', name: 'witness-photo.jpg', type: 'image' as const, size: '1.5MB' },
      ]
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Folder with many files to test scrolling and layout with extensive content.',
      },
    },
  },
}

export const MixedFileTypes: Story = {
  args: {
    folder: {
      id: '5',
      name: 'Mixed Media Archive',
      files: [
        { id: '5-1', name: 'report.docx', type: 'file' as const, size: '234KB' },
        { id: '5-2', name: 'photo1.jpg', type: 'image' as const, size: '1.1MB' },
        { id: '5-3', name: 'video.mp4', type: 'file' as const, size: '15MB' },
        { id: '5-4', name: 'screenshot.png', type: 'image' as const, size: '890KB' },
        { id: '5-5', name: 'data.json', type: 'file' as const, size: '67KB' },
      ]
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Folder containing various file types and sizes.',
      },
    },
  },
}

export const MultipleFolders: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
    <AnimatedFolder folder={ sampleFolder } />
      <AnimatedFolder folder = { classifiedFolder } />
        <AnimatedFolder folder={ emptyFolder } />
          </div>
  ),
parameters: {
  layout: 'centered',
    docs: {
    description: {
      story: 'Multiple animated folders to demonstrate independent operation.',
      },
  },
},
}

export const InFileExplorer: Story = {
  render: () => (
    <div className="w-80 bg-gray-900 text-white p-4 rounded-lg font-mono">
    <div className="border-b border-gray-700 pb-2 mb-4">
      <h3 className="text-sm font-semibold"> Case Files Explorer</h3>
  </div>
  <div className="space-y-1">
    <AnimatedFolder folder={ sampleFolder } />
      <AnimatedFolder folder = { classifiedFolder } />
        <AnimatedFolder folder={
          {
            id: '6',
              name: 'Archives',
                files: [
                  { id: '6-1', name: 'old-case.txt', type: 'file' as const, size: '23KB' },
                  { id: '6-2', name: 'backup.zip', type: 'file' as const, size: '5.2MB' },
                ]
          }
} />
  <AnimatedFolder folder = { emptyFolder } />
    </div>
    </div>
  ),
parameters: {
  layout: 'centered',
    docs: {
    description: {
      story: 'Animated folders within a file explorer interface context.',
      },
  },
},
}

export const WithFileSelection: Story = {
  args: {
    folder: sampleFolder,
    onFileSelect: ( file ) => {
      alert( `Selected file: ${file.name} (${file.size})` )
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Folder with file selection callback to demonstrate interactivity.',
      },
    },
  },
}
