import { Button } from '../../../components/Button/Button';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import { formatCurrency } from '../../cart/cartState';
import type { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  categoryNames: Map<string, string>;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, categoryNames, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) return <p className="admin-empty">No products yet.</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th aria-label="Actions" /></tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.category?.name ?? categoryNames.get(product.categoryId) ?? '—'}</td>
            <td>{formatCurrency(Number(product.price))}</td>
            <td><StatusBadge active={product.isActive} activeLabel="Available" inactiveLabel="Unavailable" /></td>
            <td className="admin-table__actions">
              <Button variant="secondary" onClick={() => onEdit(product)}>Edit</Button>
              <Button variant="danger" onClick={() => onDelete(product)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
