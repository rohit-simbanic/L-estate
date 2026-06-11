import React from 'react';
import { useStore } from '../store/useStore';
import { useFavorites } from '../hooks/useFavorites';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Heart, Compass } from 'lucide-react';
import type { Property } from '../data/properties';

export const Favorites: React.FC = () => {
  useDocumentTitle('Your Wishlist', 'Manage your hand-selected luxury listings.');

  const properties = useStore((state) => state.properties);
  const { favorites } = useFavorites();

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  const handlePropertySelect = (property: Property) => {
    window.location.hash = `#/item/${property.id}`;
  };

  return (
    <div className="w-full min-h-[75vh] py-12 pb-24 max-w-7xl mx-auto px-6 flex flex-col text-left">
      {/* Header */}
      <section className="border-b border-obsidian-200 pb-8 mb-10">
        <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block mb-2">
          YOUR COLLECTION
        </span>
        <h1 className="font-serif text-4xl font-bold text-obsidian-900 mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-gold-600 fill-gold-100" />
          <span>Wishlist Collection</span>
        </h1>
        <p className="text-xs text-obsidian-600 max-w-xl leading-relaxed">
          Manage your hand-selected luxury listings. Pre-plan your destinations, compare
          specifications, or book directly from your curated personal portfolio.
        </p>
      </section>

      {/* Favorites Grid / Empty state */}
      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteProperties.map((property) => (
            <Card key={property.id} property={property} onSelect={handlePropertySelect} />
          ))}
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-6">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-obsidian-900 mb-2">
            No Wishlisted Estates Yet
          </h3>
          <p className="text-xs text-obsidian-600 leading-relaxed mb-8 font-light">
            Explore our curated destinations and click the heart icon on any property card to save
            it here in your personal collection.
          </p>
          <Button
            onClick={() => (window.location.hash = '#/search')}
            variant="primary"
            className="px-8 font-bold text-xs uppercase"
          >
            <Compass className="w-4 h-4 mr-2" />
            <span>Start Exploring</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
