export type Category = 'All' | 'Tea' | 'Snacks' | 'Sandwiches' | 'Fries' | 'Drinks';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Exclude<Category, 'All'>;
  available: boolean;
}

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
