import type {Meta, StoryObj} from '@storybook/react'
import {
  Card,
  CardHeader,
  CardBody,
  CardItemGroup,
  CardGroupLabel,
  CardFooter,
} from './card'

const meta = {
  title: 'Components/TiptapUIPrimitive/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card style={{width: 320}}>
      <CardBody>
        <CardGroupLabel>Label</CardGroupLabel>
        <CardItemGroup>Card content goes here</CardItemGroup>
      </CardBody>
    </Card>
  ),
}

export const FullCard: Story = {
  render: () => (
    <Card style={{width: 320}}>
      <CardHeader>Header</CardHeader>
      <CardBody>
        <CardItemGroup orientation="horizontal">
          <span>Item 1</span>
          <span>Item 2</span>
        </CardItemGroup>
      </CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  ),
}
