import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { usePropertyFilters } from '../hooks/usePropertyFilters';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Card } from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Map } from '../features/search/Map';
import { FilterPanel } from '../features/search/FilterPanel';
import { SearchBar } from '../features/search/SearchBar';
import { Modal } from '../components/ui/Modal';
import { SlidersHorizontal, Map as MapIcon, List as ListIcon, Compass } from 'lucide-react';
import type { Property } from '../data/properties';

export const Search: React.FC = () => {
  useDocumentTitle(
    'Search Luxury Estates',
    'Explore our hand-selected luxury listings in premium destinations.',
  );

  const activePropertyId = useStore((state) => state.activePropertyId);
  const { filters, filteredProperties, getFilteredProperties, resetFilters } = usePropertyFilters();

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(false);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>(() =>
    getFilteredProperties(),
  );

  // Trigger loading visual states whenever filters query variables update
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setLoading(true);
    });
    const timer = setTimeout(() => {
      setDisplayedProperties(getFilteredProperties());
      setLoading(false);
    }, 300); // 300ms simulated backend delay
    return () => {
      cancelAnimationFrame(handle);
      clearTimeout(timer);
    };
  }, [filters, getFilteredProperties]);

  const handlePropertySelect = (property: Property) => {
    window.location.hash = `#/item/${property.id}`;
  };

  const handlePopupClick = (property: Property) => {
    setMobileViewMode('list');
    setTimeout(() => {
      const element = document.getElementById(`property-card-${property.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Scroll active property card into view when map pin / popup is clicked
  useEffect(() => {
    if (activePropertyId && mobileViewMode === 'list') {
      const timer = setTimeout(() => {
        const element = document.getElementById(`property-card-${activePropertyId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activePropertyId, mobileViewMode]);

  return (
    <div className="w-full min-h-[90vh] flex flex-col">
      {/* Search Bar Sub-Header */}
      <div className="bg-white border-b border-obsidian-200/60 sticky top-[72px] z-20 py-2 backdrop-blur-md bg-opacity-95">
        <SearchBar compact={true} />
      </div>

      {/* Main Split Content */}
      <div className="flex-grow flex relative">
        {/* Listings Section (60% on desktop) */}
        <div
          className={`w-full lg:w-[60%] flex flex-col px-6 py-8 ${mobileViewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}
        >
          {/* Listings Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-left">
              <span className="text-xs text-obsidian-555 font-medium">
                {filteredProperties.length} luxury estate
                {filteredProperties.length !== 1 ? 's' : ''} available
              </span>
              <h1 className="font-serif text-2xl font-bold mt-1 text-obsidian-900">
                {filters.location === 'All' ? 'All Destinations' : filters.location}
              </h1>
            </div>

            {/* Filter Toggle & Sorting options */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFiltersModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-obsidian-200 text-obsidian-850 hover:bg-obsidian-50 hover:border-obsidian-300 transition-all cursor-pointer text-xs font-semibold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold-600" />
                <span>Filters</span>
                {filters.amenities.length +
                  (filters.propertyType !== 'All' ? 1 : 0) +
                  (filters.bedrooms !== 'Any' ? 1 : 0) >
                  0 && (
                  <span className="w-4 h-4 rounded-full bg-gold-600 text-white flex items-center justify-center text-[9px] font-bold">
                    {filters.amenities.length +
                      (filters.propertyType !== 'All' ? 1 : 0) +
                      (filters.bedrooms !== 'Any' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(filters.propertyType !== 'All' ||
            filters.bedrooms !== 'Any' ||
            filters.amenities.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6 text-left">
              {filters.propertyType !== 'All' && (
                <span className="text-[10px] bg-gold-100 text-gold-800 border border-gold-200 px-2.5 py-1 rounded-full font-semibold">
                  Type: {filters.propertyType}
                </span>
              )}
              {filters.bedrooms !== 'Any' && (
                <span className="text-[10px] bg-gold-100 text-gold-800 border border-gold-200 px-2.5 py-1 rounded-full font-semibold">
                  {filters.bedrooms}+ Beds
                </span>
              )}
              {filters.amenities.map((a) => (
                <span
                  key={a}
                  className="text-[10px] bg-gold-100 text-gold-800 border border-gold-200 px-2.5 py-1 rounded-full font-semibold"
                >
                  {a}
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="text-[10px] text-obsidian-500 hover:text-gold-600 font-semibold underline self-center ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Listings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : displayedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
              {displayedProperties.map((property) => (
                <div
                  key={property.id}
                  id={`property-card-${property.id}`}
                  className={`transition-all duration-500 rounded-2xl ${
                    activePropertyId === property.id
                      ? 'ring-2 ring-gold-600 scale-[1.01] shadow-lg shadow-gold-500/10'
                      : ''
                  }`}
                >
                  <Card property={property} onSelect={handlePropertySelect} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <Compass className="w-12 h-12 text-gold-600/40 mb-4 animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-obsidian-900 mb-2">
                No Estates Match Your Filters
              </h3>
              <p className="text-xs text-obsidian-650 text-obsidian-600 leading-relaxed mb-6">
                Try widening your price range, removing amenity requirements, or expanding your
                location search to discover luxury properties.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-obsidian-950 text-white font-bold text-xs hover:bg-obsidian-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Map Section (40% on desktop) */}
        <div
          className={`w-full lg:w-[40%] h-[calc(100vh-144px)] lg:h-[calc(90vh-80px)] lg:sticky lg:top-[128px] overflow-hidden ${mobileViewMode === 'list' ? 'hidden lg:block' : 'block'}`}
        >
          <Map properties={filteredProperties} onPopupClick={handlePopupClick} />
        </div>
      </div>

      {/* Floating Toggle Button for Mobile View */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1010] lg:hidden">
        <button
          onClick={() => setMobileViewMode((prev) => (prev === 'list' ? 'map' : 'list'))}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gold-600 text-white font-bold text-xs shadow-2xl hover:bg-gold-700 transition-all border border-gold-600 cursor-pointer"
        >
          {mobileViewMode === 'list' ? (
            <>
              <MapIcon className="w-4 h-4" />
              <span>Show Map</span>
            </>
          ) : (
            <>
              <ListIcon className="w-4 h-4" />
              <span>Show List</span>
            </>
          )}
        </button>
      </div>

      {/* Filters Modal Drawer */}
      <Modal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        title="Filter Luxury Estates"
        size="md"
      >
        <FilterPanel />
        <div className="mt-6 pt-4 border-t border-obsidian-150 flex justify-end gap-3">
          <button
            onClick={() => {
              resetFilters();
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-obsidian-500 hover:text-gold-600 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowFiltersModal(false)}
            className="px-6 py-2.5 rounded-full bg-obsidian-950 text-white font-bold text-xs hover:bg-obsidian-850 transition-colors"
          >
            Show {filteredProperties.length} Estate{filteredProperties.length !== 1 ? 's' : ''}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Search;
