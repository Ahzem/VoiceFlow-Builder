import { useState, useCallback } from 'react';
import { validateFile } from '../utils/validation.js';

export const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  // Add files to the upload queue
  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const errors = {};

    fileArray.forEach((file, index) => {
      const validation = validateFile(file);
      
      if (validation.isValid) {
        // Create file object with metadata
        const fileObj = {
          id: `${Date.now()}-${index}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'completed', // pending, uploading, completed, error
          progress: 100,
          uploadedAt: new Date()
        };
        validFiles.push(fileObj);
      } else {
        errors[`${file.name}-${index}`] = validation.errors;
      }
    });

    setFiles(prev => [...prev, ...validFiles]);
    setUploadErrors(prev => ({ ...prev, ...errors }));

    return {
      addedFiles: validFiles,
      errors: Object.keys(errors).length > 0 ? errors : null
    };
  }, []);

  // Remove file from upload queue
  const removeFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileId];
      return newErrors;
    });
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    setFiles([]);
    setUploadProgress({});
    setUploadErrors({});
  }, []);

  // Update file progress
  const updateProgress = useCallback((fileId, progress) => {
    setUploadProgress(prev => ({
      ...prev,
      [fileId]: progress
    }));

    // Update file status based on progress
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        let status = 'uploading';
        if (progress === 100) {
          status = 'completed';
        } else if (progress === 0) {
          status = 'pending';
        }

        return {
          ...file,
          progress,
          status,
          uploadedAt: progress === 100 ? new Date() : null
        };
      }
      return file;
    }));
  }, []);

  // Set file error
  const setFileError = useCallback((fileId, error) => {
    setUploadErrors(prev => ({
      ...prev,
      [fileId]: [error]
    }));

    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          status: 'error'
        };
      }
      return file;
    }));
  }, []);

  // Simulate file upload (replace with actual upload logic)
  const uploadFile = useCallback(async (fileObj) => {
    const { id } = fileObj;
    
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateProgress(id, progress);
      }
      
      return { success: true, fileId: id };
    } catch (error) {
      setFileError(id, error.message);
      return { success: false, error: error.message };
    }
  }, [updateProgress, setFileError]);

  // Upload all pending files
  const uploadAllFiles = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    const results = [];

    for (const file of pendingFiles) {
      const result = await uploadFile(file);
      results.push(result);
    }

    return results;
  }, [files, uploadFile]);

  // Handle drag and drop events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  // Get file statistics
  const getFileStats = useCallback(() => {
    const total = files.length;
    const completed = files.filter(f => f.status === 'completed').length;
    const pending = files.filter(f => f.status === 'pending').length;
    const uploading = files.filter(f => f.status === 'uploading').length;
    const errors = files.filter(f => f.status === 'error').length;
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return {
      total,
      completed,
      pending,
      uploading,
      errors,
      totalSize,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [files]);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Get files for form submission
  const getFilesForSubmission = useCallback(() => {
    return files.map(f => f.file);
  }, [files]);

  return {
    files,
    uploadProgress,
    uploadErrors,
    isDragging,
    addFiles,
    removeFile,
    clearFiles,
    updateProgress,
    setFileError,
    uploadFile,
    uploadAllFiles,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    getFileStats,
    formatFileSize,
    getFilesForSubmission
  };
}; 