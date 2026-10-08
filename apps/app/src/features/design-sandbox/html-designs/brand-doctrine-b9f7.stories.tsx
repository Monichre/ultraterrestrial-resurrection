import type { Meta, StoryObj } from '@storybook/react'
import HtmlDesignFrame from './HtmlDesignFrame'

const meta: Meta<typeof HtmlDesignFrame> = {
  title: 'Design Sandbox/Brand Doctrine (B9F7)',
  component: HtmlDesignFrame,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Downloaded design artifact (`~/Downloads/design-b9f7d7ad-*.html`). "Ultra Terrestrial — Brand Doctrine": light paper/graphite/amber drafting board — serif wordmark ("Ultra / Terrestrial") over a gridded SVG canvas with type guides, margin annotations ("every source is a trace", "PRESERVE AMBIGUITY", "RIGOR + REVERENCE"), a taped observation-log fragment, redaction blocks, and CSS drafting tools (ruler, marker, pencil). Inline <style>, Google Fonts (Caveat, Cormorant Garamond, Space Mono). Served verbatim from public/design-sandbox/ and rendered in an iframe.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const FullPage: Story = {
  args: {
    src: '/design-sandbox/brand-doctrine-b9f7.html',
    title: 'Ultra Terrestrial — Brand Doctrine (B9F7)',
  },
}
