# L'ESTATE Frontend Codebase Ownership Q&A

This document contains 60 detailed questions and answers regarding the frontend architecture, system design, state management, UI component structure, third-party integrations, testing setup, and workflows of the L'ESTATE luxury vacation rental application. It is prepared as a verification tool to testify project ownership.

---

### Table of Contents

1. [Application Architecture & Routing (Q1–Q10)](#1-application-architecture--routing-q1q10)
2. [State Management & Zustand Store (Q11–Q20)](#2-state-management--zustand-store-q11q20)
3. [Component Design & Reusability (Q21–Q30)](#3-component-design--reusability-q21q30)
4. [Third-Party Integrations & Map rendering (Q31–Q40)](#4-third-party-integrations--map-rendering-q31q40)
5. [Data, Services, & Validation (Q41–Q50)](#5-data-services--validation-q41q50)
6. [Workflows, Tooling, & Testing (Q51–Q60)](#6-workflows-tooling--testing-q51q60)

---

## 1. Application Architecture & Routing (Q1–Q10)

### Q1: What routing paradigm is implemented in this application, and how does it avoid external peer dependencies?

**Answer:**  
The application uses a custom **hash-based routing system** controlled through client-side state hooks instead of standard routing packages. This keeps the application light and guarantees compatibility without router-specific version conflicts.  
As seen in [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L112-L159), a `useEffect` hook registers a listener on the window's `hashchange` event. It parses the URL hash to dynamically update the `currentPage` and `selectedPropertyId` state variables:

```typescript
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash;
    setMobileMenuOpen(false); // Close menu on navigation
    window.scrollTo(0, 0); // Scroll to top on navigation

    if (hash.startsWith('#/item/')) {
      const id = hash.replace('#/item/', '');
      setCurrentPage('detail');
      setSelectedPropertyId(id);
    } else if (hash === '#/search') {
      setCurrentPage('search');
      setSelectedPropertyId(null);
    } else if (hash === '#/about') {
      setCurrentPage('about');
      // ...
    } else {
      setCurrentPage('home');
      setSelectedPropertyId(null);
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // Run on mount
  return () => window.removeEventListener('hashchange', handleHashChange);
}, []);
```

---

### Q2: How does the application implement lazy loading to optimize initial page loading times, and what component serves as the loading boundary?

**Answer:**  
To prevent loading all pages in the initial bundle, page-level imports are declared using React's `lazy` wrapper in [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L63-L71). They are wrapped inside React `Suspense` inside the main page renderer:

```typescript
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const ItemDetail = lazy(() => import('./pages/ItemDetail'));
// ...

<Suspense fallback={<PageSkeleton />}>
  {renderActivePage()}
</Suspense>
```

The loading boundary utilizes the custom `PageSkeleton` component defined in [Skeleton.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Skeleton.tsx#L37-L70), which displays shimmering placeholder items to preserve layout structure during lazy chunk downloads.

---

### Q3: What boundary is in place to catch runtime UI errors, and how does a user recover from it?

**Answer:**  
The application mounts a custom `ErrorBoundary` component in the main view wrapper within [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L342-L344) to catch uncaught runtime JavaScript exceptions in children components.  
Defined as a React class component in [ErrorBoundary.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/ErrorBoundary.tsx), it intercepts exceptions via `getDerivedStateFromError` and logs them using `componentDidCatch`. When an error is caught, it displays a "Concierge View Interrupted" card with a recovery button that triggers `handleReset`:

```typescript
private handleReset = () => {
  this.setState({ hasError: false, error: null });
  window.location.hash = '#/';
  window.location.reload();
};
```

---

### Q4: How is responsive layout adjustments achieved on the application footer between pages, and where is this configured?

**Answer:**  
In [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L351), the `footer` element features dynamic styling rules depending on the current active view. On the properties search layout, the footer should not cover interactive components or maps on tablet/mobile screens. Therefore, it applies conditional tailwind visibility classes:

```typescript
<footer
  className={`w-full bg-obsidian-950 border-t border-obsidian-800/60 py-16 text-left text-xs text-obsidian-400 ${
    currentPage === 'search' ? 'hidden lg:block' : 'block'
  }`}
>
```

This forces the footer to remain hidden on search view layouts on medium or small screens, but renders normally on larger viewports.

---

### Q5: How is navigation state visual feedback handled on the desktop header navigation bar?

**Answer:**  
The navigation links map over a predefined `navLinks` list. Active navigation links render a gold marker bar underneath their label using a Framer Motion shared layout transition.  
As seen in [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L213-L240), when the page matches, it renders a custom `motion.span` with `layoutId="activeNavLine"`:

```typescript
{isActive && (
  <motion.span
    layoutId="activeNavLine"
    className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-600 rounded-full"
    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
  />
)}
```

This enables the marker bar to animate smoothly from link to link across the header when the user navigates between pages.

---

### Q6: Describe how the sticky header is configured to handle mobile screen responsiveness.

**Answer:**  
The header includes a responsive drawer menu triggered by a hamburger button toggled with a `mobileMenuOpen` boolean hook in [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L73-L93).  
When `mobileMenuOpen` is true, an animated menu is rendered below the main navigation bar. It is wrapped in Framer Motion's `AnimatePresence` to enable exit animations when the menu is collapsed. It displays links along with the current wishlist size:

```typescript
<AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden w-full bg-white border-b border-obsidian-200 absolute top-[72px] left-0 z-[2000] overflow-hidden shadow-2xl"
    >
      {/* ... */}
    </motion.div>
  )}
</AnimatePresence>
```

---

### Q7: How does the hash routing system handle non-existent URLs, and where is the fallback logic located?

**Answer:**  
Inside the hash router's listener setup in [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L112-L159), URL hashes are processed in an `if/else-if` chain. The final default block serves as a fallback. Any invalid route format automatically falls back to rendering the home view:

```typescript
} else {
  setCurrentPage('home');
  setSelectedPropertyId(null);
}
```

This safeguards the application against crashes when visitors enter malformed navigation fragments.

---

### Q8: What mechanism prevents layout shift inside the main page content layout when navigation triggers page transitions?

**Answer:**  
In [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L333-L346), the main container renders page components wrapped in `AnimatePresence` with `mode="wait"`. This tells Framer Motion to finish the exit transition of the unmounting page before starting the entry transition of the new page:

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={currentPage + (selectedPropertyId || '')}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.35 }}
    className="w-full flex-grow flex flex-col"
  >
    {/* Page Component */}
  </motion.div>
</AnimatePresence>
```

The unique combination of the `key` parameter (combining `currentPage` and `selectedPropertyId`) ensures that changing page state triggers the animated layout transition.

---

### Q9: Where are the custom SVG icons declared for the social media items, and why?

**Answer:**  
Brand icons such as Facebook, Instagram, and Twitter are declared as local inline SVG functional React components in [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L9-L60).  
This isolates them from Lucide icon exports (which sometimes deprecate brand-specific icons), decreases compile-time complexity, and ensures vector icons match the exact paths and styling properties of the other SVG indicators.

---

### Q10: How are page titles and viewport description tags managed on separate pages for search engine optimization (SEO)?

**Answer:**  
SEO values are managed dynamically using the custom React hook `useDocumentTitle` declared in [useDocumentTitle.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/hooks/useDocumentTitle.ts).  
This hook takes in a page title and description parameter and manages them in a side effect. It selects or creates a standard HTML meta tag to append inside the document `<head>`:

```typescript
export const useDocumentTitle = (title: string, description?: string) => {
  useEffect(() => {
    document.title = `${title} | L'ESTATE`;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
};
```

---

## 2. State Management & Zustand Store (Q11–Q20)

### Q11: What store implementation controls global state, and where is it located?

**Answer:**  
The application uses **Zustand** for state management, configured in [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts). The store manages filter configurations, favorites arrays, list items, and active selections within a single unified store hook called `useStore`.

---

### Q12: How are filter types defined inside the store schema?

**Answer:**  
The store parameters are defined using TypeScript types. The filters are declared inside the `FilterState` interface in [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts#L4-L15):

```typescript
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
```

---

### Q13: Explain how properties are filtered reactively in the store logic.

**Answer:**  
Reactive search is performed inside the computed getter function `getFilteredProperties` in [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts#L138-L193). It aggregates the full listing array and filters it through matching conditions before returning results:

```typescript
getFilteredProperties: () => {
  const { properties, filters } = get();
  let result = [...properties];

  if (filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q),
    );
  }
  if (filters.location !== 'All') {
    const loc = filters.location.toLowerCase();
    result = result.filter((p) => p.location.toLowerCase().includes(loc));
  }
  if (filters.propertyType !== 'All') {
    result = result.filter((p) => p.type === filters.propertyType);
  }
  // Price, Bedrooms, Bathrooms, and Amenities filters...
  return result;
};
```

---

### Q14: How is state persistence handled for client wishlist favorites in Zustand?

**Answer:**  
In [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts#L77-L84), `favorites` initializes by fetching records from `localStorage`:

```typescript
favorites: (() => {
  try {
    const saved = localStorage.getItem('lestate_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
})(),
```

When `toggleFavorite` runs, it updates the store array and updates `localStorage` in a `try/catch` block to handle exceptions, such as private browsing restrictions.

---

### Q15: How does the store prevent layout re-renders when components listen to state?

**Answer:**  
Components do not request the entire state object directly. Instead, they select required parameters using Zustand selectors combined with the `useShallow` hook.  
For example, the custom hook [useFavorites.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/hooks/useFavorites.ts) uses:

```typescript
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';

export const useFavorites = () => {
  const { favorites, toggleFavorite } = useStore(
    useShallow((state) => ({
      favorites: state.favorites,
      toggleFavorite: state.toggleFavorite,
    })),
  );
  // ...
```

This prevents the component from re-rendering unless the selected properties (`favorites` or `toggleFavorite`) change.

---

### Q16: How is the listing data structured when creating reservations, and how are unique IDs generated?

**Answer:**  
Reservations are represented by the `Booking` interface, and added via the `addBooking` action in [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts#L17-L27).  
The action creates a unique ID using `Date.now()` and saves a timestamp:

```typescript
addBooking: (bookingData) =>
  set((state) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return { bookings: [...state.bookings, newBooking] };
  }),
```

---

### Q17: What configuration variable represents default starting filters?

**Answer:**  
Default state constants are encapsulated inside `initialFilters` inside [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts#L59-L70):

```typescript
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
```

This constant is also used by the `resetFilters` reducer action to restore state defaults.

---

### Q18: How does the toggle action for luxury amenities handle both additions and removals?

**Answer:**  
In [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts#L96-L103), the `toggleAmenity` action inspects the current active array to determine whether the amenity should be filtered out or appended:

```typescript
toggleAmenity: (amenity) =>
  set((state) => {
    const active = state.filters.amenities;
    const nextAmenities = active.includes(amenity)
      ? active.filter((a) => a !== amenity)
      : [...active, amenity];
    return { filters: { ...state.filters, amenities: nextAmenities } };
  }),
```

---

### Q19: Which custom hook exposes all property filtering actions to simplify component imports?

**Answer:**  
The application uses the `usePropertyFilters` custom hook declared in [usePropertyFilters.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/hooks/usePropertyFilters.ts). This hook aggregates all filter variables and setters from the Zustand store:

```typescript
export const usePropertyFilters = () => {
  const {
    filters,
    getFilteredProperties,
    setSearchQuery,
    setLocation,
    // ...
  } = useStore(useShallow((state) => ({ ... })));

  const filteredProperties = getFilteredProperties();
  return { filters, filteredProperties, ... };
};
```

---

### Q20: How are active properties tracked on mouse hover events?

**Answer:**  
Hover states are managed globally in the store using two indicators defined in [useStore.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/store/useStore.ts#L29-L35):

- `activePropertyId: string | null`
- `hoveredPropertyId: string | null`

These states are updated using the `setActivePropertyId` and `setHoveredPropertyId` actions, allowing the map and property cards to synchronize hover highlights.

---

## 3. Component Design & Reusability (Q21–Q30)

### Q21: How is the custom `Button` component designed for flexible styling and animations?

**Answer:**  
The `Button` component in [Button.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Button.tsx) is declared using `React.forwardRef`. This allows it to forward DOM refs to internal button elements. It uses `twMerge` and `clsx` to merge base classes with variants (`primary`, `secondary`, `ghost`, etc.) and sizes (`sm`, `md`, `lg`):

```typescript
const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 ...';
const classes = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));
```

It animates layout clicks and hover states using Framer Motion wrappers (`whileHover`, `whileTap`).

---

### Q22: How does the `Button` component prevent user interactions during loading states?

**Answer:**  
In [Button.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Button.tsx#L75-L81), if the `disabled`, `isLoading`, or `animate={false}` props are passed, the component skips the animated `motion.button` wrapper and renders a standard HTML button instead. This preserves click blockers and layout attributes:

```typescript
if (!animate || disabled || isLoading) {
  return (
    <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
}
```

---

### Q23: Describe the visual carousel feature implemented inside the property `Card` component.

**Answer:**  
Each card component, defined in [Card.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Card.tsx), handles carousel navigations locally using the `currentImgIndex` state hook. Left and right navigation chevron buttons trigger index state updates wrapped around the length of the property images array:

```typescript
const handleNextImage = (e: React.MouseEvent) => {
  e.stopPropagation();
  setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
};
```

The image element is nested in Framer Motion's `AnimatePresence` to enable fade transitions when the index changes.

---

### Q24: How does clicking the property card prevent event bubbling to trigger page details changes?

**Answer:**  
As seen in [Card.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Card.tsx#L22-L35), event click handlers (like the chevron carousel arrows or the wishlist heart icon) invoke `e.stopPropagation()`:

```typescript
const handleFavoriteClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  toggleFavorite(property.id);
};
```

This isolates click events on individual layout buttons and prevents them from bubbling up to trigger the card's parent `onClick` callback, which handles detail route redirection.

---

### Q25: How is form input rendering abstracted, and how does it display validation errors?

**Answer:**  
Input rendering is abstracted in [FormField.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/FormField.tsx). The component uses a switch conditional to choose between rendering an `input`, `textarea`, or `select` element depending on the `fieldType` prop.  
Validation error messages are rendered dynamically using `AnimatePresence` and Framer Motion wrappers for smooth entrance transitions:

```typescript
<AnimatePresence>
  {error?.message && (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      className="overflow-hidden"
    >
      <p className="text-[10px] text-red-650 font-semibold ...">
        {error.message}
      </p>
    </motion.div>
  )}
</AnimatePresence>
```

---

### Q26: Explain the design choices behind the custom `Modal` component's accessibility features.

**Answer:**  
The `Modal` component in [Modal.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Modal.tsx) implements accessibility behaviors via a lifecycle `useEffect` hook. When the modal opens, it suspends body document scrolling and binds a keyboard event listener for the `'Escape'` key to close the modal:

```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (isOpen) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
  } else {
    document.body.style.overflow = 'unset';
  }

  return () => {
    document.body.style.overflow = 'unset';
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [isOpen, onClose]);
```

---

### Q27: How are skeleton layouts defined to prevent cumulative layout shift (CLS)?

**Answer:**  
In [Skeleton.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Skeleton.tsx), the application exports two key skeletons:

1. `CardSkeleton`: Mimics a property card's exact grid height and aspect ratio.
2. `PageSkeleton`: Renders mock headers and details.

These skeleton layouts use a custom tailwind animation `animate-pulse` and fixed dimensions (`w-full aspect-[4/3]`) to reserve page space while real resources download, preventing layout shifts.

---

### Q28: How does the `Modal` backdrop handle tap-to-close events?

**Answer:**  
As configured in [Modal.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Modal.tsx#L66-L72), a fixed backdrop overlay elements sits under the dialog body:

```typescript
{/* Backdrop */}
<motion.div
  className="fixed inset-0 bg-obsidian-950/40 backdrop-blur-xs"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={onClose}
/>
```

Attaching the `onClose` callback to the backdrop's `onClick` allows users to close the modal by clicking anywhere outside of the modal dialog box.

---

### Q29: Where are the CSS classes declared for custom scrollbars?

**Answer:**  
Custom scrollbar style variables are defined in [index.css](file:///c:/Users/rohit/Downloads/real-estate-1/src/index.css#L54-L67) under the utility class `.custom-scrollbar`:

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-obsidian-200);
  border-radius: 9999px;
}
```

This styles scrollable surfaces on select components, lists, and dropdown panels to match the overall design system.

---

### Q30: How does the sticky header maintain accessibility controls?

**Answer:**  
The sticky header uses a high z-index layout value (`z-[2010]`) in [App.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/App.tsx#L201) to stay above other elements. It uses `backdrop-blur-md` and `bg-white/95` to remain legible against scrolling page content:

```typescript
<header className="sticky top-0 z-[2010] w-full h-[72px] bg-white/95 border-b border-obsidian-200/60 backdrop-blur-md transition-all">
```

---

## 4. Third-Party Integrations & Map rendering (Q31–Q40)

### Q31: What mapping integration is implemented in the application search page, and what library powers it?

**Answer:**  
The search map is built using **Leaflet** and **React-Leaflet**, imported and configured inside [Map.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/features/search/Map.tsx).  
It loads MapContainer, TileLayer, Marker, and Popup controls using map coordinates to render interactive properties.

---

### Q32: How is map tile layers configured to represent the light luxury branding theme?

**Answer:**  
In [Map.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/features/search/Map.tsx#L103-L107), the map renders light-themed, minimalist tiles sourced from CartoDB instead of default OpenStreetMap layers:

```typescript
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
/>
```

This ensures map details align with the light luxury aesthetic of the application.

---

### Q33: How does the application sync the map's viewport with properties search results?

**Answer:**  
In [Map.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/features/search/Map.tsx#L18-L49), a sub-component named `ChangeView` hooks into the map's viewport using React-Leaflet's `useMap` hook. It adjusts bounds dynamically inside a `useEffect` based on the number of active properties:

```typescript
const ChangeView: React.FC<{ center: [number, number]; zoom: number; properties: Property[] }> = ({
  center,
  zoom,
  properties,
}) => {
  const map = useMap();

  useEffect(() => {
    try {
      const size = map.getSize();
      if (size.x === 0 || size.y === 0) return;

      if (properties.length === 1) {
        map.flyTo(properties[0].coordinates, 13, { duration: 1.5 });
      } else if (properties.length > 1) {
        const bounds = L.latLngBounds(properties.map((p) => p.coordinates));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true, duration: 1.2 });
      } else {
        map.flyTo(center, zoom, { duration: 1.5 });
      }
    } catch {}
  }, [center, zoom, properties, map]);

  return null;
};
```

---

### Q34: How are property price tags rendered directly on the map as pins?

**Answer:**  
In [Map.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/features/search/Map.tsx#L67-L92), properties use Leaflet's `L.divIcon` instead of standard image markers. This allows the application to render dynamic HTML containing custom text, classes, and active styling:

```typescript
const createPriceMarker = (property: Property) => {
  const isSelected = activePropertyId === property.id || hoveredPropertyId === property.id;
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center cursor-pointer">
        ${isSelected ? `<div class="absolute w-14 h-14 rounded-full bg-gold-500/25 animate-ping opacity-80" ...></div>` : ''}
        <div class="relative px-2.5 py-1.5 rounded-lg bg-white border ...">
          ${property.price === 0 ? 'HQ' : `$${property.price >= 1000 ? `${(property.price / 1000).toFixed(1)}k` : property.price}`}
        </div>
      </div>
    `,
    className: 'custom-price-marker',
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};
```

---

### Q35: How does the application handle Leaflet container size mismatch errors on unmounted components?

**Answer:**  
To prevent script crashes when maps load in hidden container divs, the map effect includes checks within [Map.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/features/search/Map.tsx#L25-L30):

```typescript
const size = map.getSize();
if (size.x === 0 || size.y === 0) {
  return; // Skip sizing updates if map element is hidden
}
```

This check prevents Leaflet from performing viewport math on containers that do not have layout dimensions.

---

### Q36: Describe the interaction when a user clicks on a map marker popup.

**Answer:**  
As seen in [Map.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/features/search/Map.tsx#L124-L168) and [Search.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/Search.tsx#L59-L67), clicking on a map popup triggers the `onPopupClick` callback. On mobile devices, this transitions the view mode from `'map'` to `'list'`, selects the active property, and scrolls the corresponding listing card into view:

```typescript
const handlePopupClick = (property: Property) => {
  setMobileViewMode('list');
  setTimeout(() => {
    const element = document.getElementById(`property-card-${property.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};
```

---

### Q37: How is Framer Motion loaded on the details page lightbox image explorer?

**Answer:**  
In [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L561-L621), the photo lightbox uses Framer Motion's `<AnimatePresence>` to animate image scaling and backdrop opacity. The transition rules provide a smooth fade and zoom overlay:

```typescript
<AnimatePresence>
  {lightboxOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 ..."
    >
      {/* ... */}
    </motion.div>
  )}
</AnimatePresence>
```

---

### Q38: How does the search layout toggle between list and map views on mobile screen widths?

**Answer:**  
The responsive grid layout in [Search.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/Search.tsx#L215-L233) renders a floating action toggle button on small viewports. It checks `mobileViewMode` to toggle the visibility of the list and map containers:

```typescript
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1010] lg:hidden">
  <button onClick={() => setMobileViewMode((prev) => (prev === 'list' ? 'map' : 'list'))}>
    {mobileViewMode === 'list' ? 'Show Map' : 'Show List'}
  </button>
</div>
```

Tailwind responsive classes (`hidden lg:block` / `w-full lg:w-[60%]`) display or hide sections based on viewport width.

---

### Q39: What configuration enables Leaflet components to render properly under Jest unit tests?

**Answer:**  
Leaflet requires a real window DOM layout to initialize. Because Jest runs inside JSDOM, components using maps are mocked to prevent test suite errors.  
In [setupTests.ts](file:///c:/Users/rohit/Downloads/real-estate-1/tests/unit/setupTests.ts), mocks are created for DOM browser controls that are not supported by default in JSDOM:

- `IntersectionObserver`
- `ResizeObserver`
- `matchMedia`
- `scrollTo`

---

### Q40: How does the application prevent duplicate Leaflet map rendering containers?

**Answer:**  
Leaflet binds to a specific DOM node. To prevent duplicate instance bindings during development hot-reloads, the Leaflet map setup uses a single `<MapContainer>` component in [Map.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/features/search/Map.tsx#L96-L102) with a unique key. This allows React to coordinate updates instead of unmounting and rebuilding Leaflet instances.

---

## 5. Data, Services, & Validation (Q41–Q50)

### Q41: How are mock API calls structured to simulate real backend network latency?

**Answer:**  
Mock network calls are defined in [api.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/services/api.ts). Functions return standard JavaScript `Promise` wrappers configured with `setTimeout` delays:

```typescript
export const api = {
  getProperties: (): Promise<Property[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PROPERTIES);
      }, 350); // 350ms delay
    });
  },
  getPropertyById: (id: string): Promise<Property | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_PROPERTIES.find((p) => p.id === id);
        resolve(found);
      }, 250); // 250ms delay
    });
  },
};
```

---

### Q42: What mechanism prevents layout thrashing when search page filters update?

**Answer:**  
In [Search.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/Search.tsx#L32-L44), rapid changes to search inputs or filter parameters are processed using a `useEffect` hook wrapped in a debounced animation loop. It uses `requestAnimationFrame` combined with a timeout cleanup to process search computations efficiently:

```typescript
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
```

---

### Q43: How is form validation defined for reservation inputs, and what validation library is used?

**Answer:**  
The reservation form uses **Zod** for schema declaration and validation. The schema is configured in [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L35-L46):

```typescript
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
```

---

### Q44: How is Zod validation integrated with React Hook Form?

**Answer:**  
The Zod validation schema is integrated with React Hook Form using the `@hookform/resolvers/zod` library. The form is initialized in [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L81-L98):

```typescript
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
```

---

### Q45: Explain the custom date logic used to calculate pricing on the Booking Widget.

**Answer:**  
Booking duration is calculated by checking the difference in milliseconds between the parsed check-in and check-out dates, then dividing the result by the number of milliseconds in a single day.  
As seen in [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L141-L155):

```typescript
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
```

---

### Q46: What data attributes are required to define a property listing within the application model?

**Answer:**  
Property data shapes are enforced through the `Property` interface declared in [properties.ts](file:///c:/Users/rohit/Downloads/real-estate-1/src/data/properties.ts#L1-L21):

```typescript
export interface Property {
  id: string;
  title: string;
  type: 'Villa' | 'Penthouse' | 'Chalet' | 'Mansion' | 'Estate';
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  coordinates: [number, number];
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
```

---

### Q47: How does the reservation checkout form fetch active user filter values as starting values?

**Answer:**  
When the reservation form initializes inside [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L68-L98), it reads check-in and check-out values directly from the search filters in the Zustand store. This provides a smoother checkout experience if the user has already specified dates:

```typescript
defaultValues: {
  // ...
  checkIn: filters.checkIn || '',
  checkOut: filters.checkOut || '',
}
```

---

### Q48: What mechanism prevents memory leaks and updates to state on unmounted async calls?

**Answer:**  
As seen in [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L103-L115) and [Home.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/Home.tsx#L29-L40), page components use a local boolean flag `active` in `useEffect` hooks. This flag is set to `false` when the component unmounts, preventing state updates if asynchronous API requests complete after the page is no longer active:

```typescript
useEffect(() => {
  let active = true;
  api.getProperties().then((data) => {
    if (active) {
      setProperties(data);
      setLoading(false);
    }
  });
  return () => {
    active = false;
  };
}, []);
```

---

### Q49: How is the confirmation receipt data structure defined, and how are IDs formatted?

**Answer:**  
Confirmation details are tracked in the component's `lastBookingInfo` state using the `LastBooking` interface defined in [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L54-L65). Receipt IDs are generated dynamically in the UI component template:

```typescript
#LES-{Math.floor(Math.random() * 89999 + 10000)}
```

This generates a mock reservation ID matching the format: `#LES-47291`.

---

### Q50: How does similar property listing logic fetch matching records?

**Answer:**  
Similar property recommendations are generated dynamically on the details page. In [ItemDetail.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/ItemDetail.tsx#L185-L193), the component filters the global listing array to find properties that match the current property's category type or price range, excluding the active property:

```typescript
const similarProperties = property
  ? properties
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.type === property.type || Math.abs(p.price - property.price) < 1000),
      )
      .slice(0, 3)
  : [];
```

---

## 6. Workflows, Tooling, & Testing (Q51–Q60)

### Q51: Which test library handles unit testing in this application, and what configurations define its setup?

**Answer:**  
Unit tests use **Jest** and **React Testing Library**. The configuration is defined in [jest.config.cjs](file:///c:/Users/rohit/Downloads/real-estate-1/jest.config.cjs), using `jest-environment-jsdom` to mock browser environments:

```javascript
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  // ...
};
```

---

### Q52: Explain the unit test assertions written for the custom `Button` component.

**Answer:**  
The unit tests in [Button.test.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/tests/unit/src/components/ui/Button.test.tsx) check core button functionality such as rendering children, handling clicks, and disabled behaviors:

```typescript
describe('Button Component Unit Testing', () => {
  it('should render children text correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByText('Click Me');
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

### Q53: What tool handles End-to-End browser testing in this application, and how are tests run?

**Answer:**  
E2E testing is handled by **Playwright**. It is configured in `playwright.config.ts`, and test scripts are declared in [package.json](file:///c:/Users/rohit/Downloads/real-estate-1/package.json#L18-L19):

- `npm run test:e2e` runs E2E tests in headed mode: `playwright test --headed`
- `npm run test:e2e:ui` opens the Playwright E2E interactive testing panel: `playwright test --ui`

---

### Q54: How are pre-commit checks configured to enforce code style consistency?

**Answer:**  
Code formatting and styling are checked automatically before git commits using **Husky** and **lint-staged**.  
As defined in [package.json](file:///c:/Users/rohit/Downloads/real-estate-1/package.json#L81-L92), files matching specific file glob paths trigger ESLint and Prettier formatting checks before changes can be committed:

```json
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "src/**/*.css": [
    "prettier --write"
  ],
  "**/*.{json,md}": [
    "prettier --write"
  ]
}
```

---

### Q55: How is Storybook configured in the project, and which stories exist?

**Answer:**  
Storybook is configured using the `@storybook/react-vite` framework. Component stories are defined in the `src/components/ui` directory:

- [Button.stories.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Button.stories.tsx) exposes stories like `PrimaryGold`, `SecondaryOutline`, `LoadingState`, and `DisabledState`.
- [Card.stories.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/components/ui/Card.stories.tsx) mocks data properties to preview property layouts.

Storybook is started locally by running: `npm run storybook`.

---

### Q56: How is the TypeScript compiler configured to compile source files?

**Answer:**  
The TypeScript compiler uses target configurations separated across project folders:

- `tsconfig.json`: Declares base reference directories.
- `tsconfig.app.json`: Configures build options for the react application.
- `tsconfig.node.json`: Configures options for node build tooling environments like `vite.config.ts`.

---

### Q57: How is the Tailwind CSS engine configured in the application?

**Answer:**  
Tailwind is integrated into the build pipeline using `@tailwindcss/vite` in [package.json](file:///c:/Users/rohit/Downloads/real-estate-1/package.json#L45). It is initialized directly inside the main CSS file using the `@import "tailwindcss";` directive:

```css
@import 'tailwindcss';
@theme {
  --color-gold-50: #fbf7ee;
  --color-gold-100: #f5ebce;
  --color-gold-600: #b89047;
  --color-obsidian-950: #0d0e11;
  /* Custom theme styling tokens... */
}
```

---

### Q58: What is the purpose of the component showcase page in the application, and how do you access it?

**Answer:**  
The application includes a components showcase page located in [Showcase.tsx](file:///c:/Users/rohit/Downloads/real-estate-1/src/pages/Showcase.tsx). This page can be accessed by navigating to the `#/showcase` hash fragment.  
It provides a live preview of the design system components (buttons, cards, forms, modals, error boundaries, skeletons), allowing developers to verify changes to components in a single location.

---

### Q59: Where are development build environments and environment variables managed?

**Answer:**  
Environment variables are managed in `.env.local` in the project root directory. This file stores API URLs and client secrets. It is processed by Vite during builds and made available under `import.meta.env`.

---

### Q60: Explain how Jest mocks browser animation features in `setupTests.ts`.

**Answer:**  
To prevent test failures in environments without layouts, [setupTests.ts](file:///c:/Users/rohit/Downloads/real-estate-1/tests/unit/setupTests.ts#L4-L26) defines mock mock implementations for browser objects:

```typescript
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
```

This ensures React components utilizing browser layout observers can mount and run successfully under JSDOM tests.
