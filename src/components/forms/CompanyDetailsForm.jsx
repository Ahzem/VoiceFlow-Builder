import React from 'react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Textarea from '../common/Textarea.jsx';
import { INDUSTRIES, MAX_DESCRIPTION_LENGTH } from '../../utils/constants.js';

const CompanyDetailsForm = ({ formData, errors, updateField }) => {
  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '500+ employees' }
  ];

  // SVG Icons for visual enhancement
  const BuildingIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12h4"/>
      <path d="M6 16h4"/>
      <path d="M16 6h2"/>
      <path d="M16 10h2"/>
      <path d="M16 14h2"/>
      <path d="M16 18h2"/>
    </svg>
  );

  const PhoneIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const MapPinIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const UsersIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );

  const BriefcaseIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );

  return (
    <div className="enhanced-form-section">
      <div className="form-section-header">
        <div className="section-icon">
          <BuildingIcon size={24} />
        </div>
        <div className="section-title-content">
          <h2 className="form-section-title">Tell us about your business</h2>
          <p className="form-section-subtitle">
            Help us understand your company so we can create the perfect voice assistant for your needs
          </p>
        </div>
      </div>

      {/* Basic Company Information */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <BuildingIcon size={18} />
          Basic Information
        </h3>
        
        <div className="form-row">
          <Input
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder="Enter your company name"
            required
            error={errors.companyName}
            icon={<BuildingIcon size={16} />}
          />
          
          <Input
            label="Company Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
            error={errors.phoneNumber}
            help="This will be used for customer callbacks and verification"
            icon={<PhoneIcon size={16} />}
          />
        </div>

        <div className="form-row">
          <Select
            label="Industry"
            value={formData.industry}
            onChange={(e) => updateField('industry', e.target.value)}
            options={INDUSTRIES}
            placeholder="Select your industry"
            required
            error={errors.industry}
            icon={<BriefcaseIcon size={16} />}
          />
          
          <Select
            label="Company Size"
            value={formData.companySize}
            onChange={(e) => updateField('companySize', e.target.value)}
            options={companySizeOptions}
            placeholder="Select company size"
            required
            error={errors.companySize}
            icon={<UsersIcon size={16} />}
          />
        </div>

        <div className="form-row single">
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="City, State/Country (e.g., New York, NY, USA)"
            required
            error={errors.location}
            help="This helps with timezone settings and local context"
            icon={<MapPinIcon size={16} />}
          />
        </div>
      </div>

      {/* Business Description */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <BriefcaseIcon size={18} />
          Business Details
        </h3>
        
        <div className="form-row single">
          <Textarea
            label="Business Description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe what your business does, your mission, and key values. This helps us personalize your assistant's responses..."
            maxLength={MAX_DESCRIPTION_LENGTH}
            showCharCount
            required
            error={errors.description}
            help="Be specific about your business model, values, and what makes you unique"
            rows={4}
          />
        </div>

        <div className="form-row">
          <Textarea
            label="Primary Services/Products"
            value={formData.services}
            onChange={(e) => updateField('services', e.target.value)}
            placeholder="List your main services or products. Be specific about what you offer to customers..."
            rows={4}
            required
            error={errors.services}
            help="Include pricing tiers, packages, or service categories if applicable"
          />
          
          <Textarea
            label="Target Audience"
            value={formData.targetAudience}
            onChange={(e) => updateField('targetAudience', e.target.value)}
            placeholder="Describe your typical customers, their demographics, needs, and pain points..."
            rows={4}
            required
            error={errors.targetAudience}
            help="Understanding your audience helps tailor the assistant's communication style"
          />
        </div>
      </div>

      {/* Success Tips */}
      <div className="form-tips-card">
        <div className="tips-header">
          <div className="tips-icon">💡</div>
          <h4>Tips for Better Results</h4>
        </div>
        <ul className="tips-list">
          <li>
            <strong>Be specific:</strong> The more details you provide, the better your assistant will understand your business
          </li>
          <li>
            <strong>Include keywords:</strong> Mention industry-specific terms your customers might use
          </li>
          <li>
            <strong>Think about tone:</strong> Consider how you want your brand to sound to customers
          </li>
          <li>
            <strong>Phone format:</strong> Use international format for better compatibility (+1 for US/Canada)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyDetailsForm; 