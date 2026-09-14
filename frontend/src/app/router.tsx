import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { POSPage } from '../features/pos/pages/POSPage';

export const router = createBrowserRouter([
  { path: '/', element: <AppLayout />, children: [{ index: true, element: <POSPage /> }] },
]);
