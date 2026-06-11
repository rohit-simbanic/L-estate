import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { MOCK_PROPERTIES } from '../../data/properties';

const meta: Meta<typeof Card> = {
  title: 'Luxury UI/PropertyCard',
  component: Card,
  argTypes: {
    onSelect: { action: 'selected' },
    property: { control: 'object' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm p-6 bg-obsidian-50/50 border border-obsidian-200/60 rounded-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const AmalfiVilla: Story = {
  args: {
    property: MOCK_PROPERTIES[0],
  },
};

export const AspenChalet: Story = {
  args: {
    property: MOCK_PROPERTIES[1],
  },
};

export const NYCPenthouse: Story = {
  args: {
    property: MOCK_PROPERTIES[2],
  },
};

export const MaldivesIsland: Story = {
  args: {
    property: MOCK_PROPERTIES[3],
  },
};
