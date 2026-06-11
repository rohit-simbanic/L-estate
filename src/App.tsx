import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Sparkles, Mail } from 'lucide-react';
import { useStore } from './store/useStore';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';

// Custom inline SVG icons for deprecated brand icons
const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// Page Dynamic Imports (Lazy Loaded)
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const ItemDetail = lazy(() => import('./pages/ItemDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Showcase = lazy(() => import('./pages/Showcase'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Legal = lazy(() => import('./pages/Legal'));

function App() {
  const [currentPage, setCurrentPage] = useState<
    | 'home'
    | 'search'
    | 'detail'
    | 'about'
    | 'contact'
    | 'showcase'
    | 'docs'
    | 'favorites'
    | 'privacy'
    | 'terms'
    | 'nda'
  >('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const favorites = useStore((state) => state.favorites);

  // Listen to hash changes for robust routing without router peer dependency problems
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setMobileMenuOpen(false); // Close menu on navigation
      window.scrollTo(0, 0); // Scroll to top on navigation

      if (hash.startsWith('#/item/')) {
        const id = hash.replace('#/item/', '');
        setCurrentPage('detail');
        setSelectedPropertyId(id);
      } else if (hash === '#/search') {
        setCurrentPage('search');
        setSelectedPropertyId(null);
      } else if (hash === '#/about') {
        setCurrentPage('about');
        setSelectedPropertyId(null);
      } else if (hash === '#/contact') {
        setCurrentPage('contact');
        setSelectedPropertyId(null);
      } else if (hash === '#/showcase') {
        setCurrentPage('showcase');
        setSelectedPropertyId(null);
      } else if (hash === '#/docs') {
        setCurrentPage('docs');
        setSelectedPropertyId(null);
      } else if (hash === '#/favorites') {
        setCurrentPage('favorites');
        setSelectedPropertyId(null);
      } else if (hash === '#/privacy') {
        setCurrentPage('privacy');
        setSelectedPropertyId(null);
      } else if (hash === '#/terms') {
        setCurrentPage('terms');
        setSelectedPropertyId(null);
      } else if (hash === '#/nda') {
        setCurrentPage('nda');
        setSelectedPropertyId(null);
      } else {
        setCurrentPage('home');
        setSelectedPropertyId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navLinks = [
    { label: 'Home', hash: '#/' },
    { label: 'Explore Estates', hash: '#/search' },
    { label: 'Our Heritage', hash: '#/about' },
    { label: 'Contact', hash: '#/contact' },
    { label: 'Showcase', hash: '#/showcase' },
    { label: 'Docs', hash: '#/docs' },
  ];

  const renderActivePage = () => {
    switch (currentPage) {
      case 'search':
        return <Search />;
      case 'detail':
        return <ItemDetail propertyId={selectedPropertyId || ''} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'showcase':
        return <Showcase />;
      case 'docs':
        return <Documentation />;
      case 'favorites':
        return <Favorites />;
      case 'privacy':
        return <Legal initialTab="privacy" />;
      case 'terms':
        return <Legal initialTab="terms" />;
      case 'nda':
        return <Legal initialTab="nda" />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-obsidian-900 flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full bg-white/95 border-b border-obsidian-200/60 backdrop-blur-md py-4 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-gold-600 group-hover:rotate-12 transition-transform duration-350" />
            <span className="font-serif text-xl font-bold tracking-widest text-gold-600 group-hover:text-gold-700 transition-colors">
              L'ESTATE
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-obsidian-600">
            {navLinks.map((link) => {
              const isActive =
                (link.hash === '#/' && currentPage === 'home') ||
                (link.hash === '#/search' && currentPage === 'search') ||
                (link.hash === '#/about' && currentPage === 'about') ||
                (link.hash === '#/contact' && currentPage === 'contact') ||
                (link.hash === '#/showcase' && currentPage === 'showcase') ||
                (link.hash === '#/docs' && currentPage === 'docs');

              return (
                <a
                  key={link.label}
                  href={link.hash}
                  className={`hover:text-gold-600 transition-colors relative py-1 ${
                    isActive ? 'text-gold-600' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Wishlist & Mobile Trigger */}
          <div className="flex items-center gap-4">
            {/* Wishlist Link */}
            <a
              href="#/favorites"
              className={`relative p-2 transition-colors ${
                currentPage === 'favorites'
                  ? 'text-gold-600'
                  : 'text-obsidian-600 hover:text-gold-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentPage === 'favorites' ? 'fill-gold-600' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold-600 text-white font-bold text-[9px] flex items-center justify-center shadow-lg">
                  {favorites.length}
                </span>
              )}
            </a>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-obsidian-600 hover:text-gold-600 transition-colors focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-white border-b border-obsidian-200 absolute top-[72px] left-0 z-20 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col gap-6 text-sm font-bold uppercase tracking-wider text-left">
              {navLinks.map((link) => {
                const isActive =
                  (link.hash === '#/' && currentPage === 'home') ||
                  (link.hash === '#/search' && currentPage === 'search') ||
                  (link.hash === '#/about' && currentPage === 'about') ||
                  (link.hash === '#/contact' && currentPage === 'contact') ||
                  (link.hash === '#/showcase' && currentPage === 'showcase') ||
                  (link.hash === '#/docs' && currentPage === 'docs');

                return (
                  <a
                    key={link.label}
                    href={link.hash}
                    className={`hover:text-gold-600 py-1 transition-colors ${
                      isActive
                        ? 'text-gold-600 pl-2 border-l-2 border-gold-600'
                        : 'text-obsidian-600'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              {/* Mobile Wishlist Text Link */}
              <a
                href="#/favorites"
                className={`hover:text-gold-600 py-1 transition-colors flex items-center justify-between border-t border-obsidian-100 pt-4 ${
                  currentPage === 'favorites'
                    ? 'text-gold-600 pl-2 border-l-2 border-gold-600'
                    : 'text-obsidian-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart
                    className={`w-4 h-4 ${currentPage === 'favorites' ? 'fill-gold-600' : ''}`}
                  />
                  <span>Wishlist Collection</span>
                </span>
                <span className="w-5 h-5 rounded-full bg-gold-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {favorites.length}
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Container */}
      <main className="flex-grow flex flex-col w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedPropertyId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="w-full flex-grow flex flex-col"
          >
            <ErrorBoundary>
              <Suspense fallback={<PageSkeleton />}>{renderActivePage()}</Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Footer */}
      <footer className="w-full bg-obsidian-950 border-t border-obsidian-800/60 py-16 text-left text-xs text-obsidian-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Pitch */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-gold-500" />
              <span className="font-serif text-lg font-bold tracking-widest text-gold-400">
                L'ESTATE
              </span>
            </div>
            <p className="leading-relaxed font-light">
              Unveiling the world's most exclusive estates. We provide hand-curated ultra-luxury
              residential listings backed by a professional 5-star concierge desk.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-obsidian-200">
              Destinations
            </h4>
            <ul className="space-y-2.5 font-light">
              <li>
                <a href="#/search" className="hover:text-gold-400 transition-colors">
                  Amalfi Coast, Italy
                </a>
              </li>
              <li>
                <a href="#/search" className="hover:text-gold-400 transition-colors">
                  Aspen, Colorado
                </a>
              </li>
              <li>
                <a href="#/search" className="hover:text-gold-400 transition-colors">
                  Maldives Islands
                </a>
              </li>
              <li>
                <a href="#/search" className="hover:text-gold-400 transition-colors">
                  French Riviera, France
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-obsidian-200">
              The Brand
            </h4>
            <ul className="space-y-2.5 font-light">
              <li>
                <a href="#/about" className="hover:text-gold-400 transition-colors">
                  Our Heritage
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-gold-400 transition-colors">
                  Inquiries Desk
                </a>
              </li>
              <li>
                <a href="#/showcase" className="hover:text-gold-400 transition-colors">
                  Component Showcase
                </a>
              </li>
              <li>
                <a href="#/docs" className="hover:text-gold-400 transition-colors">
                  Documentation Desk
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-obsidian-200">
              VIP Newsletter
            </h4>
            <p className="leading-relaxed font-light">
              Subscribe to receive private invitations to newly onboarded villas and luxury estates.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to our VIP newsletter.');
              }}
              noValidate
              className="flex items-center bg-obsidian-900 border border-obsidian-800 rounded-lg overflow-hidden p-1.5 focus-within:border-gold-500/50"
            >
              <Mail className="w-4 h-4 text-obsidian-500 ml-2 flex-shrink-0" />
              <input
                type="email"
                placeholder="vip@email.com"
                required
                className="w-full bg-transparent border-0 px-2.5 py-1 text-xs text-obsidian-200 placeholder-obsidian-600 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gold-500 text-obsidian-950 font-bold px-3 py-1.5 rounded text-[10px] uppercase tracking-wider hover:bg-gold-400 transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-obsidian-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-obsidian-500 font-light">
            © {new Date().getFullYear()} L'ESTATE Rentals AG. All rights reserved. Registered Swiss
            Luxury Hospitality Brand.
          </p>
          <div className="flex gap-6 text-[10px] text-obsidian-500 font-light">
            <a href="#/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#/terms" className="hover:underline">
              Terms of Service
            </a>
            <a href="#/nda" className="hover:underline">
              NDA Agreement
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
