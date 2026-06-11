import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Property } from '../../data/properties';
import { useStore } from '../../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Star } from 'lucide-react';

interface MapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  onPopupClick?: (property: Property) => void;
}

// Sub-component to handle map viewport changes dynamically
const ChangeView: React.FC<{ center: [number, number]; zoom: number; properties: Property[] }> = ({
  center,
  zoom,
  properties,
}) => {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 1) {
      // Pan to the single selected property
      map.flyTo(properties[0].coordinates, 13, { duration: 1.5 });
    } else if (properties.length > 1) {
      // Fit bounds to cover all visible properties
      const bounds = L.latLngBounds(properties.map((p) => p.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true, duration: 1.2 });
    } else {
      // Default fallback
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, properties, map]);

  return null;
};

export const Map: React.FC<MapProps> = ({
  properties,
  center = [40.6281, 14.485], // Default center
  zoom = 3,
  interactive = true,
  onPopupClick,
}) => {
  const { activePropertyId, setActivePropertyId, hoveredPropertyId } = useStore(
    useShallow((state) => ({
      activePropertyId: state.activePropertyId,
      setActivePropertyId: state.setActivePropertyId,
      hoveredPropertyId: state.hoveredPropertyId,
    })),
  );

  // Create custom marker icons with price labels (luxury modern booking UI)
  const createPriceMarker = (property: Property) => {
    const isSelected = activePropertyId === property.id || hoveredPropertyId === property.id;
    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          ${
            isSelected
              ? `
            <div class="absolute w-14 h-14 rounded-full bg-gold-500/25 animate-ping opacity-80" style="animation-duration: 2s"></div>
          `
              : ''
          }
          <div class="relative px-2.5 py-1.5 rounded-lg bg-white border transition-all duration-300 shadow-xl ${
            isSelected
              ? 'border-gold-600 text-gold-600 font-bold scale-110 shadow-gold-500/10'
              : 'border-obsidian-200 text-obsidian-900 hover:border-obsidian-450'
          } text-xs font-semibold font-sans tracking-wide">
            ${property.price === 0 ? 'HQ' : `$${property.price >= 1000 ? `${(property.price / 1000).toFixed(1)}k` : property.price}`}
          </div>
        </div>
      `,
      className: 'custom-price-marker',
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl border border-obsidian-200 bg-obsidian-50">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        zoomControl={false}
        className="w-full h-full"
      >
        {/* CartoDB Voyager map tiles (beautiful light mode tiles) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic map viewport controller */}
        <ChangeView center={center} zoom={zoom} properties={properties} />

        {/* Properties pins */}
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={property.coordinates}
            icon={createPriceMarker(property)}
            eventHandlers={{
              click: () => {
                setActivePropertyId(property.id);
              },
            }}
          >
            <Popup closeButton={false} minWidth={220} maxWidth={220}>
              <div
                className="p-0 select-none cursor-pointer overflow-hidden flex flex-col"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePropertyId(property.id);
                  if (onPopupClick) {
                    onPopupClick(property);
                  }
                }}
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-28 object-cover"
                />
                <div className="p-3 bg-white text-obsidian-900">
                  <div className="flex justify-between items-center mb-1 text-[10px] uppercase font-semibold text-gold-600 tracking-wider">
                    <span>{property.type}</span>
                    <div className="flex items-center gap-0.5 text-gold-600">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{property.rating.toFixed(2)}</span>
                    </div>
                  </div>
                  <h4 className="font-serif text-sm font-bold truncate text-obsidian-900 mb-1">
                    {property.title}
                  </h4>
                  <p className="text-xs text-obsidian-500 mb-2 truncate">{property.location}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-obsidian-200">
                    <span className="font-serif text-sm font-bold text-gold-600">
                      {property.price === 0 ? (
                        'Global Headquarters'
                      ) : (
                        <>
                          ${property.price.toLocaleString()}{' '}
                          <span className="text-[10px] text-obsidian-500 font-sans font-normal">
                            / night
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
