import React from 'react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import { APPOINTMENT_DURATIONS, WEBHOOK_URL } from '../../utils/constants.js';

const IntegrationSettingsForm = ({ formData, errors, updateField }) => {
  // SVG Check Icon
  const CheckIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );
  return (
    <div className="form-section">
      <h2 className="form-section-title">Integration & Calendar Settings</h2>
      
      <div className="form-section">
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Webhook Configuration
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-md)' }}>
          This webhook URL will receive data when your assistant is created and configured.
        </p>
        
        <div className="webhook-info">
          <Input
            label="Webhook URL"
            value={WEBHOOK_URL}
            onChange={(e) => updateField('webhookUrl', e.target.value)}
            placeholder="https://your-webhook-url.com/endpoint"
            error={errors.webhookUrl}
            help="This endpoint will receive your assistant configuration data"
            disabled={true}
          />
          <div style={{ 
            marginTop: 'var(--spacing-sm)', 
            padding: 'var(--spacing-sm)', 
            background: 'rgba(49, 130, 206, 0.1)', 
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--primary-vibrant-blue)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <CheckIcon size={14} /> Configured to send data to n8n.cloud webhook
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Calendar Integration
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-md)' }}>
          Configure how your assistant handles appointment scheduling
        </p>
        
        <div className="form-row">
          <Select
            label="Default Appointment Duration"
            value={formData.appointmentDuration}
            onChange={(e) => updateField('appointmentDuration', parseInt(e.target.value))}
            options={APPOINTMENT_DURATIONS}
            required
            error={errors.appointmentDuration}
            help="This can be customized per appointment type later"
          />
          
          <Input
            label="Buffer Time (minutes)"
            type="number"
            value={formData.bufferTime}
            onChange={(e) => updateField('bufferTime', parseInt(e.target.value))}
            placeholder="15"
            min="0"
            max="60"
            error={errors.bufferTime}
            help="Time between appointments to avoid scheduling conflicts"
          />
        </div>

        <div className="form-group">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={formData.calendarIntegration}
              onChange={(e) => updateField('calendarIntegration', e.target.checked)}
            />
            <span style={{ marginLeft: 'var(--spacing-sm)' }}>
              Enable Google Calendar integration for appointment scheduling
            </span>
          </label>
          <div className="form-help">
            When enabled, your assistant can check availability and book appointments directly in your Google Calendar
          </div>
        </div>
      </div>

      <div className="card" style={{ 
        background: 'rgba(49, 130, 206, 0.1)', 
        border: '1px solid rgba(49, 130, 206, 0.2)',
        marginTop: 'var(--spacing-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            background: 'var(--primary-vibrant-blue)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            i
          </div>
          <div>
            <h4 style={{ 
              color: 'var(--primary-vibrant-blue)', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-base)'
            }}>
              Next Steps
            </h4>
            <p style={{ 
              color: 'var(--text-medium-gray)', 
              fontSize: 'var(--font-size-sm)',
              margin: 0,
              marginBottom: 'var(--spacing-sm)'
            }}>
              After clicking "Create Assistant", you'll be redirected to Google to authorize calendar access. 
              Once authorized, your voice assistant will be created and ready for testing.
            </p>
            <div style={{
              padding: 'var(--spacing-sm)',
              background: 'rgba(56, 161, 105, 0.1)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--accent-success-green)',
              fontFamily: 'monospace'
            }}>
              OAuth URL: accounts.google.com/o/oauth2/v2/auth
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Summary
        </h3>
        <div style={{ 
          background: 'var(--secondary-light-gray)', 
          padding: 'var(--spacing-md)', 
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-medium-gray)'
        }}>
          <p><strong>Company:</strong> {formData.companyName || 'Not specified'}</p>
          <p><strong>Assistant:</strong> {formData.assistantName || 'Not specified'}</p>
          <p><strong>Industry:</strong> {formData.industry || 'Not specified'}</p>
          <p><strong>Language:</strong> {formData.language || 'Not specified'}</p>
          <p><strong>Working Days:</strong> {formData.workingDays?.length ? formData.workingDays.join(', ') : 'Not specified'}</p>
          <p><strong>Knowledge Files:</strong> {formData.knowledgeFiles?.length || 0} files uploaded</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettingsForm; 