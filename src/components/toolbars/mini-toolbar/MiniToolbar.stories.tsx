import type { Meta, StoryObj } from '@storybook/react';

import { MiniToolbar } from './MiniToolbar';

const meta = {
  component: MiniToolbar,
} satisfies Meta<typeof MiniToolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};