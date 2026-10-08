import type {Meta, StoryObj} from '@storybook/nextjs'
import {ArchiveInterfaceStudy} from './ArchiveInterfaceStudy'

const meta = {
  title: 'Guided Tours/Nuclear Shadow/Attached Interfaces',
  component: ArchiveInterfaceStudy,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive studies of the three user-selected reference plates. Original artwork preserves the visual direction; HTML controls expose the eleven foundation sections, waypoint readings, document layers, and illustrative disclosure mask. Narrative follows the existing tour definition. These stories do not assert that the fictional report in the reference image is an archival source.',
      },
    },
  },
  render: (args) => (
    <ArchiveInterfaceStudy
      key={`${args.interfaceId}-${args.initialDisclosure}-${args.initialLayer}`}
      {...args}
      onNext={undefined}
    />
  ),
  argTypes: {
    interfaceId: {control: 'select', options: ['foundation', 'trinity', 'disclosure']},
    initialDisclosure: {control: {type: 'range', min: 0, max: 100, step: 1}},
    initialLayer: {control: 'select', options: ['approved', 'mechanisms', 'context']},
  },
} satisfies Meta<typeof ArchiveInterfaceStudy>
export default meta
type Story = StoryObj<typeof meta>

export const VisualFoundation: Story = {args: {interfaceId: 'foundation'}}
export const Trinity: Story = {args: {interfaceId: 'trinity'}}
export const PublicRelease: Story = {
  args: {interfaceId: 'disclosure', initialDisclosure: 0, initialLayer: 'approved'},
}
export const ControlledDisclosure: Story = {
  args: {interfaceId: 'disclosure', initialDisclosure: 50, initialLayer: 'mechanisms'},
}
export const RestrictedContext: Story = {
  args: {interfaceId: 'disclosure', initialDisclosure: 100, initialLayer: 'context'},
}
