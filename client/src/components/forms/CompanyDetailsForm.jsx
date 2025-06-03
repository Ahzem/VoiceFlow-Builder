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

  const GlobeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );

  const ClockIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  );

  const ShareIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
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
            label="Company Website"
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => updateField('companyWebsite', e.target.value)}
            placeholder="https://www.yourcompany.com"
            error={errors.companyWebsite}
            help="Your company's main website URL"
            icon={<GlobeIcon size={16} />}
          />
        </div>

        <div className="form-row">
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
          
          <Input
            label="Support/Contact Email"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            placeholder="support@yourcompany.com"
            error={errors.contactEmail}
            help="Primary email for customer inquiries"
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

      {/* Company Policies */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <FileTextIcon size={18} />
          Company Policies
        </h3>
        
        <div className="form-row">
          <Textarea
            label="Refund/Return Policy"
            value={formData.refundPolicy}
            onChange={(e) => updateField('refundPolicy', e.target.value)}
            placeholder="Describe your refund, return, or cancellation policies..."
            rows={3}
            help="What should customers know about refunds or returns?"
          />
          
          <Textarea
            label="Service Guarantees"
            value={formData.serviceGuarantees}
            onChange={(e) => updateField('serviceGuarantees', e.target.value)}
            placeholder="Any guarantees, warranties, or service level commitments..."
            rows={3}
            help="What guarantees do you offer to customers?"
          />
        </div>

        <div className="form-row single">
          <Textarea
            label="Important Company Policies"
            value={formData.companyPolicies}
            onChange={(e) => updateField('companyPolicies', e.target.value)}
            placeholder="Privacy policy details, terms of service highlights, or other important policies customers should know about..."
            rows={3}
            help="Key policy information your assistant should be aware of"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <ShareIcon size={18} />
          Social Media & Online Presence
        </h3>
        
        <div className="form-row">
          <Input
            label="Facebook"
            value={formData.facebookUrl}
            onChange={(e) => updateField('facebookUrl', e.target.value)}
            placeholder="https://facebook.com/yourcompany"
            icon={<ShareIcon size={16} />}
          />
          
          <Input
            label="LinkedIn"
            value={formData.linkedinUrl}
            onChange={(e) => updateField('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/company/yourcompany"
            icon={<ShareIcon size={16} />}
          />
        </div>

        <div className="form-row">
          <Input
            label="Twitter/X"
            value={formData.twitterUrl}
            onChange={(e) => updateField('twitterUrl', e.target.value)}
            placeholder="https://twitter.com/yourcompany"
            icon={<ShareIcon size={16} />}
          />
          
          <Input
            label="Instagram"
            value={formData.instagramUrl}
            onChange={(e) => updateField('instagramUrl', e.target.value)}
            placeholder="https://instagram.com/yourcompany"
            icon={<ShareIcon size={16} />}
          />
        </div>

        <div className="form-row single">
          <Input
            label="Other Social Media"
            value={formData.otherSocialMedia}
            onChange={(e) => updateField('otherSocialMedia', e.target.value)}
            placeholder="YouTube, TikTok, or other social media links (comma-separated)"
            help="Any other social media profiles customers might ask about"
            icon={<ShareIcon size={16} />}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <FileTextIcon size={18} />
          Additional Information
        </h3>
        
        <div className="form-row single">
          <Textarea
            label="Anything Else?"
            value={formData.additionalInfo}
            onChange={(e) => updateField('additionalInfo', e.target.value)}
            placeholder="Any other important information, special requests, or unique aspects of your business that the assistant should know about..."
            rows={4}
            help="This is your opportunity to share anything else that would help personalize your assistant"
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
          <li>
            <strong>Social media:</strong> Include active profiles that customers might ask about
          </li>
          <li>
            <strong>Policies matter:</strong> Clear policies help the assistant handle customer concerns properly
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyDetailsForm; 