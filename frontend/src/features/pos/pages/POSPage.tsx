import { useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../../services/apiClient';
import { addProduct, clearCart, decreaseQuantity, getCartTotal, increaseQuantity, removeItem } from '../../cart/cartState';
import type { CartItem } from '../../cart/types';
import { Cart } from '../../cart/components/Cart';
import { categoryApi } from '../../categories/categoryApi';
import { PaymentModal } from '../../payment/components/PaymentModal';
import type { Category } from '../../categories/types';
import { productApi } from '../../products/productApi';
import type { Product } from '../../products/types';
import { ALL_CATEGORIES, CategoryList } from '../components/CategoryList';
import { POSHeader } from '../components/POSHeader';
import { ProductGrid } from '../components/ProductGrid';

export function POSPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORIES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    Promise.all([categoryApi.list(), productApi.list()])
      .then(([categoryList, productList]) => {
        // Inactive categories (and their products) are hidden from the counter entirely.
        const activeCategories = categoryList.filter((category) => category.isActive);
        const activeIds = new Set(activeCategories.map((category) => category.id));
        setCategories(activeCategories);
        setProducts(productList.filter((product) => activeIds.has(product.categoryId)));
      })
      .catch((loadError) => setError(getErrorMessage(loadError)))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleProducts = useMemo(() => selectedCategoryId === ALL_CATEGORIES ? products : products.filter((product) => product.categoryId === selectedCategoryId), [products, selectedCategoryId]);
  const subtotal = getCartTotal(cartItems);

  const handleAddProduct = (product: Product) => setCartItems((items) => addProduct(items, product));
  const handlePay = () => { if (cartItems.length > 0) setIsPaying(true); };

  const menu = isLoading
    ? <p className="pos-message">Loading menu…</p>
    : error
      ? <p className="pos-message admin-error" role="alert">Couldn't load the menu: {error}</p>
      : <ProductGrid products={visibleProducts} onAddProduct={handleAddProduct} />;

  return <div className="pos-page"><POSHeader /><main className="pos-workspace"><CategoryList categories={categories} selectedCategoryId={selectedCategoryId} onSelect={setSelectedCategoryId} />{menu}<Cart items={cartItems} subtotal={subtotal} onIncrease={(id) => setCartItems((items) => increaseQuantity(items, id))} onDecrease={(id) => setCartItems((items) => decreaseQuantity(items, id))} onRemove={(id) => setCartItems((items) => removeItem(items, id))} onClear={() => setCartItems(clearCart())} onPay={handlePay} /></main><PaymentModal isOpen={isPaying} items={cartItems} total={subtotal} onPaid={() => setCartItems(clearCart())} onClose={() => setIsPaying(false)} /></div>;
}
