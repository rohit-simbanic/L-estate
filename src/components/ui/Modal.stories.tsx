import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'Luxury UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    title: { control: 'text' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MediumSize: Story = {
  args: {
    isOpen: true,
    title: 'Luxury Estate Reservation',
    size: 'md',
    children: (
      <div className="space-y-4 text-left">
        <p className="text-xs text-obsidian-600 leading-relaxed font-light">
          Your private helicopter transfer has been requested. A concierge agent will email you with
          landing coordinates in Aspen within 15 minutes.
        </p>
        <div className="p-4 rounded-xl bg-gold-50 border border-gold-200 text-xs text-gold-700">
          Flight ID: <strong>LES-ASP-772</strong>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-obsidian-200">
          <Button variant="ghost" size="sm">
            Dismiss
          </Button>
          <Button variant="primary" size="sm">
            Confirm Flight
          </Button>
        </div>
      </div>
    ),
  },
};

export const SmallSize: Story = {
  args: {
    isOpen: true,
    title: 'Inquiry Dispatched',
    size: 'sm',
    children: (
      <div className="space-y-4 text-center py-2">
        <h4 className="text-sm font-serif font-bold text-obsidian-900">Message Received</h4>
        <p className="text-xs text-obsidian-600 font-light">
          We have catalogued your request. A host manager will respond shortly.
        </p>
        <Button variant="primary" size="sm" className="w-full mt-4">
          Close Window
        </Button>
      </div>
    ),
  },
};

export const LargeSize: Story = {
  args: {
    isOpen: true,
    title: 'VIP Rental Agreement Policy',
    size: 'lg',
    children: (
      <div className="space-y-4 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600">
          Section 1. Nondisclosure Protocols
        </h4>
        <p className="text-[11px] text-obsidian-600 leading-relaxed">
          Guests residing at L'ESTATE properties agree to absolute confidentiality regarding other
          residents, staff, and coordinates of the estate. No photography of neighboring boundary
          fences or private airstrips is permitted.
        </p>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600">
          Section 2. Concierge Limits
        </h4>
        <p className="text-[11px] text-obsidian-600 leading-relaxed">
          Chef services cover three gourmet meals daily. Extra hours or off-site catering operations
          require at least 24 hours notice to source luxury ingredients.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-obsidian-200">
          <Button variant="ghost" size="sm">
            Decline
          </Button>
          <Button variant="primary" size="sm">
            Accept Agreement
          </Button>
        </div>
      </div>
    ),
  },
};
