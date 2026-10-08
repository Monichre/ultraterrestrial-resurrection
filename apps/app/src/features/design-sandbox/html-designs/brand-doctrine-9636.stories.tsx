import type { Meta, StoryObj } from '@storybook/react'
import HtmlDesignFrame from './HtmlDesignFrame'

const meta: Meta<typeof HtmlDesignFrame> = {
  title: 'Design Sandbox/Brand Doctrine (9636)',
  component: HtmlDesignFrame,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Downloaded design artifact (`~/Downloads/design-9636b4b3-*.html`). "Ultra Terrestrial — Brand Doctrine" grid/canvas variant: "ULTRA TERRESTRIAL" title ("Integrated Research Narrative Engine" subtitle) centered on a 40px SVG blueprint grid with concentric calibration circles, constellation diagrams, amber edit marks, and the doctrine annotations (evidence / inference / speculation / resonance). CSS desk tools include a silver drafting pencil, clear ruler, redaction marker, torn archive fragment, and a small SVG compass. Served verbatim from public/design-sandbox/ and rendered in an iframe.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const FullPage: Story = {
  args: {
    src: '/design-sandbox/brand-doctrine-9636.html',
    title: 'Ultra Terrestrial — Brand Doctrine (9636)',
  },
}
