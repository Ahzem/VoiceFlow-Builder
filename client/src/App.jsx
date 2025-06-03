import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import FormWizard from './pages/FormWizard.jsx'
import CallApp from './pages/CallApp.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import './styles/globals.css'
import './styles/pages.css'
import './styles/components.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={<Landing />} 
          />
          
          {/* Form Wizard */}
          <Route 
            path="/wizard" 
            element={<FormWizard />} 
          />
          
          {/* Call App */}
          <Route 
            path="/call" 
            element={<CallApp />} 
          />
          
          {/* OAuth Callback */}
          <Route 
            path="/oauth-callback" 
            element={<OAuthCallback />} 
          />
          
          {/* Redirect any unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
