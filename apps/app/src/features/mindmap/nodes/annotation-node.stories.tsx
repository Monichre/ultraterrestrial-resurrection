import type {Meta, StoryObj} from '@storybook/react'
import {
  AnnotationNode,
  AnnotationNodeNumber,
  AnnotationNodeContent,
  AnnotationNodeIcon,
} from './annotation-node'

const meta: Meta<typeof AnnotationNode> = {
  title: 'Mindmap/Nodes/AnnotationNode (UI Parts)',
  component: AnnotationNode,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
}

export default meta
type Story = StoryObj<typeof AnnotationNode>

export const Basic: Story = {
  render: () => (
    <div style={{position: 'relative'}}>
      <AnnotationNode>
        <AnnotationNodeNumber>1</AnnotationNodeNumber>
        <AnnotationNodeContent>Annotated detail about this node.</AnnotationNodeContent>
        <AnnotationNodeIcon>✧</AnnotationNodeIcon>
      </AnnotationNode>
    </div>
  ),
}
