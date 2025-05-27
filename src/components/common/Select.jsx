import React from 'react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  required = false,
  error,
  help,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const selectClasses = [
    'form-select',
    icon ? 'with-icon' : '',
    error ? 'error' : '',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-label',
    required ? 'required' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option 
              key={option.value || index} 
              value={option.value || option}
            >
              {option.label || option}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="form-error">{error}</div>}
      {help && !error && <div className="form-help">{help}</div>}
    </div>
  );
};

export default Select;