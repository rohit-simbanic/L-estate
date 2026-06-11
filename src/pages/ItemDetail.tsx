import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { useFavorites } from '../hooks/useFavorites';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { FormField } from '../components/ui/FormField';
import { PageSkeleton } from '../components/ui/Skeleton';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Map } from '../features/search/Map';
import type { Property } from '../data/properties';
import {
  Star,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  CheckCircle2,
  X,
} from 'lucide-react';

// Form validation schema with Zod
const bookingSchema = z.object({
  fullName: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  checkIn: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Select a valid check-in date' }),
  checkOut: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Select a valid check-out date' }),
  guests: z.number().min(1, { message: 'At least 1 guest is required' }),
  vipConcierge: z.boolean().optional(),
});

type BookingFormInputs = z.infer<typeof bookingSchema>;

interface ItemDetailProps {
  propertyId: string;
}

interface LastBooking {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  totalPrice: number;
  title: string;
  location: string;
  nights: number;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({ propertyId }) => {
  const { properties, filters, addBooking } = useStore(
    useShallow((state) => ({
      properties: state.properties,
      filters: state.filters,
      addBooking: state.addBooking,
    })),
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [lastBookingInfo, setLastBookingInfo] = useState<LastBooking | null>(null);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: '',
      email: '',
      checkIn: filters.checkIn || '',
      checkOut: filters.checkOut || '',
      guests: 1,
      vipConcierge: false,
    },
  });

  const [property, setProperty] = useState<Property | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getPropertyById(propertyId).then((data) => {
      if (active) {
        setProperty(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [propertyId]);

  useDocumentTitle(
    property ? property.title : 'Estate Details',
    property ? property.description : '',
  );

  const { toggleFavorite, isFavorite: isFavoriteCheck } = useFavorites();

  // Disable body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const checkInDate = watch('checkIn');
  const checkOutDate = watch('checkOut');
  const watchGuests = watch('guests');
  const watchConcierge = watch('vipConcierge');

  // Calculate price breakdown dynamically
  let nights = 0;
  if (checkInDate && checkOutDate) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const nightlyBase = property ? property.price : 0;
  const baseTotal = nights > 0 ? nightlyBase * nights : 0;
  const cleaningFee = nights > 0 ? 350 : 0;
  const conciergeFee = watchConcierge ? 500 : 0;
  const luxuryTax = nights > 0 ? Math.round(baseTotal * 0.08) : 0;
  const grandTotal = baseTotal + cleaningFee + conciergeFee + luxuryTax;

  const handleBookingSubmit = (data: BookingFormInputs) => {
    if (!property) return;
    const newBooking = {
      propertyId: property.id,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      name: data.fullName,
      email: data.email,
      totalPrice: grandTotal,
    };

    addBooking(newBooking);
    setLastBookingInfo({
      ...newBooking,
      title: property.title,
      location: property.location,
      nights,
    });
    setSuccessModalOpen(true);
  };

  const handleOpenLightbox = (index: number) => {
    setActiveImgIndex(index);
    setLightboxOpen(true);
  };

  // Get similar properties (same category or similar price, excluding current)
  const similarProperties = property
    ? properties
        .filter(
          (p) =>
            p.id !== property.id &&
            (p.type === property.type || Math.abs(p.price - property.price) < 1000),
        )
        .slice(0, 3)
    : [];

  if (loading) {
    return <PageSkeleton />;
  }

  // If property not found, show error state
  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <h2 className="font-serif text-2xl font-bold text-obsidian-900 mb-4">Estate Not Found</h2>
        <p className="text-xs text-obsidian-600 mb-6">
          The luxury property you are looking for does not exist or has been removed from our
          listings.
        </p>
        <Button
          onClick={() => (window.location.hash = '#/search')}
          variant="primary"
          className="px-6 py-2.5 rounded-full text-xs font-bold"
        >
          Return to Explore
        </Button>
      </div>
    );
  }

  const isFavorite = isFavoriteCheck(property.id);

  return (
    <div className="w-full pb-24 text-left">
      {/* breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xs text-obsidian-650 text-obsidian-650 text-obsidian-600">
          <span
            className="hover:text-gold-600 cursor-pointer"
            onClick={() => (window.location.hash = '#/')}
          >
            Home
          </span>
          <span className="mx-2">&gt;</span>
          <span
            className="hover:text-gold-600 cursor-pointer"
            onClick={() => (window.location.hash = '#/search')}
          >
            Estates
          </span>
          <span className="mx-2">&gt;</span>
          <span className="text-obsidian-800 font-semibold">{property.title}</span>
        </div>

        <button
          onClick={() => toggleFavorite(property.id)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all ${
            isFavorite
              ? 'bg-gold-100 border-gold-500 text-gold-700 shadow-md shadow-gold-500/5'
              : 'border-obsidian-200 text-obsidian-700 hover:border-gold-600 hover:text-gold-700 hover:bg-obsidian-50'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          <span>{isFavorite ? 'Wishlisted' : 'Save Estate'}</span>
        </button>
      </div>

      {/* Editorial Image Gallery (Desktop Grid Layout) */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden shadow-2xl h-[280px] sm:h-[350px] md:h-[450px]">
          {/* Main Large Image */}
          <div
            className="col-span-1 md:col-span-2 relative h-full overflow-hidden cursor-pointer bg-obsidian-100"
            onClick={() => handleOpenLightbox(0)}
          >
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
            {property.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-obsidian-950/80 backdrop-blur-xs text-white border border-obsidian-800 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 md:hidden">
                <span>+{property.images.length - 1} Photos</span>
              </div>
            )}
          </div>

          {/* Auxiliary Images Grid */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            {property.images.slice(1, 5).map((img: string, index: number) => (
              <div
                key={index}
                className="relative h-full overflow-hidden cursor-pointer bg-obsidian-100"
                onClick={() => handleOpenLightbox(index + 1)}
              >
                <img
                  src={img}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/15 hover:bg-black/0 transition-colors" />
                {index === 3 && property.images.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-gold-450 text-gold-500 font-serif text-lg font-bold">
                    +{property.images.length - 5} photos
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Core Layout: 2 Columns */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Property Details (66% space) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20 text-[10px] font-bold tracking-widest uppercase">
                {property.type}
              </span>
              <div className="flex items-center gap-1 text-gold-400 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>
                  {property.rating} ({property.reviewsCount} reviews)
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian-900 mb-2">
              {property.title}
            </h1>

            <div className="flex items-center text-xs text-obsidian-600 gap-1">
              <MapPin className="w-4 h-4 text-gold-600/70" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl border border-obsidian-200 bg-obsidian-50 text-obsidian-800">
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <BedDouble className="w-6 h-6 text-gold-600 mb-1" />
              <span className="text-xs font-bold">{property.bedrooms} Bedrooms</span>
              <span className="text-[10px] text-obsidian-500 mt-0.5">En-suite baths</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center border-x border-obsidian-200">
              <Bath className="w-6 h-6 text-gold-600 mb-1" />
              <span className="text-xs font-bold">{property.bathrooms} Bathrooms</span>
              <span className="text-[10px] text-obsidian-500 mt-0.5">Luxury tubs</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <Maximize2 className="w-5.5 h-5.5 text-gold-600 mb-1.5" />
              <span className="text-xs font-bold">{property.area.toLocaleString()} sqft</span>
              <span className="text-[10px] text-obsidian-500 mt-0.5">Living space</span>
            </div>
          </div>

          {/* Host Details */}
          <div className="flex items-center gap-4 py-4 border-y border-obsidian-200/60">
            <img
              src={property.host.image}
              alt={property.host.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/30"
            />
            <div className="text-left">
              <h4 className="font-serif text-sm font-bold text-obsidian-900">
                Hosted by {property.host.name}
              </h4>
              <p className="text-[11px] text-obsidian-550 text-obsidian-500">
                Exclusive Luxury Host • {property.host.rating.toFixed(2)} rating
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-gold-600">The Estate Description</h3>
            <p className="text-xs text-obsidian-700 leading-relaxed font-light">
              {property.description}
            </p>
          </div>

          {/* Luxury Amenities */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold-600">
              Premium Amenities Included
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.amenities.map((amenity: string) => (
                <div
                  key={amenity}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-obsidian-200 bg-white text-xs text-obsidian-800 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-gold-600/70" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Location */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold-600">Estate Location</h3>
            <div className="h-64 rounded-2xl overflow-hidden border border-obsidian-200">
              <Map
                properties={[property]}
                center={property.coordinates}
                zoom={11}
                interactive={false}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form Widget (33% space) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-obsidian-200 rounded-2xl p-6 shadow-xl sticky top-32">
            <div className="flex justify-between items-end mb-6 pb-4 border-b border-obsidian-150">
              <div>
                <span className="font-serif text-2xl font-black text-gold-600">
                  ${property.price.toLocaleString()}
                </span>
                <span className="text-xs text-obsidian-500"> / night</span>
              </div>
              <div className="flex items-center gap-0.5 text-xs text-gold-600 font-semibold mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{property.rating}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleBookingSubmit)} noValidate className="space-y-4">
              {/* Full Name */}
              <FormField
                id="fullName"
                label="Full Name"
                placeholder="e.g. Sterling Archer"
                error={errors.fullName}
                registerProps={register('fullName')}
              />

              {/* Email Address */}
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="email@luxury.com"
                error={errors.email}
                registerProps={register('email')}
              />

              {/* Check-In / Check-Out */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <FormField
                  id="checkIn"
                  label="Check In"
                  type="date"
                  error={errors.checkIn}
                  registerProps={register('checkIn')}
                />
                <FormField
                  id="checkOut"
                  label="Check Out"
                  type="date"
                  error={errors.checkOut}
                  registerProps={register('checkOut')}
                />
              </div>

              {/* Guest Count */}
              <FormField
                id="guests"
                label="Guests count"
                fieldType="select"
                value={watchGuests}
                onChange={(e) => setValue('guests', parseInt(e.target.value))}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
                  value: String(num),
                  label: `${num} guest${num > 1 ? 's' : ''}`,
                }))}
              />

              {/* VIP Concierge Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gold-500/20 bg-gold-50/30 text-left mb-2">
                <div className="flex flex-col pr-3">
                  <span className="text-xs font-semibold text-gold-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VIP Concierge Staffing</span>
                  </span>
                  <span className="text-[9px] text-obsidian-550 text-obsidian-500 mt-0.5">
                    Private Chef & Chauffeur service (+$500)
                  </span>
                </div>
                <input
                  type="checkbox"
                  {...register('vipConcierge')}
                  className="w-4 h-4 rounded border-obsidian-300 accent-gold-600 bg-white cursor-pointer"
                />
              </div>

              {/* Price Calculation (Only shows if dates are selected) */}
              {nights > 0 && (
                <div className="pt-4 border-t border-obsidian-150 text-xs space-y-2 text-left">
                  <div className="flex justify-between text-obsidian-600">
                    <span>
                      ${nightlyBase.toLocaleString()} x {nights} night{nights > 1 ? 's' : ''}
                    </span>
                    <span>${baseTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-obsidian-600">
                    <span>Luxury Cleaning Service</span>
                    <span>${cleaningFee.toLocaleString()}</span>
                  </div>
                  {watchConcierge && (
                    <div className="flex justify-between text-obsidian-600">
                      <span>VIP Concierge Package</span>
                      <span>${conciergeFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-obsidian-600">
                    <span>VAT & Luxury Lodging Tax (8%)</span>
                    <span>${luxuryTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-serif text-sm font-bold text-gold-600 pt-2 border-t border-obsidian-150">
                    <span>Total Amount</span>
                    <span>${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4 py-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold text-white uppercase"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {nights > 0
                    ? `Reserve Estate • $${grandTotal.toLocaleString()}`
                    : 'Reserve Estate'}
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Recommended Properties */}
      {similarProperties.length > 0 && (
        <section className="py-20 border-t border-obsidian-200 mt-16 max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold text-obsidian-900 mb-8 text-left">
            Similar Luxury Estates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarProperties.map((prop) => (
              <Card
                key={prop.id}
                property={prop}
                onSelect={(p) => {
                  window.location.hash = `#/item/${p.id}`;
                  window.scrollTo(0, 0);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Full-Screen Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-obsidian-800/80 border border-obsidian-700 text-obsidian-300 hover:text-gold-400 hover:border-gold-400 transition-colors z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Carousel display */}
            <div className="relative w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-2xl border border-obsidian-700/40 shadow-2xl">
              <img
                src={property.images[activeImgIndex]}
                alt={`${property.title} large view`}
                className="w-full h-full object-cover"
              />

              {/* Arrows */}
              <button
                onClick={() =>
                  setActiveImgIndex(
                    (prev) => (prev - 1 + property.images.length) % property.images.length,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-obsidian-800/80 border border-obsidian-700 text-gold-500 hover:bg-gold-500 hover:text-obsidian-950 transition-colors shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImgIndex((prev) => (prev + 1) % property.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-obsidian-800/80 border border-obsidian-700 text-gold-500 hover:bg-gold-500 hover:text-obsidian-950 transition-colors shadow-lg cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 text-xs text-white bg-black/60 px-3 py-1.5 rounded-full">
                {activeImgIndex + 1} / {property.images.length} • {property.title}
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 mt-4 max-w-full overflow-x-auto p-1.5">
              {property.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImgIndex(index)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImgIndex === index
                      ? 'border-gold-500 scale-103 shadow-lg shadow-gold-500/10'
                      : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Booking Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Reservation Confirmed"
        size="md"
      >
        {lastBookingInfo && (
          <div className="text-center py-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mb-6 border border-gold-500/30"
            >
              <CheckCircle2 className="w-10 h-10 fill-gold-500/10" />
            </motion.div>

            <h3 className="font-serif text-xl font-bold text-obsidian-900 mb-2">
              Your Luxury Stay is Secured
            </h3>
            <p className="text-xs text-obsidian-600 mb-6 max-w-sm">
              We have dispatched your reservation itinerary to{' '}
              <span className="text-gold-600 font-semibold">{lastBookingInfo.email}</span>. A
              private concierge agent will contact you shortly.
            </p>

            <div className="w-full bg-obsidian-50 border border-obsidian-200 rounded-xl p-4 text-xs space-y-2 text-left mb-6">
              <div className="flex justify-between border-b border-obsidian-150 pb-2 mb-2">
                <span className="font-bold text-gold-600">Receipt Details</span>
                <span className="text-obsidian-500">
                  #LES-{Math.floor(Math.random() * 89999 + 10000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-obsidian-550 text-obsidian-500">Estate:</span>
                <span className="font-semibold text-obsidian-900">{lastBookingInfo.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-obsidian-550 text-obsidian-500">Location:</span>
                <span className="text-obsidian-750">{lastBookingInfo.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-obsidian-550 text-obsidian-500">Duration:</span>
                <span className="text-obsidian-750">
                  {lastBookingInfo.nights} night{lastBookingInfo.nights !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-obsidian-550 text-obsidian-500">Guests:</span>
                <span className="text-obsidian-750">
                  {lastBookingInfo.guests} guest{lastBookingInfo.guests !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-obsidian-150 font-bold text-gold-600">
                <span>Amount Paid:</span>
                <span>${lastBookingInfo.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setSuccessModalOpen(false);
                window.location.hash = '#/search';
              }}
              variant="primary"
              className="px-8 font-bold text-xs"
            >
              Discover More Estates
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ItemDetail;
