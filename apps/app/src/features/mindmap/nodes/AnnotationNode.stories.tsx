import type {Meta, StoryObj} from '@storybook/react'
import {AnnotationNode} from './AnnotationNode'

const meta: Meta<typeof AnnotationNode> = {
  title: 'Mindmap/Nodes/AnnotationNode (Legacy)',
  component: AnnotationNode,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
}

export default meta
type Story = StoryObj<typeof AnnotationNode>

export const Default: Story = {
  args: {label: 'Sample annotation', level: 1, arrowStyle: {variant: 'curved'}} as any,
}
