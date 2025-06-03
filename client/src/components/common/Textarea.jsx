import React from 'react';

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  help,
  disabled = false,
  maxLength,
  rows = 4,
  className = '',
  showCharCount = false,
  ...props
}) => {
  const textareaClasses = [
    'form-textarea',
    error ? 'error' : '',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-label',
    required ? 'required' : ''
  ].filter(Boolean).join(' ');

  const currentLength = value ? value.length : 0;
  const isNearLimit = maxLength && currentLength > maxLength * 0.8;

  return (
    <div className="form-group">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {(showCharCount || maxLength) && (
        <div className={`form-help ${isNearLimit ? 'text-warning' : ''}`}>
          {currentLength}{maxLength && ` / ${maxLength}`} characters
        </div>
      )}
      {error && <div className="form-error">{error}</div>}
      {help && !error && <div className="form-help">{help}</div>}
    </div>
  );
};

export default Textarea; 