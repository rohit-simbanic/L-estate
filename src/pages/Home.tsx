import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '../features/search/SearchBar';
import { Card } from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { api } from '../services/api';
import type { Property } from '../data/properties';
import { Compass, ShieldCheck, HeartHandshake, Anchor, ArrowRight, Star } from 'lucide-react';

export const Home: React.FC = () => {
  useDocumentTitle(
    'Exclusive Vacation Rentals',
    'Curated ultra-luxury vacation rentals staffed with private chefs, butler services, and dedicated lifestyle concierges.',
  );

  const { setPropertyType, setLocation } = useStore(
    useShallow((state) => ({
      setPropertyType: state.setPropertyType,
      setLocation: state.setLocation,
    })),
  );

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getProperties().then((data) => {
      if (active) {
        setProperties(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Get 3 high-rated properties for the featured section
  const featuredProperties = [...properties].sort((a, b) => b.rating - a.rating).slice(0, 3);

  const collections = [
    {
      title: 'Mediterranean Villas',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      description: 'Sun-drenched terraces on rocky shorelines.',
      filter: { type: 'Villa', location: 'Amalfi Coast, Italy' },
    },
    {
      title: 'Alpine Retreats',
      image:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
      description: 'Ski-in/ski-out mansions among snow peaks.',
      filter: { type: 'Chalet', location: 'Aspen, Colorado' },
    },
    {
      title: 'Overwater Sanctuaries',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      description: 'Total seclusion floating above crystal lagoons.',
      filter: { type: 'Estate', location: 'Maldives' },
    },
    {
      title: 'Sky-High Penthouses',
      image:
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      description: 'Metropolitan views from cloud-scraping glass.',
      filter: { type: 'Penthouse', location: 'New York City, New York' },
    },
  ];

  const handleCollectionClick = (col: (typeof collections)[0]) => {
    setPropertyType(col.filter.type as 'Villa' | 'Penthouse' | 'Chalet' | 'Mansion' | 'Estate');
    setLocation(col.filter.location);
    window.location.assign('#/search');
  };

  const handlePropertySelect = (property: Property) => {
    window.location.assign(`#/item/${property.id}`);
  };

  const services = [
    {
      icon: <HeartHandshake className="w-8 h-8 text-gold-500" />,
      title: 'Elite Concierge',
      description:
        'From yacht charters to private chefs, our 24/7 concierge coordinates absolute luxury at your bidding.',
    },
    {
      icon: <Compass className="w-8 h-8 text-gold-500" />,
      title: 'Curated Experiences',
      description:
        'Helicopter alpine tours, diving with marine biologists, or private vineyard tastings booked seamlessly.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-gold-500" />,
      title: 'Absolute Discretion',
      description:
        "Secure, gated estate entries and strict non-disclosure protocols protecting our clients' privacy.",
    },
    {
      icon: <Anchor className="w-8 h-8 text-gold-500" />,
      title: 'Yacht & Jet Access',
      description:
        'Direct runway transport and harbor dockings arranged to facilitate frictionless world travels.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] md:h-[85vh] w-full flex items-center justify-center py-16 md:py-0">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Estate Backdrop"
            className="w-full h-full object-cover scale-105 filter brightness-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/20 via-obsidian-900/30 to-white" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl flex flex-col items-center">
          <motion.span
            className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            L'ESTATE RENTALS
          </motion.span>
          <motion.h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-obsidian-100 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Unveiling the World's Most <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600">
              Exclusive Estates
            </span>
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-obsidian-300 mb-10 max-w-2xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Curated ultra-luxury vacation rentals staffed with private chefs, butler services, and
            dedicated lifestyle concierges.
          </motion.p>

          {/* Floating Search Bar */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SearchBar onSearchSubmit={() => window.location.assign('#/search')} />
          </motion.div>
        </div>
      </div>

      {/* Curated Collections / Categories */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-gold-500 text-xs font-bold uppercase tracking-widest">
              CATEGORIES
            </span>
            <h2 className="font-serif text-3xl font-bold mt-2 text-obsidian-900">
              Curated Collections
            </h2>
          </div>
          <p className="text-xs text-obsidian-500 max-w-md md:text-right">
            Explore our collections hand-picked for unique layouts, architectural heritage, and
            premier geographical settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col, index) => (
            <motion.div
              key={col.title}
              onClick={() => handleCollectionClick(col)}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md border border-obsidian-200/60"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/45 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <h3 className="font-serif text-lg font-bold text-obsidian-100 group-hover:text-gold-400 transition-colors mb-1">
                  {col.title}
                </h3>
                <p className="text-[11px] text-obsidian-300 font-light line-clamp-2">
                  {col.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-obsidian-50 border-y border-obsidian-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div className="text-left">
              <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">
                SUGGESTIONS
              </span>
              <h2 className="font-serif text-3xl font-bold mt-2 text-obsidian-900">
                Featured Destinations
              </h2>
            </div>
            <button
              onClick={() => {
                setLocation('All');
                setPropertyType('All');
                window.location.assign('#/search');
              }}
              className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore All Estates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              featuredProperties.map((prop, index) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Card property={prop} onSelect={handlePropertySelect} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* The Luxury Experience */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left panel text */}
          <div className="lg:col-span-1 text-left">
            <span className="text-gold-500 text-xs font-bold uppercase tracking-widest">
              SERVICES
            </span>
            <h2 className="font-serif text-4xl font-bold mt-2 mb-6 leading-tight text-obsidian-900">
              The Luxury <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-700">
                Concierge Standard
              </span>
            </h2>
            <p className="text-xs text-obsidian-600 mb-8 leading-relaxed font-light">
              We redefine luxury lodging by incorporating five-star boutique hotel services within
              private residential estates. Every booking is tailored around your personal
              preferences.
            </p>
            <div className="relative rounded-2xl overflow-hidden h-64 border border-obsidian-200">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                alt="Concierge Service"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-obsidian-950/20" />
            </div>
          </div>

          {/* Right services grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="p-6 rounded-2xl border border-obsidian-200 bg-white/70 backdrop-blur-sm hover:border-gold-500/30 transition-all hover:bg-white hover:shadow-lg hover:shadow-obsidian-950/5"
              >
                <div className="mb-4">{svc.icon}</div>
                <h3 className="font-serif text-lg font-bold text-obsidian-900 mb-2">{svc.title}</h3>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Quote Section */}
      <section className="py-24 bg-white border-t border-obsidian-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1.5 rounded-full bg-gold-500/10 text-gold-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            ESTATE EXPERIENCE
          </span>
          <p className="font-serif text-xl sm:text-2xl md:text-3xl italic text-obsidian-800 leading-relaxed font-light mb-8">
            "An absolutely transcending holiday. The villa was visually magnificent, but it was the
            private host, local gourmet dinners, and flight arrangements that made our stay
            unforgettable."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex text-gold-600 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-semibold text-obsidian-800">The Sterling Family</span>
            <span className="text-xs text-obsidian-350">|</span>
            <span className="text-xs text-obsidian-600">Guests at Villa L'Horizon</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
