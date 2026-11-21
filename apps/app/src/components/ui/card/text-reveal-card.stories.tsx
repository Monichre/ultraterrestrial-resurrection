import type { Meta, StoryObj } from '@storybook/react'
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from './text-reveal-card'

const meta = {
  title: 'Components/Card/TextRevealCard',
  component: TextRevealCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An interactive card that reveals hidden text through mouse movement with animated star background.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'The base text that is always visible',
    },
    revealText: {
      control: 'text',
      description: 'The text that is revealed on hover',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      description: 'Optional children components like title and description',
    },
  },
} satisfies Meta<typeof TextRevealCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Hidden Text',
    revealText: 'Revealed!',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default text reveal card. Move your mouse over it to reveal the hidden text.',
      },
    },
  },
}

export const WithTitle: Story = {
  args: {
    text: 'Move mouse to reveal',
    revealText: 'Text Revealed!',
    children: (
      <TextRevealCardTitle>
      Interactive Text Reveal
      </TextRevealCardTitle>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Text reveal card with a title component.',
      },
  },
},
}

export const WithTitleAndDescription: Story = {
  args: {
    text: 'Hidden Message',
    revealText: 'Secret Revealed!',
    children: (
      <>
      <TextRevealCardTitle>
      Mystery Card
      </TextRevealCardTitle>
    <TextRevealCardDescription>
    Hover over the text area below to reveal the hidden message
    </TextRevealCardDescription>
  </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Complete text reveal card with both title and description.',
      },
  },
},
}

export const LongText: Story = {
  args: {
    text: 'This is a much longer piece of text that will be hidden',
    revealText: 'This is the revealed text that appears when you hover!',
    children: (
      <TextRevealCardTitle>
      Long Text Example
      </TextRevealCardTitle>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Text reveal card with longer text content.',
      },
  },
},
}

export const ShortText: Story = {
  args: {
    text: 'Hi',
    revealText: 'Hello!',
  },
  parameters: {
    docs: {
      description: {
        story: 'Text reveal card with very short text.',
      },
    },
  },
}

export const Numbers: Story = {
  args: {
    text: '####',
    revealText: '2024',
    children: (
      <>
      <TextRevealCardTitle>
      Secret Code
      </TextRevealCardTitle>
    <TextRevealCardDescription>
    What year is it?
    </TextRevealCardDescription>
  </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Text reveal card revealing numeric content.',
      },
  },
},
}

export const Quote: Story = {
  args: {
    text: '...........',
    revealText: 'Innovation',
    children: (
      <>
      <TextRevealCardTitle>
      Inspiring Word
      </TextRevealCardTitle>
    <TextRevealCardDescription>
    Discover the word that drives progress
    </TextRevealCardDescription>
  </>
    ),
  },
parameters: {
  docs: {
    description: {
      story: 'Text reveal card with an inspirational theme.',
      },
  },
},
}

export const CustomSize: Story = {
  args: {
    text: 'Resize',
    revealText: 'Custom!',
    className: 'w-[30rem] h-[25rem]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Text reveal card with custom dimensions.',
      },
    },
  },
}

export const MultipleCards: Story = {
  render: () => (
    <div className="space-y-8">
    <TextRevealCard
        text="Card 1"
        revealText="First!"
   >
    <TextRevealCardTitle>Card One</TextRevealCardTitle>
  </TextRevealCard>
  <TextRevealCard
text="Card 2"
revealText="Second!"
 >
  <TextRevealCardTitle>Card Two</TextRevealCardTitle>
    </TextRevealCard>
    </div>
  ),
parameters: {
  layout: 'centered',
    docs: {
    description: {
      story: 'Multiple text reveal cards to show they work independently.',
      },
  },
},
}
