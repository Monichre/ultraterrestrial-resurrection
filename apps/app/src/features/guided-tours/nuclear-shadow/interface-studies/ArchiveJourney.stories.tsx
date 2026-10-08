import type {Meta, StoryObj} from '@storybook/nextjs'
import {expect, fireEvent, userEvent, within} from 'storybook/test'
import {ArchiveJourney} from './ArchiveJourney'

const meta = {
  title: 'Guided Tours/Nuclear Shadow/User Journey',
  component: ArchiveJourney,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Read the visual foundation → enter Trinity → inspect basis and counterpoint → follow the disclosure → examine report layers and slide the mask → keep a next trace → revisit any interface with local notes intact.',
      },
    },
  },
  render: (args) => <ArchiveJourney key={args.initialInterface} {...args} />,
  argTypes: {
    initialInterface: {control: 'select', options: ['foundation', 'trinity', 'disclosure']},
  },
} satisfies Meta<typeof ArchiveJourney>
export default meta
type Story = StoryObj<typeof meta>

export const FullJourney: Story = {args: {initialInterface: 'foundation'}}
export const StartAtTrinity: Story = {args: {initialInterface: 'trinity'}}
export const StartAtDisclosure: Story = {args: {initialInterface: 'disclosure'}}
export const InteractionCheck: Story = {
  args: {initialInterface: 'foundation'},
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.selectOptions(canvas.getByRole('combobox', {name: 'Read section'}), 'color')
    await expect(canvas.getByRole('heading', {name: 'Color system'})).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', {name: 'Enter Trinity →'}))
    const trinity = within(canvas.getByRole('region', {name: 'Trinity'}))
    await userEvent.click(trinity.getByRole('button', {name: 'Inspect the Trinity basis'}))
    await expect(trinity.getByRole('heading', {name: 'Basis'})).toBeInTheDocument()
    await userEvent.click(trinity.getByRole('button', {name: 'counterpoint'}))
    await expect(trinity.getByRole('heading', {name: 'Counterpoint'})).toBeInTheDocument()
    await userEvent.type(
      trinity.getByRole('textbox', {name: 'Next trace'}),
      'Compare the test record with the released account.'
    )
    await userEvent.click(trinity.getByRole('button', {name: 'Follow the disclosure →'}))
    const disclosure = within(canvas.getByRole('region', {name: 'Controlled Revelation'}))
    await userEvent.click(disclosure.getByRole('button', {name: 'Withheld mechanisms'}))
    await expect(disclosure.getByRole('heading', {name: 'Technical boundary'})).toBeInTheDocument()
    const slider = disclosure.getByRole('slider', {name: /Disclosure mask/})
    // user-event does not implement range-key selection; browser keyboard behavior is audited separately.
    fireEvent.change(slider, {target: {value: '100'}})
    await expect(slider).toHaveValue('100')
    await userEvent.click(canvas.getByRole('button', {name: '02 / Trinity · The Threshold Event'}))
    await expect(trinity.getByRole('textbox', {name: 'Next trace'})).toHaveValue(
      'Compare the test record with the released account.'
    )
  },
}
