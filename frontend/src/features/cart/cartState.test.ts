import { describe, expect, it } from 'vitest';
import type { Product } from '../products/types';
import {
  addProduct,
  clearCart,
  decreaseQuantity,
  getCartTotal,
  increaseQuantity,
  removeItem,
} from './cartState';

const masalaTea: Product = {
  id: 'masala-tea',
  name: 'Masala Tea',
  price: '30.00',
  categoryId: 'tea',
  isActive: true,
  createdAt: '',
  updatedAt: '',
};

const soldOutTea: Product = {
  id: 'green-tea',
  name: 'Green Tea',
  price: '40.00',
  categoryId: 'tea',
  isActive: false,
  createdAt: '',
  updatedAt: '',
};

describe('cart state', () => {
  it('adds a product and increases its quantity when added again', () => {
    const cart = addProduct(addProduct([], masalaTea), masalaTea);

    expect(cart).toEqual([{ productId: 'masala-tea', name: 'Masala Tea', price: 30, quantity: 2 }]);
  });

  it('does not add a sold-out product', () => {
    expect(addProduct([], soldOutTea)).toEqual([]);
  });

  it('removes an item when decreased from one quantity', () => {
    const cart = decreaseQuantity(addProduct([], masalaTea), masalaTea.id);

    expect(cart).toEqual([]);
  });

  it('updates quantity, removes items, clears the cart, and calculates a total', () => {
    const cart = addProduct(addProduct([], masalaTea), masalaTea);
    const increased = increaseQuantity(cart, masalaTea.id);

    expect(increased[0].quantity).toBe(3);
    expect(getCartTotal(increased)).toBe(90);
    expect(removeItem(increased, masalaTea.id)).toEqual([]);
    expect(clearCart()).toEqual([]);
  });
});
