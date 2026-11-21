/**
 * AnimatedMenu Component Stories
 *
 * Full-screen animated menu with clip-path reveals
 */

import type {Meta, StoryObj} from '@storybook/react'
import {AnimatedMenu, type MenuItem} from './animated-menu'

// ============================================================================
// Meta Configuration
// ============================================================================

const meta: Meta<typeof AnimatedMenu> = {
  title: 'Animations/Components/AnimatedMenu',
  component: AnimatedMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`AnimatedMenu\` is a full-screen overlay menu with sophisticated clip-path animations and split-text hover effects.

## Features
- Full-screen overlay with clip-path reveal
- Featured background image
- Split-text hover animations on links
- Staggered item animations
- Configurable duration and timing
- Custom brand logo and footer
- OnOpen/OnClose callbacks

## Usage
\`\`\`tsx
<AnimatedMenu
  items={[
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' }
  ]}
  featuredImage="/bg.jpg"
  brandLogo={<Logo />}
  onItemClick={(item) => console.log(item)}
>
  <YourContent />
</AnimatedMenu>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: {type: 'range', min: 0.3, max: 1.5, step: 0.1},
      description: 'Animation duration in seconds',
    },
    stagger: {
      control: {type: 'range', min: 0.02, max: 0.2, step: 0.01},
      description: 'Stagger delay between menu items',
    },
    menuButtonLabel: {
      control: 'text',
      description: 'Menu button label',
    },
    closeButtonLabel: {
      control: 'text',
      description: 'Close button label',
    },
  },
}

export default meta
type Story = StoryObj<typeof AnimatedMenu>

// ============================================================================
// Default Content
// ============================================================================

const defaultItems: MenuItem[] = [
  {id: '1', label: 'Home', href: '/'},
  {id: '2', label: 'About', href: '/about'},
  {id: '3', label: 'Projects', href: '/projects'},
  {id: '4', label: 'Contact', href: '/contact'},
]

const DefaultContent = () => (
  <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
    <div className='text-center'>
      <h1 className='text-6xl font-bold mb-4'>Main Content</h1>
      <p className='text-xl text-gray-400'>Click the menu button in the top right</p>
    </div>
  </div>
)

// ============================================================================
// Stories
// ============================================================================

export const Basic: Story = {
  args: {
    items: defaultItems,
    children: <DefaultContent />,
  },
}

export const WithFeaturedImage: Story = {
  args: {
    items: defaultItems,
    featuredImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with featured background image.',
      },
    },
  },
}

export const CustomBrandLogo: Story = {
  args: {
    items: defaultItems,
    brandLogo: (
      <div className='text-2xl font-bold text-white flex items-center gap-2'>
        <svg width='32' height='32' viewBox='0 0 32 32' fill='currentColor'>
          <circle cx='16' cy='16' r='12' />
        </svg>
        ULTRATERRESTRIAL
      </div>
    ),
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with custom brand logo component.',
      },
    },
  },
}

export const WithFooter: Story = {
  args: {
    items: defaultItems,
    footer: (
      <div className='flex gap-6 text-white/60 text-sm'>
        <a href='https://twitter.com' className='hover:text-white'>
          Twitter
        </a>
        <a href='https://github.com' className='hover:text-white'>
          GitHub
        </a>
        <a href='https://linkedin.com' className='hover:text-white'>
          LinkedIn
        </a>
        <span>© 2025 All Rights Reserved</span>
      </div>
    ),
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with footer content.',
      },
    },
  },
}

export const FastAnimation: Story = {
  args: {
    items: defaultItems,
    duration: 0.4,
    stagger: 0.04,
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick animation with fast duration and stagger.',
      },
    },
  },
}

export const SlowAnimation: Story = {
  args: {
    items: defaultItems,
    duration: 1.2,
    stagger: 0.15,
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Slow, dramatic animation.',
      },
    },
  },
}

export const ManyItems: Story = {
  args: {
    items: [
      {id: '1', label: 'Home', href: '/'},
      {id: '2', label: 'About', href: '/about'},
      {id: '3', label: 'Services', href: '/services'},
      {id: '4', label: 'Portfolio', href: '/portfolio'},
      {id: '5', label: 'Team', href: '/team'},
      {id: '6', label: 'Blog', href: '/blog'},
      {id: '7', label: 'Contact', href: '/contact'},
      {id: '8', label: 'Careers', href: '/careers'},
    ],
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with many navigation items.',
      },
    },
  },
}

export const UFO_ResearchMenu: Story = {
  args: {
    items: [
      {id: '1', label: 'Sightings', href: '/sightings'},
      {id: '2', label: 'Testimonies', href: '/testimonies'},
      {id: '3', label: 'Documents', href: '/documents'},
      {id: '4', label: 'Timeline', href: '/timeline'},
      {id: '5', label: 'Research', href: '/research'},
    ],
    featuredImage: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&q=80',
    brandLogo: <div className='text-2xl font-bold text-white'>UAP DATABASE</div>,
    footer: (
      <div className='text-white/60 text-sm'>
        <p>Disclosure Project • 2025</p>
      </div>
    ),
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'UFO/UAP research themed menu.',
      },
    },
  },
}

export const CustomButtonLabels: Story = {
  args: {
    items: defaultItems,
    menuButtonLabel: 'OPEN MENU',
    closeButtonLabel: 'CLOSE MENU',
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with custom button labels.',
      },
    },
  },
}

export const WithCallbacks: Story = {
  args: {
    items: defaultItems,
    onOpen: () => console.log('Menu opened!'),
    onClose: () => console.log('Menu closed!'),
    onItemClick: (item) => console.log('Clicked:', item.label),
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with onOpen, onClose, and onItemClick callbacks (check console).',
      },
    },
  },
}

export const CompleteExample: Story = {
  args: {
    items: [
      {id: '1', label: 'Discover', href: '/discover'},
      {id: '2', label: 'Research', href: '/research'},
      {id: '3', label: 'Timeline', href: '/timeline'},
      {id: '4', label: 'Evidence', href: '/evidence'},
      {id: '5', label: 'Contact', href: '/contact'},
    ],
    featuredImage: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&q=80',
    brandLogo: (
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full' />
        <span className='text-2xl font-bold'>ULTRATERRESTRIAL</span>
      </div>
    ),
    footer: (
      <div className='flex flex-col gap-4 text-white/60'>
        <div className='flex gap-6'>
          <a href='https://twitter.com' className='hover:text-white transition-colors'>
            Twitter
          </a>
          <a href='https://github.com' className='hover:text-white transition-colors'>
            GitHub
          </a>
          <a href='https://discord.com' className='hover:text-white transition-colors'>
            Discord
          </a>
        </div>
        <div className='text-sm'>© 2025 Ultraterrestrial • All Rights Reserved</div>
      </div>
    ),
    duration: 0.64,
    stagger: 0.075,
    onItemClick: (item) => console.log('Navigate to:', item.href),
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete menu with all features enabled.',
      },
    },
  },
}

export const MinimalMenu: Story = {
  args: {
    items: [
      {id: '1', label: 'Home', href: '/'},
      {id: '2', label: 'About', href: '/about'},
    ],
    menuButtonLabel: '☰',
    closeButtonLabel: '✕',
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal menu with icon buttons.',
      },
    },
  },
}

export const DarkTheme: Story = {
  args: {
    items: defaultItems,
    featuredImage: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&q=80',
    className: 'custom-dark-menu',
    style: {
      backgroundColor: '#000000',
    },
    children: <DefaultContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu with pure black background.',
      },
    },
  },
}
