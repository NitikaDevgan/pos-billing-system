import type { CartItem as CartItemType } from "../types";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

interface CartProps {
  items: CartItemType[];
  subtotal: number;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
  onPay: () => void;
}

export function Cart({
  items,
  subtotal,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onPay,
}: CartProps) {
  const isEmpty = items.length === 0;
  return (
    <aside className="cart-panel" aria-label="Current order">
      <div className="cart-panel__heading">
        <div>
          <p className="panel-label">Order</p>
          <h2>Current Order</h2>
        </div>
        <button
          className="text-button"
          type="button"
          disabled={isEmpty}
          onClick={onClear}
        >
          Clear cart
        </button>
      </div>
      {isEmpty ? (
        <div className="cart-empty">
          <span aria-hidden="true">🧾</span>
          <h3>Your order is empty</h3>
          <p>Tap a menu item to add it here.</p>
        </div>
      ) : (
        <ul className="cart-items">
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
      <CartSummary subtotal={subtotal} isEmpty={isEmpty} onPay={onPay} />
    </aside>
  );
}
