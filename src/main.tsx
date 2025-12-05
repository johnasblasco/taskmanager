import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/context/AuthContext.tsx";
import { LoaderProvider } from "@/context/LoaderContext.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoaderProvider>
          <App />
        </LoaderProvider>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
