import { useState, useCallback } from 'react';
import { 
  validateCompanyDetails, 
  validateAssistantConfig, 
  validateIntegrationSettings 
} from '../utils/validation.js';

export const useFormData = () => {
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    companyWebsite: '',
    phoneNumber: '',
    contactEmail: '',
    industry: '',
    description: '',
    services: '',
    targetAudience: '',
    companySize: '',
    location: '',
    businessHours: '',
    businessTimezone: '',
    
    // Company Policies
    refundPolicy: '',
    serviceGuarantees: '',
    companyPolicies: '',
    
    // Social Media Links
    facebookUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    otherSocialMedia: '',
    
    // Additional Information
    additionalInfo: '',
    
    // Assistant Configuration
    assistantName: '',
    personality: '',
    language: '',
    workingHours: {
      start: '',
      end: '',
      timezone: ''
    },
    workingDays: [],
    breakTimes: [],
    holidays: [],
    
    // Knowledge Base & FAQs
    knowledgeFiles: [],
    frequentQuestions: '',
    
    // Restricted Topics
    commonRestrictions: [],
    customRestrictions: '',
    confidentialityLevel: 'medium',
    
    // Integration Settings
    webhookUrl: '',
    appointmentDuration: 30,
    bufferTime: 15,
    calendarIntegration: true
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  // Update form field
  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      // Handle nested objects
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Update multiple fields at once
  const updateFields = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Add item to array field
  const addToArray = useCallback((field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  }, []);

  // Remove item from array field
  const removeFromArray = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  // Toggle item in array (for checkboxes)
  const toggleInArray = useCallback((field, item) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const exists = currentArray.includes(item);
      
      return {
        ...prev,
        [field]: exists 
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    let validation = { isValid: true, errors: {} };
    
    switch (currentStep) {
      case 0: // Company Details
        validation = validateCompanyDetails(formData);
        break;
      case 1: // Assistant Configuration
        validation = validateAssistantConfig(formData);
        break;
      case 2: // Knowledge Base & Restrictions
        // Basic validation for this step
        if (!formData.knowledgeFiles || formData.knowledgeFiles.length === 0) {
          validation.errors.knowledgeFiles = 'At least one knowledge base file is required';
          validation.isValid = false;
        }
        break;
      case 3: // Integration Settings
        validation = validateIntegrationSettings(formData);
        break;
      default:
        break;
    }
    
    setErrors(validation.errors);
    return validation.isValid;
  }, [currentStep, formData]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      return true;
    }
    return false;
  }, [validateCurrentStep]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setErrors({});
  }, []);

  // Go to specific step
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    setErrors({});
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      // Company Details
      companyName: '',
      companyWebsite: '',
      phoneNumber: '',
      contactEmail: '',
      industry: '',
      description: '',
      services: '',
      targetAudience: '',
      companySize: '',
      location: '',
      businessHours: '',
      businessTimezone: '',
      
      // Company Policies
      refundPolicy: '',
      serviceGuarantees: '',
      companyPolicies: '',
      
      // Social Media Links
      facebookUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      otherSocialMedia: '',
      
      // Additional Information
      additionalInfo: '',
      
      // Assistant Configuration
      assistantName: '',
      personality: '',
      language: '',
      workingHours: {
        start: '',
        end: '',
        timezone: ''
      },
      workingDays: [],
      breakTimes: [],
      holidays: [],
      
      // Knowledge Base & FAQs
      knowledgeFiles: [],
      frequentQuestions: '',
      
      // Restricted Topics
      commonRestrictions: [],
      customRestrictions: '',
      confidentialityLevel: 'medium',
      
      // Integration Settings
      webhookUrl: '',
      appointmentDuration: 30,
      bufferTime: 15,
      calendarIntegration: true
    });
    setErrors({});
    setCurrentStep(0);
  }, []);

  // Get form completion percentage
  const getCompletionPercentage = useCallback(() => {
    const totalSteps = 4;
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep]);

  // Check if form is complete
  const isFormComplete = useCallback(() => {
    return currentStep >= 3 && validateCurrentStep();
  }, [currentStep, validateCurrentStep]);

  // Get step titles
  const getStepTitle = useCallback((step) => {
    const titles = [
      'Company Details',
      'Assistant Configuration',
      'Knowledge Base & Restrictions',
      'Integration Settings'
    ];
    return titles[step] || '';
  }, []);

  return {
    formData,
    errors,
    currentStep,
    updateField,
    updateFields,
    addToArray,
    removeFromArray,
    toggleInArray,
    validateCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    getCompletionPercentage,
    isFormComplete,
    getStepTitle
  };
}; 