import { create } from 'zustand';
import { type Property, MOCK_PROPERTIES } from '../data/properties';

export interface FilterState {
  searchQuery: string;
  location: string;
  propertyType: 'All' | 'Villa' | 'Penthouse' | 'Chalet' | 'Mansion' | 'Estate';
  priceRange: [number, number];
  bedrooms: 'Any' | number;
  bathrooms: 'Any' | number;
  amenities: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  checkIn: string;
  checkOut: string;
}

interface Booking {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  totalPrice: number;
  createdAt: string;
}

interface GlobalStore {
  properties: Property[];
  filters: FilterState;
  activePropertyId: string | null;
  hoveredPropertyId: string | null;
  favorites: string[];
  bookings: Booking[];

  // Setters
  setSearchQuery: (query: string) => void;
  setLocation: (location: string) => void;
  setPropertyType: (type: FilterState['propertyType']) => void;
  setPriceRange: (range: [number, number]) => void;
  setBedrooms: (count: 'Any' | number) => void;
  setBathrooms: (count: 'Any' | number) => void;
  toggleAmenity: (amenity: string) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  resetFilters: () => void;

  setActivePropertyId: (id: string | null) => void;
  setHoveredPropertyId: (id: string | null) => void;
  toggleFavorite: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;

  // Computed (helper function to get filtered items)
  getFilteredProperties: () => Property[];
}

const initialFilters: FilterState = {
  searchQuery: '',
  location: 'All',
  propertyType: 'All',
  priceRange: [0, 6000],
  bedrooms: 'Any',
  bathrooms: 'Any',
  amenities: [],
  sortBy: 'featured',
  checkIn: '',
  checkOut: '',
};

export const useStore = create<GlobalStore>((set, get) => ({
  properties: MOCK_PROPERTIES,
  filters: initialFilters,
  activePropertyId: null,
  hoveredPropertyId: null,
  favorites: (() => {
    try {
      const saved = localStorage.getItem('lestate_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),
  bookings: [],

  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setLocation: (location) => set((state) => ({ filters: { ...state.filters, location } })),
  setPropertyType: (type) =>
    set((state) => ({ filters: { ...state.filters, propertyType: type } })),
  setPriceRange: (range) => set((state) => ({ filters: { ...state.filters, priceRange: range } })),
  setBedrooms: (count) => set((state) => ({ filters: { ...state.filters, bedrooms: count } })),
  setBathrooms: (count) => set((state) => ({ filters: { ...state.filters, bathrooms: count } })),

  toggleAmenity: (amenity) =>
    set((state) => {
      const active = state.filters.amenities;
      const nextAmenities = active.includes(amenity)
        ? active.filter((a) => a !== amenity)
        : [...active, amenity];
      return { filters: { ...state.filters, amenities: nextAmenities } };
    }),

  setSortBy: (sort) => set((state) => ({ filters: { ...state.filters, sortBy: sort } })),
  setCheckIn: (date) => set((state) => ({ filters: { ...state.filters, checkIn: date } })),
  setCheckOut: (date) => set((state) => ({ filters: { ...state.filters, checkOut: date } })),

  resetFilters: () => set({ filters: initialFilters }),

  setActivePropertyId: (id) => set({ activePropertyId: id }),
  setHoveredPropertyId: (id) => set({ hoveredPropertyId: id }),

  toggleFavorite: (id) =>
    set((state) => {
      const activeFavs = state.favorites;
      const nextFavs = activeFavs.includes(id)
        ? activeFavs.filter((fId) => fId !== id)
        : [...activeFavs, id];
      try {
        localStorage.setItem('lestate_favorites', JSON.stringify(nextFavs));
      } catch (e) {
        console.error('Failed to save favorites to localStorage', e);
      }
      return { favorites: nextFavs };
    }),

  addBooking: (bookingData) =>
    set((state) => {
      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return { bookings: [...state.bookings, newBooking] };
    }),

  getFilteredProperties: () => {
    const { properties, filters } = get();
    let result = [...properties];

    // Filter by search query (text search in title or location)
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q),
      );
    }

    // Filter by location (dropdown or search)
    if (filters.location !== 'All') {
      const loc = filters.location.toLowerCase();
      result = result.filter((p) => p.location.toLowerCase().includes(loc));
    }

    // Filter by Property Type
    if (filters.propertyType !== 'All') {
      result = result.filter((p) => p.type === filters.propertyType);
    }

    // Filter by Price Range
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

    // Filter by Bedrooms
    if (filters.bedrooms !== 'Any') {
      result = result.filter((p) => p.bedrooms >= (filters.bedrooms as number));
    }

    // Filter by Bathrooms
    if (filters.bathrooms !== 'Any') {
      result = result.filter((p) => p.bathrooms >= (filters.bathrooms as number));
    }

    // Filter by Amenities
    if (filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities.every((amenity) => p.amenities.includes(amenity)),
      );
    }

    // Sort Results
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  },
}));
