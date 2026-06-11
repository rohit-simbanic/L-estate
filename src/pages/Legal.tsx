import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface LegalProps {
  initialTab?: 'privacy' | 'terms' | 'nda';
}

export const Legal: React.FC<LegalProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'nda'>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'nda', label: 'NDA Agreement', icon: <Lock className="w-4 h-4" /> },
  ] as const;

  const handleTabChange = (tabId: 'privacy' | 'terms' | 'nda') => {
    setActiveTab(tabId);
    window.location.assign(`#/${tabId}`);
  };

  return (
    <div className="w-full text-left py-12 pb-24 max-w-7xl mx-auto px-6 space-y-12">
      {/* Header */}
      <section className="border-b border-obsidian-200 pb-8">
        <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block mb-2">
          LEGAL & DISCLOSURES DESK
        </span>
        <h1 className="font-serif text-4xl font-bold text-obsidian-900 mb-3">
          Constitutional Charters
        </h1>
        <p className="text-xs text-obsidian-550 text-obsidian-500 max-w-2xl leading-relaxed font-light">
          Please review the corporate directives, booking regulations, and nondisclosure covenants
          that govern L'ESTATE Switzerland hospitality partnerships.
        </p>
      </section>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-obsidian-100 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
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

      {/* Document Content */}
      <div className="min-h-[50vh] bg-white">
        {/* 1. PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  1. Client Data Shielding
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  L'ESTATE Rentals AG (hereinafter "the Company") is registered in Switzerland. We
                  operate under strict Swiss Federal Data Protection Act (FADP) and General Data
                  Protection Regulation (GDPR) guidelines. All guest coordinates, passport profiles,
                  private jet manifest sheets, and luxury booking billing records are encrypted
                  using military-grade security layers.
                </p>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  We never release private details to unverified agencies or third-party listings.
                  Concierge staff and chefs operate under strict NDAs regarding your travel dates
                  and on-site guest profiles.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  2. Device Activity Logs
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  To provide a seamless booking process, we collect device identifiers and search
                  parameters during your session. This is used solely to save active search date
                  parameters, wishlist details, and filters. We use cookies solely to persist your
                  local favorites collection across refreshes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  3. Global Security Measures
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Our servers utilize advanced firewalls and intrusion detection tools. Data
                  regarding transactions and booking receipts are stored in offline servers located
                  in alpine bunkers in Switzerland to guarantee complete protection from digital
                  vulnerability.
                </p>
              </section>
            </div>

            {/* Sidebar quick reference */}
            <div className="bg-obsidian-50 rounded-2xl border border-obsidian-200 p-6 h-fit space-y-6">
              <h4 className="font-serif text-base font-bold text-gold-600">Privacy Summary</h4>
              <ul className="space-y-4 text-xs font-light text-obsidian-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Swiss Protection:</strong> Governed by strict Swiss Federal FADP laws.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Third-Party Sharing:</strong> We never monetize client details or
                    coordinates.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Encrypted Files:</strong> Payment details are tokenized instantly.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* 2. TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  1. Booking & Security Deposits
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  All reservations require a 50% prepayment at the time of booking to secure the
                  villa or chalet. A refundable luxury security deposit is collected 14 days prior
                  to arrival. This deposit covers any physical damages to the estate, works of art,
                  or specialized equipment (e.g. marine craft, helipads).
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  2. Cancellation Policy
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Cancellations made 60+ days prior to check-in qualify for a full refund minus a
                  10% administration desk charge. Cancellations within 30 days are non-refundable
                  but can be converted into travel credits for future onboarding properties.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  3. On-Site Staffing & Conduct
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Guests agree to interact respectfully with villa hosts, private chefs, and
                  security personnel. The number of overnight guests must not exceed the capacity
                  confirmed in the booking receipt. No commercial parties, public photoshoots, or
                  press announcements are permitted on-site without prior written authorizations
                  from the corporate desk.
                </p>
              </section>
            </div>

            {/* Sidebar quick reference */}
            <div className="bg-obsidian-50 rounded-2xl border border-obsidian-200 p-6 h-fit space-y-6">
              <h4 className="font-serif text-base font-bold text-gold-600">Terms at a Glance</h4>
              <ul className="space-y-4 text-xs font-light text-obsidian-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>50% Retainer:</strong> Pre-paid amount required to lock the booking
                    calendar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Security Deposits:</strong> Refunded within 7 business days of checkout
                    inspection.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Conduct Code:</strong> Villa guests must obey local estate zoning
                    regulations.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* 3. NDA AGREEMENT */}
        {activeTab === 'nda' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  1. Covenant of Nondisclosure
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Guests residing at any L'ESTATE residential listing agree to maintain absolute,
                  unyielding confidentiality regarding the location of the villa, structural
                  security details, ingress/egress private lanes, and identities of other guests or
                  neighbors residing in adjacent properties.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  2. Restrictions on Media & Drones
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Guests are strictly prohibited from flying unmanned aerial vehicles (drones)
                  within a 3-mile radius of the estate boundaries. No video recordings showing
                  boundary security cameras, gates, or staff rosters are permitted to be published
                  on public platforms or social media profiles.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-obsidian-900">
                  3. Legal Redress & Swiss Jurisdiction
                </h2>
                <p className="text-xs text-obsidian-600 leading-relaxed font-light">
                  Any breach of this Nondisclosure Agreement will result in instant lease
                  termination without refund, forfeiture of the security deposit, and potential
                  legal damages pursued under Swiss Federal civil courts in Geneva.
                </p>
              </section>
            </div>

            {/* Sidebar quick reference */}
            <div className="bg-obsidian-50 rounded-2xl border border-obsidian-200 p-6 h-fit space-y-6">
              <h4 className="font-serif text-base font-bold text-gold-600">NDA Obligations</h4>
              <ul className="space-y-4 text-xs font-light text-obsidian-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Total Confidentiality:</strong> Covers villa details, layouts,
                    coordinates, and staff rosters.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>No Drone Flights:</strong> Banned within a 3-mile security envelope of
                    the property.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Swiss Prosecution:</strong> Breaches are directly prosecuted in Geneva
                    civil courts.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Legal;
