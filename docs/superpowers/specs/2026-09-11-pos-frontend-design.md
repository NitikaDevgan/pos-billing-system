# POS Frontend Design

## Scope

Replace the placeholder root screen with a tablet-first cafe point-of-sale screen that uses typed dummy product data. This phase is frontend-only and does not connect to backend APIs, payments, authentication, inventory, reports, printing, or offline features.

## Architecture

The root router will render `POSPage` at `/` inside the existing `AppLayout`. `POSPage` will own two local state values:

- The selected category, initially `All` so the complete menu is immediately visible.
- Cart items, represented by product ID, name, unit price, and positive quantity.

Redux Toolkit is not present in the project. Local state is sufficient because cart data is only used within this page and does not need persistence or cross-route sharing in this phase. No dependencies will be added.

Typed product fixtures will be defined in `src/constants/products.ts`. POS and cart UI will be separated into small components under `src/features/pos` and `src/features/cart`.

## User Experience

The POS page will have a simple header and a three-column landscape-tablet layout:

1. A category navigation rail with large buttons. Selecting a category filters the product grid.
2. A product grid of large, button-based cards. Pressing an available product adds it to the cart or increments its quantity. Unavailable products remain visible, read as disabled, show a Sold Out label, and cannot be selected.
3. A current-order panel containing cart rows, quantity controls, remove and clear actions, subtotal/total, a secondary Add Customer placeholder, and the dominant Pay button.

The page will stack into an accessible narrower layout at smaller widths. Theme CSS variables will supply the existing Sage Green + Cream colors. All interactive controls will use native buttons with visible focus and disabled states.

## Cart Rules

- Adding an existing product increments its quantity by one.
- Increasing increments by one.
- Decreasing a quantity of one removes that item; quantities never become negative.
- Removing deletes the selected item; Clear cart removes every item.
- Subtotal and total are equal for this phase and use Indian Rupee formatting.
- Pay is disabled with an empty cart. When enabled, it calls a harmless placeholder handler only.

## Verification

Verification will include TypeScript/Vite production build, a Vite development-server startup check, and manual browser checks of category filtering, sold-out handling, cart mutations, totals, Pay disabled/enabled states, and tablet-width layout.
