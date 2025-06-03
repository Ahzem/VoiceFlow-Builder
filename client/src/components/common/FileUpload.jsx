import React, { useRef } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload.js';

// SVG Check Icon
const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const FileUpload = ({ 
  onFilesChange, 
  label = 'Upload Files',
  help = 'Drag and drop files here or click to browse',
  accept = '.pdf,.docx,.txt',
  multiple = true,
  required = false,
  error
}) => {
  const fileInputRef = useRef(null);
  const {
    files,
    isDragging,
    addFiles,
    removeFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop: originalHandleDrop,
    formatFileSize,
    getFilesForSubmission
  } = useFileUpload();

  // Custom drop handler that notifies parent
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragLeave(e); // Reset drag state
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const result = addFiles(droppedFiles);
      // Notify parent component immediately with the new files
      const newFiles = Array.from(droppedFiles);
      onFilesChange?.(newFiles);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      const result = addFiles(selectedFiles);
      // Notify parent component immediately with the new files
      const newFiles = Array.from(selectedFiles);
      onFilesChange?.(newFiles);
    }
  };

  // Handle click to open file dialog
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file removal
  const handleRemoveFile = (fileId) => {
    removeFile(fileId);
    // Get updated files list after removal
    const updatedFiles = files.filter(f => f.id !== fileId).map(f => f.file);
    onFilesChange?.(updatedFiles);
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

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)}</div>
              </div>
              
              <div className="file-status">
                {file.status === 'pending' && (
                  <span className="status-badge status-pending">Pending</span>
                )}
                {file.status === 'uploading' && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{file.progress}%</span>
                  </div>
                )}
                {file.status === 'completed' && (
                  <span className="status-badge status-success">
                    <CheckIcon size={14} /> Uploaded
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="status-badge status-error">Error</span>
                )}
              </div>
              
              <button
                type="button"
                className="file-remove"
                onClick={() => handleRemoveFile(file.id)}
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

export default FileUpload; 