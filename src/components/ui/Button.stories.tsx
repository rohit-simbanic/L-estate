import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Luxury UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'dark', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    animate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimaryGold: Story = {
  args: {
    variant: 'primary',
    children: 'Reserve Estate',
    size: 'md',
  },
};

export const SecondaryOutline: Story = {
  args: {
    variant: 'secondary',
    children: 'Explore Amenities',
    size: 'md',
  },
};

export const GhostLuxury: Story = {
  args: {
    variant: 'ghost',
    children: 'View Details',
    size: 'md',
  },
};

export const DarkPlatinum: Story = {
  args: {
    variant: 'dark',
    children: 'Corporate Inquiries',
    size: 'md',
  },
};

export const DangerRed: Story = {
  args: {
    variant: 'danger',
    children: 'Cancel Reservation',
    size: 'md',
  },
};

export const LargeButton: Story = {
  args: {
    variant: 'primary',
    children: 'Submit VIP Application',
    size: 'lg',
  },
};

export const LoadingState: Story = {
  args: {
    variant: 'primary',
    children: 'Securing Estate...',
    isLoading: true,
  },
};

export const DisabledState: Story = {
  args: {
    variant: 'primary',
    children: 'Estate Booked',
    disabled: true,
  },
};
