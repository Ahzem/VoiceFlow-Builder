import React from 'react';
import SimpleFileUpload from '../common/SimpleFileUpload.jsx';
import Textarea from '../common/Textarea.jsx';
import Select from '../common/Select.jsx';
import { COMMON_RESTRICTIONS } from '../../utils/constants.js';

const KnowledgeBaseForm = ({ formData, errors, updateField, toggleInArray }) => {
  const confidentialityOptions = [
    { value: 'low', label: 'Low - General business information' },
    { value: 'medium', label: 'Medium - Some sensitive data' },
    { value: 'high', label: 'High - Highly confidential information' }
  ];

  const handleFilesChange = (files) => {
    updateField('knowledgeFiles', files);
  };

  // SVG Icons for visual enhancement
  const DatabaseIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
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

  const ShieldIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  const AlertTriangleIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );

  const LockIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <circle cx="12" cy="16" r="1"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const HelpCircleIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
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
          <DatabaseIcon size={24} />
        </div>
        <div className="section-title-content">
          <h2 className="form-section-title">Knowledge Base & Privacy Settings</h2>
          <p className="form-section-subtitle">
            Upload your business documents and configure privacy settings to ensure your assistant provides accurate and secure information
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <HelpCircleIcon size={18} />
          Frequently Asked Questions (FAQs)
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
          What are the most common questions your customers ask? Providing FAQs helps your assistant give accurate, consistent answers.
        </p>
        
        <div className="form-row single">
          <Textarea
            label="Common Customer Questions & Answers"
            value={formData.frequentQuestions}
            onChange={(e) => updateField('frequentQuestions', e.target.value)}
            placeholder={`Please format as Question & Answer pairs, for example:

Q: What are your business hours?
A: We're open Monday through Friday from 9 AM to 6 PM EST, and Saturday from 10 AM to 4 PM EST. We're closed on Sundays.

Q: Do you offer free consultations?
A: Yes, we offer free 30-minute consultations for new clients. You can schedule one by calling us or booking online.

Q: What payment methods do you accept?
A: We accept all major credit cards, PayPal, bank transfers, and cash payments.`}
            rows={8}
            help="Include your most common customer questions with clear, accurate answers"
            error={errors.frequentQuestions}
          />
        </div>
      </div>

      {/* Knowledge Base Files */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <FileTextIcon size={18} />
          Knowledge Base Documents
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
          Upload documents that contain information about your business, services, policies, and FAQs. 
          Your assistant will use this information to answer customer questions accurately.
        </p>
        
        <SimpleFileUpload
          onFilesChange={handleFilesChange}
          value={formData.knowledgeFiles || []}
          label="Knowledge Base Documents"
          help="Supported formats: PDF, DOCX, TXT (max 10MB each)"
          accept=".pdf,.docx,.txt"
          multiple={true}
          required={true}
          error={errors.knowledgeFiles}
        />
      </div>

      {/* Restricted Topics */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <AlertTriangleIcon size={18} />
          Restricted Topics
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
          Select topics that your assistant should NOT discuss with customers to maintain professionalism and compliance
        </p>
        
        <div className="checkbox-group">
          {COMMON_RESTRICTIONS.map((restriction) => (
            <label key={restriction} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.commonRestrictions.includes(restriction)}
                onChange={() => toggleInArray('commonRestrictions', restriction)}
              />
              <span className="checkbox-label">{restriction}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <LockIcon size={18} />
          Privacy & Security Configuration
        </h3>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Custom Restrictions</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <AlertTriangleIcon size={16} />
              </div>
              <Textarea
                value={formData.customRestrictions}
                onChange={(e) => updateField('customRestrictions', e.target.value)}
                placeholder="Add any specific topics or information your assistant should avoid discussing..."
                rows={4}
                className="with-icon"
              />
            </div>
            <div className="form-help">
              Be specific about what should not be shared with customers
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label required">Confidentiality Level</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <ShieldIcon size={16} />
              </div>
              <Select
                value={formData.confidentialityLevel}
                onChange={(e) => updateField('confidentialityLevel', e.target.value)}
                options={confidentialityOptions}
                className="with-icon"
                placeholder="Select confidentiality level"
              />
            </div>
            <div className="form-help">
              This affects how cautious your assistant will be with information sharing
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="form-tips-card">
        <div className="tips-header">
          <div className="tips-icon">🔒</div>
          <h4>Privacy & Security Guarantee</h4>
        </div>
        <ul className="tips-list">
          <li>
            <strong>Encrypted Storage:</strong> All uploaded documents are encrypted and stored securely using industry-standard protocols
          </li>
          <li>
            <strong>Access Control:</strong> Your assistant will only share information that you've explicitly allowed and approved
          </li>
          <li>
            <strong>Restriction Compliance:</strong> All topic restrictions and privacy settings are strictly enforced during conversations
          </li>
          <li>
            <strong>Data Isolation:</strong> Your business data is completely isolated and never shared with other customers
          </li>
          <li>
            <strong>Audit Trail:</strong> All interactions are logged for security monitoring and compliance purposes
          </li>
          <li>
            <strong>FAQ Training:</strong> Your FAQs are used to train the assistant for consistent, accurate responses
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KnowledgeBaseForm; 