import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { Modal } from '../../../components/Modal/Modal';
import { getErrorMessage } from '../../../services/apiClient';
import { categoryApi } from '../../categories/categoryApi';
import type { Category } from '../../categories/types';
import { productApi } from '../productApi';
import { ProductForm } from '../components/ProductForm';
import { ProductTable } from '../components/ProductTable';
import type { Product, ProductInput } from '../types';

export function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>();

  const categoryNames = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productList, categoryList] = await Promise.all([productApi.list(), categoryApi.list()]);
      setProducts(productList);
      setCategories(categoryList);
      setError(undefined);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const openForm = (product?: Product) => { setEditingProduct(product); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditingProduct(undefined); };

  const handleSubmit = async (input: ProductInput) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) await productApi.update(editingProduct.id, input);
      else await productApi.create(input);
      closeForm();
      await loadData();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    try {
      await productApi.remove(product.id);
      await loadData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <p className="panel-label">Catalogue</p>
          <h1>Products</h1>
        </div>
        <Button onClick={() => openForm()}>+ Add Product</Button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {isLoading ? <p>Loading products…</p> : <ProductTable products={products} categoryNames={categoryNames} onEdit={openForm} onDelete={handleDelete} />}
      <Modal isOpen={isFormOpen} title={editingProduct ? 'Edit Product' : 'Add Product'} onClose={closeForm}>
        <ProductForm categories={categories} initialProduct={editingProduct} isSubmitting={isSubmitting} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>
    </section>
  );
}
