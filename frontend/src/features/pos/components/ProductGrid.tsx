import type { Product } from '../../../constants/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
}

export function ProductGrid({ products, onAddProduct }: ProductGridProps) {
  return (
    <section className="product-area" aria-label="Products">
      <div className="product-area__heading">
        <div>
          <p className="panel-label">Menu</p>
          <h2>Choose an item</h2>
        </div>
        <span>{products.length} items</span>
      </div>
      <div className="product-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} onAddProduct={onAddProduct} />)}
      </div>
    </section>
  );
}
