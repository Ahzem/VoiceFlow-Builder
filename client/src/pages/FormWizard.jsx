import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../hooks/useFormData.js';
import { submitFormData, initiateGoogleAuth } from '../utils/api.js';
import CompanyDetailsForm from '../components/forms/CompanyDetailsForm.jsx';
import AssistantConfigForm from '../components/forms/AssistantConfigForm.jsx';
import KnowledgeBaseForm from '../components/forms/KnowledgeBaseForm.jsx';
import IntegrationSettingsForm from '../components/forms/IntegrationSettingsForm.jsx';
import Button from '../components/common/Button.jsx';

const FormWizard = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    currentStep,
    updateField,
    updateFields,
    toggleInArray,
    nextStep,
    prevStep,
    getStepTitle,
    getCompletionPercentage
  } = useFormData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ stage: '', message: '', progress: 0 });

  const steps = [
    { title: 'Company Details', component: CompanyDetailsForm },
    { title: 'Assistant Configuration', component: AssistantConfigForm },
    { title: 'Knowledge Base & Restrictions', component: KnowledgeBaseForm },
    { title: 'Integration Settings', component: IntegrationSettingsForm }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/');
    } else {
      prevStep();
    }
  };

  const handleProgressUpdate = (progressData) => {
    setUploadProgress(progressData);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setUploadProgress({ stage: 'starting', message: 'Preparing submission...', progress: 0 });

    try {
      // Get files for submission
      const files = formData.knowledgeFiles || [];
      
      console.log('Starting form submission...');
      console.log('Form data:', formData);
      console.log('Files:', files);
      
      // Submit form data to webhook with progress tracking
      const result = await submitFormData(formData, files, handleProgressUpdate);
      
      if (result.success) {
        console.log('Form submitted successfully, preparing Google OAuth...');
        setUploadProgress({ stage: 'oauth', message: 'Redirecting to Google Calendar setup...', progress: 100 });
        
        // Store submission data for reference including form data for the call app
        const submissionData = {
          timestamp: new Date().toISOString(),
          formData: formData,
          webhookResponse: result.data
        };
        
        localStorage.setItem('voiceflow_submission', JSON.stringify(submissionData));
        
        // Create the redirect URL for after OAuth
        const assistantId = result.data?.assistantId;
        if (assistantId) {
          const callAppUrl = `/call?assistantId=${assistantId}&companyName=${encodeURIComponent(formData.companyName || '')}&assistantName=${encodeURIComponent(formData.assistantName || '')}&personality=${encodeURIComponent(formData.personality || '')}&language=${encodeURIComponent(formData.language || '')}`;
          localStorage.setItem('voiceflow_redirect_url', callAppUrl);
        }
        
        // Small delay to ensure data is saved
        setTimeout(() => {
          // Initiate Google OAuth flow
          initiateGoogleAuth();
        }, 1000);
      } else {
        console.error('Form submission failed:', result.error);
        setSubmitError(result.error);
      }
    } catch (error) {
      console.error('Unexpected error during submission:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepComponent = steps[currentStep]?.component;

  return (
    <div className="form-wizard">
      <div className="container">
        <div className="wizard-container">
          <div className="wizard-header">
            <h1 className="wizard-title">Create Your Voice Assistant</h1>
            <p className="wizard-subtitle">
              Step {currentStep + 1} of {steps.length}: {getStepTitle(currentStep)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="wizard-progress">
            <div className="progress-wrapper">
              <div className="progress-header">
                <span className="progress-title">Progress</span>
                <span className="progress-percentage">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.round(((currentStep + 1) / steps.length) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className={`step-item ${
                  index < currentStep ? 'completed' : 
                  index === currentStep ? 'active' : 'pending'
                }`}>
                  <div className="step-number">{index + 1}</div>
                  <div className="step-title">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${index < currentStep ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form Content */}
          <div className="wizard-content">
            {isSubmitting && (
              <div className="submission-overlay">
                <div className="submission-content">
                  <div className="spinner-large"></div>
                  <h3>Creating Your Voice Assistant</h3>
                  <p>{uploadProgress.message || 'Processing your information...'}</p>
                  
                  {/* Progress Bar */}
                  <div className="upload-progress-container">
                    <div className="upload-progress-bar">
                      <div 
                        className="upload-progress-fill" 
                        style={{ width: `${uploadProgress.progress || 0}%` }}
                      />
                    </div>
                    <div className="upload-progress-text">
                      {uploadProgress.progress || 0}% Complete
                    </div>
                  </div>
                  
                  {/* Stage indicators */}
                  <div className="upload-stages">
                    <div className={`stage-item ${uploadProgress.stage === 'processing' ? 'active' : uploadProgress.progress > 50 ? 'completed' : ''}`}>
                      📄 Processing Files
                    </div>
                    <div className={`stage-item ${uploadProgress.stage === 'uploading' ? 'active' : uploadProgress.progress === 100 && uploadProgress.stage !== 'oauth' ? 'completed' : ''}`}>
                      ⬆️ Uploading Data
                    </div>
                    <div className={`stage-item ${uploadProgress.stage === 'oauth' ? 'active' : ''}`}>
                      🔗 Setting up Calendar
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {StepComponent && (
              <StepComponent
                formData={formData}
                errors={errors}
                updateField={updateField}
                updateFields={updateFields}
                toggleInArray={toggleInArray}
              />
            )}

            {submitError && (
              <div className="form-error" style={{ marginTop: 'var(--spacing-lg)' }}>
                {submitError}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="wizard-actions">
            <Button
              variant="secondary"
              onClick={handleBack}
            >
              {currentStep === 0 ? 'Back to Landing' : 'Previous'}
            </Button>

            <Button
              variant="primary"
              onClick={handleNext}
              loading={isSubmitting}
              disabled={isSubmitting}
              className={currentStep === steps.length - 1 ? 'btn-success' : ''}
            >
              {currentStep === steps.length - 1 ? (
                isSubmitting ? 'Creating Assistant...' : '🚀 Create Assistant & Connect Calendar'
              ) : 'Next Step →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormWizard; 