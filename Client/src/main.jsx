
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminRouter from './admin/routes/AdminRoute';
import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider adminRouter= {AdminRouter} >

    </RouterProvider>
  </StrictMode>,
)