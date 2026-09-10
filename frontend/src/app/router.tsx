import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { WelcomePage } from '../routes/WelcomePage';
export const router = createBrowserRouter([{ path: '/', element: <AppLayout />, children: [{ index: true, element: <WelcomePage /> }] }]);
