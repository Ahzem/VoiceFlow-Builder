import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a stored redirect URL
    const redirectUrl = localStorage.getItem('voiceflow_redirect_url');
    
    if (redirectUrl) {
      // Clean up localStorage
      localStorage.removeItem('voiceflow_redirect_url');
      
      // Redirect to the call app
      navigate(redirectUrl);
    } else {
      // Fallback: try to get assistant ID from submission data
      const submissionData = localStorage.getItem('voiceflow_submission');
      
      if (submissionData) {
        try {
          const data = JSON.parse(submissionData);
          const assistantId = data.webhookResponse?.assistantId;
          const formData = data.formData;
          
          if (assistantId && formData) {
            const callAppUrl = `/call?assistantId=${assistantId}&companyName=${encodeURIComponent(formData.companyName || '')}&assistantName=${encodeURIComponent(formData.assistantName || '')}&personality=${encodeURIComponent(formData.personality || '')}&language=${encodeURIComponent(formData.language || '')}`;
            navigate(callAppUrl);
            return;
          }
        } catch (error) {
          console.error('Error parsing submission data:', error);
        }
      }
      
      // If no data found, redirect to home
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="call-app">
      <div className="container">
        <div className="call-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <h2>Setting up your voice assistant...</h2>
            <p>Please wait while we complete the setup process.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback; 