import type {Meta, StoryObj} from '@storybook/react'
import {HomeIcon, Sparkles, LibraryBig, Crosshair} from 'lucide-react'
import {NavBar, InAppNavbar} from './navbar'

const navLinks = [
  {name: 'Home', link: '/', icon: <HomeIcon strokeWidth={1} />},
  {name: 'Explore', link: '/explore', icon: <Sparkles strokeWidth={1} />},
  {name: 'History', link: '/history', icon: <LibraryBig strokeWidth={1} />},
  {name: 'Sightings', link: '/sightings', icon: <Crosshair strokeWidth={1} />},
]

const meta = {
  title: 'Components/Navbar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof NavBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    links: navLinks,
  },
}

export const InApp: Story = {
  render: () => <InAppNavbar color='white' links={navLinks} />,
}
