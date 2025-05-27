import React from 'react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import { PERSONALITY_TYPES, LANGUAGES, WORKING_DAYS } from '../../utils/constants.js';

const AssistantConfigForm = ({ formData, errors, updateField, toggleInArray }) => {
  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
  ];

  // SVG Icons for visual enhancement
  const BotIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  );

  const UserIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const MessageCircleIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );

  const ClockIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
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

  const GlobeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );

  return (
    <div className="enhanced-form-section">
      <div className="form-section-header">
        <div className="section-icon">
          <BotIcon size={24} />
        </div>
        <div className="section-title-content">
          <h2 className="form-section-title">Configure Your Assistant</h2>
          <p className="form-section-subtitle">
            Customize your voice assistant's personality, language, and availability to match your business needs
          </p>
        </div>
      </div>

      {/* Assistant Identity */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <UserIcon size={18} />
          Assistant Identity
        </h3>
        
        <div className="form-row">
          <Input
            label="Assistant Name"
            value={formData.assistantName}
            onChange={(e) => updateField('assistantName', e.target.value)}
            placeholder="e.g., Sarah, Alex, Assistant"
            required
            error={errors.assistantName}
            help="This is how your assistant will introduce itself to customers"
            icon={<BotIcon size={16} />}
          />
          
          <Select
            label="Personality Type"
            value={formData.personality}
            onChange={(e) => updateField('personality', e.target.value)}
            options={PERSONALITY_TYPES}
            placeholder="Select personality"
            required
            error={errors.personality}
            help="Choose the tone and style for customer interactions"
            icon={<MessageCircleIcon size={16} />}
          />
        </div>

        <div className="form-row single">
          <Select
            label="Primary Language"
            value={formData.language}
            onChange={(e) => updateField('language', e.target.value)}
            options={LANGUAGES}
            placeholder="Select language"
            required
            error={errors.language}
            help="The main language your assistant will use for conversations"
            icon={<GlobeIcon size={16} />}
          />
        </div>
      </div>

      {/* Working Hours */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <ClockIcon size={18} />
          Working Hours
        </h3>
        
        <div className="form-row">
          <Input
            label="Start Time"
            type="time"
            value={formData.workingHours.start}
            onChange={(e) => updateField('workingHours.start', e.target.value)}
            required
            error={errors.workingHoursStart}
            help="When your assistant becomes available each day"
            icon={<ClockIcon size={16} />}
          />
          
          <Input
            label="End Time"
            type="time"
            value={formData.workingHours.end}
            onChange={(e) => updateField('workingHours.end', e.target.value)}
            required
            error={errors.workingHoursEnd}
            help="When your assistant stops taking calls each day"
            icon={<ClockIcon size={16} />}
          />
        </div>

        <div className="form-row single">
          <Select
            label="Timezone"
            value={formData.workingHours.timezone}
            onChange={(e) => updateField('workingHours.timezone', e.target.value)}
            options={timezoneOptions}
            placeholder="Select timezone"
            required
            error={errors.timezone}
            help="Your business timezone for scheduling and availability"
            icon={<GlobeIcon size={16} />}
          />
        </div>
      </div>

      {/* Working Days */}
      <div className="form-subsection">
        <h3 className="subsection-title">
          <CalendarIcon size={18} />
          Working Days
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
          Select the days when your assistant should be available to handle customer calls
        </p>
        
        <div className="working-days-grid">
          {WORKING_DAYS.map((day) => (
            <label
              key={day}
              className={`day-checkbox ${formData.workingDays.includes(day) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={formData.workingDays.includes(day)}
                onChange={() => toggleInArray('workingDays', day)}
              />
              <span className="day-label">{day}</span>
            </label>
          ))}
        </div>
        
        {errors.workingDays && (
          <div className="form-error" style={{ marginTop: 'var(--spacing-sm)' }}>
            {errors.workingDays}
          </div>
        )}
      </div>

      {/* Success Tips */}
      <div className="form-tips-card">
        <div className="tips-header">
          <div className="tips-icon">💡</div>
          <h4>Configuration Tips</h4>
        </div>
        <ul className="tips-list">
          <li>
            <strong>Choose a memorable name:</strong> Pick something that fits your brand and is easy for customers to remember
          </li>
          <li>
            <strong>Match your brand tone:</strong> Professional for B2B, friendly for consumer services, or casual for lifestyle brands
          </li>
          <li>
            <strong>Set realistic hours:</strong> Ensure your working hours align with when customers expect support
          </li>
          <li>
            <strong>Consider time zones:</strong> If you serve multiple regions, choose hours that work for your main customer base
          </li>
          <li>
            <strong>Weekend availability:</strong> Consider if your business needs weekend support for better customer satisfaction
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AssistantConfigForm; 