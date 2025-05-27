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

  return (
    <div className="form-section">
      <h2 className="form-section-title">Configure Your Assistant</h2>
      
      <div className="form-row">
        <Input
          label="Assistant Name"
          value={formData.assistantName}
          onChange={(e) => updateField('assistantName', e.target.value)}
          placeholder="e.g., Sarah, Alex, Assistant"
          required
          error={errors.assistantName}
          help="This is how your assistant will introduce itself"
        />
        
        <Select
          label="Personality Type"
          value={formData.personality}
          onChange={(e) => updateField('personality', e.target.value)}
          options={PERSONALITY_TYPES}
          placeholder="Select personality"
          required
          error={errors.personality}
        />
      </div>

      <div className="form-row">
        <Select
          label="Primary Language"
          value={formData.language}
          onChange={(e) => updateField('language', e.target.value)}
          options={LANGUAGES}
          placeholder="Select language"
          required
          error={errors.language}
        />
      </div>

      <div className="form-section">
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Working Hours
        </h3>
        
        <div className="time-input-group">
          <Input
            label="Start Time"
            type="time"
            value={formData.workingHours.start}
            onChange={(e) => updateField('workingHours.start', e.target.value)}
            required
            error={errors.workingHoursStart}
          />
          
          <Input
            label="End Time"
            type="time"
            value={formData.workingHours.end}
            onChange={(e) => updateField('workingHours.end', e.target.value)}
            required
            error={errors.workingHoursEnd}
          />
          
          <Select
            label="Timezone"
            value={formData.workingHours.timezone}
            onChange={(e) => updateField('workingHours.timezone', e.target.value)}
            options={timezoneOptions}
            placeholder="Select timezone"
            required
            error={errors.timezone}
          />
        </div>
      </div>

      <div className="form-section">
        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
          Working Days
        </h3>
        <p style={{ color: 'var(--text-medium-gray)', marginBottom: 'var(--spacing-md)' }}>
          Select the days when your assistant should be available
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
    </div>
  );
};

export default AssistantConfigForm; 