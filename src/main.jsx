import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toast } from './utils/Toast.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <App />
      <Toast />
    </AuthProvider>
)
