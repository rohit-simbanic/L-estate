import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';

export const usePropertyFilters = () => {
  const {
    filters,
    getFilteredProperties,
    setSearchQuery,
    setLocation,
    setPropertyType,
    setPriceRange,
    setBedrooms,
    setBathrooms,
    toggleAmenity,
    setSortBy,
    setCheckIn,
    setCheckOut,
    resetFilters,
  } = useStore(
    useShallow((state) => ({
      filters: state.filters,
      getFilteredProperties: state.getFilteredProperties,
      setSearchQuery: state.setSearchQuery,
      setLocation: state.setLocation,
      setPropertyType: state.setPropertyType,
      setPriceRange: state.setPriceRange,
      setBedrooms: state.setBedrooms,
      setBathrooms: state.setBathrooms,
      toggleAmenity: state.toggleAmenity,
      setSortBy: state.setSortBy,
      setCheckIn: state.setCheckIn,
      setCheckOut: state.setCheckOut,
      resetFilters: state.resetFilters,
    })),
  );

  const filteredProperties = getFilteredProperties();

  return {
    filters,
    filteredProperties,
    getFilteredProperties,
    setSearchQuery,
    setLocation,
    setPropertyType,
    setPriceRange,
    setBedrooms,
    setBathrooms,
    toggleAmenity,
    setSortBy,
    setCheckIn,
    setCheckOut,
    resetFilters,
  };
};
