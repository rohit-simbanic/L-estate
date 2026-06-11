import React from 'react';
import { usePropertyFilters } from '../../hooks/usePropertyFilters';
import { SlidersHorizontal, RefreshCcw, DollarSign, Bed, Bath, Sparkles } from 'lucide-react';

export const FilterPanel: React.FC = () => {
  const {
    filters,
    setPropertyType,
    setPriceRange,
    setBedrooms,
    setBathrooms,
    toggleAmenity,
    resetFilters,
    setSortBy,
  } = usePropertyFilters();

  const propertyTypes: Array<typeof filters.propertyType> = [
    'All',
    'Villa',
    'Penthouse',
    'Chalet',
    'Mansion',
    'Estate',
  ];

  const luxuryAmenities = [
    'Private Pool',
    'Ocean View',
    'Butler Service',
    'Spa',
    'Gym',
    'Ski-in/Ski-out',
    'Helipad',
  ];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const value = parseInt(e.target.value);
    const nextRange: [number, number] = [...filters.priceRange];
    nextRange[index] = value;

    // Validate range bounds
    if (index === 0 && value <= filters.priceRange[1]) {
      setPriceRange(nextRange);
    } else if (index === 1 && value >= filters.priceRange[0]) {
      setPriceRange(nextRange);
    }
  };

  return (
    <div className="w-full bg-white border border-obsidian-200 rounded-2xl p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-obsidian-150 mb-6">
        <div className="flex items-center gap-2 text-gold-600">
          <SlidersHorizontal className="w-4 h-4" />
          <h3 className="font-serif font-bold text-sm tracking-wider uppercase">
            Advanced Filters
          </h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-obsidian-500 hover:text-gold-600 flex items-center gap-1 transition-colors font-semibold cursor-pointer"
        >
          <RefreshCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-6 text-left">
        {/* Sort By */}
        <div>
          <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider block mb-2.5">
            Sort Estates
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'featured', label: 'Featured' },
              { id: 'rating', label: 'High Rating' },
              { id: 'price-asc', label: 'Price: Low - High' },
              { id: 'price-desc', label: 'Price: High - Low' },
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() => setSortBy(sort.id as typeof filters.sortBy)}
                className={`px-3 py-2 rounded-lg text-[11px] font-medium transition-all text-center border cursor-pointer ${
                  filters.sortBy === sort.id
                    ? 'bg-gold-600 text-white border-gold-600 font-semibold'
                    : 'bg-obsidian-50 text-obsidian-750 border-obsidian-200 hover:border-gold-500/30 hover:text-gold-600 hover:bg-white'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider block mb-2.5">
            Estate Category
          </label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setPropertyType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
                  filters.propertyType === type
                    ? 'bg-gold-600 text-white border-gold-600 font-semibold'
                    : 'bg-obsidian-50 text-obsidian-750 border-obsidian-200 hover:border-gold-500/30 hover:text-gold-600 hover:bg-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider">
              Nightly Rate (USD)
            </label>
            <span className="text-xs font-semibold text-gold-600">
              ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}+
            </span>
          </div>
          <div className="space-y-4">
            <div className="relative pt-1">
              <input
                type="range"
                min="0"
                max="6000"
                step="100"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full accent-gold-600 bg-obsidian-100 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative flex-grow">
                <DollarSign className="w-3.5 h-3.5 text-obsidian-450 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full bg-obsidian-50 border border-obsidian-200 rounded-lg pl-8 pr-3 py-2 text-xs text-obsidian-900 placeholder-obsidian-400 focus:outline-none focus:border-gold-500/50 focus:bg-white"
                />
              </div>
              <span className="text-obsidian-500 text-xs">to</span>
              <div className="relative flex-grow">
                <DollarSign className="w-3.5 h-3.5 text-obsidian-450 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full bg-obsidian-50 border border-obsidian-200 rounded-lg pl-8 pr-3 py-2 text-xs text-obsidian-900 placeholder-obsidian-400 focus:outline-none focus:border-gold-500/50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bedrooms / Bathrooms count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider flex items-center gap-1.5 mb-2.5">
              <Bed className="w-3.5 h-3.5 text-gold-600/60" />
              <span>Bedrooms</span>
            </label>
            <div className="flex gap-1 bg-obsidian-50 p-1 border border-obsidian-200 rounded-lg">
              {['Any', 2, 4, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setBedrooms(num as typeof filters.bedrooms)}
                  className={`flex-grow py-1 rounded text-center text-xs font-medium transition-all cursor-pointer ${
                    filters.bedrooms === num
                      ? 'bg-gold-600 text-white font-bold'
                      : 'text-obsidian-700 hover:text-gold-600'
                  }`}
                >
                  {num === 'Any' ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider flex items-center gap-1.5 mb-2.5">
              <Bath className="w-3.5 h-3.5 text-gold-600/60" />
              <span>Bathrooms</span>
            </label>
            <div className="flex gap-1 bg-obsidian-50 p-1 border border-obsidian-200 rounded-lg">
              {['Any', 2, 4, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setBathrooms(num as typeof filters.bathrooms)}
                  className={`flex-grow py-1 rounded text-center text-xs font-medium transition-all cursor-pointer ${
                    filters.bathrooms === num
                      ? 'bg-gold-600 text-white font-bold'
                      : 'text-obsidian-700 hover:text-gold-600'
                  }`}
                >
                  {num === 'Any' ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Luxury Amenities */}
        <div>
          <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600/60" />
            <span>Luxury Amenities</span>
          </label>
          <div className="grid grid-cols-1 gap-2.5 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
            {luxuryAmenities.map((amenity) => {
              const isChecked = filters.amenities.includes(amenity);
              return (
                <label
                  key={amenity}
                  className="flex items-center justify-between cursor-pointer group text-xs font-medium text-obsidian-700 hover:text-gold-600 transition-colors"
                >
                  <span>{amenity}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 rounded border-obsidian-300 accent-gold-600 bg-white border-2 text-gold-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
