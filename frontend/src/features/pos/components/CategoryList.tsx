import type { Category } from '../../categories/types';

export const ALL_CATEGORIES = 'all';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryList({ categories, selectedCategoryId, onSelect }: CategoryListProps) {
  const options = [{ id: ALL_CATEGORIES, name: 'All' }, ...categories];

  return (
    <nav className="category-list" aria-label="Product categories">
      <p className="panel-label">Categories</p>
      <div className="category-list__buttons">
        {options.map((category) => (
          <button
            className={category.id === selectedCategoryId ? 'category-button category-button--active' : 'category-button'}
            key={category.id}
            type="button"
            aria-pressed={category.id === selectedCategoryId}
            onClick={() => onSelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
