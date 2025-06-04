import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import FormWizard from './pages/FormWizard.jsx'
import CallChatApp from './pages/CallChatApp.jsx'
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
          
          {/* Unified Call/Chat App */}
          <Route 
            path="/call" 
            element={<CallChatApp />} 
          />
          
          {/* Chat route also points to unified app */}
          <Route 
            path="/chat" 
            element={<CallChatApp />} 
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
