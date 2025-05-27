import axios from 'axios';
import { WEBHOOK_URL } from './constants.js';

// Updated Google OAuth URL to redirect to our callback page
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=21730255323-t9jt8h5ifj5di20g0i7iobkhvemt0bif.apps.googleusercontent.com&redirect_uri=' + encodeURIComponent(window.location.origin + '/oauth-callback') + '&response_type=code&scope=https://www.googleapis.com/auth/calendar+https://www.googleapis.com/auth/calendar.events+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent';

// Submit form data to webhook
export const submitFormData = async (formData, files) => {
  try {
    // Prepare the payload as JSON
    const payload = {
      // Company Details
      companyName: formData.companyName,
      industry: formData.industry,
      description: formData.description,
      services: formData.services,
      targetAudience: formData.targetAudience,
      companySize: formData.companySize,
      location: formData.location,
      
      // Assistant Configuration
      assistantName: formData.assistantName,
      personality: formData.personality,
      language: formData.language,
      workingHours: formData.workingHours,
      workingDays: formData.workingDays,
      
      // Knowledge Base & Restrictions
      knowledgeFiles: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      })),
      commonRestrictions: formData.commonRestrictions,
      customRestrictions: formData.customRestrictions,
      confidentialityLevel: formData.confidentialityLevel,
      
      // Integration Settings
      webhookUrl: formData.webhookUrl || WEBHOOK_URL,
      appointmentDuration: formData.appointmentDuration,
      bufferTime: formData.bufferTime,
      calendarIntegration: formData.calendarIntegration,
      
      // Metadata
      submittedAt: new Date().toISOString(),
      totalFiles: files.length,
      
      // Note: If you're getting MongoDB credential errors in n8n,
      // check the credential sharing settings or recreate the credential
      note: "Data submitted successfully - check n8n workflow for MongoDB credential access"
    };
    
    console.log('Submitting payload to webhook:', payload);
    
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    console.log('Webhook response:', response.data);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error submitting form data:', error);
    
    let errorMessage = 'Failed to submit form data';
    
    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      console.error('Server response:', error.response.data);
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      errorMessage = 'Request timeout. Please try again.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Initiate Google OAuth flow
export const initiateGoogleAuth = () => {
  try {
    // Store current form data in localStorage before redirect
    const currentData = {
      timestamp: Date.now(),
      redirectUrl: window.location.href
    };
    localStorage.setItem('voiceflow_auth_data', JSON.stringify(currentData));
    
    // Redirect to Google OAuth
    window.location.href = GOOGLE_AUTH_URL;
  } catch (error) {
    console.error('Error initiating Google auth:', error);
    throw new Error('Failed to initiate Google authentication');
  }
};

// Handle OAuth callback
export const handleAuthCallback = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    // Retrieve stored data
    const storedData = localStorage.getItem('voiceflow_auth_data');
    if (storedData) {
      const authData = JSON.parse(storedData);
      localStorage.removeItem('voiceflow_auth_data');
      
      return {
        success: true,
        code,
        storedData: authData
      };
    }
    
    return {
      success: true,
      code
    };
  } catch (error) {
    console.error('Error handling auth callback:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Upload file with progress tracking
export const uploadFileWithProgress = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}; 