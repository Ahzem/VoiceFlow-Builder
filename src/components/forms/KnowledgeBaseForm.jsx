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

  // SVG Check Icon
  const CheckIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );

  return (
    <div className="form-section">
      <h2 className="form-section-title">Knowledge Base & Privacy Settings</h2>
      
      <div className="form-section">
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Upload Knowledge Base Files
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-md)' }}>
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
        >
          <div className="form-help">
            <CheckIcon size={14} /> Upload documents, PDFs, or text files that contain information about your business
          </div>
        </SimpleFileUpload>
      </div>

      <div className="form-section">
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Restricted Topics
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-md)' }}>
          Select topics that your assistant should NOT discuss with customers
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

      <div className="form-row">
        <Textarea
          label="Custom Restrictions"
          value={formData.customRestrictions}
          onChange={(e) => updateField('customRestrictions', e.target.value)}
          placeholder="Add any specific topics or information your assistant should avoid discussing..."
          rows={4}
          help="Be specific about what should not be shared"
        />
        
        <Select
          label="Confidentiality Level"
          value={formData.confidentialityLevel}
          onChange={(e) => updateField('confidentialityLevel', e.target.value)}
          options={confidentialityOptions}
          help="This affects how cautious your assistant will be with information"
        />
      </div>

      <div className="card" style={{ 
        background: 'rgba(56, 161, 105, 0.1)', 
        border: '1px solid rgba(56, 161, 105, 0.2)',
        marginTop: 'var(--spacing-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            background: 'var(--accent-success-green)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            <CheckIcon size={14} />
          </div>
          <div>
            <h4 style={{ 
              color: 'var(--accent-success-green)', 
              marginBottom: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-base)'
            }}>
              Privacy & Security
            </h4>
            <p style={{ 
              color: 'var(--text-medium-gray)', 
              fontSize: 'var(--font-size-sm)',
              margin: 0
            }}>
              Your uploaded documents are encrypted and stored securely. Your assistant will only 
              share information that you've explicitly allowed and will respect all restrictions you've set.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseForm; 