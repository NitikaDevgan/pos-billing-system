# POS Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder route with a responsive, dummy-data cafe POS screen that supports category filtering and a complete in-memory cart workflow.

**Architecture:** `POSPage` owns local selected-category and cart state because this phase has one consumer and no persistence requirement. Typed fixture data and pure cart operations are separated from presentation components; the POS page composes a header, category rail, product grid, and cart panel.

**Tech Stack:** React 19, TypeScript 5, React Router 7, Vite 7, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-09-11-pos-frontend-design.md`

## Global Constraints

- Change frontend files only; do not add backend integration or edit backend code.
- Do not add application dependencies; Redux Toolkit is not configured, so keep cart state local to `POSPage`. Add Vitest only as a development dependency for cart-domain tests.
- Use the existing Sage Green + Cream variables in `src/styles/theme.css`; do not hardcode the theme palette in components.
- Keep `/` as the default POS route and retain a Vite-runnable frontend.
- Do not implement payment processing, authentication, inventory, reports, printers, receipts, offline behavior, or customer forms.

---

## File Structure

- `frontend/src/constants/products.ts` — `Product`, category definitions, and typed dummy product fixtures.
- `frontend/src/features/cart/types.ts` — cart item type shared by cart state and cart UI.
- `frontend/src/features/cart/cartState.ts` — pure immutable cart mutation helpers and total calculation.
- `frontend/src/features/pos/pages/POSPage.tsx` — page-level state, filtering, composition, and placeholder handlers.
- `frontend/src/features/pos/components/POSHeader.tsx` — title, online status, and updating local time.
- `frontend/src/features/pos/components/CategoryList.tsx` — accessible category controls.
- `frontend/src/features/pos/components/ProductCard.tsx` — addable/disabled product card.
- `frontend/src/features/pos/components/ProductGrid.tsx` — filtered product-card collection.
- `frontend/src/features/cart/components/Cart.tsx` — cart state panel, empty state, and clear action.
- `frontend/src/features/cart/components/CartItem.tsx` — one cart row and quantity/remove controls.
- `frontend/src/features/cart/components/CartSummary.tsx` — money summary, customer placeholder, and Pay action.
- `frontend/src/app/router.tsx` — map `/` to `POSPage`.
- `frontend/src/styles/globals.css` — tablet-first POS layout and component styling.

### Task 1: Define POS data and cart domain helpers

**Files:**
- Create: `frontend/src/constants/products.ts`
- Create: `frontend/src/features/cart/types.ts`
- Create: `frontend/src/features/cart/cartState.ts`

**Interfaces:**
- Produces: `Product`, `Category`, `categories`, and `products` for POS UI.
- Produces: `CartItem`, `addProduct(items, product)`, `increaseQuantity(items, productId)`, `decreaseQuantity(items, productId)`, `removeItem(items, productId)`, `clearCart()`, `getCartTotal(items)`, and `formatCurrency(amount)` for page/cart components.

- [ ] **Step 1: Add typed product data**

```ts
export type Category = 'All' | 'Tea' | 'Snacks' | 'Sandwiches' | 'Fries' | 'Drinks';
export interface Product { id: number; name: string; price: number; category: Exclude<Category, 'All'>; available: boolean; }
export const categories: Category[] = ['All', 'Tea', 'Snacks', 'Sandwiches', 'Fries', 'Drinks'];
export const products: Product[] = [
  { id: 1, name: 'Masala Tea', price: 30, category: 'Tea', available: true },
  { id: 2, name: 'Ginger Tea', price: 35, category: 'Tea', available: true },
  { id: 3, name: 'Elaichi Tea', price: 35, category: 'Tea', available: true },
  { id: 4, name: 'Lemon Tea', price: 30, category: 'Tea', available: true },
  { id: 5, name: 'Green Tea', price: 40, category: 'Tea', available: false },
  { id: 6, name: 'Bun Maska', price: 50, category: 'Snacks', available: true },
  { id: 7, name: 'Veg Sandwich', price: 80, category: 'Sandwiches', available: true },
  { id: 8, name: 'Cheese Sandwich', price: 100, category: 'Sandwiches', available: true },
  { id: 9, name: 'French Fries', price: 70, category: 'Fries', available: true },
  { id: 10, name: 'Peri Peri Fries', price: 80, category: 'Fries', available: true },
  { id: 11, name: 'Cold Coffee', price: 90, category: 'Drinks', available: true },
  { id: 12, name: 'Lemonade', price: 50, category: 'Drinks', available: true },
];
```

Add the twelve requested product records, including at least one `available: false` product so the Sold Out behavior can be exercised.

- [ ] **Step 2: Implement immutable cart operations**

```ts
export interface CartItem { productId: number; name: string; price: number; quantity: number; }

