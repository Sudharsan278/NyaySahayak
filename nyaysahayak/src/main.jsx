import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='931548607064-kpqhjjcjgi9vg8k17hn46gm3o4f421us.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
