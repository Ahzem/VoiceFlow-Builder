import React from 'react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import { APPOINTMENT_DURATIONS, WEBHOOK_URL } from '../../utils/constants.js';

const IntegrationSettingsForm = ({ formData, errors, updateField }) => {
  // SVG Icons for visual enhancement
  const SettingsIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );

  const LinkIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );

  const CalendarIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const ClockIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  );

  const CheckCircleIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
  );

  const InfoIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );

  const FileTextIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  );

  const CheckIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );

  return (
    <div className="enhanced-form-section">
      <div className="form-section-header">
        <div className="section-icon">
          <SettingsIcon size={24} />
        </div>
        <div className="section-title-content">
          <h2 className="form-section-title">Integration & Calendar Settings</h2>
          <p className="form-section-subtitle">
            Configure webhook endpoints and calendar integration to connect your assistant with your existing business systems
          </p>
        </div>
      </div>

      {/* Webhook Configuration */}
      {/* <div className="form-subsection">
        <h3 className="subsection-title">
          <LinkIcon size={18} />
          Webhook Configuration
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
          This webhook URL will receive data when your assistant is created and configured, enabling seamless integration with your systems.
        </p>
        
        <div className="form-group">
          <label className="form-label">Webhook URL</label>
          <div className="input-wrapper">
            <div className="input-icon">
              <LinkIcon size={16} />
            </div>
            <Input
              value={WEBHOOK_URL}
              onChange={(e) => updateField('webhookUrl', e.target.value)}
              placeholder="https://your-webhook-url.com/endpoint"
              error={errors.webhookUrl}
              disabled={true}
              className="with-icon"
            />
          </div>
          <div className="form-help">
            This endpoint will receive your assistant configuration data
          </div>
          <div style={{ 
            marginTop: 'var(--spacing-sm)', 
            padding: 'var(--spacing-sm)', 
            background: 'rgba(49, 130, 206, 0.1)', 
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--primary-vibrant-blue)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            border: '1px solid rgba(49, 130, 206, 0.2)'
          }}>
            <CheckIcon size={14} /> Configured to send data to n8n.cloud webhook
          </div>
        </div>
      </div> */}

      {/* Calendar Integration */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <CalendarIcon size={18} />
          Calendar Integration
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
          Configure how your assistant handles appointment scheduling and calendar management
        </p>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Default Appointment Duration</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <ClockIcon size={16} />
              </div>
              <Select
                value={formData.appointmentDuration}
                onChange={(e) => updateField('appointmentDuration', parseInt(e.target.value))}
                options={APPOINTMENT_DURATIONS}
                required
                error={errors.appointmentDuration}
                className="with-icon"
                placeholder="Select duration"
              />
            </div>
            <div className="form-help">
              This can be customized per appointment type later
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Buffer Time (minutes)</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <ClockIcon size={16} />
              </div>
              <Input
                type="number"
                value={formData.bufferTime}
                onChange={(e) => updateField('bufferTime', parseInt(e.target.value))}
                placeholder="15"
                min="0"
                max="60"
                error={errors.bufferTime}
                className="with-icon"
              />
            </div>
            <div className="form-help">
              Time between appointments to avoid scheduling conflicts
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={formData.calendarIntegration}
              onChange={(e) => updateField('calendarIntegration', e.target.checked)}
            />
            <span style={{ marginLeft: 'var(--spacing-sm)', fontWeight: '500' }}>
              Enable Google Calendar integration for appointment scheduling
            </span>
          </label>
          <div className="form-help">
            When enabled, your assistant can check availability and book appointments directly in your Google Calendar
          </div>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <FileTextIcon size={18} />
          Configuration Summary
        </h3>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(49, 130, 206, 0.05), rgba(26, 54, 93, 0.02))', 
          padding: 'var(--spacing-xl)', 
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-sm)',
          border: '1px solid rgba(49, 130, 206, 0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div>
              <p style={{ margin: '0 0 var(--spacing-xs) 0' }}><strong>Company:</strong> {formData.companyName || 'Not specified'}</p>
              <p style={{ margin: '0 0 var(--spacing-xs) 0' }}><strong>Assistant:</strong> {formData.assistantName || 'Not specified'}</p>
              <p style={{ margin: '0 0 var(--spacing-xs) 0' }}><strong>Industry:</strong> {formData.industry || 'Not specified'}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 var(--spacing-xs) 0' }}><strong>Language:</strong> {formData.language || 'Not specified'}</p>
              <p style={{ margin: '0 0 var(--spacing-xs) 0' }}><strong>Working Days:</strong> {formData.workingDays?.length ? formData.workingDays.join(', ') : 'Not specified'}</p>
              <p style={{ margin: '0 0 var(--spacing-xs) 0' }}><strong>Knowledge Files:</strong> {formData.knowledgeFiles?.length || 0} files uploaded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Information */}
      <div className="form-tips-card">
        <div className="tips-header">
          <div className="tips-icon">🚀</div>
          <h4>Next Steps & Integration</h4>
        </div>
        <ul className="tips-list">
          <li>
            <strong>Google OAuth:</strong> After clicking "Create Assistant", you'll be redirected to Google for calendar authorization
          </li>
          <li>
            <strong>Assistant Creation:</strong> Your voice assistant will be automatically created with all your configurations
          </li>
          <li>
            <strong>Webhook Delivery:</strong> Configuration data will be sent to your webhook endpoint for processing
          </li>
          <li>
            <strong>Testing Ready:</strong> Once created, you'll be able to test your assistant immediately
          </li>
          <li>
            <strong>Live Deployment:</strong> Your assistant will be ready for customer interactions right away
          </li>
        </ul>
        
        <div style={{
          marginTop: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          background: 'rgba(56, 161, 105, 0.1)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--accent-success-green)',
          fontFamily: 'monospace',
          border: '1px solid rgba(56, 161, 105, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)'
        }}>
          <CheckCircleIcon size={14} />
          OAuth URL: accounts.google.com/o/oauth2/v2/auth
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettingsForm; 