import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { usePropertyFilters } from '../../hooks/usePropertyFilters';
import { Button } from '../../components/ui/Button';

interface SearchBarProps {
  onSearchSubmit?: () => void;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit, compact = false }) => {
  const { filters, setSearchQuery, setLocation, setCheckIn, setCheckOut } = usePropertyFilters();

  const [localQuery, setLocalQuery] = useState(filters.searchQuery);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [showDatesDropdown, setShowDatesDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(filters.location);
  const [guests, setGuests] = useState(1);

  const locations = [
    'All Destinations',
    'Amalfi Coast, Italy',
    'Aspen, Colorado',
    'New York City, New York',
    'Maldives',
    'French Riviera, France',
    'Beverly Hills, California',
    'Ibiza, Spain',
    'Dubai, UAE',
  ];

  const handleSearch = () => {
    setSearchQuery(localQuery);
    setLocation(selectedLocation === 'All Destinations' ? 'All' : selectedLocation);
    onSearchSubmit?.();
  };

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setShowLocationDropdown(false);
  };

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 ${compact ? 'py-2' : 'py-6'}`}>
      <div className="relative bg-white border border-obsidian-200 rounded-3xl md:rounded-full p-3 md:p-2 shadow-xl flex flex-col md:flex-row items-center gap-3 md:gap-0 justify-between">
        {/* Destination Search & Select */}
        <div className="relative flex-grow w-full md:w-auto flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-obsidian-100">
          <MapPin className="w-5 h-5 text-gold-600 mr-3 flex-shrink-0" />
          <div className="flex flex-col flex-grow text-left">
            <span className="text-[10px] uppercase font-bold text-gold-600 tracking-wider">
              Where
            </span>
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowGuestsDropdown(false);
                setShowDatesDropdown(false);
              }}
              className="text-sm font-medium text-obsidian-900 flex items-center gap-1 focus:outline-none py-0.5 cursor-pointer w-full text-left"
            >
              <span className="truncate">
                {selectedLocation === 'All' ? 'All Destinations' : selectedLocation}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-obsidian-400" />
            </button>
          </div>

          {/* Location Dropdown */}
          <AnimatePresence>
            {showLocationDropdown && (
              <motion.div
                className="absolute top-16 left-0 right-0 md:right-auto z-30 w-full md:w-72 bg-white border border-obsidian-200 rounded-2xl overflow-hidden shadow-2xl p-2 mx-auto md:mx-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="p-2 border-b border-obsidian-100 mb-1">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    className="w-full bg-obsidian-50 border border-obsidian-100 rounded-lg px-3 py-1.5 text-xs text-obsidian-900 placeholder-obsidian-400 focus:outline-none focus:border-gold-500/50"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="max-h-56 overflow-y-auto custom-scrollbar">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleLocationSelect(loc)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        selectedLocation === loc ||
                        (selectedLocation === 'All' && loc === 'All Destinations')
                          ? 'bg-obsidian-950 text-white font-semibold'
                          : 'text-obsidian-700 hover:bg-obsidian-100/70 hover:text-obsidian-900'
                      }`}
                    >
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Selector */}
        <div className="relative flex-grow w-full md:w-auto flex items-center px-4 py-2 md:py-0 border-b md:border-b-0 md:border-r border-obsidian-100 text-left">
          <Calendar className="w-5 h-5 text-gold-600 mr-3 flex-shrink-0" />
          <div className="flex flex-col flex-grow">
            <span className="text-[10px] uppercase font-bold text-gold-600 tracking-wider">
              When
            </span>
            <button
              onClick={() => {
                setShowDatesDropdown(!showDatesDropdown);
                setShowLocationDropdown(false);
                setShowGuestsDropdown(false);
              }}
              className="text-sm font-medium text-obsidian-900 flex items-center gap-1 focus:outline-none py-0.5 cursor-pointer text-left w-full"
            >
              <span className="truncate">
                {filters.checkIn || filters.checkOut
                  ? `${filters.checkIn}${filters.checkOut ? ' to ' + filters.checkOut : ''}`
                  : 'Add Dates'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-obsidian-400" />
            </button>
          </div>

          {/* Dates Dropdown */}
          <AnimatePresence>
            {showDatesDropdown && (
              <motion.div
                className="absolute top-16 left-0 right-0 md:right-auto z-30 w-full md:w-80 bg-white border border-obsidian-200 rounded-2xl overflow-hidden shadow-2xl p-4 text-left mx-auto md:mx-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-obsidian-100 pb-2 mb-1">
                    <span className="text-xs font-bold text-obsidian-900">Select Travel Dates</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCheckIn('');
                        setCheckOut('');
                      }}
                      className="text-[10px] text-obsidian-500 hover:text-gold-600 underline font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider block mb-1">
                        Check In
                      </label>
                      <input
                        type="date"
                        value={filters.checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-obsidian-50 border border-obsidian-200 rounded-lg px-2.5 py-1.5 text-xs text-obsidian-900 focus:outline-none focus:border-gold-600 focus:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gold-600 tracking-wider block mb-1">
                        Check Out
                      </label>
                      <input
                        type="date"
                        value={filters.checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-obsidian-50 border border-obsidian-200 rounded-lg px-2.5 py-1.5 text-xs text-obsidian-900 focus:outline-none focus:border-gold-600 focus:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guest Selector */}
        <div className="relative flex-grow w-full md:w-auto flex items-center px-4 py-2 border-b md:border-b-0 border-obsidian-100 md:border-transparent pb-3.5 md:pb-2 text-left">
          <Users className="w-5 h-5 text-gold-600 mr-3 flex-shrink-0" />
          <div className="flex flex-col flex-grow">
            <span className="text-[10px] uppercase font-bold text-gold-600 tracking-wider">
              Who
            </span>
            <button
              onClick={() => {
                setShowGuestsDropdown(!showGuestsDropdown);
                setShowLocationDropdown(false);
                setShowDatesDropdown(false);
              }}
              className="text-sm font-medium text-obsidian-900 flex items-center gap-1 focus:outline-none py-0.5 cursor-pointer text-left"
            >
              <span>
                {guests} guest{guests > 1 ? 's' : ''}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-obsidian-450" />
            </button>
          </div>

          {/* Guests Dropdown */}
          <AnimatePresence>
            {showGuestsDropdown && (
              <motion.div
                className="absolute top-16 left-0 right-0 md:right-auto z-30 w-full md:w-56 bg-white border border-obsidian-200 rounded-2xl overflow-hidden shadow-2xl p-4 text-left mx-auto md:mx-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-obsidian-900">Guests</span>
                    <span className="text-[10px] text-obsidian-500">Number of travelers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-7 h-7 rounded-full border border-obsidian-200 text-obsidian-600 flex items-center justify-center hover:border-gold-500/50 hover:text-gold-600 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold text-obsidian-900">{guests}</span>
                    <button
                      onClick={() => setGuests((g) => Math.min(16, g + 1))}
                      className="w-7 h-7 rounded-full border border-obsidian-200 text-obsidian-600 flex items-center justify-center hover:border-gold-500/50 hover:text-gold-600 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Action Button */}
        <div className="px-2 w-full md:w-auto">
          <Button
            onClick={handleSearch}
            variant="primary"
            className="w-full md:w-auto px-8 py-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold text-white shadow-lg shadow-obsidian-900/10"
          >
            <Search className="w-4 h-4" />
            <span>Search Estates</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
