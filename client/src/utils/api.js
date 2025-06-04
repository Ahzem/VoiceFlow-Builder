import axios from 'axios';
import { WEBHOOK_URL, VAPI_API_KEY } from './constants.js';

// Updated Google OAuth URL to redirect to our callback page
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=21730255323-t9jt8h5ifj5di20g0i7iobkhvemt0bif.apps.googleusercontent.com&redirect_uri=' + encodeURIComponent(window.location.origin + '/oauth-callback') + '&response_type=code&scope=https://www.googleapis.com/auth/calendar+https://www.googleapis.com/auth/calendar.events+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent';

// VAPI API Base URL
const VAPI_API_BASE = 'https://api.vapi.ai';

// Fetch assistants from VAPI API
export const fetchVapiAssistants = async () => {
  try {
    console.log('Fetching assistants from VAPI...');
    
    if (!VAPI_API_KEY) {
      console.warn('VAPI API key not configured. Please set VITE_VAPI_API_KEY in your environment variables.');
      return {
        success: false,
        error: 'VAPI API key not configured',
        assistants: []
      };
    }

    const response = await axios.get(`${VAPI_API_BASE}/assistant`, {
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds timeout
    });

    console.log('VAPI assistants response:', response.data);

    // Transform VAPI assistant data to match our UI format
    const transformedAssistants = response.data.map(assistant => {
      // Extract company name from multiple possible sources
      const extractedCompanyName = 
        assistant.metadata?.companyName ||
        assistant.name?.split(' - ')[0] || // If name format is "Company - Assistant"
        assistant.name?.split(' for ')[1] || // If name format is "Assistant for Company"
        assistant.firstMessage?.match(/(?:from|at|representing|with)\s+([A-Z][a-zA-Z\s&.,-]+?)(?:\.|!|\?|,|$)/i)?.[1]?.trim() ||
        assistant.name?.match(/^([A-Z][a-zA-Z\s&.,-]+?)\s+(Assistant|AI|Bot|Support)$/i)?.[1] ||
        'Unknown Company';

      // Extract assistant personality from name or metadata
      const extractedPersonality = 
        assistant.metadata?.personality ||
        (assistant.name?.toLowerCase().includes('professional') ? 'professional' :
         assistant.name?.toLowerCase().includes('friendly') ? 'friendly' :
         assistant.name?.toLowerCase().includes('casual') ? 'casual' :
         assistant.name?.toLowerCase().includes('formal') ? 'formal' : 'professional');

      // Extract industry from metadata or infer from context
      const extractedIndustry = 
        assistant.metadata?.industry ||
        assistant.knowledgeBase?.find(kb => kb.name?.includes('industry'))?.content ||
        'General';

      return {
        id: assistant.id,
        name: assistant.name || 'Unnamed Assistant',
        companyName: extractedCompanyName,
        personality: extractedPersonality,
        language: assistant.transcriber?.language || assistant.voice?.voice || 'en',
        industry: extractedIndustry,
        status: 'active', // VAPI assistants are active by default
        createdAt: assistant.createdAt ? new Date(assistant.createdAt).toLocaleDateString() : 'Unknown',
        updatedAt: assistant.updatedAt ? new Date(assistant.updatedAt).toLocaleDateString() : 'Unknown',
        firstMessage: assistant.firstMessage || 'Hello! How can I help you today?',
        voice: {
          provider: assistant.voice?.provider || 'unknown',
          voiceId: assistant.voice?.voiceId || assistant.voice?.voice || 'unknown'
        },
        model: {
          provider: assistant.model?.provider || 'unknown',
          model: assistant.model?.model || 'unknown'
        },
        // Enhanced metadata extraction
        metadata: {
          companyName: extractedCompanyName,
          personality: extractedPersonality,
          industry: extractedIndustry,
          ...assistant.metadata
        },
        // Additional metadata from VAPI
        orgId: assistant.orgId,
        vapiData: assistant // Store original VAPI data for reference
      };
    });

    return {
      success: true,
      assistants: transformedAssistants,
      total: transformedAssistants.length
    };

  } catch (error) {
    console.error('Error fetching VAPI assistants:', error);
    
    let errorMessage = 'Failed to fetch assistants from VAPI';
    
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        errorMessage = 'Invalid VAPI API key. Please check your credentials.';
      } else if (error.response.status === 403) {
        errorMessage = 'Access denied. Please check your VAPI API permissions.';
      } else {
        errorMessage = error.response.data?.message || `VAPI API error: ${error.response.status}`;
      }
      console.error('VAPI API response:', error.response.data);
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      errorMessage = 'Request timeout. VAPI API may be slow, please try again.';
    }

    return {
      success: false,
      error: errorMessage,
      assistants: []
    };
  }
};

