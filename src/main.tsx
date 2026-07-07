import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CustomerProvider } from './context/CustomerContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomerProvider>
      <App />
    </CustomerProvider>
  </StrictMode>,
)
