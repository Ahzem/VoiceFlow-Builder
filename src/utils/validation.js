import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, MAX_DESCRIPTION_LENGTH } from './constants.js';

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File validation
export const validateFile = (file) => {
  const errors = [];
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Check file type
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
    errors.push(`File type must be one of: ${ALLOWED_FILE_TYPES.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Company details validation
export const validateCompanyDetails = (data) => {
  const errors = {};
  
  if (!data.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }
  
  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!validatePhone(data.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number (e.g., +1 555-123-4567)';
  }
  
  if (!data.industry) {
    errors.industry = 'Industry selection is required';
  }
  
  if (!data.description?.trim()) {
    errors.description = 'Business description is required';
  } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  
  if (!data.services?.trim()) {
    errors.services = 'Primary services/products are required';
  }
  
  if (!data.targetAudience?.trim()) {
    errors.targetAudience = 'Target audience is required';
  }
  
  if (!data.companySize) {
    errors.companySize = 'Company size is required';
  }
  
  if (!data.location?.trim()) {
    errors.location = 'Location is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Assistant configuration validation
export const validateAssistantConfig = (data) => {
  const errors = {};
  
  if (!data.assistantName?.trim()) {
    errors.assistantName = 'Assistant name is required';
  }
  
  if (!data.personality) {
    errors.personality = 'Personality type is required';
  }
  
  if (!data.language) {
    errors.language = 'Language selection is required';
  }
  
  if (!data.workingHours?.start) {
    errors.workingHoursStart = 'Start time is required';
  }
  
  if (!data.workingHours?.end) {
    errors.workingHoursEnd = 'End time is required';
  }
  
  if (!data.workingHours?.timezone) {
    errors.timezone = 'Timezone is required';
  }
  
  if (!data.workingDays || data.workingDays.length === 0) {
    errors.workingDays = 'At least one working day must be selected';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Integration settings validation
export const validateIntegrationSettings = (data) => {
  const errors = {};
  
  if (data.webhookUrl && !validateURL(data.webhookUrl)) {
    errors.webhookUrl = 'Please enter a valid webhook URL';
  }
  
  if (!data.appointmentDuration) {
    errors.appointmentDuration = 'Appointment duration is required';
  }
  
  if (data.bufferTime && (data.bufferTime < 0 || data.bufferTime > 60)) {
    errors.bufferTime = 'Buffer time must be between 0 and 60 minutes';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Time validation helper
export const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  return start < end;
}; 