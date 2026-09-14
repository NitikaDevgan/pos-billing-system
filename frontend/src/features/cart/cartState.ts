import type { Product } from '../../constants/products';
import type { CartItem } from './types';

export function addProduct(items: CartItem[], product: Product): CartItem[] {
  if (!product.available) return items;

  const existingItem = items.find((item) => item.productId === product.id);
  if (existingItem) {
    return items.map((item) =>
      item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  }

  return [...items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
}

export function increaseQuantity(items: CartItem[], productId: number): CartItem[] {
  return items.map((item) =>
    item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
  );
}

export function decreaseQuantity(items: CartItem[], productId: number): CartItem[] {
  return items.flatMap((item) => {
    if (item.productId !== productId) return [item];
    return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
  });
}

export function removeItem(items: CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function clearCart(): CartItem[] {
  return [];
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
