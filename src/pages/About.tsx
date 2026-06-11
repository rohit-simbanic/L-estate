import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Trophy, Globe, MapPin } from 'lucide-react';

export const About: React.FC = () => {
  const standards = [
    {
      icon: <Shield className="w-8 h-8 text-gold-500" />,
      title: 'Certified Safety & Security',
      description:
        'Each property undergoes rigorous physical audits, complete with advanced smart security system integrations and discrete private entrances.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-gold-500" />,
      title: 'Uncompromised Curation',
      description:
        'Fewer than 1% of submitted properties are selected. We inspect every fixture, bed linen, sound system, and view to guarantee premium quality.',
    },
    {
      icon: <Trophy className="w-8 h-8 text-gold-500" />,
      title: 'Award-Winning Service',
      description:
        'Recognized globally as the leading provider of ultra-luxury vacation rentals, staffed by professionals trained in elite hospitality academies.',
    },
    {
      icon: <Globe className="w-8 h-8 text-gold-500" />,
      title: 'Global Presence',
      description:
        'With offices in Monaco, Geneva, and New York, our localized concierge teams hold unparalleled influence in their respective regions.',
    },
  ];

  const offices = [
    {
      city: 'Monaco',
      address: '2 Avenue des Citronniers, 98000 Monaco',
      phone: '+377 93 25 88 00',
      email: 'monaco@lestate.com',
    },
    {
      city: 'Geneva, Switzerland',
      address: 'Rue du Rhône 42, 1204 Genève, Switzerland',
      phone: '+41 22 310 12 12',
      email: 'geneva@lestate.com',
    },
    {
      city: 'New York City',
      address: '730 Fifth Avenue, New York, NY 10019',
      phone: '+1 212 555 0199',
      email: 'nyc@lestate.com',
    },
  ];

  return (
    <div className="w-full text-left py-12 pb-24">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <span className="text-gold-500 text-xs font-bold uppercase tracking-widest block mb-3">
          OUR HERITAGE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-obsidian-900 max-w-3xl leading-tight">
          Redefining the Art of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 font-bold">
            Luxury Lodging & Travel
          </span>
        </h1>
      </section>

      {/* Philosophy Split Layout */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
        <div className="space-y-6">
          <p className="font-serif text-lg text-gold-600 font-light italic leading-relaxed">
            "We believe that a true luxury vacation is defined not just by beautiful architecture,
            but by the seamless flow of curated details and frictionless service."
          </p>
          <p className="text-xs text-obsidian-750 text-obsidian-700 leading-relaxed font-light">
            Founded in 2018 in Geneva, L'ESTATE was born from a simple observation: wealthy
            travelers had to choose between the predictable service of 5-star hotels and the
            spacious privacy of luxury vacation home rentals. We bridged this gap.
          </p>
          <p className="text-xs text-obsidian-750 text-obsidian-700 leading-relaxed font-light">
            Every estate listed in our portfolio is fully operated by L'ESTATE. This means you will
            find a dedicated butler, Michelin-level private chef options, and our signature premium
            bathroom toiletries, bed linens, and pre-arrival stocked pantry in every single
            destination.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 border border-obsidian-200">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
            alt="Luxury Villa Living Room"
            className="w-full h-full object-cover scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/15 to-transparent" />
        </div>
      </section>

      {/* Standards Section */}
      <section className="py-20 bg-obsidian-50 border-y border-obsidian-200 mb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">
              COMMITMENT
            </span>
            <h2 className="font-serif text-3xl font-bold mt-2 mb-4 text-obsidian-900">
              Our Core Standards
            </h2>
            <p className="text-xs text-obsidian-600 font-light">
              We operate under four non-negotiable standards to ensure your stay exceeds the highest
              benchmarks of premium hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {standards.map((std, index) => (
              <motion.div
                key={std.title}
                className="p-6 rounded-2xl border border-obsidian-200 bg-white text-left hover:border-gold-500/30 transition-all hover:bg-white hover:shadow-lg hover:shadow-obsidian-950/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">{std.icon}</div>
                <h3 className="font-serif text-base font-bold text-obsidian-900 mb-2">
                  {std.title}
                </h3>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  {std.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Executive Offices */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-left mb-12">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-widest">
            LOCATIONS
          </span>
          <h2 className="font-serif text-3xl font-bold mt-2 text-obsidian-900">
            Executive Offices
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offices.map((office, index) => (
            <motion.div
              key={office.city}
              className="p-6 rounded-2xl border border-obsidian-200 bg-obsidian-50/50 flex flex-col justify-between hover:border-gold-500/20 transition-all hover:bg-white hover:shadow-md"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-gold-600 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <span>{office.city}</span>
                </h3>
                <p className="text-xs text-obsidian-700 leading-relaxed font-light mb-4">
                  {office.address}
                </p>
              </div>
              <div className="pt-4 border-t border-obsidian-200 text-xs space-y-1">
                <p className="text-obsidian-500">
                  Tel: <span className="text-obsidian-800 font-semibold">{office.phone}</span>
                </p>
                <p className="text-obsidian-500">
                  Inquire: <span className="text-gold-600 font-bold">{office.email}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default About;
