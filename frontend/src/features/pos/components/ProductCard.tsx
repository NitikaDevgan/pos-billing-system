import { formatCurrency } from '../../cart/cartState';
import type { Product } from '../../products/types';

interface ProductCardProps {
  product: Product;
  onAddProduct: (product: Product) => void;
}

// Categories are admin-defined now, so unknown names fall back to a generic icon.
const categoryIcons: Record<string, string> = {
  Tea: '☕',
  Snacks: '🥯',
  Sandwiches: '🥪',
  Fries: '🍟',
  Drinks: '🥤',
};

export function ProductCard({ product, onAddProduct }: ProductCardProps) {
  const price = formatCurrency(Number(product.price));

  return (
    <button
      className={product.isActive ? 'product-card' : 'product-card product-card--sold-out'}
      type="button"
      disabled={!product.isActive}
      onClick={() => onAddProduct(product)}
      aria-label={product.isActive ? `Add ${product.name} for ${price}` : `${product.name} is sold out`}
    >
      <span className="product-card__icon" aria-hidden="true">{categoryIcons[product.category?.name ?? ''] ?? '🍽️'}</span>
      <span className="product-card__details">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{price}</span>
      </span>
      {!product.isActive && <span className="sold-out-label">Sold Out</span>}
    </button>
  );
}
