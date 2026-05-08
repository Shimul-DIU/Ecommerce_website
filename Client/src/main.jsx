
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminRoute from './admin/routes/AdminRoute';
import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router= {AdminRoute,} >

    </RouterProvider>
  </StrictMode>,
)