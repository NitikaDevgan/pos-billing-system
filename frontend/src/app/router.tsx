import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { AppLayout } from '../layouts/AppLayout';
import { RequireAdmin } from '../features/auth/components/RequireAdmin';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { CategoryManagementPage } from '../features/categories/pages/CategoryManagementPage';
import { POSPage } from '../features/pos/pages/POSPage';
import { ProductManagementPage } from '../features/products/pages/ProductManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <POSPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'admin',
        element: <RequireAdmin><AdminLayout /></RequireAdmin>,
        children: [
          { index: true, element: <Navigate to="products" replace /> },
          { path: 'categories', element: <CategoryManagementPage /> },
          { path: 'products', element: <ProductManagementPage /> },
        ],
      },
    ],
  },
]);
