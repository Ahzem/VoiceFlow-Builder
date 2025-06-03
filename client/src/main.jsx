import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Filter out Grammarly console noise
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('Grammarly')) {
    return; // Ignore Grammarly errors
  }
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
