import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { Modal } from '../../../components/Modal/Modal';
import { getErrorMessage } from '../../../services/apiClient';
import { categoryApi } from '../categoryApi';
import { CategoryForm } from '../components/CategoryForm';
import { CategoryTable } from '../components/CategoryTable';
import type { Category, CategoryInput } from '../types';

export function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category>();

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      setCategories(await categoryApi.list());
      setError(undefined);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadCategories(); }, [loadCategories]);

  const openForm = (category?: Category) => { setEditingCategory(category); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditingCategory(undefined); };

  const handleSubmit = async (input: CategoryInput) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) await categoryApi.update(editingCategory.id, input);
      else await categoryApi.create(input);
      closeForm();
      await loadCategories();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await categoryApi.remove(category.id);
      await loadCategories();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <p className="panel-label">Catalogue</p>
          <h1>Categories</h1>
        </div>
        <Button onClick={() => openForm()}>+ Add Category</Button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {isLoading ? <p>Loading categories…</p> : <CategoryTable categories={categories} onEdit={openForm} onDelete={handleDelete} />}
      <Modal isOpen={isFormOpen} title={editingCategory ? 'Edit Category' : 'Add Category'} onClose={closeForm}>
        <CategoryForm initialCategory={editingCategory} isSubmitting={isSubmitting} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>
    </section>
  );
}
