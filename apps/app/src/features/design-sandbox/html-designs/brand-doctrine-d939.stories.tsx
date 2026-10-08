import type { Meta, StoryObj } from '@storybook/react'
import HtmlDesignFrame from './HtmlDesignFrame'

const meta: Meta<typeof HtmlDesignFrame> = {
  title: 'Design Sandbox/Brand Doctrine (D939)',
  component: HtmlDesignFrame,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Downloaded design artifact (`~/Downloads/design-d939b4de-*.html`). "Ultra Terrestrial — Brand Doctrine" variant built on the Tailwind CDN: oversized "ULTRA / TERRESTRIAL" masthead inside a crop-marked draft box, orbital drafting arcs and constellation nodes on an SVG canvas, handwritten and mono annotations ("every contradiction is a pressure point", "preserve ambiguity"), plus translucent CSS tools (ruler, marker, compass) and photo-corner mounts. Served verbatim from public/design-sandbox/ and rendered in an iframe — the Tailwind CDN script runs inside the iframe document.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const FullPage: Story = {
  args: {
    src: '/design-sandbox/brand-doctrine-d939.html',
    title: 'Ultra Terrestrial — Brand Doctrine (D939)',
  },
}
