import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AuthWrapper from './AuthWrapper'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthWrapper allowGuest={true}>
        {({ session, supabase }) => <App session={session} supabase={supabase} />}
      </AuthWrapper>
    </BrowserRouter>
  </StrictMode>
)
