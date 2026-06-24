
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import Router from './routes/routes';
import './index.css'
import AuthProvider from './context/AuthContext';



createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
        <RouterProvider router= {Router} >

    </RouterProvider>

    </AuthProvider>


  </StrictMode>,
)