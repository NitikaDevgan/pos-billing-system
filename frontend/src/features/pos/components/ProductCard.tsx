import type { Product } from '../../../constants/products';
import { formatCurrency } from '../../cart/cartState';

interface ProductCardProps {
  product: Product;
  onAddProduct: (product: Product) => void;
}

const categoryIcons: Record<Product['category'], string> = {
  Tea: '☕',
  Snacks: '🥯',
  Sandwiches: '🥪',
  Fries: '🍟',
  Drinks: '🥤',
};

export function ProductCard({ product, onAddProduct }: ProductCardProps) {
  return (
    <button
      className={product.available ? 'product-card' : 'product-card product-card--sold-out'}
      type="button"
      disabled={!product.available}
      onClick={() => onAddProduct(product)}
      aria-label={product.available ? `Add ${product.name} for ${formatCurrency(product.price)}` : `${product.name} is sold out`}
    >
      <span className="product-card__icon" aria-hidden="true">{categoryIcons[product.category]}</span>
      <span className="product-card__details">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{formatCurrency(product.price)}</span>
      </span>
      {!product.available && <span className="sold-out-label">Sold Out</span>}
    </button>
  );
}
