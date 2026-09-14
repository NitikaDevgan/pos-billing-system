import { categories, type Category } from '../../../constants/products';

interface CategoryListProps {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export function CategoryList({ selectedCategory, onSelect }: CategoryListProps) {
  return (
    <nav className="category-list" aria-label="Product categories">
      <p className="panel-label">Categories</p>
      <div className="category-list__buttons">
        {categories.map((category) => (
          <button
            className={category === selectedCategory ? 'category-button category-button--active' : 'category-button'}
            key={category}
            type="button"
            aria-pressed={category === selectedCategory}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}
