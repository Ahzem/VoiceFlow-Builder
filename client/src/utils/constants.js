// API Configuration
export const WEBHOOK_URL = 'https://builderbid.app.n8n.cloud/webhook/vapi-create-assistant';

// VAPI Configuration
// Use the private API key for server-side operations (listing assistants, etc.)
// Public key is used for client-side voice calls
export const VAPI_API_KEY = import.meta.env.VITE_VAPI_PRIVATE_KEY || import.meta.env.VITE_VAPI_API_KEY || '352c1d8e-4ccb-4549-b8d1-3c8ebf39f3cb';
export const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || '2588f020-c27b-4f60-8425-c47f4954174b';

// Form Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['.pdf', '.docx', '.txt'];
export const MAX_DESCRIPTION_LENGTH = 500;

// Business Industries
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Real Estate',
  'Legal',
  'Consulting',
  'Manufacturing',
  'Hospitality',
  'Other'
];

// Assistant Personalities
export const PERSONALITY_TYPES = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' }
];

// Languages
export const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' }
];

// Appointment Durations
export const APPOINTMENT_DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' }
];

// Common Restricted Topics
export const COMMON_RESTRICTIONS = [
  'Pricing information',
  'Competitor information',
  'Internal processes',
  'Financial details',
  'Personal employee information',
  'Confidential client data'
];

// Working Days
export const WORKING_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]; 