// Get a specific assistant from VAPI
export const fetchVapiAssistant = async (assistantId) => {
  try {
    console.log(`Fetching assistant ${assistantId} from VAPI...`);
    
    if (!VAPI_API_KEY || VAPI_API_KEY === 'your-vapi-api-key') {
      throw new Error('VAPI API key not configured');
    }

    const response = await axios.get(`${VAPI_API_BASE}/assistant/${assistantId}`, {
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('VAPI assistant response:', response.data);
    return {
      success: true,
      assistant: response.data
    };

  } catch (error) {
    console.error('Error fetching VAPI assistant:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Submit form data to webhook
export const submitFormData = async (formData, files, onProgress = null) => {
  try {
    // Convert files to base64 with progress tracking
    if (onProgress) onProgress({ stage: 'processing', message: 'Processing uploaded files...', progress: 0 });
    
    const processedFiles = await Promise.all(
      files.map(async (file, index) => {
        try {
          if (onProgress) {
            onProgress({ 
              stage: 'processing', 
              message: `Processing file: ${file.name}`, 
              progress: (index / files.length) * 50 // First 50% for file processing
            });
          }
          
          const base64Content = await fileToBase64(file);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            content: base64Content, // This includes the data:mime/type;base64, prefix
            // Extract just the base64 data without the prefix for easier processing
            base64Data: base64Content.split(',')[1]
          };
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            error: 'Failed to process file content'
          };
        }
      })
    );

    if (onProgress) onProgress({ stage: 'uploading', message: 'Uploading data to webhook...', progress: 75 });

    // Prepare the form data object (to be stringified)
    const formDataObject = {
      // Company Details
      companyName: formData.companyName,
      companyWebsite: formData.companyWebsite,
      phoneNumber: formData.phoneNumber,
      contactEmail: formData.contactEmail,
      industry: formData.industry,
      description: formData.description,
      services: formData.services,
      targetAudience: formData.targetAudience,
      companySize: formData.companySize,
      location: formData.location,
      
      // Company Policies
      refundPolicy: formData.refundPolicy,
      serviceGuarantees: formData.serviceGuarantees,
      companyPolicies: formData.companyPolicies,
      
      // Social Media Links
      facebookUrl: formData.facebookUrl,
      linkedinUrl: formData.linkedinUrl,
      twitterUrl: formData.twitterUrl,
      instagramUrl: formData.instagramUrl,
      otherSocialMedia: formData.otherSocialMedia,
      
      // Additional Information
      additionalInfo: formData.additionalInfo,
      
      // Assistant Configuration
      assistantName: formData.assistantName,
      personality: formData.personality,
      language: formData.language,
      workingHours: formData.workingHours,
      workingDays: formData.workingDays,
      
      // Knowledge Base & FAQs (without files - they'll be separate)
      frequentQuestions: formData.frequentQuestions,
      commonRestrictions: formData.commonRestrictions,
      customRestrictions: formData.customRestrictions,
      confidentialityLevel: formData.confidentialityLevel,
      
      // Integration Settings
      calendarEmail: formData.calendarEmail,
      webhookUrl: formData.webhookUrl || WEBHOOK_URL,
      appointmentDuration: formData.appointmentDuration,
      bufferTime: formData.bufferTime,
      calendarIntegration: formData.calendarIntegration,
      
      // Metadata
      submittedAt: new Date().toISOString(),
      totalFiles: files.length,
      totalFileSize: files.reduce((total, file) => total + file.size, 0),
      note: "Form data with binary files - check n8n workflow for MongoDB credential access"
    };

    // Create FormData object for multipart/form-data submission
    const formDataPayload = new FormData();
    
    // Add the stringified form data
    formDataPayload.append('formData', JSON.stringify(formDataObject));
    
    // Add file count
    formDataPayload.append('fileCount', files.length.toString());

    // Add file metadata and content as separate form fields
    processedFiles.forEach((file, index) => {
      // File metadata
      formDataPayload.append(`fileMetadata_${index}`, JSON.stringify({
        originalName: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      
      // File content (base64 with data URL prefix)
      formDataPayload.append(`fileContent_${index}`, file.content);
      
      // File content (base64 data only)
      formDataPayload.append(`fileBase64_${index}`, file.base64Data);
      
      // File error if any
      if (file.error) {
        formDataPayload.append(`fileError_${index}`, file.error);
      }
    });
    
    console.log('Submitting FormData to webhook:', {
      formDataLength: JSON.stringify(formDataObject).length,
      fileCount: files.length,
      totalFormDataEntries: Array.from(formDataPayload.keys()).length,
      formDataKeys: Array.from(formDataPayload.keys())
    });
    
    const response = await axios.post(WEBHOOK_URL, formDataPayload, {
      headers: {
        // Don't set Content-Type - let axios handle it for FormData
        // This will automatically set multipart/form-data with boundary
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    if (onProgress) onProgress({ stage: 'complete', message: 'Upload completed successfully!', progress: 100 });
    
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
    
    if (onProgress) onProgress({ stage: 'error', message: errorMessage, progress: 0 });
    
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