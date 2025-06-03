import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  help,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const inputClasses = [
    'form-input',
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
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && <div className="form-error">{error}</div>}
      {help && !error && <div className="form-help">{help}</div>}
    </div>
  );
};

export default Input; 