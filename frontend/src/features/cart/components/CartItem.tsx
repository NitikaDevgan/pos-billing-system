import { formatCurrency } from '../cartState';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <li className="cart-item">
      <div className="cart-item__topline">
        <div><h3>{item.name}</h3><span>{formatCurrency(item.price)} each</span></div>
        <strong>{formatCurrency(item.price * item.quantity)}</strong>
      </div>
      <div className="cart-item__controls">
        <div className="quantity-control" aria-label={`${item.name} quantity`}>
          <button type="button" onClick={() => onDecrease(item.productId)} aria-label={`Decrease ${item.name} quantity`}>−</button>
          <output>{item.quantity}</output>
          <button type="button" onClick={() => onIncrease(item.productId)} aria-label={`Increase ${item.name} quantity`}>+</button>
        </div>
        <button className="text-button" type="button" onClick={() => onRemove(item.productId)}>Remove</button>
      </div>
    </li>
  );
}
