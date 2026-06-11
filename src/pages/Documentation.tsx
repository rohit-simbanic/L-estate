import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Zap,
  Layout,
  Terminal,
  Layers,
  Calendar,
  CheckCircle,
  Code2,
} from 'lucide-react';

export const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'features' | 'architecture' | 'storybook' | 'performance'
  >('features');

  const tabs = [
    { id: 'features', label: 'Core Features', icon: <Layout className="w-4 h-4" /> },
    { id: 'architecture', label: 'Architecture & State', icon: <Layers className="w-4 h-4" /> },
    { id: 'storybook', label: 'Storybook & Styling', icon: <Terminal className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance Optimizations', icon: <Zap className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="w-full text-left py-12 pb-24 max-w-7xl mx-auto px-6 space-y-12">
      {/* Page Header */}
      <section className="border-b border-obsimplified border-obsidian-200 pb-8">
        <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block mb-2">
          ENGINEERING & USER GUIDE
        </span>
        <h1 className="font-serif text-4xl font-bold text-obsidian-900 mb-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-gold-600" />
          <span>Documentation Desk</span>
        </h1>
        <p className="text-xs text-obsidian-600 max-w-2xl leading-relaxed">
          Welcome to the technical design and operational guide for **L'ESTATE**. This document
          details how our components communicate, how the state is structured, how we verify
          components with Storybook, and what production-grade performance enhancements have been
          implemented.
        </p>
      </section>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-obsidian-100 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-obsidian-950 text-white border-obsidian-950 shadow-md'
                : 'bg-obsidian-50 text-obsidian-700 border-obsidian-200 hover:bg-white hover:border-obsidian-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[50vh]">
        {/* 1. CORE FEATURES */}
        {activeTab === 'features' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-obsidian-900">
                  User Experience Flow
                </h3>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  L'ESTATE delivers a seamless travel planning flow. Users search by location and
                  choose dates directly from the homepage hero. The Search page immediately displays
                  matching listings alongside an interactive map, supporting quick filters or
                  advanced panel filtering.
                </p>
                <ul className="text-xs text-obsidian-700 space-y-3 pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Workable Search Bar:</strong> Users select destinations, travel dates,
                      and guest counts from custom dropdown sliders.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Synchronized Leaflet Map:</strong> Hovering or selecting a property
                      card triggers high-precision marker pings and fly-to camera centering.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Editorial Image Lightbox:</strong> Detailed pages display a 5-image
                      collage, launching full-screen swipeable carousels upon click.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Persistent Wishlist Collection:</strong> Dedicated page listing
                      user-saved estates, integrated with real-time navigation notification badges
                      and local storage.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-obsidian-50 rounded-2xl border border-obsidian-200 p-6 space-y-4">
                <h4 className="font-serif text-lg font-bold text-obsidian-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold-600" />
                  <span>Workable Form & Booking Receipt Flow</span>
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  The reservation panel on `/item/:id` calculates nights, cleaning services, luxury
                  taxes, and concierge staffing values in real-time. We use **Zod** schema
                  validations:
                </p>
                <div className="bg-white p-4 rounded-xl border border-obsidian-200/80 font-mono text-[10px] text-obsidian-700 overflow-x-auto">
                  {`const bookingSchema = z.object({
  fullName: z.string().min(3, { message: 'Name must be 3+ chars' }),
  email: z.string().email({ message: 'Enter a valid email' }),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val))),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val))),
  guests: z.number().min(1),
  vipConcierge: z.boolean().optional(),
});`}
                </div>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  On successful validation, the receipt displays generated ticket codes and final
                  computed pricing breakdowns.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. ARCHITECTURE & STATE MANAGEMENT */}
        {activeTab === 'architecture' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border border-obsidian-200 bg-white shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-serif text-base font-bold text-obsidian-900">
                  Zustand Global Store
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  We maintain a single, highly performant store (`src/store/useStore.ts`) that
                  manages:
                </p>
                <ul className="text-xs text-obsidian-700 space-y-1.5 list-disc pl-4 font-light">
                  <li>Property listings list</li>
                  <li>Active search filter parameters</li>
                  <li>Wishlisted items list (persisted in localStorage)</li>
                  <li>Active user coordinates/hover highlights</li>
                  <li>Completed booking receipts data</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-obsidian-200 bg-white shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-serif text-base font-bold text-obsidian-900">
                  Reactive Rendering
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  When a user clicks an amenity checkbox or drags a price slider in
                  `FilterPanel.tsx`, the store updates the state. The computed function
                  `getFilteredProperties()` recalculates properties, updating both the listing cards
                  and the Leaflet map markers instantly.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-obsidian-200 bg-white shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-serif text-base font-bold text-obsidian-900">
                  Cross-Page Date Sync
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Dates selected in the floating header SearchBar update the global store. Upon
                  navigating to a detail page, the check-in and check-out dates are pre-populated
                  into the React Hook Form default fields, removing friction from the checkout
                  experience.
                </p>
              </div>
            </div>

            <div className="bg-obsidian-50 rounded-2xl border border-obsidian-200 p-6 space-y-4">
              <h4 className="font-serif text-lg font-bold text-obsidian-900 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-gold-600" />
                <span>Store Structure Sneak Peek</span>
              </h4>
              <div className="bg-white p-4 rounded-xl border border-obsidian-200/80 font-mono text-[10px] text-obsidian-700 overflow-x-auto">
                {`export const useStore = create<GlobalStore>((set, get) => ({
  properties: MOCK_PROPERTIES,
  filters: initialFilters,
  favorites: (() => {
    try {
      const saved = localStorage.getItem('lestate_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  })(),
  setSearchQuery: (query) => set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  toggleFavorite: (id) => set((state) => {
    // Toggles ID and persists state inside localStorage
  }),
  getFilteredProperties: () => { ... }
}));`}
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. STORYBOOK & STYLING */}
        {activeTab === 'storybook' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-obsidian-900">
                  Component Isolation & Storybook
                </h3>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  We implement professional component isolation practices. Stories are defined in
                  `src/components/ui/` for our three core foundational components: **Button**,
                  **Card**, and **Modal**. This enables testing states (loading, outlines, sizes,
                  disabled) in isolation.
                </p>
                <div className="bg-obsidian-50 rounded-2xl p-5 border border-obsidian-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-600">
                    How to launch Storybook
                  </h4>
                  <p className="text-xs text-obsidian-600 font-light">
                    In your terminal, navigate to the project directory and execute:
                  </p>
                  <div className="bg-white px-4 py-2.5 rounded-lg border border-obsidian-200 font-mono text-xs text-obsidian-850 flex items-center justify-between">
                    <span>npm run storybook</span>
                    <span className="text-[10px] bg-gold-100 text-gold-700 border border-gold-200 px-2 py-0.5 rounded font-bold uppercase font-sans">
                      PORT 6006
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-obsidian-900">
                  Tailwind CSS v4 Integration
                </h3>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Tailwind CSS v4 introduces a fully CSS-based configuration system. In
                  `src/index.css`, we declare our custom styling tokens inside the `@theme` block.
                  These values map to utilities across components:
                </p>
                <div className="bg-white border border-obsidian-200 rounded-xl p-4 font-mono text-[10px] text-obsidian-700 overflow-x-auto">
                  {`@theme {
  --font-serif: "Playfair Display", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --color-gold-500: #c5a880; /* Base Luxury Gold */
  --color-obsidian-50: #f9fafb; /* Off-white page details */
  --color-obsidian-900: #111827; /* Charcoal headings */
}`}
                </div>
                <p className="text-[11px] text-obsidian-500 font-light italic">
                  Note: Tailwind v4 handles imports via `@import "tailwindcss"` rather than legacy
                  configurator JS files.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. PERFORMANCE OPTIMIZATIONS */}
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-obsidian-900">
                  Production-Grade Performance Standards
                </h3>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  To ensure a premium, ultra-fast experience, we implemented several advanced
                  optimization techniques:
                </p>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-gold-50 text-gold-600 flex-shrink-0 self-start">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-obsidian-900">
                        React Lazy Loading & Code-Splitting
                      </h4>
                      <p className="text-xs text-obsidian-600 font-light leading-relaxed mt-0.5">
                        All application page routes are dynamically imported via{' '}
                        <code>React.lazy()</code> and rendered inside a <code>Suspense</code>{' '}
                        wrapper. This splits pages into smaller Javascript chunks, reducing the core
                        bundle from <strong>726 kB</strong> to <strong>344 kB</strong> for
                        ultra-fast initial loads.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-gold-50 text-gold-600 flex-shrink-0 self-start">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-obsidian-900">Lazy Loading Images</h4>
                      <p className="text-xs text-obsidian-600 font-light leading-relaxed mt-0.5">
                        Property card carousels and detail sliders use Unsplash URLs scaled down
                        with size filters (`&w=600`) and render only when needed, minimizing payload
                        overhead.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-gold-50 text-gold-600 flex-shrink-0 self-start">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-obsidian-900">
                        CSS Animation Hardware Acceleration
                      </h4>
                      <p className="text-xs text-obsidian-600 font-light leading-relaxed mt-0.5">
                        Framer Motion page translations, slider transitions, and header pings use
                        GPU-friendly transitions (`opacity`, `transform`) with subpixel antialiasing
                        to guarantee 60 FPS scrolling.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-gold-50 text-gold-600 flex-shrink-0 self-start">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-obsidian-900">
                        Shallow Zustand Store Selectors
                      </h4>
                      <p className="text-xs text-obsidian-600 font-light leading-relaxed mt-0.5">
                        Components subscribe to specific store properties (e.g. `favorites`) rather
                        than the entire store object, preventing unnecessary component re-renders
                        when other states (like map coordinates) change.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-obsidian-50 rounded-2xl border border-obsidian-200 p-6 space-y-4">
                <h4 className="font-serif text-lg font-bold text-obsidian-900">
                  Optimization Checklist
                </h4>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-obsidian-700">
                    <CheckCircle className="w-4.5 h-4.5 text-gold-600 flex-shrink-0" />
                    <span>
                      <strong>React Dynamic Imports:</strong> Dynamic chunks compiled for pages to
                      split core bundle sizes.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-obsidian-700">
                    <CheckCircle className="w-4.5 h-4.5 text-gold-600 flex-shrink-0" />
                    <span>
                      <strong>Google Fonts Optimizations:</strong> Prefetch requests configured to
                      load Playfair Display.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-obsidian-700">
                    <CheckCircle className="w-4.5 h-4.5 text-gold-600 flex-shrink-0" />
                    <span>
                      <strong>Leaflet Tile Buffering:</strong> Voyager tiles use sub-domains to
                      parallelize map loads.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-obsidian-700">
                    <CheckCircle className="w-4.5 h-4.5 text-gold-600 flex-shrink-0" />
                    <span>
                      <strong>Memoized Calculations:</strong> Booking night tallies and prices
                      computed dynamically on component mounts.
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-obsidian-700">
                    <CheckCircle className="w-4.5 h-4.5 text-gold-600 flex-shrink-0" />
                    <span>
                      <strong>Tailwind CSS Purge:</strong> V4 automatically compiles down only
                      classes used in tsx markup.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default Documentation;
