import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { MOCK_PROPERTIES } from '../data/properties';
import { Info, CheckCircle2 } from 'lucide-react';

export const Showcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isLoading, setIsLoading] = useState(false);

  const sampleProperty = MOCK_PROPERTIES[0];

  const triggerModal = (size: 'sm' | 'md' | 'lg') => {
    setModalSize(size);
    setModalOpen(true);
  };

  const handleSimulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full text-left py-12 pb-24 max-w-7xl mx-auto px-6 space-y-16">
      {/* Header */}
      <section className="border-b border-obsidian-200 pb-8">
        <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block mb-2">
          DESIGN SYSTEM
        </span>
        <h1 className="font-serif text-4xl font-bold text-obsidian-900 mb-4">Component Showcase</h1>
        <p className="text-xs text-obsidian-600 max-w-2xl leading-relaxed">
          Welcome to the interactive style guide for L'ESTATE. This showcase presents our primary
          design system assets, responsive component variants, and interactive behaviors built on
          React 19, TypeScript, and Tailwind CSS v4.
        </p>
      </section>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="border-l-2 border-gold-500 pl-4">
          <h2 className="font-serif text-2xl font-bold text-obsidian-900">Color Palette</h2>
          <p className="text-xs text-obsidian-600 mt-1">
            Our curated palette utilizes deep obsidian blacks and brushed warm champagne golds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gold Palette */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-500">
              Champagne Gold Scale
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
              <div className="p-4 rounded-xl bg-gold-100 text-obsidian-950">100</div>
              <div className="p-4 rounded-xl bg-gold-300 text-obsidian-950">300</div>
              <div className="p-4 rounded-xl bg-gold-500 text-obsidian-950">500 (Base)</div>
              <div className="p-4 rounded-xl bg-gold-700 text-obsidian-100">700</div>
              <div className="p-4 rounded-xl bg-gold-900 text-obsidian-100">900</div>
            </div>
          </div>

          {/* Obsidian Palette */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-obsidian-300">
              Obsidian Black Scale
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
              <div className="p-4 rounded-xl bg-obsidian-200 text-obsidian-950">200</div>
              <div className="p-4 rounded-xl bg-obsidian-500 text-obsidian-100">500</div>
              <div className="p-4 rounded-xl bg-obsidian-700 text-obsidian-100">700</div>
              <div className="p-4 rounded-xl bg-obsidian-800 text-obsidian-100">800</div>
              <div className="p-4 rounded-xl bg-obsidian-900 text-obsidian-100 border border-obsidian-850">
                900 (Main)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Typography Hierarchy */}
      <section className="space-y-6">
        <div className="border-l-2 border-gold-500 pl-4">
          <h2 className="font-serif text-2xl font-bold text-obsidian-900">Typography Scale</h2>
          <p className="text-xs text-obsidian-600 mt-1">
            Playfair Display serif for headers, and Inter sans-serif for high-legibility body
            content.
          </p>
        </div>

        <div className="space-y-4 p-6 rounded-2xl border border-obsidian-200 bg-obsidian-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-obsidian-200">
            <span className="text-[10px] text-gold-600 font-mono">H1 Title • Serif</span>
            <span className="font-serif text-3xl font-bold text-obsidian-900">
              Exclusive Estates
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-obsidian-200">
            <span className="text-[10px] text-gold-600 font-mono">H2 Subheading • Serif</span>
            <span className="font-serif text-xl font-bold text-obsidian-900">
              Curated Collections
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-obsidian-200">
            <span className="text-[10px] text-gold-600 font-mono">Body Regular • Sans</span>
            <span className="text-xs text-obsidian-700 max-w-md">
              Every estate listed in our luxury portfolio undergoes a physical audit to check bed
              linens, toiletries, and amenities.
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2">
            <span className="text-[10px] text-gold-600 font-mono">Uppercase Tag • Sans</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">
              L'ESTATE EXPERIENCE
            </span>
          </div>
        </div>
      </section>

      {/* 3. Button Component Documentation */}
      <section className="space-y-6">
        <div className="border-l-2 border-gold-500 pl-4">
          <h2 className="font-serif text-2xl font-bold text-obsidian-900">Button Component</h2>
          <p className="text-xs text-obsidian-600 mt-1">
            Animated buttons featuring hover scaling and click feedback. Built-in variants and
            loading spins.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-obsidian-200 bg-obsidian-50 space-y-8">
          {/* Variants */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-obsidian-500">
              Style Variants
            </h4>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Gold</Button>
              <Button variant="secondary">Secondary Outline</Button>
              <Button variant="dark">Dark Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Red</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-obsidian-500">
              Button Sizes
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small Size</Button>
              <Button size="md">Medium/Default</Button>
              <Button size="lg">Large Luxury</Button>
            </div>
          </div>

          {/* States */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-obsidian-500">
              Interactive States
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" isLoading={isLoading} onClick={handleSimulateLoad}>
                {isLoading ? 'Loading' : 'Click to Load (2s)'}
              </Button>
              <Button variant="secondary" disabled>
                Disabled State
              </Button>
              <Button variant="primary" animate={false}>
                No Animation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Card Component Documentation */}
      <section className="space-y-6">
        <div className="border-l-2 border-gold-500 pl-4">
          <h2 className="font-serif text-2xl font-bold text-obsidian-900">
            Listing Card Component
          </h2>
          <p className="text-xs text-obsidian-650 text-obsidian-600 mt-1">
            Displays luxury properties. Equipped with nested image sliders, hover scales, and active
            favorites state.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-obsidian-400">
              Features Checklist
            </h4>
            <ul className="text-xs text-obsidian-700 space-y-2.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-600" />
                <span>Swipeable Image Gallery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-600" />
                <span>Responsive Specs (Beds/Baths/Area)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-600" />
                <span>Gold Rating Star Badge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-600" />
                <span>Wishlist Heart Interaction</span>
              </li>
            </ul>
          </div>
          <div className="md:col-span-1 max-w-sm">
            <Card property={sampleProperty} onSelect={(p) => alert(`Selected: ${p.title}`)} />
          </div>
        </div>
      </section>

      {/* 5. Modal Component Documentation */}
      <section className="space-y-6">
        <div className="border-l-2 border-gold-500 pl-4">
          <h2 className="font-serif text-2xl font-bold text-obsidian-900">Modal Component</h2>
          <p className="text-xs text-obsidian-600 mt-1">
            Esc-key binded, backdrop-closable animated dialog wrapper. Glassmorphism styling.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-obsidian-200 bg-obsidian-50 space-y-4">
          <h4 className="text-[10px] uppercase font-bold tracking-wider text-obsidian-500">
            Launch Modal Size Previews
          </h4>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" onClick={() => triggerModal('sm')}>
              Small Modal
            </Button>
            <Button variant="secondary" onClick={() => triggerModal('md')}>
              Medium Modal
            </Button>
            <Button variant="secondary" onClick={() => triggerModal('lg')}>
              Large Modal
            </Button>
          </div>
        </div>
      </section>

      {/* Modal instance for previews */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Component Showcase - ${modalSize.toUpperCase()} Modal`}
        size={modalSize}
      >
        <div className="space-y-4 text-left py-2">
          <div className="p-4 rounded-xl bg-gold-500/5 border border-gold-500/10 flex items-start gap-3">
            <Info className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-gold-400">Responsive Dialog Overlay</h5>
              <p className="text-[11px] text-obsidian-350 text-obsidian-300 mt-1">
                This dialog locks the parent body scroll, animate-fades the backdrop, spring-scales
                the panel content, and binds keyboard key listeners automatically.
              </p>
            </div>
          </div>
          <p className="text-xs text-obsidian-300 leading-relaxed font-light">
            Luxury properties deserve elegant modals. This content container is fully scrollable in
            case details exceed the screen boundaries (perfect for mobile viewports).
          </p>
          <div className="pt-4 border-t border-obsidian-700/40 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('VIP Action Confirmed');
                setModalOpen(false);
              }}
            >
              Confirm VIP Option
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Showcase;
