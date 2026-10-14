import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import Router from './routes/routes'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { CountProvider } from './context/CountContext'
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CountProvider>
        <LanguageProvider>
          <RouterProvider router={Router} />
        </LanguageProvider>
      </CountProvider>
    </AuthProvider>
  </StrictMode>
)