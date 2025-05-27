import React, { useRef, useState } from 'react';
import { validateFile } from '../../utils/validation.js';

// SVG Check Icon
const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const SimpleFileUpload = ({ 
  onFilesChange, 
  label = 'Upload Files',
  help = 'Drag and drop files here or click to browse',
  accept = '.pdf,.docx,.txt',
  multiple = true,
  required = false,
  error,
  value = []
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.errors.join(', ')}`);
      }
    });

    if (errors.length > 0) {
      alert('Some files were rejected:\n' + errors.join('\n'));
    }

    // Combine with existing files
    const newFiles = [...value, ...validFiles];
    onFilesChange?.(newFiles);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Handle click to open file dialog
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    const newFiles = value.filter((_, i) => i !== index);
    onFilesChange?.(newFiles);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const dropZoneClasses = [
    'file-upload-zone',
    isDragging ? 'dragging' : '',
    error ? 'error' : ''
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
      
      <div
        className={dropZoneClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        <div className="file-upload-content">
          <div className="file-upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <div className="file-upload-text">
            <p className="file-upload-primary">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="file-upload-secondary">{help}</p>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="file-list">
          {value.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)}</div>
              </div>
              
              <div className="file-status">
                <span className="status-badge status-success">
                  <CheckIcon size={14} /> Ready
                </span>
              </div>
              
              <button
                type="button"
                className="file-remove"
                onClick={() => handleRemoveFile(index)}
                aria-label="Remove file"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default SimpleFileUpload; 