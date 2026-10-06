import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import type { Category } from '../../categories/types';
import type { Product, ProductInput } from '../types';

interface ProductFormProps {
  categories: Category[];
  initialProduct?: Product;
  isSubmitting: boolean;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
}

type FormErrors = Partial<Record<'name' | 'price' | 'categoryId', string>>;

export function ProductForm({ categories, initialProduct, isSubmitting, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name ?? '');
  const [price, setPrice] = useState(initialProduct ? String(Number(initialProduct.price)) : '');
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId ?? categories[0]?.id ?? '');
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const parsedPrice = Number(price);
    const nextErrors: FormErrors = {};
    if (!trimmedName) nextErrors.name = 'Product name is required.';
    if (price.trim() === '' || !Number.isFinite(parsedPrice) || parsedPrice < 0) nextErrors.price = 'Enter a valid price.';
    if (!categoryId) nextErrors.categoryId = 'Select a category.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit({ name: trimmedName, price: parsedPrice, categoryId, isActive });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <Input label="Name" value={name} error={errors.name} autoFocus maxLength={80} onChange={(event) => setName(event.target.value)} />
      <Input label="Price (₹)" type="number" inputMode="decimal" min={0} step="0.01" value={price} error={errors.price} onChange={(event) => setPrice(event.target.value)} />
      <div className="field">
        <label className="field__label" htmlFor="product-category">Category</label>
        <select className="field__input" id="product-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          {categories.length === 0 && <option value="">No categories available</option>}
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        {errors.categoryId && <p className="field__error">{errors.categoryId}</p>}
      </div>
      <label className="checkbox-field">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
        Available for sale
      </label>
      <div className="admin-form__actions">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save'}</Button>
      </div>
    </form>
  );
}