export function addProduct(items: CartItem[], product: Product): CartItem[] {
  if (!product.available) return items;
  const existing = items.find((item) => item.productId === product.id);
  return existing
    ? items.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
    : [...items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
}
export function decreaseQuantity(items: CartItem[], productId: number): CartItem[] {
  return items.flatMap((item) => item.productId !== productId ? [item] : item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []);
}
export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```

Ensure unavailable products are not added by this boundary helper and that every returned quantity is at least one.

- [ ] **Step 3: Verify the domain layer compiles**

Run: `npm run build` from `frontend`.

Expected: Vite completes the production build without TypeScript errors.

- [ ] **Step 4: Commit the domain layer**

```bash
git add frontend/src/constants/products.ts frontend/src/features/cart/types.ts frontend/src/features/cart/cartState.ts
git commit -m "feat: add POS product and cart state helpers"
```

### Task 2: Build POS selection components

**Files:**
- Create: `frontend/src/features/pos/components/POSHeader.tsx`
- Create: `frontend/src/features/pos/components/CategoryList.tsx`
- Create: `frontend/src/features/pos/components/ProductCard.tsx`
- Create: `frontend/src/features/pos/components/ProductGrid.tsx`

**Interfaces:**
- Consumes: `Category`, `Product`, `categories`, and `formatCurrency`.
- Produces: `POSHeader`, `CategoryList`, and `ProductGrid` consumed by `POSPage`.

- [ ] **Step 1: Implement the header with a live time**

```tsx
export function POSHeader() {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return <header className="pos-header"><p>CAFÉ POS &amp; BILLING</p><span aria-label="System status: online">Online</span><time>{currentTime.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</time></header>;
}
```

Render the cafe/POS label, an accessible Online indicator, and localized `en-IN` time.

- [ ] **Step 2: Implement large category buttons**

```tsx
interface CategoryListProps { selectedCategory: Category; onSelect: (category: Category) => void; }
```

Render every category as a native button using `aria-pressed={category === selectedCategory}`. The selected button must use the active class.

- [ ] **Step 3: Implement product card/grid behavior**

```tsx
interface ProductGridProps { products: Product[]; onAddProduct: (product: Product) => void; }
```

Render visible products as large card buttons. For `available: false`, set `disabled`, show “Sold Out”, and avoid calling `onAddProduct`. Show name, formatted price, and a simple text/emoji visual area without introducing an image dependency.

- [ ] **Step 4: Verify component types**

Run: `npm run build` from `frontend`.

Expected: production build succeeds.

- [ ] **Step 5: Commit POS selection components**

```bash
git add frontend/src/features/pos/components
git commit -m "feat: add POS product selection UI"
```

### Task 3: Build reusable cart presentation

**Files:**
- Create: `frontend/src/features/cart/components/CartItem.tsx`
- Create: `frontend/src/features/cart/components/CartSummary.tsx`
- Create: `frontend/src/features/cart/components/Cart.tsx`

**Interfaces:**
- Consumes: `CartItem`, `formatCurrency`, and cart callbacks supplied by `POSPage`.
- Produces: `Cart` with `items`, `subtotal`, `onIncrease`, `onDecrease`, `onRemove`, `onClear`, and `onPay` props.

- [ ] **Step 1: Implement cart rows**

```tsx
interface CartItemProps {
  item: CartItem;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}
```

Show item name, unit price, line total, minus/plus buttons, and an explicit Remove button. Give every icon-like button an `aria-label` that includes the item name.

- [ ] **Step 2: Implement summary and primary payment control**

```tsx
interface CartSummaryProps { subtotal: number; isEmpty: boolean; onPay: () => void; }
```

Render equal Subtotal and Total rows, a secondary `+ Add Customer` placeholder button, and `PAY ₹…`. Disable Pay when `isEmpty` is true.

- [ ] **Step 3: Implement cart panel and empty state**

Render `Current Order`, a Clear cart button disabled for an empty cart, either cart rows or a clear empty-state message, and `CartSummary`.

- [ ] **Step 4: Verify component types**

Run: `npm run build` from `frontend`.

Expected: production build succeeds.

- [ ] **Step 5: Commit cart UI**

```bash
git add frontend/src/features/cart/components
git commit -m "feat: add POS cart panel"
```

### Task 4: Compose, route, style, and verify the POS page

**Files:**
- Create: `frontend/src/features/pos/pages/POSPage.tsx`
- Modify: `frontend/src/app/router.tsx`
- Modify: `frontend/src/styles/globals.css`

**Interfaces:**
- Consumes: all interfaces produced in Tasks 1–3.
- Produces: `POSPage` as the root route element.

- [ ] **Step 1: Compose page state and filtering**

```tsx
const [selectedCategory, setSelectedCategory] = useState<Category>('All');
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const visibleProducts = selectedCategory === 'All'
  ? products
  : products.filter((product) => product.category === selectedCategory);
```

Pass immutable state helper callbacks to the child components. The Pay callback should only call `window.alert('Payment flow will be added in a future phase.')` after the empty-cart guard.

- [ ] **Step 2: Replace the placeholder root route**

```tsx
import { POSPage } from '../features/pos/pages/POSPage';
export const router = createBrowserRouter([
  { path: '/', element: <AppLayout />, children: [{ index: true, element: <POSPage /> }] },
]);
```

Keep `WelcomePage.tsx` untouched unless TypeScript reports an unused-import issue; it may be removed in a future cleanup.

- [ ] **Step 3: Add responsive POS CSS**

Use `grid-template-columns: minmax(9rem, .8fr) minmax(0, 2fr) minmax(19rem, 1fr)` at landscape tablet width. At `max-width: 900px`, switch to a two-column grid with the cart spanning full width; at `max-width: 620px`, use one column. Use CSS variables for all palette choices and ensure minimum 44px control heights.

- [ ] **Step 4: Run build and development server**

Run: `npm run build` from `frontend`.

Run: `npm run dev -- --host 127.0.0.1` from `frontend`.

Expected: the build succeeds and Vite reports a local URL with no startup errors.

- [ ] **Step 5: Manually verify in the running app**

At `/`, verify all of the following:

1. All products are displayed on initial load and selecting Tea filters to tea products.
2. A Sold Out product remains visible, appears disabled, and cannot change the cart.
3. Pressing an available product adds it; pressing it again increments the quantity.
4. Plus increments; minus decrements and removes at one; Remove and Clear cart work.
5. Line totals and subtotal/total use ₹ formatting and change correctly.
6. Pay is disabled for an empty cart and enabled otherwise.
7. The layout is usable at 1024px and 1280px wide without console errors.

- [ ] **Step 6: Commit the completed feature**

```bash
git add frontend/src/app/router.tsx frontend/src/features/pos/pages/POSPage.tsx frontend/src/styles/globals.css
git commit -m "feat: add cafe POS billing screen"
```
