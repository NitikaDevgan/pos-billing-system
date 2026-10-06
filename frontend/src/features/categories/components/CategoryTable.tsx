import { Button } from '../../../components/Button/Button';
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge';
import type { Category } from '../types';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  if (categories.length === 0) return <p className="admin-empty">No categories yet.</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr><th>Name</th><th>Status</th><th>Updated</th><th aria-label="Actions" /></tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id}>
            <td>{category.name}</td>
            <td><StatusBadge active={category.isActive} /></td>
            <td>{new Date(category.updatedAt).toLocaleDateString('en-IN')}</td>
            <td className="admin-table__actions">
              <Button variant="secondary" onClick={() => onEdit(category)}>Edit</Button>
              <Button variant="danger" onClick={() => onDelete(category)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
