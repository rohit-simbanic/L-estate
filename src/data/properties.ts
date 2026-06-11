export interface Property {
  id: string;
  title: string;
  type: 'Villa' | 'Penthouse' | 'Chalet' | 'Mansion' | 'Estate';
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates: [number, number]; // [lat, lng]
  images: string[];
  description: string;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  host: {
    name: string;
    image: string;
    rating: number;
  };
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: "Villa L'Horizon",
    type: 'Villa',
    location: 'Amalfi Coast, Italy',
    price: 2450,
    bedrooms: 5,
    bathrooms: 6,
    area: 5800,
    coordinates: [40.6281, 14.485],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      "Perched majestically on the cliffs of Positano, Villa L'Horizon offers unparalleled panoramic views of the azure Mediterranean. Experience pure Italian luxury with a private infinity pool carved into the rock, expansive travertine terraces, and exquisite hand-painted fresco ceilings. Fully staffed with a private chef and butler.",
    rating: 4.95,
    reviewsCount: 48,
    amenities: ['Private Pool', 'Ocean View', 'Butler Service', 'Spa', 'Gym'],
    host: {
      name: 'Alessandro Rossi',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 4.98,
    },
  },
  {
    id: 'prop-2',
    title: 'Chalet Sommet',
    type: 'Chalet',
    location: 'Aspen, Colorado',
    price: 3200,
    bedrooms: 6,
    bathrooms: 7,
    area: 7200,
    coordinates: [39.1911, -106.8175],
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'This ultra-exclusive ski-in/ski-out estate represents the pinnacle of Alpine living. Featuring rustic timber accents paired with sleek modern glass walls, Chalet Sommet provides a stunning mountain backdrop from every room. Indulge in the private indoor swimming pool, outdoor hot tub, and state-of-the-art cinema room.',
    rating: 4.88,
    reviewsCount: 32,
    amenities: ['Ski-in/Ski-out', 'Private Pool', 'Spa', 'Gym', 'Helipad'],
    host: {
      name: 'Sarah Jenkins',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 4.92,
    },
  },
  {
    id: 'prop-3',
    title: 'Penthouse Onyx',
    type: 'Penthouse',
    location: 'New York City, New York',
    price: 1850,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 3400,
    coordinates: [40.7589, -73.9851],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Perched atop Manhattan’s premier residential skyscraper, Penthouse Onyx delivers breathtaking 360-degree views of Central Park and the city skyline. Designed by legendary architects, it features dark Italian marble, customized smart home integration, and a private wraparound outdoor terrace with a heated plunge pool.',
    rating: 4.97,
    reviewsCount: 65,
    amenities: ['Gym', 'Private Pool', 'Butler Service', 'Ocean View'], // Central Park is our "ocean view" equivalent, labeled for simplicity
    host: {
      name: 'Robert Vance',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 4.95,
    },
  },
  {
    id: 'prop-4',
    title: 'Ocean Sanctuary',
    type: 'Estate',
    location: 'Maldives',
    price: 4500,
    bedrooms: 4,
    bathrooms: 5,
    area: 6500,
    coordinates: [3.2028, 73.2207],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Suspend reality in this massive overwater island villa. Accessible only by private yacht or seaplane, the Ocean Sanctuary features glass floor viewing portals, a 15-meter private infinity pool extending over the lagoon, an outdoor sunken lounge, and direct waterside waterslide access. Concierge service is on-call 24/7.',
    rating: 4.99,
    reviewsCount: 19,
    amenities: ['Private Pool', 'Ocean View', 'Butler Service', 'Spa', 'Helipad'],
    host: {
      name: 'Maldivian Hospitality Group',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 5.0,
    },
  },
  {
    id: 'prop-5',
    title: 'Chateau de Lumiere',
    type: 'Mansion',
    location: 'French Riviera, France',
    price: 3800,
    bedrooms: 8,
    bathrooms: 9,
    area: 9500,
    coordinates: [43.7102, 7.262],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'An architectural masterpiece combining classic French styling with modern design. Reclining on the hills of Saint-Jean-Cap-Ferrat, Chateau de Lumiere boasts immaculate manicured gardens, a private vineyard, a heated saltwater pool, wine cellar, and spectacular views of the yacht-dotted Mediterranean bays.',
    rating: 4.91,
    reviewsCount: 27,
    amenities: ['Private Pool', 'Ocean View', 'Butler Service', 'Spa', 'Gym'],
    host: {
      name: 'Count Jean-Pierre',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 4.89,
    },
  },
  {
    id: 'prop-6',
    title: 'Estate El Dorado',
    type: 'Estate',
    location: 'Beverly Hills, California',
    price: 5000,
    bedrooms: 7,
    bathrooms: 9.5,
    area: 12000,
    coordinates: [34.0736, -118.4004],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Located in the most prestigious gated community of Beverly Hills, Estate El Dorado is a compound built for high-security and entertainment. It offers a championship tennis court, a 20-seat private theater, a detached professional wellness center, full smart-home fortification, and infinity edge pool overlooking Los Angeles.',
    rating: 4.96,
    reviewsCount: 14,
    amenities: ['Private Pool', 'Gym', 'Spa', 'Butler Service', 'Helipad'],
    host: {
      name: 'Luxe Properties Beverly Hills',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 4.99,
    },
  },
  {
    id: 'prop-7',
    title: 'Villa Serena',
    type: 'Villa',
    location: 'Ibiza, Spain',
    price: 1900,
    bedrooms: 4,
    bathrooms: 4,
    area: 4500,
    coordinates: [38.9089, 1.4324],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Unwind in a luxurious villa offering serene seclusion on Ibiza’s quiet north shore. Perfect for retreats, Villa Serena includes an outdoor yoga pavilion, open-concept living spaces flowing into sunset terraces, a saltwater lap pool, and a fully equipped chef kitchen. Access to a private secluded cove is a short walk away.',
    rating: 4.85,
    reviewsCount: 39,
    amenities: ['Private Pool', 'Ocean View', 'Spa', 'Gym'],
    host: {
      name: 'Elena Silva',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 4.9,
    },
  },
  {
    id: 'prop-8',
    title: 'Sky Oasis Penthouse',
    type: 'Penthouse',
    location: 'Dubai, UAE',
    price: 2800,
    bedrooms: 4,
    bathrooms: 5,
    area: 5200,
    coordinates: [25.2048, 55.2708],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    description:
      'Experience towering luxury in this sky mansion penthouse in downtown Dubai. Overlooking the Burj Khalifa, Sky Oasis features double-height floor-to-ceiling glass, a private glass-bottomed pool suspended over the skyline edge, a cigar lounge, and access to premium 5-star hotel services (concierge, spa, private valet).',
    rating: 4.93,
    reviewsCount: 22,
    amenities: ['Private Pool', 'Gym', 'Spa', 'Butler Service', 'Helipad'],
    host: {
      name: 'Dubai Luxury Concierge',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      rating: 4.97,
    },
  },
];
