import type {Meta, StoryObj} from '@storybook/react'
import {DatabaseSchemaNode} from './database-schema-node'

const meta: Meta<typeof DatabaseSchemaNode> = {
  title: 'Mindmap/Nodes/DatabaseSchemaNode',
  component: DatabaseSchemaNode as any,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DatabaseSchemaNode>

export const Default: Story = {
  // Cast to any to satisfy NodeProps shape in story context
  render: () =>
    (DatabaseSchemaNode as any)({
      id: 'schema-1',
      type: 'databaseSchemaNode',
      data: {
        label: 'events',
        schema: [
          {title: 'id', type: 'string'},
          {title: 'title', type: 'string'},
          {title: 'date', type: 'string'},
        ],
      },
      selected: false,
      dragging: false,
      zIndex: 0,
      selectable: true,
      deletable: true,
      draggable: true,
      isConnectable: false,
      positionAbsolute: {x: 0, y: 0},
      width: 400,
      height: 240,
    }),
}
