# L'ESTATE — Ultra-Luxury Vacation Rentals

L'ESTATE is a high-end, editorial vacation rentals portal designed for curating, exploring, and booking ultra-luxury properties. The application has been developed to meet elite branding standards and features premium light-mode visual tokens, dynamic micro-interactions, responsive form validators, and synchronized map listings.

## 🎨 Design Reference

This implementation is modeled after the following professional Figma design file:

- **Figma Design File:** [Luxury Real Estate Rental Website (Community)](https://www.figma.com/design/z6McXILT0IbMTyDJZM00Ii/Luxury-Real-Estate-Rental-Website--Community-?node-id=70-2846&p=f&t=70LZXZFVok2gzDDm-0)

---

## 🚀 Key Features

- **Immersive Search & Filters:** Real-time search by location, property type, nightly rate bounds, bedrooms, bathrooms, and premium luxury amenities (e.g. Helipads, Butler Services, Private Pools).
- **Interactive Mapping (Leaflet & OpenStreetMap):** Custom-themed map markers displaying price labels that glow and scale on selection. Employs CartoDB Voyager light-theme tiles.
- **Map-to-List Synchronization:** Clicking any map pin popup smoothly scrolls the corresponding property card into center view inside the listings column. On mobile viewports, tapping the popup automatically transitions the view mode from map to list.
- **Property Detail & Gallery Lightbox:** Desktop editorial image grids and mobile swipe slideshows with full-screen lightbox sliders. Disables background body scrolling when the modal overlay is active.
- **Interactive Booking Panel:** Live check-in/check-out night calculations including base rates, cleaning fees, luxury taxes, and optional VIP concierge staffing.
- **Persistent Wishlist:** Hand-select luxury properties to add to a personal wishlist, persisted across page loads via `localStorage`.
- **Editorial Legal Center:** Tabbed compliance view (Privacy Policy, Terms of Service, NDA Covenants) deep-linked from page footers.
- **SPA SEO Title Manager:** Updates browser document titles and meta description tags dynamically on hash-route transitions.

---

## 🛠️ Architecture & Technical Decisions

### 1. Feature-Driven Reorganization

The folder structure is organized by domain responsibilities to facilitate codebase scalability:

- `src/components/ui/`: Contains atomic, design-system-aligned UI primitives (`Button.tsx`, `Card.tsx`, `Modal.tsx`, `FormField.tsx`, `Skeleton.tsx`, `ErrorBoundary.tsx`).
- `src/features/search/`: Contains search feature components (`SearchBar.tsx`, `FilterPanel.tsx`, `Map.tsx`).
- `src/hooks/`: Contains reusable application logic.
- `src/services/`: Houses simulated API service layers.
- `src/store/`: Contains Zustand store state bindings.

### 2. State Selector Optimization (`useShallow`)

- Destructuring state directly from global store hooks (e.g., `const { favorites } = useStore()`) subscribes components to the entire store. Any update inside the store (such as hover changes or booking creations) triggers a full re-render of every subscribed component.
- **Refactoring Pattern:** Components selectively fetch values using single-property queries or `useStore(useShallow(state => ({ ... })))`. This prevents unnecessary re-render cascades across header layouts, search bars, and card elements.

### 3. Asynchronous Mock API Service (`src/services/api.ts`)

- Implements an asynchronous service layer utilizing Promise resolvers and simulated network latency (`250ms - 350ms`).
- This enables the rendering of **Skeleton loading screens** to demonstrate realistic data-fetching behaviors.

### 4. Reusable Custom Hooks

- `useFavorites`: Encapsulates wishlist status checks, additions, and caching synchronization.
- `usePropertyFilters`: Manages search parameters, reset triggers, and matches filtered listing arrays.
- `useDocumentTitle`: Coordinates document title updates and description tag insertions for SPA SEO.

### 5. Standardized Forms (`FormField.tsx`)

- Form inputs are abstracted into a single `<FormField>` component. It unifies input styling, selection menus, textareas, Zod validation handling, and Framer Motion error text animations under a single design standard.

### 6. Error Boundary Isolation (`ErrorBoundary.tsx`)

- Wraps the route renderer. If a component (such as map tiles or coordinate assets) encounters a runtime error, the app displays a luxury-themed error notification with clear reload actions rather than crashing the interface.

---

## 💻 Tech Stack

- **Core:** React 19, TypeScript (with strict types), Vite
- **Styling:** Vanilla CSS, Tailwind CSS v4 (Light Luxury theme tokens, HSL custom colors)
- **Animation:** Framer Motion (page transitions, Modal spring actions, sliding drawers)
- **State Management:** Zustand v5 (with localStorage persistence)
- **Mapping:** React Leaflet, Leaflet, CartoDB Voyager tiles
- **Form & Validation:** React Hook Form, Zod

---

## 🏃 Run Locally

### 1. Setup Dependencies

```bash
npm install
```

### 2. Launch Dev Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Production Build

```bash
npm run build
```

Typecheck and compile minified bundles into the `dist/` directory.

### 4. Storybook Components Preview

```bash
npm run storybook
```

Launch isolated Storybook stories to test and tweak atomic components.

### 5. Code Quality Check

```bash
npm run lint
```

Inspect code formatting and TypeScript rules compliance.

---

## 🌐 Continuous Integration & Continuous Delivery (CD)

The project includes a GitHub Actions CI/CD workflow (`.github/workflows/deploy.yml`):

1. Triggered automatically on code pushes and pull requests to the `main` branch.
2. Sets up Node, runs ESLint and Prettier formatting checks.
3. Builds the production code (`npm run build`).
4. Deploys static build chunks directly to **Vercel Production Environment** using secure tokens.
