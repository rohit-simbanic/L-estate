import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, BedDouble, Bath, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '../../data/properties';
import { useStore } from '../../store/useStore';
import { useFavorites } from '../../hooks/useFavorites';
import { Button } from './Button';

export interface CardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

export const Card: React.FC<CardProps> = ({ property, onSelect }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const setHoveredPropertyId = useStore((state) => state.setHoveredPropertyId);
  const { toggleFavorite, isFavorite: isFavoriteCheck } = useFavorites();
  const isFavorite = isFavoriteCheck(property.id);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <motion.div
      className="group relative bg-white border border-obsidian-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-obsidian-950/5 transition-all flex flex-col h-full cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        setHoveredPropertyId(property.id);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredPropertyId(null);
      }}
      onClick={() => onSelect?.(property)}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Carousel Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-obsidian-100">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentImgIndex}
            src={property.images[currentImgIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/20 via-transparent to-black/10 pointer-events-none" />

        {/* Floating Top Bar */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center pointer-events-auto">
          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-obsidian-200 text-xs font-semibold text-obsidian-800 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-gold-500 stroke-gold-500" />
            <span>{property.rating.toFixed(2)}</span>
          </div>

          {/* Favorite Button */}
          <motion.button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full border transition-all shadow-sm ${
              isFavorite
                ? 'bg-gold-500 border-gold-500 text-white'
                : 'bg-white/90 border-obsidian-200 text-obsidian-600 hover:text-gold-600 hover:border-gold-500/40'
            }`}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Carousel Navigation Arrows */}
        <AnimatePresence>
          {isHovered && property.images.length > 1 && (
            <>
              <motion.button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 border border-obsidian-200 text-obsidian-700 hover:bg-obsidian-950 hover:text-white transition-all shadow-md hidden md:block"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 border border-obsidian-200 text-obsidian-700 hover:bg-obsidian-950 hover:text-white transition-all shadow-md hidden md:block"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {property.images.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImgIndex ? 'w-4 bg-gold-500' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Property Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Type & Location */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold tracking-wider text-gold-600 uppercase">
            {property.type}
          </span>
          <span className="text-xs text-obsidian-500 font-medium">
            {property.location.split(',')[1]?.trim() || property.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-obsidian-900 group-hover:text-gold-600 transition-colors mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-obsidian-550 text-obsidian-500 line-clamp-2 mb-4 leading-relaxed font-light">
          {property.description}
        </p>

        {/* Specs icons grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-obsidian-200 text-obsidian-600 mb-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-gold-600/70" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 border-x border-obsidian-200 justify-center">
            <Bath className="w-4 h-4 text-gold-600/70" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Maximize2 className="w-3.5 h-3.5 text-gold-600/70" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="font-serif text-xl font-bold text-gold-600">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-xs text-obsidian-500"> / night</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="group-hover:text-gold-600 text-xs py-1.5 px-4"
          >
            View Estate
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
