import { useMemo, useState } from 'react';
import { products, type Category, type Product } from '../../../constants/products';
import { addProduct, clearCart, decreaseQuantity, getCartTotal, increaseQuantity, removeItem } from '../../cart/cartState';
import type { CartItem } from '../../cart/types';
import { Cart } from '../../cart/components/Cart';
import { CategoryList } from '../components/CategoryList';
import { POSHeader } from '../components/POSHeader';
import { ProductGrid } from '../components/ProductGrid';

export function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const visibleProducts = useMemo(() => selectedCategory === 'All' ? products : products.filter((product) => product.category === selectedCategory), [selectedCategory]);
  const subtotal = getCartTotal(cartItems);

  const handleAddProduct = (product: Product) => setCartItems((items) => addProduct(items, product));
  const handlePay = () => { if (cartItems.length > 0) window.alert('Payment flow will be added in a future phase.'); };

  return <div className="pos-page"><POSHeader /><main className="pos-workspace"><CategoryList selectedCategory={selectedCategory} onSelect={setSelectedCategory} /><ProductGrid products={visibleProducts} onAddProduct={handleAddProduct} /><Cart items={cartItems} subtotal={subtotal} onIncrease={(id) => setCartItems((items) => increaseQuantity(items, id))} onDecrease={(id) => setCartItems((items) => decreaseQuantity(items, id))} onRemove={(id) => setCartItems((items) => removeItem(items, id))} onClear={() => setCartItems(clearCart())} onPay={handlePay} /></main></div>;
}
