
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import Router from './routes/routes';
import './index.css'
import AuthProvider from './context/AuthContext';
import {  CountProvider } from './context/countContext';



createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
      <CountProvider>
        <RouterProvider router= {Router} >

    </RouterProvider>
    </CountProvider>

    </AuthProvider>


  </StrictMode>,
)