import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthWrapper from './AuthWrapper'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthWrapper>
      {({ session, supabase }) => (
        <App session={session} supabase={supabase} />
      )}
    </AuthWrapper>
  </StrictMode>
)